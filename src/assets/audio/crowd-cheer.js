const crowdCheer = new Audio('path/to/crowd-cheer.mp3');

function playCrowdCheer() {
    crowdCheer.currentTime = 0; // Reset to the start
    crowdCheer.play();
}

export { playCrowdCheer };