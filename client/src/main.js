var playerBoard = document.getElementById('playerBoard');
var opponentBoard = document.getElementById('opponentBoard');

const startBtn = document.getElementById('start-game');
const stopBtn = document.getElementById('stop-game');
const showCreditsBtn = document.getElementById('showCredits');
const hostInput = document.getElementById('host');
const p1_score = document.getElementById('p1-score');
const p2_score = document.getElementById('p2-score');

const pBS = document.getElementById('pBS');
const oBS = document.getElementById('oBS');

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

var ratio = playerBoard.width / 640  

var mainState = false;
var sockState = false;


var game = {ball: {},
            player: {y: playerBoard.height / 2 - PLAYER_HEIGHT / 2}};

function draw() {
    playerBoardContext = playerBoard.getContext('2d');
    opponentBoardContext = opponentBoard.getContext('2d');


    // Fill background
    playerBoardContext.fillStyle = 'black'; 
    playerBoardContext.fillRect(0, 0, playerBoard.width, playerBoard.height);
    opponentBoardContext.fillStyle = 'black';
    opponentBoardContext.fillRect(0, 0, playerBoard.width, playerBoard.height);
    
    // Middle Line
    playerBoardContext.strokeStyle = 'white';
    playerBoardContext.beginPath();
    playerBoardContext.moveTo(playerBoard.width / 2, 0);
    playerBoardContext.lineTo(playerBoard.width / 2, playerBoard.height);
    playerBoardContext.stroke();
    opponentBoardContext.strokeStyle = 'white';
    opponentBoardContext.beginPath();
    opponentBoardContext.moveTo(opponentBoard.width / 2, 0);
    opponentBoardContext.lineTo(opponentBoard.width / 2, opponentBoard.height);
    opponentBoardContext.stroke();

    // Draw Paddles
    playerBoardContext.fillStyle = 'white';
    playerBoardContext.fillRect(0, game.player.y, PLAYER_WIDTH * ratio, PLAYER_HEIGHT * ratio);
    if (game.p2) {
        opponentBoardContext.fillStyle = 'white';
        opponentBoardContext.fillRect(0, game.p2.paddle.y, PLAYER_WIDTH * ratio, PLAYER_HEIGHT * ratio);
    }

    // Draw Balls
    playerBoardContext.beginPath();
    playerBoardContext.fillStyle = 'white';
    playerBoardContext.arc(game.p1.ball.pos.x * ratio, game.p1.ball.pos.y * ratio, game.p1.ball.r * ratio, 0, Math.PI * 2, false);
    playerBoardContext.fill();
    opponentBoardContext.beginPath();
    opponentBoardContext.fillStyle = 'white';
    if (game.p2) {
        opponentBoardContext.arc(game.p2.ball.pos.x * ratio, game.p2.ball.pos.y * ratio, game.p2.ball.r * ratio, 0, Math.PI * 2, false);
        opponentBoardContext.fill();
    }
    
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
    p1_score.innerHTML = game.p1.score;
    p2_score.innerHTML = game.p2.score;

    pBS.innerHTML = game.p1.ball.pxps;
    oBS.innerHTML = game.p2.ball.pxps;
    requestAnimationFrame(main)
}

function update(data) {
    game.p1 = JSON.parse(data).p1;
    game.p2 = JSON.parse(data).p2;
    if (!mainState) {
        mainState = true;
        document.getElementById('pBS').style.display = "inline"
        document.getElementById('oBS').style.display = "inline"
        main();
    }
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
    })
}


startBtn.onclick = makeWs
stopBtn.onclick = function() {ws.close()};