const gameArea = document.getElementById('game');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');

const paddleWidth = paddle.clientWidth;
const paddleHeight = paddle.clientHeight;
const ballSize = ball.clientWidth;
const gameWidth = gameArea.clientWidth;
const gameHeight = gameArea.clientHeight;

let paddleX = 10;
let paddleY = (gameHeight - paddleHeight) / 2;
let ballX = gameWidth - ballSize - paddleWidth; // La pelota comienza en el lado derecho del área
let ballY = Math.random() * (gameHeight - ballSize);
let ballSpeedX = -4;
let ballSpeedY = 4;
let paddleSpeed = 0;
const maxPaddleSpeed = 8; // Velocidad máxima de la paleta

function update() {
    // Mueve la pelota
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Rebote en los bordes superior e inferior
    if (ballY <= 2 || ballY + ballSize >= gameHeight - 2) {
        ballSpeedY = -ballSpeedY;
    }

    // Rebote en la paleta
    if (ballX <= paddleX + paddleWidth &&
        ballY + ballSize >= paddleY &&
        ballY <= paddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        // Aumentar la velocidad de la pelota ligeramente después del rebote
        ballSpeedX *= 1.1; // Aumenta la velocidad horizontal en un 10%
        ballSpeedY *= 1.1; // Aumenta la velocidad vertical en un 10%
        ballX = paddleX + paddleWidth; // Asegura que la pelota no quede atrapada en la paleta
    }

    // Rebote en el borde derecho
    if (ballX + ballSize > gameWidth - 2) {
        ballSpeedX = -ballSpeedX;
        ballX = gameWidth - ballSize - 2; // Asegura que la pelota no quede atrapada en el borde
    }

    // Comprobar pérdida
    if (ballX < 0) {
        alert('¡Has perdido!');
        // Reiniciar el juego
        ballX = gameWidth - ballSize - paddleWidth; // Ajustar la posición inicial
        ballY = Math.random() * (gameHeight - ballSize);
        ballSpeedX = -4;
        ballSpeedY = 4;
    }

    // Asegurar que la pelota no salga de los bordes izquierdo y derecho
    if (ballX < 2) ballX = 2;
    if (ballX + ballSize > gameWidth - 2) ballX = gameWidth - ballSize - 2;

    // Actualizar la posición de la pelota
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    // Mover la paleta de forma fluida
    paddleY += paddleSpeed;

    // Ajustar los límites de la paleta para que no se pase
    if (paddleY < 0) {
        paddleY = 0;
    } else if (paddleY + paddleHeight > gameHeight) {
        paddleY = gameHeight - paddleHeight;
    }
    paddle.style.top = `${paddleY}px`;
}

function movePaddle(e) {
    // Actualiza la velocidad de la paleta según la tecla presionada
    if (e.key === 'ArrowUp') {
        paddleSpeed = -maxPaddleSpeed;
    } else if (e.key === 'ArrowDown') {
        paddleSpeed = maxPaddleSpeed;
    }
}

function stopPaddle(e) {
    // Detiene la paleta cuando se suelta la tecla
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        paddleSpeed = 0;
    }
}

// Manejar el movimiento de la paleta
window.addEventListener('keydown', movePaddle);
window.addEventListener('keyup', stopPaddle);

// Actualizar el estado del juego cada 16 milisegundos (60 FPS)
setInterval(update, 16);
