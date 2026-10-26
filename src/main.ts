import Phaser from 'phaser';
import { loadProfile, saveProfile, Progression, mutationPool, cursePool, UNLOCKS } from './game/progression';
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
const buildTrial = Boolean(trialBuild || trialRoute || trialBoss);
const profile = loadProfile();
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
        <select id="locale"><option value="vi" data-i18n="vi"></option><option value="en" data-i18n="en"></option></select>
      </label>
      <button id="pause" class="secondary" disabled data-i18n="pause"></button>
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
        <button id="primary" class="primary" disabled></button>
        <button id="menu-build" class="secondary" data-i18n="hudBuildDetails" hidden></button>
        <p class="scope" data-i18n="scope"></p>
        <details id="settings" class="settings"><summary data-i18n="settings"></summary>
          <div class="setting-controls">
            <label><input id="mute" type="checkbox"><span data-i18n="mute"></span></label>
            <label><span data-i18n="volume"></span><input id="volume" type="range" min="0" max="1" step="0.05"></label>
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
  if (phase !== 'paused' && buildDetailsOpen) {
    buildDetailsOpen = false;
    (document.activeElement as HTMLElement | null)?.blur();
  }
  document.querySelector<HTMLElement>('#build-panel')!.hidden = !buildDetailsOpen;
  document.querySelector('#build-summary')!.setAttribute('aria-expanded', String(buildDetailsOpen));
  document.querySelector<HTMLElement>('#menu-build')!.hidden = phase !== 'paused';
  draftGuard.setActive(phase === 'draft');
  overlay.dataset.result = phase === 'victory' || phase === 'defeat' ? phase : '';
  const resultBanner = document.querySelector<HTMLElement>('#result-banner')!;
  resultBanner.hidden = phase !== 'victory' && phase !== 'defeat';
  resultBanner.textContent = phase === 'victory' ? t('runComplete') : phase === 'defeat' ? t('runFailed') : '';
  document.querySelector<HTMLElement>('#trial-label')!.hidden = !buildTrial;
  document.title = t('pageTitle');
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n as TranslationKey);
  });
  if (buildTrial) document.querySelector('#trial-label')!.textContent = t(trialBoss ? BOSS_PLAYTEST.label : (trialRoute ?? trialBuild)!.label);
  document.querySelector('#status')!.textContent = t(phase);
  document.querySelector('#panel-title')!.textContent = t(phase === 'victory' ? 'victoryTitle' : phase === 'defeat' ? 'defeatTitle' : phase === 'ready' ? 'welcomeTitle' : 'pauseTitle');
  document.querySelector('#panel-body')!.textContent = (phase === 'victory' || phase === 'defeat') ? resultBody() : t(phase === 'ready' ? touchControls.enabled ? 'touchWelcomeBody' : 'welcomeBody' : 'pauseBody');
  primary.textContent = t(phase === 'victory' || phase === 'defeat' ? 'playAgain' : phase === 'ready' ? 'start' : 'resume');
  pause.textContent = t(phase === 'paused' ? 'resume' : 'pause');
  pause.disabled = phase !== 'playing' && phase !== 'paused';
  document.querySelector<HTMLDivElement>('#menu-panel')!.hidden = phase === 'draft' || buildDetailsOpen;
  const draftPanel = document.querySelector<HTMLDivElement>('#draft-panel')!;
  draftPanel.hidden = phase !== 'draft';
  if (phase === 'draft') renderDraft();
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
      const container = document.querySelector<HTMLElement>(phase === 'draft' ? '#draft-panel' : '#menu-panel')!;
      container.scrollTop = 0;
      const title = container.querySelector<HTMLElement>('h2')!;
      title.tabIndex = -1;
      title.focus({ preventScroll: true });
    }
  }
}

function resultBody(): string {
  return t(arena.run.result === 'victory' ? 'victoryBody' : arena.run.reason === 'deadline' ? 'deadlineBody' : 'defeatBody') +
    ' ' + t('resultStats').replace('{kills}', String(arena.combat.kills)).replace('{time}', String(Math.floor(arena.run.elapsed)));
}

