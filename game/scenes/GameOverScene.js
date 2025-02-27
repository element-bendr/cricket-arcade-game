import SocialUI from '../ui/SocialUI.js';
import { soundManager } from '../audio/SoundManager.js';
import ParticleManager from '../effects/ParticleManager.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score || 0;
        this.overs = data.overs || 0;
        this.balls = data.balls || 0;
        this.strikeRate = data.strikeRate || 0;
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Initialize managers
        this.particles = new ParticleManager(this);
        this.socialUI = new SocialUI(this);

        // Create gradient background with animation
        this.createBackground();

        // Create game over display with animations
        this.createGameOverDisplay(centerX, centerY - 150);

        // Show match statistics
        this.createMatchStats(centerX, centerY - 50);

        // Add social features
        this.createSocialFeatures(centerX, centerY + 50);

        // Setup restart handler
        this.setupRestartHandler(centerX, centerY + 150);
    }

    createGameOverDisplay(x, y) {
        const gameOverText = this.add.text(x, y, 'GAME OVER', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Add dramatic entrance animation
        this.tweens.add({
            targets: gameOverText,
            scale: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.Out'
        });

        // Add pulsing effect
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

    createMatchStats(x, y) {
        const statsContainer = this.add.container(x, y);
        
        // Final score with animation
        const scoreText = this.add.text(0, 0, `Final Score: ${this.score}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Overs faced
        const oversText = this.add.text(0, 40, `Overs: ${this.overs}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Strike rate
        const strikeRateText = this.add.text(0, 80, `Strike Rate: ${this.strikeRate}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        statsContainer.add([scoreText, oversText, strikeRateText]);

        // Animate stats entrance
        this.tweens.add({
            targets: statsContainer.list,
            x: { from: -100, to: 0 },
            alpha: { from: 0, to: 1 },
            duration: 800,
            ease: 'Power2',
            delay: this.tweens.stagger(200)
        });

        // Check for new high score
        const highScore = localStorage.getItem('cricketHighScore') || 0;
        if (this.score > highScore) {
            this.createNewHighScoreEffect(x, y + 120);
        }
    }

    createNewHighScoreEffect(x, y) {
        const highScoreText = this.add.text(x, y, 'NEW HIGH SCORE!', {
            fontSize: '40px',
            fontFamily: 'Arial',
            color: '#ffdd00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create celebratory particle effects
        this.particles.createBoundaryEffect(x, y - 20, 0xffdd00);
        this.particles.createBoundaryEffect(x, y + 20, 0xff8800);
        soundManager.playSound('cheer', 1.0);

        // Add pulsing animation
        this.tweens.add({
            targets: highScoreText,
            scale: { from: 1, to: 1.2 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    createSocialFeatures(x, y) {
        // Create share message
        const shareMessage = `I scored ${this.score} runs in ${this.overs} overs with a strike rate of ${this.strikeRate}! Can you beat my score? 🏏`;
        
        // Initialize social UI with sharing options
        this.socialUI.create(this.score, shareMessage);

        // Add tooltip for social buttons
        const shareText = this.add.text(x, y - 30, 'Share your score!', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#4CAF50',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Add floating animation to share text
        this.tweens.add({
            targets: shareText,
            y: '-=10',
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });
    }

    setupRestartHandler(x, y) {
        const restartText = this.add.text(x, y, 'Press SPACE to Play Again', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Add blinking animation
        this.tweens.add({
            targets: restartText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Handle restart
        this.input.keyboard.once('keydown-SPACE', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                if (this.socialUI) {
                    this.socialUI.destroy();
                }
                this.scene.start('GameScene');
            });
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

        // Add subtle animation to background
        this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 3000,
            repeat: -1,
            yoyo: true,
            onUpdate: (tween) => {
                const t = tween.getValue();
                gradient.alpha = 0.8 + t * 0.2;
            }
        });
    }
}
