import { ELEMENTAL_TONES, type ElementalCue } from './config/elementalAudio';
import { ElementalAdmission, synthesizeElemental, type ElementalSoundEvent } from './elementalAudio';
import Phaser from 'phaser';
import { arrivalPulse } from './arrival';
import { AUDIO, cuePolicy } from './config/audio';
import type { CombatSoundEvent, SoundCue } from './combat';

type PresentationCue = 'start' | 'draft' | 'choice' | 'elite' | 'boss' | 'defeat';
export type AudioCue = SoundCue | PresentationCue | 'arrival' | 'charge' | ElementalCue;

const tones: Record<Exclude<AudioCue, ElementalCue>, [number, number, number]> = {
  arrival: [76, 0.38, 0],
  charge: [280, 1.2, 0], stack1: [520, 0.055, 0.1], stack2: [680, 0.07, 0.1], stack3: [860, 0.10, 0.1], chain: [1100, 0.055, 0.16],
  start: [440, 0.20, 0], draft: [660, 0.24, 0], choice: [880, 0.15, 0],
  elite: [220, 0.36, 0], boss: [110, 0.65, 0], defeat: [220, 0.65, 0],
  victory: [440, 1.1, 0],
  swing2: [650, 0.095, 0.7], swing3: [230, 0.16, 0.65],
  light2: [460, 0.09, 0.4], light3: [145, 0.15, 0.5],
  chargedGun: [220, 0.16, 0.45], chargedBlast: [95, 0.26, 0.6],
  swing: [480, 0.075, 0.85], heavySwing: [150, 0.24, 0.75], shotHit: [680, 0.04, 0.45], chargedHit: [180, 0.10, 0.5],
  light: [330, 0.07, 0.35], heavy: [110, 0.22, 0.5], gun: [520, 0.055, 0.25],
  dash: [850, 0.10, 0.2], perfect: [880, 0.16, 0.05], detonate: [75, 0.20, 0.65], hurt: [150, 0.12, 0.45],
};

