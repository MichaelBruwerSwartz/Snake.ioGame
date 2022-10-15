const gameBoard = document.getElementById("gameBoard"); //the canvas
const context = gameBoard.getContext("2d");             //inside canvas
const scoreTxt = document.getElementById("scoreTxt");   //score display text
const highScoreTxt = document.getElementById("highScoreTxt")
const resetBtn = document.getElementById("resetBtn");   //button to reset game
//game restrictions
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
//color prefernces
const boardBackground = "lightgreen";
const snakeColor = "yellow";
const snakeBorder = "black";
const foodColor = "red";
//size
const unitSize = 25;
//game physics
let gameRunning = false;
let xSpeed = unitSize;  //right is positive, left is negative
let ySpeed = 0;         //up is positive, down is negative
let tickSpeed = 150;    //speed f the gameclock
//food and score
let foodX;
let foodY;
let score = 0;
let highScore = 0;
//snake
let snake = [
    {x:unitSize * 4,  y:0},   
    {x:unitSize * 3,  y:0},
    {x:unitSize * 2,  y:0},
    {x:unitSize,  y:0},
    {x:0,  y:0}
];
//detecting inputs from user
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetBoard);

//game start here
gameStart();



//game engine
function gameStart(){
    gameRunning = true;
    scoreTxt.textContent = "Current score: " + score;
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){
    if (gameRunning == true){
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, tickSpeed)
    }else{
        displayGameOver();
    }
};

//clear
function clearBoard(){
    context.fillStyle = boardBackground;
    context.fillRect(0, 0, gameWidth, gameHeight);
};
function resetBoard(){
    score = 0;
    xSpeed = unitSize;
    ySpeed = 0;
    snake = [
        {x:unitSize * 4,  y:0},   
        {x:unitSize * 3,  y:0},
        {x:unitSize * 2,  y:0},
        {x:unitSize,  y:0},
        {x:0,  y:0}
    ];
    gameStart();
};

//creating food
function createFood(){
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize)

    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
};
function drawFood(){
    context.fillStyle = foodColor;
    context.fillRect(foodX, foodY, unitSize, unitSize);

};

//creating snake
function moveSnake(){
    const head = {x: snake[0].x + xSpeed, y: snake[0].y + ySpeed};
    snake.unshift(head);
    //check if food is eaten
    if ((snake[0].x == foodX)&&(snake[0].y == foodY)){
        score += 1;
        scoreTxt.textContent = "Current score: " + score;
        if (tickSpeed >= 95){
        tickSpeed -= 5;
        }
        createFood();
    }else{
        snake.pop();
    }
};
function drawSnake(){
    context.fillStyle = snakeColor;
    context.strokeStyle = snakeBorder;
    snake.forEach(part => {
        context.fillRect(part.x, part.y, unitSize, unitSize);
        context.strokeRect(part.x, part.y, unitSize, unitSize);
    });
};

//moving snake
function changeDirection(event){
    //read input
    const inputKey = event.keyCode;
    //all possible directions
    const D = 38;
    const U = 40;
    const R = 39;
    const L = 37;
    console.log(inputKey);
    
    const goingUp = (ySpeed == unitSize);
    const goingDown = (ySpeed == -unitSize);
    const goingRight = (xSpeed == unitSize);
    const goingLeft = (xSpeed == -unitSize);

    switch(true){
        case((inputKey == L) && (!goingRight)):
            xSpeed = -unitSize;
            ySpeed = 0;
        break;

        case((inputKey == R) && (!goingLeft)):
            xSpeed = unitSize;
            ySpeed = 0;
        break;        

        case((inputKey == U) && (!goingDown)):
            xSpeed = 0;
            ySpeed = unitSize;
        break;

        case((inputKey == D) && (!goingUp)):
            xSpeed = 0;
            ySpeed = -unitSize;
        break;        
    }

}

//check wether game is won or lost
function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            gameRunning = false
        break;
        case (snake[0].x >= gameWidth):
            gameRunning = false
        break;
        case (snake[0].y < 0):
            gameRunning = false
        break;
        case (snake[0].y >= gameHeight):
            gameRunning = false
        break;
    }

    for (let i = 1; i < snake.length; i+= 1){
        if ((snake[i].x == snake[0].x)&&(snake[i].y == snake[0].y)){
            gameRunning = false;
        }
    }

};
function displayGameOver(){
    context.font = "50px consolas";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
    gameRunning = false;
    if (score > highScore){
    highScore = score;
    highScoreTxt.textContent = "Highscore: " + highScore;
    }
};