class ScoreBoard {
    constructor() {
        this.score = 0;
        this.highScore = 0;
    }

    increaseScore(points) {
        this.score += points;
        this.updateHighScore();
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    resetScore() {
        this.score = 0;
    }

    displayScore(context) {
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText(`Score: ${this.score}`, 10, 20);
        context.fillText(`High Score: ${this.highScore}`, 10, 40);
    }
}

export default ScoreBoard;