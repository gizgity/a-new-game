# DUNGEON-PLAN-FLOW-02 — Milestone flow và next có chẩn đoán sửa

Kind: IMPLEMENT (repository tooling/process, không runtime game)
Status: TOOLING COMPLETE — pending branch delivery
Revision: 1 · 2026-11-15
Source: user sửa flow thành implement từng milestone, yêu cầu script cho `$dungeon-planning next`, sau đó yêu cầu suggest prompt sửa gap và push branch/tắt máy. Nguyên văn tại C10 trong DESIGN_CHECKLIST.
Docs read: CURRENT/handoff skill, dungeon-planning/skill-creator, Harness/Master Plan/Design Bible/Reference Protocol/A-H2, flow/index/lock/P0/P1/S1/task headers và P1 DAG liên quan.

## 1. Outcome / scope
Before: flow global planning/lock làm P1 chờ toàn rework; chỉ giao ID thủ công, known gaps chỉ kết thúc bằng chờ review.
After: milestone plan→spec lock→implement→user acceptance tuần tự; next kiểm artifact/progress/deps/hash/approval, chọn một bước và có prompt sửa cụ thể.
IN: workflow/skill/instructions, read-only Node selector + focused tests, progress metadata, ghi supersede/history và handoff; push branch rồi shutdown theo user.
OUT: thực hiện milestone/task do next đề xuất trong lượt cập nhật công cụ, gameplay/code game/art/visual approval/spec lock mới, DDR/Bible/main/deploy. Package-lock diff trước task không stage/reset.
Dependency: R01–R12 baseline; C10 thay process; P0/P1/S1/tickets có trước giữ nguyên nội dung/approval tới task migration.

## 2. Design/ref binding
Baseline: WORKFLOW rev1 và global audit packet có thật, archived nguyên bytes tại WORKFLOW_R1_HISTORY/SPEC_LOCK_R1_HISTORY.
Candidate: WORKFLOW rev2, per-milestone locks, PROGRESS metadata, next.mjs selector/skill executor.
Supersedes: yêu cầu plan toàn rework/global lock và bắt user gọi tên từng task; không supersede gameplay/targets/acceptance đã duyệt.
Visual refs: N/A cho tooling; không tạo artwork.

## 3. Acceptance
- [x] AC1 Gate theo milestone, P0/global audit không còn chặn implementation P1 vì thiếu P2–P6 planning.
- [x] AC2 Next/status phân biệt; script read-only, next chọn đúng một bước; thiếu/sai có reasons/path/repair prompt, không trình premature review.
- [x] AC3 Không nhảy CODE/ART khi lock/ref/hash/approval/deps thiếu; không nhảy milestone vì technical-only completion; xử lý cycle/path ngoài repo/status sai.
- [x] AC4 Có tests meaningful và real-repo dry-run; old plans/specs/tickets/log questions/protected files giữ nguyên hoặc lịch sử rõ; không game build/tests.
- [ ] AC5 Push đúng branch được user yêu cầu, remote SHA verified trước shutdown; không force/main/Pages.

## 4. Implementation / checks
Files: flow/index/template/progress format, PROGRESS.json, next.mjs/next.test.mjs, skill/AGENTS, C10/RESUME/HANDOFF/card.
Focused tests: PASS27cases bằng Node built-in test; command `node --test docs/dungeon-redesign/planning/next.test.mjs`. Gồm milestone progression/acceptance, design-only trước lock, stale/missing/placeholder approval, cycle/path/status, repair prompts/readiness, IN_PROGRESS resume và LF/CRLF portability; binary luôn hash bytes. Không có dependency/framework mới.
Runtime/game typecheck/build: NOT RUN — tooling only, không code game.
Protected audit PASS:61question blocks/goals/lịch sử HANDOFF/DDR/Bible/Harness/Review/package-lock không đổi; P0/P1/S1/17tickets/report/inventory bytes giữ nguyên; hai archives khớp bytes trước sửa.35Markdown/351local links không thiếu, skill frontmatter static PASS, diff whitespace PASS cho thay đổi mới. Full staged check có15blank-EOF warnings từ ticket P1 đã có trước (bytes/hash giữ nguyên); không sửa hồ sơ approved chỉ để xóa whitespace. Validator Python chính thức NOT RUN do launcher cũ không khả dụng; không coi Node audit là đã chạy validator đó.
Real dry-run: next/status trên repo trả DR-P1 / repair_planning, canExecute true, issue C10-P1-FLOW có path/fix/doneWhen/suggestedPrompt. Dry-run không execute action; không lock/approval/milestone acceptance mới. Script không tự kiểm chất lượng ảnh/nội dung thiết kế: skill phải đọc artifact thật và ghi gap nếu phát hiện.
Push: pending sau commit; kiểm SHA remote trước shutdown theo yêu cầu user. Bao gồm hồ sơ planning trước task để remote đủ artifacts, không stage package-lock có sẵn.
Known gap thật: P1 đang NEEDS_REPAIR do legacy global gates/consumer prerequisites; script phải đề xuất repair_planning, không tự chạy task đó trong session sửa tool.

## 5. Handoff
Technical tool: PASS focused tests/static consistency/dry-run; chưa có user experience/playtest mới hoặc đánh giá independent-agent.
Visual/user playtest: N/A; không approval mới ngoài user scope process.
NEXT ACTION: hoàn tất kiểm/push/shutdown trong task này; session sau user gọi next để thực hiện bước sửa/planning milestone đang dở.
