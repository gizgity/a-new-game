import Phaser from 'phaser';
import { HEAVY, ENCOUNTERS, BARRIER } from './game/config/balance';
import { loadProfile, saveProfile, Progression, mutationPool, cursePool, UNLOCKS } from './game/progression';
import { COMBAT, type CombatWorld } from './game/combat';
import { ArenaScene, type Phase } from './game/ArenaScene';
import { setLocale, t, type Locale, type TranslationKey } from './i18n';
import { DraftInteractionGuard } from './ui/DraftInteractionGuard';
import { TouchControls } from './ui/TouchControls';
import './style.css';

const juggernautTrial = new URLSearchParams(location.search).get('playtest') === 'juggernaut';
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
    <div class="combat-hud">
      <span id="trial-label" class="trial-label" hidden data-i18n="juggernautTest"></span>
      <div class="health"><span id="health-label" data-i18n="health"></span><span id="hp-value"></span><progress aria-labelledby="health-label" id="hp" max="100" value="100"></progress></div>
      <div class="barrier-state"><span id="barrier-label" data-i18n="barrier"></span><span id="barrier-value"></span><progress aria-labelledby="barrier-label" id="barrier" max="30" value="0"></progress><span id="barrier-feedback"></span><span id="aegis-progress"></span></div>
      <div class="dash-state"><span id="dash-label" data-i18n="dash"></span><span id="dash-value"></span><progress aria-labelledby="dash-label" id="dash-recharge" max="2.8" value="0"></progress></div>
      <div class="resource-state"><span data-i18n="charged"></span><span id="charged-value"></span></div>
      <div class="resource-state"><span data-i18n="heavy"></span><span id="heavy-value"></span></div>
      <div class="resource-state"><span data-i18n="surge"></span><span id="surge-value"></span></div>
      <div class="resource-state milestone-state"><span data-i18n="nextEvolution"></span><span id="draft-progress"></span></div>
      <div id="boss-arrival" class="resource-state milestone-state"></div>
      <span id="build-value" class="build-value"></span>
      <span id="combat-notice" aria-live="polite"></span>
    </div>
    <div id="overlay" class="overlay">
      <section class="panel" id="menu-panel" aria-labelledby="panel-title">
        <p id="result-banner" class="result-banner" hidden></p>
        <span class="panel-sigil" aria-hidden="true">◇</span>
        <p class="eyebrow" data-i18n="subtitle"></p>
        <h2 id="panel-title"></h2><p id="panel-body" class="panel-body"></p>
        <p class="touch-hint" data-i18n="touchHint"></p>
        <div class="mini-controls"><span><kbd data-i18n="moveKey"></kbd><span data-i18n="move"></span></span>
          <span><kbd data-i18n="mouse"></kbd><span data-i18n="aim"></span></span></div>
        <button id="primary" class="primary" disabled></button>
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
let currentPhase: Phase = 'ready';

function renderUI(phase: Phase = currentPhase): void {
  currentPhase = phase;
  draftGuard.setActive(phase === 'draft');
  overlay.dataset.result = phase === 'victory' || phase === 'defeat' ? phase : '';
  const resultBanner = document.querySelector<HTMLElement>('#result-banner')!;
  resultBanner.hidden = phase !== 'victory' && phase !== 'defeat';
  resultBanner.textContent = phase === 'victory' ? t('runComplete') : phase === 'defeat' ? t('runFailed') : '';
  document.querySelector<HTMLElement>('#trial-label')!.hidden = !juggernautTrial;
  document.title = t('pageTitle');
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n as TranslationKey);
  });
  document.querySelector('#status')!.textContent = t(phase);
  document.querySelector('#panel-title')!.textContent = t(phase === 'victory' ? 'victoryTitle' : phase === 'defeat' ? 'defeatTitle' : phase === 'ready' ? 'welcomeTitle' : 'pauseTitle');
  document.querySelector('#panel-body')!.textContent = (phase === 'victory' || phase === 'defeat') ? resultBody() : t(phase === 'ready' ? touchControls.enabled ? 'touchWelcomeBody' : 'welcomeBody' : 'pauseBody');
  primary.textContent = t(phase === 'victory' || phase === 'defeat' ? 'playAgain' : phase === 'ready' ? 'start' : 'resume');
  pause.textContent = t(phase === 'paused' ? 'resume' : 'pause');
  pause.disabled = phase !== 'playing' && phase !== 'paused';
  document.querySelector<HTMLDivElement>('#menu-panel')!.hidden = phase === 'draft';
  const draftPanel = document.querySelector<HTMLDivElement>('#draft-panel')!;
  draftPanel.hidden = phase !== 'draft';
  if (phase === 'draft') renderDraft();
  overlay.hidden = phase === 'playing' || phase === 'victory' && arena.victoryRevealing;
  document.querySelector('#game')!.classList.toggle('playing', phase === 'playing');
  document.querySelector('canvas')?.setAttribute('aria-label', t(touchControls.enabled ? 'touchArenaLabel' : 'arenaLabel'));
  touchControls.translate();
  touchControls.setActive(phase === 'playing');
}

function resultBody(): string {
  return t(arena.run.result === 'victory' ? 'victoryBody' : arena.run.reason === 'deadline' ? 'deadlineBody' : 'defeatBody') +
    ' ' + t('resultStats').replace('{kills}', String(arena.combat.kills)).replace('{time}', String(Math.floor(arena.run.elapsed)));
}

