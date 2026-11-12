# CURSEBREAK V2 — Design Harness Contract (A-H1)

> **A-H1 APPROVED (contract Revision 2) · 2026-11-12 · áp dụng qua AGENTS.md trong A-H3 (2026-11-12).** User xác nhận “ok, làm tiếp đi” ngay sau khi được đề nghị duyệt A-H1 Revision 2; chỉ áp dụng **quy trình/biên giới/verify**, không duyệt bất kỳ design visual/gameplay mới nào.
> Harness là **quy trình và biên giới bắt buộc Codex tuân thủ**, không phải preview app. Tài liệu này **không khóa** camera, art style, palette, sprite, loại VFX, combat balance hoặc ý tưởng gameplay cụ thể. Các lựa chọn đó thuộc design specs/decisions theo từng phiên bản và **có thể đổi theo ý user**.
> Contract A-H1 đã chốt; A1/A2/A3 đã duyệt, A-H2 đang chờ review, A-H3 liên kết AGENTS, A-H4 dry run chưa làm. Gate A vẫn chưa hoàn tất: không khởi động redesign production.

## 1. Vai trò và nguyên tắc bất biến của HARNESS

Harness quy định **CÁCH làm và CÁCH kiểm chứng**, không quy định cứng **game phải trông thế nào**.

1. **Một prompt = một thay đổi** có phạm vi và tiêu chí nghiệm thu cụ thể. Đừng gộp nhiều hệ thống, kể cả khi cùng một milestone.
2. **Design before implementation**: yêu cầu thay hình ảnh phải có spec + reference phù hợp, được user duyệt đúng revision/scope trước khi Codex tạo/tích hợp asset production.
3. **Không tự quyết định thay user**: Codex được đề xuất các hướng design đánh dấu `PROPOSED`; không tự chuyển thành `APPROVED`, không tự đổi gameplay/art direction hoặc mở task tiếp.
4. **Traceability**: mỗi task có ID, nguồn yêu cầu, design revision, reference version, thay đổi trong diff, evidence, trạng thái và một next action.
5. **Boundary first**: scope và anti-scope là bắt buộc; không sửa file/hệ thống khác để tiện implementation. Cần đổi scope thì trình user.
6. **Verification over self-report**: build PASS không chứng minh hình đúng; demo đẹp không chứng minh gameplay giữ nguyên; technical PASS không phải user visual/playtest approval.
7. **STOP là kết quả hợp lệ** khi thiếu hoặc mâu thuẫn yêu cầu, reference, quyền phê duyệt, tool hoặc evidence. Nêu rõ blocker, không giả định và không sửa tài liệu cho khớp output.

Những nguyên tắc này chỉ thay khi user **chủ động sửa Harness**; việc đổi camera/palette/visual identity bình thường không cần sửa Harness.

## 2. Design có thể đổi: baseline fallback, không phải luật cố định

- `ART_BIBLE.md`, `GAME_BRIEF.md`, `DESIGN_DECISIONS.md`, code/assets hiện hành là **baseline/history và approved scope trước đó**; khi chưa có approved spec mới cho hạng mục đang làm, lấy làm tham khảo mặc định.
- Những đặc tính như **top-down ¾, 4 facings, màu sắc, silhouette, vật liệu, animation, VFX, bố cục HUD, HP, nhịp boss** đều **không được đặt thành invariant của Harness**. User có thể yêu cầu thay toàn bộ hoặc một phần.
- Nếu user muốn đổi: tạo **design-change proposal** nêu current → proposed, phần bị thay (scope), tác động liên quan, ref/ảnh mới, điều cần kiểm; user duyệt thì áp dụng **chỉ cho scope đó**, giữ nguyên lịch sử source cũ.
- Nếu directive mới rõ ràng nhưng mâu thuẫn approved spec cũ, **không bác bỏ chỉ vì cũ đã approved**: ghi phạm vi supersede và hỏi/nhận user approval đối với thay đổi; kiểm tra migration/impact rồi mới triển khai.
- Nếu chưa có quyết định mới, **không tự suy được quyền thay đổi** baseline. Dùng fallback không đồng nghĩa khóa vĩnh viễn. `ART_BIBLE.md` chỉ sửa theo quy trình approval của repo; `DESIGN_DECISIONS.md` giữ quy tắc `$design-decision` riêng.
- Mọi tiêu chí định tính/định lượng về visual/gameplay phải nằm trong `DESIGN_BIBLE.md` hoặc **task design card phiên bản được duyệt**, không ghi cứng ở Harness.

