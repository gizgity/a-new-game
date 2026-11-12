# CURSEBREAK — Combat Experience V2: MASTER PLAN

> **Trạng thái: A0 APPROVED TO PROCEED — 2026-11-12.** User: “ok, bắt đầu lại đi”, sau khi roadmap/định nghĩa Design Harness được sửa. Đây là phép mở **A-H1**, không đồng nghĩa user đã duyệt toàn bộ design chi tiết hoặc Harness.
> Lập ngày 2026-11-12 theo yêu cầu lập kế hoạch high-level trước, rồi mới đi vào low-level. Đây là roadmap/nguồn tra cứu tiến độ, **không phải** art approval, balance approval, implementation authorization hay entry DDR.
> Đọc cùng `AGENTS.md`, `HANDOFF.md`, `GAME_BRIEF.md`, `ART_BIBLE.md`, `DESIGN_DECISIONS.md`. Không sửa hoặc âm thầm thay thế các quyết định trước.

## 0. Lý do, mục tiêu và giới hạn

Vấn đề người dùng nêu: gameplay cơ bản đã có nhưng hình ảnh nhân vật/đòn đánh/quái, cảm giác va chạm, thể hiện Mutation/Curse và Boss phase chưa đủ đẹp, lực và rõ sự tiến hóa. **Fodder máu giấy là chủ ý**: quét quái hàng loạt tạo thỏa mãn; sức mạnh phải nhận biết được giữa đầu / giữa / cuối run ngay cả khi không nhìn HUD.

**Đích trải nghiệm:** mass slaughter + stylish combat + explosive chain reactions; đầu run giết nhanh, càng về cuối càng giết được nhiều hơn/diện rộng/lan truyền và thay đổi rõ ngoại hình; Elite/Boss có nhịp riêng, không biến fodder thành bao cát HP.

**Giới hạn giai đoạn thiết kế:** giữ gameplay hiện hành cho tới khi có đề xuất balance/gameplay riêng được duyệt. Bảo toàn input, hitbox, RNG/progression, run 5 phút, telegraph, mobile-first + desktop-equivalent; FPS/readability/hiệu năng KISS. Không suy rằng ảnh concept là sprite production hoặc animation frame đã duyệt.

## 1. Trạng thái thực tế và định nghĩa bắt buộc (sửa theo user 2026-11-12)

**DESIGN HARNESS ≠ PREVIEW APP.** Design Harness là **bộ khung thiết kế có hiệu lực bắt buộc đối với Codex**: quy tắc thực thi, nguồn sự thật, thiết kế đã duyệt, mẫu task, references, scope constraints, acceptance gate và cơ chế ghi nhận/đối chiếu sai lệch. Preview app chỉ là **một công cụ quan sát**; nó không thể ép Codex tuân theo thiết kế.

- V2-01: tạo **preview app**, nhầm gọi “Design Review Harness” trong lịch sử; commit `b96e52b`.
- V2-02: bổ sung autoplay/playback cho **preview app**; commit `f81f33e`, Pages workflow 43067036347 SUCCESS, chưa user visual/experience acceptance.
- **Design Harness đúng nghĩa: contract A-H1 đã được user chốt (Revision 2); toàn bộ harness chưa hoàn thiện/enforce.** A-H2/H3/H4 còn thiếu. MASTER_PLAN là roadmap, không phải harness.
- Preview BASELINE và CANDIDATE đang cùng runtime; chưa có redesign V2 production.
- `ART_BIBLE.md` và DDR là các baseline/ràng buộc đã có, **chưa đủ** làm Design Harness V2.
- Tên file lịch sử `design-harness.html` được giữ để tránh phá URL; tên kỹ thuật cũ **không quyết định định nghĩa**.

## 2. Đường đi bắt buộc: HIGH LEVEL → LOW LEVEL → PRODUCTION

