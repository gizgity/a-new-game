# Dungeon Rework — Planning → Spec Lock → Implementation

Revision: 1 · 2026-11-14 · Task: DUNGEON-PLAN-FLOW-01.

Áp dụng cho dungeon/skill rework trên `codex/dungeon-skill-rework`. Đây là hướng dẫn thực thi yêu cầu mới của user tại C09 trong [log](../DESIGN_CHECKLIST.md), bổ sung R12 đã duyệt. Không thay Design Harness, Art Bible hoặc quy tắc DDR.

## Baseline quyền tại setup và cách đọc trạng thái

- R01–R11 được duyệt thiết kế V1; R12 được duyệt **kèm flow planning mới**. Nguồn: user “all y” và đoạn bổ sung R12, ngày2026-11-14, hội thoại hiện tại không permalink.
- Approval đó chốt baseline thiết kế để lập kế hoạch. Chưa có detailed tickets/spec lock/visual target mới, chưa cho phép bắt đầu implementation.
- Lượt setup2026-11-14 chỉ dựng workflow, instructions, skill, templates và các draft intent. User yêu cầu các milestone/task/implementation bắt đầu trong **session mới**. Không tự kích hoạt milestone khi resume chỉ để hoàn thành backlog.
- Draft không cấp quyền mở task. Trạng thái session hiện hành đọc CURRENT trong HANDOFF và [index milestone](MILESTONE_DRAFTS.md): P0 [plan rev1](DR-P0_PLAN.md) đã được user “y” duyệt planning ngày2026-11-15. User mở riêng planning DR-P1 ngày2026-11-15; [hồ sơ P1/S1 rev2](DR-P1_PLAN.md) APPROVED — PLANNING ONLY qua user “y”,2026-11-15, chỉ audit/spec/tickets, chưa giao child execution; P2–P6 chưa mở. [SPEC_LOCK.md](SPEC_LOCK.md) vẫn `NOT_LOCKED`. Đây là snapshot approval planning, không đổi flow/gates rev1.

- **Assignment mới2026-11-15:** user giao audit toàn rework/coverage/dependencies/specs/approved targets, chuẩn bị spec-lock review, chưa implement. [DR-P0-VERIFY-01 rev2](tickets/DR-P0-VERIFY-01.md) đã audit, [report rev1](DR-P0_CLOSURE.md)/[inventory](DR-P0_LOCK_INVENTORY.md)/[audit packet rev1](SPEC_LOCK.md) chờ review; closure BLOCKED L01–L08, lock rev0 NOT_LOCKED. P2–P6 vẫn DRAFT; không tự chạy planning/spec/concept child.14child P1 rev3 chỉ sửa metadata approval, giữ nội dung/deps/AC. **Dừng chờ user review packet**, không implementation.

## 1. Hai cấp ticket, một nguồn spec

**Milestone draft** mô tả *vì sao cần mốc này và kết quả người chơi cần nhận được*. Có intent, scope/anti-scope, dependency, output cần chuẩn bị, acceptance và câu chưa giải quyết. Không giả rằng một nhãn “P3 Build” đủ chỉ dẫn cho agent viết code.

**Task ticket chi tiết** mô tả *một thay đổi cụ thể cần làm để đạt intent*. Khi một milestone được mở để planning trong session mới, lập các ticket con cần thiết theo [mẫu](TASK_TICKET_TEMPLATE.md). Phân loại PLAN/SPEC/CONCEPT/ART/CODE/VERIFY theo công việc thật, không tạo đủ sáu loại cho mọi thay đổi. Mỗi ticket chỉ một outcome; cùng milestone không phải lý do gộp nhiều outcome độc lập.

Spec giữ ở một nơi có revision, ticket dẫn đúng mục thay vì copy số liệu sang nhiều bảng. [Review V1](../REVIEW_V1.md) là baseline đã duyệt, không phải đầy đủ chi tiết implementation. Nếu phát hiện thiếu dữ kiện hoặc mâu thuẫn khi planning, đề xuất cách giải quyết kèm impact; không hỏi lại quyết định đã có, không tự đổi thiết kế để làm cho tiện.

## 2. Flow bắt buộc

