import { soundManager } from '../audio/SoundManager.js';
import ParticleManager from '../effects/ParticleManager.js';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Initialize particle manager
        this.particles = new ParticleManager(this);

        // Create background with gradient
        this.createBackground();

        // Create animated cricket logo/icon
        this.createLogo(centerX, centerY - 120);

        // Add title text with animation
        this.createTitle(centerX, centerY - 50);

        // Add instructions with effects
        this.createInstructions(centerX, centerY + 50);

        // Add high score display
        this.createHighScoreDisplay(centerX, centerY + 120);

        // Add input handlers
        this.setupInputHandlers();
    }

    createBackground() {
        // Create animated gradient background
        const gradient = this.add.graphics();
        const color1 = Phaser.Display.Color.ValueToColor(0x1a4c25);
        const color2 = Phaser.Display.Color.ValueToColor(0x2a6c35);

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

    createLogo(x, y) {
        const bat = this.add.sprite(x - 30, y, 'bat');
        const ball = this.add.sprite(x + 30, y, 'ball');

        // Animate bat
        this.tweens.add({
            targets: bat,
            angle: 15,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });

        // Animate ball
        this.tweens.add({
            targets: ball,
            y: y - 20,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });
    }

    createTitle(x, y) {
        const titleText = this.add.text(x, y, 'Cricket Arcade', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Add shine animation
        this.tweens.add({
            targets: titleText,
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });

        // Add scale pulse on hover
        titleText.setInteractive()
            .on('pointerover', () => {
                this.tweens.add({
                    targets: titleText,
                    scale: 1.1,
                    duration: 200
                });
            })
            .on('pointerout', () => {
                this.tweens.add({
                    targets: titleText,
                    scale: 1,
                    duration: 200
                });
            });
    }

    createInstructions(x, y) {
        const startText = this.add.text(x, y, 'Press SPACE to Start', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Add floating animation
        this.tweens.add({
            targets: startText,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });

        // Add alpha pulse
        this.tweens.add({
            targets: startText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });
    }

    createHighScoreDisplay(x, y) {
        const highScore = localStorage.getItem('cricketHighScore') || 0;
        const highScoreText = this.add.text(x, y, `High Score: ${highScore}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffdd00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Add subtle glow effect
        this.tweens.add({
            targets: highScoreText,
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });
    }

    setupInputHandlers() {
        // Start game on space or click/tap
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());
        this.input.on('pointerdown', () => this.startGame());

        // Add hover effects to the entire scene
        this.input.on('pointermove', (pointer) => {
            const particles = this.particles.createBoundaryEffect(
                pointer.x,
                pointer.y,
                0x4CAF50
            );
            particles.setAlpha(0.3);
        });
    }

    startGame() {
        // Add transition effect
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene');
        });
    }
}
