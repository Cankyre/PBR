class Ball {
    constructor(pos, speed, maxSpeed, r, color) {
        this.pos = pos;
        this.speed = {x: Math.random() * (speed.max.x - speed.min.x) + speed.min.x,
            y: Math.random() * (speed.max.y - speed.min.y) + speed.min.y};
        this.r = r;
        this.color = color;
        this.maxSpeed = maxSpeed
        this.initial = JSON.parse(JSON.stringify({pos: pos, speed: speed, r: r, color: color}))
        this.pxps = Math.round(((Math.sqrt(this.speed.x * this.speed.x
            + this.speed.y * this.speed.y)  * (1000/60)) + Number.EPSILON) * 100) / 100;
    }

    move() {
        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;
    }

    reset() {
        this.pos = JSON.parse(JSON.stringify(this.initial.pos));
        this.speed = {x: Math.random() * (JSON.parse(JSON.stringify(this.initial.speed.max.x)) 
            - JSON.parse(JSON.stringify(this.initial.speed.min.x))) 
            + JSON.parse(JSON.stringify(this.initial.speed.min.x)), 
            y: Math.random() * (JSON.parse(JSON.stringify(this.initial.speed.max.y)) 
            - JSON.parse(JSON.stringify(this.initial.speed.min.y))) 
            + JSON.parse(JSON.stringify(this.initial.speed.min.y))}
        this.r = JSON.parse(JSON.stringify(this.initial.r));
        this.color = JSON.parse(JSON.stringify(this.initial.color));
    }

    getPxps() {
        this.pxps = Math.round(((Math.sqrt(this.speed.x * this.speed.x
            + this.speed.y * this.speed.y)  * (1000/60)) + Number.EPSILON) * 100) / 100;
    }

    collide(paddle) {
        if (this.pos.y >= 480 || this.pos.y <= 0) {
            this.speed.y *= -1;
        }
        if (this.pos.x >= 640) {
            this.speed.x *= -1;
        }
        if (paddle && (this.pos.x <= 5)) {
            if (this.pos.y > paddle.y && this.pos.y < paddle.y + 100) {
                var impact = this.pos.y - paddle.y - 100 / 2;
                var ratio = 100 / (100 / 2);
                // Get a value between 0 and 10
                this.speed.y = impact * ratio / 10;
                this.getPxps();
                if (this.speed.x >= this.maxSpeed.x) {
                    this.speed.x = this.maxSpeed.x * -1
                }  else if (this.speed.x <= -this.maxSpeed.x) {
                    this.speed.x = this.maxSpeed.x
                } else{
                    this.speed.x *= -1.2;           
                }
                
            } else {
                this.reset();
                this.getPxps();
                return 1;
            }
        } 
    }
}

module.exports.Ball = Ball;