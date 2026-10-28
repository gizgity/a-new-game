import type { CombatAction, CombatInput } from '../game/combat';
import { t } from '../i18n';
import type { ResourceReadouts } from './CombatHUD';

const controlIcon = (id: string) => `<svg class="control-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="${import.meta.env.BASE_URL}assets/ui/hud-icons.svg#${id}"></use></svg>`;

type Action = CombatAction;
interface Contact { element: HTMLElement; action: Action | 'move'; x: number; y: number; angle: number | null }

/** Maps pointer contacts to existing combat inputs; combat still owns timing/resources. */
export class TouchControls {
  private readonly surface: HTMLElement;
  private readonly media = matchMedia('(pointer: coarse)');
  private readonly contacts = new Map<number, Contact>();
  private readonly pressed = new Set<Action>();
  private releaseAim: NonNullable<CombatInput['specialAim']> = {};
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
        <span class="stick-base" aria-hidden="true"><span class="stick-knob">◇</span></span>
      </button>
      <div class="touch-actions">
        <div class="touch-pair touch-ranged" role="group" data-control-group="ranged">
          <button type="button" class="touch-button power-button" data-action="charged">${controlIcon('shoot-heavy')}<span data-resource="charged">0/3</span></button>
          <button type="button" class="touch-button aim-button shoot-button" data-action="shoot">${controlIcon('shoot')}</button>
        </div>
        <div class="touch-pair touch-melee" role="group" data-control-group="melee">
          <button type="button" class="touch-button power-button" data-action="heavy">${controlIcon('melee-heavy')}<span data-resource="heavy">2/2</span></button>
          <button type="button" class="touch-button aim-button melee-button" data-action="melee">${controlIcon('melee')}</button>
        </div>
        <button type="button" class="touch-button utility-button dash-button" data-action="dash">${controlIcon('dash')}<span data-resource="dash">2/2</span></button>
        <button type="button" class="touch-button utility-button power-button" data-action="ultimate">${controlIcon('surge')}<span data-resource="surge">0%</span></button>
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

  sample(): CombatInput & { aimAngle: number | null; manualAimAngle: number | null } {
    const held = (action: Action) => this.pressed.has(action) ||
      [...this.contacts.values()].some(contact => contact.action === action);
    return {
      dx: this.dx, dy: this.dy, aimAngle: this.aimAngle,
      manualAimAngle: [...this.contacts.values()].reverse().find(contact => contact.action !== 'move' && contact.angle !== null)?.angle ?? null,
      pressed: [...this.pressed], specialAim: this.releaseAim,
      melee: held('melee'), shoot: held('shoot'), heavy: this.pressed.has('heavy'),
      charged: this.pressed.has('charged'), ultimate: held('ultimate'), dash: this.pressed.has('dash'),
    };
  }

  get charging(): boolean { return [...this.contacts.values()].some(contact => contact.action === 'charged'); }

  // Retain taps until a simulation tick; CombatWorld owns the bounded recovery buffer.
  consume(): void { this.pressed.clear(); this.releaseAim = {}; }

  reset(): void {
    this.onCancel();
    const contacts = [...this.contacts.entries()];
    this.contacts.clear();
    this.pressed.clear();
    this.releaseAim = {};
    this.dx = this.dy = 0;
    this.aimAngle = null;
    for (const [id, contact] of contacts) {
      contact.element.classList.remove('pressed');
      contact.element.style.removeProperty('--stick-x');
      contact.element.style.removeProperty('--stick-y');
      contact.element.style.removeProperty('--origin-x');
      contact.element.style.removeProperty('--origin-y');
      if (contact.element.hasPointerCapture(id)) contact.element.releasePointerCapture(id);
    }
  }

  updateResources(resources: ResourceReadouts): void {
    for (const key of ['heavy', 'dash', 'charged', 'surge'] as const) {
      const data = resources[key];
      const label = this.root.querySelector<HTMLElement>(`[data-resource="${key}"]`)!;
      if (label.textContent !== data.value) label.textContent = data.value;
      const button = label.parentElement!;
      let note = button.querySelector<HTMLElement>('.resource-note');
      if (!note) { note = document.createElement('small'); note.className = 'resource-note'; label.insertAdjacentElement('afterend', note); }
      if (note.textContent !== data.touchNote) note.textContent = data.touchNote;
      note.hidden = !data.touchNote;
      button.setAttribute('aria-description', `${data.value} · ${data.note}`);
      button.classList.toggle('unavailable', !data.available);
      button.classList.toggle('proc-active', data.proc);
      button.dataset.state = data.available ? 'ready' : 'empty';
      button.setAttribute('aria-disabled', String(!data.available));
    }
  }

