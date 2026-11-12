# CURSEBREAK V2 — A1 EXPERIENCE VISION

> **PROPOSED · Revision 1 · 2026-11-12 · AWAITING USER REVIEW.**
> Tài liệu thiết kế trải nghiệm cấp cao, **không phải luật bất biến của Harness**, cũng không phải approval artwork/gameplay/balance. Mọi phương án cụ thể có thể được thay thế theo yêu cầu user, được version và ghi scope. A1 chỉ chốt **người chơi cần cảm nhận điều gì**; A2 mới đề xuất **ngôn ngữ hình ảnh thể hiện điều đó như thế nào**.
> Nguồn: yêu cầu redesign combat, quái máu giấy và cảm nhận mạnh lên; dùng `HARNESS.md` Revision 2 đã user duyệt làm quy trình. Mốc gameplay hiện hành trong `GAME_BRIEF.md`, không tự tạo mechanics.

## 1. North Star — Trải nghiệm mục tiêu

**Một đấu sĩ càng lúc càng nguy hiểm giữa đám đông kẻ địch yếu, với nhịp chiến đấu nhanh, điều khiển chính xác và các đòn tấn công giải phóng chuỗi tiêu diệt đã mắt.** Đầu run nhân vật đã đủ mạnh để hạ quái thường dễ dàng; qua Mutation/Curse và build synergy, người chơi **thấy** sức mạnh biến đổi về cách tấn công, phạm vi hiệu ứng, số mục tiêu chịu ảnh hưởng và các phản ứng dây chuyền — không chỉ qua chỉ số.

Đích cảm giác: **Mass Slaughter + Stylish Combat + Explosive Chain Reactions**. Đây là mục tiêu trải nghiệm/creative direction cấp cao, không ấn định camera, sprite style, palette, VFX grammar hay một loại attack mới.

## 2. Các trụ trải nghiệm (proposed)

| Trụ | Người chơi cảm nhận | Tín hiệu quan sát được (không khóa cách vẽ) | Anti-goal |
| --- | --- | --- | --- |
| **Immediate Power** | Từ giây đầu đã mạnh, đánh quái thường sướng tay | Mục tiêu thường gục nhanh, hit và kill feedback đủ rõ | Biến quái thường thành HP sponge chỉ để show animation |
| **Distinct Actions** | Light combo, Heavy, ranged, charged, dash và detonate có tính cách riêng | Chỉ nhìn chuyển động/impact đã phân biệt được hành động đang xảy ra | Một vệt slash, flash hoặc sound dùng chung cho tất cả |
| **Visible Evolution** | Có build là sức mạnh biểu hiện khác đi | Before/after skill, trang bị/thể hiện nhân vật, số mục tiêu/chuỗi hit thay đổi theo cơ chế thật | Chỉ buff damage số, icon hay aura vĩnh viễn không gắn kết quả |
| **Crowd Satisfaction** | Nhiều quái dễ bị hạ, clear mạnh dần và liên tục | Thay đổi phạm vi tiêu diệt và propagation/cascade nhưng vẫn đọc được nhân vật | Đổ thêm hiệu ứng đến mức che telegraph hoặc mất định hướng |
| **Meaningful Threats** | Fodder tạo power fantasy; Elite và Boss thử kỹ năng | Dễ phân biệt đe dọa, windup/action/payoff, room để né/phản đòn | Tăng HP mọi loại quái làm khó một cách cơ học |
| **Peak Moment** | Boss arrival/phase shift thực sự là cao trào | Có dấu mốc audiovisual rõ và pha đánh sau khác trước theo cơ chế đã được duyệt | Cutscene hào nhoáng nhưng Boss vẫn y hệt, hoặc tín hiệu giả nguy hiểm |

## 3. Power Curve — ba mốc quan sát (không phải con số damage)

**Early / ví dụ ~0:30:** player mạnh sẵn ở quy mô cục bộ; từng nhát/shot đủ dọn fodder ở gần; người xem hiểu ngay cách nhân vật tác động lên kẻ địch.

**Mid / ví dụ ~2:00:** các Mutation/Curse/build effect đã làm thay đổi cách tiêu diệt đám đông. Một quyết định build có dấu hiệu riêng và gây kết quả combat khác so với trước.

**Late / ví dụ ~4:00:** build hoàn thiện tạo khoảnh khắc clear lớn hoặc chain reaction nổi bật, không đồng nghĩa màn hình toàn particle. Người xem nhìn gameplay không HUD vẫn nhận ra đây là cùng nhân vật **mạnh hơn/biến đổi hơn** giai đoạn đầu.

*Lưu ý:* Các mốc trên là **scenario review minh họa**, không phải yêu cầu bắt buộc spawn/draft mới đúng giây đó, không bảo đảm mọi build có cùng AOE. Build phòng thủ/counter/mobility có thể thể hiện sức mạnh qua khả năng sống sót, né/phản công, nhịp chiến đấu chứ không phải số kills thuần túy. Chỉ đề xuất so sánh từng build với baseline của chính nó.

## 4. Mutation/Curse là lựa chọn có kết quả, không phải trang trí