### Phase A — Xây dựng Design Harness bắt buộc (trước mọi redesign)
**A0 — MASTER PLAN**: tài liệu này. User duyệt/sửa thứ tự, phạm vi, cổng nghiệm thu. Không auto-chốt Proposed.
**A-H1 — HARNESS CONTRACT**: thiết lập quy tắc bắt buộc Codex: thứ tự nguồn sự thật, design lock, scope/anti-scope, approved-reference binding, 1 prompt = 1 thay đổi, stop condition, checklist audit, format approval, conflict/escalation. Chỉ tài liệu, chưa code/art. Không gọi đây là hoàn tất harness cho tới khi các phần H1–H4 được duyệt.
**A1 — Vision/Experience Contract**: mô tả mục tiêu cảm giác, power fantasy, 3 thời điểm run, ưu tiên mắt nhìn, quy tắc không đổi máu fodder, mục tiêu Elite/Boss; đưa tình huống chứng minh được và anti-goals.
**A2 — Visual Language Contract**: kế thừa Art Bible, làm rõ silhouette, vật liệu, palette, camera, animation grammar, effects hierarchy, độ lớn ở runtime, giới hạn màu/flash/shake, cách phân biệt concept và production.
**A3 — Reference & Evidence Protocol**: nơi đặt refs, định danh, nguồn artwork, baseline screenshot thật (mobile/desktop, crowd, grayscale), mẫu keyframes, checklist kiểm đúng thiết kế.
**A-H2 — DESIGN CARD TEMPLATE**: contract cho đúng 1 thay đổi: task ID, approved spec revision, reference IDs, scope/forbidden, output observable, platform, acceptance, evidence, status và stop.
**A-H3 — ENFORCEMENT/HANDOFF**: quy tắc trong AGENTS.md trỏ tới Harness; trước code phải kiểm status APPROVED, refs, task card; nếu thiếu phải STOP, không tự suy; TASK LOG/HANDOFF chỉ ra đúng 1 NEXT ACTION. Không được tự sửa spec để hợp thức hóa implementation.
**A-H4 — DRY RUN**: chọn một task minh họa *không sửa code*, thử đi qua contract → approved refs → prompt nhỏ → audit/stop; kiểm tra tính khép kín, sửa lỗ hổng ở tài liệu. Không coi dry run là duyệt art.
**Gate A:** user duyệt **Design Harness (H1–H4)**, vision/visual language, phương thức refs và template. Khi đó mới có quyền bắt đầu **thiết kế cụ thể B1**; riêng sản xuất art B1 vẫn cần user visual approval.

### Phase B — Combat Core: nhỏ nhưng cảm giác đã tay
Thiết kế lần lượt **B1 Player base silhouette**, **B2 Idle**, **B3 Move**, **B4 Dash**, **B5 L1**, **B6 L2**, **B7 L3**, **B8 Heavy**, **B9 Basic/Charged shot**, **B10 hit confirmation / impact / feedback**, **B11 Grunt hit/death**, **B12 Bulwark armor/reaction**. Tên task là thứ tự gợi ý, **mỗi task một thay đổi thực sự**; nếu cần tách concept và implementation thì dùng hậu tố -DESIGN / -IMPLEMENT.
**Gate B:** core combo đủ lực khi không có Mutation; 1–2 đòn giết fodder vẫn đã tay, khác biệt light/heavy/detonate rõ, không làm mất threat readability.

### Phase C — Evolution / Power Progression
**C1 Evolution design matrix:** lập danh sách 12 Mutation + 8 Curse hiện hành và 6 Sigil/12 Branch + Anomaly nếu còn áp dụng; audit trigger thật, phân loại VFX cơ thể / vũ khí / event / arena / HUD; tránh phát biểu hiệu ứng không có trong combat.
**C2–... Theo từng effect:** mỗi effect nhận một design card (before/after, keyframe, trigger, visual priority, constraints) → user duyệt → một task integration → preview app A/B. Dùng asset layers có giới hạn, không tạo biến thể toàn thân tổ hợp vô hạn.
**C3 Mutation/Curse acquisition:** transition khi nhận, UI cập nhật, khác biệt tác động thực tế, không chỉ icon; triển khai mỗi thay đổi riêng.
**C4 Cross-build readability:** nhiều effect cùng kích hoạt; đề xuất ngân sách VFX/ưu tiên/overlap và suppression; kiểm đông quái/mobile.
**Gate C:** cùng nhân vật ở 0:30/2:00/4:00 nhận biết mạnh lên bằng cảnh chiến đấu không cần HUD; hiệu ứng phải gắn với trigger/kết quả thật; không đổi balance ngầm.

### Phase D — Enemies, Boss & Arena
**D1 Fodder roles/readability**, **D2 Archer**, **D3 Volatile**, **D4 Elite/Bulwark**: mỗi loại tách thiết kế, animation phản ứng, death và tích hợp.
**D5 Boss arrival**, **D6 Boss Phase 1 identity**, **D7 Phase transition storyboard**, **D8 Phase 2 silhouette + telegraph/pattern presentation**, **D9 Boss death/victory moment**. Một cinematic không tự thay boss behavior; gameplay AI/phase changes cần decision task riêng.
**D10 Arena atmosphere** nếu cần, không gây nhiễu telegraph/giả collider.
**Gate D:** boss phase nhìn/di chuyển/nhịp khác thật, dấu nguy hiểm chuẩn, người xem nhận ra thời điểm phase đổi; quái thường vẫn chết nhanh.

