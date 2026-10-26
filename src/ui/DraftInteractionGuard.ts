/** One second to read before a fresh selection; scrolling is never locked. */
export class DraftInteractionGuard {
  private active = false;
  private pressed: Element | null = null;
  private unlockAt = Infinity;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private readonly heldKeys = new Set<string>();
  private readonly blockedKeys = new Set<string>();
  onReadyChange = () => {};
  get ready(): boolean { return this.active && performance.now() >= this.unlockAt; }
  constructor(private surface: HTMLElement) {
    for (const type of ['contextmenu', 'selectstart', 'dragstart', 'dblclick', 'auxclick', 'gesturestart', 'gesturechange', 'gestureend']) {
      surface.addEventListener(type, event => { if (this.active && event.cancelable) event.preventDefault(); }, { passive: false });
    }
    surface.addEventListener('mousedown', event => { if (this.active && event.button !== 0) event.preventDefault(); });
    surface.addEventListener('pointerdown', event => {
      this.pressed = this.ready && event.button === 0 ? (event.target as Element).closest('[data-choice]') : null;
    }, true);
    window.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      this.heldKeys.add(event.key);
      if (this.active && (!this.ready || event.repeat)) this.blockedKeys.add(event.key);
    }, true);
    window.addEventListener('keyup', event => {
      this.heldKeys.delete(event.key);
      // Space's default click follows keyup; reject it if the press began locked.
      setTimeout(() => this.blockedKeys.delete(event.key), 0);
    }, true);
    surface.addEventListener('pointercancel', () => { this.pressed = null; });
    window.addEventListener('blur', () => { this.pressed = null; this.heldKeys.clear(); this.blockedKeys.clear(); });
  }
  setActive(active: boolean): void {
    if (active === this.active) return; // Locale/render updates must not restart the lock.
    this.active = active;
    this.pressed = null;
    clearTimeout(this.timer);
    this.blockedKeys.clear();
    this.unlockAt = active ? performance.now() + 1000 : Infinity;
    if (active) {
      for (const key of this.heldKeys) this.blockedKeys.add(key);
      const unlock = () => {
        const remaining = this.unlockAt - performance.now();
        if (remaining > 0) this.timer = setTimeout(unlock, remaining);
        else this.onReadyChange();
      };
      this.timer = setTimeout(unlock, 1000);
    }
    this.surface.classList.toggle('draft-active', active);
  }
  accepts(event: MouseEvent, button: Element): boolean {
    const valid = this.ready && event.button === 0 && (event.detail === 0 ? !this.blockedKeys.size : this.pressed === button);
    this.pressed = null;
    return valid;
  }
}
