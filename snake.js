let canvas = document.getElementById('snake');
let context = canvas.getContext('2d');
let box = 20;
let snake = [];
snake[0] = { x: 15 * box, y: 15 * box };
let direction = '';
let food = {
    x: Math.floor(Math.random() * 29 + 1) * box,
    y: Math.floor(Math.random() * 29 + 1) * box
};
let game;

document.getElementById('start-snake').addEventListener('click', () => {
    clearInterval(game);
    game = setInterval(draw, 100);
    disableScroll();
    document.getElementById('start-snake').classList.add('active');
    document.getElementById('stop-snake').classList.remove('active');
});
document.getElementById('stop-snake').addEventListener('click', () => {
    clearInterval(game);
    enableScroll();
    document.getElementById('stop-snake').classList.add('active');
    document.getElementById('start-snake').classList.remove('active');
});

document.addEventListener('keydown', setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function draw() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, 30 * box, 30 * box);

    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = i === 0 ? 'green' : 'white';
        context.fillRect(snake[i].x, snake[i].y, box, box);
        context.strokeStyle = 'red';
        context.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * 29 + 1) * box,
            y: Math.floor(Math.random() * 29 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (
        snakeX < 0 ||
        snakeX >= 30 * box ||
        snakeY < 0 ||
        snakeY >= 30 * box ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert('Game Over');
        enableScroll();
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function disableScroll() {
    document.body.style.overflow = 'hidden';
}

function enableScroll() {
    document.body.style.overflow = 'auto';
}
