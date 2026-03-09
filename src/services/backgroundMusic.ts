class BackgroundMusic {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private volume = 0.3;

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    // Create audio element
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = 'auto';
    
    // Set music file with cache-busting timestamp
    const timestamp = Date.now();
    this.audio.src = `/background-music.mp3?t=${timestamp}`; // Add your music file here
    
    // Handle user interaction for autoplay
    this.setupAutoplay();
  }

  private setupAutoplay() {
    // Try to play immediately (might be blocked by browser)
    this.play().catch(() => {
      // If blocked, wait for user interaction
      document.addEventListener('click', () => this.play(), { once: true });
      document.addEventListener('keydown', () => this.play(), { once: true });
      document.addEventListener('mousemove', () => this.play(), { once: true });
    });
  }

  async play(): Promise<void> {
    if (!this.audio) return;
    
    try {
      await this.audio.play();
      this.isPlaying = true;
      console.log('🎵 Background music started');
    } catch (error) {
      console.log('🎵 Music autoplay blocked, waiting for user interaction');
    }
  }

  pause(): void {
    if (!this.audio) return;
    
    this.audio.pause();
    this.isPlaying = false;
    console.log('🎵 Background music paused');
  }

  toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(level: number): void {
    this.volume = Math.max(0, Math.min(1, level));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Create singleton instance
export const backgroundMusic = new BackgroundMusic();
