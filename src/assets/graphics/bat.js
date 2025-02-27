class Bat {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 20;
        this.color = '#8B4513'; // Brown color for the bat
        this.isSwinging = false;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    swing() {
        this.isSwinging = true;
        // Logic for swinging the bat can be added here
    }

    stopSwing() {
        this.isSwinging = false;
    }

    update() {
        // Update bat position or state if necessary
    }
}

export default Bat;