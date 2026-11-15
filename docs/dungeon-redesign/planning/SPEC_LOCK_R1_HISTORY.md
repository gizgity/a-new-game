# Spec-lock review packet — Dungeon Rework

Lock ID: **DR-LOCK-01 · Lock revision: 0 · NOT_LOCKED** (chưa đủ trình khóa).
Audit packet: **revision1 · 2026-11-15 · AWAITING USER REVIEW / NOT READY TO LOCK**.
Implementation: **NOT AUTHORIZED** · Task hiện tại: [DR-P0-VERIFY-01 rev2](tickets/DR-P0-VERIFY-01.md), audit hoàn tất/closure BLOCKED.
Ngày tạo manifest:2026-11-14 · Audit/index cập nhật:2026-11-15.

User đã duyệt12mục thiết kế và yêu cầu planning trước lock; không dùng “all y” làm bằng chứng đã khóa detailed specs. P0 [plan rev1](DR-P0_PLAN.md) được user “y” duyệt ngày2026-11-15, chỉ kế hoạch điều phối. [Hồ sơ P1/S1 rev2](DR-P1_PLAN.md) APPROVED — PLANNING ONLY qua user “y”,2026-11-15; child execution NONE. User hiện giao **audit toàn rework/coverage/dependencies/specs/approved targets, chuẩn bị spec-lock để review, chưa implement**. P2–P6 chưa mở detailed planning; audit không tự chạy child SPEC/CONCEPT hoặc CODE/ART. Tuân thủ [WORKFLOW](WORKFLOW.md).

## Bàn giao review hiện tại

**Chưa thể cung cấp một spec-lock hoàn chỉnh đủ điều kiện khóa.** Review packet này hoàn tất audit và inventory của artifacts có thật, chỉ rõ phần thiếu; không thay missing thành N/A/approved giả hoặc partial lock P1. Lock revision vẫn0; packet revision1 khác lock revision1. Không đề nghị user khóa bản còn thiếu.

- [DR-P0_CLOSURE rev1](DR-P0_CLOSURE.md): coverage32hàng actual spec/ticket IDs, contract/artifact DAG, approved-target audit và8nhóm blocker L01–L08 có owner/deliverable/cách đóng.
- [DR-P0_LOCK_INVENTORY rev1](DR-P0_LOCK_INVENTORY.md): exact paths/revisions/SHA256/approval của toàn inputs/tickets thật, baseline refs và source hashes;14child P1 rev3 chỉ sửa metadata approval, giữ yêu cầu/deps/AC rev2. Chưa user approval mới cho rev3.
- P0 plan rev1/P1 plan+S1 rev2/PLAN tickets đã approved giữ nguyên bytes; approval planning cũ không bị thu hồi, không nâng thành production readiness. Hash revision2 trước metadata correction được giữ trong snapshot bên dưới và inventory.

Kết luận:2detailed plans(P0/P1),1spec(S1),17tickets(P0×2/P1×15); **0/6spec package SPEC_READY,0TARGET dungeon mới approved**. Cả32coverage rows có owner nhưng chưa đóng trọn chuỗi release spec→tickets→refs/AC. P1 artifact DAG không vòng; full-release DAG/payload consistency **PARTIAL/UNVERIFIABLE phần thiếu**. Không suy full audit PASS từ graph milestone.

| Readiness gate | Kết quả / evidence |
| --- | --- |
| Full scope/baseline/approval trace | PASS về trace; R01–R12/P0/P1 approvals giữ nguyên |
| Detailed plans/tickets/coverage toàn release | FAIL — P2–P6 NONE, S1 release-route/placement closure OPEN; L01–L03 |
| Final spec/state/input/save/error/cross-contract | FAIL / thiếu input để audit final — L01–L08 |
| Approved targets đúng path/rev/hash/scope | FAIL —3P1 IDs chưa có ảnh/metadata/approval; các scope R11 khác chưa có target inventory/tickets; L05 |
| Dependency contract/artifact toàn release | PARTIAL — exact P1 edges ở report§4, actual P2–P6 IDs thiếu |
| Atlas/device/verify/audio/full-loop protocol | FAIL — L04/L08; không đòi runtime measurements trước code |
| Không blocking TBD | FAIL — L01–L08 OPEN, không tự cắt scope để qua gate |
| Exact inventory artifacts hiện có | PASS — inventory; artifact NONE vẫn là missing |
| User lock đúng revision đủ sau review | NONE — chưa đủ trình khóa, approval NONE |

