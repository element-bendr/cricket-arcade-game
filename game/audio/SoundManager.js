export default class SoundManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = new Map();
        this.createSoundEffects();
    }

    createSoundEffects() {
        // Create bat hit sound
        this.createBatHitSound();
        
        // Create crowd cheer sound
        this.createCheerSound();
    }

    createBatHitSound() {
        const hitBuffer = this.context.createBuffer(1, this.context.sampleRate * 0.1, this.context.sampleRate);
        const channelData = hitBuffer.getChannelData(0);
        
        for (let i = 0; i < hitBuffer.length; i++) {
            // Create a sharp, percussive sound for bat hit
            channelData[i] = Math.sin(440 * Math.PI * 2 * i / this.context.sampleRate) *
                            Math.exp(-5 * i / hitBuffer.length);
        }
        
        this.sounds.set('hit', hitBuffer);
    }

    createCheerSound() {
        const cheerBuffer = this.context.createBuffer(1, this.context.sampleRate * 1.5, this.context.sampleRate);
        const channelData = cheerBuffer.getChannelData(0);
        
        for (let i = 0; i < cheerBuffer.length; i++) {
            // Create a crowd cheer effect by combining multiple frequencies
            channelData[i] = (
                Math.sin(220 * Math.PI * 2 * i / this.context.sampleRate) * 0.3 +
                Math.sin(440 * Math.PI * 2 * i / this.context.sampleRate) * 0.2 +
                Math.sin(880 * Math.PI * 2 * i / this.context.sampleRate) * 0.1
            ) * Math.exp(-2 * i / cheerBuffer.length);
        }
        
        this.sounds.set('cheer', cheerBuffer);
    }

    playSound(name, volume = 1.0) {
        if (!this.sounds.has(name)) {
            console.warn(`Sound '${name}' not found`);
            return;
        }

        try {
            const source = this.context.createBufferSource();
            const gainNode = this.context.createGain();
            
            source.buffer = this.sounds.get(name);
            gainNode.gain.value = volume;
            
            source.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            source.start(0);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
}

// Create and export a singleton instance
const soundManager = new SoundManager();
export { soundManager };
