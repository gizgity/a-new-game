# A-H4 — Design Harness Compliance Dry Run

Ngày: 2026-11-12. **A-H4: PASS (dry run tài liệu); Gate A: READY FOR USER REVIEW.** Chưa có user nghiệm thu A-H4 hoặc Gate A approval. DỪNG tại A-H4; B1 chưa mở.

## 1. Phạm vi, phương pháp và phiên bản

Nguồn giao việc: user, “TASK A-H4 — Design Harness Compliance Dry Run”, hội thoại hiện tại, không permalink. Chỉ kiểm quy trình và sửa lỗi tài liệu rõ ràng; không code/gameplay/balance/assets/preview/build configuration, không ảnh production, không dependency/test framework/deploy; không sửa ART_BIBLE hoặc DESIGN_DECISIONS.

Điểm bắt đầu: `785ec7cd8141d4dc46088e20e3de860edb7995c2`, working tree sạch. Fetch xác nhận origin/main cùng revision trước sửa. Phiên bản sau sửa là các file trong cùng commit chứa báo cáo này; thay đổi giới hạn ở mục 4. Workflow handoff đã đọc: `.agents/skills/handoff/SKILL.md`.

| Tài liệu đọc | Phiên bản/approval xác minh lúc bắt đầu | Kết quả đối chiếu |
| --- | --- | --- |
| [AGENTS.md](../../AGENTS.md) | HEAD trên, A-H3 `1630896` | Mục Combat Experience V2 bắt đọc Harness, spec/ref, STOP và Gate A; đã linked |
| [HANDOFF.md](../../HANDOFF.md) | CURRENT trên cùng: A-H2 APPROVED; `785ec7c` | Ưu tiên hơn mọi CURRENT/NEXT ACTION lịch sử phía dưới; A-H4 chưa chạy/nghiệm thu |
| [MASTER_PLAN.md](MASTER_PLAN.md) | Mục 6: A-H1 Rev2, A1 Rev1, A2 Rev1, A3 v1, A-H2 v1 approved/accepted; A-H3 linked | Bảng đúng, một số đoạn prose lỗi thời (mục 4) |
| [HARNESS.md](HARNESS.md) | A-H1 APPROVED Rev2; “ok, làm tiếp đi”, 2026-11-12 | Contract đã chốt; còn một dòng tiến độ cũ |
| [TASK_CARD_TEMPLATE.md](TASK_CARD_TEMPLATE.md) | A-H2 APPROVED v1; “uh chốt h2”, 2026-11-12; `d2d2b4a` | Mẫu đủ scope/ref/approval/AC/evidence/handoff, không phải B1 đã mở |
| [REFERENCE_PROTOCOL.md](REFERENCE_PROTOCOL.md) | A3 APPROVED v1; “ok, tiếp đi”, 2026-11-12; `122b2c9` | Protocol được duyệt, không phải ref B1; cuối file còn nhãn H2 cũ |
| [EXPERIENCE_VISION.md](EXPERIENCE_VISION.md) | Rev1; file ghi PROPOSED nhưng Master Plan/Handoff ghi user “phần này thì được r á”, 2026-11-12 | A1 đã USER ACCEPTED; cần đồng bộ nhãn, không thay thiết kế |
| [DESIGN_BIBLE.md](DESIGN_BIBLE.md) | A2 APPROVED Rev1; “ok tiếp đi”, 2026-11-12 | Creative direction, chưa approve production; cuối file còn tiến độ cũ |
| [ART_BIBLE.md](../../ART_BIBLE.md) | Baseline audit 2026-10-26, Q7A–Q8C accepted | Đọc camera/style/palette/animation và quy trình đổi direction; giữ nguyên file |
| [DESIGN_DECISIONS.md](../../DESIGN_DECISIONS.md) | Registry DD-0001–0003, Approved/design scope riêng | Đọc rules/supersedes; không có approval B1/Gate A; giữ nguyên file |

