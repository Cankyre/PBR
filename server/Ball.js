class Ball {
    constructor(pos, speed, r, color) {
        this.pos = pos
        this.speed = speed
        this.r = r;
        this.color = color;
    }

    move() {
        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;
    }
}

module.exports.Ball = Ball;