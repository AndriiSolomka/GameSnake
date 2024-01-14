const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

const gameField = new Image();
gameField.src = "image/snakeField.png";

const food = new Image();
food.src = "image/food.png";

const snakeView = new Image();
snakeView.src = "image/snake.png";

let boxLength = 32;
let score = 0;


let snakefood= {
    x: Math.floor((Math.random()*17+1)) * boxLength,
    y: Math.floor((Math.random()*15+3)) * boxLength,
};

let snake = [];
snake[0] ={
    x: 9 * boxLength,
    y: 10 * boxLength,
};

document.addEventListener("keydown", direction);


const reload = () => {
    clearInterval(game);
    location.reload();
};
const handleGameOver = () => {
    clearInterval(game);
    alert( `You have lost😢\n  Try again😊`);
    reload();
};

let dir;
function direction(event){
    if(event.keyCode === 37 && dir !=="right")
        dir = "left";
    else if(event.keyCode === 38 && dir !=="down")
        dir = "up";
    else if(event.keyCode === 39 && dir !=="left")
        dir = "right";
    else if(event.keyCode === 40 && dir !=="up")
        dir = "down";
}

function eatTail(head, snakeTail){
    for (let i = 0; i < snakeTail.length; i++) {
        if(head.x === snakeTail[i].x && head.y === snakeTail[i].y) {
            handleGameOver();
        }
    }
}

function drawSnakeGame(){
    ctx.drawImage(gameField, 0, 0);
    ctx.drawImage(food,snakefood.x, snakefood.y);


    for(let i = 0; i < snake.length; i++){

        if(i === 0){
            ctx.drawImage(snakeView,snake[i].x, snake[i].y, boxLength, boxLength );
        } else {
            ctx.fillStyle = "green";
            ctx.fillRect(snake[i].x, snake[i].y, boxLength, boxLength);
        }
    }

    ctx.fillStyle = "yellow";
    ctx.font = "60px Arial";
    ctx.fillText(score, boxLength * 2, boxLength * 1.8)


    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(snakeX === snakefood.x && snakeY === snakefood.y){
        score++;
        snakefood = {
            x: Math.floor((Math.random()*17+1)) * boxLength,
            y: Math.floor((Math.random()*15+3)) * boxLength,
        };
    } else {
        snake.pop();
    }

    if(snakeX < boxLength || snakeX > boxLength * 17
        || snakeY < 3 * boxLength || snakeY > boxLength * 17)
        handleGameOver();

    if(dir === "left") snakeX -=boxLength;
    if(dir === "right") snakeX +=boxLength;
    if(dir === "up") snakeY -=boxLength;
    if(dir === "down") snakeY +=boxLength;

    let newSnakeLength ={
        x: snakeX,
        y: snakeY,
    };

    eatTail(newSnakeLength, snake);
    snake.unshift(newSnakeLength);

}


let game = setInterval(drawSnakeGame, 100);