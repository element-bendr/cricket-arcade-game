class Field {
    constructor() {
        this.width = 800;
        this.height = 400;
        this.color = '#4CAF50'; // Green color for the field
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        this.drawBoundary(ctx);
    }

    drawBoundary(ctx) {
        ctx.strokeStyle = '#FFFFFF'; // White color for boundary
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, this.width, this.height);
    }
}

export default Field;