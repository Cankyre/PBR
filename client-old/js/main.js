'use strict';

var playerBoard;
var opponentBoard;
var game;
var anim;

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const MAX_SPEED = 12;

function draw() {
	var playerBoardContext = playerBoard.getContext('2d');
	var opponentBoardContext = opponentBoard.getContext('2d');

    // Draw fields
    playerBoardContext.fillStyle = 'black';
	playerBoardContext.fillRect(0, 0, playerBoard.width, playerBoard.height);
	opponentBoardContext.fillStyle = 'black';
	opponentBoardContext.fillRect(0, 0, opponentBoard.width, opponentBoard.height);

    // Draw middle line
    playerBoardContext.strokeStyle = 'white';
    playerBoardContext.beginPath();
    playerBoardContext.moveTo(playerBoard.width / 2, 0);
    playerBoardContext.lineTo(playerBoard.width / 2, playerBoard.height);
	playerBoardContext.stroke();
	opponentBoardContext.strokeStyle = 'white';
    opponentBoardContext.beginPath();
    opponentBoardContext.moveTo(playerBoard.width / 2, 0);
    opponentBoardContext.lineTo(playerBoard.width / 2, playerBoard.height);
    opponentBoardContext.stroke();

    // Draw players
    playerBoardContext.fillStyle = 'white';
    playerBoardContext.fillRect(0, game.p1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	playerBoardContext.fillRect(playerBoard.width - PLAYER_WIDTH, game.p2.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	opponentBoardContext.fillStyle = 'white';
    opponentBoardContext.fillRect(0, opponentBoard.height / 2, PLAYER_WIDTH, PLAYER_HEIGHT);
    opponentBoardContext.fillRect(playerBoard.width - PLAYER_WIDTH, opponentBoard.height / 2, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw ball
    playerBoardContext.beginPath();
    playerBoardContext.fillStyle = 'white';
    playerBoardContext.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    playerBoardContext.fill();
}

function changeDirection(playerPosition) {
    var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);

    // Get a value between 0 and 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

function playerMove(event) {
    // Get the mouse location in the playerBoard
    var canvasLocation = playerBoard.getBoundingClientRect();
    var mouseLocation = event.clientY - canvasLocation.y;

    if (mouseLocation < PLAYER_HEIGHT / 2) {
        game.p1.y = 0;
    } else if (mouseLocation > playerBoard.height - PLAYER_HEIGHT / 2) {
        game.p1.y = playerBoard.height - PLAYER_HEIGHT;
    } else {
        game.p1.y = mouseLocation - PLAYER_HEIGHT / 2;
    }
}

function computerMove() {
    game.p2.y += game.ball.speed.y * game.p2.speedRatio;
}

function collide(player) {
    // The player does not hit the ball
    if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {
        reset();

        // Update score
        if (player == game.p1) {
            game.p2.score++;
            document.querySelector('#p2-score').textContent = game.p2.score;
        } else {
            game.p1.score++;
            document.querySelector('#p1-score').textContent = game.p1.score;
        }
    } else {
        // Change direction
        game.ball.speed.x *= -1;
        changeDirection(player.y);

        // Increase speed if it has not reached max speed
        if (Math.abs(game.ball.speed.x) < MAX_SPEED) {
            game.ball.speed.x *= 1.2;
        }
    }
}

function ballMove() {
    // Rebounds on top and bottom
    if (game.ball.y > playerBoard.height || game.ball.y < 0) {
        game.ball.speed.y *= -1;
    }

    if (game.ball.x > playerBoard.width - PLAYER_WIDTH) {
        collide(game.p2);
    } else if (game.ball.x < PLAYER_WIDTH) {
        collide(game.p1);
    }

    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}

function play() {
    draw();

    computerMove();
    ballMove();

    anim = requestAnimationFrame(play);
}

function reset() {
    // Set ball and players to the center
    game.ball.x = playerBoard.width / 2;
    game.ball.y = playerBoard.height / 2;
    game.p1.y = playerBoard.height / 2 - PLAYER_HEIGHT / 2;
    game.p2.y = playerBoard.height / 2 - PLAYER_HEIGHT / 2;

    // Reset speed
    game.ball.speed.x = 3;
    game.ball.speed.y = Math.random() * 3;
}

function stop() {
    cancelAnimationFrame(anim);

    reset();

    // Init score
    game.p2.score = 0;
    game.p1.score = 0;

    document.querySelector('#p2-score').textContent = game.p2.score;
    document.querySelector('#player-score').textContent = game.p1.score;

    draw();
}

document.addEventListener('DOMContentLoaded', function () {
	playerBoard = document.getElementById('playerBoard');
	opponentBoard = document.getElementById('opponentBoard');
    game = {
        p1: {
            score: 0
        },
        p2: {
            score: 0,
            speedRatio: 0.75
        },
        ball: {
            r: 5,
            speed: {}
        }
    };

    reset();

    // Mouse move event
    playerBoard.addEventListener('mousemove', playerMove);

    // Mouse click event
    document.querySelector('#start-game').addEventListener('click', play);
    document.querySelector('#stop-game').addEventListener('click', stop);

});