export default class SocialUI {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
    }

    create(score, shareMessage) {
        // Create container for all social UI elements
        this.container = this.scene.add.container(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 50);
        
        // Create social sharing buttons
        this.createSocialButtons(shareMessage);
        
        // Create email capture form
        this.createEmailForm(score);
    }

    createSocialButtons(shareMessage) {
        const encodedMessage = encodeURIComponent(shareMessage);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
        
        // Create Twitter share button
        const twitterButton = this.createButton(-100, 0, 'Share on Twitter', '#1DA1F2', () => {
            window.open(twitterUrl, '_blank');
        });

        // Create copy link button
        const copyButton = this.createButton(100, 0, 'Copy Link', '#4CAF50', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                // Show copied confirmation
                this.showCopiedMessage();
            });
        });

        this.container.add([twitterButton, copyButton]);
    }

    createButton(x, y, text, color, callback) {
        const buttonWidth = 160;
        const buttonHeight = 40;
        
        const button = this.scene.add.container(x, y);
        
        // Button background
        const bg = this.scene.add.rectangle(0, 0, buttonWidth, buttonHeight, 
            Phaser.Display.Color.HexStringToColor(color).color
        );
        bg.setStrokeStyle(2, 0x000000);
        
        // Button text
        const buttonText = this.scene.add.text(0, 0, text, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        button.add([bg, buttonText]);
        
        // Make interactive
        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.scene.tweens.add({
                    targets: button,
                    scale: 1.1,
                    duration: 100
                });
            })
            .on('pointerout', () => {
                this.scene.tweens.add({
                    targets: button,
                    scale: 1,
                    duration: 100
                });
            })
            .on('pointerdown', callback);
            
        return button;
    }

    createEmailForm(score) {
        // Email capture container
        const emailContainer = this.scene.add.container(0, 80);
        
        // Email input background
        const inputBg = this.scene.add.rectangle(0, 0, 300, 40, 0xffffff);
        inputBg.setStrokeStyle(2, 0x000000);
        
        // Create HTML input element
        const input = document.createElement('input');
        input.type = 'email';
        input.placeholder = 'Enter your email for updates';
        input.style = `
            position: absolute;
            width: 280px;
            height: 30px;
            font-size: 16px;
            padding: 5px;
            border: none;
            outline: none;
        `;
        
        // Add input to DOM
        document.body.appendChild(input);
        
        // Position input element
        const bounds = inputBg.getBounds();
        input.style.left = bounds.x + 'px';
        input.style.top = bounds.y + 'px';
        
        // Submit button
        const submitButton = this.createButton(0, 50, 'Get Updates', '#673AB7', () => {
            if (input.value && input.value.includes('@')) {
                // Here you would typically send this to your backend
                console.log('Email submitted:', input.value);
                localStorage.setItem('playerEmail', input.value);
                this.showThankYouMessage();
            }
        });
        
        emailContainer.add([inputBg, submitButton]);
        this.container.add(emailContainer);
        
        // Store input reference for cleanup
        this.emailInput = input;
    }

    showCopiedMessage() {
        const message = this.scene.add.text(0, -50, 'Link Copied!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#4CAF50'
        }).setOrigin(0.5);
        
        this.container.add(message);
        
        this.scene.tweens.add({
            targets: message,
            y: -80,
            alpha: 0,
            duration: 1500,
            onComplete: () => message.destroy()
        });
    }

    showThankYouMessage() {
        const message = this.scene.add.text(0, 130, 'Thanks for subscribing!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#4CAF50'
        }).setOrigin(0.5);
        
        this.container.add(message);
        
        this.scene.tweens.add({
            targets: message,
            y: 100,
            alpha: 0,
            duration: 2000,
            onComplete: () => message.destroy()
        });
    }

    destroy() {
        // Remove email input from DOM
        if (this.emailInput && this.emailInput.parentNode) {
            this.emailInput.parentNode.removeChild(this.emailInput);
        }
        
        // Destroy container and all its children
        if (this.container) {
            this.container.destroy();
        }
    }
}
