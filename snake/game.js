/**
 * Snake Game
 * A classic snake game implementation using HTML5 Canvas
 * Controls: Arrow keys or WASD to move the snake
 * Objective: Eat food to grow and avoid hitting walls or yourself
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const directionsOverlay = document.getElementById('directionsOverlay');
const bestScoreElement = document.getElementById('bestScore');
const lastScoreElement = document.getElementById('lastScore');

const GRID_SIZE = 30;
const TILE_COUNT = 20;
const GAME_SPEED = 100;

canvas.width = GRID_SIZE * TILE_COUNT;
canvas.height = GRID_SIZE * TILE_COUNT;

let score = 0;
let velocityX = 0;
let velocityY = 0;
let snake = [];
let foodX, foodY;

let bestScore = parseInt(localStorage.getItem('snakeBestScore')) || 0;
let lastScore = parseInt(localStorage.getItem('snakeLastScore')) || 0;
bestScoreElement.textContent = bestScore;
lastScoreElement.textContent = lastScore;

function gameLoop() {
    if (checkGameOver()) {
        showGameOver();
        return;
    }

    updateSnake();
    clearCanvas();
    drawFood();
    drawSnake();
    setTimeout(gameLoop, 100);
}

function updateSnake() {
    const newHead = {
        x: snake[0].x + velocityX,
        y: snake[0].y + velocityY
    };
    
    snake = [newHead, ...snake];
    
    if (newHead.x === foodX && newHead.y === foodY) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function checkGameOver() {
    const nextHead = {
        x: snake[0].x + velocityX,
        y: snake[0].y + velocityY
    };
    
    if (nextHead.x < 0 || nextHead.x >= TILE_COUNT ||
        nextHead.y < 0 || nextHead.y >= TILE_COUNT) {
        return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === nextHead.x && snake[i].y === nextHead.y) {
            return true;
        }
    }
    return false;
}

function handleMovement(key) {
    switch (key) {
        case 'arrowup':
        case 'w':
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'arrowdown':
        case 's':
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'arrowleft':
        case 'a':
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'arrowright':
        case 'd':
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
}

function isValidMovementKey(key) {
    return ['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd'].includes(key);
}

function generateFood() {
    let newPosition;
    let overlapsWithSnake;
    
    do {
        newPosition = getRandomGridPosition();
        overlapsWithSnake = snake.some(segment => 
            segment.x === newPosition.x && segment.y === newPosition.y
        );
    } while (overlapsWithSnake);
    
    foodX = newPosition.x;
    foodY = newPosition.y;
}

function getRandomGridPosition() {
    return {
        x: Math.floor(Math.random() * (TILE_COUNT - 4)) + 2,
        y: Math.floor(Math.random() * (TILE_COUNT - 4)) + 2
    };
}

function clearCanvas() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#0f0f0f';
    ctx.lineWidth = 1;
    for (let i = 0; i < TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        drawSnakeSegment(segment.x, segment.y, index === 0);
    });
}

function drawSnakeSegment(x, y, isHead) {
    ctx.fillStyle = '#33ff33';
    
    ctx.fillRect(
        x * GRID_SIZE + 1, 
        y * GRID_SIZE + 1, 
        GRID_SIZE - 2, 
        GRID_SIZE - 2
    );

    ctx.fillStyle = '#66ff66';
    ctx.fillRect(
        x * GRID_SIZE + 1,
        y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        2
    );
    ctx.fillRect(
        x * GRID_SIZE + 1,
        y * GRID_SIZE + 1,
        2,
        GRID_SIZE - 2
    );

    if (isHead) {
        drawEyes(x, y);
    }
}

function drawEyes(x, y) {
    const direction = {
        x: velocityX,
        y: velocityY
    };

    const leftEye = { x: 0, y: 0 };
    const rightEye = { x: 0, y: 0 };
    
    if (direction.x === 1) {
        leftEye.x = GRID_SIZE - 8;
        rightEye.x = GRID_SIZE - 8;
        leftEye.y = 6;
        rightEye.y = GRID_SIZE - 10;
    } else if (direction.x === -1) {
        leftEye.x = 6;
        rightEye.x = 6;
        leftEye.y = 6;
        rightEye.y = GRID_SIZE - 10;
    } else if (direction.y === 1) {
        leftEye.x = 6;
        rightEye.x = GRID_SIZE - 10;
        leftEye.y = GRID_SIZE - 8;
        rightEye.y = GRID_SIZE - 8;
    } else {
        leftEye.x = 6;
        rightEye.x = GRID_SIZE - 10;
        leftEye.y = 6;
        rightEye.y = 6;
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(
        x * GRID_SIZE + leftEye.x,
        y * GRID_SIZE + leftEye.y,
        4, 4
    );
    ctx.fillRect(
        x * GRID_SIZE + rightEye.x,
        y * GRID_SIZE + rightEye.y,
        4, 4
    );
}

function drawFood() {
    const x = foodX * GRID_SIZE;
    const y = foodY * GRID_SIZE;
    
    // Main apple body (red circle)
    ctx.beginPath();
    ctx.fillStyle = '#ff0000';
    ctx.arc(
        x + GRID_SIZE/2,
        y + GRID_SIZE/2,
        GRID_SIZE/2 - 4,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Leaf (green)
    ctx.beginPath();
    ctx.fillStyle = '#2d5e1e';
    ctx.moveTo(x + GRID_SIZE/2, y + 4);
    ctx.quadraticCurveTo(
        x + GRID_SIZE/2 + 5,
        y + 2,
        x + GRID_SIZE/2 + 7,
        y + 6
    );
    ctx.quadraticCurveTo(
        x + GRID_SIZE/2,
        y + 4,
        x + GRID_SIZE/2,
        y + 4
    );
    ctx.fill();
    
    // Stem (brown)
    ctx.fillStyle = '#4a3728';
    ctx.fillRect(
        x + GRID_SIZE/2 - 1,
        y + 2,
        2,
        4
    );
}

function startOrRestartGame(key) {
    if (isValidMovementKey(key)) {
        directionsOverlay.classList.remove('active');
        gameOverOverlay.classList.remove('active');
        resetGame();
        handleMovement(key);
    }
}

function resetGame() {
    const initialPositions = getInitialPositions();
    snake = [initialPositions.snakePos];
    foodX = initialPositions.foodPos.x;
    foodY = initialPositions.foodPos.y;
    
    velocityX = 0;
    velocityY = 0;
    score = 0;
    scoreElement.textContent = score;
    
    gameOverOverlay.classList.remove('active');
    gameLoop();
}

function showGameOver() {
    lastScore = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('snakeBestScore', bestScore);
    }
    localStorage.setItem('snakeLastScore', lastScore);
    
    bestScoreElement.textContent = bestScore;
    lastScoreElement.textContent = lastScore;
    
    gameOverOverlay.classList.add('active');
}

function getInitialPositions() {
    const snakePos = getRandomGridPosition();
    
    let foodPos;
    do {
        foodPos = getRandomGridPosition();
    } while (foodPos.x === snakePos.x && foodPos.y === snakePos.y);
    
    return { snakePos, foodPos };
}

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (directionsOverlay.classList.contains('active') || 
        gameOverOverlay.classList.contains('active')) {
        startOrRestartGame(key);
        return;
    }

    handleMovement(key);
});

const initialPositions = getInitialPositions();
snake = [initialPositions.snakePos];
foodX = initialPositions.foodPos.x;
foodY = initialPositions.foodPos.y;