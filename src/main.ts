import { ascensionAvailable } from './game/ascension';
import { beginLegacy, chooseLegacy, chooseAnomaly } from './game/legacy';
import { validLegacy, LEGACY_IDS, SIGILS, BRANCHES, ANOMALIES, type SigilId, type AnomalyId, type LegacyId, type LegacyOffer } from './game/config/legacy';
import Phaser from 'phaser';
import { loadProfile, defaultProfile, saveProfile, Progression, mutationPool, cursePool, UNLOCKS } from './game/progression';
import { type CombatWorld } from './game/combat';
import { ArenaScene, type Phase } from './game/ArenaScene';
import { setLocale, t, type Locale, type TranslationKey } from './i18n';
import { DraftInteractionGuard } from './ui/DraftInteractionGuard';
import { MUTATIONS, CURSES } from './game/builds';
import { PLAYTEST_BUILDS, DIVERSITY_ROUTES, routeDraft, BOSS_PLAYTEST } from './game/config/playtests';
import { TouchControls } from './ui/TouchControls';
import { CombatHUD, combatHUDMarkup, buildPanelMarkup } from './ui/CombatHUD';
import './style.css';

const trialBuild = PLAYTEST_BUILDS.find(build => build.id === new URLSearchParams(location.search).get('playtest'));
const trialRoute = DIVERSITY_ROUTES.find(route => route.id === new URLSearchParams(location.search).get('playtest'));
const trialBoss = new URLSearchParams(location.search).get('playtest') === BOSS_PLAYTEST.id;
const sealTrial = /^seal-[0-4]$/.test(new URLSearchParams(location.search).get('playtest') ?? '') ? Number(new URLSearchParams(location.search).get('playtest')!.slice(-1)) : null;
const anomalyTrial = ANOMALIES.find(id => new URLSearchParams(location.search).get('playtest') === `anomaly-${id}`);
const legacyParts = new URLSearchParams(location.search).get('playtest')?.split('-');
const legacyCandidate = legacyParts?.[0] === 'legacy' ? { sigil: legacyParts[1], branch: legacyParts[2] === 'core' ? null : legacyParts[2] } : null;
const legacyTrial: LegacyOffer | null = validLegacy(legacyCandidate) ? legacyCandidate : null;
const buildTrial = Boolean(new URLSearchParams(location.search).has('playtest') || new URLSearchParams(location.search).has('draftSeed') || new URLSearchParams(location.search).has('draftDebug'));
const profile = buildTrial ? defaultProfile() : loadProfile();
if (legacyTrial) {
  profile.totals.runs = 1;
  profile.legacy.unlocks = LEGACY_IDS.filter(id => id === legacyTrial.sigil || id === legacyTrial.branch);
}
if (anomalyTrial) { profile.totals.runs = 1; profile.legacy.unlocks = [...LEGACY_IDS]; }
if (sealTrial !== null) { profile.totals.runs = 1; profile.legacy.unlocks = [...LEGACY_IDS]; profile.legacy.ascension = { version:1, highest:4, selected:sealTrial, clears:[0,1,2,3] }; }
const progression = new Progression(profile);
setLocale(profile.settings.locale);
let saveOK = true;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header class="masthead">
    <div class="brand"><span class="sigil" aria-hidden="true">◇</span>
      <div><p class="eyebrow" data-i18n="prototype"></p><h1 data-i18n="title"></h1></div>
    </div>
    <div class="header-actions">
      <label class="language"><span data-i18n="language"></span>
        <svg class="header-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>
        <select id="locale"><option value="vi" data-i18n="vi"></option><option value="en" data-i18n="en"></option></select>
      </label>
      <button id="pause" class="secondary" disabled>
        <svg class="header-icon pause-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
        <svg class="header-icon resume-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>
        <span class="header-text" data-i18n="pause"></span>
      </button>
    </div>
  </header>
  <section class="arena-shell">
    <div id="game"></div>
    <div id="touch-controls" class="touch-controls" hidden></div>
    <div class="arena-top"><div><span class="eyebrow" data-i18n="stage"></span><p data-i18n="arena"></p></div>
      <span class="status"><i></i><span id="status"></span></span>
    </div>
    <div id="boss-hud" class="boss-hud" hidden><span id="boss-label" data-i18n="bossName"></span><progress aria-labelledby="boss-label" id="boss-health" max="1500" value="1500"></progress></div>
    <span id="run-clock" class="run-clock"></span>
    ${combatHUDMarkup()}
    <div id="overlay" class="overlay">
      ${buildPanelMarkup()}
      <section class="panel" id="menu-panel" aria-labelledby="panel-title">
        <p id="result-banner" class="result-banner" hidden></p>
        <span class="panel-sigil" aria-hidden="true">◇</span>
        <p class="eyebrow" data-i18n="subtitle"></p>
        <h2 id="panel-title" tabindex="-1"></h2><p id="panel-body" class="panel-body"></p>
        <p class="touch-hint" data-i18n="touchHint"></p>
        <div class="mini-controls"><span><kbd data-i18n="moveKey"></kbd><span data-i18n="move"></span></span>
          <span><kbd data-i18n="mouse"></kbd><span data-i18n="aim"></span></span></div>
        <section id="reward-reveal" aria-live="polite" hidden></section>
        <div id="seal-picker"></div><p id="seal-result" role="status"></p>
        <button id="primary" class="primary" disabled></button>
        <button id="menu-build" class="secondary" data-i18n="hudBuildDetails" hidden></button>
        <details id="collection" class="collection"><summary data-i18n="legacyCollection"></summary><div id="collection-list"></div></details>
        <p id="progression-save" role="status"></p>
        <p class="scope" data-i18n="scope"></p>
        <details id="settings" class="settings"><summary data-i18n="settings"></summary>
          <div class="setting-controls">
            <label><input id="mute" type="checkbox"><span data-i18n="mute"></span></label>
            <label><span data-i18n="volume"></span><input id="volume" type="range" min="0" max="1" step="0.05"></label>
            <label><input id="desktop-auto-aim" type="checkbox" aria-describedby="auto-aim-hint"><span data-i18n="desktopAutoAim"></span></label>
            <label id="auto-aim-priority-row" hidden><span data-i18n="autoAimPriority"></span><select id="auto-aim-priority" aria-describedby="auto-aim-hint"><option value="nearest" data-i18n="autoAimNearest"></option><option value="archer" data-i18n="autoAimArcher"></option><option value="elite" data-i18n="autoAimElite"></option></select></label>
            <p id="auto-aim-hint" data-i18n="autoAimHint" hidden></p>
            <label><span data-i18n="cosmetic"></span><select id="cosmetic"><option value="mint" data-i18n="mint"></option><option value="prism" data-i18n="prism"></option></select></label>
          </div>
          <p data-i18n="unlockHint"></p><ul id="unlock-list"></ul>
          <p id="save-status"></p>
        </details>
      </section>
      <section id="draft-panel" class="draft-panel" hidden></section>
    </div>
    <div class="arena-bottom"><span data-i18n="enemyLegend"></span><span data-i18n="scope"></span></div>
  </section>
  <footer><div class="control-bar"><span class="eyebrow" data-i18n="controls"></span>
    <span><kbd data-i18n="moveKey"></kbd> <span data-i18n="move"></span></span>
    <span><kbd data-i18n="mouse"></kbd> <span data-i18n="aim"></span></span>
    <span><kbd data-i18n="meleeKey"></kbd> <span data-i18n="melee"></span></span>
    <span><kbd data-i18n="shootKey"></kbd> <span data-i18n="shoot"></span></span>
    <span><kbd data-i18n="heavyKey"></kbd> <span data-i18n="heavy"></span></span>
    <span><kbd data-i18n="dashKey"></kbd> <span data-i18n="dash"></span></span>
    <span><kbd data-i18n="chargedKey"></kbd> <span data-i18n="charged"></span></span>
    <span><kbd data-i18n="surgeKey"></kbd> <span data-i18n="surge"></span></span>
    <span><kbd data-i18n="pauseKey"></kbd> <span data-i18n="pauseHint"></span></span>
  </div><span class="desktop-note" data-i18n="desktop"></span></footer>