**8nhóm blocker:** L01 detailed P2–P6; L02 release random-route algorithm; L03 K-E/member/envelope/D06/worked placement/budgets; L04 Atlas observation; L05 approved targets; L06 Boss escape↔mod legality; L07 entry/pending/terminal/storage transactions; L08 HUD lanes/input/audio/tutorial/device/full-loop protocol. Chi tiết trace theo từng requirement tại report§3/5. L09 sửa metadata và L10 sửa index đã hoàn tất, không đóng blocker thiết kế.

Runtime/visual actual/device/FPS/latency/audio audition/user playtest **NOT CHECKED**; đây là execution evidence sau code. Phần chặn lock hiện tại là missing specs/targets/protocol/approval, không thiếu runtime chưa được phép tạo. User review packet rev1 không tự khóa specs, approve targets hoặc giao CODE/ART.

## Scope khóa dự kiến

Toàn dungeon/skill rework đã duyệt: P1–P6, kế thừa R01–R11 và R12 amended. P0 điều phối coverage/lock. Không gồm cosmetic/migration/legacy archive, B1 bị dừng, production/main/deploy. Muốn đổi scope khóa phải ghi rõ chỉ dẫn user, không tự bỏ các phần chưa plan để bắt đầu code.

## Baseline thiết kế được duyệt

Artifact: [REVIEW_V1.md](../REVIEW_V1.md), nội dung tại commit `cc6f54c`.
SHA256 file ở commit đó: `E604C6EB353BEABC3DEB45BED0A0CDCCAAAF4036459857602460A7BA3375F713`.
Approval: user “all y”,2026-11-14, hội thoại hiện tại không permalink; R12 có bổ sung flow tại C09 trong [log](../DESIGN_CHECKLIST.md). Hash trên ràng buộc bản đã review, không phải hash bản có banner trạng thái sau ghi nhận approval.

| Milestone | Nguồn baseline | Detailed plan/tickets | Specs/targets cho implementation | Lock state |
| --- | --- | --- | --- | --- |
| DR-P0 | R01–R12 + C09 | PLANNING; [plan rev1](DR-P0_PLAN.md) / [PLAN-01](tickets/DR-P0-PLAN-01.md) ACCEPTED — USER PLAN APPROVAL; [VERIFY-01 rev2](tickets/DR-P0-VERIFY-01.md) audit xong/closure BLOCKED | Coverage32hàng actual IDs và exact inventory đã có; release child/spec/target closures thiếu L01–L08 | NOT_LOCKED |
| DR-P1 | R06/R11/R12 | [Plan rev2](DR-P1_PLAN.md) /15tickets ở plan§5, PLAN-01 rev2 ACCEPTED — USER PLAN APPROVAL,14child rev3 PLANNED (metadata-only correction) | [S1 rev2](specs/DR-P1_WORLD.md) approved planning only; K-W candidate,3target NONE; Atlas/K-E placement/consumer closures còn thiếu (plan§7) | NOT_LOCKED |
| DR-P2 | R01/R06–R10 lát cắt | Chưa có | Pack/AI/input/flask/first Boss contracts chưa chi tiết | NOT_LOCKED |
| DR-P3 | R01–R03/R10–R11 | Chưa có | Skill/support/build transactions/targets chưa chi tiết | NOT_LOCKED |
| DR-P4 | R08/R09/R11 | Chưa có | Boss states/pattern/animation targets chưa có | NOT_LOCKED |
| DR-P5 | R04/R05/R09/R10 | Chưa có | Tree/mod/save/claim schemas/UI targets chưa có | NOT_LOCKED |
| DR-P6 | R10–R12 | Chưa có | Tutorial/audio/UI/device/evidence plan chưa đủ | NOT_LOCKED |

## Manifest phải bổ sung trước khi trình khóa

Mỗi spec/ticket/ref thật có một dòng: ID, path, revision, hash hoặc commit, requirement covered, approval source, dependencies, trạng thái. Không tạo dòng APPROVED cho target chưa tồn tại. Task non-visual ghi refs N/A kèm lý do.

