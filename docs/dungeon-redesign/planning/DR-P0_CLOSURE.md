# DR-P0 — Audit planning toàn rework và readiness spec-lock

Audit ID: **DR-P0-VERIFY-01 · Revision 2 · 2026-11-15**. Báo cáo revision1.
Phase: **lock-readiness review**, chỉ tài liệu. **AUDIT COMPLETE / CLOSURE BLOCKED**.
Manifest: [DR-LOCK-01 rev0 / audit packet rev1](SPEC_LOCK.md), **NOT_LOCKED / NOT READY TO LOCK**.

## 1. Yêu cầu, outcome và giới hạn

User ngày2026-11-15, hội thoại hiện tại không permalink:

> Rà soát planning toàn rework. Kiểm coverage, dependencies, specs và approved targets. Chuẩn bị bản spec-lock hoàn chỉnh để t review; chưa implement.

Yêu cầu này mở audit toàn release theo [ticket closure](tickets/DR-P0-VERIFY-01.md), supersede điểm dừng chờ giao audit ở CURRENT trước. Không mở planning chi tiết P2–P6, thực hiện SPEC/CONCEPT con hoặc tự chọn thiết kế để lấp gap. Review package chứa toàn bộ kết quả audit, inventory bản thật/hash/approval, requirement thiếu và điều kiện đóng. **Chưa có đủ artifact để cung cấp một bản spec-lock hoàn chỉnh đủ điều kiện khóa**; không chuyển phần thiếu thành N/A hoặc xin user khóa một manifest thiếu.

Scope giữ nguyên P1–P6/R01–R12 amended; P0 điều phối. Không runtime/asset/concept/source production, tuning, DDR/Bible/Harness, commit/push/main/Pages. P0 plan rev1 và P1 plan/S1 rev2 approved planning giữ nguyên nội dung/bytes. Chỉ sửa metadata approval lỗi thời trong14ticket con P1 (revision3, không đổi yêu cầu/deps/AC); ticket audit lên revision2. Revision3 chưa có user approval mới, không được gán approval nội dung rev2 sang cả file mới.

## 2. Kết luận và số đếm audit

| Hạng mục | Kết quả thực tế | Ý nghĩa đối với lock |
| --- | --- | --- |
| Baseline R01–R12 | 12/12 Approved Design V1 tại C09, R12 amended | Giữ nguyên, không hỏi lại; không là detailed spec lock |
| Detailed plans | 2: P0 rev1, P1 rev2; P2–P6 NONE | 5 milestone thiếu detailed planning |
| Specs | 1: S1 rev2 approved planning only; S2–S6 NONE | 0/6 spec package SPEC_READY; S1 còn blocking OPEN |
| Tickets có thật | 17: P0×2 + P1×15 | 2 PLAN accepted planning,14child P1 PLANNED/unassigned,1audit P0 BLOCKED closure |
| Coverage C01–C32 | 32/32 có owner dự kiến; 0/32 đóng đủ chuỗi release spec→tickets→refs/AC | Owner coverage khác implementation readiness; các lát cắt P1 hiện có trong §3 |
| TARGET mới approved | 0; P1 có3ID dự kiến nhưng path/revision/hash/approval NONE | Không dùng floor/actors/crowd cũ thay target dungeon |
| Contract DAG | Thứ tự candidate hợp lý, không cần runtime để planning | Chưa đủ payload/revision để xác nhận final cross-contract consistency |
| P1 artifact DAG | Không vòng; exact edges §4 | Release DAG chưa thể audit trọn vì thiếu tickets P2–P6 |
| Device/audio/full-loop protocol | R12 có mục tiêu; chưa S6/device-browser/method cụ thể | Protocol thiếu chặn lock; measurements/user acceptance sau code không chặn planning |

“0/32 closed” là đánh giá completeness của **toàn requirement**, không phủ nhận nội dung S1 đã được duyệt planning. Không dùng tỷ lệ đó để yêu cầu duyệt lại R01–R12 hoặc P0/P1.