Các quote approval trên là nguồn đã được lưu trong repo, không có permalink hội thoại gốc; lượt này không tự tạo approval. Lịch sử “chưa enforce/chưa duyệt” chỉ có giá trị ở revision cũ.

**Phương pháp:** bốn fixture độc lập, mỗi fixture bắt đầu lại từ input riêng; lần 1 dò điều khoản và xung đột, sửa lỗi tài liệu, lần 2 đọc lại toàn bộ TC và audit sau sửa. “Actual” dưới đây là quyết định/kế hoạch Codex đã ghi bằng văn bản trong dry run, không phải kết quả implementation. PASS chỉ chứng minh có thể dẫn điều khoản nhất quán để xử lý fixture. Mọi tuân thủ khi code, chất lượng ảnh, runtime và user acceptance thực tế đều **NOT VERIFIED**.

Mọi ID bắt đầu `SIM-`, ref, approval và đường dẫn giả lập ở mục 2 đều là dữ liệu văn bản, không phải task/ref/approval thật; không tạo file/folder cho chúng. Giả định ảnh có thể mở chỉ là tiền đề TC-02, không ghi PASS cho việc load ảnh thật.

## 2. Bốn test case — kết quả sau sửa

| TC | Input giả lập | Expected | Actual ghi nhận trong dry run | Evidence quyết định | Kết quả / lý do |
| --- | --- | --- | --- | --- | --- |
| TC-01 | `SIM-01`, B1 Player Base có goal/scope; spec Rev1 PROPOSED; target NONE; approval NONE; yêu cầu implement | STOP trước production; liệt kê thiếu spec/ref/approval; có thể design-only | STOP G3; thiếu approved spec Rev1, TARGET được duyệt đúng version và user approval gắn scope. Không code/asset; ghi câu trả lời ở 2.1 | Harness §1.2–3, §4 G1–G3 và đoạn design-only, §5; Reference §3/7; Template rules 1–2 | **PASS** — chặn implementation, không chặn việc chuẩn bị proposal |
| TC-02 | `SIM-02`, chỉ Player Base; spec Rev2/target v2/scope/approval hợp lệ; Gate A và mở task hợp lệ **chỉ trong fixture**; AC/evidence đầy đủ; không gameplay | PASS điều kiện implementation; chỉ lập kế hoạch, xác định file/phần IN/OUT/checks/ref comparison | G0–G3 đủ theo giả định; lập kế hoạch giới hạn ở 2.2, không thực thi G4–G6 | Harness §4 G0–G6, §6–8; Reference §3/5/6; Template §1/3–7, rules 2–4/6–7; Master Plan §2 Gate A, §7a | **PASS** — kế hoạch đáp ứng nhánh hợp lệ; code/visual/runtime thật NOT VERIFIED |
| TC-03 | `SIM-03`, chỉ Player Base đã được duyệt; phát sinh animation, hitbox, camera, balance | STOP phần vượt scope; proposal/approval riêng; không mở rộng B1 | Bốn phần phát sinh bị chặn; chỉ phần Player Base độc lập mới được giữ trong kế hoạch, nếu phụ thuộc thì BLOCKED toàn implementation (2.3) | Harness §1.1/5, §4 G4, §5; Template rules 3/5; Experience §5; Reference §5 | **PASS** — không dùng approval Player Base để sửa hệ khác |
| TC-04 | `SIM-04`, baseline top-down ¾/4 hướng; user muốn góc nhìn/style khác; chưa target mới approved | Không bác vì baseline; không tự implement; ghi candidate/supersedes/impact/gaps/approval | Ghi proposal PROPOSED ở 2.4; STOP production, giữ lịch sử; không sửa Bible/DDR | Harness §2–3/5; Reference §5/7; Design Bible §2/6; AGENTS mục V2 và Design memory; Art Bible mục Update; DDR rules | **PASS** — baseline có thể thay, approval và scope vẫn bắt buộc |

### 2.1. TC-01 — phản hồi giả lập

