# DUNGEON-PLAN-FLOW-01 — Dựng flow planning và spec lock

Status: IMPLEMENTED-NEEDS-REVIEW (docs/process only)
Kind: DESIGN
Revision: 1
Owner approval: user giao tạo workflow; không approval gameplay implementation
Last updated:2026-11-14
Related phase: Dungeon/Skill Rework; previous task: DUNGEON-REVIEW-01
Source request: user “all y” kèm R12 planning tickets/spec lock, rồi “làm xong thì push lên branch r tắt máy dùm t, từng milestone/tasks/implement sẽ bắt dầu trong các session mới”, hội thoại hiện tại không permalink. Nguyên văn đầy đủ tại C09 trong DESIGN_CHECKLIST.
Docs read: AGENTS, HANDOFF/CURRENT, MASTER_PLAN, HARNESS, DESIGN_BIBLE, REFERENCE_PROTOCOL, A-H2, REVIEW_V1/queue/log, handoff/skill-creator và game-art workflow khi routing.

## 1. One change / Outcome
Before:12proposal đã được user đồng ý; R12 mới có bảng milestones, chưa có flow lập ticket/khóa specs.
After: bộ workflow repository có draft intent, mẫu detailed ticket, lock manifest và skill/instructions dẫn agent qua đúng gates/session.
Why: chuẩn bị đủ chi tiết trước code, giữ intent xuyên session và không nhầm design approval thành implementation permission.
Scope IN: ghi nhận approval, setup docs/process/skill/instructions; kiểm consistency; commit/push đúng branch theo user, rồi tắt máy theo yêu cầu một lần.
Scope OUT: mở planning P0–P6 hoặc task con, tạo concept/asset production, sửa runtime/balance/Bible/DDR, merge/main/Pages. Package-lock có diff từ trước, không stage/reset.
Dependency: review V1 cc6f54c + chỉ dẫn user hiện tại; không cần user approve lại nội dung đã đồng ý.

## 2. Design choices
Baseline: R12 V1 và Harness/A-H2 được duyệt.
Change: flow F0–F6, hai cấp ticket; global spec lock trước CODE/ART production; task thực hiện trong session mới được giao.
Keep: R01–R11 và nội dung R12 ngoài flow, approvals cũ và source/history.
Supersedes: cách R12 chỉ mô tả milestone/per-task planning; bổ sung cổng global spec lock theo user, không supersede thiết kế game.
Unknown: detailed specs/tickets/targets chưa tạo — thuộc các session planning sau, không blocker hoàn tất setup.
Platform/context: quy trình chung touch/desktop, không runtime change.

## 3. Reference bindings
Baseline: HARNESS/A-H2/REFERENCE_PROTOCOL và review V1 tại cc6f54c.
Concept/TARGET refs: N/A — tài liệu quy trình, không tạo artwork.
Must match: intent→detailed planning→user lock→implementation; không tự mở task/session tiếp.
Must not infer: workflow xong không là spec locked/visual approved/playtest accepted.

## 4. Acceptance
- [x] AC1 Ghi nhận12/12 design approval với R12 amendment, không đánh dấu global lock hoặc targets chưa có là approved.
- [x] AC2 Có workflow, draft intent7milestone chưa kích hoạt, mẫu detailed ticket và lock manifest NOT_LOCKED.
- [x] AC3 Skill discoverable và AGENTS route đúng; gates/coverage/revision/dependencies/change-after-lock/session boundary rõ, không trùng quyền Harness.
- [x] AC4 Kiểm links/skill/scope, giữ61question blocks/goals/history/production/package-lock; chuẩn bị push đúng branch không force và dừng trước milestone kế. Kết quả push thực tế xác nhận riêng sau commit.
Evidence plan: diff/link/format checks và walkthrough tình huống, remote branch SHA; không build game.

## 5. Approval gate
Approved scope: tạo workflow/instructions/skill; push branch và shutdown cuối session theo user.
Approved gameplay design:12/12, R12 amended; xem C09.
Approved global spec lock: NONE.
STOP: sau setup/check/push/shutdown; không tự mở P0 hoặc implementation.

## 6. Implementation / validation
Files: AGENTS; skill dungeon-planning; planning WORKFLOW/MILESTONE_DRAFTS/TASK_TICKET_TEMPLATE/SPEC_LOCK; approval notes/queue/resume/handoff; card này và update status card review cũ.
Runtime/assets: NONE.
Build/typecheck/game tests: NOT RUN — docs-only.
Skill format/links/scope: PASS static checks (hai YAML fields hợp lệ, name/path/description đúng; không thiếu local links; không scaffold TODO). `quick_validate.py` chính thức NOT RUN: Python/py launcher của máy không khởi chạy được. Không cài dependency chỉ để kiểm Markdown; format kiểm bằng Node và đọc đối chiếu validator, không gọi đó là kết quả chạy Python.
Protected audit:61/61 question blocks không đổi so cc6f54c; goals/history HANDOFF, package-lock, DDR/Bible/Harness/A-H2 hashes giữ nguyên. Review V1 bỏ banner mới khớp đúng hash bản cc6f54c. Main không đổi. Không runtime/assets/dependency mới.
Commit/push:3f3e807 commit setup + toàn bộ các checkpoint notes trước đã push thành công tạo origin/codex/dungeon-skill-rework. Note xác nhận này là docs-only, push tiếp rồi kiểm remote head khớp local; SHA cuối xem git/bàn giao. Không force/main/deploy.
Shutdown: chỉ sau push thành công, theo chỉ dẫn user một lần; không force đóng app chưa lưu.

### Walkthrough quy trình trên tài liệu (không phải runtime hoặc independent agent test)

| Tình huống | Kết quả khi đối chiếu flow/skill | Kết quả audit |
| --- | --- | --- |
| Session này hoàn tất setup hoặc resume nhưng chưa giao milestone | Giữ7draft, không mở P0 hay tạo task con | PASS |
| Session mới giao planning DR-P1 | Đọc intent, audit source, tạo detailed plan/coverage/tickets; chưa code | PASS |
| Giao CODE khi manifest NOT_LOCKED | Chặn implementation, nêu đúng artifact/gate thiếu; không giả READY | PASS |
| Giao CONCEPT trước lock | Được làm design-only đúng scope qua game-art, không production/integration | PASS |
| Có lock nhưng visual target sai/thiếu | Chặn task visual tương ứng dù baseline12mục đã duyệt | PASS |
| User đổi một spec sau lock | Ghi delta/impact, affected lock STALE, cập nhật theo approval; giữ lịch sử | PASS |
| Task CODE có lock/ref/deps đúng và được giao rõ | Thực hiện scope đã giao, không xin phép lại routine work hoặc tự mở sibling | PASS |

## 7. Handoff
Technical docs: PASS consistency/links/format/scope + walkthrough trên tài liệu; chưa chứng minh agent/runtime sẽ tuân thủ trong tương lai.
User visual/playtest: N/A; không có artwork/runtime mới.
Known gaps: planning milestone/task/spec lock còn nguyên cho session mới.
Final status: SETUP COMPLETE — chưa mở milestone; user visual/playtest N/A cho docs/process.
NEXT ACTION SAU BÀN GIAO: DỪNG; chờ user giao planning milestone/task trong session mới.
