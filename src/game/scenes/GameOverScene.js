import SocialUI from '../ui/SocialUI.js';
import { soundManager } from '../audio/SoundManager.js';
import ParticleManager from '../effects/ParticleManager.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score || 0;
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Initialize managers
        this.particles = new ParticleManager(this);

        // Create background with gradient
        this.createBackground();

        // Add Game Over text with animation
        const gameOverText = this.add.text(centerX, centerY - 150, 'GAME OVER', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Animate game over text
        this.tweens.add({
            targets: gameOverText,
            scale: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce'
        });

        // Show final score with particles
        const scoreText = this.add.text(centerX, centerY - 50, `Final Score: ${this.score}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Show high score
        const highScore = localStorage.getItem('cricketHighScore') || 0;
        const isNewHighScore = this.score > highScore;

        if (isNewHighScore) {
            const highScoreText = this.add.text(centerX, centerY, 'NEW HIGH SCORE!', {
                fontSize: '40px',
                fontFamily: 'Arial',
                color: '#ffdd00',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);

            // Create celebratory particle effects
            this.particles.createBoundaryEffect(centerX, centerY, 0xffdd00);
            soundManager.playSound('cheer', 1.0);

            this.tweens.add({
                targets: highScoreText,
                scale: { from: 1, to: 1.2 },
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        } else {
            this.add.text(centerX, centerY, `High Score: ${highScore}`, {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        }

        // Initialize social UI
        this.socialUI = new SocialUI(this);
        this.socialUI.create(this.score);

        // Add restart prompt with animation
        const restartText = this.add.text(centerX, centerY + 200, 'Press SPACE to Play Again', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: restartText,
            alpha: { from: 0.5, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Handle restart input
        this.input.keyboard.once('keydown-SPACE', () => {
            if (this.socialUI) {
                this.socialUI.destroy();
            }
            this.scene.start('GameScene');
        });
    }

    createBackground() {
        const gradient = this.add.graphics();
        const color1 = Phaser.Display.Color.ValueToColor(0x1a1a1a);
        const color2 = Phaser.Display.Color.ValueToColor(0x4a4a4a);

        for (let y = 0; y < this.cameras.main.height; y++) {
            const t = y / this.cameras.main.height;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                color1, color2, 100, t * 100
            );
            gradient.lineStyle(1, color.color, 1);
            gradient.lineBetween(0, y, this.cameras.main.width, y);
        }
    }
}