“STOP implementation Player Base: spec Rev1 còn PROPOSED; chưa có TARGET với ID/path/revision/nguồn/binding hợp lệ; chưa có bằng chứng user duyệt đúng spec + target + scope. Chuẩn bị spec/ref proposal ở trạng thái PROPOSED để xin duyệt là design-only; không tạo production asset hoặc tích hợp. Ở repo thật Gate A cũng chưa được user duyệt, B1 chưa mở.” Không tự lấy ảnh baseline làm target mới. Next action giả lập: hoàn thiện bộ design/reference để trình user, trong task design đã được cho phép; không tự mở task B1 thật.

**Kiểm xung đột:** Reference §7 và Harness §4 đều cho design-only khi chưa target, cùng chặn implementation. Các nhãn approval lỗi thời liệt kê ở mục 4 đã đồng bộ; không còn hướng dẫn ngược nhau cho TC này.

### 2.2. TC-02 — input và kế hoạch implementation hoàn toàn giả lập

Input đầy đủ bằng văn bản:

- Task `SIM-02`, IMPLEMENT, outcome duy nhất: thay phần body silhouette Player Base theo target, giữ nguyên cơ chế.
- Spec `SIM-SPEC-02` Rev2; target `SIM-TARGET-02` v2, type TARGET, status APPROVED; baseline `SIM-BASE-02` v1. Manifest ảo `SIM/references/02/README.md`, target ảo `SIM/references/02/player-base-target-v2.png`; nguồn/rights giả định là artwork gốc được phép dùng; load ảnh hợp lệ là tiền đề mô phỏng.
- Binding: Must match silhouette/mask/core/handedness, scale/anchor/palette như spec giả lập; Flexible: packing/cách ánh xạ texture; Must not infer: timing, hitbox, damage, camera, AI hoặc animation mới. View context: đúng góc/hướng do spec này chọn, mobile 390×844 và desktop 1920×1080, idle và crowd/cue overlap; không áp số hướng từ Harness.
- Approval mô phỏng: `SIM-USER`, ngày giả lập 2026-11-12, câu dữ liệu giả lập “duyệt SIM-SPEC-02 Rev2 và SIM-TARGET-02 v2 chỉ Player Base”; Gate A approved và task được mở cũng chỉ là giả định của fixture. Không áp dụng vào repo thật.
- AC1: body khớp từng binding ở cùng scale/anchor; AC2: đọc được Player khi crowd/cue overlap ở cả hai viewport; AC3: không đổi frame mapping/timing/collider/input/balance và actor khác; AC4: không regress render/alpha/pause/chuyển state. Evidence plan là before/target/actual và scope diff, không dùng concept thay actual.

Kế hoạch được ghi nhận (không chạy):

1. Kiểm spec/ref/approval/scope/dependency khớp; nếu tiền đề load ảnh hoặc approval không đúng khi làm thật thì STOP thay vì dùng PASS giả lập.
2. Phần dự kiến được sửa **trong fixture**: `public/assets/actors/occult-actors.png` chỉ vùng frame body Player; `.json` cùng atlas chỉ entry Player nếu packing thực sự cần; `src/game/ActorArt.ts` chỉ mapping/scale/anchor Player theo spec; `src/game/PlayerVisual.ts` chỉ chỗ chọn/render body nếu cần. Đây là danh sách cho kế hoạch giả lập, không cấp quyền sửa các file thật. Không cần sửa thì bỏ khỏi diff; phát hiện cần file khác phải làm rõ/duyệt scope trước.
3. Cấm đổi frames actor khác trong atlas chung, animation phases/timing/facings ngoài spec, hitbox/Player logic/input/combat/balance/camera/HUD/AI, preview app, build config, Art Bible/DDR. Nếu atlas chung không thể giữ phần khác nguyên vẹn thì STOP, báo impact, không tự repack toàn bộ.
4. Kiểm dự kiến khi có task thật: typecheck/build; diff mapping/metadata/frame vùng Player và hash/rect phần actor khác; focused regression chỉ khi logic có rủi ro; kiểm alpha/crop/anchor/idle/chuyển state/pause và readability mobile/desktop/crowd/grayscale khi phù hợp. Không thêm test system/dependency. Không deploy trong dry run.
5. So before/target/actual đúng state, góc, scale, viewport: đánh giá riêng từng Must match bằng PASS/FAIL/NOT CHECKED. Evidence giả định có tên `SIM-02-before-mobile.png`, `SIM-02-actual-mobile.png`, `SIM-02-actual-desktop.png`, crowd/grayscale và notes gắn candidate SHA/viewport/scenario; không tạo các file này. Preview A/B phải pin baseline SHA khác candidate SHA; không đồng bộ được seed/frame thì nêu giới hạn.
6. Handoff giả lập gồm task/revisions/refs, diff/commit, AC evidence, technical result, visual review AWAITING USER, playtest AWAITING USER và đúng một next action: user review Player Base ở các context đã nêu. Không tự accepted sau technical checks.

