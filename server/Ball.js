class Ball {
    constructor(pos, speed, r, color) {
        this.pos = pos;
        this.speed = speed;
        this.r = r;
        this.color = color;
        this.initial = JSON.parse(JSON.stringify({pos: pos, speed: speed, r: r, color: color}))
    }

    move() {
        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;
    }

    reset() {
        this.pos = JSON.parse(JSON.stringify(this.initial.pos));
        this.speed = JSON.parse(JSON.stringify(this.initial.speed));
        this.r = JSON.parse(JSON.stringify(this.initial.r));
        this.color = JSON.parse(JSON.stringify(this.initial.color));
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
                this.speed.x *= -1 - (1 / (1 + Math.exp((paddle.y + 50) - this.pos.y) * -1))
            } else {
                this.reset();
            } // Goal system here
        } 
    }
}

module.exports.Ball = Ball;