`;

const primary = document.querySelector<HTMLButtonElement>('#primary')!;
const pause = document.querySelector<HTMLButtonElement>('#pause')!;
const overlay = document.querySelector<HTMLDivElement>('#overlay')!;
const touchControls = new TouchControls(document.querySelector<HTMLElement>('#touch-controls')!);
const draftGuard = new DraftInteractionGuard(document.querySelector<HTMLElement>('.arena-shell')!);
draftGuard.onReadyChange = updateDraftReadiness;
let currentPhase: Phase = 'ready';
let buildDetailsOpen = false;
let visiblePanel: string | null = null;
const hud = new CombatHUD(document.querySelector<HTMLElement>('#combat-hud')!);

function renderUI(phase: Phase = currentPhase): void {
  currentPhase = phase;
  renderCollection(phase);
  renderSeals(phase);
  if (phase !== 'paused' && buildDetailsOpen) {
    buildDetailsOpen = false;
    (document.activeElement as HTMLElement | null)?.blur();
  }
  document.querySelector<HTMLElement>('#build-panel')!.hidden = !buildDetailsOpen;
  document.querySelector('#build-summary')!.setAttribute('aria-expanded', String(buildDetailsOpen));
  document.querySelector<HTMLElement>('#menu-build')!.hidden = phase !== 'paused';
  draftGuard.setActive(phase === 'draft' || phase === 'legacy' || phase === 'anomaly');
  overlay.dataset.result = phase === 'victory' || phase === 'defeat' ? phase : '';
  const resultBanner = document.querySelector<HTMLElement>('#result-banner')!;
  resultBanner.hidden = phase !== 'victory' && phase !== 'defeat';
  resultBanner.textContent = phase === 'victory' ? t('runComplete') : phase === 'defeat' ? t('runFailed') : '';
  document.querySelector<HTMLElement>('#trial-label')!.hidden = !buildTrial;
  document.title = t('pageTitle');
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n as TranslationKey);
  });
  if (buildTrial) document.querySelector('#trial-label')!.textContent = legacyTrial ? t('legacyTrial') : t(trialBoss ? BOSS_PLAYTEST.label : (trialRoute ?? trialBuild)?.label ?? 'legacyTrial');
  document.querySelector('#status')!.textContent = t(phase);
  document.querySelector('#panel-title')!.textContent = t(phase === 'victory' ? 'victoryTitle' : phase === 'defeat' ? 'defeatTitle' : phase === 'ready' ? 'welcomeTitle' : 'pauseTitle');
  document.querySelector('#panel-body')!.textContent = (phase === 'victory' || phase === 'defeat') ? resultBody() : t(phase === 'ready' ? touchControls.enabled ? 'touchWelcomeBody' : 'welcomeBody' : 'pauseBody');
  primary.disabled = !buildTrial && !profile.legacy.ticket && profile.legacy.nextRunId > 1_000_000;
  primary.textContent = t(phase === 'victory' || phase === 'defeat' ? 'playAgain' : phase === 'ready' ? 'start' : 'resume');
  const pauseLabel = t(phase === 'paused' ? 'resume' : 'pause');
  pause.querySelector('.header-text')!.textContent = pauseLabel;
  pause.setAttribute('aria-label', pauseLabel);
  pause.title = pauseLabel;
  pause.dataset.paused = String(phase === 'paused');
  const localeSelect = document.querySelector<HTMLSelectElement>('#locale')!;
  localeSelect.setAttribute('aria-label', t('language'));
  localeSelect.parentElement!.title = t('language');
  pause.disabled = phase !== 'playing' && phase !== 'paused';
  document.querySelector<HTMLDivElement>('#menu-panel')!.hidden = phase === 'draft' || phase === 'legacy' || phase === 'anomaly' || buildDetailsOpen;
  const draftPanel = document.querySelector<HTMLDivElement>('#draft-panel')!;
  draftPanel.hidden = phase !== 'draft' && phase !== 'legacy' && phase !== 'anomaly';
  if (phase === 'draft') renderDraft();
  if (phase === 'legacy') renderLegacy();
  if (phase === 'anomaly') renderAnomaly();
  overlay.hidden = phase === 'playing' || phase === 'victory' && arena.victoryRevealing;
  document.querySelector('#game')!.classList.toggle('playing', phase === 'playing');
  document.querySelector('canvas')?.setAttribute('aria-label', t(touchControls.enabled ? 'touchArenaLabel' : 'arenaLabel'));
  touchControls.translate();
  touchControls.setActive(phase === 'playing');
  // Only a newly visible panel resets scroll/focus; locale/settings rerenders retain it.
  const panel = overlay.hidden ? null : buildDetailsOpen ? 'build' : phase;
  if (panel !== visiblePanel) {
    visiblePanel = panel;
    if (panel && panel !== 'build') {
      const container = document.querySelector<HTMLElement>(phase === 'draft' || phase === 'legacy' || phase === 'anomaly' ? '#draft-panel' : '#menu-panel')!;
      container.scrollTop = 0;
      const title = container.querySelector<HTMLElement>('h2')!;
      title.tabIndex = -1;
      title.focus({ preventScroll: true });
    }
  }
}

function renderSeals(phase: Phase): void {
  const picker = document.querySelector<HTMLElement>('#seal-picker')!;
  picker.hidden = phase !== 'ready' && phase !== 'victory' && phase !== 'defeat';
  const progress = profile.legacy.ascension, ticket = profile.legacy.ticket;
  const selected = ticket?.seal ?? progress.selected;
  picker.innerHTML = `<label>${t('sealChoose')} <select id="seal-select" ${ticket || !ascensionAvailable(profile.legacy.unlocks) ? 'disabled' : ''}>${[0,1,2,3,4].map(n=>`<option value="${n}" ${selected===n?'selected':''} ${n>progress.highest?'disabled':''}>${t('sealBadge').replace('{n}',String(n))} · ${t(`sealName${n}` as TranslationKey)}${n>progress.highest?' · '+t('legacyLocked'):''}</option>`).join('')}</select></label><p>${!ascensionAvailable(profile.legacy.unlocks)?t('sealRequirement'):''}</p><p>${Array.from({length:selected+1},(_,n)=>t(`sealMod${n}` as TranslationKey)).join(' ')}</p>`;
  document.querySelector('#seal-select')!.addEventListener('change', event=>{
    if (profile.legacy.ticket) return;
    const n=Number((event.target as HTMLSelectElement).value);
    if (Number.isInteger(n) && n>=0 && n<=progress.highest) { progress.selected=n; persist(); renderSeals(phase); }
  });
  const receipt=profile.legacy.receipt;
  document.querySelector('#seal-result')!.textContent = phase==='victory' && receipt?.sealClear !== undefined ? t('sealClear').replace('{n}',String(receipt.sealClear)) + (receipt.sealUnlocked !== undefined ? ' '+t('sealUnlock').replace('{n}',String(receipt.sealUnlocked)) : '') : '';
}

function resultBody(): string {
  if (profile.legacy.receipt && !arena.run.result) return t(profile.legacy.receipt.result === 'victory' ? 'victoryBody' : 'defeatBody');
  return t(arena.run.result === 'victory' ? 'victoryBody' : arena.run.reason === 'deadline' ? 'deadlineBody' : 'defeatBody') +
    ' ' + t('resultStats').replace('{kills}', String(arena.combat.kills)).replace('{time}', String(Math.floor(arena.run.elapsed)));
}

function draftReason(option: import('./game/builds').DraftOption): string {
  const reason = option.reason;
  if (!reason) return '';
  return reason.kind === 'synergy' ? t('reasonSynergy').replace('{item}', t(reason.id)) : t(`reason_${reason.tag}`);
}
function unlockMarkup(id: LegacyId): string {
  const kind = SIGILS.includes(id as SigilId) ? 'rewardSigil' : ANOMALIES.includes(id as AnomalyId) ? 'rewardAnomaly' : 'rewardBranch';
  return `<article class="collection-item"><strong>${t(`legacy_${id}`)}</strong><small>${t(kind)} · ${t(profile.legacy.unlocks.includes(id) ? 'unlocked' : 'legacyLocked')}</small><p>${t(`legacy_${id}Desc`)}</p></article>`;
}
function renderCollection(phase: Phase): void {
  const rewards = profile.legacy.receipt?.rewards ?? [];
  const reveal = document.querySelector<HTMLElement>('#reward-reveal')!;
  reveal.hidden = phase !== 'victory' || buildTrial;
  reveal.innerHTML = `<h3>${t('victoryRewards')}</h3>${rewards.length ? rewards.map(unlockMarkup).join('') : `<p>${t('collectionComplete')}</p>`}`;
  const sigils = profile.legacy.unlocks.filter(id => SIGILS.includes(id as SigilId)).length;
  const branches = profile.legacy.unlocks.filter(id => Object.hasOwn(BRANCHES, id)).length;
  document.querySelector('#collection-list')!.innerHTML = `<p>${t('collectionCounts').replace('{sigils}', String(sigils)).replace('{branches}', String(branches))}</p>${LEGACY_IDS.map(unlockMarkup).join('')}`;
}
function renderAnomaly(): void {
  const ticket = profile.legacy.ticket!;
  document.querySelector('#draft-panel')!.innerHTML = `<h2>${t('anomalyChoose')}</h2><p>${t('anomalyHint')}</p><p id="draft-readiness" role="status"></p><p role="status">${saveOK ? '' : t('rewardSaveRetry')}</p><div class="draft-options opening">${ticket.anomalyOffers.map((id, index) => `<button class="draft-card" data-choice="${index}"><strong>${t(`legacy_${id}`)}</strong><span>${t(`anomaly_${id}Benefit`)}</span><span>${t(`anomaly_${id}Risk`)}</span></button>`).join('')}</div>`;
  updateDraftReadiness();
}
function renderLegacy(): void {
  const ticket = profile.legacy.ticket!;
  document.querySelector('#draft-panel')!.innerHTML = `<h2>${t('legacyChoose')}</h2><p>${t('legacyHint')}</p><p id="draft-readiness" role="status"></p><div class="draft-options opening">${ticket.offers.map((o, index) => `<button class="draft-card" data-choice="${index}"><strong>${t(`legacy_${o.sigil}`)}</strong><span>${t(`legacy_${o.sigil}Desc`)}</span><strong>${o.branch ? t(`legacy_${o.branch}`) : t('legacyCore')}</strong><span>${o.branch ? t(`legacy_${o.branch}Desc`) : ''}</span></button>`).join('')}</div>`;
  updateDraftReadiness();
}
function renderDraft(): void {
  const panel = document.querySelector('#draft-panel')!;
  panel.innerHTML = `<h2>${t(arena.run.draftKind === 'curse' ? 'curseDraft' : 'mutationDraft')}</h2><p>${t('draftHint')}${arena.run.draft.some(option => option.direction) ? ' ' + t('openingDraftHint') : ''}${arena.run.draftKind === 'curse' && arena.combat.curses.length ? ' ' + t(arena.combat.curses.length === 2 ? 'curseFullHint' : 'curseSwapHint') : ''}</p><p id="draft-readiness" role="status"></p><div class="draft-options${arena.run.draft.some(option => option.direction) ? ' opening' : ''}">${arena.run.draft.map((option, index) =>
    `<button class="draft-card" data-choice="${index}"><small>${t(option.direction ? `opening_${option.direction}` : option.action === 'keep' ? 'keepCurse' : arena.run.draftKind === 'curse' ? option.replaceSlot !== undefined ? 'replaceCurse' : 'addCurse' : trialRoute && trialRoute.mutations.find(id => !arena.combat.mutations.includes(id)) === option.id ? 'routeRecommended' : option.role)}</small><strong>${option.action === 'keep' ? arena.combat.curses.map(id => t(id)).join(' + ') : t(option.id)}</strong>${option.replaceSlot !== undefined ? `<span>${t('replaceCurseSlot').replace('{slot}', String(option.replaceSlot + 1)).replace('{item}', t(arena.combat.curses[option.replaceSlot]))}</span>` : ''}${trialRoute && option.id === trialRoute.curse && option.action !== 'keep' ? `<span class="draft-reason">${t('routeRecommended')}</span>` : ''}${option.reason ? `<span class="draft-reason">${draftReason(option)}</span>` : ''}<span>${option.action === 'keep' ? t('keepBuildDesc') : t(`${option.id}Desc`)}</span>${option.fractured ? `<span class="draft-reason">${t('fracturedChoice')}</span>` : ''}</button>`).join('')}</div>`;
  updateDraftReadiness();
}

function updateDraftReadiness(): void {
  document.querySelectorAll<HTMLButtonElement>('#draft-panel [data-choice]').forEach(button => { button.disabled = !draftGuard.ready || currentPhase === 'anomaly' && Boolean(profile.legacy.ticket?.anomalySelected) && profile.legacy.ticket?.anomalySelected !== profile.legacy.ticket?.anomalyOffers[Number(button.dataset.choice)]; });
  const status = document.querySelector('#draft-readiness');
  if (status) status.textContent = t(draftGuard.ready ? 'draftReady' : 'draftWait');
}
document.querySelector('#draft-panel')!.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-choice]');
  if (button && draftGuard.accepts(event as MouseEvent, button)) {
    const index = Number(button.dataset.choice);
    if (currentPhase === 'anomaly') {
      if (profile.legacy.ticket?.anomalySelected || chooseAnomaly(profile.legacy, index)) {
        persist();
        if (!buildTrial && !saveOK) { renderAnomaly(); return; }
        if (arena.run.resolveAnomaly()) arena.setPhase('playing');
      }
    } else if (currentPhase === 'legacy') {
      if (chooseLegacy(profile.legacy, index)) {
        arena.combat.legacy.equip(profile.legacy.ticket!.selected);
        persist(); arena.setPhase('playing');
      }
    } else arena.chooseDraft(index);
  }
});
for (const type of ['keydown', 'keyup']) document.querySelector('#draft-panel')!.addEventListener(type, event => {
  if ((event as KeyboardEvent).key === ' ' || (event as KeyboardEvent).key === 'Enter') event.stopPropagation();
});
renderUI();
touchControls.onModeChange = () => { renderUI(); game.scale.refresh(); };
document.querySelector<HTMLSelectElement>('#locale')!.value = profile.settings.locale;

function persist(): void {
  if (buildTrial) return;
  saveOK = saveProfile(profile);
  document.querySelector('#progression-save')!.textContent = saveOK ? '' : t('rewardSaveRetry');
  document.querySelector('#save-status')!.textContent = buildTrial ? t('legacyTrial') : saveOK ? t('savedLocally') : t('saveUnavailable');
}
function renderSettings(): void {
  document.querySelector<HTMLInputElement>('#desktop-auto-aim')!.checked = profile.settings.desktopAutoAim;
  document.querySelector<HTMLElement>('#auto-aim-priority-row')!.hidden = !profile.settings.desktopAutoAim;
  document.querySelector<HTMLElement>('#auto-aim-hint')!.hidden = !profile.settings.desktopAutoAim;
  document.querySelector<HTMLSelectElement>('#auto-aim-priority')!.value = profile.settings.autoAimPriority;
  document.querySelector<HTMLInputElement>('#mute')!.checked = profile.settings.muted;
  document.querySelector<HTMLInputElement>('#volume')!.value = String(profile.settings.volume);
  document.querySelector<HTMLOptionElement>('#cosmetic option[value="prism"]')!.disabled = !profile.unlocks.includes('wardenBreaker');
  document.querySelector<HTMLSelectElement>('#cosmetic')!.value = profile.settings.cosmetic;
  const values = [profile.totals.kills, profile.totals.detonations, profile.totals.perfectDodges, profile.totals.victories];
  const targets = [1, 5, 3, 1];
  document.querySelector('#unlock-list')!.innerHTML = UNLOCKS.map((id, index) => `<li class="${profile.unlocks.includes(id) ? 'unlocked' : ''}">${profile.unlocks.includes(id) ? t('unlocked') : `${Math.min(values[index], targets[index])}/${targets[index]}`} · ${t(id)}</li>`).join('');
  document.querySelector('#progression-save')!.textContent = saveOK ? '' : t('rewardSaveRetry');
  document.querySelector('#save-status')!.textContent = buildTrial ? t('legacyTrial') : saveOK ? t('savedLocally') : t('saveUnavailable');
}
function applySettings(): void {
  game.sound.mute = profile.settings.muted;
  game.sound.volume = profile.settings.volume;
  arena.cosmetic = profile.settings.cosmetic;
  arena.desktopAutoAim = profile.settings.desktopAutoAim;
  arena.autoAimPriority = profile.settings.autoAimPriority;
  arena.run.mutationPool = sealTrial === 3 ? ['staticRiposte'] : trialRoute || sealTrial !== null ? MUTATIONS : mutationPool(profile);
  arena.run.cursePool = trialRoute ? CURSES : cursePool(profile);
}

function renderCombatHUD(world: CombatWorld): void {
  if (!buildTrial && progression.observe(world, arena.run.result)) {
    applySettings(); renderSettings(); persist();
  }
  const boss = world.enemies.find(enemy => enemy.kind === 'boss');
  document.querySelector<HTMLElement>('#boss-hud')!.hidden = !boss;
  if (boss) document.querySelector<HTMLProgressElement>('#boss-health')!.value = boss.hp;
  const seconds = Math.floor(arena.run.elapsed);
  document.querySelector('#run-clock')!.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} / 5:00`;
  const dt = currentPhase === 'playing' && world.hitstop <= 0 ? Math.min(game.loop.delta / 1000, 0.1) : 0;
  const readouts = hud.update(world, arena.run, dt);
  if (touchControls.enabled) touchControls.updateResources(readouts);
  if (buildDetailsOpen) hud.renderDetails(world);
}

