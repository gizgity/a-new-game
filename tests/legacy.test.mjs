import test from 'node:test';
import assert from 'node:assert/strict';
import { SIGILS, BRANCHES, LEGACY_IDS, legacyUnlocks, validLegacy } from '../.test-build/config/legacy.js';
import { rollLegacy, emptyLegacy, beginLegacy, chooseLegacy, closeLegacy, validateLegacy } from '../.test-build/legacy.js';
import { defaultProfile, validateProfile, Progression } from '../.test-build/progression.js';

test('catalog has six Sigils/twelve dependent Branches; foreign or orphan IDs are filtered', () => {
  assert.equal(SIGILS.length, 6); assert.equal(Object.keys(BRANCHES).length, 12);
  for (const sigil of SIGILS) assert.equal(Object.values(BRANCHES).filter(id => id === sigil).length, 2);
  assert.deepEqual(legacyUnlocks(['wildfire', 'fire', 'nightfall', '__proto__', 'fire']), ['fire', 'wildfire']);
  assert.equal(validLegacy({sigil:'fire',branch:'brittle'}), false);
  assert.equal(validLegacy({sigil:'fire',branch:'constructor'}), false);
  assert.equal(validLegacy({sigil:'fire',branch:'wildfire'}, ['fire']), false);
});
test('Sigil-first sampler is deterministic, distinct and dependency safe over 2000 seeds', () => {
  for (let seed = 1; seed <= 2000; seed++) {
    const offers = rollLegacy(LEGACY_IDS, seed);
    assert.equal(offers.length, 2); assert.notDeepEqual(offers[0], offers[1]);
    assert.deepEqual(offers, rollLegacy(LEGACY_IDS, seed));
    for (const offer of offers) assert.ok(validLegacy(offer));
  }
});
test('fallback: zero, core only, one branch, same element with two branches', () => {
  assert.deepEqual(rollLegacy([], 3), []);
  assert.deepEqual(rollLegacy(['fire'], 3), [{sigil:'fire',branch:null}]);
  assert.deepEqual(rollLegacy(['fire','wildfire'], 3), [{sigil:'fire',branch:'wildfire'}]);
  const two = rollLegacy(['fire','wildfire','furnace'], 3);
  assert.equal(two.length, 2); assert.notEqual(two[0].branch, two[1].branch);
  assert.deepEqual(rollLegacy(['wildfire'], 3), []);
});
test('branch-rich elements do not dominate first roll; anti-repeat reduces without excluding', () => {
  let fire = 0, repeated = 0;
  for (let seed = 1; seed <= 8000; seed++) {
    // Mix seeds to cover the xorshift first draw uniformly.
    const mixed = Math.imul(seed, 2654435761) >>> 0;
    if (rollLegacy(['fire','wildfire','furnace','water'], mixed)[0].sigil === 'fire') fire++;
    if (rollLegacy(['fire','wildfire','furnace','water'], mixed, ['fire'])[0].sigil === 'fire') repeated++;
  }
  assert.ok(fire > 3800 && fire < 4200, fire); assert.ok(repeated > 2800 && repeated < fire, repeated);
});
test('first run has no Legacy; refresh/restart retains ticket, seed and choice until result', () => {
  let state = emptyLegacy(); state.unlocks = [...LEGACY_IDS];
  const first = beginLegacy(state, 0, 55); assert.equal(first.firstRun, true); assert.deepEqual(first.offers, []);
  assert.equal(chooseLegacy(state, 0), false);
  assert.deepEqual(beginLegacy(state, 1, 99), first);
  closeLegacy(state);
  const next = beginLegacy(state, 1, 66); assert.equal(next.offers.length, 2);
  assert.equal(chooseLegacy(state, -1), false); assert.equal(chooseLegacy(state, 0.5), false);
  assert.equal(chooseLegacy(state, 1), true); assert.equal(chooseLegacy(state, 0), false);
  state = validateLegacy(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(beginLegacy(state, 20, 999), next);
  closeLegacy(state); assert.equal(state.ticket, null); assert.ok(state.previous.length);
});
test('profile round-trip does not unlock Legacy, consume a ticket or persist derived combat stats', () => {
  const profile = defaultProfile();
  assert.deepEqual(profile.legacy.unlocks, []);
  profile.legacy.unlocks = ['fire','wildfire']; beginLegacy(profile.legacy, 1, 4); chooseLegacy(profile.legacy, 0);
  assert.deepEqual(validateProfile(JSON.parse(JSON.stringify(profile))).legacy, profile.legacy);
  const progress = new Progression(profile); progress.beginRun();
  assert.ok(profile.legacy.ticket); progress.observe({kills:0,detonations:0,perfectDodges:0}, 'defeat');
  assert.equal(profile.legacy.ticket, null); assert.deepEqual(profile.legacy.unlocks, ['fire','wildfire']);
  progress.beginRun(); progress.observe({kills:0,detonations:0,perfectDodges:0}, 'victory');
  assert.deepEqual(profile.legacy.unlocks, ['fire','wildfire']);
});

test('ticket validation strips derived values and rejects foreign, duplicate and orphan offers', () => {
  const state = validateLegacy({unlocks:['fire','wildfire','brittle'], previous:['fire','alien'],
    ticket:{seed:7, firstRun:false, offers:[{sigil:'fire',branch:'wildfire',damage:999},{sigil:'fire',branch:'wildfire'},{sigil:'ice',branch:'brittle'}], selected:{sigil:'fire',branch:'wildfire',damage:999}}});
  assert.deepEqual(state.unlocks, ['fire','wildfire']);
  assert.deepEqual(state.ticket.offers, [{sigil:'fire',branch:'wildfire'}]);
  assert.deepEqual(state.ticket.selected, {sigil:'fire',branch:'wildfire'});
  assert.equal(validateLegacy({ticket:{seed:NaN,firstRun:false,offers:[]}}).ticket, null);
});
