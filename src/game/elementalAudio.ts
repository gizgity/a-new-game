import { ELEMENTAL_AUDIO as A, ELEMENTAL_TONES, elementalFamily, type ElementalCue } from './config/elementalAudio.js';
export interface ElementalSoundEvent { cue: ElementalCue; root?: number; secondary?: boolean }
/** Bounded presentation ledger. Admit before readiness so dropped events never queue/replay. */
export class ElementalAdmission {
  private roots = new Map<number, { primary: boolean; secondary: number; cues: Set<ElementalCue> }>();
  private families = new Map<string, number>();
  reset(): void { this.roots.clear(); this.families.clear(); }
  admit(event: ElementalSoundEvent, now: number): number {
    let gain: number = event.secondary ? A.secondaryGain : A.primaryGain;
    if (event.root !== undefined) {
      let root = this.roots.get(event.root);
      if (!root) {
        root = { primary: false, secondary: 0, cues: new Set() }; this.roots.set(event.root, root);
        if (this.roots.size > A.rootHistory) this.roots.delete(this.roots.keys().next().value!);
      }
      if (root.cues.has(event.cue) && !(event.secondary && (event.cue === 'arcRelay' || event.cue === 'discharge'))) return 0;
      root.cues.add(event.cue);
      if (event.secondary || root.primary) {
        if (root.secondary >= A.secondaryPerRoot) return 0;
        gain = A.secondaryGain * 0.65 ** root.secondary++;
      } else root.primary = true;
    }
    const family = `${elementalFamily(event.cue)}:${event.secondary ? event.cue : 'primary'}`;
    if (now - (this.families.get(family) ?? -Infinity) < (event.secondary ? A.secondaryCooldown : A.familyCooldown)) return 0;
    this.families.set(family, now); return gain;
  }
}
/** Cached PCM in the existing ProceduralAudio engine; independent noise source, no gameplay RNG. */
export function synthesizeElemental(cue: ElementalCue, sampleRate: number): Float32Array {
  const [frequency, duration, ratio, noise, fm, cutoff] = ELEMENTAL_TONES[cue];
  const samples = new Float32Array(Math.ceil(sampleRate * duration));
  let phase = 0, low = 0, peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / sampleRate, p = i / samples.length;
    phase += 2 * Math.PI * frequency * (1 + (ratio - 1) * p) / sampleRate;
    const carrier = Math.sin(phase + fm * Math.sin(phase * 2.71) * (1 - p));
    const source = carrier * (1 - noise) + (Math.random() * 2 - 1) * noise;
    const sweep = cue === 'cyclone' ? .55 + .45 * Math.sin(p * Math.PI * 4) : 1 - p * .65;
    low += (1 - Math.exp(-2 * Math.PI * cutoff * sweep / sampleRate)) * (source - low);
    const attack = cue === 'shadowMark' ? p ** 1.6 : Math.min(1, t / .004);
    const pulse = cue === 'wildfire' ? .4 + .6 * Math.sin(p * 19) ** 8 : cue === 'overclock' ? .45 + .55 * Math.sin(p * 22) ** 2 : 1;
    samples[i] = low * attack * (1 - p) ** (cue === 'shadowMark' ? .5 : 2) * pulse * Math.min(1, (duration - t) / .006);
    peak = Math.max(peak, Math.abs(samples[i]));
  }
  const scale = A.peak / (peak || 1);
  for (let i = 0; i < samples.length; i++) samples[i] *= scale;
  return samples;
}
