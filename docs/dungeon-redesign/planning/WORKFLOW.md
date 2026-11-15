# Dungeon Rework — Flow theo từng milestone

Revision: 2 · 2026-11-15 · DUNGEON-PLAN-FLOW-02 · nguồn C10 trong DESIGN_CHECKLIST.

**Hiệu lực mới:** plan milestone → hoàn thiện spec/concept → user khóa spec milestone → implement từng ticket → nghiệm thu milestone → milestone kế. Không cần planning xong toàn rework mới được implement P1. P0 là hồ sơ điều phối/coverage, không là global implementation gate.

Bản rev1 có cả progress audit trước thay đổi được giữ nguyên ở [WORKFLOW_R1_HISTORY.md](WORKFLOW_R1_HISTORY.md); audit lock global cũ ở [SPEC_LOCK_R1_HISTORY.md](SPEC_LOCK_R1_HISTORY.md). Những yêu cầu global lock/chờ P2–P6 trong hồ sơ cũ được C10 supersede **về quy trình**, không xóa approval hay đổi gameplay/spec đã duyệt. Plans/specs/tickets P0/P1 giữ bytes hiện có cho tới task migration cụ thể; không tự xem chúng đã đạt lock P1.

## 1. Cách dùng

Trong session mới ở branch codex/dungeon-skill-rework, gọi **$dungeon-planning next**. Skill chạy [next.mjs](next.mjs) để đọc [PROGRESS.json](PROGRESS.json), chọn một bước hợp lệ và thực hiện bước đó. User không phải nhớ ID đang tới đâu hoặc tự viết prompt dài mỗi lần.

Lệnh kiểm tra thuần đọc:

~~~text
node docs/dungeon-redesign/planning/next.mjs status
node docs/dungeon-redesign/planning/next.mjs next --json
~~~

Script chỉ phân tích và trả action/reasons/suggestedPrompt; không tự sửa file, gọi shell/LLM, tạo approval hoặc thực thi code game. **Skill/agent thực hiện action** khi user gọi next. Chạy CLI để test trong task sửa workflow không tự mở ticket được selector đề xuất.

Mỗi lần next = một bước/task, không chạy xuyên nhiều ticket/milestone. Nếu đang có task IN_PROGRESS hợp lệ thì ưu tiên tiếp tục. Sau hoàn tất, cập nhật progress/handoff và dừng; lần next sau mới chọn bước tiếp. Khi milestone đã có user acceptance thật, lần next tiếp theo tự chọn planning milestone sau: P1→P2→P3→P4→P5→P6. Chỉ thị user mới rõ phạm vi tiếp tục ưu tiên.

## 2. Flow và điều kiện

| Giai đoạn | Bước tự chọn khi next | Điều kiện / output |
| --- | --- | --- |
| Chưa có plan | plan_milestone | Đọc draft intent, audit source, tạo plan/spec/tickets/coverage/deps của **milestone hiện tại** |
| Plan sai/thiếu | repair_planning | Nêu gap, path và điều kiện đóng; sửa phần độc lập đã rõ, không trình review giả |
| SPEC/CONCEPT chưa làm | execute_task | Làm một task design-only có dependency đủ, theo game-art nếu artwork; chưa production |
| Task BLOCKED/PARTIAL hoặc review thiếu evidence | repair_task | Đóng blocker cụ thể, sửa/bổ sung artifact thật và kiểm lại |
| Plan/design hoàn tất | audit_planning → prepare_lock | Chốt scope, contracts tối thiểu, coverage, targets và exact revisions/hashes của milestone |
| Lock thiếu/sai/stale | repair_lock | Bổ sung/cập nhật artifact và delta trước khi xin review; không tự ghi approval |
| Lock đủ để review | request_lock_approval | Trình revision/path cụ thể cho user khóa **milestone này** |
| Lock valid + task ready | execute_task | Một ART/CODE/VERIFY đúng dependency và A-H2, không tự mở sibling |
| Runtime/task review chưa đủ | repair_task hoặc prepare_milestone_review | Có actual-vs-target/technical evidence/hướng dẫn playtest trước khi xin duyệt |
| Đủ package | request_task_review / request_milestone_acceptance | Xin đúng quyết định còn thiếu, dẫn artifact thực; next không tự là approval |
| Milestone được nghiệm thu | plan_milestone của mốc sau | Không nhảy mốc chỉ vì build PASS hoặc trạng thái đã gõ ACCEPTED |

