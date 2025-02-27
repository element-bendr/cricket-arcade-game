class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50; // Width of the player
        this.height = 100; // Height of the player
        this.image = new Image();
        this.image.src = 'path/to/player-sprite.png'; // Path to player sprite
        this.frameIndex = 0; // For animation
        this.animationSpeed = 0.1; // Speed of animation
        this.lastFrameTime = 0; // Time tracking for animation
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.frameIndex * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(deltaTime) {
        this.lastFrameTime += deltaTime;
        if (this.lastFrameTime > this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % 4; // Assuming 4 frames of animation
            this.lastFrameTime = 0;
        }
    }

    move(direction) {
        const speed = 5; // Movement speed
        if (direction === 'left') {
            this.x -= speed;
        } else if (direction === 'right') {
            this.x += speed;
        }
        // Add bounds checking if necessary
    }
}

export default Player;