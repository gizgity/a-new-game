import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { inspectProgress } from './next.mjs';

const approval = { quote: 'duyệt bản này', date: '2026-11-15', source: 'test conversation' };
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dungeon-next-'));
  t.after(() => { assert.equal(path.dirname(root), fs.realpathSync(os.tmpdir())); fs.rmSync(root, { recursive: true }); });
  const write = (file, text) => { const p = path.join(root, file); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };
  const json = (file, data) => write(file, JSON.stringify(data));
  const proof = file => ({ path: file, sha256: sha(fs.readFileSync(path.join(root, file))) });
  write('plan.md', 'Approved milestone plan');
  write('spec.md', 'Final spec');
  write('target.png', 'Target fixture bytes');
  write('audit.md', 'Readiness audit');
  write('output.md', 'Evidence report');
  const ticket = (id, kind, status) => write(`${id}.md`, `# ${id} — Test task\nKind: ${kind}\nStatus: ${status}\n`);
  ticket('DR-P1-SPEC-01', 'SPEC', 'ACCEPTED');
  ticket('DR-P1-CODE-01', 'CODE', 'PLANNED');
  const ms = {
    id: 'DR-P1', plan: 'plan.md', lock: 'lock.json', requiredSpecs: ['spec.md'], requiredTargets: ['TARGET-01'],
    planningAudit: { status: 'PASS', issues: [], outputs: [proof('audit.md')] },
    tasks: [
      { id: 'DR-P1-SPEC-01', file: 'DR-P1-SPEC-01.md', dependsOn: [], completion: { technical: 'PASS', outputs: [proof('spec.md')], approval } },
      { id: 'DR-P1-CODE-01', file: 'DR-P1-CODE-01.md', dependsOn: ['DR-P1-SPEC-01'] },
    ],
    review: { ready: true, outputs: [proof('output.md')] }, acceptance: null,
  };
  const data = { schemaVersion: 1, milestones: [ms, { id: 'DR-P2', plan: 'future-plan.md', lock: 'future-lock.json', tasks: [] }] };
  const lock = { milestone: 'DR-P1', revision: 1, status: 'LOCKED', approval, artifacts: [
    { ...proof('spec.md'), type: 'SPEC' },
    { ...proof('target.png'), type: 'TARGET', id: 'TARGET-01', approval },
  ] };
  const save = () => { json('docs/dungeon-redesign/planning/PROGRESS.json', data); json('lock.json', lock); };
  const run = () => { save(); return inspectProgress(root); };
  return { root, data, ms, lock, write, json, proof, ticket, save, run };
}

