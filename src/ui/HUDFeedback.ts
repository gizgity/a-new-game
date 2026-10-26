export interface FeedbackSnapshot {
  hurt: number; heal: number; healed: number; shieldFlash: number; broken: boolean;
  perfects: number; risk: boolean; cost: number;
}
export type NoticeKind = 'hit' | 'heal' | 'break' | 'perfect' | 'risk' | 'cost';
interface Notice { kind: NoticeKind; amount: number; until: number }
const PRIORITY: Record<NoticeKind, number> = { break: 4, hit: 4, risk: 3, cost: 3, perfect: 2, heal: 1 };

/** Presentation only. Bounded, transition-driven; time supplied by the unfrozen UI caller. */
export class HUDFeedback {
  private previous: FeedbackSnapshot | null = null;
  private clock = 0;
  private active: Notice | null = null;
  private pending: Notice[] = [];

  reset(): void { this.previous = null; this.clock = 0; this.active = null; this.pending = []; }
  update(next: FeedbackSnapshot, dt: number): { kind: NoticeKind; amount: number } | null {
    this.clock += Math.max(0, Math.min(dt, 0.1));
    this.pending = this.pending.filter(n => n.until > this.clock);
    if (this.active && this.active.until <= this.clock) this.active = null;
    const previous = this.previous;
    if (previous) {
      const emit = (kind: NoticeKind, amount = 0) => {
        if (this.active?.kind === kind || this.pending.some(n => n.kind === kind)) return;
        const notice = { kind, amount, until: this.clock + 0.9 };
        if (!this.active || PRIORITY[kind] >= PRIORITY[this.active.kind]) this.active = notice;
        else {
          this.pending.push(notice);
          this.pending.sort((a, b) => PRIORITY[b.kind] - PRIORITY[a.kind]);
          this.pending = this.pending.slice(0, 2);
        }
      };
      if (next.heal > previous.heal && next.healed > 0) emit('heal', next.healed);
      if (next.perfects > previous.perfects) emit('perfect');
      if (next.risk && !previous.risk) emit('risk');
      if (next.cost > previous.cost) emit('cost');
      if (next.hurt > previous.hurt) emit('hit');
      if (next.broken && (!previous.broken || next.shieldFlash > previous.shieldFlash)) emit('break');
    }
    if (!this.active) {
      const fresh = this.pending.shift();
      this.active = fresh ? { ...fresh, until: this.clock + 0.9 } : null;
    }
    this.previous = { ...next };
    return this.active ? { kind: this.active.kind, amount: this.active.amount } : null;
  }
}
