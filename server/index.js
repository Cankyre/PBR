const WebSocket = require('ws');

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


wss.on('connection', ws => {
    while (play) {
        ws.send(JSON.stringify({ball : game.ball}))
        console.log(game.ball.pos.y)
        game.ball.move()
    }

    ball.x = 0;
    ball.y = 0;

    console.log('New client connected');
    
    ws.on('message', data => {
        
    })

    ws.on('close',  () => console.log('Client has disconnected'))
})

//TODO: finish class making
//TODO: receiving player signals