/** Output-only WebAudio transport. No simulation imports, timers or RNG. */
export type MusicState = 'silent' | 'early' | 'tension' | 'anomaly' | 'boss' | 'enraged' | 'victory' | 'defeat';
export interface MusicSnapshot { phase: string; elapsed: number; anomaly: boolean; boss: boolean; enraged: boolean }
export function musicState(s: MusicSnapshot): MusicState {
  if (s.phase === 'victory' || s.phase === 'defeat') return s.phase;
  if (s.phase === 'ready') return 'silent';
  if (s.boss) return s.enraged ? 'enraged' : 'boss';
  return s.anomaly ? 'anomaly' : s.elapsed >= 60 ? 'tension' : 'early';
}
// Exact approved export grid (not independently rounded ideal BPM).
export const MUSIC = { bar: 542769 / 44100 / 8, gain: .7, duckDb: 8, release: .35, fade: .3 } as const;
type Piece = 'arena-base' | 'tension' | 'anomaly' | 'boss-core' | 'enraged' | 'victory' | 'defeat';
type Group = 'arena' | 'boss' | 'results';
const groups: Record<Group, Piece[]> = { arena: ['arena-base', 'tension', 'anomaly'], boss: ['boss-core', 'enraged'], results: ['victory', 'defeat'] };
export function musicLayers(state: MusicState): Piece[] {
  switch (state) {
    case 'early': return ['arena-base']; case 'tension': return ['arena-base', 'tension'];
    case 'anomaly': return ['arena-base', 'tension', 'anomaly'];
    case 'boss': return ['boss-core']; case 'enraged': return ['boss-core', 'enraged'];
    case 'silent': return []; default: return [state];
  }
}
interface Voice { piece: Piece; source: AudioBufferSourceNode; gain: GainNode }
export class AdaptiveMusic {
  private bus: GainNode;
  private duckBus: GainNode;
  private cache = new Map<Piece, AudioBuffer>();
  private voices: Voice[] = [];
  private loading: Group | null = null;
  private group: Group | null = null;
  private failed = new Set<Group>();
  private epoch = 0;
  private position = 0;
  private running = false;
  private frozen = true;
  private state: MusicState = 'silent';
  private applied: MusicState = 'silent';
  private resultClaimed = false;
  private resultDone = false;
  private generation = 0;
  private disposed = false;
  private abort = new AbortController();
  private networkBytes = 0;
  private errors = 0;
  private peakSources = 0;
  private readonly visibility = () => { if (document.hidden) this.freeze(); };
  private readonly contextChange = () => { if (this.context.state !== 'running') this.freeze(); };
  constructor(private readonly context: AudioContext, output: AudioNode, private readonly baseUrl: string) {
    this.bus = context.createGain(); this.bus.gain.value = MUSIC.gain;
    this.duckBus = context.createGain(); this.bus.connect(this.duckBus); this.duckBus.connect(output);
    document.addEventListener('visibilitychange', this.visibility);
    context.addEventListener('statechange', this.contextChange);
  }
  reset(): void {
    this.generation++; this.abort.abort(); this.abort = new AbortController();
    this.stop(); this.cache.clear(); this.failed.clear(); this.loading = this.group = null;
    this.position = 0; this.running = false; this.frozen = true;
    this.state = this.applied = 'silent'; this.resultClaimed = this.resultDone = false;
    this.duckBus.gain.cancelScheduledValues(this.context.currentTime); this.duckBus.gain.value = 1;
  }
  /** Called by presentation frame/phase changes; clock is exclusively AudioContext.currentTime. */
  update(state: MusicState, frozen: boolean): void {
    if (this.disposed) return;
    this.state = state;
    const result = state === 'victory' || state === 'defeat';
    this.frozen = frozen || document.hidden || this.context.state !== 'running';
    if (state === 'silent') { this.freeze(); return; }
    if (this.frozen) {
      if (result) this.resultClaimed = this.resultDone = true;
      this.freeze(); return;
    }
    if (result && !this.resultClaimed) {
      this.resultClaimed = true;
      for (const voice of [...this.voices]) if (voice.piece !== 'arena-base' && voice.piece !== 'boss-core') this.remove(voice);
      this.fadeOut();
    }
    if (result && this.resultDone) return;
    const group = result ? 'results' : state === 'boss' || state === 'enraged' ? 'boss' : 'arena';
    if (this.group !== group) { void this.load(group); return; }
    if (!this.running) this.start(group, result);
    if (this.applied !== state && !result) this.mix(state);
  }
  private async load(group: Group): Promise<void> {
    if (this.loading || this.failed.has(group)) return;
    this.loading = group;
    const generation = this.generation, signal = this.abort.signal;
    try {
      const decoded = new Map<Piece, AudioBuffer>();
      for (const piece of groups[group]) {
        let buffer: AudioBuffer | undefined;
        for (const codec of ['flac', 'wav']) {
          try {
            const response = await fetch(`${this.baseUrl}${piece}.${codec}`, { signal });
            if (!response.ok) throw new Error(`Music HTTP ${response.status}`);
            const bytes = await response.arrayBuffer(); this.networkBytes += bytes.byteLength;
            buffer = await this.context.decodeAudioData(bytes); break;
          } catch { if (signal.aborted) return; }
        }
        if (!buffer) throw new Error('Music decode failed');
        decoded.set(piece, buffer);
      }
      if (this.disposed || generation !== this.generation) return;
      const desired = this.state === 'victory' || this.state === 'defeat' ? 'results' : this.state === 'boss' || this.state === 'enraged' ? 'boss' : 'arena';
      if (group !== desired) return;
      // Fade arena overlays first; retain one core for a bounded crossfade (1+2 sources).
      if (group === 'boss' && this.running) {
        for (const voice of [...this.voices]) if (voice.piece !== 'arena-base') this.remove(voice);
        this.fadeOut();
      } else if (group !== this.group && group !== 'results') this.stop();
      if (group !== this.group) { this.running = false; this.position = 0; }
      this.cache = decoded; this.group = group;
    } catch { if (!signal.aborted) { this.errors++; this.failed.add(group); this.fadeOut(); this.cache.clear(); this.group = null; } }
    finally { if (generation === this.generation && this.loading === group) this.loading = null; }
  }
  private start(group: Group, result: boolean): void {
    const now = this.context.currentTime;
    if (result) {
      // Claim even when interrupted: background/resume never replays an old sting.
      if (this.resultDone) return;
      this.resultDone = true;
      const piece = this.state as 'victory' | 'defeat';
      this.add(piece, now + MUSIC.fade, 0, false, 1);
      this.running = true; this.applied = this.state; return;
    }
    // A family change starts its own downbeat; pause/resume preserves the same offset.
    this.epoch = now - this.position;
    const wanted = musicLayers(this.state);
    for (const piece of groups[group]) this.add(piece, now, this.position, true, wanted.includes(piece) ? 1 : 0);
    this.running = true; this.applied = this.state;
  }
  private add(piece: Piece, when: number, offset: number, loop: boolean, level: number): void {
    const buffer = this.cache.get(piece); if (!buffer) return;
    const source = this.context.createBufferSource(), gain = this.context.createGain();
    source.buffer = buffer; source.loop = loop;
    // Explicit common range avoids one-frame resampling differences accumulating each loop.
    source.loopEnd = piece === 'arena-base' || piece === 'boss-core' ? MUSIC.bar * 16 : MUSIC.bar * 8;
    gain.gain.setValueAtTime(loop ? 0 : level, when);
    if (loop) gain.gain.linearRampToValueAtTime(level, when + .02);
    source.connect(gain); gain.connect(this.bus);
    const voice = { piece, source, gain }; this.voices.push(voice);
    this.peakSources = Math.max(this.peakSources, this.voices.length);
    source.onended = () => this.remove(voice);
    source.start(when, offset % (loop ? source.loopEnd : buffer.duration));
  }
  private mix(state: MusicState): void {
    const now = this.context.currentTime;
    const boundary = this.epoch + Math.ceil((now - this.epoch + .005) / MUSIC.bar) * MUSIC.bar;
    const wanted = musicLayers(state);
    for (const voice of this.voices) {
      voice.gain.gain.cancelAndHoldAtTime(now);
      voice.gain.gain.setValueAtTime(wanted.includes(voice.piece) ? 1 : 0, boundary);
    }
    this.applied = state;
  }
  private fadeOut(): void {
    const now = this.context.currentTime;
    for (const voice of this.voices) {
      voice.gain.gain.cancelAndHoldAtTime(now); voice.gain.gain.linearRampToValueAtTime(0, now + MUSIC.fade);
      voice.source.stop(now + MUSIC.fade);
    }
    this.running = false; this.position = 0;
  }
  private freeze(): void {
    if (this.resultClaimed) this.resultDone = true;
    if (this.running) this.position = Math.max(0, this.context.currentTime - this.epoch);
    this.stop(); this.running = false;
  }
  private remove(voice: Voice): void {
    if (!this.voices.includes(voice)) return;
    voice.source.onended = null;
    try { voice.source.stop(); } catch { /* already ended */ }
    voice.source.disconnect(); voice.gain.disconnect();
    this.voices.splice(this.voices.indexOf(voice), 1);
  }
  private stop(): void { for (const voice of [...this.voices]) this.remove(voice); }
  duck(): void {
    if (this.disposed || this.frozen) return;
    const now = this.context.currentTime, gain = this.duckBus.gain;
    gain.cancelAndHoldAtTime(now); gain.linearRampToValueAtTime(10 ** (-MUSIC.duckDb / 20), now + .01);
    gain.setValueAtTime(10 ** (-MUSIC.duckDb / 20), now + .12);
    gain.linearRampToValueAtTime(1, now + .12 + MUSIC.release);
  }
  stats() { return { state: this.state, applied: this.applied, position: this.running ? this.context.currentTime - this.epoch : this.position,
    networkBytes: this.networkBytes, decodedBytes: [...this.cache.values()].reduce((n,b) => n + b.length * b.numberOfChannels * 4, 0),
    cacheEntries: this.cache.size, sources: this.voices.length, peakSources: this.peakSources, errors: this.errors, resultDone: this.resultDone }; }
  destroy(): void {
    this.reset(); this.disposed = true;
    document.removeEventListener('visibilitychange', this.visibility); this.context.removeEventListener('statechange', this.contextChange);
    this.bus.disconnect(); this.duckBus.disconnect();
  }
}
