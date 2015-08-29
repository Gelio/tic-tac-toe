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