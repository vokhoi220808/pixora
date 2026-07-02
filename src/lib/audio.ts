declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

class AudioSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // We defer initialization until the first interaction to comply with browser autoplay policies
  }

  private init() {
    if (!this.ctx) {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) return;
      this.ctx = new AudioContextCtor();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggle(enable: boolean) {
    this.enabled = enable;
  }

  public isEnabled() {
    return this.enabled;
  }

  // A tiny beep for when the user is drawing
  public playDraw() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(200 + Math.random() * 50, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.015, this.ctx.currentTime); // Very quiet
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // A higher pitch click for UI interactions
  public playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // A happy success sound for exports
  public playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Note 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "square";
    osc1.frequency.setValueAtTime(440, t);
    gain1.gain.setValueAtTime(0.05, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.1);

    // Note 2
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(659.25, t + 0.1); // E5
    gain2.gain.setValueAtTime(0.05, t + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.1);
    osc2.stop(t + 0.4);
  }
}

export const audio = new AudioSystem();
