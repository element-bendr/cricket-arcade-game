class Bat {
    constructor() {
        this.width = 100;
        this.height = 20;
        this.x = 0;
        this.y = 0;
        this.color = '#000000';
        this.isSwinging = false;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    swing() {
        this.isSwinging = true;
        // Logic for swinging the bat
    }

    stopSwing() {
        this.isSwinging = false;
    }

    updatePosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    checkCollision(ball) {
        return ball.x > this.x && ball.x < this.x + this.width &&
               ball.y > this.y && ball.y < this.y + this.height;
    }
}

export default Bat;