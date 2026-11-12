# CURSEBREAK V2 — A2 Visual Language / Design Bible

> **A2 APPROVED · revision 1 · 2026-11-12.** User: “ok tiếp đi” sau khi được đề nghị duyệt A2; chỉ chấp thuận creative direction cấp cao, không duyệt hình/asset hay gameplay cụ thể.  
> Đây là **creative direction có thể thay đổi**, KHÔNG phải luật của `HARNESS.md`. A1 Experience Vision đã được user chấp nhận ngày 2026-11-12. Đề xuất này chưa cho phép sản xuất sprite/gameplay. Không thay `ART_BIBLE.md` hoặc decision đã được duyệt.
>
> **Quy tắc đọc:** `HARNESS.md` quản lý workflow/boundaries/verification; tài liệu này mô tả lựa chọn nghệ thuật **để đề xuất và xin duyệt**. Baseline từ `ART_BIBLE.md` và gameplay hiện hành chỉ là reference fallback khi chưa có thiết kế mới thay thế.

## 1. Mục tiêu cảm giác và thứ tự ưu tiên

**Mass Slaughter × Stylish Combat × Explosive Chain Reactions.** Quái thường dễ hạ, nhưng đòn trúng phải có kết quả nhìn thấy; sự biến đổi qua Mutation/Curse phải thể hiện bằng thay đổi cách đánh, vật thể/hiệu ứng và hệ quả thật, không chỉ damage số hay icon.

Thứ tự đề xuất khi xảy ra xung đột: **đọc được Player và nguy hiểm → phản hồi đúng sự kiện combat → cảm giác lực/sức mạnh → spectacle → chi tiết trang trí**. Đây là ưu tiên sáng tạo A2, **có thể đổi theo review**, không khóa trong harness.

## 2. Baseline và các hướng có thể thay

| Hạng mục | Baseline hiện có (reference, KHÔNG phải V2 locked) | Quyền thay ở V2 |
| --- | --- | --- |
| Góc nhìn | top-down ¾, 4 hướng actor | có thể chọn góc nhìn, số hướng, phối cảnh khác |
| Mỹ thuật | Fractured Geometry / Neon Occult, pixel actor | có thể đổi style, độ chi tiết, tỉ lệ |
| Player | mask/giáp jade, ivory, core, blade/gun | thay được silhouette, vật liệu, tạo hình |
| Palette | nền tối, mint player, nhiều màu role/threat | có thể đổi toàn bảng màu/hierarchy có lý do |
| VFX | slash, Rupture, Detonate, hitflash, feedback có sẵn | có thể thiết kế lại motion/texture/shape |
| Boss | Chain Warden, phase transform hiện hành | có thể thay diện mạo/nhịp chuyển cảnh/phase bằng scope riêng |
| HUD | hệ icon/bevel hiện tại | có thể thay layout, hierarchy, visual style |

**Quy trình đổi hướng:** mỗi đề xuất ghi *Baseline → Candidate → Ảnh minh họa → Phạm vi ảnh hưởng → Cái giữ lại → Test cần chạy*. User duyệt mới có quyền triển khai. Không ngầm coi fallback là ràng buộc bất biến.

## 3. Visual grammar đề xuất

### 3.1 Shape, silhouette, contrast
- Player nhận ra ngay ở tỷ lệ chơi thật và khi gần đông quái. Nguy hiểm tức thời có tín hiệu hình/độ tương phản riêng với hiệu ứng tấn công của Player.
- Mỗi loại enemy cần tạo dáng, nhịp và dấu hiệu hành vi phân biệt; không chỉ recolor một sprite.
- Luôn kiểm tương phản khi effect overlap; không cần giữ palette cũ nếu một candidate tốt hơn được user duyệt.
- Quy tắc vật liệu gợi ý: mảng lớn có cấu trúc, chi tiết tập trung vào chỗ truyền vai trò (vũ khí/core/giáp), background không tranh spotlight.

