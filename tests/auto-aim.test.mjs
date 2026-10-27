import assert from 'node:assert/strict';
import test from 'node:test';
import { autoAimTarget } from '../.test-build/autoAim.js';
const player = { x: 100, y: 100 };
const enemy = (kind, x, rupture = 0, hp = 20) => ({ kind, x, y: 100, rupture, hp });
test('Desktop prioritizes nearest Rupture over every selected group, then selected group over nearest', () => {
  const near = enemy('grunt', 110), archer = enemy('archer', 130), elite = enemy('bulwark', 140);
  const mark = enemy('grunt', 170, 1), fartherMark = enemy('archer', 180, 3);
  for (const priority of ['nearest', 'archer', 'elite']) {
    assert.equal(autoAimTarget(player, [near, archer, elite, fartherMark, mark], priority), mark);
  }
  assert.equal(autoAimTarget(player, [near, archer, elite], 'archer'), archer);
  assert.equal(autoAimTarget(player, [near, archer, elite], 'elite'), elite);
  assert.equal(autoAimTarget(player, [near, archer, elite], 'nearest'), near);
});
test('Elite includes Boss; absent/dead preferred groups fall back to nearest; dead marks are ignored', () => {
  const near = enemy('grunt', 110), boss = enemy('boss', 160), elite = enemy('bulwark', 150);
  assert.equal(autoAimTarget(player, [near, boss], 'elite'), boss);
  assert.equal(autoAimTarget(player, [near, boss, elite], 'elite'), elite);
  assert.equal(autoAimTarget(player, [near, enemy('archer', 120, 3, 0)], 'archer'), near);
  assert.equal(autoAimTarget(player, [near], 'elite'), near);
});
test('Target refreshes after death/mark consumption; stable ties, no mutations, no coincident target', () => {
  const near = enemy('grunt', 110), mark = enemy('grunt', 140, 1), archer = enemy('archer', 130);
  const enemies = [near, mark, archer];
  assert.equal(autoAimTarget(player, enemies, 'archer'), mark);
  mark.rupture = 0;
  assert.equal(autoAimTarget(player, enemies, 'archer'), archer);
  archer.hp = 0;
  assert.equal(autoAimTarget(player, enemies, 'archer'), near);
  Object.freeze(near);
  assert.equal(autoAimTarget(Object.freeze(player), Object.freeze([near, Object.freeze(enemy('archer', 90))]), 'nearest'), near);
  assert.equal(autoAimTarget(player, [enemy('boss', 100, 3), enemy('grunt', 110, 1, 0)], 'elite'), undefined);
  assert.equal(autoAimTarget(player, [], 'nearest'), undefined);
});
