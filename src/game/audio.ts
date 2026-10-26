import Phaser from 'phaser';
import type { SoundCue } from './combat';

type PresentationCue = 'start' | 'draft' | 'choice' | 'elite' | 'boss' | 'defeat';
type AudioCue = SoundCue | PresentationCue;

const tones: Record<AudioCue, [number, number, number]> = {
  start: [440, 0.20, 0], draft: [660, 0.24, 0], choice: [880, 0.15, 0],
  elite: [220, 0.36, 0], boss: [110, 0.65, 0], defeat: [220, 0.65, 0],
  victory: [440, 1.1, 0],
  swing2: [650, 0.095, 0.7], swing3: [230, 0.16, 0.65],
  light2: [460, 0.09, 0.4], light3: [145, 0.15, 0.5],
  chargedGun: [220, 0.16, 0.45], chargedBlast: [95, 0.26, 0.6],
  swing: [480, 0.075, 0.85], heavySwing: [150, 0.24, 0.75], shotHit: [940, 0.04, 0.45], chargedHit: [180, 0.10, 0.5],
  light: [330, 0.07, 0.35], heavy: [110, 0.22, 0.5], gun: [650, 0.055, 0.25],
  dash: [850, 0.10, 0.2], perfect: [1200, 0.16, 0.05], detonate: [75, 0.20, 0.65], hurt: [150, 0.12, 0.45],
};

export class ProceduralAudio {
  private last = new Map<AudioCue, number>();
  private available = false;
  constructor(private readonly scene: Phaser.Scene) {
    if (!(scene.sound instanceof Phaser.Sound.WebAudioSoundManager)) return;
    const context = scene.sound.context;
    for (const [cue, [frequency, duration, noise]] of Object.entries(tones)) {
      const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) {
        const t = i / context.sampleRate, progress = i / samples.length;
        if (['start', 'draft', 'choice', 'elite', 'boss', 'defeat'].includes(cue)) {
          const descending = cue === 'boss' || cue === 'defeat';
          const pitch = frequency * (descending ? 1 - progress * 0.4 : 1 + Math.floor(progress * 3) * 0.25);
          const envelope = Math.min(1, t * 60) * (1 - progress) ** 2;
          samples[i] = (Math.sin(2 * Math.PI * pitch * t) + Math.sin(2 * Math.PI * pitch * 1.5 * t) * 0.3) * envelope * 0.22;
          continue;
        }
        if (cue === 'victory') {
          const envelope = Math.min(1, t * 30) * (1 - progress) ** 1.5;
          samples[i] = [1, 1.25, 1.5, 2].reduce((sum, ratio, index) => sum + (t >= index * 0.09 ? Math.sin(2 * Math.PI * frequency * ratio * t) : 0), 0) * envelope * 0.12;
          continue;
        }
        if (cue === 'chargedGun' || cue === 'chargedBlast' || cue === 'heavy') {
          // A short crack plus low body and audible harmonics for small phone speakers.
          const body = Math.sin(2 * Math.PI * frequency * t * (1 - progress * 0.65));
          const crack = (Math.random() * 2 - 1) * Math.exp(-progress * 12);
          const overtone = Math.sin(2 * Math.PI * frequency * 2.4 * t) * Math.exp(-progress * 4);
          samples[i] = (body * 0.6 + crack * 0.5 + overtone * 0.25) * (1 - progress) ** 2 * 0.4;
          continue;
        }
        samples[i] = ((Math.sin(2 * Math.PI * frequency * t * (1 - progress * 0.4)) * (1 - noise)) +
          (Math.random() * 2 - 1) * noise) * (1 - progress) ** 2 * 0.3;
      }
      scene.cache.audio.add(`sfx-${cue}`, buffer);
    }
    this.available = true;
  }
  /** Phase cues replace combat tails, but resume leaves silence. No simulation state. */
  transition(cue?: PresentationCue | 'victory'): void {
    this.scene.sound.stopAll();
    this.last.clear();
    if (cue) this.play([cue]);
  }

  play(cues: readonly AudioCue[]): void {
    if (!this.available || this.scene.sound.mute || this.scene.sound.locked) return;
    const now = performance.now();
    let count = 0;
    // Ưu tiên feedback quan trọng; không chồng âm vô hạn trong chain.
    for (const cue of ['victory', 'defeat', 'boss', 'elite', 'draft', 'choice', 'start', 'hurt', 'perfect', 'chargedBlast', 'chargedGun', 'detonate', 'heavy', 'light3', 'light2', 'light', 'chargedHit', 'shotHit', 'dash', 'gun', 'heavySwing', 'swing3', 'swing2', 'swing'] as const) {
      if (cue === 'detonate' && cues.includes('chargedBlast')) continue;
      if (!cues.includes(cue) || now - (this.last.get(cue) ?? -Infinity) < (cue === 'detonate' ? 140 : 65)) continue;
      if (count >= 3 || this.scene.sound.getAllPlaying().length >= 8) break;
      this.scene.sound.play(`sfx-${cue}`);
      this.last.set(cue, now);
      count++;
    }
  }
}