**Kiểm xung đột:** nhánh hợp lệ cần cả Gate A (AGENTS/Master Plan) và task approval (Harness/Template); thêm tiền đề Gate A mô phỏng tránh bỏ qua gate cấp dự án. Thực tế chỉ kế hoạch PASS; việc mở ảnh, build/test và đối chiếu runtime **NOT VERIFIED**. Không có yêu cầu viết toàn bộ docs B/C/D/E trước bước này.

### 2.3. TC-03 — phản hồi giả lập

“STOP phần phát sinh animation/hitbox/camera/balance: approval hiện tại chỉ Player Base. Cần proposal tách các thay đổi độc lập, outcome/impact/regression và user approval đúng scope/revision. Animation cần motion/keyframes/phase mapping và target riêng; hitbox cần design gameplay + regression va chạm/input; camera cần spec/viewports/target/readability; balance cần mục tiêu/thông số/evidence riêng. Approval một proposal không tự duyệt các proposal còn lại.”

Không âm thầm sửa spec để hợp thức hóa diff. Nếu Player Base có thể làm độc lập trong approval cũ, chỉ giữ kế hoạch cho phần đó; nếu bắt buộc đổi camera/animation/hitbox để đạt target thì đánh dấu BLOCKED và chờ quyết định trước implementation. Next action giả lập: trình impact/scope change để user quyết. Không tạo các task/card thật.

**Kiểm xung đột:** Experience §5 yêu cầu tách thay đổi timing/collider/AI; Harness §5 và Template rules 3/5 cùng chặn scope creep. Không có tài liệu nào cho phép gộp chỉ vì cùng B1.

### 2.4. TC-04 — proposal giả lập khi user đổi ý

- Baseline: Art Bible top-down ¾, bốn hướng, Fractured Geometry; đây là approved fallback của phạm vi cũ.
- Candidate **PROPOSED**: góc nhìn hoặc style mới theo mong muốn user; chưa có lựa chọn cụ thể đủ để chốt. Không tự chọn isometric/front view hay style thay user.
- Supersedes dự kiến: chỉ phần camera/phối cảnh/style/số hướng Player Base mà user sẽ xác nhận; chưa hiệu lực. Nếu thay toàn scene, phải mở rõ scope riêng cho enemy/arena/VFX/HUD thay vì suy rộng approval body.
- Impact cần đánh giá: silhouette/scale/anchor, số hướng và chi phí asset/animation, camera/bounds, telegraph/hitbox alignment, contrast/palette, mobile/desktop/readability/performance, refs và các approval nào cần thay. Đổi style không tự cấp quyền đổi collider/balance.
- Còn thiếu: góc/style/số hướng mong muốn, phạm vi giữ/thay, target mới cùng runtime-scale contexts, binding, spec revision và acceptance/regression/evidence plan. Hỏi user các lựa chọn còn thiếu trong task design thích hợp.
- Approval cần có: user chốt direction và phạm vi supersede; nếu cập nhật Art Bible/DDR thì theo invocation `$design-decision` và quy trình repo; sau đó vẫn cần user duyệt đúng spec/target/scope trước production từng artwork, rồi verification và acceptance riêng. Direction approval không approve mọi asset.