function draftReason(option: import('./game/builds').DraftOption): string {
  const reason = option.reason;
  if (!reason) return '';
  return reason.kind === 'synergy' ? t('reasonSynergy').replace('{item}', t(reason.id)) : t(`reason_${reason.tag}`);
}
function renderDraft(): void {
  const panel = document.querySelector('#draft-panel')!;
  panel.innerHTML = `<h2>${t(arena.run.draftKind === 'curse' ? 'curseDraft' : 'mutationDraft')}</h2><p>${t('draftHint')}${arena.run.draft.some(option => option.direction) ? ' ' + t('openingDraftHint') : ''}${arena.run.draftKind === 'curse' && arena.combat.curses.length ? ' ' + t(arena.combat.curses.length === 2 ? 'curseFullHint' : 'curseSwapHint') : ''}</p><p id="draft-readiness" role="status"></p><div class="draft-options${arena.run.draft.some(option => option.direction) ? ' opening' : ''}">${arena.run.draft.map((option, index) =>
    `<button class="draft-card" data-choice="${index}"><small>${t(option.direction ? `opening_${option.direction}` : option.action === 'keep' ? 'keepCurse' : arena.run.draftKind === 'curse' ? option.replaceSlot !== undefined ? 'replaceCurse' : 'addCurse' : trialRoute && trialRoute.mutations.find(id => !arena.combat.mutations.includes(id)) === option.id ? 'routeRecommended' : option.role)}</small><strong>${option.action === 'keep' ? arena.combat.curses.map(id => t(id)).join(' + ') : t(option.id)}</strong>${option.replaceSlot !== undefined ? `<span>${t('replaceCurseSlot').replace('{slot}', String(option.replaceSlot + 1)).replace('{item}', t(arena.combat.curses[option.replaceSlot]))}</span>` : ''}${trialRoute && option.id === trialRoute.curse && option.action !== 'keep' ? `<span class="draft-reason">${t('routeRecommended')}</span>` : ''}${option.reason ? `<span class="draft-reason">${draftReason(option)}</span>` : ''}<span>${option.action === 'keep' ? t('keepBuildDesc') : t(`${option.id}Desc`)}</span></button>`).join('')}</div>`;
  updateDraftReadiness();
}

function updateDraftReadiness(): void {
  document.querySelectorAll<HTMLButtonElement>('#draft-panel [data-choice]').forEach(button => { button.disabled = !draftGuard.ready; });
  const status = document.querySelector('#draft-readiness');
  if (status) status.textContent = t(draftGuard.ready ? 'draftReady' : 'draftWait');
}
document.querySelector('#draft-panel')!.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-choice]');
  if (button && draftGuard.accepts(event as MouseEvent, button)) arena.chooseDraft(Number(button.dataset.choice));
});
for (const type of ['keydown', 'keyup']) document.querySelector('#draft-panel')!.addEventListener(type, event => {
  if ((event as KeyboardEvent).key === ' ' || (event as KeyboardEvent).key === 'Enter') event.stopPropagation();
});
renderUI();
touchControls.onModeChange = () => { renderUI(); game.scale.refresh(); };
document.querySelector<HTMLSelectElement>('#locale')!.value = profile.settings.locale;

function persist(): void {
  saveOK = saveProfile(profile);
  document.querySelector('#save-status')!.textContent = saveOK ? t('savedLocally') : t('saveUnavailable');
}
function renderSettings(): void {
  document.querySelector<HTMLInputElement>('#mute')!.checked = profile.settings.muted;
  document.querySelector<HTMLInputElement>('#volume')!.value = String(profile.settings.volume);
  document.querySelector<HTMLOptionElement>('#cosmetic option[value="prism"]')!.disabled = !profile.unlocks.includes('wardenBreaker');
  document.querySelector<HTMLSelectElement>('#cosmetic')!.value = profile.settings.cosmetic;
  const values = [profile.totals.kills, profile.totals.detonations, profile.totals.perfectDodges, profile.totals.victories];
  const targets = [1, 5, 3, 1];
  document.querySelector('#unlock-list')!.innerHTML = UNLOCKS.map((id, index) => `<li class="${profile.unlocks.includes(id) ? 'unlocked' : ''}">${profile.unlocks.includes(id) ? t('unlocked') : `${Math.min(values[index], targets[index])}/${targets[index]}`} · ${t(id)}</li>`).join('');
  document.querySelector('#save-status')!.textContent = saveOK ? t('savedLocally') : t('saveUnavailable');
}
function applySettings(): void {
  game.sound.mute = profile.settings.muted;
  game.sound.volume = profile.settings.volume;
  arena.cosmetic = profile.settings.cosmetic;
  arena.run.mutationPool = trialRoute ? MUTATIONS : mutationPool(profile);
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
  if (phase === 'playing' && (currentPhase === 'ready' || currentPhase === 'victory' || currentPhase === 'defeat')) {
    hud.reset();
    if (trialBoss) {
      arena.combat.mutations = [...BOSS_PLAYTEST.mutations];
      arena.combat.setCurses([...BOSS_PLAYTEST.curses]);
      arena.run.prepareBossPlaytest(BOSS_PLAYTEST.kills, BOSS_PLAYTEST.seconds);
    } else if (trialBuild) {
      arena.combat.mutations = [...trialBuild!.mutations];
      arena.combat.setCurses([trialBuild!.curse]);
    } else if (!buildTrial) {
      progression.beginRun();
      arena.run.previousOffers = [...profile.drafts.previous];
    }
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
  arena.setPhase('playing');
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

for (const id of ['mute', 'volume', 'cosmetic']) {
  document.querySelector(`#${id}`)!.addEventListener('change', () => {
    profile.settings.muted = document.querySelector<HTMLInputElement>('#mute')!.checked;
    profile.settings.volume = Number(document.querySelector<HTMLInputElement>('#volume')!.value);
    const cosmetic = document.querySelector<HTMLSelectElement>('#cosmetic')!.value;
    profile.settings.cosmetic = cosmetic === 'prism' && profile.unlocks.includes('wardenBreaker') ? 'prism' : 'mint';
    applySettings(); renderSettings(); persist();
  });
}
window.addEventListener('pagehide', () => { if (!buildTrial) progression.observe(arena.combat, arena.run.result); persist(); });
