import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SPEED } from '../constants.js';
import { soundManager } from '../audio/SoundManager.js';
import ParticleManager from '../effects/ParticleManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.gameOver = false;
    }

    create() {
        // Initialize particle manager
        this.particles = new ParticleManager(this);

        // Create field background
        this.drawCricketField();
        
        // Add bat (player)
        this.player = this.physics.add.sprite(400, 550, 'bat');
        this.player.setCollideWorldBounds(true);
        this.player.body.allowGravity = false;
        this.player.setImmovable(true);
        
        // Create ball group
        this.balls = this.physics.add.group();
        
        // Add score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        
        // Setup collision between bat and balls
        this.physics.add.collider(this.player, this.balls, this.hitBall, null, this);
        
        // Setup keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Create balls periodically
        this.ballInterval = 2000;
        this.time.addEvent({
            delay: this.ballInterval,
            callback: this.createBall,
            callbackScope: this,
            loop: true
        });

        // Add mouse/touch controls
        this.input.on('pointermove', (pointer) => {
            if (!this.gameOver) {
                this.player.x = Phaser.Math.Clamp(pointer.x, 50, GAME_WIDTH - 50);
            }
        });
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Keyboard controls
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        // Check for missed balls
        this.balls.getChildren().forEach(ball => {
            if (ball.y > 600 && !ball.wasHit) {
                this.endGame();
            }
        });
    }

    createBall() {
        if (this.gameOver) return;

        const x = Phaser.Math.Between(100, 700);
        const ball = this.balls.create(x, 0, 'ball');
        ball.setBounce(0.7);
        ball.setCollideWorldBounds(true);
        ball.setVelocity(Phaser.Math.Between(-100, 100), 200);
        ball.wasHit = false;
    }

    hitBall(player, ball) {
        if (ball.wasHit) return;
        
        ball.wasHit = true;
        
        // Calculate runs based on hit position
        let runs = 1;
        const hitQuality = Math.random();
        
        if (hitQuality > 0.9) {
            runs = 6;
        } else if (hitQuality > 0.7) {
            runs = 4;
        } else if (hitQuality > 0.5) {
            runs = 2;
        }
        
        // Update score
        this.score += runs;
        this.scoreText.setText('Score: ' + this.score);
        
        // Create visual effects for runs
        this.particles.createRunsText(ball.x, ball.y, runs);
        
        // Make ball fly away
        ball.setVelocityY(-300);
        ball.setVelocityX((ball.x - player.x) * 2);
        
        // Play hit sound
        soundManager.playSound('hit', 0.5);
        
        // Play cheer for boundaries
        if (runs >= 4) {
            soundManager.playSound('cheer', 0.8);
        }
        
        // Cleanup ball after delay
        this.time.delayedCall(1000, () => {
            ball.destroy();
        });
    }

    endGame() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        this.physics.pause();
        
        // Save high score
        const highScore = localStorage.getItem('cricketHighScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('cricketHighScore', this.score);
        }
        
        // Switch to game over scene
        this.scene.start('GameOverScene', { score: this.score });
    }

    drawCricketField() {
        // Draw main field
        this.add.rectangle(400, 300, 800, 600, 0x1a4c25);
        
        // Draw pitch
        this.add.rectangle(400, 300, 100, 600, 0x9c9a6d);
        
        // Draw crease lines
        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0xffffff);
        
        // Batting crease
        graphics.strokeRect(350, 500, 100, 5);
        
        // Bowling crease
        graphics.strokeRect(350, 100, 100, 5);
        
        // Draw boundary
        graphics.lineStyle(5, 0xffffff);
        graphics.beginPath();
        graphics.arc(400, 300, 380, 0, Math.PI * 2);
        graphics.stroke();
    }
}
