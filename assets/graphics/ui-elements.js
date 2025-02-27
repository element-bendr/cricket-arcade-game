const uiElements = {
    startButton: {
        x: 100,
        y: 200,
        width: 200,
        height: 50,
        color: '#4CAF50',
        text: 'Start Game',
        textColor: '#FFFFFF',
        draw: function(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.textColor;
            ctx.font = '20px Arial';
            ctx.fillText(this.text, this.x + 20, this.y + 30);
        },
        isHovered: function(mouseX, mouseY) {
            return mouseX > this.x && mouseX < this.x + this.width &&
                   mouseY > this.y && mouseY < this.y + this.height;
        }
    },
    scoreDisplay: {
        x: 10,
        y: 10,
        fontSize: '24px',
        color: '#FFFFFF',
        draw: function(ctx, score) {
            ctx.fillStyle = this.color;
            ctx.font = this.fontSize + ' Arial';
            ctx.fillText('Score: ' + score, this.x, this.y);
        }
    },
    gameOverText: {
        x: 100,
        y: 150,
        text: 'Game Over',
        color: '#FF0000',
        draw: function(ctx) {
            ctx.fillStyle = this.color;
            ctx.font = '48px Arial';
            ctx.fillText(this.text, this.x, this.y);
        }
    }
};

export default uiElements;