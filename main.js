// ---------------- Gameboard Module ----------------
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    // Get a copy of the board
    // Bracket is used to create a new array instead of returning reference
    const getBoard = () => [...board]; // return a copy
    const setSymbol = (index, symbol) => {
        if (board[index] !== "") return false;
        board[index] = symbol;
        return true;
    };
    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, setSymbol, reset };
})();

// ---------------- Player Factory ----------------
const Player = (name, symbol) => ({ name, symbol });

// ---------------- GameController Module ----------------
const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");

    let currentPlayer = player1;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playRound = (index) => {
        if (gameOver) return false; // game over

        const success = Gameboard.setSymbol(index, currentPlayer.symbol);
        if (!success) return false; // if cell is occupied

        if (checkWin(currentPlayer.symbol)) {
        gameOver = true;
        return { winner: currentPlayer.name };
        }

        if (checkTie()) {
        gameOver = true;
        return { tie: true };
        }

        switchPlayer();
        return { nextPlayer: currentPlayer.name };
    };

    const checkWin = (symbol) => {
        const board = Gameboard.getBoard();
        const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
        ];

        return wins.some(combo => combo.every(index => board[index] === symbol));
    };

    const checkTie = () => Gameboard.getBoard().every(cell => cell !== "");

    const getCurrentPlayer = () => currentPlayer.name;

    const reset = () => {
        Gameboard.reset();
        currentPlayer = player1;
        gameOver = false;
    };

    return { playRound, getCurrentPlayer, reset };
})();

// ---------------- DisplayController Module ----------------
const DisplayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart");

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
        cell.textContent = board[index];
        });
    };

    const setMessage = (text) => {
        message.textContent = text;
    };

    // Handle clicks
    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            const index = Number(cell.dataset.index);
            const result = GameController.playRound(index);
            renderBoard();

            if (!result) return; // invalid move, do nothing

            if (result.winner) {
                setMessage(`${result.winner} wins!`);
            } else if (result.tie) {
                setMessage(`It's a tie!`);
            } else {
                setMessage(`${result.nextPlayer}'s turn`);
            }
        });
    });

    restartButton.addEventListener("click", () => {
        GameController.reset();
        renderBoard();
        setMessage(`${GameController.getCurrentPlayer()}'s turn`);
    });

    // Initial render
    renderBoard();
    setMessage(`${GameController.getCurrentPlayer()}'s turn`);
})();
