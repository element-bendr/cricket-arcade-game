export class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.isMuted = false;

        // Load saved preferences
        this.loadPreferences();
    }

    loadPreferences() {
        const savedMusicVolume = localStorage.getItem('musicVolume');
        const savedSfxVolume = localStorage.getItem('sfxVolume');
        const savedMuted = localStorage.getItem('isMuted');

        if (savedMusicVolume !== null) this.musicVolume = parseFloat(savedMusicVolume);
        if (savedSfxVolume !== null) this.sfxVolume = parseFloat(savedSfxVolume);
        if (savedMuted !== null) this.isMuted = savedMuted === 'true';
    }

    savePreferences() {
        localStorage.setItem('musicVolume', this.musicVolume);
        localStorage.setItem('sfxVolume', this.sfxVolume);
        localStorage.setItem('isMuted', this.isMuted);
    }

    initialize(scene) {
        // Initialize background music
        this.setupBackgroundMusic(scene);

        // Initialize sound effects
        this.setupSoundEffects(scene);

        // Add audio controls to the scene
        this.addAudioControls(scene);
    }

    setupBackgroundMusic(scene) {
        const music = scene.sound.add('game-music', {
            volume: this.musicVolume * (this.isMuted ? 0 : 1),
            loop: true
        });
        this.sounds.set('music', music);
    }

    setupSoundEffects(scene) {
        // Bat hit sounds with variations
        const hitSounds = [
            scene.sound.add('bat-hit', { volume: this.sfxVolume }),
            scene.sound.add('bat-hit-strong', { volume: this.sfxVolume }),
            scene.sound.add('bat-hit-weak', { volume: this.sfxVolume })
        ];
        this.sounds.set('hit', hitSounds);

        // Crowd sounds
        const crowdSounds = [
            scene.sound.add('crowd-cheer', { volume: this.sfxVolume }),
            scene.sound.add('crowd-ooh', { volume: this.sfxVolume }),
            scene.sound.add('crowd-celebration', { volume: this.sfxVolume })
        ];
        this.sounds.set('crowd', crowdSounds);

        // UI sounds
        this.sounds.set('click', scene.sound.add('click', { volume: this.sfxVolume * 0.5 }));
        this.sounds.set('hover', scene.sound.add('hover', { volume: this.sfxVolume * 0.3 }));
    }

    addAudioControls(scene) {
        // Add volume control UI elements
        const musicIcon = scene.add.image(750, 30, 'audio-icons', this.isMuted ? 1 : 0)
            .setInteractive()
            .setScale(0.8)
            .on('pointerdown', () => this.toggleMute());

        // Add to scene for reference
        scene.musicIcon = musicIcon;
    }

    playMusic() {
        const music = this.sounds.get('music');
        if (music && !music.isPlaying) {
            music.play();
        }
    }

    stopMusic() {
        const music = this.sounds.get('music');
        if (music && music.isPlaying) {
            music.stop();
        }
    }

    playSound(key, variation = 0) {
        if (this.isMuted) return;

        const sound = this.sounds.get(key);
        if (Array.isArray(sound)) {
            // For sound variations, play random or specific variation
            const index = variation === 'random' ? 
                Math.floor(Math.random() * sound.length) : 
                variation % sound.length;
            sound[index].play();
        } else if (sound) {
            sound.play();
        }
    }

    playCrowdReaction(type) {
        if (this.isMuted) return;

        const crowdSounds = this.sounds.get('crowd');
        if (!crowdSounds) return;

        switch (type) {
            case 'cheer':
                crowdSounds[0].play();
                break;
            case 'ooh':
                crowdSounds[1].play();
                break;
            case 'celebration':
                crowdSounds[2].play();
                break;
        }
    }

    playBatHit(hitQuality) {
        if (this.isMuted) return;

        const hitSounds = this.sounds.get('hit');
        if (!hitSounds) return;

        // Play appropriate hit sound based on quality
        if (hitQuality > 0.8) {
            hitSounds[1].play(); // Strong hit
        } else if (hitQuality > 0.3) {
            hitSounds[0].play(); // Normal hit
        } else {
            hitSounds[2].play(); // Weak hit
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateVolumes();
        this.savePreferences();
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
        this.savePreferences();
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
        this.savePreferences();
    }

    updateVolumes() {
        const effectiveMusic = this.musicVolume * (this.isMuted ? 0 : 1);
        const effectiveSFX = this.sfxVolume * (this.isMuted ? 0 : 1);

        this.sounds.forEach((sound) => {
            if (Array.isArray(sound)) {
                sound.forEach(s => s.setVolume(effectiveSFX));
            } else {
                const isMusic = sound === this.sounds.get('music');
                sound.setVolume(isMusic ? effectiveMusic : effectiveSFX);
            }
        });
    }

    destroy() {
        this.stopMusic();
        this.sounds.clear();
    }
}

// Create and export a singleton instance
export const soundManager = new SoundManager();