test('missing current plan selects planning, without demanding future plans', t => {
  const f = fixture(t); f.ms.plan = 'not-created.md';
  assert.equal(f.run().action, 'plan_milestone');
});
test('known gaps return specific repair prompt, never premature review', t => {
  const f = fixture(t); f.ms.planningAudit.issues.push({ id: 'G1', file: 'plan.md', detail: 'global gate cũ', fix: 'Chuyển gate về P1.', doneWhen: 'P1 có scope lock riêng' });
  const r = f.run(); assert.equal(r.action, 'repair_planning'); assert.match(r.suggestedPrompt, /Chuyển gate về P1/); assert.match(r.reasons[0], /plan.md/);
});
test('design-only task can run before lock', t => {
  const f = fixture(t); f.ticket('DR-P1-SPEC-01', 'SPEC', 'PLANNED'); f.save(); fs.unlinkSync(path.join(f.root, 'lock.json'));
  const r = inspectProgress(f.root); assert.equal(r.action, 'execute_task'); assert.equal(r.task, 'DR-P1-SPEC-01');
});
test('all design done, missing lock prepares current milestone lock', t => {
  const f = fixture(t); f.save(); fs.unlinkSync(path.join(f.root, 'lock.json'));
  assert.equal(inspectProgress(f.root).action, 'prepare_lock');
});
test('valid DRAFT lock requests approval, does not implement', t => {
  const f = fixture(t); f.lock.status = 'DRAFT'; delete f.lock.approval;
  const r = f.run(); assert.equal(r.action, 'request_lock_approval'); assert.equal(r.canExecute, false);
});
test('missing target in draft lock produces repair, not review', t => {
  const f = fixture(t); f.lock.status = 'DRAFT'; f.lock.artifacts.pop();
  const r = f.run(); assert.equal(r.action, 'repair_lock'); assert.match(r.suggestedPrompt, /TARGET-01/);
});
test('a LOCKED label without user approval cannot unlock code', t => {
  const f = fixture(t); delete f.lock.approval;
  assert.equal(f.run().action, 'repair_lock');
});
test('changed artifact bytes invalidate the existing lock', t => {
  const f = fixture(t); f.write('target.png', 'Changed target');
  const r = f.run(); assert.equal(r.action, 'repair_lock'); assert.match(r.reasons.join(' '), /hash/);
});
test('valid milestone lock permits one code ticket without future milestone planning', t => {
  const f = fixture(t); const r = f.run();
  assert.equal(r.action, 'execute_task'); assert.equal(r.task, 'DR-P1-CODE-01'); assert.equal(r.milestone, 'DR-P1');
});
test('known blocked task produces repair prompt', t => {
  const f = fixture(t); f.ticket('DR-P1-CODE-01', 'CODE', 'BLOCKED');
  const r = f.run(); assert.equal(r.action, 'repair_task'); assert.match(r.suggestedPrompt, /DR-P1-CODE-01/);
});
test('review label with no artifacts is repaired rather than presented for approval', t => {
  const f = fixture(t); f.ticket('DR-P1-CODE-01', 'CODE', 'NEEDS_REVIEW');
  assert.equal(f.run().action, 'repair_task');
});
test('ready review with real hash-bound outputs requests user review', t => {
  const f = fixture(t); f.ticket('DR-P1-CODE-01', 'CODE', 'NEEDS_REVIEW');
  f.ms.tasks[1].review = { ready: true, outputs: [f.proof('output.md')] };
  assert.equal(f.run().action, 'request_task_review');
});
test('dependency cycles report actionable progress repair', t => {
  const f = fixture(t); f.ms.tasks[0].dependsOn = ['DR-P1-CODE-01'];
  const r = f.run(); assert.equal(r.action, 'repair_progress'); assert.match(r.reasons.join(' '), /Gate vòng|Dependency vòng/);
});
test('out-of-repo artifact path is rejected without reading its contents', t => {
  const f = fixture(t); f.ms.plan = '../secret.txt';
  const r = f.run(); assert.equal(r.action, 'repair_progress'); assert.match(r.reasons[0], /ngoài repository/);
});
test('completion label without evidence cannot advance', t => {
  const f = fixture(t); delete f.ms.tasks[0].completion;
  assert.equal(f.run().action, 'repair_task');
});
test('technical completion alone does not skip milestone acceptance', t => {
  const f = fixture(t); f.ticket('DR-P1-CODE-01', 'CODE', 'DONE');
  f.ms.tasks[1].completion = { technical: 'PASS', outputs: [f.proof('output.md')] };
  assert.equal(f.run().action, 'request_milestone_acceptance');
});
test('accepted milestone selects next milestone planning', t => {
  const f = fixture(t); f.ticket('DR-P1-CODE-01', 'CODE', 'DONE');
  f.ms.tasks[1].completion = { technical: 'PASS', outputs: [f.proof('output.md')] };
  f.ms.acceptance = { outputs: [f.proof('output.md')], approval };
  const r = f.run(); assert.equal(r.action, 'plan_milestone'); assert.equal(r.milestone, 'DR-P2');
});
test('acceptance with unfinished tasks is repaired, not used to jump forward', t => {
  const f = fixture(t); f.ms.acceptance = { outputs: [f.proof('output.md')], approval };
  assert.equal(f.run().action, 'repair_planning');
});
test('in-progress independent task resumes before a new sibling', t => {
  const f = fixture(t); f.ticket('DR-P1-CODE-02', 'CODE', 'IN_PROGRESS');
  f.ms.tasks.push({ id: 'DR-P1-CODE-02', file: 'DR-P1-CODE-02.md', dependsOn: ['DR-P1-SPEC-01'] });
  assert.equal(f.run().task, 'DR-P1-CODE-02');
});
test('inspection never rewrites progress or grants approval', t => {
  const f = fixture(t); f.save(); const p = path.join(f.root, 'docs/dungeon-redesign/planning/PROGRESS.json');
  const before = fs.readFileSync(p); inspectProgress(f.root);
  assert.deepEqual(fs.readFileSync(p), before);
});
test('a milestone cannot prepare an empty spec scope', t => {
  const f = fixture(t); f.ms.requiredSpecs = [];
  assert.equal(f.run().action, 'repair_planning');
});
test('missing registered ticket gives repair prompt with exact path', t => {
  const f = fixture(t); f.ms.tasks[1].file = 'missing-ticket.md';
  const r = f.run(); assert.equal(r.action, 'repair_planning'); assert.match(r.suggestedPrompt, /missing-ticket.md/);
});
test('unknown ticket status cannot become an implicit runnable task', t => {
  const f = fixture(t); f.ticket('DR-P1-CODE-01', 'CODE', 'MAGICALLY_DONE');
  assert.equal(f.run().action, 'repair_planning');
});
test('placeholder approval source cannot authorize a lock', t => {
  const f = fixture(t); f.lock.approval = { ...approval, source: 'NONE' };
  assert.equal(f.run().action, 'repair_lock');
});
test('missing or malformed index returns a recovery prompt instead of crashing', t => {
  const f = fixture(t); f.json('docs/dungeon-redesign/planning/PROGRESS.json', { schemaVersion: 999 });
  const r = inspectProgress(f.root); assert.equal(r.action, 'repair_progress'); assert.match(r.suggestedPrompt, /PROGRESS.json/);
});
test('explicit LF proof survives Windows checkout line endings, not semantic edits', t => {
  const f = fixture(t); f.write('spec.md', 'First\nSecond\n');
  const proof = { ...f.proof('spec.md'), normalization: 'lf' };
  f.ms.tasks[0].completion.outputs = [proof]; f.lock.artifacts[0] = { ...proof, type: 'SPEC' };
  f.write('spec.md', 'First\r\nSecond\r\n'); assert.equal(f.run().action, 'execute_task');
  f.write('spec.md', 'Changed\r\nSecond\r\n'); assert.equal(f.run().action, 'repair_task');
});
test('binary target cannot hide byte changes behind text normalization', t => {
  const f = fixture(t); f.lock.artifacts[1].normalization = 'lf';
  assert.equal(f.run().action, 'repair_lock');
});
