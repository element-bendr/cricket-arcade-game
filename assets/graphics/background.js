const background = {
    color: '#87CEEB', // Sky blue color for the background
    draw: function(ctx) {
        // Fill the background with the specified color
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw the ground
        ctx.fillStyle = '#8B4513'; // Brown color for the ground
        ctx.fillRect(0, ctx.canvas.height - 50, ctx.canvas.width, 50);
        
        // Draw some clouds
        this.drawCloud(ctx, 100, 50);
        this.drawCloud(ctx, 300, 80);
        this.drawCloud(ctx, 500, 40);
    },
    drawCloud: function(ctx, x, y) {
        ctx.fillStyle = '#FFFFFF'; // White color for clouds
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, y - 10, 20, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
};

export default background;