export class ProceduralAudio {
  private elementalAdmission = new ElementalAdmission();
  private last = new Map<AudioCue, number>();
  private available = false;
  private sounds = new Map<AudioCue, Phaser.Sound.WebAudioSound>();
  private roots = new Set<number>();
  private frameCount = 0;
  private regularCount = 0;
  private charging = false;
  private muted = false;
  private readonly onMute = (_manager: Phaser.Sound.BaseSoundManager, muted: boolean): void => {
    this.muted = muted;
    if (muted) this.transition();
  };
  private arrivalBeat = -1;
  constructor(private readonly scene: Phaser.Scene) {
    if (!(scene.sound instanceof Phaser.Sound.WebAudioSoundManager)) return;
    const context = scene.sound.context;
    this.muted = scene.sound.mute;
    scene.sound.on(Phaser.Sound.Events.GLOBAL_MUTE, this.onMute);
    if (!scene.cache.audio.exists('sfx-charge')) for (const [cue, [frequency, duration, noise]] of Object.entries(tones)) {
      const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
      const samples = buffer.getChannelData(0);
      let filteredNoise = 0;
      for (let i = 0; i < samples.length; i++) {
        const t = i / context.sampleRate, progress = i / samples.length;
        if (cue === 'arrival') {
          // Approved2s preview timbre, one beat at a time; warning simulation schedules it.
          const attack = Math.min(1, t / 0.008);
          const body = (Math.sin(2 * Math.PI * (76 * t - 24 * t * t)) * 0.20
            + Math.sin(2 * Math.PI * 152 * t) * 0.055) * Math.exp(-t * 12);
          const chain = (Math.sin(2 * Math.PI * 1187 * t) * 0.07 + Math.sin(2 * Math.PI * 1921 * t) * 0.05
            + Math.sin(2 * Math.PI * 2857 * t) * 0.025) * Math.exp(-t * 25);
          samples[i] = attack * (body + chain + (Math.random() * 2 - 1) * 0.025 * Math.exp(-t * 40));
          continue;
        }
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
        if (cue === 'charge') {
          const envelope = Math.min(1, t * 20) * Math.min(1, (duration - t) * 30);
          samples[i] = (Math.sin(2 * Math.PI * (280 * t + 190 * t * t)) + Math.sin(2 * Math.PI * (560 * t + 260 * t * t)) * progress * 0.4) * envelope * 0.09;
          continue;
        }
        if (cue === 'perfect' || cue.startsWith('stack')) {
          samples[i] = (Math.sin(2 * Math.PI * frequency * t) + Math.sin(2 * Math.PI * frequency * 2 * t) * 0.10) * Math.min(1, t * 250) * Math.exp(-progress * 5) * 0.22;
          continue;
        }
        if (cue === 'hurt') {
          samples[i] = (Math.sin(2 * Math.PI * 190 * t) + Math.sin(2 * Math.PI * 287 * t) * 0.4) * (t < 0.045 || t > 0.065 ? 1 : 0) * (1 - progress) ** 2 * 0.24;
          continue;
        }
        if (cue === 'chargedGun' || cue === 'chargedBlast' || cue === 'heavy') {
          // A short crack plus low body and audible harmonics for small phone speakers.
          const body = Math.sin(2 * Math.PI * frequency * t * (1 - progress * 0.65));
          const crack = (Math.random() * 2 - 1) * Math.exp(-progress * 12);
          const overtone = Math.sin(2 * Math.PI * frequency * 2.4 * t) * Math.exp(-progress * 4);
          samples[i] = (body * 0.65 + crack * 0.30 + overtone * 0.18) * (1 - progress) ** 2 * 0.4;
          continue;
        }
        filteredNoise += 0.28 * ((Math.random() * 2 - 1) - filteredNoise);
        samples[i] = ((Math.sin(2 * Math.PI * frequency * t * (1 - progress * 0.4)) * (1 - noise)) +
          filteredNoise * noise) * (1 - progress) ** 2 * 0.3;
      }
      if (cue !== 'arrival') {
        // Bake warmer timbre into cached PCM; no extra nodes in combat.
        const filterStep = 1 - Math.exp(-2 * Math.PI * AUDIO.trebleCutoff / context.sampleRate);
        let low1 = 0, low2 = 0;
        const impactBody = ['heavy', 'chargedGun', 'chargedHit', 'chargedBlast', 'detonate', 'light3'].includes(cue);
        const regularBody = ['light', 'light2', 'gun', 'shotHit'].includes(cue);
        let peak = 0;
        for (let i = 0; i < samples.length; i++) {
          const t = i / context.sampleRate, progress = i / samples.length;
          low1 += filterStep * (samples[i] - low1);
          low2 += filterStep * (low1 - low2);
          // Short 120–240Hz body remains audible on phone speakers; Basic stays lighter.
          const body = (Math.sin(2 * Math.PI * 120 * t) + 0.45 * Math.sin(2 * Math.PI * 240 * t))
            * Math.exp(-progress * 4) * (impactBody ? AUDIO.impactBody : regularBody ? AUDIO.regularBody : 0);
          samples[i] = (low2 + body) * Math.min(1, t / 0.004, (samples.length - 1 - i) / (context.sampleRate * 0.004));
          peak = Math.max(peak, Math.abs(samples[i]));
        }
        const scale = Math.min(1, AUDIO.bufferPeak / (peak || 1));
        for (let i = 0; i < samples.length; i++) samples[i] *= scale;
      }
      scene.cache.audio.add(`sfx-${cue}`, buffer);
    }
    for (const cue of Object.keys(ELEMENTAL_TONES) as ElementalCue[]) {
      if (!scene.cache.audio.exists(`sfx-${cue}`)) {
        const samples = synthesizeElemental(cue, context.sampleRate);
        const buffer = context.createBuffer(1, samples.length, context.sampleRate);
        buffer.getChannelData(0).set(samples); scene.cache.audio.add(`sfx-${cue}`, buffer);
      }
    }
    for (const cue of [...Object.keys(tones), ...Object.keys(ELEMENTAL_TONES)] as AudioCue[]) this.sounds.set(cue, scene.sound.add(`sfx-${cue}`) as Phaser.Sound.WebAudioSound);
    this.available = true;
  }
  /** No wall-clock timers or replay on resume/unmute; at most one sound per reached beat. */
  arrival(remaining: number): void {
    if (remaining <= 0) { this.arrivalBeat = -1; return; }
    const pulse = arrivalPulse(remaining);
    if (pulse.beat < 0 || pulse.beat === this.arrivalBeat) return;
    this.arrivalBeat = pulse.beat;
    this.emit('arrival', pulse.gain);
  }

