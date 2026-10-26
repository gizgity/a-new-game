import assert from 'node:assert/strict';
import test from 'node:test';
import { touchAim } from '../.test-build/touch/touchAim.js';
const player = { x: 100, y: 100 };
test('Mobile aim picks the nearest living enemy; ignores dead/coincident bodies', () => {
  const enemies = [{ x: 103, y: 100, hp: 0 }, { ...player, hp: 20 }, { x: 100, y: 120, hp: 20 }, { x: 70, y: 100, hp: 20 }];
  assert.equal(touchAim(player, enemies, null, 0), Math.PI / 2);
  enemies[2].hp = 0;
  assert.equal(touchAim(player, enemies, null, 0), Math.PI);
  assert.equal(touchAim(player, [], null, -.7), -.7);
});
test('A deliberate mobile drag wins even at angle zero; auto aim resumes on release', () => {
  const enemies = [{ x: 100, y: 120, hp: 20 }];
  assert.equal(touchAim(player, enemies, 0, -1), 0);
  assert.equal(touchAim(player, enemies, -2, 0), -2);
  assert.equal(touchAim(player, enemies, null, 0), Math.PI / 2);
});
test('Nearest ties are stable in enemy order and targeting never mutates combat state', () => {
  const enemies = Object.freeze([Object.freeze({ x: 100, y: 120, hp: 20 }), Object.freeze({ x: 120, y: 100, hp: 20 })]);
  assert.equal(touchAim(Object.freeze(player), enemies, null, 0), Math.PI / 2);
});