export const arena = new ArenaScene((phase) => {
  if ((phase === 'playing' || phase === 'legacy') && (currentPhase === 'ready' || currentPhase === 'victory' || currentPhase === 'defeat')) {
    hud.reset();
    if (trialBoss) {
      arena.combat.mutations = [...BOSS_PLAYTEST.mutations];
      arena.combat.setCurses([...BOSS_PLAYTEST.curses]);
      arena.run.prepareBossPlaytest(BOSS_PLAYTEST.kills, BOSS_PLAYTEST.seconds);
    } else if (trialBuild) {
      arena.combat.mutations = [...trialBuild!.mutations];
      arena.combat.setCurses([trialBuild!.curse]);
    } else if (!buildTrial) {
      const ticket = beginLegacy(profile.legacy, profile.totals.runs);
      progression.beginRun(!ticket.started); ticket.started = true;
      arena.run.previousOffers = [...profile.drafts.previous];
    }
    if (legacyTrial) { const ticket = beginLegacy(profile.legacy, 1); ticket.started = true; }
    if (profile.legacy.ticket?.selected) arena.combat.legacy.equip(profile.legacy.ticket.selected);
    if (anomalyTrial) {
      const ticket = beginLegacy(profile.legacy, 1); ticket.started = true;
      ticket.anomalyOffers = [anomalyTrial, ANOMALIES.find(id => id !== anomalyTrial)!];
      arena.run.prepareBossPlaytest(0, 134);
    }
    if (sealTrial !== null) {
      const ticket = beginLegacy(profile.legacy, 1); ticket.started = true;
      arena.run.prepareSealPlaytest(ticket.seal);
    }
    arena.combat.ascension.seal = profile.legacy.ticket?.seal ?? 0;
    arena.run.anomalyTicket = profile.legacy.ticket;
    applySettings();
  }
  if (phase === 'draft' || phase === 'victory' || phase === 'defeat') {
    if (phase === 'draft' && trialRoute) arena.run.draft = routeDraft(trialRoute, arena.run.draftKind, arena.combat.mutations, arena.combat.curses, arena.run.draft);
    if (!buildTrial) {
      progression.observe(arena.combat, arena.run.result);
      if (phase === 'draft') progression.offerDraft(arena.run.draft.map(o => o.id));
    }
    applySettings();
    renderSettings();
  }
  renderUI(phase);
  persist();
}, () => {
  primary.disabled = false;
  document.querySelector('canvas')?.setAttribute('aria-label', t(touchControls.enabled ? 'touchArenaLabel' : 'arenaLabel'));
  applySettings();
  renderSettings();
  if (profile.legacy.receipt) { arena.phase = profile.legacy.receipt.result; renderUI(profile.legacy.receipt.result); }
}, renderCombatHUD, touchControls);

