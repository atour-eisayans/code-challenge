/**
 * An array is called valid which its length is a perfect square integer
 * @param {number} arrayLength length of the array
 * @returns 
 */
export const arrayIsValidTable = (arrayLength) => {
    const x = Math.round(Math.sqrt(arrayLength));

    return x * x === arrayLength;
};

/**
 * Turns a simple array into a array of rows.
 * 
 * @param {[number]} softArray
 * @example [1,2,3,4] => [ [1,2], [3,4] ]
 * @returns {[[number]]}
 */
const splitArrayToRows = (softArray) => {
    if (softArray.length === 1) {
        return softArray;
    }
    const dim = Math.sqrt(softArray.length);
    const result = new Array(dim);
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (!result[i]) result[i] = [];
            result[i].push(softArray[i * dim + j]);
        }
    }

    return result;
};

/**
 * function to rotate a table represented in a simple array
 * @param {[number]} array ex.: [1,2,3,4]
 * @returns {[number]}
 */
export const rotateTable = (softArray) => {
    const table = splitArrayToRows(softArray);
    const dim = table.length;

    if (dim === 1) {
        return table;
    }

    let rowStart = 0;
    let rowEnd = dim;
    let colStart = 0;
    let colEnd = dim;

    while ((rowStart < rowEnd && colStart < colEnd)) {
        let prev = table[rowStart + 1][colStart];
        
        for (let i = colStart; i < colEnd; i++) {
            [table[rowStart][i], prev] = [prev, table[rowStart][i]];
        }
        rowStart++;

        for (let i = rowStart; i < rowEnd; i++) {
            [table[i][colEnd - 1], prev] = [prev, table[i][colEnd - 1]];
        }
        colEnd--;

        for (let i = colEnd - 1; i >= colStart; i--) {
            [table[rowEnd - 1][i], prev] = [prev, table[rowEnd - 1][i]];
        }
        rowEnd--;

        for (let i = rowEnd - 1; i >= rowStart; i--) {
            [table[i][colStart], prev] = [prev, table[i][colStart]];
        }
        colStart++;

        if (rowStart === rowEnd - 1 && colStart === colEnd - 1) break;
    }
    
    return table.flat();
};
