const Ball = {
    radius: 10,
    color: 'white',
    x: 0,
    y: 0,
    speedX: 5,
    speedY: 5,

    draw: function(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    },

    update: function() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off the walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
    },

    reset: function() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = 5;
        this.speedY = 5;
    }
};

export default Ball;