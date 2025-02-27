import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SPEED } from '../constants.js';
import { soundManager } from '../audio/SoundManager.js';
import ParticleManager from '../effects/ParticleManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.gameOver = false;
        this.totalBalls = 30; // 5 overs
        this.currentBall = 0;
        this.currentOver = 0;
        this.ballInPlay = false;
    }

    create() {
        // Initialize managers
        this.particles = new ParticleManager(this);
        
        // Set up game elements
        this.drawCricketField();
        this.setupGameObjects();
        this.setupControls();
        
        // Start first ball after delay
        this.time.delayedCall(1000, this.scheduleNextBall, [], this);
    }

    setupGameObjects() {
        // Add bat (player)
        this.player = this.physics.add.sprite(400, 550, 'bat');
        this.player.setCollideWorldBounds(true);
        this.player.body.allowGravity = false;
        this.player.setImmovable(true);
        
        // Initialize ball as null (will be created when needed)
        this.ball = null;
        
        // Add score and over information
        this.setupScoreDisplay();

        // Initialize game state
        this.score = 0;
        this.gameOver = false;
    }

    setupScoreDisplay() {
        // Create score display container
        this.scoreContainer = this.add.container(16, 16);
        
        // Add score text
        this.scoreText = this.add.text(0, 0, 'Score: 0', { 
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        
        // Add overs text
        this.oversText = this.add.text(0, 40, 'Overs: 0.0', { 
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        
        this.scoreContainer.add([this.scoreText, this.oversText]);
    }

    setupControls() {
        // Setup keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Add mouse/touch controls
        this.input.on('pointermove', (pointer) => {
            if (!this.gameOver) {
                this.player.x = Phaser.Math.Clamp(pointer.x, 50, GAME_WIDTH - 50);
            }
        });
    }

    updateOverDisplay() {
        const overs = Math.floor(this.currentBall / 6);
        const balls = this.currentBall % 6;
        this.oversText.setText(`Overs: ${overs}.${balls}`);
    }

    scheduleNextBall() {
        if (this.gameOver || this.ballInPlay) return;
        
        // Check if we've completed all overs
        if (this.currentBall >= this.totalBalls) {
            this.endGame();
            return;
        }

        // Schedule next ball delivery
        this.time.delayedCall(2000, this.createBall, [], this);
    }

    createBall() {
        if (this.gameOver || this.ballInPlay) return;

        // Create new ball
        const x = Phaser.Math.Between(300, 500);
        this.ball = this.physics.add.sprite(x, 0, 'ball');
        this.ball.setBounce(0.7);
        this.ball.setCollideWorldBounds(true);
        this.ball.setVelocity(Phaser.Math.Between(-50, 50), 200);
        this.ball.wasHit = false;

        // Set up collision with bat
        this.physics.add.overlap(this.player, this.ball, this.hitBall, null, this);
        
        // Mark ball as in play
        this.ballInPlay = true;
        this.currentBall++;
        this.updateOverDisplay();
    }

    update() {
        if (this.gameOver) return;

        // Handle keyboard controls
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        // Check for missed ball
        if (this.ball && !this.ball.wasHit && this.ball.y > 600) {
            // Game over on missed ball
            this.endGame();
        }
    }

    hitBall(player, ball) {
        if (!this.ball || this.ball.wasHit) return;
        
        this.ball.wasHit = true;
        
        // Calculate runs based on timing and position
        const hitTiming = Math.abs(this.ball.y - player.y) / 100; // 0 to 1, lower is better
        const hitPosition = Math.abs(this.ball.x - player.x) / 50; // 0 to 1, lower is better
        const hitQuality = Math.max(0, 1 - (hitTiming + hitPosition));
        
        let runs = 0;
        if (hitQuality > 0.9) {
            runs = 6;
        } else if (hitQuality > 0.7) {
            runs = 4;
        } else if (hitQuality > 0.5) {
            runs = 2;
        } else if (hitQuality > 0.2) {
            runs = 1;
        }
        
        // Update score
        if (runs > 0) {
            this.score += runs;
            this.scoreText.setText('Score: ' + this.score);
            
            // Create visual effects
            this.particles.createRunsText(ball.x, ball.y, runs);
            
            // Add effects for boundaries
            if (runs >= 4) {
                this.particles.createScreenShake(runs === 6 ? 0.02 : 0.01);
                this.particles.createBoundaryEffect(ball.x, ball.y, runs === 6 ? 0xffdd00 : 0x00ff00);
                soundManager.playSound('cheer', 0.8);
            }
            
            // Play hit sound
            soundManager.playSound('hit', 0.5);
        }
        
        // Make ball fly away
        this.ball.setVelocityY(-300);
        this.ball.setVelocityX((this.ball.x - player.x) * 2);
        
        // Clean up after delay
        this.time.delayedCall(1500, () => {
            if (this.ball) {
                this.ball.destroy();
                this.ball = null;
                this.ballInPlay = false;
                this.scheduleNextBall();
            }
        });
    }

    endGame() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        this.physics.pause();
        
        // Calculate final statistics
        const overs = Math.floor(this.currentBall / 6) + (this.currentBall % 6) / 10;
        const strikeRate = (this.score / this.currentBall * 100).toFixed(2);
        
        // Save high score
        const highScore = localStorage.getItem('cricketHighScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('cricketHighScore', this.score);
        }
        
        // Switch to game over scene with detailed stats
        this.scene.start('GameOverScene', { 
            score: this.score,
            overs: overs,
            balls: this.currentBall,
            strikeRate: strikeRate
        });
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