### 3.2 Motion và animation
- Một hành động nhìn đủ **đọc được ý định → chuyển động chính → điểm tiếp xúc → recovery**. Không bắt buộc tăng duration hoặc input lag để thêm animation.
- **Idle:** nhân vật có sức sống mà không tạo chuyển động ồn.
- **Move/Dash:** weight transfer/hướng tiến, phản hồi tăng tốc, hướng/vũ khí không lệch với gameplay thật.
- **Light 1/2/3:** phân biệt nhịp, đường kiếm, điểm kết thúc và tư thế; không phải một slash phát lại ba lần.
- **Heavy:** anticipation và payoff có trọng lượng, nhận ra từ pose và kết quả; không chỉ zoom/shake.
- **Basic/Charged:** vệt/muzzle/charge/readability khác nhau và khớp projectile thật.
- **Hit/Death:** trả lời rõ đòn có trúng không, vật thể chết khi nào, có detonate/chain hay không. Địch fodder không cần sống lâu hơn để biểu diễn animation.
- Motion curve/duration/frame count chỉ chốt trong *design card từng action*, kiểm với input window và combat timing hiện hành trước khi code.

### 3.3 Impact, feedback, screen response
- Trình tự tham khảo: **contact → local reaction → debris/trail/after-effect → clean-up**. Chia mức phản hồi theo loại đòn và đối tượng; light ngắn/đọc nhanh, heavy có trọng lượng, detonate có không gian/chuỗi lan.
- Camera shake, hitstop, flash, blur, freeze và audio là **công cụ lựa chọn theo task**, không mặc định bắt buộc và không tự vượt timing logic/ảnh hưởng điều khiển.
- Feedback gắn vào event thật; không vẽ vùng damage/telegraph giả. Tránh hiệu ứng chồng liên tục làm mất mục tiêu đang đánh.

### 3.4 Evolution: Mutation, Curse, Sigil/Branch
- Với mỗi nâng cấp cần một **visual identity** cho trạng thái hoặc hành động, một **proc signifier** nếu có trigger, và một **payoff** khớp effect gameplay. Không áp một template chung cứng cho tất cả.
- Tách **persistent changes** (chỉ khi thực sự giúp đọc build) và **event-specific VFX** (hiện khi proc); bỏ qua aura thường trực nếu khiến cảnh ồn.
- Curse phải thể hiện cả lợi ích và rủi ro bằng tín hiệu có thể học được, không chỉ một hiệu ứng màu đỏ chung.
- Kết hợp nhiều effect cần **ưu tiên theo sự kiện/threat**, budget hình ảnh có chủ đích, ẩn bớt thứ cấp lúc cao điểm; không yêu cầu số particle cố định tại A2.
- So sánh cùng build ở mốc early/mid/late hoặc theo từng draft thật, đặc biệt build phòng thủ, counter và mobility — **không ép mọi build thành AOE**.

### 3.5 Enemy, Boss, arena, HUD, sound
- **Fodder:** quái yếu, kill nhanh, death/hit rõ nhưng không chiếm quá nhiều thời lượng màn hình.
- **Elite:** animation windup/recovery và armor/status dễ hiểu; khó vì pattern, vị trí và kỹ năng, không mặc định do HP.
- **Boss:** arrival, phase threshold, transform, phase 2 và defeat nên có key moment riêng; concept mới không được tự chỉnh phase logic.
- **Arena:** làm nền cho hành động và telegraph; màu sáng/ornament nguy hiểm phải rõ là art hay mechanic thật.
- **HUD:** bớt tranh chú ý lúc combat, tăng khả năng nhìn trạng thái build, charge và cooldown có thật. Thiết kế UI cụ thể thuộc task riêng.
- **Audio:** nhấn đúng contact/proc/phase; đang có sound direction Pure Synth/Retro Arcade, Punchy & Controlled làm baseline; được phép đề xuất đổi theo approval riêng.

## 4. Ràng buộc chất lượng và target viewports