function renderDraft(): void {
  const panel = document.querySelector('#draft-panel')!;
  panel.innerHTML = `<h2>${t(arena.run.draftKind === 'curse' ? 'curseDraft' : 'mutationDraft')}</h2><p>${t('draftHint')}${arena.run.draftKind === 'curse' && arena.combat.curse ? ' ' + t('curseSwapHint') : ''}</p><div class="draft-options">${arena.run.draft.map((option, index) =>
    `<button class="draft-card" data-choice="${index}"><small>${t(option.id === arena.combat.curse ? 'keepCurse' : option.role)}</small><strong>${t(option.id)}</strong><span>${t(`${option.id}Desc`)}</span></button>`).join('')}</div>`;
}
document.querySelector('#draft-panel')!.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-choice]');
  if (button && draftGuard.accepts(event as MouseEvent, button)) arena.chooseDraft(Number(button.dataset.choice));
});
renderUI();
touchControls.onModeChange = () => renderUI();
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
  arena.run.mutationPool = mutationPool(profile);
  arena.run.cursePool = cursePool(profile);
}

const hpValue = document.querySelector('#hp-value')!;
const hpBar = document.querySelector<HTMLProgressElement>('#hp')!;
const dashValue = document.querySelector('#dash-value')!;
const dashBar = document.querySelector<HTMLProgressElement>('#dash-recharge')!;
const combatNotice = document.querySelector('#combat-notice')!;
function renderCombatHUD(world: CombatWorld): void {
  if (touchControls.enabled) touchControls.updateResources(world.dashCharges, world.chargedShots, world.surge, world.heavyCharges, HEAVY.recharge - world.heavyRecharge);
  if (!juggernautTrial && progression.observe(world, arena.run.result)) {
    applySettings();
    renderSettings();
    persist();
  }
  const boss = world.enemies.find((enemy) => enemy.kind === 'boss');
  document.querySelector<HTMLDivElement>('#boss-hud')!.hidden = !boss;
  if (boss) document.querySelector<HTMLProgressElement>('#boss-health')!.value = boss.hp;
  const health = `${Math.ceil(world.hp)} / ${world.maxHp}`;
  if (hpValue.textContent !== health) hpValue.textContent = health;
  hpBar.max = world.maxHp;
  hpBar.value = world.hp;
  document.querySelector('#barrier-value')!.textContent = `${Number(world.barrier.value.toFixed(1))} / ${BARRIER.cap}`;
  document.querySelector<HTMLProgressElement>('#barrier')!.value = world.barrier.value;
  document.querySelector('#barrier-feedback')!.textContent = world.barrier.flash > 0
    ? world.barrier.broken ? t('barrierBroken') : world.barrier.lastGain > 0 ? `+${Number(world.barrier.lastGain.toFixed(1))}` : '' : '';
  document.querySelector('#aegis-progress')!.textContent = world.mutations.includes('aegisCore')
    ? `${t('aegisProgress')} ${Math.floor(world.barrier.aegisDamage)}/${BARRIER.aegisDamage}` : '';
  const dash = `${world.dashCharges} / ${COMBAT.dashCharges}` + (world.dashCharges < COMBAT.dashCharges
    ? ` · ${t('secondsShort').replace('{n}', (Math.max(0, world.rechargeDuration - world.dashRecharge)).toFixed(1))}` : '');
  if (dashValue.textContent !== dash) dashValue.textContent = dash;
  dashBar.max = world.rechargeDuration;
  dashBar.value = world.dashCharges === COMBAT.dashCharges ? world.rechargeDuration : world.dashRecharge;
  const seconds = Math.floor(arena.run.elapsed);
  document.querySelector('#run-clock')!.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} / 5:00`;
  document.querySelector('#charged-value')!.textContent = `${world.chargedShots} / 3 · ${world.chargePoints} / 3`;
  document.querySelector('#heavy-value')!.textContent = `${world.heavyCharges} / ${HEAVY.charges}` + (world.heavyCharges < HEAVY.charges ? ` · ${t('secondsShort').replace('{n}', String(Math.ceil(HEAVY.recharge - world.heavyRecharge)))}` : '');
  document.querySelector('#surge-value')!.textContent = `${Math.floor(world.surge)} / 100`;
  const milestone = arena.run.nextDraft;
  const formatTime = (value: number) => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
  const progress = (target: { kills: number; seconds: number }) => t('milestoneProgress')
    .replace('{kills}', String(world.kills)).replace('{target}', String(target.kills)).replace('{time}', formatTime(target.seconds));
  document.querySelector('#draft-progress')!.textContent = milestone ? progress(milestone) : t('draftsComplete');
  document.querySelector('#boss-arrival')!.textContent = arena.run.bossDue ? '' : `${t('bossArrival')} ${progress(ENCOUNTERS.boss)}`;
  document.querySelector('#build-value')!.textContent = [...world.mutations, ...(world.curse ? [world.curse] : [])].map((id) => t(id)).join(' · ');
  const notice = world.hp <= 0 ? t('playAgain') : world.perfectFlash > 0 ? t('perfectDodge') :
    world.attack?.heavy ? t('heavy') : world.combo > 0 ? t('comboValue').replace('{n}', String(world.combo)) : '';
  if (combatNotice.textContent !== notice) combatNotice.textContent = notice;
}

export const arena = new ArenaScene((phase) => {
  if (phase === 'playing' && (currentPhase === 'ready' || currentPhase === 'victory' || currentPhase === 'defeat')) {
    if (juggernautTrial) {
      arena.combat.mutations = ['guardBreaker', 'aegisCore'];
      arena.combat.curse = 'ironOath';
    } else progression.beginRun();
    applySettings();
  }
  if (phase === 'draft' || phase === 'victory' || phase === 'defeat') {
    if (!juggernautTrial) progression.observe(arena.combat, arena.run.result);
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

export const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#090d19',
  pixelArt: true,
  scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
  scene: [arena],
  input: { keyboard: true, mouse: true },
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
window.addEventListener('pagehide', () => { if (!juggernautTrial) progression.observe(arena.combat, arena.run.result); persist(); });
