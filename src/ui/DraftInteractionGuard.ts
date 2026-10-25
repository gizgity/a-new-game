/** Keep scrolling/keyboard access, suppress native mouse actions and held-click carryover. */
export class DraftInteractionGuard {
  private active = false;
  private pressed: Element | null = null;
  constructor(private surface: HTMLElement) {
    for (const type of ['contextmenu', 'selectstart', 'dragstart', 'dblclick', 'auxclick', 'gesturestart', 'gesturechange', 'gestureend']) {
      surface.addEventListener(type, event => { if (this.active && event.cancelable) event.preventDefault(); }, { passive: false });
    }
    surface.addEventListener('mousedown', event => { if (this.active && event.button !== 0) event.preventDefault(); });
    surface.addEventListener('pointerdown', event => {
      this.pressed = this.active && event.button === 0 ? (event.target as Element).closest('[data-choice]') : null;
    }, true);
    surface.addEventListener('pointercancel', () => { this.pressed = null; });
    window.addEventListener('blur', () => { this.pressed = null; });
  }
  setActive(active: boolean): void {
    this.active = active;
    this.pressed = null;
    this.surface.classList.toggle('draft-active', active);
  }
  accepts(event: MouseEvent, button: Element): boolean {
    const valid = this.active && event.button === 0 && (event.detail === 0 || this.pressed === button);
    this.pressed = null;
    return valid;
  }
}
