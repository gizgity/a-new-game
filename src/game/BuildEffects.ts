import { BUILD } from './config/balance.js';

export interface ChainRoot { seeded: Set<number>; echoes: number; hazard: boolean }
export const chainRoot = (): ChainRoot => ({ seeded: new Set(), echoes: 0, hazard: false });
export interface PhantomSlash { x: number; y: number; angle: number; range: number; arc: number; delay: number; root: ChainRoot }
export interface SelfHazard { x: number; y: number; time: number }

/** Run-local build clocks/state. Combat owns geometry, damage and the shared explosion budget. */
export class BuildEffects {
  phantom = 0;
  phantomCooldown = 0;
  staticCharge = 0;
  staticCooldown = 0;
  frenzy = 0;
  comboStage = 0;
  phantoms: PhantomSlash[] = [];
  hazards: SelfHazard[] = [];
  hazardCooldown = 0;
  bloodCooldown = 0;
  healWindow = 0;
  healed = 0;
  bloodHealed = 0;
  healFlash = 0;
  lastHeal = 0;
  costFlash = 0;

  reset(): void {
    this.phantom = this.phantomCooldown = this.staticCharge = this.staticCooldown = this.frenzy = this.comboStage = 0;
    this.phantoms = []; this.hazards = [];
    this.hazardCooldown = this.bloodCooldown = this.healWindow = this.healed = this.bloodHealed = this.healFlash = this.lastHeal = this.costFlash = 0;
  }
  step(dt: number): void {
    for (const key of ['phantom', 'phantomCooldown', 'staticCharge', 'staticCooldown', 'frenzy', 'hazardCooldown', 'bloodCooldown', 'healWindow', 'healFlash', 'costFlash'] as const) {
      this[key] = Math.max(0, this[key] - dt);
    }
    if (this.healWindow <= 1e-9) this.healed = this.bloodHealed = 0;
    for (const slash of this.phantoms) slash.delay -= dt;
    for (const hazard of this.hazards) hazard.time -= dt;
  }
  clearCurse(): void { this.hazards = []; this.hazardCooldown = this.bloodCooldown = this.costFlash = 0; }
  loseHp(): void { this.frenzy = this.comboStage = 0; }
  light(combo: number, hit: boolean): void {
    if (!hit) { this.comboStage = 0; return; }
    this.comboStage = combo === 1 ? 1 : combo === this.comboStage + 1 ? combo : 0;
    if (this.comboStage === 3) { this.frenzy = BUILD.frenzyDuration; this.comboStage = 0; }
  }
  perfect(phantom: boolean, riposte: boolean): void {
    if (phantom && this.phantomCooldown <= 1e-9) { this.phantom = BUILD.phantomDuration; this.phantomCooldown = BUILD.phantomCooldown; }
    if (riposte && this.staticCooldown <= 1e-9) { this.staticCharge = BUILD.staticDuration; this.staticCooldown = BUILD.staticCooldown; }
  }
  heal(hp: number, maxHp: number): number {
    if (hp <= 0 || this.bloodCooldown > 1e-9) return 0;
    const amount = Math.max(0, Math.min(BUILD.bloodHeal, maxHp - hp, BUILD.healBudget - this.healed, BUILD.bloodBudget - this.bloodHealed));
    if (amount > 0) {
      if (this.healWindow <= 1e-9) this.healWindow = BUILD.healWindow;
      this.healed += amount; this.bloodHealed += amount; this.bloodCooldown = BUILD.bloodCooldown;
      this.lastHeal = amount; this.healFlash = 0.5;
    }
    return amount;
  }
}
