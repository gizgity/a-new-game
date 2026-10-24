import type { CombatAction, CombatInput } from '../game/combat';
import { t } from '../i18n';

type Action = CombatAction;
interface Contact { element: HTMLElement; action: Action | 'move'; x: number; y: number; aiming: boolean }

/** Maps pointer contacts to existing combat inputs. No combat timing or targeting rules. */
export class TouchControls {
  private readonly surface: HTMLElement;
  private readonly media = matchMedia('(pointer: coarse)');
  private readonly contacts = new Map<number, Contact>();
  private readonly pressed = new Set<Action>();
  private active = false;
  private dx = 0;
  private dy = 0;
  private aimAngle: number | null = null;
  onModeChange = () => {};
  onCancel = () => {};

  get enabled(): boolean { return this.media.matches; }

  constructor(private readonly root: HTMLElement) {
    this.surface = root.closest<HTMLElement>('.arena-shell')!;
    root.innerHTML = `
      <button id="move-stick" class="touch-stick" type="button" aria-label="${t('touchMove')}">
        <span class="stick-knob" aria-hidden="true">◇</span><span class="stick-label" data-i18n="move"></span>
      </button>
      <div class="touch-actions">
        <div class="touch-utility">
          <button type="button" class="touch-button" data-action="heavy"><span aria-hidden="true">╱</span><span data-i18n="heavy"></span></button>
          <button type="button" class="touch-button" data-action="charged"><span data-resource="charged">0</span><span data-i18n="touchCharged"></span></button>
          <button type="button" class="touch-button" data-action="ultimate"><span data-resource="surge">0%</span><span data-i18n="surge"></span></button>
        </div>
        <div class="touch-primary">
          <button type="button" class="touch-button dash-button" data-action="dash"><span data-resource="dash">2</span><span data-i18n="dash"></span></button>
          <button type="button" class="touch-button aim-button melee-button" data-action="melee"><span aria-hidden="true">╱</span><span data-i18n="melee"></span></button>
          <button type="button" class="touch-button aim-button shoot-button" data-action="shoot"><span aria-hidden="true">⊕</span><span data-i18n="shoot"></span></button>
        </div>
      </div>`;
    this.bind(root.querySelector<HTMLElement>('#move-stick')!, 'move');
    root.querySelectorAll<HTMLElement>('[data-action]').forEach(element => {
      element.insertAdjacentHTML('beforeend', '<span class="aim-stick" aria-hidden="true"><span class="aim-knob"></span></span>');
      this.bind(element, element.dataset.action as Action);
    });
    document.documentElement.classList.toggle('touch-enabled', this.enabled);
    this.media.addEventListener('change', () => {
      this.reset();
      document.documentElement.classList.toggle('touch-enabled', this.enabled);
      root.hidden = !this.enabled || !this.active;
      this.onModeChange();
    });
    window.addEventListener('blur', () => this.reset());
    window.addEventListener('resize', () => this.reset());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.reset(); });
    // Scope native-gesture suppression to active gameplay, including HUD/gaps.
    // Pointer Events still drive each control; these also cover Safari's touch/gesture defaults.
    const preventGameGesture = (event: Event) => {
      if (this.enabled && this.active && event.cancelable) event.preventDefault();
    };
    for (const type of ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'gestureend', 'selectstart', 'contextmenu', 'dragstart', 'dblclick']) {
      this.surface.addEventListener(type, preventGameGesture, { passive: false });
    }
  }

  setActive(active: boolean): void {
    if (active !== this.active) this.reset();
    this.active = active;
    this.root.hidden = !this.enabled || !active;
    this.surface.classList.toggle('touch-playing', this.enabled && active);
  }

  sample(): CombatInput & { aimAngle: number | null } {
    const held = (action: Action) => this.pressed.has(action) ||
      [...this.contacts.values()].some(contact => contact.action === action);
    return {
      dx: this.dx, dy: this.dy, aimAngle: this.aimAngle, pressed: [...this.pressed],
      melee: held('melee'), shoot: held('shoot'), heavy: held('heavy'),
      charged: held('charged'), ultimate: held('ultimate'), dash: this.pressed.has('dash'),
    };
  }

  // Retain taps until a simulation tick; CombatWorld owns the bounded recovery buffer.
  consume(): void { this.pressed.clear(); }

  reset(): void {
    this.onCancel();
    const contacts = [...this.contacts.entries()];
    this.contacts.clear();
    this.pressed.clear();
    this.dx = this.dy = 0;
    this.aimAngle = null;
    for (const [id, contact] of contacts) {
      contact.element.classList.remove('pressed');
      contact.element.style.removeProperty('--stick-x');
      contact.element.style.removeProperty('--stick-y');
      if (contact.element.hasPointerCapture(id)) contact.element.releasePointerCapture(id);
    }
  }

  updateResources(dashes: number, charged: number, surge: number): void {
    for (const [key, value, available] of [
      ['dash', String(dashes), dashes > 0], ['charged', String(charged), charged > 0],
      ['surge', `${Math.floor(surge)}%`, surge >= 100],
    ] as const) {
      const label = this.root.querySelector<HTMLElement>(`[data-resource="${key}"]`)!;
      if (label.textContent !== value) label.textContent = value;
      label.parentElement!.classList.toggle('unavailable', !available);
      // Keep pointer capture/release working while the resource is consumed.
      label.parentElement!.setAttribute('aria-disabled', String(!available));
    }
  }

  translate(): void {
    this.root.querySelector('#move-stick')!.setAttribute('aria-label', t('touchMove'));
    this.root.querySelector('[data-action="melee"]')!.setAttribute('aria-label', t('touchMelee'));
    this.root.querySelector('[data-action="shoot"]')!.setAttribute('aria-label', t('touchShoot'));
  }

  private bind(element: HTMLElement, action: Contact['action']): void {
    element.addEventListener('pointerdown', event => {
      if (!this.active || !this.enabled || [...this.contacts.values()].some(contact => contact.element === element)) return;
      event.preventDefault();
      this.contacts.set(event.pointerId, { element, action, x: event.clientX, y: event.clientY, aiming: false });
      element.setPointerCapture(event.pointerId);
      element.classList.add('pressed');
      if (action === 'move') this.move(event);
      else this.pressed.add(action);
    });
    element.addEventListener('pointermove', event => {
      if (!this.contacts.has(event.pointerId)) return;
      event.preventDefault();
      this.move(event);
    });
    const release = (event: PointerEvent) => {
      const contact = this.contacts.get(event.pointerId);
      if (!contact) return;
      this.contacts.delete(event.pointerId);
      contact.element.classList.remove('pressed');
      contact.element.style.removeProperty('--stick-x');
      contact.element.style.removeProperty('--stick-y');
      if (contact.action === 'move') this.dx = this.dy = 0;
      if (event.type !== 'pointerup') {
        if (contact.action !== 'move') this.pressed.delete(contact.action);
        this.onCancel();
      }
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    element.addEventListener('pointerup', release);
    element.addEventListener('pointercancel', release);
    element.addEventListener('lostpointercapture', release);
  }

  private move(event: PointerEvent): void {
    const contact = this.contacts.get(event.pointerId)!;
    const rect = contact.element.getBoundingClientRect();
    const dx = event.clientX - (contact.action === 'move' ? rect.x + rect.width / 2 : contact.x);
    const dy = event.clientY - (contact.action === 'move' ? rect.y + rect.height / 2 : contact.y);
    const distance = Math.hypot(dx, dy);
    const radius = contact.action === 'move' ? Math.min(42, Math.min(rect.width, rect.height) / 2 - 28) : 38;
    const scale = distance > radius ? radius / distance : 1;
    contact.element.style.setProperty('--stick-x', `${dx * scale}px`);
    contact.element.style.setProperty('--stick-y', `${dy * scale}px`);
    if (contact.action === 'move') {
      this.dx = distance > 8 ? dx / distance : 0;
      this.dy = distance > 8 ? dy / distance : 0;
      const aiming = [...this.contacts.values()].some(item => item.action !== 'move' && item.aiming);
      if (distance > 8 && !aiming) this.aimAngle = Math.atan2(dy, dx);
    } else if (distance > 8) {
      contact.aiming = true;
      this.aimAngle = Math.atan2(dy, dx);
    }
  }
}