  translate(): void {
    this.root.querySelector('[data-control-group=melee]')!.setAttribute('aria-label', t('touchMeleeGroup'));
    this.root.querySelector('[data-control-group=ranged]')!.setAttribute('aria-label', t('touchRangedGroup'));
    this.root.querySelector('[data-action=dash]')!.setAttribute('aria-label', t('dash'));
    this.root.querySelector('[data-action=ultimate]')!.setAttribute('aria-label', t('surge'));
    for (const [action, label] of [['melee', 'melee'], ['shoot', 'shoot'], ['heavy', 'touchHeavy'], ['charged', 'touchCharged'], ['dash', 'dash'], ['ultimate', 'surge']] as const) {
      this.root.querySelector<HTMLButtonElement>(`[data-action=${action}]`)!.title = t(label);
    }
    this.root.querySelector('#move-stick')!.setAttribute('aria-label', t('touchMove'));
    this.root.querySelector('[data-action="melee"]')!.setAttribute('aria-label', t('touchMelee'));
    this.root.querySelector('[data-action="shoot"]')!.setAttribute('aria-label', t('touchShoot'));
    this.root.querySelector('[data-action="charged"]')!.setAttribute('aria-label', t('touchChargedAim'));
    this.root.querySelector('[data-action="heavy"]')!.setAttribute('aria-label', t('touchHeavyAim'));
  }

  private bind(element: HTMLElement, action: Contact['action']): void {
    element.addEventListener('pointerdown', event => {
      if (!this.active || !this.enabled || [...this.contacts.values()].some(contact => contact.element === element)) return;
      event.preventDefault();
      this.contacts.set(event.pointerId, { element, action, x: event.clientX, y: event.clientY, angle: null });
      element.setPointerCapture(event.pointerId);
      element.classList.add('pressed');
      if (action === 'move') {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--origin-x', `${event.clientX - rect.x}px`);
        element.style.setProperty('--origin-y', `${event.clientY - rect.y}px`);
        this.move(event);
      }
      else if (action !== 'charged' && action !== 'heavy') this.pressed.add(action);
    });
    element.addEventListener('pointermove', event => {
      if (!this.contacts.has(event.pointerId)) return;
      event.preventDefault();
      this.move(event);
    });
    const release = (event: PointerEvent) => {
      const contact = this.contacts.get(event.pointerId);
      if (!contact) return;
      if (event.type !== 'pointerup') { this.reset(); return; }
      if (event.type === 'pointerup' && (contact.action === 'charged' || contact.action === 'heavy')) {
        this.move(event);
        this.pressed.add(contact.action);
        if (contact.angle !== null) this.releaseAim[contact.action] = contact.angle;
      }
      this.contacts.delete(event.pointerId);
      contact.element.classList.remove('pressed');
      contact.element.style.removeProperty('--stick-x');
      contact.element.style.removeProperty('--stick-y');
      contact.element.style.removeProperty('--origin-x');
      contact.element.style.removeProperty('--origin-y');
      if (contact.action === 'move') this.dx = this.dy = 0;
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    element.addEventListener('pointerup', release);
    element.addEventListener('pointercancel', release);
    element.addEventListener('lostpointercapture', release);
  }

  private move(event: PointerEvent): void {
    const contact = this.contacts.get(event.pointerId)!;
    const rect = contact.element.getBoundingClientRect();
    const dx = event.clientX - contact.x;
    const dy = event.clientY - contact.y;
    const distance = Math.hypot(dx, dy);
    const radius = contact.action === 'move' ? Math.min(42, Math.min(rect.width, rect.height) / 2 - 28) : 38;
    const scale = distance > radius ? radius / distance : 1;
    contact.element.style.setProperty('--stick-x', `${dx * scale}px`);
    contact.element.style.setProperty('--stick-y', `${dy * scale}px`);
    if (contact.action === 'move') {
      this.dx = distance > 8 ? dx / distance : 0;
      this.dy = distance > 8 ? dy / distance : 0;
      const aiming = [...this.contacts.values()].some(item => item.action !== 'move' && item.angle !== null);
      if (distance > 8 && !aiming) this.aimAngle = Math.atan2(dy, dx);
    } else if (distance > 8) {
      contact.angle = this.aimAngle = Math.atan2(dy, dx);
    }
  }
}
