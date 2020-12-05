const WebSocket = require('ws');

var socket = [];

const Ball = require('./Ball');

var startBall = new Ball.Ball({x: 320, y: 240}, {x: 1, y: 1}, 5, "white")

var game = {ball : startBall};

var play = true
var ball = {x: 320,
            y: 240,
            r:5,
            speed: {x: 1,
                    y: 1}}

const wss = new WebSocket.Server({port: 8082});

function main() {
    game.ball.move()
    for (i in socket) {
        socket[i].send(JSON.stringify(game))
    }
    setTimeout(main, 1)
}


wss.on('connection', ws => {
    console.log('New client connected');



    ball.x = 0;
    ball.y = 0;

    socket.push(ws);

    main();

    ws.on('message', ({data}) => {
        // game.p1 = JSON.parse(data).player;
    })

    ws.on('close', function () {console.log('Client disconnected'); play = false})
})
