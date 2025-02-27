export default class SocialUI {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.emailInput = null;
    }

    create(score) {
        // Create a semi-transparent background
        const bg = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 100,
            400,
            200,
            0x000000,
            0.8
        );

        // Create container for UI elements
        this.container = this.scene.add.container(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 100
        );

        // Add share button
        const shareButton = this.createButton(
            0,
            -40,
            'Share Score on Twitter',
            () => this.shareOnTwitter(score)
        );

        // Add email capture with HTML element
        this.createEmailCapture();

        this.container.add([bg, shareButton]);
    }

    createButton(x, y, text, callback) {
        const button = this.scene.add.text(x, y, text, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#1DA1F2',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5);

        button.setInteractive({ useHandCursor: true })
            .on('pointerover', () => button.setAlpha(0.8))
            .on('pointerout', () => button.setAlpha(1))
            .on('pointerdown', callback);

        return button;
    }

    createEmailCapture() {
        // Create HTML elements for email capture
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '300px';
        div.style.textAlign = 'center';
        div.innerHTML = `
            <input type="email" id="email-input" placeholder="Enter email for pro tips" 
                   style="padding: 8px; width: 200px; margin: 5px; border-radius: 4px; border: none;">
            <button id="subscribe-btn" 
                    style="padding: 8px 16px; background: #4CAF50; color: white; border: none; 
                           border-radius: 4px; cursor: pointer; margin: 5px;">
                Subscribe
            </button>
        `;

        // Position the div
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.transform = 'translate(-50%, 20px)';

        // Add to DOM
        document.getElementById('game-container').appendChild(div);
        
        // Store reference to remove later
        this.emailInput = div;

        // Add event listener
        document.getElementById('subscribe-btn').addEventListener('click', () => {
            const email = document.getElementById('email-input').value;
            if (this.isValidEmail(email)) {
                this.handleSubscribe(email);
            }
        });
    }

    handleSubscribe(email) {
        // Store email in localStorage for now
        // In a real implementation, you would send this to your server
        const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            
            // Show success message
            document.getElementById('email-input').value = '';
            document.getElementById('subscribe-btn').textContent = 'Subscribed!';
            document.getElementById('subscribe-btn').style.backgroundColor = '#45a049';
        }
    }

    shareOnTwitter(score) {
        const text = encodeURIComponent(
            `🏏 Just scored ${score} runs in Cricket Arcade! Can you beat my score? Play now:`
        );
        const url = encodeURIComponent(window.location.href);
        const hashtags = encodeURIComponent('CricketGame,ArcadeGames');
        
        window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`,
            '_blank'
        );
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    destroy() {
        if (this.emailInput && this.emailInput.parentNode) {
            this.emailInput.parentNode.removeChild(this.emailInput);
        }
        if (this.container) {
            this.container.destroy();
        }
    }
}
