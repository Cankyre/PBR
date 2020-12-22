const WebSocket = require('ws');
const fs = require('fs')

var config = JSON.parse(fs.readFileSync('./config/config.json'))
console.log(config)


var socket = [];

const Ball = require('../lib/Ball');

var startBall = new Ball.Ball({x: 320, y: 240}, {min : {x: 2, y: 2}, max : {x: 5, y: 5}}, {x: 15, y: 15}, 5, "white")
var game = {ball : startBall};

var play = false;

const wss = new WebSocket.Server({port: 8082});

function checkWhitelist(ip) {
    if (config.whitelist) {
        for (i in config.trustedIPs) {
            if (config.trustedIPs[i] == ip) {
                return true
            } else {
                return false
            }
        }
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
        ws.terminate()
    }
    console.log('New client connected');

    console.log(request.connection.remoteAddress)

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
