import { t } from '../i18n';
import { COMBAT, type CombatWorld } from '../game/combat';
import type { RunDirector } from '../game/run';
import { BARRIER, HEAVY, ENCOUNTERS } from '../game/config/balance';
import type { BuildId } from '../game/builds';
import { HUDFeedback } from './HUDFeedback';

const icon = (id: string, className = 'hud-icon') => `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><use href="${import.meta.env.BASE_URL}assets/ui/hud-icons.svg#${id}"></use></svg>`;
const seconds = (n: number) => t('secondsShort').replace('{n}', Math.max(0, n).toFixed(1));
const time = (n: number) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
export interface ResourceReadout { value: string; note: string; touchNote: string; available: boolean; fill: number; proc: boolean }
export type ResourceReadouts = Record<'dash' | 'heavy' | 'charged' | 'surge', ResourceReadout>;

export function combatHUDMarkup(): string {
  return `<div class="combat-hud" id="combat-hud"><div class="hud-frame" aria-hidden="true"></div>
    <div class="vitals-card">
      <div class="health">${icon('heart')}<span data-i18n="health"></span><strong id="hp-value"></strong><progress id="hp" aria-label="${t('health')}" max="100" value="100"></progress></div>
      <div class="barrier-state">${icon('shield')}<span data-i18n="barrier"></span><strong id="barrier-value"></strong><progress id="barrier" aria-label="${t('barrier')}" max="30" value="0"></progress></div>
    </div>
    <button id="build-summary" class="build-summary" type="button" aria-haspopup="dialog" aria-controls="build-panel" aria-expanded="false"><span class="build-slots" id="build-slots"></span><span id="build-count"></span>${icon('info')}</button>
    <div class="hud-feedback"><span id="hud-warning"></span><span id="trial-label" class="trial-label" hidden></span><span id="combat-notice" role="status" aria-live="polite" aria-atomic="true"></span></div>
    <div class="hud-resources">${(['dash', 'heavy', 'charged', 'surge'] as const).map(id => `<div class="hud-resource" data-hud-resource="${id}">${icon(id)}<span data-i18n="${id}"></span><strong id="${id}-value"></strong><small></small><progress max="1" value="0" aria-label="${t(id)}"></progress></div>`).join('')}</div>
    <div class="hud-milestones"><span id="draft-progress"></span><span id="boss-arrival"></span></div>
  </div>`;
}

export function buildPanelMarkup(): string {
  return `<section id="build-panel" class="panel build-panel" role="dialog" aria-modal="true" aria-labelledby="build-title" hidden>
    <h2 id="build-title" data-i18n="hudBuildDetails"></h2><p id="build-milestones"></p><p id="build-status"></p>
    <h3 data-i18n="hudMutations"></h3><div id="mutation-details"></div>
    <h3 data-i18n="hudCurses"></h3><div id="curse-details"></div>
    <div class="build-panel-actions"><button id="build-back" class="secondary" data-i18n="hudBack"></button><button id="build-resume" class="primary" data-i18n="resume"></button></div>
  </section>`;
}

