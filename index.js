import fs from 'fs';
import fastCSV from 'fast-csv';
import { arrayIsValidTable, rotateTable } from './engine.js';

/**
 * @returns {string | null}
 */
const readInputFilePath = () => process.argv[2] || null;

/**
 * Create a read stream from input file
 * @returns {fs.ReadStream}
 */
const inputFileReadStream = () => {
    const inputPath = readInputFilePath();

    if (!inputPath || !fs.existsSync(inputPath)) {
        throw new Error('can not read input file');
    }

    return fs.createReadStream(inputPath);
};

const start = () => {
    inputFileReadStream()
        .pipe(fastCSV.parse({ headers: true }))
        .on('error', (error) => {
            console.error({
                state: 'parsing',
                error: error.message,
                status: 'failed',
            });
        })
        .pipe(fastCSV.format({ headers: true }))
        .on('error', (error) => {
            console.error({
                state: 'formatting',
                error: error.message,
                status: 'failed',
            });
        })
        .transform((row, next) => {
            try {
                const tableData = JSON.parse(row.json);
                const tableIsValid = arrayIsValidTable(tableData.length || 0);
                const result = {
                    id: row.id,
                    json: '[]',
                    is_valid: tableIsValid,
                };
                if (tableIsValid) {
                    const reverted = rotateTable(tableData);
                    result.json = JSON.stringify(reverted);
                }
                next(null, result);
            } catch (error) {
                next(null, { id: row.id, json: '[]', is_valid: false });
            }
        })
        .pipe(process.stdout)
        .on('error', (error) => {
            console.error({
                state: 'writing',
                error: error.message,
                status: 'failed',
            });
        });
};

start();