Nếu next trả request_* nhưng agent đọc artifact thấy còn thiếu/sai, phải ghi issues và chuyển thành repair_* kèm prompt sửa, không dừng với câu “chờ review” chung chung. Script kiểm cấu trúc/file/hash/deps; nội dung thiết kế, chất lượng ảnh và đúng scope approval vẫn phải do agent đối chiếu thật. Không coi metadata PASS là evidence visual/gameplay.

## 3. Ticket và dependency

Giữ hai cấp: [milestone intent](MILESTONE_DRAFTS.md) giải thích outcome; [task ticket](TASK_TICKET_TEMPLATE.md) mô tả một thay đổi đủ chi tiết để session mới làm đúng. Kind PLAN/SPEC/CONCEPT/ART/CODE/VERIFY, chỉ tạo loại cần thực tế. Audit source trước ghi path/API; contracts/state/input/cancel/pause/save/error/geometry/refs/AC/verify cần rõ theo scope.

P1 có thể hoàn tất world và dùng interface/fixture đã khóa để thể hiện ranh giới combat/save tương lai. Fixture phải ghi injected/composite, không giả là hệ combat/full-save đã chạy. Không bắt full planning/implementation P2–P6 làm prerequisite cho P1; cũng không bỏ core world AC, giảm mật độ hoặc bịa feasibility để né dependency. Khi hợp đồng tối thiểu cần quyết định mới, chuẩn bị proposal cụ thể ngay trong planning milestone hiện tại.

Tách spec dependency (contract cần rõ) khỏi task/artifact dependency (output phải có). Không để concept chờ renderer cần chính concept ấy; không để user playtest tương lai thành gate vòng chặn code đầu tiên. Mọi requirement milestone có owner/ticket/spec/evidence, phần tích hợp ở mốc sau giữ rõ owner và điều kiện kiểm lại.

## 4. Lock từng milestone

[SPEC_LOCK.md](SPEC_LOCK.md) là index hiện hành. Mỗi milestone có manifest riêng khi đủ artifacts, không tạo hàng loạt lock rỗng. CODE/ART production/integration chỉ sau user lock revision của milestone và approved target đúng scope. Review R01–R12 là baseline thiết kế, không thay lock/visual approval chi tiết.

Đổi spec/ref sau lock: delta→impact→đánh dấu affected lock STALE→review/khóa lại đúng phần đổi. Giữ lịch sử approval và assets cũ, không tự sửa Bible/DDR. Thay đổi milestone sau làm ảnh hưởng mốc đã nghiệm thu thì ghi regression/revalidation cần chạy; không giả approval cũ phủ mọi thay đổi mới.

## 5. Progress và prompt sửa

[PROGRESS_FORMAT.md](PROGRESS_FORMAT.md) định nghĩa ledger và bằng chứng. PROGRESS.json giữ thứ tự/path/dependency/readiness/completion records; trạng thái task đọc trực tiếp header ticket, không lưu bản status thứ hai. Specs/tickets vẫn giữ nội dung chuyên môn; handoff là snapshot, không là database/router.

Mỗi chẩn đoán phải có **vấn đề → file/ticket → việc sửa → điều kiện đạt → suggestedPrompt**. Prompt không chỉ nói “review lại”. Nếu có cách sửa an toàn trong scope next thì agent làm một bước sửa, không bắt user dán lại prompt. Nếu cần input thật/approval/tool còn thiếu, nêu rõ lý do và đưa prompt tiếp tục cụ thể; không chế ảnh/số đo/approval cho đủ trạng thái.

Kết thúc bước: sửa header status thật, ghi output/proof/checks/issues vào progress, chạy selector **status** để đối chiếu, cập nhật handoff một next action. Không tự chạy action thứ hai. Approval người dùng chỉ ghi khi có quote/date/source đúng artifact/revision.

## 6. Ranh giới còn giữ

Design Harness/A-H2/Reference Protocol, game-art và mobile-first+desktop-equivalent giữ hiệu lực. Auto-next cấp quyền **chọn/thực hiện một bước** trong workflow, không tự duyệt visual/spec/playtest, đổi gameplay/balance ngoài baseline, merge/main/deploy hoặc tắt máy. Các lệnh push/shutdown là authorization riêng cho session user giao, không mặc định cho mọi next.
