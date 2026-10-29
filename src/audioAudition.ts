import { ELEMENTAL_TONES, elementalFamily, type ElementalCue } from './game/config/elementalAudio';
import { SIGILS, BRANCHES, type LegacyOffer } from './game/config/legacy';
import Phaser from 'phaser';
import { ProceduralAudio, type AudioCue } from './game/audio';
import { CombatWorld } from './game/combat';
import { t, setLocale } from './i18n';

// Separate entry point: deliberately no main/profile/progression module or storage access.
const root = document.querySelector<HTMLElement>('#audition')!;
root.innerHTML = `<h1>${t('audioTitle')}</h1><p>${t('audioHint')}</p><nav></nav><div id="meter"></div><div id="stage"></div>`;
const style = document.createElement('style');
style.textContent = 'body{background:#090d19;color:#edf7f5;font:16px system-ui;margin:16px}main{max-width:800px;margin:auto}nav{display:flex;gap:10px;flex-wrap:wrap}select,button,a{min-height:44px;padding:10px;background:#202d3a;color:inherit;border:1px solid #7a8791;border-radius:6px}canvas{max-width:100%}p{line-height:1.5}#meter{margin:16px 0}';
document.head.append(style);
class Audition extends Phaser.Scene {
  audio!: ProceduralAudio;
  world = new CombatWorld({ x: 800, y: 500, angle: 0 });
  loadout: LegacyOffer = { sigil: 'fire', branch: 'wildfire' };
  track = 0; clock = 0; index = 0; paused = false;
  graphics!: Phaser.GameObjects.Graphics;
  create(): void {
    this.audio = new ProceduralAudio(this); this.graphics = this.add.graphics();
    const actions = ['audioActions', 'audioProcs', 'audioCrowd', 'audioWarning', 'audioPause', 'audioMute', 'audioStop', 'audioCharge'] as const;
    for (const [i, key] of actions.entries()) {
      const button = document.createElement('button'); button.textContent = t(key);
      if (i === 7) {
        button.onpointerdown = () => { this.unlock(); this.audio.charge(true); };
        for (const event of ['pointerup', 'pointercancel', 'pointerleave']) button.addEventListener(event, () => this.audio.charge(false));
      } else button.onclick = () => {
        this.unlock();
        if (i < 4) this.startTrack(i + 1);
        else if (i === 4) { this.paused = !this.paused; this.audio.transition(); }
        else if (i === 5) { this.sound.mute = !this.sound.mute; this.audio.transition(); }
        else { this.track = 0; this.audio.transition(); }
      };
      root.querySelector('nav')!.append(button);
    }
    for (const [i, sigil] of SIGILS.entries()) {
      const button = document.createElement('button'); button.textContent = t(`legacy_${sigil}`); button.dataset.sigil = sigil;
      button.onclick = () => { this.unlock(); this.startTrack(10 + i); }; root.querySelector('nav')!.append(button);
    }
    for (const cue of Object.keys(ELEMENTAL_TONES) as ElementalCue[]) {
      const button = document.createElement('button'); button.textContent = t(`audio_${cue}`); button.dataset.cue = cue;
      button.onclick = () => { this.unlock(); this.track = 0; this.audio.transition(); this.audio.beginFrame(); this.audio.elemental([{ cue }]); }; root.querySelector('nav')!.append(button);
    }
    const select = document.createElement('select'); select.setAttribute('aria-label', t('audioLoadout'));
    const offers: LegacyOffer[] = [...SIGILS.map(sigil => ({ sigil, branch: null })), ...Object.entries(BRANCHES).map(([branch, sigil]) => ({ sigil, branch: branch as LegacyOffer['branch'] }))];
    offers.forEach((offer, index) => { const option = document.createElement('option'); option.value = String(index); option.textContent = `${t(`legacy_${offer.sigil}`)} / ${offer.branch ? t(`legacy_${offer.branch}`) : t('audioCore')}`; select.append(option); });
    select.value = '6'; select.onchange = () => { this.loadout = offers[Number(select.value)]; this.unlock(); this.startTrack(3); }; root.querySelector('nav')!.append(select);
    const language = document.createElement('button'); language.textContent = 'VI / EN'; language.onclick = () => { setLocale(document.documentElement.lang === 'vi' ? 'en' : 'vi'); actions.forEach((key, i) => root.querySelectorAll('button')[i].textContent = t(key)); root.querySelectorAll<HTMLButtonElement>('[data-cue]').forEach(b => b.textContent = t(`audio_${b.dataset.cue as ElementalCue}`)); root.querySelector('h1')!.textContent = t('audioTitle'); root.querySelector('p')!.textContent = t('audioHint'); }; root.querySelector('nav')!.append(language);
    const link = document.createElement('a'); link.href = './'; link.textContent = t('audioBack'); root.querySelector('nav')!.append(link);
    const hide = () => { this.paused = true; this.audio.transition(); };
    this.game.events.on(Phaser.Core.Events.BLUR, hide); this.game.events.on(Phaser.Core.Events.HIDDEN, hide);
    this.events.once('shutdown', () => { this.audio.destroy(); this.game.events.off(Phaser.Core.Events.BLUR, hide); this.game.events.off(Phaser.Core.Events.HIDDEN, hide); });
  }
  unlock(): void { if (this.sound instanceof Phaser.Sound.WebAudioSoundManager) void this.sound.context.resume().catch(() => {}); }
  startTrack(track: number): void {
    this.audio.transition(); this.audio.beginFrame(); this.track = track; this.clock = this.index = 0; this.paused = false;
    this.world.reset(); this.world.enemies = [];
    if (track >= 3 && track < 10) this.world.legacy.equip(this.loadout);
    if (track >= 3) for (let i = 0; i < 24; i++) {
      this.world.spawnEnemy(i % 5 === 0 ? 'archer' : 'grunt', 1000, i * 0.26);
      Object.assign(this.world.enemies.at(-1)!, { x: 800 + Math.cos(i * 0.26) * (80 + i * 3), y: 500 + Math.sin(i * 0.26) * (80 + i * 3), rupture: 3, hp: 5000, maxHp: 5000 });
    }
  }
  update(_time: number, delta: number): void {
    if (!this.audio) return;
    this.audio.beginFrame();
    if (!this.paused && this.track) {
      this.clock += Math.min(delta / 1000, 0.05);
      if (this.track >= 10) {
        const cues = (Object.keys(ELEMENTAL_TONES) as ElementalCue[]).filter(c => elementalFamily(c) === SIGILS[this.track - 10]);
        if (this.clock >= this.index * .6 && this.index < cues.length) this.audio.elemental([{ cue: cues[this.index++] }]);
      } else if (this.track < 3) {
        const cues: AudioCue[] = this.track === 1 ? ['swing', 'light', 'swing2', 'light2', 'swing3', 'light3', 'heavySwing', 'heavy', 'gun', 'shotHit', 'charge', 'chargedGun', 'chargedHit', 'chargedBlast'] : ['dash', 'perfect', 'stack1', 'stack2', 'stack3', 'detonate', 'chain', 'chain', 'hurt'];
        if (this.clock >= this.index * 0.55 && this.index < cues.length) this.audio.play([cues[this.index++]]);
      } else {
        if (this.track === 4) this.audio.arrival(Math.max(0, 2 - this.clock));
        this.world.invulnerable = 100;
        this.world.player.angle = this.clock * 0.7;
        const tick = this.index++;
        this.world.chargedShots = 2; // Audition-only resources; this entry never imports progression.
        if (tick % 150 === 0) this.world.projectiles.push({ x: this.world.player.x + 920 / 60, y: this.world.player.y, vx: 0, vy: 0, hostile: true, life: 1 });
        this.world.step({ dx: Math.cos(this.clock), dy: Math.sin(this.clock), melee: tick % 120 < 60, shoot: true, heavy: tick % 120 === 70, charged: tick % 120 === 100, dash: tick % 150 === 0 }, 1 / 60);
        this.audio.play(this.world.audioEvents); this.audio.elemental(this.world.elementalEvents);
      }
    }
    this.graphics.clear().fillStyle(0x9dffe2).fillCircle(200, 140, 7);
    for (const enemy of this.world.enemies) this.graphics.fillStyle(enemy.rupture ? 0x6bf3d0 : 0xff6f87).fillCircle(200 + (enemy.x - 800) * 0.8, 140 + (enemy.y - 500) * 0.8, 5);
    root.querySelector('#meter')!.textContent = `${this.track} · ${this.clock.toFixed(1)}s · ${this.sound.getAllPlaying().length}/8`;
  }
}
export const audition = new Audition();
export const game = new Phaser.Game({ type: Phaser.AUTO, width: 400, height: 280, parent: 'stage', backgroundColor: '#111925', scene: audition, audio: { disableWebAudio: false } });