## 3. Coverage thực tế C01–C32

Cxx là coverage IDs của [P0§4](DR-P0_PLAN.md#4-coverage-matrix-toàn-release), không Cxx của log. S1=[spec có thật rev2](specs/DR-P1_WORLD.md); S2–S6 là **homes dự kiến** ở P0§3, chưa có file/section. `P1-*` dưới đây là IDs thật có prefix `DR-`; `NONE` là chưa có child ticket, không task ID mới. Evidence là **phải có để đóng**, chưa claim đã thực hiện.

| Coverage / baseline | Spec thực / ticket thực | Phần còn thiếu trước lock và evidence cần có |
| --- | --- | --- |
| C01 R01 active catalog | S3 NONE / NONE | State/input-output/commit/cancel riêng A1–A8; tickets đủ8hành vi, trace timing/interrupt |
| C02 R01/R10 aim/input | S1§5/7/10; P1-CODE-02/03, VERIFY-01/02 (geometry slice) | K-A selector sticky/override/range/LOS/invalid/ground/channel, K-U gesture/flush; input matrix hai nền tảng + layout target |
| C03 R02 compatibility | S3 NONE / NONE | Resolver9×8, ownership3-2-2, chuyển bản/invalid; expected compatibility cases |
| C04 R02/R09 proc/caps | S3 NONE / NONE | Hit/volley/echo identity, xuyên→chain/caps/damage batches/unique kill; worked event traces |
| C05 R03 build transactions | S3 NONE / NONE | Bag/slot/CD/material/salvage/upgrade/validation/error trong đúng cửa sổ; pre/post ledger |
| C06 R03/R10 offers | S3/S5 NONE / NONE | Starter/offer RNG/snapshot/pool nhỏ/phụ2/17draft và pending; ledger/reload cases |
| C07 R04 meta/unlocks | S5 NONE / NONE | 9unlock/banking/ceil/full catalog/purchase và snapshot catalog; claim ledger |
| C08 R04/R09 Ascension | S5/S3 NONE / NONE | Unlock0–4/select/highest-cleared/scaling/parity; state/formula worked cases |
| C09 R05 modifiers | S5 NONE / NONE | 22mods/count/value/lifetime/caps/rounding/generator/no-zero-all-paths; seed→preview→delta+0 |
| C10 R05/R08/R09 legality | S1§4/10 room envelope; P1-CODE-01/02 (world slice) | K-B pattern/escape + K-X cumulative mod legality; bảng max-roll hợp lệ/loại và lối né thực trong room |
| C11 R06 Atlas/density | S1§3/4/11 + P1 plan§4; P1-SPEC-01, CODE-01, VERIFY-01/02 | Memo footage quan sát, K-E composition/envelopes/D06, annotated placement; release random routes còn OPEN |
| C12 R06 route/progress | S1§2–6; P1-CODE-01/02/04, VERIFY-01 | K-E weights/member IDs/kill batching/two bars và worked feasibility/main budgets, không chỉ pack-count ratio |
| C13 R06/R11 camera/fog | S1§6–8; P1-CONCEPT-02/03, CODE-03/04/05/07, VERIFY-02 | CAMERA/MINIMAP targets + K-U lanes; viewport/state/corner table trước lock, actual compare sau code |
| C14 R07 roster/rarity/affix | S2 NONE / NONE | Roles/leader/escort rounding/affix compatibility/hazards/blue escort passive; cue/rarity crowd targets |
| C15 R07 AI | S1§5/10; P1-CODE-02, VERIFY-01 (query slice) | K-E aggro/share/leash/HP/admission budget/lifecycle/invalidation; trace nhiều bầy/NO_PATH/leader death |
| C16 R07–R10 flask | S2/S4/S5 NONE / NONE | Kill ownership/fractional charge/HoT/refresh/fullHP/pause/batch/reward refill; timeline expected |
| C17 R08 regular Bosses | S1§4–6/10; P1-CODE-02/04/07 (boundary slice) | K-B3Boss×3patterns, attack order/snapshot/geometry/escape; pose/cue targets và roster assignment K-X |
| C18 R08 final | S4 NONE / NONE | 2pha/threshold/1.4s presentation-only clock/combo new cue; transition/pattern targets + clock timeline |
| C19 R08/R10 adds/outcome | S1§6/10; P1-CODE-04/07 (gate slice) | K-B queue75/50/25/cap/spacing/cleanup/death batch và K-X bank handshake; simultaneous death không refill/reward |
| C20 R09 scaling | S3/S5 NONE / NONE | Typed stat buckets/level/depth/Asc/mod caps/shield/slow/HP ratio, worked formulas; không copy số giữa specs |
| C21 R09 power feel | S6 NONE / NONE | Scenario yếu/mạnh/node bất lợi, observation plan không ép DPS/winrate; user feel sau runtime |
| C22 R10 tree | S5 NONE / NONE | 9nấc/2–3node/1–2edges/no-dead-end/preview/lock siblings; generator/state/tree target |
| C23 R10 persistence | S1§2/3/8/10; P1-CODE-07, VERIFY-01 (session slice) | K-X schema/version/entry/pending/terminal/claim/atomic write/retry/corruption; explicit failure/reload ledger |
| C24 R10 isolation/legacy | S1§1/10; P1-CODE-07, VERIFY-01 (entry slice) | P5/P6 namespace/settings allowlist/legacy call-site removal; production saves giữ nguyên, không migrate |
| C25 R10 UI/lifecycle | S1§7/8; P1-CODE-03/05/07, VERIFY-02 (world slice) | S6 toàn screen/input/vi-en/error/pause/fresh-press và S3/S5 content contracts; targets ngoài world |
| C26 R10 tutorial/audio | S6 NONE / NONE | 3hint/Skip; progress/aggro/phase→music/mix/duck/transport/blur/hitstop; audition protocol và approval đúng scope |
| C27 R11 actors/rarity | P1 plan§2 baseline inventory; child target tickets NONE cho P2/P3/P4 | Actor state/role/rarity/Boss target inventory + source/rights/state mappings, reuse không cấp approval state mới |
| C28 R06/R11 environment | S1§3/9; P1-CONCEPT-01, ART-01, CODE-01/06, VERIFY-02 | Ba biến thể kiến trúc+release-route algorithm/targets/source export sheet; fixture808 không đóng release diversity |
| C29 R11 skill/glyph/UI | S1§7–9; P1-CONCEPT-02/03, CODE-05 (minimap slice) | 8skill VFX families/17new glyphs+3reuse; HUD/build/tree targets và vi/en/lifecycle; không22mod icons tự thêm |
| C30 R12 input/device | S1§5/7/11; P1-CODE-02/03/07, VERIFY-01/02 | S6 device/browser/method/tick-event-feedback protocol/full matrix; target44CSSpx/safe-area/touch-desktop parity |
| C31 R12 crowd/performance | S1§7/9/11; P1-CONCEPT-01/02/03, VERIFY-02 (visual slice) | S2/S3/S4 scenarios30–60/80/120, S6 device60s avg/p95/method; không dùng ảnh33mobs làm FPS proof |
| C32 R12 amended lock/accept | P0 plan§4–8; P0-VERIFY-01, P1-PLAN-01 + manifest | Detailed toàn release, approved targets, exact manifest/approval; S6 full9node/reload/death/end/final scenarios |

## 4. Dependencies: phần kiểm được và phần còn thiếu

### Hợp đồng spec

Giữ thứ tự đã duyệt planning: **baseline → K-W(P1) → K-A(P3) → K-E(P2) → K-B(P4) → K-X(P5) → K-U(P6)**. Đây là thứ tự soạn **candidate contracts**; feedback closure trả về revision trước lock, không cạnh phụ thuộc runtime. Không tuyên bố final DAG/payload audit PASS khi K-A…K-U chưa tồn tại.

| Producer→consumer | Output đã có | Điều kiện phải đối chiếu trước lock |
| --- | --- | --- |
| K-W→K-A/E/B/X/U | S1§2–10 candidate, approved planning | Consumer pin units/radii/zone/LOS/identity/error semantics; S1 final không OPEN release generation |
| K-A→K-E/B/X/U | NONE | Action origin/range/commit/cancel/cadence/channel, stat snapshot/hit/kill identity, offers/build payload |
| K-E→K-W closure/B/X/U | NONE | Roster/member collider/offset/envelope/placement-order, kill/progress/flask/aggro/entry batch; P1 worked placement nhận đúng version |
| K-B→K-W closure/X/U | NONE | Room/pattern/add safe positions/escape-envelope, freeze clocks/cleanup/whole damage batch outcome; không bank từ Boss controller |
| K-X→K-W/A/E/B closure/U | NONE | Seed/catalog/mod snapshot/entry/pending/terminal IDs, atomic settlement/error/retry/refill ordering; không claim từ UI/render |
| K-U→K-W/targets closure/A/E/B/X | NONE | Actual playRect/lanes/safe-insets/screens/input flush/audio/verify device protocol; không sửa camera chỉ để vừa HUD |

Bốn walkthrough chặn final consistency: **camera↔HUD**, **geometry Boss↔cumulative modifier legality**, **offer RNG↔pending persistence**, **damage batch→alive check→cleanup/bank/refill/pending→single storage commit**. Hiện chỉ invariant baseline và phía S1 có nội dung; chưa có payload/field/error traces consumer. Đặc biệt storage fail không được để clear/refill/UI tự nhận thành công trước commit, terminal death không undo; đây là yêu cầu kiểm K-X tương lai, chưa chọn schema mới.

### Artifact DAG P1 thực có

IDs ở đây đều có prefix `DR-P1-`. Dependency edges đọc từ ticket, không suy code consumer là prerequisite để planning:

| Consumer | Artifact prerequisites trong P1 |
| --- | --- |
| PLAN-01, SPEC-01, CONCEPT-01, CONCEPT-02 | Không nội bộ; baseline/source/assignment, closure contracts ngoài bảng |
| CONCEPT-03 | CONCEPT-02 slot candidate |
| ART-01 | CONCEPT-01 approved + global lock |
| CODE-01 | SPEC-01 closure + K-E spec/placement data + global lock |
| CODE-02 | CODE-01 |
| CODE-03 | CODE-01 + CONCEPT-02 approved |
| CODE-04 | CODE-01/02 |
| CODE-05 | CODE-03/04 + CONCEPT-03 approved |
| CODE-06 | CODE-01/02/03 + ART-01; gate state từ CODE-04 khi ghép CODE-07 |
| CODE-07 | CODE-01…06 + approved targets/ART kit |
| VERIFY-01 | CODE-07 + annotated K-E input; actual action/Boss/save cases chuyển consumer |
| VERIFY-02 | CODE-07 + VERIFY-01 relevant results + approved targets |

Không vòng ở graph này. Các task vẫn chưa được giao. Global lock/spec/target là prerequisites trước CODE/ART; runtime tests/actual-vs-target là outputs sau implementation. S6 plan phải định thiết bị/phương pháp trước lock, measurements thật sau code. Release implementation graph cần actual P2–P6 IDs (core actions/Boss slice/reward persistence dependencies), chưa được phép chấm PASS chỉ từ mũi tên milestone P1→P2→P3.

## 5. Findings và cách đóng

| ID / mức | Finding có evidence | Owner / deliverable để đóng | Chặn |
| --- | --- | --- | --- |
| L01 BLOCKING | P2–P6 chỉ draft intent; không plan/spec/child tickets thật | User giao planning theo P0 order P3→P2→P4→P5→P6; mỗi mốc có spec một nguồn/tickets/coverage/AC/source audit | C01–C32 release completeness |
| L02 BLOCKING | S1§3 chỉ định fixture topology×8; release graph/route diversity chưa có giải thuật | P1 design-only spec closure; cần task SPEC riêng được giao, actual ticket hiện NONE. PLAN-01 đã accepted; CODE-01 là consumer sau lock, không phải nơi thiết kế muộn | K-W final/C11/C12/C28 |
| L03 BLOCKING | S1§4 có worked counts, chưa collider/offset/envelope/placement feasible | P2 K-E spec + P1 worked coordinate/envelope/gap/budgets ở45–70/D06cap/depth/Asc; ticket sản xuất closure hiện NONE ngoài owner planning | K-W/K-E/C11/C12/C14/C15 |
| L04 BLOCKING | P1-SPEC-01 chỉ planned; memo/timestamp/observed-vs-inferred chưa có | Giao SPEC-01 design-only, tạo actual Atlas reference memo theo plan§4; không cần runtime để đếm footage | G01/C11 |
| L05 BLOCKING | 3P1 target paths chưa có; các scope R11 khác chưa có target inventory/tasks | P1-CONCEPT-01…03 + P2/P3/P4/P5/P6 concept tickets khi planning được giao; A3 metadata/scale/binding/rights/approval thật | C13/C17/C18/C25/C27–C31 |
| L06 BLOCKING | K-B room/escape/mod combinations và K-X legality chưa có | P4 patterns/escape spec + P5 legal rolls table trên room S1; delta scope nếu conflict, không tự nới room/nerf/cắt mod | C10/C17–C19/C22 |
| L07 BLOCKING | K-X serialized transactions chưa có; S1 chỉ identity/hooks | P5 seed/entry/pending/terminal/version/claim/schema/error UX, worked reload/write-fail/simultaneous-death cases | C05–C09/C16/C19/C22–C24 |
| L08 BLOCKING | Camera/minimap công thức chưa chốt lanes; R12 chưa device/browser/method; tutorial/audio mới baseline | P6 K-U spec/targets + protocol devices và input/FPS/audio/full-loop scenarios; closure lại S1 targets | C02/C13/C21/C25/C26/C29–C32 |
| L09 FIXED — metadata | 14child P1 ghi `S1/3target/P1 plan mới NONE`, trái approval rev2 ở plan/S1/PLAN-01; vài đoạn ghi `S1 chưa approved` | Sửa metadata revision3, ghi planning approval hiện có; target/spec-readiness vẫn NONE/NOT READY. Không đổi số/deps/AC | Tránh mất approval hoặc gán sai readiness |
| L10 FIXED — index | Manifest cũ chỉ inventory P1; status indices vẫn nói closure chưa giao | Audit packet có hash toàn docs inputs/tickets, baseline refs/source-check, coverage/deps/targets/missing/approval; CURRENT/index cập nhật audit được giao | Traceability tài liệu; không tự đóng L01–L08 |

L01–L08 là8nhóm blocker, có giao nhau; không cộng thành số requirement độc lập. Không tự tạo ticket rỗng/approved giả cho các chỗ `NONE`. Trước lock cần owner chuyển các gap thành task cụ thể trong planning được giao và trả artifacts, rồi audit lại phần thay đổi. Approval R01–R12/P0/P1 đã có giữ nguyên; chỉ design delta mới cần user chốt đúng scope.

## 6. Approved targets / references

| Scope | TARGET/ref thực tế | Binding và kết luận |
| --- | --- | --- |
| Biome/module/gate/3architectures | DR-ENV-T01, path/rev/hash/approval NONE | CONCEPT-01 planned; source sizes/pivots/alpha/occlusion export sheet chưa có |
| Camera/playRect/corners | DR-CAMERA-T01, path/rev/hash/approval NONE | CONCEPT-02 planned; final K-U chưa có; stills không chứng minh smoothing/input/FPS |
| Minimap fog/marker/vi-en | DR-MINIMAP-T01, path/rev/hash/approval NONE | CONCEPT-03 planned; slot/glyph metadata/state board chưa có |
| Enemy rarity/affix/new actor states | NONE, chưa target ID/ticket thật | P2/P3 owners; accepted Q7C identity không approve marker/pose mới |
| 8skill families/17glyphs/3reuse | NONE, chưa target ID/ticket thật | P3 và P6 shell; phải ánh xạ state/event/geometry đúng catalog, không thêm22mod icons |
| 3regular Boss + final2phase | NONE, chưa target ID/ticket thật | P4; Chain Warden reuse identity, đòn mới vẫn cần đúng targets |
| HUD/build/tree/catalog/result/error | NONE ngoài3P1 IDs dự kiến | P3/P5 content + P6 shell; full viewport/vi-en/touch/keyboard/safe area |
| Audio/tutorial | Baseline direction, chưa mapping/audition spec | P6; không buộc ảnh TARGET cho non-visual logic hoặc thêm gate visual giả cho audio |

Baseline floor/Q7C crowd và atlas/metadata file paths/hash kiểm lại trong manifest. **Baseline bindings/hashes PASS không là review artwork bằng mắt trong lượt này**; không tạo ảnh hoặc tự cấp user visual approval. Q7C desktop screenshot là1440×900, không1440×1000. Concept/new targets phải được mở/check khi có thật, theo game-art/A3. Đường dẫn output dự kiến trong tickets không được tính là broken link hoặc artifact đã tồn tại.

## 7. Spec-lock checklist và approval

| Điều kiện | Audit hiện tại |
| --- | --- |
| Full scope, baseline revisions/approval rõ | PASS về ranh giới và trace baseline |
| Full detailed plans/tickets/requirement closure | FAIL — L01–L03, coverage§3 |
| Specs final/contracts/cross-spec consistency | FAIL / UNVERIFIABLE phần thiếu — L01–L08 |
| Approved targets hiện hữu/revision/hash/scope | FAIL — L05, không có TARGET mới |
| Dependencies full release không vòng/không hidden prerequisite | PARTIAL — P1 DAG kiểm được, P2–P6 chưa có |
| Device/input/audio/full-loop verification plan cụ thể | FAIL — L08; runtime metrics NOT CHECKED đúng stage |
| Exact inventory artifacts hiện có | PASS — manifest; chưa biến thành full implementation manifest |
| Không blocking TBD và user lock đúng revision | FAIL — L01–L08; lock approval NONE |

**User chỉ đang review audit packet rev1; không đề nghị khóa DR-LOCK-01 rev0.** Chỉ khi các gap đóng đủ mới lập lock manifest revision1 đầy đủ, kiểm exact bytes/revisions/target approvals và trình user khóa đúng bản. “Duyệt audit” hoặc “y” cho báo cáo này không tự thành spec lock, target approval, CODE/ART authorization hay scope reduction.

## 8. Validation và điểm dừng

Audit tài liệu: đọc R01–R12/C09, P0/P1 plans, S1 và17tickets, workflow/lock/template/Harness/A3/A-H2; đối chiếu32coverage IDs với spec sections/tickets thật và dependencies. **PASS:**28file Markdown,300local links/39anchors,46current artifact hashes,32coverage rows không trùng/thiếu,15node P1 DAG không vòng. Reverse metadata correction của14child tái tạo đúng SHA256 input rev2; không đổi requirements/deps/AC.3approved P1 plan/S1/PLAN-01 hashes khớp snapshot input, approved Review hash tại cc6f54c đúng; protected tracked paths không có diff, package-lock hash giữ nguyên. P0 plan/PLAN-01 không sửa. git diff --check PASS; không dùng toàn diff HEAD của status docs làm diff riêng task vì working tree đã có thay đổi trước audit.

Không build/typecheck/tests game; không Atlas footage research mới, concept/artwork mới, runtime/device/FPS/latency/audio audition/full-run/user playtest. Không claim UI/geometry feasibility/visual quality đã PASS. Technical docs validation khác completeness spec-lock; kết quả audit hoàn tất, closure milestone **BLOCKED** vì artifacts chưa có; user review **AWAITING USER**.

**ONE NEXT ACTION: User review audit packet rev1 tại SPEC_LOCK.md và findings L01–L08; dừng chờ giao planning/design-only để đóng gap, không mở implementation.**
