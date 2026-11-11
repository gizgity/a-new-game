import './designHarness.css';

declare const __HARNESS_REVISION__: string;

// Review-only copy; kept out of the production game's UI and bundle.
const vi = {
  title: 'Design Review Harness', scenario: 'Tình huống', combat: 'Combat', boss: 'Boss',
  baseline: 'BASELINE', candidate: 'CANDIDATE', revision: 'Revision', viewport: 'Viewport',
  restart: 'Restart', start: 'Bắt đầu hai preview', pause: 'Pause', step: 'Step', autoplay: 'Tự chiến đấu', manual: 'Điều khiển thủ công',
  note: 'Bấm Bắt đầu để hai preview tự chiến đấu. Playback độc lập; không bảo đảm đồng bộ frame tuyệt đối. Step = 1 tick (1/60s). Tắt âm khi review. Không ghi progression thật.',
  seed: 'Cùng seed 808 và script autoplay. Combat: run mới, không cấp build. Boss: preset V2-01 (3:40, 1150 kills, 4 Mutation/2 Curse). Không cấp thêm HP/tài nguyên/buff trong run.',
};
const en: Record<keyof typeof vi, string> = {
  title: 'Design Review Harness', scenario: 'Scenario', combat: 'Combat', boss: 'Boss',
  baseline: 'BASELINE', candidate: 'CANDIDATE', revision: 'Revision', viewport: 'Viewport',
  restart: 'Restart', start: 'Start both previews', pause: 'Pause', step: 'Step', autoplay: 'Autoplay', manual: 'Manual',
  note: 'Press Start for both previews to fight automatically. Independent playback; exact frame synchronization is not guaranteed. Step = 1 tick (1/60s). Review audio is muted. Real progression is never saved.',
  seed: 'Same seed 808 and autoplay script. Combat: fresh run, no build grants. Boss: V2-01 preset (3:40, 1150 kills, 4 Mutations/2 Curses). No extra HP/resources/buffs during a run.',
};
const locale = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'vi';
const t = (key: keyof typeof vi): string => ({ vi, en })[locale][key];
document.documentElement.lang = locale;
document.title = t('title');
const revision = __HARNESS_REVISION__;
document.querySelector<HTMLElement>('#harness')!.innerHTML = `
  <header>
    <h1>${t('title')}</h1>
    <label>${t('scenario')} <select id="scenario">
      <option value="chain">${t('combat')}</option><option value="boss">${t('boss')}</option>
    </select></label>
    <button id="start" type="button">${t('start')}</button>
    <button id="restart" type="button">${t('restart')}</button>
    <p>${t('note')}</p><p>${t('seed')}</p>
  </header>
  <div class="previews">
    ${(['baseline', 'candidate'] as const).map(side => `
      <section>
        <h2>${t(side)}</h2>
        <p class="metadata"><span class="scenario-name"></span> · ${t('revision')}: <code>${revision}</code> · ${t('viewport')}: <span class="viewport"></span></p>
        <div class="playback" aria-label="${t(side)} playback">
          ${[0.25, 0.5, 1].map(speed => `<button data-speed="${speed}" aria-pressed="${speed === 1}">${speed}×</button>`).join('')}
          <button data-command="pause" aria-pressed="false">${t('pause')}</button>
          <button data-command="step">${t('step')}</button>
          <select class="mode" aria-label="${t('autoplay')}"><option value="auto">${t('autoplay')}</option><option value="manual">${t('manual')}</option></select>
        </div>
        <iframe title="${t(side)}" src="about:blank"></iframe>
      </section>`).join('')}
  </div>`;
const scenario = document.querySelector<HTMLSelectElement>('#scenario')!;
scenario.value = new URLSearchParams(location.search).get('scenario') === 'boss' ? 'boss' : 'chain';
const frames = [...document.querySelectorAll<HTMLIFrameElement>('iframe')];
function reload(): void {
  // Only allow existing memory-only fixtures; never forward arbitrary query parameters.
  const fixture = scenario.value === 'boss' ? 'boss' : 'chain';
  const url = new URL('./harness-preview.html', location.href);
  url.search = new URLSearchParams({ playtest: fixture === 'boss' ? 'boss' : 'harness', draftSeed: '808' }).toString();
  for (const frame of frames) {
    frame.parentElement!.querySelectorAll<HTMLButtonElement | HTMLSelectElement>('.playback button, .playback select').forEach(control => control.disabled = true);
    document.querySelector<HTMLButtonElement>('#start')!.disabled = true;
    frame.src = url.href;
    const section = frame.parentElement!;
    section.querySelector<HTMLSelectElement>('.mode')!.value = 'auto';
    section.querySelectorAll<HTMLButtonElement>('[aria-pressed]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.speed === '1')));
  }
  for (const label of document.querySelectorAll('.scenario-name')) {
    label.textContent = `${t('scenario')}: ${t(fixture === 'boss' ? 'boss' : 'combat')} (playtest=${fixture === 'boss' ? 'boss' : 'harness'})`;
  }
  const page = new URL(location.href);
  page.searchParams.set('scenario', fixture);
  history.replaceState(null, '', page);
}
type Playback = typeof import('./harnessPreview').playback;
function controls(frame: HTMLIFrameElement): Playback | undefined {
  return (frame.contentWindow as (Window & { harnessPlayback?: Playback }) | null)?.harnessPlayback;
}
for (const frame of frames) {
  const section = frame.parentElement!;
  frame.addEventListener('load', () => {
    const loadedWindow = frame.contentWindow;
    const waitReady = () => {
      if (frame.contentWindow !== loadedWindow) return;
      if (!controls(frame)) { setTimeout(waitReady, 50); return; }
      section.querySelectorAll<HTMLButtonElement | HTMLSelectElement>('.playback button, .playback select').forEach(control => control.disabled = false);
      document.querySelector<HTMLButtonElement>('#start')!.disabled = !frames.every(f => !!controls(f));
    };
    waitReady();
  });
  section.querySelector('.playback')!.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
    const api = controls(frame);
    if (!button || !api) return;
    if (button.dataset.speed) api.setSpeed(Number(button.dataset.speed));
    else if (button.dataset.command === 'step') api.step();
    else api.pause();
    const state = api.state();
    section.querySelectorAll<HTMLButtonElement>('[aria-pressed]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.speed ? !state.paused && Number(b.dataset.speed) === state.speed : state.paused)));
  });
  section.querySelector('.mode')!.addEventListener('change', event => {
    controls(frame)?.setAutoplay((event.target as HTMLSelectElement).value === 'auto');
  });
}
document.querySelector('#start')!.addEventListener('click', () => {
  for (const frame of frames) {
    const primary = frame.contentDocument?.querySelector<HTMLButtonElement>('#primary');
    if (controls(frame) && primary && !primary.disabled) primary.click();
  }
});
scenario.addEventListener('change', reload);
document.querySelector('#restart')!.addEventListener('click', reload);
const observer = new ResizeObserver(() => {
  frames.forEach(frame => {
    frame.parentElement!.querySelector('.viewport')!.textContent = `${frame.clientWidth} × ${frame.clientHeight}`;
  });
});
frames.forEach(frame => observer.observe(frame));
reload();