Kết quả giả lập: tiếp nhận candidate, STOP production tới khi đủ gate; không bác ý tưởng vì khác Art Bible; không sửa Art Bible/DDR trong A-H4. Next action giả lập: trình candidate/impact và yêu cầu user làm rõ/chọn hướng. **Kiểm xung đột:** negative constraints trong Art Bible chỉ là baseline cho scope cũ theo Harness §2 và AGENTS mục V2; quy tắc cập nhật Bible/DDR là thủ tục lưu quyết định, không cấm đề xuất. Chưa có xung đột cần user giải quyết trong dry run.

## 3. Audit consistency sau sửa

| Hạng mục | Evidence điều khoản / đối chiếu | Kết quả |
| --- | --- | --- |
| Enforcement thật trong AGENTS | Mục Combat Experience V2 dẫn Harness/Template/Reference; design trước code; thiếu spec/ref/scope approval STOP; Gate A chưa hoàn tất thì không redesign | PASS |
| Harness không chứa NEXT ACTION/trạng thái cũ | Bỏ dòng tiến độ ở đầu; §9 dẫn trạng thái về Master Plan/CURRENT. §8 format handoff và chữ NEXT ACTION trong quy tắc là yêu cầu chung, không phải lệnh hiện hành | PASS |
| Approval/trạng thái nhất quán | A1 header/§9, A2 §8, A3 §8, Template header; Master Plan §1/6/7/7a và CURRENT đồng bộ. Handoff cũ dưới ranh giới LỊCH SỬ không làm chỉ thị | PASS |
| Baseline có thể supersede | Harness §2; AGENTS V2; Bible §2/6; Reference §5; TC-04. Không sửa hay hủy approval lịch sử của Art Bible/DDR | PASS |
| Preview App khác Harness | AGENTS V2, Harness header/§3/6, Master Plan §1; cùng runtime không gọi là A/B hai version | PASS |
| Chuỗi đủ sáu bước | DESIGN G1 → REFERENCE G2 → USER APPROVAL G3 → CODE G4 → VERIFICATION G5 → USER ACCEPTANCE/HANDOFF G6 (Harness §4/8, Reference §6, Template §5–7) | PASS |
| Không buộc doc toàn phase trước code B1 | Master Plan §4 chỉ tạo task khi cần, §7a.5 và Bible §7 cho code thay đổi đầu sau Gate A + spec/ref approval | PASS |
| Scope/approval độc lập | Harness §1/4/5; Template rules 2/3; TC-02 không cấp quyền B1 thực tế; TC-03 chặn bốn scope phát sinh | PASS |
| Handoff và giới hạn coverage | CURRENT một next action chờ user review Gate A; báo cáo phân biệt dry run PASS với NOT VERIFIED thực tế; không tự visual approval/acceptance | PASS |
| Chỉ docs, không deploy | Diff chỉ bảy Markdown ở mục 4; AGENTS testing cấm build/tests với docs-only; `.github/workflows/pages.yml` paths-ignore `**/*.md`, không dispatch workflow | PASS |

## 4. Lỗi phát hiện và sửa