  beginFrame(): void { this.frameCount = this.regularCount = 0; }

  /** Armed aim is presentation only; caller requires confirmed stored Charged resource. */
  charge(active: boolean): void {
    if (!active || !this.ready()) { this.sounds.get('charge')?.stop(); this.charging = false; return; }
    if (!this.charging) this.emit('charge');
    this.charging = true;
  }

  private ready(): boolean {
    return this.available && !this.muted && !this.scene.sound.mute && !this.scene.sound.locked
      && (this.scene.sound as Phaser.Sound.WebAudioSoundManager).context.state === 'running'
      && !document.hidden;
  }

  transition(cue?: PresentationCue | 'victory'): void {
    for (const [key, sound] of this.sounds) if (!(cue === 'elite' && key === 'arrival')) sound.stop();
    this.charging = false;
    this.last.clear();
    if (cue === 'start' || cue === 'victory' || cue === 'defeat') { this.roots.clear(); this.elementalAdmission.reset(); }
    if (cue) this.play([cue]);
  }

  destroy(): void {
    this.available = false;
    this.scene.sound.off(Phaser.Sound.Events.GLOBAL_MUTE, this.onMute);
    for (const sound of this.sounds.values()) sound.destroy();
    this.sounds.clear(); this.roots.clear(); this.last.clear();
  }

  private emit(cue: AudioCue, volume = 1): boolean {
    if (!this.ready()) return false;
    const now = performance.now(), policy = cuePolicy(cue);
    if (this.frameCount >= AUDIO.perFrame || policy.priority < 4 && this.regularCount >= AUDIO.regularPerFrame
      || now - (this.last.get(cue) ?? -Infinity) < policy.cooldown) return false;
    const sound = this.sounds.get(cue);
    if (!sound || sound.isPlaying) return false;
    const playing = [...this.sounds.entries()].filter(([, voice]) => voice.isPlaying);
    if (playing.length >= AUDIO.voiceCap) {
      const victim = playing.filter(([key]) => cuePolicy(key).priority < policy.priority)
        .sort(([a], [b]) => cuePolicy(a).priority - cuePolicy(b).priority)[0];
      if (!victim) return false;
      victim[1].stop();
    }
    sound.play({ volume: volume * (cue === 'arrival' ? 1 : AUDIO.combatGain) });
    this.last.set(cue, now); this.frameCount++;
    if (policy.priority < 4) this.regularCount++;
    return true;
  }

  elemental(events: readonly ElementalSoundEvent[]): void {
    for (const event of [...events].sort((a, b) => Number(!!a.secondary) - Number(!!b.secondary))) {
      const gain = this.elementalAdmission.admit(event, performance.now());
      if (gain) this.emit(event.cue, gain);
    }
  }

  play(cues: readonly (AudioCue | CombatSoundEvent)[]): void {
    // Drop immediately while locked/paused; never retain combat for resume.
    const events: { cue: AudioCue; root?: number; hop?: number }[] = cues.map(event => typeof event === 'string' ? { cue: event } : event);
    const mapped: { cue: AudioCue; gain: number }[] = [];
    for (const event of events) {
      let cue: AudioCue = event.cue, gain = 1;
      if (event.root !== undefined) {
        if (this.roots.has(event.root)) { cue = 'chain'; gain = Math.max(0.15, 0.65 ** Math.max(1, event.hop ?? 1)); }
        else {
          this.roots.add(event.root);
          // Presentation ledger bounded independently of gameplay root lifetime.
          if (this.roots.size > AUDIO.rootHistory) this.roots.delete(this.roots.values().next().value!);
        }
      }
      mapped.push({ cue, gain });
    }
    mapped.sort((a, b) => cuePolicy(b.cue).priority - cuePolicy(a.cue).priority);
    for (const { cue, gain } of mapped) this.emit(cue, gain);
  }
}
