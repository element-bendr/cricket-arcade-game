class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = 0;
        this.speedY = 0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
    }

    setSpeed(speedX, speedY) {
        this.speedX = speedX;
        this.speedY = speedY;
    }

    resetPosition(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
    }

    checkCollision(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius + other.radius;
    }
}

export default Ball;