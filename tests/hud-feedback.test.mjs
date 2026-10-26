import assert from 'node:assert/strict';
import test from 'node:test';
import { HUDFeedback } from '../.test-build/hud/HUDFeedback.js';
const base = () => ({ hurt: 0, heal: 0, healed: 0, shieldFlash: 0, broken: false, perfects: 0, risk: false, cost: 0 });
test('HUD: active heal flag does not refresh a notice or invent accumulated healing', () => {
  const feedback = new HUDFeedback(), state = base(); feedback.update(state, 0);
  Object.assign(state, { heal: .5, healed: 2 });
  assert.deepEqual(feedback.update(state, 0), { kind: 'heal', amount: 2 });
  for (let i = 0; i < 11; i++) feedback.update(state, .1);
  assert.equal(feedback.update(state, 0), null);
});
test('HUD: break wins over simultaneous hit, Perfect and heal; stale pending work expires', () => {
  const feedback = new HUDFeedback(), state = base(); feedback.update(state, 0);
  Object.assign(state, { hurt: .4, shieldFlash: .35, broken: true, perfects: 1, heal: .5, healed: 2 });
  assert.equal(feedback.update(state, 0)?.kind, 'break');
  for (let i = 0; i < 12; i++) feedback.update(state, .1);
  assert.equal(feedback.update(state, 0), null);
});
test('HUD: paused/hitstop zero-dt keeps notice alive; reset discards all old notices', () => {
  const feedback = new HUDFeedback(), state = base(); feedback.update(state, 0);
  state.perfects = 1; feedback.update(state, 0);
  for (let i = 0; i < 50; i++) assert.equal(feedback.update(state, 0)?.kind, 'perfect');
  feedback.reset(); assert.equal(feedback.update(base(), 0), null);
});
test('HUD: persistent risk is announced once; leaving and entering it can announce again', () => {
  const feedback = new HUDFeedback(), state = base(); feedback.update(state, 0);
  state.risk = true; assert.equal(feedback.update(state, 0)?.kind, 'risk');
  for (let i = 0; i < 11; i++) feedback.update(state, .1);
  assert.equal(feedback.update(state, 0), null);
  state.risk = false; feedback.update(state, 0); state.risk = true;
  assert.equal(feedback.update(state, 0)?.kind, 'risk');
});
test('HUD: a fresh queued Perfect gets readable display time, without refreshing repeated flags', () => {
  const feedback = new HUDFeedback(), state = base(); feedback.update(state, 0);
  state.hurt = .18; feedback.update(state, 0);
  feedback.update(state, .1); feedback.update(state, .1);
  state.perfects = 1; feedback.update(state, .1);
  for (let i = 0; i < 8; i++) feedback.update(state, .1);
  assert.equal(feedback.update(state, 0)?.kind, 'perfect');
  feedback.update(state, .1); assert.equal(feedback.update(state, .1)?.kind, 'perfect');
  for (let i = 0; i < 10; i++) feedback.update(state, .1);
  assert.equal(feedback.update(state, 0), null);
});
