export default class ParticleManager {
    constructor(scene) {
        this.scene = scene;
    }

    createBoundaryEffect(x, y, color) {
        const particles = this.scene.add.particles(0, 0, 'ball', {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            lifespan: 800,
            blendMode: 'ADD',
            tint: color,
            quantity: 1,
            frequency: 50,
            maxParticles: 15
        });

        particles.setPosition(x, y);
        
        // Auto-destroy after animation
        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });

        return particles;
    }

    createScreenShake(intensity = 0.01, duration = 100) {
        const originalX = this.scene.cameras.main.scrollX;
        const originalY = this.scene.cameras.main.scrollY;

        this.scene.tweens.add({
            targets: this.scene.cameras.main,
            scrollX: { from: originalX - 10 * intensity, to: originalX },
            scrollY: { from: originalY - 10 * intensity, to: originalY },
            duration: duration,
            ease: 'Bounce.easeInOut',
            yoyo: true
        });
    }

    createRunsText(x, y, runs) {
        const styles = {
            4: {
                text: 'FOUR!',
                color: '#00ff00',
                size: '48px',
                particle: 0x00ff00
            },
            6: {
                text: 'SIX!',
                color: '#ffdd00',
                size: '64px',
                particle: 0xffdd00
            }
        };

        const style = styles[runs] || {
            text: `+${runs}`,
            color: '#ffffff',
            size: '32px',
            particle: 0xffffff
        };

        // Create text
        const text = this.scene.add.text(x, y - 20, style.text, {
            fontSize: style.size,
            fontFamily: 'Arial',
            color: style.color,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create particles for 4s and 6s
        if (runs >= 4) {
            this.createBoundaryEffect(x, y, style.particle);
            this.createScreenShake(runs === 6 ? 0.02 : 0.01);
        }

        // Animate text
        this.scene.tweens.add({
            targets: text,
            y: text.y - 100,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }
}
