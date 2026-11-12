# CURSEBREAK — Design Harness V2 (A-H1: Contract)

> **TRẠNG THÁI: PROPOSED — CHƯA CÓ HIỆU LỰC THỰC THI V2.** Ngày 2026-11-12.
> Đây là bản đầu của **bộ khung bắt buộc Codex tuân theo**, không phải `design-harness.html` (preview app). Cần user duyệt A-H1; sau đó bổ sung Design Bible, reference protocol, task template, enforcement trong AGENTS và dry run (A1/A2/A3/A-H2/A-H3/A-H4) trước Gate A.
> **Không tự suy visual approval, không mở production redesign.**

## 1. Mục đích và phạm vi

Harness làm cho từng thay đổi Combat Experience V2 **có thể truy nguồn, bị giới hạn phạm vi và kiểm chứng được** trước khi Codex sửa game. Quy tắc lõi: `1 prompt = 1 thay đổi`; thiết kế/ảnh phải duyệt trước khi tích hợp; thiếu dữ kiện thì **STOP**, không tự sáng tác rồi sửa tài liệu cho khớp code.

Mục tiêu trải nghiệm đã trao đổi: quái thường máu giấy, clear nhiều để tạo cảm giác mạnh, tiến hóa nhận ra qua quy mô diệt quái/chain reaction/ngoại hình, và combat có lực; không dùng tăng HP fodder như cách giải quyết chung. Chi tiết animation, palette, pattern, HP và VFX **chưa mặc nhiên được chốt** ở tài liệu này.

## 2. Nguồn sự thật — thứ tự xử lý

1. Yêu cầu/approval cụ thể **mới nhất của user** trong phạm vi task, ghi nguyên văn/ngày/nguồn nếu có.
2. `AGENTS.md` và `GAME_BRIEF.md`: quy tắc repo, platform, gameplay contract.
3. `DESIGN_DECISIONS.md`: các quyết định Approved còn hiệu lực theo quy tắc append-only của repo; không ghi tự động.
4. `ART_BIBLE.md` cùng refs đã approved trước đây: baseline mặc định cho phần chưa thay thế.
5. `docs/combat-v2/MASTER_PLAN.md`: phase, dependency, thứ tự và gate.
6. `docs/combat-v2/DESIGN_BIBLE.md` (khi được duyệt): art/experience contract V2, chỉ áp dụng scope được duyệt.
7. `docs/combat-v2/tasks/<TASK-ID>.md` và refs có trạng thái approved: contract cụ thể cho một thay đổi.
8. `HANDOFF.md`: tiến độ thực tế và NEXT ACTION, **không tự tạo quyền sửa design**.
9. Source code/runtime và preview app: bằng chứng implementation/quan sát, **không phải nguồn phê duyệt design**.

Nếu hai nguồn xung đột, **không tự chọn nguồn tiện hơn**: ghi rõ xung đột và dừng; chỉ áp dụng ưu tiên yêu cầu mới khi phạm vi/ý định thay thế rõ. Tài liệu PROPOSED không ghi đè approval hiện hữu.

## 3. Cổng bắt buộc của một task

- **G0 — PLAN:** task ID trong roadmap đã được phép mở; chỉ đúng một thay đổi quan sát được.
- **G1 — DESIGN:** spec mô tả before → after, mục tiêu nhìn thấy, role, trạng thái gameplay đúng, desktop/mobile, giới hạn và anti-goals.
- **G2 — REFERENCES:** visual task phải có ảnh/keyframe/mockup tương ứng, ID/version/nguồn, chụp trong runtime scale khi cần. *Concept*, *runtime screenshot*, *production asset* phải phân biệt; không xem ảnh minh họa chung là approved.
- **G3 — USER VISUAL APPROVAL:** user duyệt rõ **đúng spec revision + reference IDs + phạm vi**; chưa duyệt thì chỉ được làm design, không production.
- **G4 — IMPLEMENTATION:** Codex sửa đúng phạm vi đã duyệt, giữ gameplay/balance/input/collider/progression trừ khi user cho phép rõ. Không tự đổi Art Bible hoặc design card để hợp thức hóa output.
- **G5 — VERIFICATION:** kiểm đối chiếu từng acceptance theo spec, không chỉ build PASS; dùng preview app như công cụ quan sát, không xem autoplay là bằng chứng design compliance. Ghi ngoại lệ, hạn chế của A/B không đồng bộ, mobile/desktop/crowd/grayscale nếu áp dụng.
- **G6 — USER ACCEPTANCE & HANDOFF:** ghi user visual approval, technical PASS và human/playtest acceptance **tách biệt**; commit/revision/evidence/next action, rồi mới mở task tiếp theo.

Chỉ phase tài liệu (A-H1, A1, A2, A3, A-H2, A-H3, A-H4) được làm khi chưa đủ visual refs; tài liệu vẫn phải tuân G0/G1 và không tự khai approved. Gate A tổng thể chỉ đạt sau khi user chấp thuận và enforcement được nối vào workflow.

## 4. Luật STOP — không tự quyết

Dừng, nêu blocker cụ thể và đề nghị đúng một quyết định tiếp theo nếu:
- Không tìm thấy approved spec/reference hoặc reference không khớp target/hướng/tỷ lệ/silhouette.
- Task yêu cầu nhiều thay đổi (ví dụ: thay Player + Attack + HUD trong cùng prompt) mà chưa được tách.
- Đề xuất sửa gameplay/balance/AI/input để che lỗi hình ảnh mà không có approval.
- Art direction V2 xung đột với Art Bible/DDR chưa có quyết định thay thế.
- Codex không thể minh chứng thay đổi đạt observable acceptance, hoặc tool không truy cập được file tham chiếu.
- Autoplay/preview không tạo được trạng thái để review: báo thiếu fixture, không fake proc/damage.
- Test/preview FAIL: không ghi ACCEPTED; sửa trong đúng task hoặc ghi blocker.

