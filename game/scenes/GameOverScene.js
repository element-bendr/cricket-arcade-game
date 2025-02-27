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
        this.socialUI = new SocialUI(this);

        // Create background with gradient and animations
        this.createBackground();
        this.createGameOverDisplay(centerX, centerY);
        this.createScoreDisplay(centerX, centerY);
        this.createSocialFeatures();
        this.setupRestartHandler(centerX, centerY);
    }

    createGameOverDisplay(centerX, centerY) {
        // Add animated game over text
        const gameOverText = this.add.text(centerX, centerY - 150, 'GAME OVER', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setScale(0);

        // Create dramatic entrance animation
        this.tweens.add({
            targets: gameOverText,
            scale: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.Out'
        });

        // Add pulsing effect after bounce
        this.tweens.add({
            targets: gameOverText,
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut',
            delay: 1000
        });
    }

    createScoreDisplay(centerX, centerY) {
        // Show final score with particle effects
        const scoreContainer = this.add.container(centerX, centerY - 50);
        
        const scoreText = this.add.text(0, 0, `Final Score: ${this.score}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        scoreContainer.add(scoreText);

        // Show high score with effects
        const highScore = localStorage.getItem('cricketHighScore') || 0;
        const isNewHighScore = this.score > highScore;

        if (isNewHighScore) {
            this.createNewHighScoreEffect(centerX, centerY);
        } else {
            this.add.text(centerX, centerY, `High Score: ${highScore}`, {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        }
    }

    createNewHighScoreEffect(centerX, centerY) {
        const highScoreText = this.add.text(centerX, centerY, 'NEW HIGH SCORE!', {
            fontSize: '40px',
            fontFamily: 'Arial',
            color: '#ffdd00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create celebration effects
        this.particles.createBoundaryEffect(centerX, centerY, 0xffdd00);
        soundManager.playSound('cheer', 1.0);

        // Add pulsing animation
        this.tweens.add({
            targets: highScoreText,
            scale: { from: 1, to: 1.2 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Add rotating particles
        this.particles.createBoundaryEffect(centerX, centerY - 30, 0xffdd00);
        this.particles.createBoundaryEffect(centerX, centerY + 30, 0xff8800);
    }

    createSocialFeatures() {
        // Initialize social UI with animations
        this.socialUI.create(this.score);

        // Add floating animation to social container
        this.tweens.add({
            targets: this.socialUI.container,
            y: '+=10',
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });
    }

    setupRestartHandler(centerX, centerY) {
        const restartText = this.add.text(centerX, centerY + 200, 'Press SPACE to Play Again', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Add floating animation
        this.tweens.add({
            targets: restartText,
            alpha: { from: 0.5, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Handle restart with cleanup
        this.input.keyboard.once('keydown-SPACE', () => {
            this.cleanupAndRestart();
        });
    }

    cleanupAndRestart() {
        if (this.socialUI) {
            this.socialUI.destroy();
        }
        this.scene.start('GameScene');
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