const draftSeedText = new URLSearchParams(location.search).get('draftSeed');
if (draftSeedText !== null && /^\d{1,10}$/.test(draftSeedText) && Number(draftSeedText) <= 0xffffffff) arena.run.seedOverride = Number(draftSeedText);
if (new URLSearchParams(location.search).get('draftDebug') === '1') Object.defineProperty(window, 'cursebreakDraft', {
  configurable: true, get: () => structuredClone(arena.run.draftDebug),
});
export const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#090d19',
  pixelArt: true,
  scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
  scene: [arena],
  input: { keyboard: true, mouse: true },
});

// Opening details uses the existing pause/reset lifecycle, including armed releases.
function openBuildDetails(): void {
  if (buildDetailsOpen || (currentPhase !== 'playing' && currentPhase !== 'paused')) return;
  buildDetailsOpen = true;
  arena.setPhase('paused');
  hud.renderDetails(arena.combat);
  document.querySelector<HTMLButtonElement>('#build-back')!.focus();
}
for (const id of ['build-summary', 'menu-build']) {
  const button = document.querySelector<HTMLButtonElement>(`#${id}`)!;
  for (const type of ['keydown', 'keyup']) button.addEventListener(type, event => {
    if ((event as KeyboardEvent).key === ' ' || (event as KeyboardEvent).key === 'Enter') event.stopPropagation();
  });
  button.addEventListener('pointerdown', event => event.stopPropagation());
  button.addEventListener('pointerup', event => {
    event.stopPropagation();
    if (event.pointerType === 'touch') { event.preventDefault(); openBuildDetails(); }
  });
  button.addEventListener('click', event => { event.stopPropagation(); openBuildDetails(); });
}
document.querySelector('#build-back')!.addEventListener('click', () => {
  buildDetailsOpen = false; renderUI('paused'); primary.focus();
});
document.querySelector('#build-resume')!.addEventListener('click', () => {
  buildDetailsOpen = false;
  (document.activeElement as HTMLElement | null)?.blur();
  arena.setPhase('playing');
});

