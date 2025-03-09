class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private currentUrl: string = '';

  constructor() {
    this.audio = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      // Emit time update event if needed
    });

    this.audio.addEventListener('ended', () => {
      // Handle track end
    });
  }

  public async play(url: string): Promise<void> {
    if (!this.audio) return;

    if (this.currentUrl !== url) {
      this.currentUrl = url;
      this.audio.src = url;
    }

    try {
      await this.audio.play();
    } catch (error) {
      console.error('Playback error:', error);
    }
  }

  public pause(): void {
    this.audio?.pause();
  }

  public stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  public setVolume(value: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, value));
    }
  }

  public getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  public getDuration(): number {
    return this.audio?.duration || 0;
  }

  public seekTo(time: number): void {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
    }
  }
}

export const audioPlayer = new AudioPlayer();
export default audioPlayer;