Một nâng cấp chỉ được gọi là **visually meaningful** nếu:
1. Có **tín hiệu chọn/nhận** đủ rõ trong bối cảnh chơi thật (nếu gameplay phát sự kiện nhận).
2. Có **dấu hiệu nhận diện khi trạng thái đang tồn tại** hoặc sự thay đổi trong action/proc mà người chơi thấy được; không bắt buộc aura permanente.
3. Có **payoff tương ứng với trigger và effect thật** (ví dụ chain, echo, charge, risk cue); không vẽ damage/nguồn nguy hiểm giả.
4. Cộng hưởng nhiều effect vẫn dễ đọc; được phép giảm/ẩn effect thứ cấp có chủ đích khi tranh chú ý.

Các cách thể hiện cụ thể (core, giáp, vũ khí, trail, camera, âm thanh, màn hình) thuộc A2 và design card riêng, không khóa ở A1. Chưa tự kết luận từng Mutation/Curse nào phải có loại hình ảnh nào.

## 5. Combat Feel — ưu tiên cảm nhận chứ không đổi luật tấn công

Hành động nên có nhịp **ý định → ra đòn → tiếp xúc/phản ứng → hồi phục** đủ rõ để người chơi hiểu sự khác biệt, nhưng **không yêu cầu thêm độ trễ input hoặc thay timing hiện tại**. Feedback phải hỗ trợ luật combat thật (hitstop, hit reaction, damage, death, proc) và giữ điều khiển nhanh/precision.

Nếu concept mới đòi thay timing/combo/collider/AI, đó là **design change riêng** phải xác định tác động, duyệt, chia task và mới được implement; không coi “visual redesign” là quyền chỉnh balance.

## 6. Enemy/Boss Experience

- **Quái thường:** yếu, đông khi phù hợp pacing; đóng góp nhịp clear và sự thỏa mãn. Vẫn cần nhận diện loại đe dọa, đòn đang chuẩn bị và cái chết của chúng.
- **Elite/specialist:** đặt ra các câu hỏi về vị trí, timing, kết hợp melee/ranged hoặc cơ chế riêng; difficulty không chỉ là HP.
- **Boss:** có màn giới thiệu mối nguy, attack readability, và phase chuyển đổi đủ ý nghĩa để người chơi nhận biết **bằng cảnh chơi**, không chỉ đổi màu thanh máu. Phase transition có thể cải tổ hình/nhịp/âm thanh, nhưng thay Boss mechanics cần scope/approval riêng.

Không chốt visual identity, phase trigger/timing hoặc Boss attacks mới trong A1.

## 7. Các ưu tiên khi căng thẳng giữa mục tiêu

Thứ tự ưu tiên **đề xuất để thảo luận**, không phải quy tắc vĩnh viễn: **combat readability và control precision > phản hồi xác thực luật game > power fantasy rõ ràng > spectacle trang trí**. Khi visual đẹp nhưng che nguy hiểm hoặc ảnh hưởng performance/mobile thì phải chỉnh cách thể hiện thay vì mặc nhiên đổi gameplay.

Desktop và mobile phải cho phép cùng một người chơi nhận biết đòn, nguy hiểm và sự tiến hóa ở chất lượng tương đương; không dùng hình mockup phóng đại làm tiêu chí duy nhất.

## 8. Cách nghiệm thu A1 (design-level, chưa cần code)

A1 đạt khi user xác nhận cả bốn câu hỏi:
1. Đây có đúng là cảm giác người chơi cần có (đánh quái giấy nhưng ngày càng bá đạo) không?
2. Nhịp early → mid → late có đúng ý, có chỗ nào sai với các build không thiên AOE không?
3. Thách thức Elite/Boss có nên nằm ở hành vi/định vị/cơ chế thay vì HP chung không?
4. Thứ tự ưu tiên khi hiệu ứng đẹp nhưng ảnh hưởng readability/precision có phù hợp không?

Khi được duyệt A1, **A2 — Visual Language** có nhiệm vụ tạo lựa chọn cụ thể hơn: cách thể hiện silhouette/shape, palette/motion/impact/VFX, hierarchy và các ví dụ minh họa; không ép phải trung thành vĩnh viễn với Art Bible cũ. Mọi alternative vẫn có thể được user chọn/đổi.

## 9. Ranh giới, trạng thái và next action

- **A-H1**: process-only HARNESS Revision 2 đã được user cho phép tiến tiếp (2026-11-12); chưa có enforcement nối AGENTS, còn A-H2/H3/H4.
- **A1**: tài liệu này **PROPOSED**, chưa acceptance, không có artwork/production permission.
- **A2/A3/H2/H3/H4**: chưa bắt đầu.
- **Preview App**: công cụ review có sẵn, không phải Design Harness.
- Không sửa `ART_BIBLE.md`, `DESIGN_DECISIONS.md`, `GAME_BRIEF.md`, gameplay, balance, code hoặc assets; không chạy build/deploy với docs-only.

**NEXT ACTION duy nhất:** user review/chỉnh/duyệt A1 Experience Vision; chỉ sau đó mới bắt đầu A2.
