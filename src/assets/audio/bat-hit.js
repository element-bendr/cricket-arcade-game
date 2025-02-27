const batHitSound = new Audio('path/to/bat-hit-sound.mp3');

function playBatHit() {
    batHitSound.currentTime = 0; // Reset sound to start
    batHitSound.play();
}

export { playBatHit };