| Bước | Làm gì / artifact | Điều kiện qua bước |
| --- | --- | --- |
| F0 · Setup | Workflow, skill/instructions, mẫu ticket và draft intent | Tài liệu/link/gate nhất quán; không thực hiện milestone gameplay |
| F1 · Mở planning milestone | User giao milestone cụ thể trong session mới; đọc intent/dependencies và nguồn đã duyệt | Ghi milestone ID, phạm vi session, outcome planning; chưa CODE/ART production |
| F2 · Phân rã chi tiết | Audit code/assets liên quan, tạo ticket con có việc cần làm, output, deps, AC, refs, risk và verify | Coverage đủ scope; không ticket rỗng, không dependency vòng, có thứ tự thực thi |
| F3 · Hoàn thiện specs/targets | Thực hiện task SPEC/CONCEPT được giao; nêu schema/state/timing/geometry/input/UI/art/audio cụ thể theo nhu cầu | Hết TBD chặn implementation; concept/mockup phù hợp được user duyệt đúng scope/revision |
| F4 · Review và khóa specs | Tổng hợp manifest [SPEC_LOCK](SPEC_LOCK.md), đối chiếu mọi milestone thuộc scope phát hành | User xác nhận khóa đúng lock revision sau khi xem artifact cụ thể; không tự khóa từ commit hoặc “all y” cũ |
| F5 · Implementation | Session mới mở ticket cụ thể đã sẵn sàng; dùng task card Harness | Lock còn hiệu lực, dependency đúng, approved refs có thật, ticket được giao; một thay đổi/prompt |
| F6 · Verify/accept | Tests/build phù hợp, actual-vs-target, user visual/playtest; cập nhật handoff | Technical/visual/playtest tách kết quả; dừng checkpoint được giao |

**Gate toàn rework:** hoàn thành planning và khóa specs cho toàn scope release đã thống nhất trước implementation đầu tiên. Không tự thu nhỏ lock còn một subsystem để code sớm; thay scope phải do user chỉ dẫn rõ. Có thể làm các task design-only được giao để hoàn thiện spec/target trước lock; không tạo asset production hoặc sửa runtime dưới nhãn “prototype”, “spike” hay “concept”.

Nếu cần minh họa world mới khi renderer chưa có: concept ghép trên baseline runtime thật, có annotation geometry/camera mới, ghi rõ phần giả lập và phần chưa kiểm. Không coi composite là renderer dungeon đã chạy; không sửa production để lách gate. Artifact chưa chứng minh đủ target thì vẫn chưa qua F3/F4.

## 3. Planning phải chi tiết đến đâu?

Ticket phải đủ để một session mới làm đúng mà không đoán thiết kế. Chọn các mục thực sự liên quan:

- **CODE:** current behavior và call site/file đã audit, state/data contracts, thuật toán/thứ tự sự kiện, input/output, thông số từ spec, lifecycle/pause/save/error, integration boundary; acceptance và focused tests có expected result. Paths chưa audit ghi `UNVERIFIED`, không bịa filename như thể đã tồn tại. Không khóa class/API giả định khi chưa đọc source.
- **CONCEPT:** đối tượng/states cần minh họa, baseline refs thật, scale/camera/viewport, before→candidate, must-match/flexible/must-not-infer, ảnh/mockup phải bàn giao, consistency checks và câu cần user duyệt. Concept là output thiết kế, không runtime asset.
- **ART production:** approved concept/target IDs+revision, danh sách source cần tạo riêng, state/pose/size/pivot/alpha/format, prompt+inputs/provenance, export và cách kiểm; không crop concept làm sprite. Ticket này có thể được lên kế hoạch trước lock, chưa được thực hiện trước gate.
- **UI/input:** màn/state chuyển tiếp, vi/en keys, layout/safe area/touch target, giữ-thả/cancel/fresh-press, keyboard/mouse, resize/blur; không chỉ ghi “làm HUD”.
- **VERIFY:** scenario/seed/build/version, bước vào tình huống, thao tác và expected result, platform/viewport/device thực, evidence phải lưu và coverage chưa kiểm. Không tạo comprehensive QA framework.
- **SPEC/PLAN:** vấn đề cần giải, nguồn đã chốt, artifact cần hoàn thiện, dependency và điều kiện đủ rõ để lock. Có thể đánh dấu NOT APPLICABLE kèm lý do ngắn cho mục không liên quan.

