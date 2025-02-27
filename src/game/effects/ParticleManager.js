export default class ParticleManager {
    constructor(scene) {
        this.scene = scene;
    }

    createRunsText(x, y, runs) {
        const text = this.scene.add.text(x, y, `+${runs}`, {
            fontSize: runs >= 4 ? '48px' : '32px',
            fontFamily: 'Poppins',
            color: runs >= 6 ? '#FFD700' : runs >= 4 ? '#4CAF50' : '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Add glow effect for boundaries
        if (runs >= 4) {
            text.setTint(runs === 6 ? 0xffd700 : 0x4CAF50);
            text.preFX.addGlow(runs === 6 ? 0xffd700 : 0x4CAF50, 8);
        }

        // Float upward and fade out
        this.scene.tweens.add({
            targets: text,
            y: y - 100,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    createScreenShake(intensity) {
        this.scene.cameras.main.shake(250, intensity);
    }

    createBoundaryEffect(x, y, color) {
        // Create circular particle explosion
        const particles = this.scene.add.particles(x, y, 'ball', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            tint: color,
            lifespan: 800,
            gravityY: 300,
            quantity: 20,
            emitting: false
        });

        // Emit particles in a circular pattern
        particles.explode(20);

        // Create a radial light flash
        const flash = this.scene.add.circle(x, y, 50, color, 0.6);
        flash.setBlendMode('ADD');

        // Animate the flash
        this.scene.tweens.add({
            targets: flash,
            radius: 100,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });

        // Clean up particles after animation
        this.scene.time.delayedCall(800, () => particles.destroy());
    }

    createBatSwingEffect(x, y, angle) {
        // Create arc-shaped particle trail
        const particles = this.scene.add.particles(x, y, 'ball', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            tint: 0xffffff,
            lifespan: 300,
            angle: { min: angle - 30, max: angle + 30 },
            emitting: false
        });

        // Emit particles in an arc
        particles.explode(10);

        // Clean up after animation
        this.scene.time.delayedCall(300, () => particles.destroy());
    }

    createCelebrationEffect(x, y) {
        // Create multiple particle systems for a festive effect
        const colors = [0xffd700, 0x4CAF50, 0x2196F3];
        
        colors.forEach((color, index) => {
            const particles = this.scene.add.particles(x, y, 'ball', {
                speed: { min: 200, max: 400 },
                scale: { start: 0.4, end: 0 },
                blendMode: 'ADD',
                tint: color,
                lifespan: 1000,
                gravityY: 500,
                angle: { min: -120 + index * 60, max: -60 + index * 60 },
                quantity: 5,
                frequency: 50,
                emitting: true
            });

            // Stop emitting and cleanup after 1 second
            this.scene.time.delayedCall(1000, () => {
                particles.stopFollow();
                particles.stop();
                this.scene.time.delayedCall(1000, () => particles.destroy());
            });
        });
    }

    createPowerupEffect(target) {
        // Create circular glow effect
        const glow = this.scene.add.circle(target.x, target.y, 30, 0x4CAF50, 0.3);
        glow.setBlendMode('ADD');

        // Make the glow follow the target
        this.scene.tweens.add({
            targets: glow,
            radius: 40,
            alpha: 0.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Add particle trail
        const particles = this.scene.add.particles(target.x, target.y, 'ball', {
            speed: 100,
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            tint: 0x4CAF50,
            lifespan: 300,
            follow: target
        });

        return { glow, particles };
    }

    createSparkEffect(x, y) {
        // Create quick spark flash
        const spark = this.scene.add.particles(x, y, 'ball', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            tint: 0xffffff,
            lifespan: 200,
            gravityY: 0,
            quantity: 5,
            emitting: false
        });

        // Emit particles in all directions
        spark.explode(5);

        // Clean up
        this.scene.time.delayedCall(200, () => spark.destroy());
    }
}
