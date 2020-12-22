const WebSocket = require('ws');

var socket = [];

const Ball = require('../lib/Ball');

var startBall = new Ball.Ball({x: 320, y: 240}, {min : {x: 2, y: 2}, max : {x: 5, y: 5}}, {x: 15, y: 15}, 5, "white")
var game = {ball : startBall};

var play = false;

const wss = new WebSocket.Server({port: 8082, 
    /*verifyClient(req) {
        console.log(req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress); 
      }      */
});

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


wss.on('connection', (ws) => {

    console.log('New client connected');

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