### Phase E — HUD, Audio, Full-run & Acceptance
**E1 HUD phản ứng build/proc (không HUD chỉ icon)**, **E2 audio + feedback hierarchy**, **E3 full-run power curve & pacing review**, **E4 mobile/desktop readability + VFX budget**, **E5 final compare / cleanup / documentation closure**.
Đề xuất balance sau khi quan sát mới được tách thành task khác, không trộn vào task art.
**Gate E:** so sánh baseline/candidate trên preview app và chơi tay ngắn có cùng hoàn cảnh; chốt rõ art approval, integration approval, playtest acceptance độc lập.

## 3. Các loại công việc / mô hình lặp cho MỌI thay đổi

**DESIGN CARD → VISUAL GATE → IMPLEMENT → REVIEW GATE**:
1. Bắt đầu một task ID, xác định scope đúng 1 thay đổi, liệt kê file hiện trạng và source of truth.
2. Chốt *outcome observable*: người xem phải nhận ra điều gì, trước/sau khác ở đâu; không mô tả kiểu “đẹp hơn” đơn thuần.
3. Tạo refs phù hợp (concept / storyboard / keyframe / overlay trên screenshot runtime), kiểm **chính xác hướng/top-down ¾/scale/asset identity**. Đặt vào `docs/combat-v2/references/` khi đã có và user chọn; source/metadata/approval rõ.
4. **AWAITING USER VISUAL APPROVAL** cho art mới. Concept không được tự auto-integrate.
5. Codex implement duy nhất design card được duyệt; không sửa logic unrelated; typecheck/build và focused tests nếu cần.
6. Preview app: cùng scenario/seed, baseline **pin phiên bản trước** và candidate mới để so sánh khi khả thi; nói rõ nếu không deterministic; snapshot mobile & desktop; xét 0.25×/Step; kiểm crowd và telegraph.
7. User đánh giá, phản hồi, sửa một thay đổi hoặc duyệt. **Approval không suy từ commit/deploy/CI**.
8. Cập nhật task log/trạng thái, đường dẫn refs, commit/deploy, known limitations, Next Action. Chỉ mở task kế tiếp khi gate cần thiết đạt.

**ENFORCEMENT:** nếu design card, approved ref, revision hoặc gate đang thiếu/không nhất quán, Codex chỉ được báo blocker và **STOP**, không phỏng đoán, không tự duyệt. Tài liệu/ảnh đề xuất phải ghi PROPOSED cho đến khi user chốt scope. Preview app không phải bằng chứng design compliance nếu không có đối chiếu với spec.

**Mẫu một prompt Codex:** `TASK-ID + source docs/refs/approved revision + DO exact one change + DON'T + observable acceptance + checks + commit/deploy rule + STOP`. Prompt ngắn để agent follow; spec chi tiết nằm ở repo, không nhồi lại trong prompt.

## 4. Source of truth & cách nhớ xuyên phiên

Không scaffold hàng loạt docs trống. Tại thời điểm có task cụ thể mới tạo:
- `docs/combat-v2/MASTER_PLAN.md`: **roadmap, trạng thái high-level, dependency, gate** (file này).
- `docs/combat-v2/HARNESS.md`: **contract bắt buộc cho Codex** sau A-H1; tiếp tục bổ sung H2–H4 theo từng task và chờ duyệt. Đây là Design Harness thật; không được coi MASTER_PLAN hoặc preview app là HARNESS.
- `docs/combat-v2/DESIGN_BIBLE.md`: design vision/visual contract từ A1–A2, phải duyệt trước khi cho production; có trạng thái từng mục.
- `docs/combat-v2/tasks/<TASK-ID>.md`: **một task đã bắt đầu** gồm scope, refs, outcome, acceptance, implementation, evidence, trạng thái. Không tự tạo hàng chục file rỗng.
- `docs/combat-v2/references/`: concept/screenshots/approved assets khi thực sự có, có nguồn và scope duyệt.
- `HANDOFF.md`: active task, completed latest, blocker, **NEXT ACTION 1 task duy nhất** và links. Không phải nơi chép toàn bộ Bible.
- `ART_BIBLE.md`: chuẩn cũ; giữ nguyên trừ khi user approve update theo quy trình. `DESIGN_DECISIONS.md`: chỉ cập nhật theo quy tắc `$design-decision` của repo, không suy approval từ master plan.

**Trình tự đọc mỗi session:** AGENTS → HANDOFF (ACTIVE TASK/NEXT ACTION) → MASTER_PLAN → HARNESS (khi được tạo/duyệt) → DESIGN_BIBLE (khi được tạo/duyệt) → đúng task card + approved refs → source code liên quan. Agent không tự mở phase tiếp hoặc biến PROPOSED thành APPROVED.

