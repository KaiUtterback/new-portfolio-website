const ticTacToeContainer = document.getElementById('tic-tac-toe');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';

function renderBoard() {
    ticTacToeContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < 3; j++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = board[i * 3 + j];
            cellElement.addEventListener('click', () => handleCellClick(i * 3 + j));
            row.appendChild(cellElement);
        }
        ticTacToeContainer.appendChild(row);
    }
}

function handleCellClick(index) {
    if (board[index] === '' && currentPlayer === 'X') {
        board[index] = currentPlayer;
        renderBoard();
        if (!checkWinner()) {
            currentPlayer = 'O';
            setTimeout(computerMove, 500);
        }
    }
}

function computerMove() {
    let availableCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableCells.push(i);
        }
    }

    if (availableCells.length > 0) {
        let randomIndex = Math.floor(Math.random() * availableCells.length);
        board[availableCells[randomIndex]] = 'O';
        renderBoard();
        checkWinner();
        currentPlayer = 'X';
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            alert(`Player ${board[a]} wins!`);
            resetGame();
            return true;
        }
    }
    if (!board.includes('')) {
        alert('Draw!');
        resetGame();
        return true;
    }
    return false;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    renderBoard();
}

renderBoard();
