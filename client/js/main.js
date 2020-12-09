var playerBoard = document.getElementById('playerBoard');
var opponentBoard = document.getElementById('opponentBoard');

const startBtn = document.getElementById('start-game');
const stopBtn = document.getElementById('stop-game');
const hostInput = document.getElementById('host');

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

var mainState = false;
var sockState = false;

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
    if (sockState) {
        ws.send(JSON.stringify(game.player))
    }
    requestAnimationFrame(main)
}

function update(data) {
    game.ball = JSON.parse(data).ball;
}

playerBoard.addEventListener('mousemove', playerMove);

function makeWs() {
    ws = new WebSocket(hostInput.value);

    ws.addEventListener('open', () => {
        console.log('connected');
        sockState = true;
    });

    ws.addEventListener('close', () => {
        console.log('disconnected');
        sockState = false;
    })
    
    ws.addEventListener('message', ({data}) => {
        update(data);
        if (!mainState) {
            main();
            mainState = true;
        }
        
    })
}

startBtn.onclick = makeWs
stopBtn.onclick = function() {ws.close()};