## 5. High-level acceptance & rủi ro cần giải quyết

- **Cảm giác đánh:** 4 đòn melee thể hiện chuẩn bị/tiếp xúc/hậu đòn khác nhau, phản ứng mục tiêu rõ; không dùng rung màn hình để che thiếu động tác.
- **Power growth:** 3 đoạn run phân biệt được trong playback **không cần HUD**; crowd kill/chain reaction rộng hơn nhưng quái cơ bản vẫn giấy máu.
- **Mutation/Curse:** chọn xong thấy thay đổi bền vững và rõ khi trigger, không spam aura/flash vô nghĩa; Curse có risk cue hợp lệ.
- **Boss:** phase 50% là tình huống đọc được từ silhouette, sound/visual/pattern; transformation không phá logic/telegraph.
- **Kỹ thuật:** desktop và mobile, nhiều quái, four facings, grayscale, pause/step, no fake gameplay/HP grants, không regress.
- **Rủi ro:** baseline/candidate hiện same-version; hai run không đồng bộ frame; auto-run có thể chết trước đoạn cần review; review muted audio; legacy approved art constraints; ảnh concept dễ sai hướng/góc/scale. Giải quyết theo task riêng khi trở thành blocker, không tạo framework mới trước.

## 6. Bảng phase status (cập nhật khi có bằng chứng)

| Mã | Kết quả | Trạng thái tại 2026-11-12 | Gate |
| --- | --- | --- | --- |
| V2-01 | Preview app: hai khung A/B | Implemented; technical PASS, user acceptance chưa xác nhận | Đã làm |
| V2-02 | Preview app: playback/autoplay | Implemented/deployed; technical PASS, user acceptance chưa xác nhận | Đã làm |
| A0 | MASTER_PLAN | APPROVED TO PROCEED (2026-11-12) | Đã mở A-H1 |
| A-H1 | Design Harness contract | APPROVED — revision 2, 2026-11-12; ghi lại tại `HARNESS.md` | Đã mở A1 |
| A1 | Experience vision | DRAFT PROPOSED — `EXPERIENCE_VISION.md`, commit `f0ba7bd` | **AWAIT USER REVIEW** |
| A-H2/H3/H4 | Card template / enforcement / dry run | NOT STARTED | Hoàn thiện trong Phase A |
| A2 | Visual language | NOT STARTED | A1 |
| A3 | Reference protocol | NOT STARTED | A2 |
| B | Combat core | NOT STARTED | Gate A |
| C | Evolution | NOT STARTED | Gate B |
| D | Enemies/Boss | NOT STARTED | Gate tương ứng |
| E | Polish/final | NOT STARTED | Gate D |

## 7. Việc kế tiếp (DUY NHẤT)

**User review/điều chỉnh và duyệt A1 — [`EXPERIENCE_VISION.md`](EXPERIENCE_VISION.md).** User cho phép tiếp tục từ A-H1 revision 2 bằng “ok, làm tiếp đi” ngày 2026-11-12; contract A-H1 đã approved, nhưng enforcement A-H3 chưa làm. A1 là design PROPOSED; chỉ sau khi được user duyệt mới làm A2 Visual Language. Chưa làm B1 Player. Mọi sửa roadmap có revision/date/nguồn, không thay đổi âm thầm. Chỉ có tài liệu roadmap mới được commit ở lượt hiện tại; không build/deploy hoặc sửa production.

## 8. Sửa lỗi thuật ngữ (2026-11-12)

User đính chính nguyên văn: “harness là bộ khung bắt buộc codex tuân theo, k phải preview, chưa có 1 harness nào đc tạo ở thời điểm hiện tại, chỉ có 1 app preview”. Các đề cập trước về “harness đã hoàn tất” là **sai khái niệm**. Không thay lịch sử commit; mọi báo cáo sau phải gọi V2-01/V2-02 là preview app, còn Design Harness là **NOT STARTED** cho đến khi được xây dựng và user duyệt.

## 9. Nguồn ý định và ranh giới approval

- User (hội thoại, không permalink, 2026-11-12): “trước khi bắt đầu, t muốn m rõ ràng về các step sẽ làm, vì m đã làm thiếu nên t k còn tin nữa t muốn kế hoạch chi tiết high level, sao đó mới vào low level từ chi tiết, phải đc doc lại, để m có thể đọc và nhớ m đã làm j”.
- User đã nhấn mạnh giữ quái thường máu giấy, thể hiện tăng sức mạnh qua clear và Mutation/Curse; một prompt một thay đổi; design reference rõ ràng; harness autoplay.
- Đây là **planning proposal** để user duyệt; không ghi vào DDR, không tuyên bố có approval mới cho gameplay/art.
