// Check if Phaser is available
if (typeof Phaser === 'undefined') {
  console.error('Phaser is not loaded! Game cannot start.');
  document.getElementById('loading-message').innerText = 
    'Error: Phaser library is not available.';
} else {
  console.log('Phaser version:', Phaser.VERSION);
  
  // Game configuration
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#1a4c25',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  // Start the game
  const game = new Phaser.Game(config);

  // Game variables
  let player;
  let balls;
  let cursors;
  let score = 0;
  let scoreText;

  function preload() {
    console.log('Game preload started');
    
    // Create a loading text
    const loadingText = this.add.text(400, 300, 'Loading...', { 
      fontSize: '32px', 
      fill: '#ffffff' 
    });
    loadingText.setOrigin(0.5);
    
    // Create simple textures instead of loading files
    createTextures(this);
  }

  function create() {
    console.log('Game create started');
    
    // Hide the loading message once the game starts
    document.getElementById('loading-message').style.display = 'none';
    
    // Add field background
    this.add.rectangle(400, 300, 800, 600, 0x1a4c25);
    
    // Add pitch
    this.add.rectangle(400, 300, 100, 600, 0x9c9a6d);
    
    // Draw crease lines
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xffffff);
    
    // Batting crease
    graphics.strokeRect(350, 500, 100, 5);
    
    // Bowling crease
    graphics.strokeRect(350, 100, 100, 5);
    
    // Add bat (player)
    player = this.physics.add.image(400, 550, 'bat');
    player.setCollideWorldBounds(true);
    player.body.allowGravity = false;
    player.setImmovable(true);
    
    // Add ball group
    balls = this.physics.add.group();
    
    // Add score text
    scoreText = this.add.text(16, 16, 'Score: 0', { 
      fontSize: '32px', 
      fill: '#ffffff' 
    });
    
    // Set up collision between bat and balls
    this.physics.add.collider(player, balls, hitBall, null, this);
    
    // Set up keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
    
    // Create a ball every 2 seconds
    this.time.addEvent({
      delay: 2000,
      callback: createBall,
      callbackScope: this,
      loop: true
    });
    
    // For debugging - create initial ball
    createBall.call(this);
    
    console.log('Game create completed');
  }

  function update() {
    // Move the bat with keyboard
    if (cursors.left.isDown) {
      player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
      player.setVelocityX(300);
    } else {
      player.setVelocityX(0);
    }
    
    // Check for balls that have gone past the bottom
    balls.getChildren().forEach(ball => {
      if (ball.y > 600) {
        ball.destroy();
      }
    });
  }

  function createBall() {
    console.log('Creating a ball');
    const x = Phaser.Math.Between(100, 700);
    const ball = balls.create(x, 0, 'ball');
    ball.setBounce(0.7);
    ball.setCollideWorldBounds(true);
    ball.setVelocity(Phaser.Math.Between(-100, 100), 100);
    ball.wasHit = false;
  }

  function hitBall(player, ball) {
    if (ball.wasHit) return;
    
    console.log('Ball hit!');
    ball.wasHit = true;
    ball.setVelocityY(-300);
    
    // Update score
    score += 1;
    scoreText.setText('Score: ' + score);
    
    // Show run text
    this.add.text(ball.x, ball.y - 20, '+1', { 
      fontSize: '24px', 
      fill: '#ffffff' 
    }).setOrigin(0.5);
  }

  function createTextures(scene) {
    console.log('Creating textures');
    
    // Create bat texture
    const batTexture = scene.textures.createCanvas('bat', 20, 80);
    const batCtx = batTexture.getContext();
    batCtx.fillStyle = '#b87333'; // Brown for cricket bat
    batCtx.fillRect(0, 0, 20, 80);
    batTexture.refresh();
    
    // Create ball texture
    const ballTexture = scene.textures.createCanvas('ball', 20, 20);
    const ballCtx = ballTexture.getContext();
    ballCtx.fillStyle = '#cc0000'; // Red for cricket ball
    ballCtx.beginPath();
    ballCtx.arc(10, 10, 10, 0, Math.PI * 2);
    ballCtx.fill();
    ballTexture.refresh();
    
    console.log('Textures created');
  }
}