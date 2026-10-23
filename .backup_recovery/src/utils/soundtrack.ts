// Web Audio API Indian Classical Wedding Ambience (Tanpura Drone & Sacred Flute)
class RoyalAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private timerIds: number[] = [];

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public play() {
    this.init();
    if (!this.ctx) return;
    if (this.isPlaying) return;

    this.isPlaying = true;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 2.5);
    this.masterGain.connect(this.ctx.destination);

    // 1. Tanpura Drone (Sa, Pa, Sa', Sa)
    // Root key: C#3 (~138.59 Hz)
    const rootSa = 138.59;
    const pa = rootSa * 1.5; // G#3 (207.89 Hz)
    const highSa = rootSa * 2; // C#4 (277.18 Hz)

    this.startTanpuraDrone([pa, highSa, highSa, rootSa]);

    // 2. Bansuri / Flute Raga Yaman Swaras (Ni Re Ga Ma# Dha Ni Sa')
    this.startFluteMelody(rootSa);
  }

  private startTanpuraDrone(frequencies: number[]) {
    if (!this.ctx || !this.masterGain) return;

    frequencies.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.4, this.ctx.currentTime);

      // Lowpass warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650 + i * 80, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      // Rhythmic strumming swell cycle (every ~3.5 seconds)
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.02, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);

      // Pulse tanpura strings with staggered envelopes
      const intervalId = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(0.02, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.02, t + 3.2);
      }, 3400 + i * 900);

      this.timerIds.push(intervalId);
    });
  }

  private startFluteMelody(baseFreq: number) {
    if (!this.ctx || !this.masterGain) return;

    // Raga Yaman intervals: S, R2 (9/8), G3 (5/4), M2 (45/32), P (3/2), D2 (5/3), N3 (15/8), S' (2)
    const swaras = [
      baseFreq * 2,          // Sa' (C#4)
      baseFreq * 1.875 * 2,  // Ni  (C4)
      baseFreq * 1.666 * 2,  // Dha (A#3)
      baseFreq * 1.5 * 2,    // Pa  (G#3)
      baseFreq * 1.406 * 2,  // Ma# (G3)
      baseFreq * 1.25 * 2,   // Ga  (F3)
      baseFreq * 1.125 * 2,   // Re  (D#3)
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Gentle vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(4.8, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(4.0, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      osc.type = 'sine';
      const targetPitch = swaras[noteIdx % swaras.length];
      osc.frequency.setValueAtTime(targetPitch, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const noteDuration = 2.8 + Math.random() * 1.2;

      // Soft breathy attack and release
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + noteDuration + 0.5);
      lfo.stop(now + noteDuration + 0.5);

      noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % swaras.length;

      const nextDelay = (noteDuration * 1000) + 1200 + Math.random() * 1000;
      const timeoutId = window.setTimeout(playNextNote, nextDelay);
      this.timerIds.push(timeoutId);
    };

    const initialTimeout = window.setTimeout(playNextNote, 1800);
    this.timerIds.push(initialTimeout);
  }

  public stop() {
    this.timerIds.forEach(id => clearTimeout(id));
    this.timerIds = [];

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        if (this.ctx && !this.isPlaying) {
          this.ctx.suspend();
        }
      }, 1200);
    }
    this.isPlaying = false;
  }
}

export const royalSoundtrack = new RoyalAudioEngine();