| ID | Lỗi trước sửa / tác động | Sửa đúng nguồn |
| --- | --- | --- |
| F1 | Experience Vision header/§9 ghi A1 PROPOSED, A2+ chưa bắt đầu và chờ duyệt A1, trái approval đã lưu | Đồng bộ A1 USER ACCEPTED Rev1 theo quote đã có; dẫn tiến độ về Master Plan/CURRENT; không đổi outcome/thiết kế |
| F2 | Harness đầu file còn H2 chờ review/H4 chưa chạy, trái §9 và trạng thái hiện hành | Chỉ xóa một dòng tiến độ; không viết lại contract hoặc thêm status/NEXT ACTION |
| F3 | Reference Protocol §8 vẫn nói template PROPOSED | Bỏ nhãn H2 cũ, dẫn nguồn trạng thái hiện hành; giữ protocol APPROVED v1 |
| F4 | Design Bible §8 ghi chưa enforce/A3–H4 not started và NEXT ACTION duyệt A2 dù header APPROVED | Giữ A2 APPROVED, chuyển tiến độ về roadmap/CURRENT; làm rõ anti-scope cũ là phạm vi lượt A2 |
| F5 | Master Plan prose nói H2 chờ duyệt/Harness NOT STARTED, §3 còn áp top-down ¾ cụ thể, §4 khuyến khích đưa H2–H4 vào contract | Đồng bộ approval/tiến độ, ghi nhãn lịch sử, thay góc cụ thể bằng spec approved của từng task, giữ contract cố định và tiến độ ngoài Harness |

Sau sửa đã đọc lại **toàn bộ TC-01–04 và toàn bảng audit mục 3**: kết quả cuối đều PASS ở mức tài liệu. Không còn xung đột nghiêm trọng hoặc blocker cần quyết định mới. Các snapshot lịch sử và các mục “TBD” về thiết kế tương lai không bị biến thành approval. Nhãn lịch sử registry rỗng/acceptance cũ trong Art Bible/DDR không dùng để suy trạng thái hiện hành; giữ nguyên hai file theo anti-scope.

Files changed: `docs/combat-v2/DRY_RUN_REPORT.md` (mới), `HARNESS.md`, `MASTER_PLAN.md`, `EXPERIENCE_VISION.md`, `DESIGN_BIBLE.md`, `REFERENCE_PROTOCOL.md` (đều trong `docs/combat-v2/`), và `HANDOFF.md` ở root. AGENTS và template được kiểm nhưng không cần sửa. CURRENT/roadmap cập nhật kết quả thực tế A-H4 và Gate A; approval nguồn không thay đổi.

## 5. Verification và giới hạn

Verification tài liệu: `git diff --check` PASS; kiểm 52 local Markdown links trong bảy file thay đổi đều tồn tại; allowlist xác nhận đúng 7 Markdown. Diff protected paths (`src`, `public`, AGENTS, ART_BIBLE, DESIGN_DECISIONS, `.github`, package manifests) so baseline rỗng. Kiểm nhãn tiến độ hiện hành/STOP/AGENTS PASS; đọc lại điều khoản của cả bốn fixture và audit consistency sau sửa PASS. Không thêm script/test framework vào repo. Không chạy build/typecheck/game tests theo AGENTS vì chỉ Markdown.

**NOT VERIFIED:** hành vi của Codex trong implementation thực tế; ảnh target thật/load/quyền dùng của B1; độ giống hình, animation, runtime render, performance, thiết bị thật, user visual/playtest acceptance. Không tạo B1 card, refs hoặc evidence runtime. TC-02 không chứng minh production đã đạt. Dẫn quote trong repo không thay được permalink hội thoại gốc còn thiếu. Không deploy; Markdown được paths-ignore nên push tài liệu không yêu cầu Pages run.

## 6. Kết luận trạng thái và handoff

- **A-H4: PASS**, giới hạn ở dry run tài liệu: TC-01/02/03/04 PASS; audit sau sửa PASS; chưa user nghiệm thu.
- **Gate A: READY FOR USER REVIEW**, chưa APPROVED; không tự visual approval hoặc user acceptance.
- Lỗi còn lại trong phạm vi kiểm: không có blocker nghiêm trọng; giới hạn NOT VERIFIED giữ nguyên ở mục 5.
- **NEXT ACTION DUY NHẤT: DỪNG, chờ user review A-H4 và quyết định Gate A.** Không tự mở B1, không tạo hình hoặc code game.