Mọi concept phải có ít nhất một kiểm chứng **ở kích thước xuất hiện thực trong game**, không chỉ bảng minh họa crop lớn. Khi liên quan scene đầy đủ, cần mobile portrait/touch và desktop 16:9; kiểm khi nhiều mob, telegraph cùng hiện, màu/contrast suy giảm. Mốc 390×844 và 1920×1080 là **fixture đánh giá**, không phải quy định camera hoặc layout vĩnh viễn.

Đánh giá impact dựa trên **frame thực và hành động đúng trigger**, không đánh giá chỉ bằng hình tĩnh. Ưu tiên giải pháp nhẹ cho browser, không thêm shader/pipeline/dependency chỉ vì đẹp trên concept.

## 5. Reference contract cho bước thiết kế cụ thể

Mỗi task visual sau Gate A cần:
1. **Task ID + design revision + trạng thái** (PROPOSED/APPROVED) và phạm vi.
2. **Before:** ảnh/screenshot runtime hiện tại đúng tỷ lệ; nêu phần sẽ giữ.
3. **After:** ảnh concept/turnaround/keyframe/storyboard *riêng cho thay đổi đó*, nêu rõ chưa phải asset production.
4. **Comparison:** cùng ngữ cảnh (góc, scale, lighting, crowd nếu liên quan); chú thích khác biệt quan sát được.
5. **Constraints:** mapping tới mechanics/input có thật, dự kiến assets và platform.
6. **Acceptance:** pass/fail nhìn thấy được + cách kiểm trong preview app, cùng phần chưa kiểm.
7. **Approval evidence:** ai duyệt, ngày, revision/ảnh cụ thể; nếu chưa duyệt phải STOP trước implementation.

Thiếu hình hợp lệ → chỉ được làm design/đề xuất hình, không được Codex tự vẽ/tự chốt rồi đưa production. Reference protocol chi tiết về ID/metadata/version thuộc **A3**.

## 6. Các quyết định CHƯA được chốt

- Style cuối, camera/góc nhìn, số hướng, asset resolution, palette cuối, toàn bộ silhouette/pose, tốc độ animation, VFX library và budget số cụ thể.
- Có redesign Player hay giữ một phần body hiện tại; texture/compositing, FX layering và cách phối hình giữa Evolution variants.
- Boss appearance/phase choreography; HUD/arena/sound concept cụ thể.
- Bất kỳ chỉnh sửa gameplay/balance, enemy HP hay timing.

Tất cả = **TBD**, chỉ được giải quyết bằng design card/ref có approval riêng. A2 không tự chọn các quyết định này.

## 7. A2 acceptance / chuyển bước

**A2 DOC complete** khi tài liệu trình bày đủ shape/motion/impact/evolution/enemy/boss/visual hierarchy, phân biệt baseline/proposal/TBD và requirements cho references; không buộc chọn style cuối lúc A2.

**A2 USER APPROVED** khi user chấp nhận các nguyên tắc thể hiện và việc giữ lựa chọn sáng tạo mở. Chỉ khi đó mở **A3 — Reference & Evidence Protocol**; kế tiếp H2 task template, H3 enforcement, H4 dry-run. Sau Gate A, thiết kế B1 với hình tham chiếu → user visual approval → **code thay đổi đầu tiên ngay**, không cần doc toàn bộ phase B/C/D/E.

## 8. Status

- A-H1: Approved Revision 2, harness tổng thể chưa enforce.
- A1: user chấp nhận Experience Vision ngày 2026-11-12; cập nhật nguồn trong MASTER_PLAN/HANDOFF.
- **A2: APPROVED Revision 1 — creative direction only.**
- A3/H2/H3/H4: not started.
- Không sửa `AGENTS.md`, `ART_BIBLE.md`, `GAME_BRIEF.md`, `DESIGN_DECISIONS.md`, game code/assets; docs-only, không build/deploy.

**NEXT ACTION:** user review/chỉnh/duyệt A2. Sau đó mới A3.
