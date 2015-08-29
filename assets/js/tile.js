// Tile class
function Tile(row, column) {
    if(column === undefined) {
        this.row = Math.floor(row/3);
        this.column = row%3;
        this.number = row;
    }
    else {
        this.row = row;
        this.column = column;
        this.number = row*3 + column;
    }
}

// Winning positions
var winningPositionsArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];