## 3. Nguồn thông tin và cách xử lý xung đột

Đọc: `AGENTS.md` → `HANDOFF.md` → `MASTER_PLAN.md` → `HARNESS.md` → `DESIGN_BIBLE.md` nếu có → task card + refs → các source/DDR/Art Bible liên quan.

Phân biệt:
- **User approval mới, rõ phạm vi**: cơ sở cho thay đổi thiết kế.
- **Approved contract/spec + refs theo task**: mục tiêu implementation.
- **Baseline/historical docs**: fallback cho phần chưa được thay.
- **Source/runtime**: trạng thái đã code, không tự chứng minh là thiết kế đã duyệt.
- **Handoff/preview app**: trạng thái và công cụ review, không cấp quyền đổi design.

Khi hai tài liệu khác nhau, tìm revision, scope và approval có bằng chứng; **chỉ phần superseded cụ thể mới bị thay**. Không suy từ chữ “mới nhất” rằng được tự loại bỏ tất cả giới hạn cũ. Nếu không phân định được, STOP báo xung đột để user quyết.

## 4. Gate bắt buộc cho một thay đổi

| Gate | Phải có trước khi đi tiếp |
| --- | --- |
| **G0 — Scope** | Task ID được mở, đúng một thay đổi, objective, anti-scope, dependency và loại task (design/implementation) |
| **G1 — Design** | Desired outcome quan sát được, before/after, các trạng thái/viewport liên quan, phần giữ lại, phần được phép thay |
| **G2 — References** | Với visual task: ảnh/keyframe/mockup đúng đối tượng, path/ID/revision/nguồn và cách so ở runtime scale; phân biệt concept, source art, production và screenshot thật |
| **G3 — Approval** | User duyệt **đúng phiên bản design và đúng reference/scope** trước production; chỉ phê duyệt thiết kế không tự đồng nghĩa phê duyệt gameplay hoặc art đã tích hợp |
| **G4 — Implementation** | Diff theo scope, không tự refactor/sửa balance/AI/input/HUD ngoài task; nếu design mới yêu cầu đổi gameplay, phải có task và approval tương ứng |
| **G5 — Verification** | Kiểm theo acceptance của task, evidence thực tế, build/test phù hợp; preview app A/B chỉ là một công cụ, không phải Harness |
| **G6 — Acceptance/Handoff** | Tách technical result / visual approval / experience playtest; lưu gaps, commit, link evidence, trạng thái và đúng một next action |

**Task design-only** được phép chuẩn bị spec/references để xin approval G3, không cần tự có ảnh approved từ trước. **Task implementation visual** thiếu G3 thì STOP.

## 5. Quy tắc STOP và quyền đề xuất

Dừng và báo blocker nếu:
- Thiếu approved design/references cho việc chuẩn bị triển khai, hoặc ảnh không thể sử dụng/không xác định revision.
- Task đòi nhiều thay đổi độc lập mà chưa tách, diff vượt scope, hoặc phát hiện phải đổi gameplay/balance ngoài scope.
- Nguồn/approval mâu thuẫn mà chưa rõ phần nào thay thế.
- Không kiểm được acceptance quan trọng, preview fixture sai, thiếu assets, tool không truy cập được hoặc output không bám spec.
- Build/test thất bại: không tuyên bố đạt, không tự nới acceptance.

Codex **được** đưa proposal/design alternatives có lý do và ghi `PROPOSED`. Codex **không được** tự duyệt một alternative, thay ref đã duyệt hay chuyển sang production khi thiếu approval.

## 6. Phạm vi kiểm chứng (không khóa creative direction)

