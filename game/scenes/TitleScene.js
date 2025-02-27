export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        // Add title text
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            'Cricket Arcade Game',
            {
                fontFamily: 'Arial',
                fontSize: '48px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        titleText.setOrigin(0.5);

        // Add start prompt
        const startText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'Press SPACE to Start',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }
        );
        startText.setOrigin(0.5);

        // Add keyboard input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}
