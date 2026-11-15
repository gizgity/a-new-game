import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ledgerPath = 'docs/dungeon-redesign/planning/PROGRESS.json';
const designKinds = new Set(['PLAN', 'SPEC', 'CONCEPT']);
const kinds = new Set([...designKinds, 'ART', 'CODE', 'VERIFY']);
const done = status => ['ACCEPTED', 'DONE'].includes(status);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const explicit = value => typeof value === 'string' && value.trim()
  && !/^(NONE|N\/A|UNKNOWN|NOT APPROVED)$/i.test(value.trim());
const approvalValid = a => Boolean(a && explicit(a.quote) && explicit(a.source)
  && /^\d{4}-\d{2}-\d{2}$/.test(a.date));

/** Read-only selector. The skill, not this script, executes the returned action. */
export function inspectProgress(root) {
  root = fs.realpathSync(root);
  function local(relative) {
    if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) throw Error(`Path không hợp lệ: ${relative}`);
    const full = path.resolve(root, relative);
    const within = p => { const r = path.relative(root, p); return r !== '..' && !r.startsWith(`..${path.sep}`) && !path.isAbsolute(r); };
    if (!within(full) || (fs.existsSync(full) && !within(fs.realpathSync(full)))) throw Error(`Path ngoài repository: ${relative}`);
    return full;
  }
  const exists = relative => fs.existsSync(local(relative));
  const read = relative => fs.readFileSync(local(relative), 'utf8');
  function proofs(items, label) {
    if (!Array.isArray(items) || !items.length) return [`${label}: chưa có artifact/evidence`];
    return items.flatMap(item => {
      if (!item || !exists(item.path)) return [`${label}: thiếu ${item?.path ?? 'path'}`];
      if (item.normalization && !['bytes', 'lf'].includes(item.normalization)) return [`${label}: normalization sai ${item.path}`];
      if (item.normalization === 'lf' && !/\.(md|json|txt|ts|mjs|js|yaml|yml)$/i.test(item.path)) return [`${label}: không chuẩn hóa text cho asset binary ${item.path}`];
      const bytes = fs.readFileSync(local(item.path));
      const content = item.normalization === 'lf' ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes;
      if (!/^[a-f0-9]{64}$/i.test(item.sha256 ?? '') || digest(content) !== item.sha256.toLowerCase()) {
        return [`${label}: hash/revision không khớp ${item.path}`];
      }
      return [];
    });
  }
  function result(ms, action, reasons, instruction, { task = null, needsUser = false } = {}) {
    const id = task?.id ?? ms?.id ?? 'PROGRESS';
    return {
      schemaVersion: 1, milestone: ms?.id ?? null, task: task?.id ?? null,
      action, canExecute: !needsUser, reasons,
      suggestedPrompt: `$dungeon-planning ${instruction}\nPhạm vi: ${id}. ${reasons.length ? `Cần xử lý: ${reasons.join('; ')}. ` : ''}`
        + 'Giữ baseline đã duyệt, ghi artifact/evidence thật, cập nhật PROGRESS.json và handoff. '
        + (needsUser ? 'Chỉ xin duyệt đúng revision/artifact đã đủ; không tự ghi approval.' : 'Làm đúng một bước này rồi kiểm lại; chưa chạy bước tiếp trong cùng lượt.'),
    };
  }
  const repair = (ms, reasons, instruction, task) => result(ms, task ? 'repair_task' : 'repair_planning', reasons,
    instruction ?? `Sửa hồ sơ ${ms.id}: hoàn thiện phần thiếu và kiểm readiness trước khi đề nghị review.`, { task });
  try {
    if (!exists(ledgerPath)) return result(null, 'repair_progress', [`Thiếu ${ledgerPath}`], 'Khôi phục progress index từ milestone/ticket/approval có thật; không tự đánh dấu hoàn tất.');
    const data = JSON.parse(read(ledgerPath));
    if (data.schemaVersion !== 1 || !Array.isArray(data.milestones) || !data.milestones.length) throw Error('Sai schema PROGRESS.json');
    const ids = data.milestones.map(m => m.id);
    if (new Set(ids).size !== ids.length || ids.some(id => !/^DR-P[1-6]$/.test(id))) throw Error('Milestone ID trùng hoặc không hợp lệ');

    for (const ms of data.milestones) {
      if (!exists(ms.plan)) {
        if (ms.acceptance) return repair(ms, [`Đã ghi acceptance nhưng plan ${ms.plan} không tồn tại`]);
        return result(ms, 'plan_milestone', [`Chưa có detailed plan ${ms.plan}`],
          `Mở planning ${ms.id}: đọc draft intent, audit đúng source, viết specs/ticket chi tiết và dependency tối thiểu của milestone này; không yêu cầu plan xong mốc sau.`);
      }
      const issues = ms.planningAudit?.issues ?? [];
      if (issues.length) return repair(ms, issues.map(i => `${i.id}: ${i.detail} (${i.file}); đạt khi ${i.doneWhen}`),
        `Sửa planning ${ms.id} trước: ${issues.map(i => i.fix).join(' ')} Không trình review bản đã biết còn thiếu.`);
      if (!Array.isArray(ms.tasks) || !ms.tasks.length) return repair(ms, ['Chưa có task inventory có thể thực thi'], `Hoàn thiện detailed plan/tickets ${ms.id}, đăng ký IDs/dependencies và output cần kiểm vào PROGRESS.json.`);
      if (!Array.isArray(ms.requiredSpecs) || !ms.requiredSpecs.length) return repair(ms, ['Chưa đăng ký requiredSpecs cho scope milestone; không thể khóa một scope rỗng']);

      const tasks = new Map();
      for (const item of ms.tasks) {
        if (tasks.has(item.id) || !item.id.startsWith(`${ms.id}-`)) throw Error(`Task ID trùng/sai parent: ${item.id}`);
        if (!exists(item.file)) return repair(ms, [`Thiếu ticket ${item.file}`]);
        const text = read(item.file);
        const field = name => text.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].trim();
        const kind = field('Kind')?.match(/^[A-Z]+/)?.[0];
        const status = field('Status')?.match(/^[A-Z]+(?:[-_][A-Z]+)*/)?.[0];
        if (!kinds.has(kind) || !status || !text.startsWith(`# ${item.id} `)) return repair(ms, [`Metadata Kind/Status/ID sai ở ${item.file}`]);
        const allowed = ['DRAFT', 'PLANNED', 'SPEC_READY', 'READY', 'IN_PROGRESS', 'IN-PROGRESS', 'BLOCKED', 'PARTIAL', 'NEEDS_REVIEW', 'NEEDS-REVIEW', 'AWAITING_USER', 'IMPLEMENTED-NEEDS-REVIEW', 'ACCEPTED', 'DONE'];
        if (!allowed.includes(status)) return repair(ms, [`Status chưa được định nghĩa: ${status} tại ${item.file}`]);
        const task = { ...item, kind, status, dependsOn: item.dependsOn ?? [] };
        if (!Array.isArray(task.dependsOn)) throw Error(`dependsOn sai: ${item.id}`);
        tasks.set(item.id, task);
      }
      const visiting = new Set(), visited = new Set();
      function visit(task) {
        if (visiting.has(task.id)) throw Error(`Dependency vòng tại ${task.id}`);
        if (visited.has(task.id)) return;
        visiting.add(task.id);
        for (const id of task.dependsOn) {
          const dep = tasks.get(id);
          if (!dep) throw Error(`Dependency không có trong milestone: ${task.id} → ${id}`);
          if (designKinds.has(task.kind) && !designKinds.has(dep.kind)) throw Error(`Gate vòng design→implementation: ${task.id} → ${id}`);
          visit(dep);
        }
        visiting.delete(task.id); visited.add(task.id);
      }
      for (const task of tasks.values()) visit(task);
      for (const task of tasks.values()) {
        if (!done(task.status)) continue;
        const gaps = proofs(task.completion?.outputs, task.id);
        if (task.completion?.technical !== 'PASS') gaps.push(`${task.id}: thiếu technical completion record`);
        if ((task.status === 'ACCEPTED' || task.kind === 'CONCEPT') && !approvalValid(task.completion?.approval)) gaps.push(`${task.id}: thiếu evidence user approval`);
        if (gaps.length) return repair(ms, gaps, `Đối chiếu completion ${task.id}, bổ sung evidence thật hoặc sửa status nếu chưa đạt; không giả approval.`, task);
      }
      const pending = [...tasks.values()].filter(t => !done(t.status));
      if (ms.acceptance && pending.length) return repair(ms, ['Milestone có acceptance nhưng còn task chưa hoàn tất; kiểm lại record, không bỏ qua task']);
      const ready = pending.filter(t => t.dependsOn.every(id => done(tasks.get(id).status)))
        .sort((a, b) => Number(/IN.PROGRESS/.test(b.status)) - Number(/IN.PROGRESS/.test(a.status)));
      function routeTask(task) {
        const gaps = (task.issues ?? []).map(i => typeof i === 'string' ? i : i.detail);
        if (gaps.length || ['BLOCKED', 'PARTIAL'].includes(task.status)) return repair(ms,
          gaps.length ? gaps : [`${task.file}: ${task.status}, cần bổ sung nguyên nhân/cách đóng cụ thể`],
          `Sửa/hoàn thiện ${task.id}, đóng blocker bằng artifact có thật trước khi xin review.`, task);
        const reviewStatus = /REVIEW|AWAITING/.test(task.status);
        if (reviewStatus) {
          const missing = proofs(task.review?.outputs, `${task.id} review`);
          if (task.review?.ready !== true) missing.push('Chưa có readiness audit đủ điều kiện review');
          if (missing.length) return repair(ms, missing, `Hoàn thiện review package ${task.id}; chưa xin duyệt khi thiếu artifact/evidence.`, task);
          return result(ms, 'request_task_review', [], `Review ${task.id} theo các artifact ${task.review.outputs.map(p => p.path).join(', ')}; ghi đồng ý/sửa/từ chối đúng revision.`, { task, needsUser: true });
        }
        return result(ms, 'execute_task', [], `Thực hiện ticket ${task.id} (${task.kind}) tại ${task.file}, đúng dependencies và spec/target của milestone; không mở sibling.`, { task });
      }
      const design = ready.find(t => designKinds.has(t.kind));
      if (design) return routeTask(design);
      if (pending.some(t => designKinds.has(t.kind))) return repair(ms, ['Design tasks chưa hoàn tất nhưng không có task hợp lệ để chạy; kiểm dependency']);
      const auditGaps = proofs(ms.planningAudit?.outputs, `${ms.id} planning audit`);
      if (ms.planningAudit?.status !== 'PASS' || auditGaps.length) return result(ms, 'audit_planning', auditGaps,
        `Audit readiness ${ms.id}: specs/targets/contracts/tickets/coverage trong milestone này; giải gap hoặc ghi repair prompt, không chờ planning mốc sau.`);

      if (!exists(ms.lock)) return result(ms, 'prepare_lock', [`Chưa có ${ms.lock}`],
        `Chuẩn bị lock riêng ${ms.id}: exact spec/target paths/revisions/hashes, dependencies và scope đủ; không khóa toàn rework.`);
      const lock = JSON.parse(read(ms.lock));
      const lockGaps = proofs(lock.artifacts, `${ms.id} lock`);
      if (lock.milestone !== ms.id || !Number.isInteger(lock.revision) || lock.revision < 1) lockGaps.push('Lock ID/revision/scope không đúng milestone');
      if (!['DRAFT', 'LOCKED', 'STALE'].includes(lock.status)) lockGaps.push('Lock status không hợp lệ');
      if (lock.status === 'STALE') lockGaps.push('Lock STALE, cần delta/impact và khóa lại phần thay đổi');
      if (lock.issues?.length) lockGaps.push(...lock.issues);
      for (const spec of ms.requiredSpecs ?? []) if (!lock.artifacts?.some(a => a.type === 'SPEC' && a.path === spec)) lockGaps.push(`Lock thiếu SPEC ${spec}`);
      for (const id of ms.requiredTargets ?? []) {
        const target = lock.artifacts?.find(a => a.type === 'TARGET' && a.id === id);
        if (!target || !approvalValid(target.approval)) lockGaps.push(`TARGET ${id} thiếu file/binding/approval`);
      }
      if (lock.status === 'LOCKED' && !approvalValid(lock.approval)) lockGaps.push('Lock LOCKED nhưng chưa có user approval record');
      if (lockGaps.length) return result(ms, 'repair_lock', lockGaps,
        `Sửa lock ${ms.id} tại ${ms.lock}: bổ sung/cập nhật đúng artifact và approval; nếu hash đổi thì STALE, trình lại delta có thể review thay vì tự khóa.`);
      if (lock.status !== 'LOCKED') return result(ms, 'request_lock_approval', [],
        `Review và quyết định khóa ${ms.id} revision ${lock.revision} tại ${ms.lock}; đây chỉ là lock milestone này.`, { needsUser: true });
      if (pending.length) {
        if (ms.acceptance) return repair(ms, ['Milestone có acceptance nhưng còn task chưa hoàn tất']);
        if (!ready.length) return repair(ms, ['Không có task runnable; kiểm dependencies/status']);
        return routeTask(ready[0]);
      }
      const reviewGaps = proofs(ms.review?.outputs, `${ms.id} milestone review`);
      if (ms.review?.issues?.length) reviewGaps.push(...ms.review.issues);
      if (ms.review?.ready !== true || reviewGaps.length) return result(ms, 'prepare_milestone_review', reviewGaps,
        `Hoàn thiện nghiệm thu ${ms.id}: actual-vs-target, technical checks và hướng dẫn playtest cụ thể; giải phần thiếu trước khi xin duyệt.`);
      if (!ms.acceptance) return result(ms, 'request_milestone_acceptance', [],
        `Review/nghiệm thu ${ms.id} theo ${ms.review.outputs.map(p => p.path).join(', ')}; ghi kết quả đúng scope.`, { needsUser: true });
      const acceptanceGaps = proofs(ms.acceptance.outputs, `${ms.id} acceptance`);
      if (!approvalValid(ms.acceptance.approval)) acceptanceGaps.push('Thiếu user milestone acceptance record');
      if (acceptanceGaps.length) return repair(ms, acceptanceGaps, `Đối chiếu acceptance ${ms.id}, giữ mốc hiện tại tới khi có evidence đúng scope.`);
      // Only a genuinely accepted milestone allows selection of the following one.
    }
    return result(null, 'complete', [], 'Toàn bộ milestone trong index đã nghiệm thu; báo kết quả và dừng, không tự mở scope mới.', { needsUser: true });
  } catch (error) {
    return result(null, 'repair_progress', [error.message],
      `Sửa ${ledgerPath}/metadata bị sai theo artifact thật, kiểm schema/paths/dependencies; không bỏ gate hoặc đánh dấu hoàn tất để đi tiếp.`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const command = process.argv[2] ?? 'status';
  if (!['next', 'status'].includes(command) || process.argv.slice(3).some(x => x !== '--json')) {
    console.error('Usage: node docs/dungeon-redesign/planning/next.mjs next|status [--json]');
    process.exitCode = 2;
  } else {
    const report = inspectProgress(fileURLToPath(new URL('../../../', import.meta.url)));
    if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
    else console.log(`${report.milestone ?? 'REWORK'} / ${report.task ?? '-'}: ${report.action}\n${report.reasons.map(r => `- ${r}`).join('\n')}\n\nPrompt:\n${report.suggestedPrompt}`);
  }
}