Acceptance được định nghĩa **theo task**; Harness chỉ bắt buộc cách kiểm:
- So sánh thực tế với approved ref/spec, không chấm bằng cảm giác chung “đẹp”.
- Kiểm đúng trạng thái/trigger/timing và kết quả gameplay thực nếu task có phụ thuộc vào logic.
- Kiểm mobile và desktop theo phạm vi user duyệt; readability / crowd / overlapping threats / performance khi liên quan; không tạo báo cáo nặng khi không cần.
- Nếu dùng preview app, chỉ khẳng định A/B khi thực sự có hai revision khác nhau; ghi rõ seed/sync limitations và việc autoplay không thay thế playtest tay.
- Tách **not checked** khỏi **PASS**. Dùng focused tests, typecheck/build đủ phạm vi; không tạo hệ thống automation nặng chỉ để hợp thức hóa thay đổi.

Không áp đặt camera, màu, pixel-art, hiệu ứng hay con số cụ thể ở phần này.

## 7. Audit checklist trước/sau task

**Trước:**
- [ ] Có task ID, một mục tiêu, source docs/ref đúng revision, trạng thái và phạm vi đã duyệt nếu chuẩn bị code.
- [ ] Biết rõ điều được thay, điều không được thay, các tiêu chí pass/fail, quyền đổi thiết kế và next gate.
- [ ] Nếu ref chưa approved và nhiệm vụ là implementation visual: STOP.

**Sau:**
- [ ] Diff đúng scope; không lén sửa design record, baseline hay gameplay.
- [ ] Evidence thật đối chiếu từng acceptance; ghi phần chưa kiểm/điểm khác biệt.
- [ ] Typecheck/build/focused test khi code liên quan; preview app chỉ khi hữu ích.
- [ ] Lưu task ID, revision, refs, commit, technical result, user review status và đúng một next action; không suy approval từ CI hoặc deploy.

## 8. Approval, version và handoff

Mọi thiết kế: `PROPOSED → AWAITING USER VISUAL APPROVAL → APPROVED FOR IMPLEMENTATION → IMPLEMENTED/NEEDS REVIEW → ACCEPTED`. Các trạng thái tương ứng phải có evidence; được phép dừng/đổi ý/đánh dấu superseded bằng revision mới, không sửa ngược lịch sử.

Mỗi prompt Codex ngắn, dạng:
`TASK ID | READ approved spec/ref | DO 1 change | DON'T | ACCEPTANCE | CHECK | COMMIT + HANDOFF | STOP`.

Mỗi lần bàn giao: `Task ID | status | approved design/ref revision | changed files | evidence | checks | commit/deploy | blockers | next action`. Design-only không có ref approved thì ghi rõ `NOT YET APPROVED`.

## 9. Phạm vi hiệu lực

**A-H1 contract Revision 2: APPROVED.** Các quy tắc ở trên có hiệu lực với Combat V2 khi được viện dẫn từ `AGENTS.md`; không chờ hoặc ghi `NEXT ACTION` trong Harness đã chốt. **Tiến độ các bước A1/A2/A3/A-H2/A-H3/A-H4, gate và NEXT ACTION nằm duy nhất ở `MASTER_PLAN.md` + mục CURRENT của `HANDOFF.md`.** Task riêng vẫn phải có NEXT ACTION theo mục 8.

Baseline visual/gameplay chỉ tham khảo khi chưa có user-approved replacement trong scope. Gate A chưa xong thì không production redesign.

## 10. Nguồn sửa đổi

User ngày 2026-11-12, hội thoại hiện tại không permalink: “cũng khá ổn, nhưng mà t thấy nó bỏ vô quy định về top 3/4 vâng vâng, cái này chỉ nên là ref nếu chưa có j thay thế, k set cứng như vậy, có thể trong quá trình làm t sẽ đổi ý thì sao? harness này là bộ khung quy định những thứ bắt buộc follow, boundaries, verify, …”. Đây là phản hồi tạo Revision 2; A-H1 sau đó đã được user duyệt bằng “ok, làm tiếp đi” trong lượt kế tiếp.
