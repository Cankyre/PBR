const ws = new WebSocket('ws://localhost:8082')
var playerBoard = document.getElementById('playerBoard');
var opponentBoard = document.getElementById('opponentBoard')

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

var game = {ball: {},
            player: {y: playerBoard.height / 2 - PLAYER_HEIGHT / 2}};

function draw() {
    playerBoardContext = playerBoard.getContext('2d');

    playerBoardContext.fillStyle = 'black';
    playerBoardContext.fillRect(0, 0, playerBoard.width, playerBoard.height);
    
    playerBoardContext.strokeStyle = 'white';
    playerBoardContext.beginPath();
    playerBoardContext.moveTo(playerBoard.width / 2, 0);
    playerBoardContext.lineTo(playerBoard.width / 2, playerBoard.height);
    playerBoardContext.stroke();
    
    playerBoardContext.fillStyle = 'white';
    playerBoardContext.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    playerBoardContext.beginPath();
    playerBoardContext.fillStyle = 'white';
    playerBoardContext.arc(game.ball.pos.x, game.ball.pos.y, game.ball.r, 0, Math.PI * 2, false);
    playerBoardContext.fill();
}

function playerMove(event) {
    var canvasLocation = playerBoard.getBoundingClientRect();
    var mouseLocation = event.clientY - canvasLocation.y;

    if (mouseLocation < PLAYER_HEIGHT / 2) {
        game.player.y = 0;
    } else if (mouseLocation > playerBoard.height - PLAYER_HEIGHT / 2) {
        game.player.y = playerBoard.height - PLAYER_HEIGHT;
    } else {
        game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
    }
}

function main() {
    draw();
    requestAnimationFrame(main)
}

function update(data) {
    game.ball = data.ball;
}

playerBoard.addEventListener('mousemove', playerMove);

ws.addEventListener('open', () => {
    console.log('connected');
    setTimeout(main, 100)
});

ws.addEventListener('message', ({data}) => {
    update(JSON.parse(data))
})

//TODO: Paddles