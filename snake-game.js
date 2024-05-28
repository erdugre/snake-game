document.addEventListener('DOMContentLoaded', () => {
    //board features
    const blockSize = 25;
    const rows = 20;
    const cols = 20;
    

    const snakeGameContainer = document.getElementById('snake-game-container');
    const startContainer = document.getElementById('start-container');
    const startInput = document.getElementById('start-button');
    let diamondCount = document.getElementById('diamond-count');
    let bestScore = document.getElementById('best-score');
    

    //board initialization
    var board = document.getElementById('board');
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    var context = board.getContext("2d"); //the function that you use to get access to the canvas tags 2D drawing functions
    context.imageSmoothingEnabled = true;

    //snake head
    var snakeX = blockSize * 5;
    var snakeY = blockSize * 5;

    //velocity of the snake
    var velocityX = 0;
    var velocityY = 0;

    //snake body
    var snakeBody = [];

    //diamond
    var diamondX;
    var diamondY;

    var gameOver = false;
    var gameInterval;
    var numDiamonds = 0;

    var diamondImage = new Image();
    diamondImage.src = './diamond2-photo.png';


    startInput.addEventListener('click', () => {
        console.log("Start button clicked");
        snakeGameContainer.style.display = 'block';
        startContainer.style.display = 'none';
        placeDiamond();
        document.addEventListener("keyup", changeDirection);
        gameInterval = setInterval(update, 1000/10); //call update every 10 ms

    });

    function update() {
        if (gameOver) {
            return;
        }
        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height); //starting from the (0,0) and filling it

        context.drawImage(diamondImage, diamondX, diamondY, blockSize, blockSize);

        // consume diamonds
        if (snakeX == diamondX && snakeY == diamondY) {
            ++numDiamonds;
            diamondCount.textContent = numDiamonds;
            snakeBody.push([diamondX, diamondY])
            placeDiamond();
        }

        //letting tail catch up with the head (basically the last element moves to the previous place until length is complete)
        for (let i = snakeBody.length - 1; i > 0; --i) {
            snakeBody[i] = snakeBody[i-1];
        }

        //after tail cathes up we just need to move the head
        if (snakeBody.length) {
            snakeBody[0] = [snakeX, snakeY];
        }

        context.fillStyle = "#a4cc5c";
        snakeX += velocityX * blockSize;
        snakeY += velocityY * blockSize;
        context.fillRect(snakeX, snakeY, blockSize, blockSize);
        for (let i = 0; i < snakeBody.length; ++i) {
            context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize)
        }

        //game over conditins
        if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
            gameOver = true;
            alert("Game Over! You were out of bounds!");
            resetGame();
            return;
        }

        for (let i = 0; i < snakeBody.length; ++i) {
            if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
                gameOver = true;
                alert("Game Over! You ate yourself!");
                resetGame();
            }
        }

    }

    function changeDirection(myEvent) {
        if (myEvent.code == "ArrowUp" && velocityY != 1) { //second conditional helps us prevent moving in the opposite direction (snake eating itself)
            velocityX = 0;
            velocityY = -1;
        }
        else if (myEvent.code == "ArrowDown" && velocityY != -1) {
            velocityX = 0;
            velocityY = 1;
        }
        else if (myEvent.code == "ArrowLeft" && velocityX != 1) {
            velocityX = -1;
            velocityY = 0;
        }
        else if (myEvent.code == "ArrowRight" && velocityX != -1) {
            velocityX = 1;
            velocityY = 0;
        }
    }

    function placeDiamond() {
        //(0 - 1) * cols -> (0 - 19.9999) -> (0 - 19) * 25
        diamondX = Math.floor(Math.random() * cols) * blockSize;
        diamondY = Math.floor(Math.random() * rows) * blockSize;
    }

    function resetGame() {
        clearInterval(gameInterval);
        document.removeEventListener("keyup", changeDirection);
        snakeGameContainer.style.display = 'none';
        startContainer.style.display = 'block';
        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height);
        if (numDiamonds > bestScore.textContent) {
            bestScore.textContent = numDiamonds;
        }
        numDiamonds = 0;
        velocityX = 0;
        velocityY = 0;
        snakeBody = [];
        snakeX = blockSize * 5;
        snakeY = blockSize * 5;
        gameOver = false;
        startContainer.style.display = 'flex';
        diamondCount.textContent = numDiamonds;
    }
});