export class CombatHUD {
  private readonly feedback = new HUDFeedback();
  private readonly nodes = new Map<string, HTMLElement>();
  private buildKey = '';
  constructor(private readonly root: HTMLElement) {
    root.querySelectorAll<HTMLElement>('[id]').forEach(node => this.nodes.set(node.id, node));
    const panel = document.querySelector<HTMLElement>('#build-panel')!;
    panel.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusable = [...panel.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
  }
  private node<T extends HTMLElement = HTMLElement>(id: string): T { return this.nodes.get(id) as T; }
  private text(id: string, value: string): void { const node = this.node(id); if (node.textContent !== value) node.textContent = value; }
  reset(): void { this.feedback.reset(); this.buildKey = ''; this.text('combat-notice', ''); }

  private proc(id: BuildId, w: CombatWorld): string {
    const b = w.build;
    switch (id) {
      case 'phantomEdge': return b.phantom > 0 ? seconds(b.phantom) : '';
      case 'staticRiposte': return b.staticCharge > 0 ? seconds(b.staticCharge) : '';
      case 'ironReversal': return b.reversal > 0 ? seconds(b.reversal) : '';
      case 'berserker': return b.frenzy > 0 ? seconds(b.frenzy) : `${b.comboStage}/3`;
      case 'kineticBattery': return `${b.kinetic}/3`;
      case 'soulAnchor': return t(b.anchorUsed ? 'anchorSpent' : 'anchorReady');
      case 'bloodReclaimer': return b.reclaimerCooldown > 0 ? seconds(b.reclaimerCooldown) : '';
      case 'echoChamber': return b.chamberCooldown > 0 ? seconds(b.chamberCooldown) : '';
      case 'aegisCore': return `${Math.floor(w.barrier.aegisDamage)}/${BARRIER.aegisDamage}`;
      case 'guardBreaker': return w.barrier.guardCooldown > 0 ? seconds(w.barrier.guardCooldown) : '';
      case 'ghostStep': return w.dashCharges === 0 ? t('ghostRisk') : '';
      case 'bloodPact': return w.barrier.value > 0 ? t('barrierBlocksHeal') : b.bloodCooldown > 0 ? seconds(b.bloodCooldown) : '';
      case 'parasiticMark': return b.parasiticCooldown > 0 ? seconds(b.parasiticCooldown) : '';
      case 'huntedVessel': return b.huntedCooldown > 0 ? seconds(b.huntedCooldown) : '';
      case 'volatileSoul': return b.hazards.length ? t('hudHazard') : '';
      case 'deathEcho': return w.enemies.some(e => e.echoHaste > 0) ? t('hudHaste') : '';
      case 'glassSoul': return `${t('health')} ${w.maxHp}`;
      default: return '';
    }
  }

  update(w: CombatWorld, run: RunDirector, dt: number): ResourceReadouts {
    const low = w.hp > 0 && w.hp / w.maxHp <= 0.25;
    const ghost = w.hasCurse('ghostStep') && w.dashCharges === 0;
    this.root.classList.toggle('low-health', low);
    this.root.classList.toggle('barrier-broken', w.barrier.broken && w.barrier.flash > 0);
    this.root.classList.toggle('hud-hurt', w.hurtFlash > 0);
    this.root.classList.toggle('hud-heal', w.build.healFlash > 0);
    this.root.closest('.arena-shell')!.classList.toggle('has-boss', w.enemies.some(e => e.kind === 'boss'));
    this.text('hp-value', `${Math.ceil(w.hp)} / ${w.maxHp}`);
    const hp = this.node<HTMLProgressElement>('hp'); hp.max = w.maxHp; hp.value = w.hp; hp.setAttribute('aria-label', t('health'));
    this.text('barrier-value', `${Number(w.barrier.value.toFixed(1))} / ${BARRIER.cap}`);
    this.node<HTMLProgressElement>('barrier').value = w.barrier.value;
    this.node('barrier').setAttribute('aria-label', t('barrier'));
    const recover = (n: number) => t('hudRecover').replace('{n}', seconds(n));
    const resources: ResourceReadouts = {
      dash: { value: `${w.dashCharges}/${COMBAT.dashCharges}`, note: w.dashCharges < COMBAT.dashCharges ? recover(w.rechargeDuration - w.dashRecharge) : t('hudAvailable'), touchNote: w.dashCharges < COMBAT.dashCharges ? seconds(w.rechargeDuration - w.dashRecharge) : '', available: w.dashCharges > 0, fill: (w.dashCharges + w.dashRecharge / w.rechargeDuration) / COMBAT.dashCharges, proc: false },
      heavy: { value: `${w.heavyCharges}/${HEAVY.charges}`, note: w.heavyCharges < HEAVY.charges ? recover(HEAVY.recharge - w.heavyRecharge) : t('hudAvailable'), touchNote: w.heavyCharges < HEAVY.charges ? seconds(HEAVY.recharge - w.heavyRecharge) : '', available: w.heavyCharges > 0, fill: (w.heavyCharges + w.heavyRecharge / HEAVY.recharge) / HEAVY.charges, proc: w.build.reversal > 0 },
      charged: { value: `${w.chargedShots}/3`, note: t('hudPoints').replace('{n}', String(w.chargePoints)), touchNote: `${w.chargePoints}/3`, available: w.chargedShots > 0, fill: w.chargedShots / 3, proc: w.build.staticCharge > 0 },
      surge: { value: `${Math.floor(w.surge)}%`, note: t(w.surge >= 100 ? 'hudAvailable' : 'hudCharging'), touchNote: '', available: w.surge >= 100, fill: w.surge / 100, proc: false },
    };
    for (const id of ['dash', 'heavy', 'charged', 'surge'] as const) {
      const data = resources[id], card = this.root.querySelector<HTMLElement>(`[data-hud-resource="${id}"]`)!;
      this.text(`${id}-value`, data.value);
      const note = card.querySelector('small')!;
      const text = `${data.note}${data.proc ? ` · ${id === 'charged' ? '↯' : '↑'} ${seconds(id === 'charged' ? w.build.staticCharge : w.build.reversal)}` : ''}`;
      if (note.textContent !== text) note.textContent = text;
      card.dataset.state = data.available ? 'ready' : 'empty'; card.classList.toggle('proc-active', data.proc);
      card.querySelector('progress')!.value = Math.min(1, data.fill);
    }
    const notice = this.feedback.update({ hurt: w.hurtFlash, heal: w.build.healFlash, healed: w.build.lastHeal, shieldFlash: w.barrier.flash, broken: w.barrier.broken, perfects: w.perfectDodges, risk: low || ghost, cost: w.build.costFlash }, dt);
    const noticeText = !notice ? '' : notice.kind === 'heal' ? `↑ +${notice.amount} ${t('health')}` : t(({ hit: 'hudHit', break: 'barrierBroken', perfect: 'perfectDodge', risk: 'hudDanger', cost: 'bloodMiss', heal: 'healState' } as const)[notice.kind]);
    this.text('combat-notice', noticeText);
    this.node('combat-notice').dataset.kind = notice?.kind ?? '';
    this.text('hud-warning', [low ? t('hudLowHP') : '', ghost ? t('hudNoDash') : ''].filter(Boolean).join(' · '));
    const buildKey = `${document.documentElement.lang}|${w.mutations.join(',')}|${w.curses.join(',')}`;
    if (buildKey !== this.buildKey) {
      this.buildKey = buildKey;
      const slots = [...Array.from({ length: 4 }, (_, i) => ({ id: w.mutations[i], kind: 'mutation' })), ...Array.from({ length: 2 }, (_, i) => ({ id: w.curses[i], kind: 'curse' }))];
      this.node('build-slots').innerHTML = slots.map(({ id, kind }) => `<span class="build-slot ${kind} ${id ? 'owned' : 'empty'}" title="${id ? t(id) : t('emptySlot')}">${icon(`${kind}-slot`, 'slot-frame')}${id ? icon(id, 'slot-icon') : '<span aria-hidden="true">·</span>'}<small data-proc="${id ?? ''}" aria-hidden="true"></small></span>`).join('');
      this.node('build-count').innerHTML = `<span>${t('hudMutationCount').replace('{n}', String(w.mutations.length))}</span><span>${t('hudCurseCount').replace('{n}', String(w.curses.length))}</span>`;
      this.node('build-summary').setAttribute('aria-label', `${t('hudBuildDetails')}: ${[...w.mutations, ...w.curses].map(id => t(id)).join(', ') || t('emptySlot')}`);
    }
    this.root.querySelectorAll<HTMLElement>('[data-proc]').forEach(node => {
      const id = node.dataset.proc as BuildId;
      const state = id ? this.proc(id, w) : '';
      const short = state.length > 7 ? (id === 'soulAnchor' ? w.build.anchorUsed ? '×' : '✓' : '!') : state;
      if (node.textContent !== short) node.textContent = short;
      node.parentElement!.classList.toggle('has-proc', Boolean(state));
      node.parentElement!.title = id ? `${t(id)}${state ? ` · ${state}` : ''}` : t('emptySlot');
    });
    const progress = (m: { kills: number; minSeconds: number; seconds: number }) => t('milestoneProgress').replace('{kills}', String(w.kills)).replace('{target}', String(m.kills)).replace('{early}', time(m.minSeconds)).replace('{time}', time(m.seconds));
    this.text('draft-progress', `${t('nextEvolution')}: ${run.nextDraft ? progress(run.nextDraft) : t('draftsComplete')}`);
    this.text('boss-arrival', run.bossDue ? '' : `${t('bossArrival')} ${progress(ENCOUNTERS.boss)}`);
    return resources;
  }

  renderDetails(w: CombatWorld): void {
    const entries = (ids: readonly BuildId[], target: string) => {
      document.querySelector(target)!.innerHTML = ids.length ? ids.map(id => `<article class="build-detail">${icon(id)}<div><strong>${t(id)}</strong><p>${t(`${id}Desc`)}</p>${this.proc(id, w) ? `<small>${t('hudState')}: ${this.proc(id, w)}</small>` : ''}</div></article>`).join('') : `<p>${t('emptySlot')}</p>`;
    };
    entries(w.mutations, '#mutation-details'); entries(w.curses, '#curse-details');
    document.querySelector('#build-milestones')!.textContent = `${this.node('draft-progress').textContent} · ${this.node('boss-arrival').textContent}`;
    const cost = Math.round((1 - w.outgoingDamageMultiplier) * 100);
    document.querySelector('#build-status')!.textContent = [cost > 0 ? t('defenseDamageCost').replace('{n}', String(cost)) : '', w.hasCurse('ghostStep') && w.dashCharges === 0 ? t('ghostRisk') : '', w.hasCurse('bloodPact') && w.barrier.value > 0 ? t('barrierBlocksHeal') : '', `${t('surge')} ${Math.floor(w.surge)}/100`, t('hudReadOnly')].filter(Boolean).join(' · ');
  }
}
