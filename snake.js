const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

const gameField = new Image();
gameField.src = "image/snakeField.png";

const food = new Image();
food.src = "image/food.png";

const snakeView = new Image();
snakeView.src = "image/snake.png";

const boxLength = 32;
let score = 0;
let record = 0;

const localStorageRecordKey = 'snakeGameRecord';

// Check for existing record in localStorage
if (localStorage.getItem(localStorageRecordKey)) {
    record = parseInt(localStorage.getItem(localStorageRecordKey), 10);
}

const playField = {
    width: 17,
    height: 15,
    dimensions: 18,
}
const extraPlayArea = {
    width: playField.dimensions - playField.width,
    height: playField.dimensions - playField.height,
};

// Initialize snake food at random position
let snakefood = {
    x: Math.floor((Math.random() * playField.width + extraPlayArea.width)) * boxLength,
    y: Math.floor((Math.random() * playField.height + extraPlayArea.height)) * boxLength,
};

// Initial snake position
const startSnakeXpos = 9;
const startSnakeYpos = 10;

let snake = [];
snake[0] ={
    x: startSnakeXpos * boxLength,
    y: startSnakeYpos * boxLength,
};

document.addEventListener("keydown", direction);

//JavaScript Key Code
const KEY_CODES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};

// Handle key presses
let dir;
function direction(event){
    if((event.keyCode === KEY_CODES.LEFT && dir !=="right") || event.key === 'a')
        dir = "left";
    else if((event.keyCode === KEY_CODES.UP && dir !=="down") || event.key === 'w')
        dir = "up";
    else if((event.keyCode === KEY_CODES.RIGHT && dir !=="left") || event.key === 'd')
        dir = "right";
    else if((event.keyCode === KEY_CODES.DOWN && dir !=="up") || event.key === 's')
        dir = "down";
}

// Check for collision with the tail
function eatTail(head, snakeTail){
    for (let i = 0; i < snakeTail.length; i++) {
        if(head.x === snakeTail[i].x && head.y === snakeTail[i].y) {
            handleGameOver();
        }
    }
}

// Draw the game on the canvas
function drawSnakeGame() {
    drawBackground();
    drawFood();
    drawSnake();
    drawScore();
    updateSnakePosition();
}

function drawBackground() {
    ctx.drawImage(gameField, 0, 0);
}

function drawFood() {
    ctx.drawImage(food, snakefood.x, snakefood.y);
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            ctx.drawImage(snakeView, snake[i].x, snake[i].y, boxLength, boxLength);
        } else {
            drawSnakeSegment(snake[i].x, snake[i].y);
        }
    }
}

function drawSnakeSegment(x, y) {
    ctx.fillStyle = snakeColor;
    ctx.fillRect(x, y, boxLength, boxLength);
}

function drawScore() {
    drawText(score, "yellow", "60px", boxLength * textCoordinates.score.x, boxLength * textCoordinates.score.y);
    drawText("Record: " + record, "pink", "40px", boxLength * textCoordinates.record.x, boxLength * textCoordinates.record.y);
}

function updateSnakePosition() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    handleFoodCollision(snakeX, snakeY);

    if (checkCollision(snakeX, snakeY)) {
        handleGameOver();
    }

    moveSnake(snakeX, snakeY);
    eatTail();
}

function handleFoodCollision(snakeX, snakeY) {
    if (snakeX === snakefood.x && snakeY === snakefood.y) {
        increaseScore();
        updateRecord();
        generateNewFoodPosition();
    } else {
        snake.pop();
    }
}

function increaseScore() {
    score++;
}

function updateRecord() {
    if (score > record) {
        record = score;
        localStorage.setItem(localStorageRecordKey, record);
    }
}

function generateNewFoodPosition() {
    snakefood = {
        x: Math.floor((Math.random() * playField.width + extraPlayArea.width)) * boxLength,
        y: Math.floor((Math.random() * playField.height + extraPlayArea.height)) * boxLength,
    };
}

function checkCollision(snakeX, snakeY) {
    return (
        snakeX < boxLength ||
        snakeX > boxLength * playField.width ||
        snakeY < extraPlayArea.height * boxLength ||
        snakeY > boxLength * playField.width
    );
}

function moveSnake(snakeX, snakeY) {
    if (dir === "left") snakeX -= boxLength;
    if (dir === "right") snakeX += boxLength;
    if (dir === "up") snakeY -= boxLength;
    if (dir === "down") snakeY += boxLength;

    let newSnakeLength = {
        x: snakeX,
        y: snakeY,
    };

    eatTail(newSnakeLength, snake);
    snake.unshift(newSnakeLength);
}

function drawText(text, color, size, x, y) {
    ctx.fillStyle = color;
    ctx.font = size + " Arial";
    ctx.fillText(text, x, y);
}

const textCoordinates = {
    score: {
        x: 2,
        y: 1.8,
    },
    record: {
        x: 10,
        y: 1.8,
    },
}

// Reload the game
const reload = () => {
    clearInterval(game);
    location.reload();
};

// Handle game over
const handleGameOver = () => {
    clearInterval(game);
    alert( `You have lost☠️\nJust try again😎\nYour score ${score} 👏\nYour record ${record} 💪`);
    reload();
};

// Reset the record
const resetRecord = () => {
    record = 0;
    localStorage.setItem(localStorageRecordKey, record);
};

let snakeColor = "green";
let gameSpeed = 100;

// Set snake color and game speed
function setSpeed(mode) {
    const speedConfig = {
        low: { speed: 150, color: "yellow" },
        normal: { speed: 100, color: "green" },
        high: { speed: 50, color: "red" },
    };
    const {speed, color} = speedConfig[mode];
    gameSpeed = speed;
    snakeColor = color;

    clearInterval(game);
    game = setInterval(drawSnakeGame, gameSpeed);
}

// Initial game setup
let game = setInterval(drawSnakeGame, 100);
setSpeed('normal');