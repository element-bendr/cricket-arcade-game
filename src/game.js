import TitleScene from './game/scenes/TitleScene.js';
import GameScene from './game/scenes/GameScene.js';
import GameOverScene from './game/scenes/GameOverScene.js';
import { GAME_WIDTH, GAME_HEIGHT } from './game/constants.js';

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.createTextures();
    }

    create() {
        this.scene.start('TitleScene');
    }

    createTextures() {
        // Create bat texture
        const batTexture = this.textures.createCanvas('bat', 30, 80);
        const batCtx = batTexture.getContext();
        
        // Draw handle
        batCtx.fillStyle = '#b87333'; // Wood brown
        batCtx.fillRect(13, 0, 4, 40);
        
        // Draw blade
        batCtx.fillStyle = '#b87333';
        batCtx.fillRect(0, 40, 30, 40);
        batTexture.refresh();
        
        // Create ball texture
        const ballTexture = this.textures.createCanvas('ball', 20, 20);
        const ballCtx = ballTexture.getContext();
        
        // Draw cricket ball
        ballCtx.fillStyle = '#cc0000'; // Red
        ballCtx.beginPath();
        ballCtx.arc(10, 10, 10, 0, Math.PI * 2);
        ballCtx.fill();
        
        // Add seam
        ballCtx.strokeStyle = '#ffffff';
        ballCtx.lineWidth = 2;
        ballCtx.beginPath();
        ballCtx.arc(10, 10, 8, 0, Math.PI);
        ballCtx.stroke();
        ballTexture.refresh();
    }

}

// Mobile device detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a4c25',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: isMobile ? 200 : 300 }, // Adjusted for mobile
            debug: false
        }
    },
    scene: [BootScene, TitleScene, GameScene, GameOverScene],
    audio: {
        disableWebAudio: false
    },
    render: {
        pixelArt: false,
        antialias: true
    }
};

// Handle window focus/blur
let gameIsPaused = false;
document.addEventListener('visibilitychange', () => {
    if (window.game) {
        if (document.hidden) {
            window.game.scene.scenes.forEach(scene => {
                if (scene.sound) {
                    scene.sound.pause();
                }
            });
            gameIsPaused = true;
        } else {
            window.game.scene.scenes.forEach(scene => {
                if (scene.sound) {
                    scene.sound.resume();
                }
            });
            gameIsPaused = false;
        }
    }
});

// Handle orientation change on mobile
if (isMobile) {
    window.addEventListener('orientationchange', () => {
        if (window.game) {
            setTimeout(() => {
                window.game.scale.refresh();
            }, 200);
        }
    });
}

// Create game instance
window.addEventListener('load', () => {
    try {
        // Create loading message
        const loadingMessage = document.createElement('p');
        loadingMessage.innerText = 'Loading game...';
        loadingMessage.className = 'loading-message';
        document.getElementById('game-container').appendChild(loadingMessage);

        // Initialize game
        window.game = new Phaser.Game(config);
        console.log('Game initialized with Phaser version:', Phaser.VERSION);

        // Remove loading message once game is ready
        window.game.events.once('ready', () => {
            loadingMessage.remove();
        });
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.getElementById('game-container').innerHTML = 
            '<p class="error-message">Error loading game. Please check console.</p>';
    }
});

// Clean up on window unload
window.addEventListener('unload', () => {
    if (window.game) {
        window.game.destroy(true);
    }
});
