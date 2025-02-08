/**
 * TODOS
 * finish the game logic
 * DOM shenangians
 */
function GameBoard() {
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

    // Resets board
    this.resetBoard = function () {
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
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

        if (userAvatar !== "X" && userAvatar !== "O") {
            console.log("Invalid avatar selected. Please choose 'X' or 'O'.");
            return;
        }

        if (userAvatar === "O") {
            players[0].name = userName;
            players[0].boardAvatar = userAvatar;

            players[1].boardAvatar = "X";
        } else {
            players[0].name = userName;
        }

        return (`Dear ${userName}, you've selected ${userAvatar} as your board piece.`);
    };

    // player turns
    let currentPlayer = "";
    this.getPlayTurn = function () {
        currentPlayer = currentPlayer === players[0].name ? players[1].name : players[0].name;
        console.log(`${currentPlayer}, it's your turn.\n`);
        return `${currentPlayer}, it's your turn.`;
    }

    // a simple game round
    this.playRound = function (row, col) {
        if (gameboard.getBoard()[row][col] !== "") {
            console.log("Invalid move! Cell is already occupied.");
            return;
        }

        let piece = players.find((player) => player.name == currentPlayer).boardAvatar;
        gameboard.setPiece(row, col, piece);
    }

    // win/lose/draw logic
    const xWinSequence = "XXX";
    const oWinSequence = "OOO";

    function checkRow(sequence) {
        return gameboard.getBoard().some(row => row.join('') === sequence);
    }

    function checkColumn(sequence) {
        // Loop through each column index and check if all values match the sequence
        const rows = 3, columns = 3, board = gameboard.getBoard();

        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            let columnSequence = "";

            for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
                columnSequence += board[rowIndex][columnIndex];
            }

            if (columnSequence === sequence) {
                return true; // Column matches the sequence
            }
        }

        return false; // No matching column found
    }

    function checkDiagonals(sequence) {
        const board = gameboard.getBoard(), dimension = 3;

        let diag1Sequence = ""; // Top-left to bottom-right
        let diag2Sequence = ""; // Top-right to bottom-left

        // Checking the two diagonals explicitly
        for (let i = 0; i < dimension; i++) {
            diag1Sequence += board[i][i]; // Access first diagonal
            diag2Sequence += board[i][dimension - 1 - i]; // Access second diagonal
        }

        return (diag1Sequence === sequence || diag2Sequence === sequence);
    }


    function setGameResult() {
        // Win logic
        if (checkRow(xWinSequence) || checkColumn(xWinSequence) || checkDiagonals(xWinSequence)) {
            return `${players[0].name} wins`;
        }
        if (checkRow(oWinSequence) || checkColumn(oWinSequence) || checkDiagonals(oWinSequence)) {
            return `${players[1].name} wins`;
        }

        // Draw logic
        if (gameboard.getBoard().flat().every(cell => cell !== "")) {
            return "Draw";
        }
        // No result yet
        return null;
    }

    // reset game
    this.resetGame = function () {
        gameboard.resetBoard();
        currentPlayer = ""; // reset currentPlayer
        console.log("Game reset. Let's play again.");
    }

    // gameOver
    this.gameOver = function () {
        const result = setGameResult();
        
        // 1. Check if a player has won
        if (result) {
            console.log(`Game Over! ${currentPlayer} wins!`);
            // this.resetGame();
            console.log ({ status: "win", winner: currentPlayer });
            return { status: "win", winner: currentPlayer };
        }

        // 2. Check if the game is a draw
        const isDraw = gameboard.getBoard().every(row => row.every(cell => cell !== ""));
        if (isDraw) {
            console.log("Game Over! It's a draw!");
            // this.resetGame();
            console.log({ status: "draw", winner: null });
            return { status: "draw", winner: null };
        }

        // 3. If no win or draw, game continues
        console.log({ status: "ongoing"} );
        return { status: "ongoing" };
    }

    // gameplay
    this.checkGameState = function () {
        let result = setGameResult();
        console.log(result);
    }
}

// initiate board and control constructor
const gameboard = new GameBoard();
const gamecontroller = new GameController();

/* DOM implementation */
function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createElement(element) {
    return document.createElement(element);
}

// handling player choice of game piece
const info = document.querySelector('#info');
const pieces = document.querySelectorAll('.pieces');
pieces.forEach((piece) => {
    piece.addEventListener('click', () => {
        let playerCredentials = gamecontroller.setPlayerCredentials('User', piece.getAttribute('id').toUpperCase());
        removeChildren(info);

        let infoText = document.createElement('div');
        infoText.setAttribute('id', 'info-text');
        infoText.textContent = playerCredentials;
        info.appendChild(infoText);

        setTimeout(() => {infoText.textContent = "Let's begin!"}, 2000);
        setTimeout(() => {infoText.textContent = gamecontroller.getPlayTurn()}, 4000);
    });
});