Codex **được** đưa ra phương án cụ thể khi đang ở giai đoạn design và đánh dấu PROPOSED, **không được** tự chọn phương án đó để sản xuất trước khi user duyệt.

## 5. Một prompt, một thay đổi

Mỗi prompt Codex tối đa có các thành phần:
`TASK-ID | READ (approved docs+refs) | DO (one exact observable change) | DON'T | ACCEPTANCE | CHECKS | COMMIT/HANDOFF | STOP`.

Chi tiết nằm trong task file và reference, không nhồi nhiều quyết định mới vào prompt. Nếu một animation cần nhiều asset/pose cùng tạo thành một thay đổi duy nhất, task phải chỉ rõ đơn vị acceptance; không mặc nhiên gộp hệ thống khác.

**Design và implementation là hai lượt giao riêng** khi có hình ảnh mới. Implementation không được “vừa thiết kế vừa tự duyệt”.

## 6. Quy tắc visual và gameplay để không lạc hướng

- Giữ **visual hierarchy P0–P3** trong `ART_BIBLE.md` cho tới khi được duyệt thay, đặc biệt Player/threat cue > enemy role > proc/VFX > floor.
- Actor vẫn top-down ¾, 4 hướng, mask/giáp/core/handedness theo Art Bible hiện hành trừ khi một V2 design card đã approved rõ phần thay.
- Mọi particle/flash, afterimage, chain, explosion phải diễn tả **trigger và damage/area thật**; không tạo nguy hiểm hay hitbox giả.
- Không làm quái thường trâu hơn chỉ để trưng animation; muốn chỉnh cân bằng phải là một task độc lập với mục tiêu và approval rõ.
- Không khiến mutation/curse thành những icon vô nghĩa; yêu cầu visual logic: trạng thái bền vững hoặc event khi proc, liên hệ với tác động thực tế.
- Giữ mobile-first + desktop-equivalent, hạn chế overlap, readability ở crowd và grayscale, hiệu năng browser, free/open-source, KISS.

## 7. Quy trình audit ngắn gọn cho Codex

Trước sửa:
- [ ] Đã đọc AGENTS → HANDOFF → MASTER_PLAN → HARNESS (bản approved) → DESIGN_BIBLE (nếu có) → task card → ref.
- [ ] Task ID, đúng **một thay đổi**, approved revision và scope rõ ràng.
- [ ] Không có mâu thuẫn chưa được giải quyết; biết trước/after, tiêu chí nhận biết, anti-scope.

Sau sửa:
- [ ] Diff không vượt scope; không tự đổi gameplay/balance/art approvals.
- [ ] Ảnh/animation thực tế so với *đúng* reference đã duyệt, ở tỷ lệ chơi.
- [ ] Kiểm tối thiểu build/typecheck khi có code; focused tests nếu đụng logic rủi ro.
- [ ] Preview app A/B khi thực sự có candidate (không gọi hai iframe cùng code là A/B đã chứng minh khác biệt).
- [ ] Handoff ghi revision, commit, link refs/evidence, kết quả kỹ thuật, hạn chế, gate cần user duyệt, **NEXT ACTION duy nhất**.
- [ ] Không claim approval từ screenshot/build/deploy.

## 8. Quy tắc approval và thay đổi thiết kế

Mọi proposal/asset phải ghi `PROPOSED` cho tới khi user duyệt rõ scope. Chỉ ghi `APPROVED` cho đúng hạng mục, revision và ảnh user đã duyệt. Thay một phần design V1 cần nêu phần được thay và phần giữ lại; không sửa lịch sử approval để xóa khác biệt.

`DESIGN_DECISIONS.md` chỉ được cập nhật khi đáp ứng quy tắc invocation `$design-decision` của repo; HARNESS không tự ghi DDR, không tự nhận quyền sửa ART_BIBLE. Phần pháp lý/nguồn ảnh phải rõ, không crop mockup từ bên thứ ba thành asset production.

## 9. Hình thức bàn giao từng lượt

Mỗi task trả gọn:
`Task ID | Status (PROPOSED / AWAITING VISUAL APPROVAL / IMPLEMENTED-NEEDS-REVIEW / ACCEPTED) | Design ref IDs | Changed files | Commit/deploy | Validation vs acceptance | Known gaps | One next action`.

Nếu chưa có refs thì ghi `NONE — DESIGN ONLY`, không để người đọc suy rằng đã duyệt.

## 10. Còn thiếu để Harness thật sự có hiệu lực

- **A1:** Experience Vision (mục tiêu cụ thể, anti-goals, 3 thời điểm của run).
- **A2:** Visual Language + Design Bible, có hình mẫu khi cần, user duyệt.
- **A3:** quản lý nguồn/ID/version/trạng thái hình tham chiếu và evidence.
- **A-H2:** mẫu task card chi tiết, gồm negative references và phân biệt role/trigger/timing.
- **A-H3:** nối AGENTS/HANDOFF với các gate, phương thức kiểm việc tuân thủ.
- **A-H4:** dry run một task design-only, chứng minh đúng dừng khi thiếu approval.
- **GATE A:** user duyệt bộ contract và các thành phần; khi đó bắt đầu thiết kế B1, không auto implement.

**NEXT ACTION tại A-H1:** user review/điều chỉnh/duyệt contract này, sau đó mới tạo A1 Experience Vision. Không được tự triển khai A1, artwork hay gameplay.