primary.addEventListener('click', () => {
  if (!buildTrial && currentPhase !== 'paused') {
    // Never leave a result before a complete durable snapshot exists.
    persist();
    if (!saveOK) return;
    profile.legacy.receipt = null;
  }
  let phase: Phase = 'playing';
  if (currentPhase !== 'paused' && (!buildTrial || legacyTrial || sealTrial !== null)) {
    const ticket = beginLegacy(profile.legacy, profile.totals.runs);
    persist();
    if (!buildTrial && !saveOK) return;
    arena.run.seedOverride = ticket.seed;
    if (ticket.offers.length && !ticket.selected) phase = 'legacy';
  }
  arena.setPhase(phase);
  primary.blur();
});
pause.addEventListener('click', () => {
  arena.setPhase(currentPhase === 'playing' ? 'paused' : 'playing');
  pause.blur();
});
document.querySelector<HTMLSelectElement>('#locale')!.addEventListener('change', (event) => {
  profile.settings.locale = (event.target as HTMLSelectElement).value as Locale;
  setLocale(profile.settings.locale);
  renderUI();
  renderCombatHUD(arena.combat);
  renderSettings();
  persist();
  (event.target as HTMLSelectElement).blur();
});

for (const id of ['mute', 'volume', 'cosmetic', 'desktop-auto-aim', 'auto-aim-priority']) {
  document.querySelector(`#${id}`)!.addEventListener('change', () => {
    profile.settings.desktopAutoAim = document.querySelector<HTMLInputElement>('#desktop-auto-aim')!.checked;
    const priority = document.querySelector<HTMLSelectElement>('#auto-aim-priority')!.value;
    profile.settings.autoAimPriority = priority === 'archer' || priority === 'elite' ? priority : 'nearest';
    profile.settings.muted = document.querySelector<HTMLInputElement>('#mute')!.checked;
    profile.settings.volume = Number(document.querySelector<HTMLInputElement>('#volume')!.value);
    const cosmetic = document.querySelector<HTMLSelectElement>('#cosmetic')!.value;
    profile.settings.cosmetic = cosmetic === 'prism' && profile.unlocks.includes('wardenBreaker') ? 'prism' : 'mint';
    applySettings(); renderSettings(); persist();
  });
}
window.addEventListener('pagehide', () => { if (!buildTrial) progression.observe(arena.combat, arena.run.result); persist(); });
