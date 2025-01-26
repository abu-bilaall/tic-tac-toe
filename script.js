function Gameboard() {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    // Method to get the board state
    this.getBoard = function () {
        return board.map(row => row.slice()); // Return a copy to prevent direct manipulation
    };

    // Method to set a piece on the board
    this.setPiece = function (row, col, piece) {
        if (board[row][col] === "") { // Ensure the spot is empty
            board[row][col] = piece;
            return true; // Success
        }
        return false; // Spot already taken
    };

    // Method to display the board in the console (for debugging)
    this.printBoard = function () {
        board.forEach(row => console.log(row.join(" | ")));
        console.log("\n");
    };
}

// testing
const gameboard = new Gameboard();

// Initial state
console.log("Initial Board:");
gameboard.printBoard();

// Set pieces
gameboard.setPiece(0, 0, "X");
gameboard.setPiece(1, 1, "O");
gameboard.setPiece(0, 0, "X"); // Attempt to overwrite (should fail)

// Display the board after moves
console.log("Board After Moves:");
gameboard.printBoard();

// Get the board state
console.log("Board State:");
console.log(gameboard.getBoard());
