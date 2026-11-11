import './designHarness.css';

declare const __HARNESS_REVISION__: string;

// Review-only copy; kept out of the production game's UI and bundle.
const vi = {
  title: 'Design Review Harness', scenario: 'Tình huống', combat: 'Combat', boss: 'Boss',
  baseline: 'BASELINE', candidate: 'CANDIDATE', revision: 'Revision', viewport: 'Viewport',
  restart: 'Tải lại hai preview',
  note: 'Hai preview cùng phiên bản, chạy độc lập, không đồng bộ thời gian hay input. Bấm Bắt đầu trong từng preview; click/chạm preview để điều khiển. Đổi focus có thể tự pause theo runtime. Không ghi progression thật.',
  seed: 'draftSeed = 808 chỉ cố định lựa chọn build; combat không phải replay tất định.',
};
const en: Record<keyof typeof vi, string> = {
  title: 'Design Review Harness', scenario: 'Scenario', combat: 'Combat', boss: 'Boss',
  baseline: 'BASELINE', candidate: 'CANDIDATE', revision: 'Revision', viewport: 'Viewport',
  restart: 'Reload both previews',
  note: 'Both previews use the same revision and run independently, without time or input synchronization. Press Start in each preview; click/tap a preview to control it. Changing focus may pause the runtime. Real progression is never saved.',
  seed: 'draftSeed = 808 fixes build choices only; combat is not a deterministic replay.',
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
    <button id="restart" type="button">${t('restart')}</button>
    <p>${t('note')}</p><p>${t('seed')}</p>
  </header>
  <div class="previews">
    ${(['baseline', 'candidate'] as const).map(side => `
      <section>
        <h2>${t(side)}</h2>
        <p class="metadata"><span class="scenario-name"></span> · ${t('revision')}: <code>${revision}</code> · ${t('viewport')}: <span class="viewport"></span></p>
        <iframe title="${t(side)}" src="about:blank"></iframe>
      </section>`).join('')}
  </div>`;
const scenario = document.querySelector<HTMLSelectElement>('#scenario')!;
scenario.value = new URLSearchParams(location.search).get('scenario') === 'boss' ? 'boss' : 'chain';
const frames = [...document.querySelectorAll<HTMLIFrameElement>('iframe')];
function reload(): void {
  // Only allow existing memory-only fixtures; never forward arbitrary query parameters.
  const fixture = scenario.value === 'boss' ? 'boss' : 'chain';
  const url = new URL('./', location.href);
  url.search = new URLSearchParams({ playtest: fixture, draftSeed: '808' }).toString();
  for (const frame of frames) frame.src = url.href;
  for (const label of document.querySelectorAll('.scenario-name')) {
    label.textContent = `${t('scenario')}: ${t(fixture === 'boss' ? 'boss' : 'combat')} (playtest=${fixture})`;
  }
  const page = new URL(location.href);
  page.searchParams.set('scenario', fixture);
  history.replaceState(null, '', page);
}
scenario.addEventListener('change', reload);
document.querySelector('#restart')!.addEventListener('click', reload);
const observer = new ResizeObserver(() => {
  frames.forEach(frame => {
    frame.parentElement!.querySelector('.viewport')!.textContent = `${frame.clientWidth} × ${frame.clientHeight}`;
  });
});
frames.forEach(frame => observer.observe(frame));
reload();
