// Web Audio API Ambient Sound & Chime Generator

export type AmbientSoundType =
  | 'off'
  | 'ticking'
  | 'rain'
  | 'waves'
  | 'fireplace'
  | 'cafe'
  | 'forest'
  | 'white-noise';

class SoundController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSourceNode: AudioNode | null = null;
  private secondaryNodes: AudioNode[] = [];
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private volume: number = 0.7;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : this.volume * 1.5;
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
      this.masterGain.gain.setValueAtTime(this.volume * 1.5, this.ctx?.currentTime || 0);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 1.5, this.ctx.currentTime);
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
    this.secondaryNodes.forEach((node) => {
      try {
        (node as any).stop?.();
        node.disconnect();
      } catch (_) {}
    });
    this.secondaryNodes = [];
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
      this.currentSourceNode = this.createNoiseNode('white', 1200, 0.5);
    } else if (type === 'rain') {
      this.currentSourceNode = this.createNoiseNode('pink', 600, 0.75);
    } else if (type === 'waves') {
      this.currentSourceNode = this.createWavesNode();
    } else if (type === 'fireplace') {
      this.currentSourceNode = this.createFireplaceNode();
    } else if (type === 'cafe') {
      this.currentSourceNode = this.createCafeNode();
    } else if (type === 'forest') {
      this.currentSourceNode = this.createForestNode();
    }
  }

  private playTick() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.4 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (_) {}
  }

  private createNoiseNode(type: 'white' | 'pink', filterFreq: number, gainLevel: number = 0.5): AudioNode | null {
    if (!this.ctx || !this.masterGain) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'white') {
        output[i] = white * 0.35;
      } else {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
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
    gain.gain.value = gainLevel;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    return whiteNoise;
  }

  private createWavesNode(): AudioNode | null {
    if (!this.ctx || !this.masterGain) return null;
    const noise = this.createNoiseNode('pink', 500, 0.7);
    if (!noise) return null;

    const waveGain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();

    lfo.type = 'sine';
    lfo.frequency.value = 0.12; // wave swell cycle ~8s

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.4;

    waveGain.gain.value = 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    lfo.start();
    this.secondaryNodes.push(lfo);
    return noise;
  }

  private createFireplaceNode(): AudioNode | null {
    if (!this.ctx || !this.masterGain) return null;
    // Warm low-frequency roar
    const baseRumble = this.createNoiseNode('pink', 300, 0.6);

    // Crackle pops interval
    this.tickInterval = setInterval(() => {
      if (!this.ctx || !this.masterGain || this.isMuted || Math.random() > 0.4) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300 + Math.random() * 1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.015);

        gain.gain.setValueAtTime(0.35 * this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.015);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.02);
      } catch (_) {}
    }, 120);

    return baseRumble;
  }

  private createCafeNode(): AudioNode | null {
    if (!this.ctx || !this.masterGain) return null;
    // Warm mid-range murmur noise
    const murmur = this.createNoiseNode('pink', 750, 0.65);
    if (!murmur) return null;

    // LFO for subtle background activity swells
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.25;

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain);

    lfo.start();
    this.secondaryNodes.push(lfo);
    return murmur;
  }

  private createForestNode(): AudioNode | null {
    if (!this.ctx || !this.masterGain) return null;
    // Soft wind breeze
    const wind = this.createNoiseNode('pink', 420, 0.55);

    // Occasional gentle bird chirp
    this.tickInterval = setInterval(() => {
      if (!this.ctx || !this.masterGain || this.isMuted || Math.random() > 0.3) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const baseFreq = 2200 + Math.random() * 800;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.15);

        gain.gain.setValueAtTime(0.15 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.19);
      } catch (_) {}
    }, 2500);

    return wind;
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
        gain.gain.linearRampToValueAtTime(0.45 * this.volume, now + i * 0.12 + 0.05);
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
