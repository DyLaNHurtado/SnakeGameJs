const canvas = document.getElementById('screen');
const context= canvas.getContext('2d');
const reloadButton = document.getElementById('reloadButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');


class SnakePart{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}



let speed= 11;

let tileCount = 20;
let tileSize = canvas.width / tileCount ;
let headX = 10;
let headY = 10;

const snakeParts = [];

let tailLength = 2;

let xVelocity=0;
let yVelocity=0;

let appleX = 5;
let appleY = 5;

let score = 0;


let eatSound = new Audio('eatAppleSound.mp3');
let pauseSound = new Audio('menuSound.mp3');
let resumeSound = new Audio('menuSound.mp3');
let gameOverSound = new Audio('gameOverSound.mp3');

let isPause = false;


function drawGame(){
    if(isPause==false){
    changeSnakePosition();

    let result = isGameOver();
    if(result){return;}



    clearScreen();
    checkAppleCollition();
    drawApple();
    drawSnake();

    drawScore();

    incrementDifficultByScore();
    }else{
        drawPause();
    }
    setTimeout(drawGame,1000 / speed);
    
}

function isGameOver(){
    let gameOver = false;


    if(yVelocity == 0 && xVelocity == 0){
        return false;
    }

    //walls
    if(headX < 0 ){
        gameOver = true;
        score = 0;
    }
    if( headY < 0){
        gameOver = true;
        score = 0;
    }
    if(headX == tileCount){
        gameOver = true;
        score = 0;
    }
    if(headY == tileCount){
        gameOver = true;
        score = 0;
    }


    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if(part.x == headX && part.y == headY){
            gameOver=true;
            score=0;
            break;
        }
        
    }


    if(gameOver){
        gameOverSound.play();
        context.fillStyle = "white";
        context.font = "50px Segoe UI";

        var gradient = context.createLinearGradient(0,0,canvas.width,0);
        gradient.addColorStop("0","orange");
        gradient.addColorStop("0.5","yellow");
        gradient.addColorStop("1.0","orange");
        //Fill with gradient
        context.fillStyle = gradient;
        context.fillText("GAME OVER !", canvas.width / 6.5, canvas.height / 2);
        context.font = "32px Segoe UI";
        context.fillText("- PRESS RELOAD -", canvas.width / 5, canvas.height / 1.5);

    }

    return gameOver;
}

function clearScreen(){
    context.fillStyle = `rgb(43, 43, 43)`;
    context.fillRect(0,0,canvas.width,canvas.height);
}


function drawApple(){
    context.fillStyle = 'red';
    context.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
   
}

function checkAppleCollition(){
    if(appleX == headX && appleY ===headY){
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        eatSound.play();
    }
}


function drawSnake(){
    context.fillStyle = 'gold';
    context.fillRect(headX * tileCount, headY * tileCount,tileSize,tileSize);
    context.fillStyle = 'goldenrod';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        context.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    snakeParts.push(new SnakePart(headX,headY));
    while(snakeParts.length > tailLength){
        snakeParts.shift();
    }
}


function changeSnakePosition(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}


document.body.addEventListener('keydown',keyDown);

function keyDown(event){
    switch(event.keyCode){
        //up
        case 87:
        case 38:
            if(yVelocity == 1 ){return;}
            yVelocity = -1;
            xVelocity = 0;
            break;
        //down
        case 83:
        case 40:
            if(yVelocity == -1 ){return;}
            yVelocity = 1;
            xVelocity = 0;
            break;
        //left
        case 65:
        case 37:
            if(xVelocity == 1 ){return;}
            yVelocity = 0;
            xVelocity = -1;
            break;
        //right
        case 68:
        case 39:
            if(xVelocity == -1 ){return;}
            yVelocity = 0;
            xVelocity = 1;
            break;
    }

}

function drawScore(){
    context.fillStyle = 'white';
    context.font = "16px Verdana";
    context.fillText("Score "+ score , canvas.width - 90, 30);
}

function incrementDifficultByScore(){


    if(score > 10 ){
        speed = 13;
    }

    if(score >  15){
        speed=15;
    }

    if(score > 20 ){
        speed = 18;
    }
}

reloadButton.addEventListener('click',function(){
    window.location.reload();

});

pauseButton.addEventListener('click',function(){
    pauseSound.play();
    isPause=true;

});

resumeButton.addEventListener('click',function(){
    resumeSound.play();
    isPause=false;

});

function drawPause(){
    context.fillStyle = "white";
    context.font = "64px Segoe UI";
    //Fill with gradient
    context.fillText("PAUSED !", canvas.width / 5.5, canvas.height / 2);
    context.font = "32px Segoe UI";
    context.fillText("- PRESS RESUME -", canvas.width / 5, canvas.height / 1.5);


}

drawGame();

