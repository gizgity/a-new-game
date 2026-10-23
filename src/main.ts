import Phaser from 'phaser';
import { ArenaScene, type Phase } from './game/ArenaScene';
import { setLocale, t, type Locale, type TranslationKey } from './i18n';
import './style.css';

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
    <div class="arena-top"><div><span class="eyebrow" data-i18n="stage"></span><p data-i18n="arena"></p></div>
      <span class="status"><i></i><span id="status"></span></span>
    </div>
    <div id="overlay" class="overlay">
      <section class="panel" aria-labelledby="panel-title">
        <span class="panel-sigil" aria-hidden="true">◇</span>
        <p class="eyebrow" data-i18n="subtitle"></p>
        <h2 id="panel-title"></h2><p id="panel-body" class="panel-body"></p>
        <div class="mini-controls"><span><kbd data-i18n="moveKey"></kbd><span data-i18n="move"></span></span>
          <span><kbd data-i18n="mouse"></kbd><span data-i18n="aim"></span></span></div>
        <button id="primary" class="primary" disabled></button>
        <p class="scope" data-i18n="scope"></p>
      </section>
    </div>
    <div class="arena-bottom"><span data-i18n="signature"></span><span data-i18n="scope"></span></div>
  </section>
  <footer><div class="control-bar"><span class="eyebrow" data-i18n="controls"></span>
    <span><kbd data-i18n="moveKey"></kbd> <span data-i18n="move"></span></span>
    <span><kbd data-i18n="mouse"></kbd> <span data-i18n="aim"></span></span>
    <span><kbd data-i18n="pauseKey"></kbd> <span data-i18n="pauseHint"></span></span>
  </div><span class="desktop-note" data-i18n="desktop"></span></footer>
`;

const primary = document.querySelector<HTMLButtonElement>('#primary')!;
const pause = document.querySelector<HTMLButtonElement>('#pause')!;
const overlay = document.querySelector<HTMLDivElement>('#overlay')!;
let currentPhase: Phase = 'ready';

function renderUI(phase: Phase = currentPhase): void {
  currentPhase = phase;
  document.title = t('pageTitle');
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n as TranslationKey);
  });
  document.querySelector('#status')!.textContent = t(phase);
  document.querySelector('#panel-title')!.textContent = t(phase === 'ready' ? 'welcomeTitle' : 'pauseTitle');
  document.querySelector('#panel-body')!.textContent = t(phase === 'ready' ? 'welcomeBody' : 'pauseBody');
  primary.textContent = t(phase === 'ready' ? 'start' : 'resume');
  pause.textContent = t(phase === 'paused' ? 'resume' : 'pause');
  pause.disabled = phase === 'ready';
  overlay.hidden = phase === 'playing';
  document.querySelector('#game')!.classList.toggle('playing', phase === 'playing');
  document.querySelector('canvas')?.setAttribute('aria-label', t('arenaLabel'));
}

renderUI();

export const arena = new ArenaScene(renderUI, () => {
  primary.disabled = false;
  document.querySelector('canvas')?.setAttribute('aria-label', t('arenaLabel'));
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

primary.addEventListener('click', () => {
  arena.setPhase('playing');
  primary.blur();
});
pause.addEventListener('click', () => {
  arena.setPhase(currentPhase === 'playing' ? 'paused' : 'playing');
  pause.blur();
});
document.querySelector<HTMLSelectElement>('#locale')!.addEventListener('change', (event) => {
  setLocale((event.target as HTMLSelectElement).value as Locale);
  renderUI();
  (event.target as HTMLSelectElement).blur();
});
