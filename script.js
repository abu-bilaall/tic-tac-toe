function GameBoard() {
  // hardcoding the 3x3 gameboard
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  // Method to get the board's state
  this.getBoard = function () {
    return board.map((row) => row.slice()); // Return a copy to prevent direct manipulation
  };

  this.isBoardSpaceFree = function (row, col) {
    if (board[row][col] === "") {
      return true;
    }

    return false;
  };

  // Method to set a piece on the board
  this.setPiece = function (row, col, piece) {
    if (this.isBoardSpaceFree(row, col)) {
      // Ensure the spot is empty
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
      ["", "", ""],
    ];
  };
}

function GameController() {
  // initiate players
  const players = [
    { name: "user", boardAvatar: "X" },
    { name: "anton", boardAvatar: "O" },
  ];

  // player selecting their name and avatar
  this.setPlayerCredentials = function (userName = "user", userAvatar = "X") {
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

    return `Dear ${userName}, you've selected ${userAvatar} as your board piece.`;
  };

  // returns player avatar
  this.getPlayerAvatar = function () {
    let currentPlayerIndex = players.findIndex(
      (player) => player.name === currentPlayer
    );
    return players[currentPlayerIndex].boardAvatar;
  };

  // player turns
  let currentPlayer = "";
  this.getPlayTurn = function () {
    currentPlayer =
      currentPlayer === players[0].name ? players[1].name : players[0].name;
    return currentPlayer;
  };

  // a simple game round
  this.playRound = function (row, col) {
    if (gameboard.getBoard()[row][col] !== "") {
      console.log("Invalid move! Cell is already occupied.");
      return;
    }

    let piece = players.find(
      (player) => player.name == currentPlayer
    ).boardAvatar;
    gameboard.setPiece(row, col, piece);
  };

  // automating anton's round
  this.generateComputerChoice = function () {
    let boardIndexes = ["00", "01", "02", "10", "11", "12", "20", "21", "22"];
    return boardIndexes[Math.floor(Math.random() * boardIndexes.length)];
  };

  // win/lose/draw logic
  const xWinSequence = "XXX";
  const oWinSequence = "OOO";

  function checkRow(sequence) {
    return gameboard.getBoard().some((row) => row.join("") === sequence);
  }

  function checkColumn(sequence) {
    // Loop through each column index and check if all values match the sequence
    const rows = 3,
      columns = 3,
      board = gameboard.getBoard();

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
    const board = gameboard.getBoard(),
      dimension = 3;

    let diag1Sequence = ""; // Top-left to bottom-right
    let diag2Sequence = ""; // Top-right to bottom-left

    // Checking the two diagonals explicitly
    for (let i = 0; i < dimension; i++) {
      diag1Sequence += board[i][i]; // Access first diagonal
      diag2Sequence += board[i][dimension - 1 - i]; // Access second diagonal
    }

    return diag1Sequence === sequence || diag2Sequence === sequence;
  }

  function checkGameResult() {
    // Win logic
    if (
      checkRow(xWinSequence) ||
      checkColumn(xWinSequence) ||
      checkDiagonals(xWinSequence)
    ) {
      return `${currentPlayer} wins`;
    }

    if (
      checkRow(oWinSequence) ||
      checkColumn(oWinSequence) ||
      checkDiagonals(oWinSequence)
    ) {
      return `${currentPlayer} wins`;
    }

    // Draw logic
    if (
      gameboard
        .getBoard()
        .flat()
        .every((cell) => cell !== "")
    ) {
      return "Draw";
    }
    // No result yet
    return null;
  }

  // reset game
  this.resetGame = function () {
    gameboard.resetBoard();
    currentPlayer = ""; // reset currentPlayer
    return "Game over. Let's play again.";
  };

  // gameOver
  this.isGameOver = function () {
    const result = checkGameResult();

    if (result) {
      // return true;
      return result;
    }

    return false;
  };

  // returns game result
  this.printGameResult = function () {
    return checkGameResult();
  };
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

// handling player choice of game piece
const info = document.querySelector("#info");
const pieces = document.querySelectorAll(".pieces");
pieces.forEach((piece) => {
  piece.addEventListener("click", () => {
    let playerCredentials = gamecontroller.setPlayerCredentials(
      "user",
      piece.getAttribute("id").toUpperCase()
    );
    removeChildren(info);

    let infoText = document.createElement("div");
    infoText.setAttribute("id", "info-text");
    infoText.textContent = playerCredentials;
    info.appendChild(infoText);

    setTimeout(() => {
      infoText.textContent = "Let's begin!";
    }, 2000);
    setTimeout(() => {
      infoText.textContent = `${gamecontroller.getPlayTurn()}, it's your turn.`;
    }, 4000);
  });
});

// handling events on the game board
const gameBoard = document.querySelector("#game-board");
gameBoard.addEventListener("click", (event) => {
  let space = event.target;
  let spaceIndex = space.dataset.index.split("");
  let [row, column] = spaceIndex.map(Number);

  // updating board w/ player's move
  space.textContent = gamecontroller.getPlayerAvatar();
  gamecontroller.playRound(row, column);

  // Dispatch a custom event to trigger turn processing
  gameBoard.dispatchEvent(new Event("turnUpdate"));
});

// Handling turns and anton moves
gameBoard.addEventListener("turnUpdate", () => {
  if (gamecontroller.isGameOver()) {
    setTimeout(() => alert(`${gamecontroller.printGameResult()}`), 1000);

    setTimeout(() => alert(`${gamecontroller.resetGame()}`), 2000);

    setTimeout(() => {window.location.reload()}, 3000);
  } else {
    let currentPlayer = gamecontroller.getPlayTurn();
    let infoText = document.querySelector("#info-text");

    infoText.textContent = `${currentPlayer}, it's your turn.`;

    // anton's move
    if (currentPlayer === "anton") {
      setTimeout(() => {
        let boardIndex = gamecontroller.generateComputerChoice();
        let [aiRow, aiCol] = boardIndex.split("").map(Number);

        while (!gameboard.isBoardSpaceFree(aiRow, aiCol)) {
          boardIndex = gamecontroller.generateComputerChoice();
          [aiRow, aiCol] = boardIndex.split("").map(Number);
        }

        let aiSpace = document.querySelector(`[data-index="${aiRow}${aiCol}"]`);
        aiSpace.textContent = gamecontroller.getPlayerAvatar();
        gamecontroller.playRound(aiRow, aiCol);

        // Trigger the next turn update
        gameBoard.dispatchEvent(new Event("turnUpdate"));
      }, 2000);
    }
  }
});
