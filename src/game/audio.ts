import Phaser from 'phaser';
import type { SoundCue } from './combat';

const tones: Record<SoundCue, [number, number, number]> = {
  swing: [480, 0.075, 0.85], heavySwing: [190, 0.18, 0.8], shotHit: [940, 0.04, 0.45], chargedHit: [180, 0.10, 0.5],
  light: [330, 0.07, 0.35], heavy: [100, 0.14, 0.55], gun: [650, 0.055, 0.25],
  dash: [850, 0.10, 0.2], perfect: [1200, 0.16, 0.05], detonate: [75, 0.20, 0.65], hurt: [150, 0.12, 0.45],
};

export class ProceduralAudio {
  private last = new Map<SoundCue, number>();
  private available = false;
  constructor(private readonly scene: Phaser.Scene) {
    if (!(scene.sound instanceof Phaser.Sound.WebAudioSoundManager)) return;
    const context = scene.sound.context;
    for (const [cue, [frequency, duration, noise]] of Object.entries(tones)) {
      const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) {
        const t = i / context.sampleRate, progress = i / samples.length;
        samples[i] = ((Math.sin(2 * Math.PI * frequency * t * (1 - progress * 0.4)) * (1 - noise)) +
          (Math.random() * 2 - 1) * noise) * (1 - progress) ** 2 * 0.3;
      }
      scene.cache.audio.add(`sfx-${cue}`, buffer);
    }
    this.available = true;
  }
  play(cues: readonly SoundCue[]): void {
    if (!this.available || this.scene.sound.mute || this.scene.sound.locked) return;
    const now = performance.now();
    let count = 0;
    // Ưu tiên feedback quan trọng; không chồng âm vô hạn trong chain.
    for (const cue of ['hurt', 'perfect', 'detonate', 'heavy', 'light', 'chargedHit', 'shotHit', 'dash', 'gun', 'heavySwing', 'swing'] as const) {
      if (!cues.includes(cue) || now - (this.last.get(cue) ?? -Infinity) < (cue === 'detonate' ? 140 : 65)) continue;
      if (count >= 3 || this.scene.sound.getAllPlaying().length >= 8) break;
      this.scene.sound.play(`sfx-${cue}`);
      this.last.set(cue, now);
      count++;
    }
  }
}
