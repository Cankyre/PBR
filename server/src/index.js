const WebSocket = require('ws');
const fs = require('fs')

var config = JSON.parse(fs.readFileSync('./config/config.json'))

var socket = [];

const Ball = require('../lib/Ball');

var startBall = new Ball.Ball({x: 320, y: 240}, {min : {x: 2, y: 2}, max : {x: 5, y: 5}}, {x: 15, y: 15}, 5, "white")
var game = {ball : startBall};

var play = false;

const wss = new WebSocket.Server({port: config.port});

function checkWhitelist(ip) {
    if (config.whitelist) {
        for (i in config.trustedIPs) {
            if (config.trustedIPs[i] == ip) {
                return true
            }
        }
        return false
    } else {
        return true
    }
}

function checkBlackList(ip) {
    if (config.blacklist) {
        for (i in config.banIPs) {
            if (config.banIPs[i] == ip) {
                return true
            }
        }
        return false
    } else {
        return true
    }
}

function main() {
    if (play) {
        game.ball.move()
        game.ball.collide(game.p1);
        for (i in socket) {
            socket[i].send(JSON.stringify(game))
        }
        setTimeout(main, 1000 / 60)
    }
}


wss.on('connection', (ws, request) => {
    if (!checkWhitelist(request.connection.remoteAddress)) {
        console.log(`Client ${request.connection.remoteAddress} is not on whitelist`)
        ws.close()
    } else if (checkBlackList(request.connection.remoteAddress)) {
        console.log(`Client ${request.connection.remoteAddress} is banned`)
        ws.close()
    } else {
        console.log(`New client connected: ${request.connection.remoteAddress}`);
    }

    play = true;

    game.ball.x = 0;
    game.ball.y = 0;

    socket.push(ws);

    main();

    ws.on('message', data => {
        game.p1 = JSON.parse(data);
    })

    ws.on('close', function () {
        console.log('Client disconnected'); 
        play = false; 
        socket = [];
    })
})
