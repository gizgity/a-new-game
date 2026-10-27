import { LEGACY } from './config/legacy.js';
import { BUILD } from './config/balance.js';

export type ProcOrigin = 'primary' | 'anomalySecondary' | 'legacySecondary' | 'mutationSecondary' | 'curseSecondary' | 'ruptureDetonation' | 'hostile';
export interface ProcContext { root: ChainRoot; depth: number; origin: ProcOrigin }
let nextRootId = 0;
export interface ChainRoot { id: number; anomalyRelay?: boolean; legacy?: { remaining: number }; primaryHits?: Set<number>; furnace?: boolean; seeded: Set<number>; echoes: number; hazard: boolean; marked: Set<number>; detonations: number; pulsed: boolean; healed: boolean; triggers: number; hasRelay: boolean }
export const chainRoot = (): ChainRoot => ({ id: ++nextRootId, seeded: new Set(), echoes: 0, hazard: false, marked: new Set(), detonations: 0, pulsed: false, healed: false, triggers: 0, hasRelay: false });
/** Native roots retain their original guards. Legacy descendants share a finite ledger. */
export function admitProc(root: ChainRoot, depth: number): boolean {
  if (!root.legacy) return true;
  if (depth > LEGACY.depthCap || root.legacy.remaining <= 0) return false;
  root.legacy.remaining--; return true;
}
export function legacyRoot(root: ChainRoot): void { root.legacy ??= { remaining: LEGACY.rootBudget }; }
export interface PhantomSlash { x: number; y: number; angle: number; range: number; arc: number; delay: number; root: ChainRoot }
export interface SelfHazard { x: number; y: number; time: number }

/** Run-local build clocks/state. Combat owns geometry, damage and the shared explosion budget. */
export class BuildEffects {
  reclaimerCooldown = 0;
  parasiticCooldown = 0;
  reversal = 0;
  reversalCooldown = 0;
  anchorUsed = false;
  anchorFlash = 0;
  chamberCooldown = 0;
  kinetic = 0;
  kineticDistance = 0;
  kineticRate = 0;
  kineticCooldown = 0;
  huntedCooldown = 0;
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
    this.reclaimerCooldown = this.parasiticCooldown = this.reversal = this.reversalCooldown = this.anchorFlash = this.chamberCooldown = this.kinetic = this.kineticDistance = this.kineticRate = this.kineticCooldown = this.huntedCooldown = 0;
    this.anchorUsed = false;
    this.phantom = this.phantomCooldown = this.staticCharge = this.staticCooldown = this.frenzy = this.comboStage = 0;
    this.phantoms = []; this.hazards = [];
    this.hazardCooldown = this.bloodCooldown = this.healWindow = this.healed = this.bloodHealed = this.healFlash = this.lastHeal = this.costFlash = 0;
  }
  step(dt: number): void {
    for (const key of ['reclaimerCooldown', 'parasiticCooldown', 'reversal', 'reversalCooldown', 'anchorFlash', 'chamberCooldown', 'kineticRate', 'kineticCooldown', 'huntedCooldown', 'phantom', 'phantomCooldown', 'staticCharge', 'staticCooldown', 'frenzy', 'hazardCooldown', 'bloodCooldown', 'healWindow', 'healFlash', 'costFlash'] as const) {
      this[key] = Math.max(0, this[key] - dt);
    }
    if (this.healWindow <= 1e-9) this.healed = this.bloodHealed = 0;
    for (const slash of this.phantoms) slash.delay -= dt;
    for (const hazard of this.hazards) hazard.time -= dt;
  }
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
  heal(hp: number, maxHp: number, source: 'bloodCooldown' | 'reclaimerCooldown' | 'parasiticCooldown' = 'bloodCooldown', requested: number = BUILD.bloodHeal, cooldown: number = BUILD.bloodCooldown): number {
    if (hp <= 0 || this[source] > 1e-9) return 0;
    const amount = Math.max(0, Math.min(requested, maxHp - hp, BUILD.healBudget - this.healed, source === 'bloodCooldown' ? BUILD.bloodBudget - this.bloodHealed : Infinity));
    if (amount > 0) {
      if (this.healWindow <= 1e-9) this.healWindow = BUILD.healWindow;
      this.healed += amount; if (source === 'bloodCooldown') this.bloodHealed += amount; this[source] = cooldown;
      this.lastHeal = amount; this.healFlash = 0.5;
    }
    return amount;
  }
}
