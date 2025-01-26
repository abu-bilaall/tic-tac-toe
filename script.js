function Gameboard() {
    // hardcoding the 3x3 gameboard
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    // Method to get the board's state
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

function GameController() {
    // initiate players
    const players = [
        { name: 'user', boardAvatar: "X" },
        { name: 'anton', boardAvatar: "O" }
    ];

    // player selecting their name and avatar
    this.setPlayerCredentials = function (userName = 'user', userAvatar = "X") {
        console.log(`Dear ${userName}, you've selected ${userAvatar} as your board piece.`);

        if (userAvatar !== "X" && userAvatar !== "O") {
            console.log("Invalid avatar selected. Please choose 'X' or 'O'.");
            return;
        }

        if (userAvatar === "O") {
            players[0].name = userName;
            players[0].boardAvatar = userAvatar;

            players[1].boardAvatar = "X";
        }
    };

    // player turns
    let currentPlayer = players[0].name;
    this.getPlayTurn = function () {
        currentPlayer = currentPlayer === players[0].name ? players[1].name : players[0].name;
        console.log(`${currentPlayer}, it's your turn.\n`);
        return currentPlayer;
    }

    // a simple game round
    this.playRound = function (row, col) {
        if (gameboard.getBoard()[row][col] !== "") {
            console.log("Invalid move! Cell is already occupied.");
            return;
        }

        let piece = players.find((player) => player.name == currentPlayer).boardAvatar;
        gameboard.setPiece(row, col, piece); // set X on the board for user
    }

    // win/lose/draw logic
}
// initiate board
const gameboard = new Gameboard();

// testing GameController
const gamecontrol = new GameController();

// Initial state
console.log("Initial Board:");
gameboard.printBoard();

// set player credentials
gamecontrol.setPlayerCredentials("w0z");

// Set pieces
gamecontrol.playRound(0, 0);
// gamecontrol.getPlayTurn();
// gamecontrol.playRound(1, 1);

// Display the board after moves
console.log("Board After Moves:");
gameboard.printBoard();

// Get the board state
console.log("Board State:");
console.log(gameboard.getBoard());