Index chuẩn bị: [plan P0 §3–7](DR-P0_PLAN.md#3-nơi-giữ-spec-và-audit-hiện-trạng) là snapshot owner/spec homes lúc duyệt P0; coverage C01–C32, hợp đồng K-W→K-U, gaps G01–G09 giữ nguyên. Audit được giao đã ghi actual IDs/sections và phần thiếu tại report§3/4/5; exact current hashes ở inventory. S2–S6/P2–P6 detailed tickets và mọi target mới chưa có. **Không phải manifest artifacts đã khóa**. Review P0/P1 hoặc review packet này không tự là user lock.

## Snapshot input P1 revision2 — lịch sử trước audit correction, chưa trình lock

Hash SHA256 input revision2 ngày2026-11-15, trước sửa metadata14child thành rev3. Plan/S1/PLAN-01 giữ nguyên bytes; hash14child bên dưới là **bản lịch sử, không match current revision3**; exact current inventory có prior/current hashes riêng. P1 plan/S1 rev2 đã được duyệt planning qua user “y”,2026-11-15; không artifact nào là approved production spec/TARGET hoặc lock. Source/approval binding tại đầu plan, không giao child execution. Coverage/deps/evidence tại [plan§5–7](DR-P1_PLAN.md#5-task-inventory-và-dependencies) và report; snapshot không tăng lock revision0/readiness.

| Artifact thật | Revision | SHA256 | Status | User content/target approval |
| --- | --- | --- | --- | --- |
| [DR-P1_PLAN.md](DR-P1_PLAN.md) | 2 | `81CEECB8AFAE9EC4BEFDA6106315D8AA752DA5A635A6AEF31A17A8610DDE3563` | APPROVED — PLANNING ONLY | user “y”,2026-11-15 |
| [DR-P1_WORLD.md](specs/DR-P1_WORLD.md) | 2 | `2D58E8E1E0F40520D8877D3EB70E104AAD5AE89F5C25B51DAAA28285A5569740` | APPROVED — PLANNING ONLY | user “y”,2026-11-15 |
| [DR-P1-ART-01.md](tickets/DR-P1-ART-01.md) | 2 | `0AB4AC4470189D52ADBCA030BEB1F85B6C827301403FF55EEDB23D12E28D4B2A` | PLANNED / assignment NONE | NONE |
| [DR-P1-CODE-01.md](tickets/DR-P1-CODE-01.md) | 2 | `68950BED340891A7CC64C5CF657765DCFBC20A98A297D422733C7A04AFD024AE` | PLANNED / assignment NONE | NONE |
| [DR-P1-CODE-02.md](tickets/DR-P1-CODE-02.md) | 2 | `87D836A2C3B5FD9C712AFB1AF9694EC389E276BE3437728F4AF07A759949427E` | PLANNED / assignment NONE | NONE |
| [DR-P1-CODE-03.md](tickets/DR-P1-CODE-03.md) | 2 | `D13731C77C88AE677CBDC3A22653B0434706A15F1DFB716A599481E6BFE7A3E7` | PLANNED / assignment NONE | NONE |
| [DR-P1-CODE-04.md](tickets/DR-P1-CODE-04.md) | 2 | `2E45790C8EDF16D96BDF55CDA046969DEC8552588ADCEB1BD91D3245F197B28A` | PLANNED / assignment NONE | NONE |
| [DR-P1-CODE-05.md](tickets/DR-P1-CODE-05.md) | 2 | `69AE6FD5549F4EB698EC9EE1987FE179FA32ADB0C027052AC539811ADBE81F66` | PLANNED / assignment NONE | NONE |
| [DR-P1-CODE-06.md](tickets/DR-P1-CODE-06.md) | 2 | `FF48F1EE74964088EBA3C7BF7D3CE39E6D7A94D4CD2CBD0870C03AFA4B505682` | PLANNED / assignment NONE | NONE |
| [DR-P1-CODE-07.md](tickets/DR-P1-CODE-07.md) | 2 | `25F79A67F9218C2E3FFECEE083DC11FE3D5A8AB7E3D0980A16F95C3561E7D3FD` | PLANNED / assignment NONE | NONE |
| [DR-P1-CONCEPT-01.md](tickets/DR-P1-CONCEPT-01.md) | 2 | `23CF7DC19C680A8A5BC41A52C6C99FCC034B0E6B275E1E21DF301ED15907F5B8` | PLANNED / assignment NONE | NONE |
| [DR-P1-CONCEPT-02.md](tickets/DR-P1-CONCEPT-02.md) | 2 | `8AB516B6C84C0C95EC91AD8C415551CFD212C82965E208D009B64D3D955E49CE` | PLANNED / assignment NONE | NONE |
| [DR-P1-CONCEPT-03.md](tickets/DR-P1-CONCEPT-03.md) | 2 | `3F656ED97EAA8474D60C1BAA92A3627C39799BA5578CCE58AF8479B8C0778270` | PLANNED / assignment NONE | NONE |
| [DR-P1-PLAN-01.md](tickets/DR-P1-PLAN-01.md) | 2 | `69F8410BDBB67A29F5F33CFF5391A193E14BBA854E92A2EE34212DA5BDFDCBA1` | ACCEPTED — USER PLAN APPROVAL | user “y”,2026-11-15 |
| [DR-P1-SPEC-01.md](tickets/DR-P1-SPEC-01.md) | 2 | `0D7FF5DCACD50F890E43CFBF76FD14CAB2750BDCB363B1F4519F50113630D9D7` | PLANNED / assignment NONE | NONE |
| [DR-P1-VERIFY-01.md](tickets/DR-P1-VERIFY-01.md) | 2 | `FEEA3359DAD68671B8D35BD21734678C2C9E4D0FE96F03F89E6F52C41B3A69A2` | PLANNED / assignment NONE | NONE |
| [DR-P1-VERIFY-02.md](tickets/DR-P1-VERIFY-02.md) | 2 | `DE75605708F5BC7B83AE8A682596A97726AF16E0D2B9B5388DE52E2C714281B3` | PLANNED / assignment NONE | NONE |

TARGET `DR-ENV-T01`, `DR-CAMERA-T01`, `DR-MINIMAP-T01`: **NONE / path chưa có / revision NONE / hash NONE / approval NONE**. Baseline images/hashes/rights trong plan§2 không được nâng thành dungeon TARGET. Các targets actor/rarity/skill/Boss/HUD/build/tree/result/error khác chưa có ID/path/revision/approval, owners P2/P3/P4/P5/P6 theo R11; không tự điền target giả để đủ manifest. S2–S6 và actual tickets P2–P6 vẫn chưa có; closure P1 Atlas/K-E envelopes+budget/K-B legality/K-X entry/K-U lanes/device còn OPEN. Khi đổi candidate artifact phải cập nhật hash đúng revision trước review/lock, không giữ hash cũ như thể match.

## Lock checklist — chưa đủ điều kiện đánh dấu hoàn tất

- [ ] Mọi milestone thuộc scope có detailed plans và task tickets đầy đủ, không requirement mồ côi.
- [ ] Spec/data/state/input/geometry/timing/save/error/integration rõ cho từng thay đổi cần implement.
- [ ] Visual targets đúng scope có thật, mở được, có user approval và binding theo Reference Protocol.
- [ ] Dependency spec khác dependency implementation, không vòng lặp hoặc hidden prerequisite.
- [ ] Gap Atlas/reference, device/verify plan đã có cách kiểm cụ thể; không claim đã đo runtime trước khi chạy.
- [ ] Không blocking TBD/xung đột; nội dung hoãn phải được user đồng ý và cập nhật scope, không tự loại.
- [ ] Coverage/consistency audit và bằng chứng đủ để user review trọn manifest.
- [ ] User xác nhận khóa đúng lock revision sau khi artifact cụ thể hoàn tất.

## Approval record

Lock approval quote/date/source: **NONE**.
Approved lock revision: **NONE**.
Implementation session/task assignment: **NONE**.

Khi đóng L01–L08 và audit toàn release đủ: **lập lock manifest revision1 đầy đủ để user review trước**, bind exact specs/refs/tickets/hashes và nguồn approval. Chỉ ghi LOCKED sau user xác nhận đúng revision cụ thể; lưu lịch sử revision0 bằng git khi được giao commit. Đổi sau lock phải có delta/impact/supersedes/re-approval theo workflow, affected bindings STALE; không tự DDR/Bible. Không tự đánh dấu LOCKED từ việc tạo packet hoặc được duyệt audit.

**ONE NEXT ACTION: User review audit packet rev1 và findings L01–L08; dừng chờ giao planning/design-only đóng gap, chưa implementation.**
