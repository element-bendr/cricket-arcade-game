class Player {
    constructor(name, position) {
        this.name = name;
        this.position = position;
        this.score = 0;
        this.isBatting = false;
    }

    bat() {
        this.isBatting = true;
        // Logic for batting action
    }

    run() {
        if (this.isBatting) {
            this.score += 1; // Increment score for each run
            // Logic for running between wickets
        }
    }

    getScore() {
        return this.score;
    }

    reset() {
        this.score = 0;
        this.isBatting = false;
    }
}

export default Player;