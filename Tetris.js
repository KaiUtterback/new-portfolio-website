const tetrisCanvas = document.getElementById('tetris');
const tetrisContext = tetrisCanvas.getContext('2d');

// Set the canvas dimensions
tetrisCanvas.width = 320;  // Set the width of the canvas
tetrisCanvas.height = 640; // Set the height of the canvas

tetrisContext.scale(20, 20); // Adjust the scaling for the blocks

function tetrisArenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function tetrisCollide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function tetrisCreateMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function tetrisCreatePiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function tetrisDrawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                tetrisContext.fillStyle = tetrisColors[value];
                tetrisContext.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}

function tetrisDraw() {
    tetrisContext.clearRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);
    tetrisDrawMatrix(arena, {x: 0, y: 0});
    tetrisDrawMatrix(player.matrix, player.pos);
}

function tetrisMerge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function tetrisRotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function tetrisPlayerDrop() {
    player.pos.y++;
    if (tetrisCollide(arena, player)) {
        player.pos.y--;
        tetrisMerge(arena, player);
        tetrisPlayerReset();
        tetrisArenaSweep();
        tetrisUpdateScore();
    }
    dropCounter = 0;
}

function tetrisPlayerMove(offset) {
    player.pos.x += offset;
    if (tetrisCollide(arena, player)) {
        player.pos.x -= offset;
    }
}

function tetrisPlayerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = tetrisCreatePiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (tetrisCollide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        tetrisUpdateScore();
    }
}

function tetrisPlayerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    tetrisRotate(player.matrix, dir);
    while (tetrisCollide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            tetrisRotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function tetrisUpdate(time = 0) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        tetrisPlayerDrop();
    }

    lastTime = time;

    tetrisDraw();
    requestAnimationFrame(tetrisUpdate);
}

function tetrisUpdateScore() {
    document.getElementById('score').innerText = player.score;
}

const tetrisColors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const arena = tetrisCreateMatrix(16, 32); // Adjusted width and height for better fitting

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        tetrisPlayerMove(-1);
    } else if (event.keyCode === 39) {
        tetrisPlayerMove(1);
    } else if (event.keyCode === 40) {
        tetrisPlayerDrop();
    } else if (event.keyCode === 38) { // Up arrow for rotation
        tetrisPlayerRotate(1);
    }
    // Prevent the default action for the arrow keys
    if ([37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault();
    }
});

document.getElementById('start-tetris').addEventListener('click', () => {
    console.log("Start button clicked"); // Debug statement
    tetrisPlayerReset();
    tetrisUpdateScore();
    lastTime = 0;
    dropCounter = 0;
    requestAnimationFrame(tetrisUpdate);
});

console.log("Tetris script loaded"); // Debug statement
