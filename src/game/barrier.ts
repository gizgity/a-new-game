import { BARRIER } from './config/balance.js';

// A single resource; proc clocks advance only with the combat simulation.
export class Barrier {
  value = 0;
  aegisDamage = 0;
  guardCooldown = 0;
  specialistCooldown = 0;
  flash = 0;
  broken = false;
  lastGain = 0;
  private aegisWindow = 0;
  private aegisGranted = 0;

  reset(): void {
    this.value = this.aegisDamage = this.guardCooldown = this.flash = this.lastGain = 0;
    this.aegisWindow = this.aegisGranted = 0;
    this.specialistCooldown = 0;
    this.broken = false;
  }

  step(dt: number): void {
    this.flash = Math.max(0, this.flash - dt);
    this.guardCooldown = Math.max(0, this.guardCooldown - dt);
    this.specialistCooldown = Math.max(0, this.specialistCooldown - dt);
    this.aegisWindow = Math.max(0, this.aegisWindow - dt);
    if (this.aegisWindow <= 1e-9) this.aegisGranted = 0;
  }

  gain(amount: number, oath: boolean): number {
    const gained = Math.min(BARRIER.cap - this.value, amount * (oath ? BARRIER.oathMultiplier : 1));
    this.value += gained;
    if (this.value >= BARRIER.cap) this.aegisDamage = 0;
    if (gained > 0) { this.flash = 0.35; this.broken = false; this.lastGain = gained; }
    return gained;
  }

  absorb(damage: number): number {
    const absorbed = Math.min(this.value, damage);
    this.value -= absorbed;
    if (absorbed > 0) { this.flash = 0.35; this.broken = this.value === 0; this.lastGain = 0; }
    return damage - absorbed;
  }

  meleeDamage(damage: number, oath: boolean): void {
    // Discard excess at the cap/rate limit, including fractional conversion progress.
    if (this.value >= BARRIER.cap || this.aegisGranted >= BARRIER.aegisRate) {
      this.aegisDamage = 0;
      return;
    }
    this.aegisDamage += damage;
    const converted = Math.floor(this.aegisDamage / BARRIER.aegisDamage) * BARRIER.aegisGain;
    if (!converted) return;
    this.aegisDamage %= BARRIER.aegisDamage;
    const amount = Math.min(converted, BARRIER.aegisRate - this.aegisGranted);
    if (this.aegisWindow <= 1e-9) this.aegisWindow = BARRIER.aegisWindow;
    this.aegisGranted += amount;
    this.gain(amount, oath);
    if (this.value >= BARRIER.cap || this.aegisGranted >= BARRIER.aegisRate) this.aegisDamage = 0;
  }

  guardBreak(oath: boolean): boolean {
    if (this.guardCooldown > 1e-9) return false;
    this.guardCooldown = BARRIER.guardCooldown;
    this.gain(BARRIER.guardGain, oath);
    return true;
  }

  chargedDetonation(oath: boolean): void {
    if (this.specialistCooldown > 1e-9) return;
    this.specialistCooldown = BARRIER.specialistCooldown;
    this.gain(BARRIER.specialistGain, oath);
  }
}