Ngoài chi tiết từng ticket, milestone cần **coverage matrix**: từng requirement Rxx/AC → ticket(s) + spec mục + evidence cần có. Không để việc quan trọng chỉ nằm trong prose hoặc “sẽ bổ sung lúc code”. Ticket VERIFIED/ACCEPTED trước đó chỉ được dùng làm dependency khi evidence đúng revision/scope.

## 4. Trạng thái và mở task

Milestone: `DRAFT → PLANNING → SPEC_READY → LOCKED → IN_PROGRESS → NEEDS_REVIEW → ACCEPTED`. `DRAFT` được tạo trước để giữ intent; không là lệnh bắt đầu. User mở planning không tự mở implementation.

Task: `DRAFT → PLANNED → SPEC_READY → READY → IN_PROGRESS → NEEDS_REVIEW → ACCEPTED`; có thể `BLOCKED / DEFERRED / SUPERSEDED` với lý do. Task SPEC/CONCEPT được giao có thể vào IN_PROGRESS trước global lock để tạo artifact thiết kế; task CODE/ART production/integration chỉ READY sau lock. Ticket “cần làm” không đồng nghĩa “đã được giao làm”.

Một execution session chỉ mở task được user giao và dùng card từ [A-H2](../../combat-v2/TASK_CARD_TEMPLATE.md). Planning ticket có thể điền sẵn nội dung dự kiến cho card; **không tạo card với `APPROVED FOR IMPLEMENTATION` khi chỉ có design approval**. Ghi session scope ở CURRENT; khi xong dừng, không tự chạy sibling ticket hay milestone kế tiếp. User có thể giao một nhóm cụ thể, vẫn thực hiện tuần tự từng thay đổi độc lập và giữ gate từng task.

## 5. Spec lock và đổi thiết kế

Lock manifest bắt buộc có: lock ID/revision, scope phát hành, danh sách milestone/ticket, exact spec/ref revisions + path và hash/commit, source user approval, dependency/coverage audit, unresolved items, điều kiện mở implementation. Với visual task, TARGET phải tồn tại/mở được/approved, không chỉ có mô tả “sẽ tạo art”.

User khóa một revision cụ thể **sau khi** manifest và artifact đầy đủ. Agent chỉ ghi `LOCKED` bằng bằng chứng đó; không nâng trạng thái từ việc hoàn thành checklist kỹ thuật. Approval R01–R12 là input F2/F3, không tự là F4.

Khi đổi ý sau lock: tạo revision/proposal mới, nêu delta, phần supersede, dependency/tasks chịu ảnh hưởng; đánh dấu phần lock liên quan STALE và dừng task phụ thuộc. Giữ lock/approval cũ làm lịch sử. Chỉ tiếp tục sau khi thay đổi được user duyệt và manifest cập nhật/khóa lại đúng scope; không khóa lại toàn bộ phần không đổi một cách máy móc. Không ghi DDR nếu user chưa gọi `$design-decision`; không sửa Art Bible để hợp thức hóa output lệch.

## 6. Handoff giữa session

CURRENT chỉ rõ task/milestone, planning hay implementation, lock revision/trạng thái, nguồn approval, artifacts đã có/còn thiếu, validation, branch/remote và **một next action**. Giữ đầy đủ Q01–Q61/Cxx và lịch sử approval, không thay bằng tóm tắt mất câu hỏi.

Trong session mới: đọc CURRENT → workflow → draft/ticket được giao → lock/spec/ref liên quan → source đúng scope; nạp skill [dungeon-planning](../../../.agents/skills/dungeon-planning/SKILL.md), handoff, và game-art khi có artwork. Nếu chưa được giao mốc/task mới thì giữ trạng thái dừng. Không dùng NEXT ACTION lịch sử hoặc backlog làm quyền tự làm tiếp.

Branch/main/deploy theo scope đã giao: giữ production, không force push, không stage `package-lock.json` có diff trước task. Lượt setup được user cho push branch và tắt máy; không mở PR/merge/main/Pages. Các session sau không suy quyền tắt máy từ lệnh một lần này.
