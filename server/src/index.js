const WebSocket = require('ws');
const configJS = require('../lib/config')

var ip = require("ip");

var config = configJS.getConfig();

var socket = [];

const Ball = require('../lib/Ball');

var startBall1 = new Ball.Ball({x: 320, y: 240}, {min : {x: 2, y: 2}, max : {x: 5, y: 5}}, {x: 15, y: 15}, 5, "white")
var startBall2 = new Ball.Ball({x: 320, y: 240}, {min : {x: 2, y: 2}, max : {x: 5, y: 5}}, {x: 15, y: 15}, 5, "white")
var game = {p1: {ball : startBall1, score: 0},
            p2: {ball : startBall2, score: 0}};

var play = false;

const wss = new WebSocket.Server({port: config.port}, () => {
    console.log("Server listening on " + ip.address() + ":" + config.port)
});

function main() {
    if (play) {
        game.p1.ball.move()
        game.p2.ball.move()
        if (game.p1.ball.collide(game.p1.paddle)) {game.p2.score += 1}
        if (game.p2.ball.collide(game.p2.paddle)) {
            game.p1.score += 1;
            // NOTE: This section is for emulation purpose ONLY. This WON'T be implemented in the real game
            game.p2.paddle.y = 240 - 50
            // EoB
        }

        // NOTE: This section is for emulation purpose ONLY. This WON'T be implemented in the real game
        game.p2.paddle.y += game.p2.ball.speed.y * 0.91
        // EoB

        for (i in socket) {
            socket[i].send(JSON.stringify(game))
        }
        setTimeout(main, 1000 / 60) 
    }
}


wss.on('connection', (ws, request) => {
    if (!configJS.checkWhitelist(request.connection.remoteAddress, config)) {
        console.log(`Client ${request.connection.remoteAddress} is not on whitelist`)
        ws.close()
    } else if (configJS.checkBlackList(request.connection.remoteAddress, config)) {
        console.log(`Client ${request.connection.remoteAddress} is banned`)
        ws.close()
    } else {
        console.log(`New client connected: ${request.connection.remoteAddress}`);
    }

    play = true;

    game.p1.ball.pos.x = 320;
    game.p1.ball.pos.y = 240;
    game.p2.ball.pos.x = 320;
    game.p2.ball.pos.y = 240;

    // NOTE: This section is for emulation purpose ONLY. This WON'T be implemented in the real game
    game.p2.paddle = {y: JSON.parse(JSON.stringify(game.p2.ball.pos.y)) - 50}

    // EoB

    socket.push(ws);

    main();

    ws.on('message', data => {
        game.p1.paddle = JSON.parse(data);
    })

    ws.on('close', function () {
        console.log('Client disconnected'); 
        play = false; 
        socket = [];
    })
})
