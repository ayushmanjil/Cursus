// Web Audio API Ambient Sound & Chime Generator

export type AmbientSoundType = 'off' | 'ticking' | 'white-noise' | 'rain' | 'waves';

class SoundController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSourceNode: AudioNode | null = null;
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx?.currentTime || 0);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public stopAmbient() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    if (this.currentSourceNode) {
      try {
        (this.currentSourceNode as any).stop?.();
        this.currentSourceNode.disconnect();
      } catch (_) {}
      this.currentSourceNode = null;
    }
  }

  public startAmbient(type: AmbientSoundType) {
    this.stopAmbient();
    if (type === 'off') return;

    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    if (type === 'ticking') {
      this.playTick();
      this.tickInterval = setInterval(() => this.playTick(), 1000);
    } else if (type === 'white-noise') {
      this.currentSourceNode = this.createNoiseNode('white', 800);
    } else if (type === 'rain') {
      this.currentSourceNode = this.createNoiseNode('pink', 400);
    } else if (type === 'waves') {
      this.currentSourceNode = this.createWavesNode();
    }
  }

  private playTick() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (_) {}
  }

  private createNoiseNode(type: 'white' | 'pink', filterFreq: number): AudioNode | null {
    if (!this.ctx || !this.masterGain) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'white') {
        output[i] = white * 0.15;
      } else {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
        b6 = white * 0.115926;
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.2;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    return whiteNoise;
  }

  private createWavesNode(): AudioNode | null {
    if (!this.ctx || !this.masterGain) return null;
    const noise = this.createNoiseNode('pink', 350);
    if (!noise) return null;

    // Create periodic swell with Gain LFO
    const waveGain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();

    lfo.type = 'sine';
    lfo.frequency.value = 0.12; // wave cycle ~8 seconds

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.15;

    waveGain.gain.value = 0.15;
    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    lfo.start();
    return noise;
  }

  public playCompletionChime() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (major arpeggio chime)

      freqs.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.25 * this.volume, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 2.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 2.6);
      });
    } catch (_) {}
  }
}

export const soundController = new SoundController();
