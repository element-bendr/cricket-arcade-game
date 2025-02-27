const gameMusic = new Audio('path/to/your/background-music.mp3');

function playMusic() {
    gameMusic.loop = true;
    gameMusic.play();
}

function pauseMusic() {
    gameMusic.pause();
}

function stopMusic() {
    gameMusic.pause();
    gameMusic.currentTime = 0;
}

export { playMusic, pauseMusic, stopMusic };