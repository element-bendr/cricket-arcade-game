export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

export function resetGameState() {
    // Reset game-related variables to their initial state
    return {
        score: 0,
        isGameOver: false,
        playerPosition: { x: 0, y: 0 },
        ballPosition: { x: 0, y: 0 },
    };
}