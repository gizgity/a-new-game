# Dungeon redesign — checklist trước implementation

Task: DUNGEON-BRAINSTORM-01 · Revision 38 · 2026-11-14.

Đọc nhanh sau compact: [RESUME.md](RESUME.md). Log Q01–Q35/C01–C05 bên dưới được giữ nguyên; câu tiếp theo Q36 **chưa hỏi/chưa chốt**. User yêu cầu compact và giữ các câu hỏi ngày 2026-11-14; chỉ cập nhật kết quả Q35 trong lượt checkpoint này.
Trạng thái: BRAINSTORM / CHECKLIST, chưa spec production hoặc quyền implementation.
Nguồn: hội thoại hiện tại, không permalink. User yêu cầu “đồng ý, list các vấn đề còn tồn đọng để clear hết trước khi bắt đầu”.

## Hướng đã thống nhất trong brainstorm

- Dungeon random liền mạch, camera theo nhân vật, cảm giác clear endgame map ARPG/PoE; nhiều bầy đông, white/blue/amber và Boss cuối map.
- Không còn deadline clear map; blue/amber đóng góp mốc draft build Q30/Q31 (thay hướng nhận Mutation/Curse trực tiếp ban đầu); cần cơ chế hồi máu.
- Dungeon nối thành hành trình, chọn node tiếp sau Boss; node có buff/debuff cộng dồn, clear dungeon nhận phần thưởng/nâng cấp để đi tiếp.
- **Làm rõ mới nhất 2026-11-14 (C01):** tree có các nấc tiến tới Boss cuối mạnh nhất; mỗi nấc có thể có 2–3 node, chỉ chọn một và disable các node còn lại cùng nấc. Không suy quyền quay lại node đã clear/chọn nhánh khác cùng nấc. Số nấc được chốt tiếp ở Q07, kết quả final ở Q10. Phần endless không đích của Q01 là hướng lịch sử được làm rõ/thay thế trong scope tree này; không ép giữ endless.
- **Q07 đã chốt 2026-11-14:** 9 nấc tổng; nấc 1–8 chọn một trong 2–3 dungeon/nấc, nấc 9 một dungeon Boss cuối mạnh nhất. Đi qua 9 node được chọn. Nhịp đầu/giữa/cuối theo các chặng 1–3/4–6/7–9; không tự thêm biome/Boss/content.
- **Q08 user sửa 2026-11-14:** node có đường nối riêng như hướng user tham khảo StS, chỉ chọn node nấc sau có đường nối từ node hiện tại. Được xem trước toàn tree để tự chọn tuyến, không chỉ nấc kế. Phương án chọn tự do mọi node nấc sau của agent không được chọn; chưa chốt số đường nối/node hoặc chi tiết thông tin công khai. **Q06 user đồng ý** cùng lượt: khi chơi tiếp sau nghỉ, dungeon của node dở giữ nguyên, bắt đầu lại từ đầu theo Q04–Q05, không đổi nhánh/backtrack.
- **Q09 đã chốt 2026-11-14:** mọi node trên tree hiển thị đặc điểm dungeon/nguy hiểm tương đối, buff/debuff đầy đủ (giá trị/hiệu lực/cộng dồn), nhóm thưởng chính và Boss nếu node đã xác định Boss; chi tiết layout/bầy/kết quả thưởng cụ thể khám phá trong dungeon. Catalog/công thức đánh giá nguy hiểm chưa chốt.
- **Q10 đã chốt 2026-11-14:** hạ Boss nấc 9 là thắng/kết thúc hành trình; tổng kết/nhận thưởng hoàn thành, có thể bắt đầu tree random mới với build reset, giữ unlock/progression vĩnh viễn đã nhận. Loại/giá trị thưởng còn D11; không nối tự động sang tree khác với nguyên build.
- **C03 mới nhất 2026-11-14:** user đồng ý hướng Q12 ở mức tổng thể (“cũng đc”), muốn rework luôn skill vì chỉ chém/bắn còn đơn giản; tham khảo PoE với các loại cơ bản trước, reward có thể unlock skill tấn công/hỗ trợ. Đây là mở scope thiết kế, chưa duyệt skill catalog/runtime/artwork. User yêu cầu nhánh riêng; đã tạo `codex/dungeon-skill-rework` từ main `63f4f3b88826eb556664bf240e8be538e8f654e6`, main ref giữ nguyên. Chi tiết C03/Q13 bên dưới.
- **Q13/C04 2026-11-14:** user “y, đồng thời kèm chế độ tự ra đòn” chốt active skill + support gắn skill tương thích và yêu cầu thêm chế độ tự ra đòn. Chưa chốt phạm vi tự động, roster/số ô/aim/cost/input. Tự ra đòn là scope mới do user giao, không được bác vì baseline input cũ; chưa suy thành autoplay di chuyển/Dash/heal/chọn build hoặc tự dùng mọi skill.
- **Q14 đã chốt 2026-11-14:** user “y 1 skill chính và 2 skill phụ manual”: một skill tấn công chính được chọn cho auto + hai skill phụ dùng tay. Support gắn skill theo trigger, có bật/tắt auto ở cả hai nền tảng theo phương án đã hỏi. Dash/bình máu có chiếm hai ô phụ không chưa chốt; roster/cost/target/lifecycle còn mở.
- **Q15 đã chốt 2026-11-14:** user “y riêng”: Dash là thao tác né manual cố định, nút riêng, không chiếm hai ô skill phụ. Bình máu, layout và thay đổi thông số/biến thể Dash chưa chốt.
- **Q16 đã chốt 2026-11-14:** user “y”: bình máu cơ bản manual có nút riêng, không chiếm hai ô skill phụ; mọi build có nguồn hồi phục nền. Bộ điều khiển: một main auto + hai skill phụ manual + Dash + bình máu. Charge/cách nạp/lượng hồi/Boss interaction và HUD chưa chốt.
- **Q17 đã chốt 2026-11-14:** user “y”: pool main nền có bốn kiểu để chọn một: melee quét cung, projectile, nova quanh người, channel tia theo hướng. Tên/nguyên tố/thông số/art và tương thích support chưa chốt; không đồng nghĩa mở hết đầu game.
- **Q18 đã chốt 2026-11-14:** user “y”: pool bốn vai trò skill phụ manual để chọn hai theo build: burst/AoE, khống chế, phòng thủ, triệu hồi trụ. Trụ đặt bằng tay rồi tự bắn ngắn hạn; chưa timing/cap/cost/art hoặc mở hết đầu game.
- **Q19 đã chốt 2026-11-14:** user “y”: main tối đa ba support, mỗi skill phụ tối đa hai, tổng trần bảy ô. Chưa cấp đầy đầu game, rule trùng/cách nhận/compatibility/tradeoff và Dash/bình chưa chốt nâng cấp/support riêng.
- **Q20 đã chốt pool, cooldown còn mở 2026-11-14:** user “y, nhưng mà lưu ý chưa có quyết định về skill có hồi chiêu”: đồng ý chín support nền, riêng support Hồi chiêu chỉ là loại có điều kiện nếu có skill thực sự dùng cooldown. Không tự gán cooldown cho bất kỳ skill nào để hợp thức hóa support. Main/manual/mana/resource/charge/cooldown phải được hỏi rõ.
- **Q21 đã chốt 2026-11-14:** user “y”: hai skill phụ manual mỗi skill có cooldown riêng, không chung cooldown giữa hai ô. Chưa số giây/start/cancel/charge/uptime cap; main/mana/Dash/bình không được chốt cooldown qua Q21.
- **Q22 đã chốt 2026-11-14:** user “y”: main dùng attack/cast cadence, nova theo nhịp/channel duy trì, không thêm cooldown kỹ năng riêng như hai phụ. Vẫn có timing/điều kiện thực tế; mana/cost/di chuyển/priority chưa chốt. Hồi chiêu không tự áp main.
- **Q23 đã chốt 2026-11-14:** user “y k dùng mana”: bộ ba skill không dùng mana/thanh năng lượng chung; main cadence, hai phụ cooldown riêng. Không thay mana bằng tên resource chung khác hoặc dùng mana giả làm tradeoff support; Dash/bình và cơ chế riêng của hệ cũ chưa được chốt lại qua Q23.
- **Q24 đã chốt 2026-11-14:** user “y”: mỗi loại support tối đa một lần trong cùng skill; có thể cùng loại trên skill khác nếu tương thích. Chưa chốt một bản dùng chung hay cần nhiều bản, cách nhận/drop/upgrade/equip.
- **Q25/C05 2026-11-14:** user “y. các bản dư có thể đc phân giải thành nguyên liệu để nâng cấp skill”: mỗi bản support chỉ gắn một skill, muốn cùng loại ở hai skill cần hai bản; bổ sung phân giải bản dư → nguyên liệu nâng cấp skill. Chưa lifetime của nguyên liệu/level, loại skill được nâng, mức nâng/giá/chuyển skill/manual hay auto phân giải. Đây là resource upgrade do user nêu, không phải mana dùng để cast.
- **Q26 đã chốt 2026-11-14:** user “y” rồi hỏi “btw còn bao nhiêu câu nữa”: nguyên liệu phân giải/cấp skill giữ qua các node trong hành trình, reset khi chết/thắng/chủ động kết thúc; unlock lâu dài giữ. Nghỉ/restart vẫn theo checkpoint đầu node Q04–Q06. Cần báo phần còn lại, không suy yêu cầu dừng hoặc tự duyệt các mục chưa bàn.
- **Q27 đã chốt 2026-11-14:** user “y”: nguyên liệu nâng ba active cấp1–5 trong hành trình, tăng hiệu lực chính theo skill, chi phí tăng dần; support bản đầu không level riêng. Chưa bảng price/yield/multipliers hoặc refund/kế thừa khi đổi skill.
- **Q28 user sửa 2026-11-14:** user “y, và nhận random”: bộ đầu một main cấp1 + một phụ cấp1 + một support tương thích cho main, ô phụ2 còn trống; mở sẵn ô support3/2/2. Bộ đầu **được cấp ngẫu nhiên**, thay phương án tự chọn từ catalog của agent. Roll trong catalog đã mở, support phải hợp lệ cho main; không suy random tất cả thưởng trong run hoặc user chốt draft3chọn1 ở bộ đầu.
- **Q29 đã chốt 2026-11-14:** user “3”: mốc thưởng build quan trọng trong hành trình random tối đa ba lựa chọn hợp lệ/lấy một; ưu tiên có hướng dùng được với build nếu pool cho phép, pool nhỏ hiện số thật. Bộ đầu vẫn cấp random trực tiếp theo Q28. Nguồn/tần suất/danh mục/flow draft chưa chốt.
- **Q30 đã chốt 2026-11-14:** user “y”: dungeon1–8 có một mốc draft từ tiến độ clear blue/amber (amber đóng góp nhiều hơn) và một mốc sau Boss; Boss đầu bảo đảm lựa chọn lấp ô phụ2 nếu còn trống. Final nấc9 có mốc trong map, sau Boss cuối chỉ thưởng hoàn thành. Chưa threshold/pool/flow/cách xử lý hệ Mutation-Curse hoặc charge bình.
- User “đồng ý” sau đề xuất kết hợp tree + chuyển map liên tục, build/buff giữ trong chuỗi rồi reset khi chuỗi kết thúc, giữ unlock/progression sang lượt mới. Ghi nhận hướng tổng thể, không suy đã duyệt các luật/số cụ thể.
- Bình máu nạp từ combat, nhận nâng cấp không ngắt từng elite, tiến độ clear trước Boss, reward sau Boss là hướng từ đề xuất trước; điều kiện/ngoại lệ/số cụ thể cần chốt trong các mục dưới.

## Các điểm cần chốt

| ID | Vấn đề | Quyết định còn thiếu |
| --- | --- | --- |
| D01 | Định nghĩa chuỗi dungeon và kết thúc | C01/Q07: tree 9 nấc tới final, supersede endless Q01. Q02: death kết thúc/reset build/giữ progression đã nhận. Q03: chủ động kết thúc sau Boss. Q04–06: nghỉ giữ tree/restart node với checkpoint nhân vật, dungeon giữ nguyên. Q10: hạ final là thắng/kết thúc. Còn bỏ chuỗi giữa map và chi tiết chốt thưởng. |
| D02 | Dungeon tree | C01 + Q07: 9 nấc tổng, 1–8 mỗi nấc chọn một trong 2–3 dungeon và khóa các node còn lại; nấc 9 một dungeon Boss cuối. Q08: đường nối riêng, xem trước toàn tree. Q09: công khai đặc điểm/nguy hiểm tương đối/buff-debuff/nhóm thưởng/Boss. Còn quy tắc sinh đường nối/số nhánh và thời điểm khóa lựa chọn; chưa chốt catalog/công thức nguy hiểm. |
| D03 | Buff/debuff cộng dồn | Tác động lên người chơi, quái hay map; hiệu lực từ map nào và kéo dài tới đâu; cộng cùng loại ra sao, giới hạn và tổ hợp bị cấm; phân biệt với Curse của build; có gỡ/thay modifier không. |
| D04 | Bố cục map và điều hướng | Quy mô/density/độ dài mục tiêu dù không timer; random layout hay cả biome/địa hình; đường chính/nhánh cụt/đường vòng; minimap/fog/chỉ hướng Boss; độ rộng đường và việc đi xuyên/vượt vật cản. |
| D05 | Bầy quái và rarity | Vai trò white/blue/amber; blue là thủ lĩnh đơn hay cả nhóm magic; bầy nào có thủ lĩnh; kích cỡ và phối vai trò, kỹ năng elite; phạm vi phát hiện/truy đuổi/kéo nhập bầy; respawn/summon và giới hạn active cùng lúc. |
| D06 | Mutation/Curse — baseline được Q31 supersede | Q31 chốt bản rework đầu bỏ slot/draft M/C riêng, thay nguồn M/C blue/amber ban đầu bằng mốc reward build Q30. Core mới skill/support/level/node tradeoffs. Không tự chuyển cả pool/effect cũ hoặc giữ thêm4M2C ngầm; lịch sử approval/runtime cũ giữ nguyên, mapping hiệu ứng nếu cần phải duyệt riêng. |
| D07 | Hồi máu | Q16: bình máu nền manual có nút riêng ngoài hai ô phụ. Còn charge/cách nạp/lượng-tốc độ hồi/giới hạn dùng, input cụ thể; tài nguyên trong Boss không adds; hồi sau Boss; tương tác build heal/anti-heal và giới hạn farm. |
| D08 | Điều kiện Boss/clear map | Đi đến cuối là được đánh hay cần tiến độ clear; quái nào tính tiến độ; tránh tìm white cuối và chạy thẳng bỏ cả map; Boss chết có chuyển ngay không, xử lý quái sống/loot/nâng cấp chưa nhận trước khi rời map. |
| D09 | Danh sách Boss và sự đa dạng | Giữ Chain Warden bao lâu, đổi pattern/modifier theo node hay thêm Boss; mốc Boss mạnh; số lượng nội dung cho bản đầu và phần để sau, chưa tự cấp quyền artwork/content mới. |
| D10 | Difficulty và power curve | Độ khó tăng theo độ sâu/node/build thế nào; phần đến từ mật độ/phối quái/skill và phần từ HP/damage; giữ white clear nhanh; giới hạn tốc độ/chain/hồi máu/VFX và các tổ hợp không thể vượt qua. Không thay luật theo thiết bị. |
| D11 | Phần thưởng và progression | C02: xác định build/loại thưởng trước settlement; Q11 tạm gác, chưa reward vĩnh viễn mỗi dungeon. Q12/C03: hướng unlock skill/support lâu dài. Q25–26: support dư phân giải thành nguyên liệu nâng skill, nguyên liệu/cấp chỉ trong hành trình. Còn model nâng/nguồn/cadence/reward Boss/meta/độ sâu/hết pool/settlement, không tự mở currency khác. |
| D12 | Hệ thống cũ | Q31 bỏ slot M/C riêng; Q32 bỏ lớp Sigil/Branch riêng; Q33 gộp Anomaly vào node; Q34 giữ model Ascension0–4, clear toàn tree mở mức kế, không gate6Sigil/port nguyên Seal cũ. Còn tuning/tier modifier/Legacy economy/ticket, challenge/Codex/history/cosmetic/tutorial/audio, trigger/migration/bảo toàn dữ liệu. Không tự xóa approval cũ. |
| D13 | Combat, camera và UI trên hai nền tảng | C04 user yêu cầu chế độ tự ra đòn; phạm vi/mục tiêu/bật-tắt/manual override cần chốt cùng D16. Bộ đòn/input, target/aim qua tường, projectile/collision ở hành lang, offscreen attacks, camera/HUD/minimap; bình máu/node/reward và vi/en. Không tự khác luật combat theo thiết bị. |
| D14 | Lưu và tiếp tục hành trình | Q04–05: giữ tree/node, restart đầu node bằng checkpoint nhân vật; bỏ nâng cấp/thưởng tạm node dở, giữ thành quả node trước. Q06: giữ dungeon node đã chọn (layout/bầy/Boss/modifier), reset tiến độ clear. Còn random offer/reward khi restart, reload/crash/đóng app, pause trong phiên, migration save cũ và tránh nhận trùng thưởng. |
| D15 | Phạm vi bản đầu và cổng nghiệm thu | Map/biome/enemy/Boss nào tái sử dụng hoặc làm mới; cần concept/mockup/approved refs cho phần visual nào; chốt mục tiêu density/readability/performance trên mobile/desktop; thứ tự task nhỏ, scenario nghiệm thu chuỗi map→Boss→reward→node→map/death/save. Không code trước spec/ref/approval đúng scope. |
| D16 | Skill rework — user mở ở C03 | Q13–23: active+support, main auto/hai phụ manual/Dash+bình riêng; bốn main/bốn vai trò phụ, support cap3/2/2, chín support nền. Hai phụ cooldown riêng, main cadence không thêm cooldown kỹ năng; không mana/resource chung. Còn compatibility/trùng/tradeoff/proc cap, nhận/mở slot/equip/aim, mapping hệ cũ và unlock/build trong lượt. Làm nhánh riêng, không tự thêm inventory/crafting/passive tree/nhiều nút. |

Mỗi mục chỉ được chuyển sang đã chốt khi có nội dung và bằng chứng user tương ứng. Checklist không ghi DDR, không thay GAME_BRIEF/Art Bible/roadmap hoặc mở production. Các luật cần rõ trước code; HP/damage/drop rate và các thông số khác cần baseline thử có phạm vi + tiêu chí kiểm, không tự coi số chưa playtest là balance accepted.

## Thứ tự bàn đề xuất

D01 → D11 → D02–D03 → D06–D07 → D04–D05/D08–D10 → D12–D14 → D15.
Các mục có thể rà lại khi phát hiện phụ thuộc; thứ tự trên không cấp quyền implementation.

## Cách hỏi và ghi nhận — theo user yêu cầu

User: “hỏi từng câu 1, có recommend trước (m đi tất cả các câu để nắm tổng quát và cho recommend tốt nhất, phù hợp nhất) để t chốt xem đồng ý/từ chối/bổ sung và ghi nhận kết quả”, ngày 2026-11-13, hội thoại hiện tại không permalink.

- Rà toàn bộ D01–D15 và phụ thuộc trước khi recommend; không tối ưu riêng một mục gây mâu thuẫn phần sau. D01–D15 là nhóm vấn đề, mỗi nhóm được tách thành nhiều câu nhỏ nếu cần.
- Mỗi lượt chỉ hỏi **một quyết định**, recommend + giải thích tác động trước, chờ user đồng ý/từ chối/bổ sung; không hỏi gộp cả nhóm hoặc tự chuyển tiếp khi chưa có trả lời.
- Ghi nguyên ý câu trả lời, nội dung chốt và phần còn mở vào mục tương ứng bên dưới trước câu kế tiếp. Nếu user sửa quyết định trước, giữ dấu vết thay đổi và rà các mục phụ thuộc.
- Chốt trong buổi brainstorm không tự cấp phép code/assets/deploy. Đây là notes thiết kế, không DDR; không tự gọi skill design-decision hoặc đổi registry.

## Rà phụ thuộc trước câu đầu

Đã rà checklist D01–D15, catalog/config Legacy/Draft/Anomaly/Ascension, RunDirector và progression cùng notes Q9B/Q9C/Q9D/Q9E. Các mối nối cần giữ xuyên các câu:

- Chuỗi dài + nhiều elite buộc chốt cadence/cap/phát triển Mutation sau 4M/2C hiện tại, hiệu lực modifier và budget combat; không suy thêm slot/effect vô hạn từ việc hành trình không có điểm kết cố định.
- Tree/modifier/reward phải đi cùng depth scaling và hồi máu; giữ clear white nhanh, tránh tổ hợp hard-counter. Bố cục, aggro, target/collision/camera, density và mobile/desktop phải được xét cùng nhau.
- Economy hiện thưởng/đóng ticket theo Victory một Boss; history/challenges/unlock/Ascension theo run cũ. Cần phân biệt dungeon clear và expedition kết thúc trước khi map lại trigger, chưa tự đổi progression.
- Save hiện lưu profile/ticket/offers/progression, chưa chứng minh resume world giữa map. Hành trình dài cần chốt checkpoint/resume riêng với dừng kết thúc/chốt thưởng; không hứa hiện đã hỗ trợ.
- Phạm vi biome/Boss/art mới, UI/audio/tutorial và performance acceptance phải theo bản đầu được chốt; không lấy tham khảo PoE làm quyền mở toàn bộ content hay đổi input.

## Câu hỏi và kết quả

### Q01 — D01.1: Chuỗi có điểm kết thúc bắt buộc không?

- Trạng thái: **ĐÃ CHỐT LỊCH SỬ — PHẦN ENDLESS KHÔNG ĐÍCH ĐƯỢC C01 LÀM RÕ/THAY THẾ** ngày 2026-11-14. Giữ evidence gốc; không dùng Q01 để bác bỏ tree tới Boss cuối user vừa mô tả.
- Recommend: **chuỗi dungeon mở, có các chặng/mốc tiến độ, không tự kết thúc sau số map cố định**. Clear mốc vẫn có thể chọn node để đi tiếp.
- Lý do: giữ đúng mong muốn clear map liên tục/thử build vừa mạnh lên, có cột mốc cho reward và cảm giác tiến bộ. Hệ build/modifiers/scaling/save phải thiết kế tương ứng ở các câu sau.
- Chỉ hỏi cấu trúc độ dài hành trình. Chưa chốt số map/chặng, Boss đặc biệt, luật chết/hồi sinh/dừng/chốt thưởng/save, hoặc phần thưởng từng mốc.
- Câu trả lời user: **“đồng ý”**, ngày 2026-11-13, hội thoại hiện tại không permalink, trực tiếp sau câu hỏi Q01.
- Nội dung đã chốt: **chuỗi dungeon mở, chia thành các chặng có cột mốc; không tự kết thúc sau số map cố định; qua mốc vẫn có thể chọn node tiếp tục**. Mỗi dungeon vẫn có Boss cuối map theo hướng đã thống nhất. Số map/chặng, phần thưởng/mốc, Boss mới và các luật kết thúc khác chưa được chốt qua Q01.
- Hiệu lực sau C01: dùng cấu trúc tree theo nấc tới Boss cuối. Phần sau Boss cuối (kết thúc/thưởng/loop tiếp) còn mở, không tự suy là bắt buộc endless hoặc tự kết thúc.

### Q02 — D01.2: Khi nhân vật chết, có kết thúc chuỗi không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **khi nhân vật thực sự chết, kết thúc chuỗi hiện tại; không hồi sinh tại chỗ hoặc tải checkpoint để tiếp tục cùng build**. Lượt mới bắt đầu chuỗi/build mới theo hướng reset đã đồng ý; unlock/progression vĩnh viễn đã ghi nhận trước đó được giữ.
- Lý do: giữ ý nghĩa của chọn đường/risk–reward, hồi máu và quyết định tiếp tục; mỗi build có một hành trình và kết quả rõ. Đổi lại, hành trình dài mất build khi chết có thể gây hụt hẫng; telegraph, hồi phục và phần thưởng đã kiếm phải được xử lý công bằng ở các câu liên quan.
- Ranh giới: không tự xóa cơ chế ngăn đòn chí mạng/cứu mạng trước khi chết của build hiện có (như Soul Anchor). Không đồng nghĩa đã chốt thưởng map dở, thưởng chưa chốt, luật rút lui hoặc checkpoint save-resume khi còn sống; các mục này hỏi riêng.
- Câu trả lời user: **“yes”**, ngày 2026-11-13, hội thoại hiện tại không permalink, trực tiếp sau câu hỏi Q02.
- Nội dung đã chốt: **nhân vật thực sự chết thì kết thúc chuỗi hiện tại; không hồi sinh tại chỗ hoặc tải checkpoint để tiếp tục cùng build. Hành trình mới reset build; unlock/progression vĩnh viễn đã nhận được giữ**. Luật thưởng map dở, kết thúc chủ động và save khi còn sống vẫn hỏi riêng.

### Q03 — D01.3: Có được chủ động kết thúc chuỗi sau Boss không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **cho phép chủ động kết thúc chuỗi tại bước sau khi clear Boss, trước khi chọn node tiếp theo**. Kết thúc sẽ đóng hành trình, reset build cho lượt mới; giữ unlock/progression vĩnh viễn đã nhận, theo nguyên tắc đã đồng ý.
- Lý do: chuỗi mở cần một điểm kết thúc do người chơi chọn khi thấy hành trình đã đủ hoặc muốn thử build khác. Sau Boss là mốc rõ, dễ tổng kết và chuyển sang build mới.
- Ranh giới: đây là kết thúc thật, không giữ build để tiếp tục sau. Save/nghỉ khi còn sống và cách xử lý bỏ giữa map hỏi riêng. Chưa chốt có bonus rút lui, thưởng chưa nhận, UI cụ thể hay luật chuyển thưởng vĩnh viễn của D11.
- Câu trả lời user: **“y”**, ngày 2026-11-14 theo environment context user mới nhất, hội thoại hiện tại không permalink, trực tiếp sau câu hỏi Q03.
- Nội dung đã chốt: **được chủ động kết thúc chuỗi sau mỗi Boss, trước khi chọn node tiếp; kết thúc đóng hành trình/reset build cho lượt mới, giữ unlock/progression vĩnh viễn đã nhận**. Save/nghỉ để tiếp tục cùng build và thưởng chưa nhận vẫn hỏi riêng.

### Q04 — D01.4 / D14.1: Có được lưu và nghỉ giữa dungeon không?

- Trạng thái: **ĐÃ CHỐT — USER SỬA PHƯƠNG ÁN**, design discussion only.
- Recommend ban đầu của agent, **KHÔNG ĐƯỢC CHỌN**: cho phép chủ động lưu và nghỉ cả giữa dungeon, rồi tiếp tục từ trạng thái đã lưu. Giữ build/độ sâu/buff/debuff, HP/tài nguyên và trạng thái map/quái/phần thưởng tương ứng; không tự hồi đầy, respawn bầy đã clear hoặc cấp lại thưởng vì resume.
- Lý do: chuỗi mở và thời lượng map không bị timer giới hạn cần hỗ trợ phiên chơi ngắn, đặc biệt mobile; người chơi có thể nghỉ khi bận mà không phải kết thúc build hoặc cố đi tới Boss.
- Ranh giới: save-resume chỉ duy trì hành trình còn sống, không tải lại để đảo ngược cái chết đã chốt ở Q02. Đây là lựa chọn product/requirement mới, không tuyên bố runtime hiện đã hỗ trợ world save. Autosave, reload/crash recovery, xử lý storage lỗi, số slot và migration sẽ hỏi/chốt riêng ở D14; chưa hứa khôi phục chính xác tick cuối khi app bị đóng đột ngột.
- Câu trả lời user: **“lưu/nghỉ giữ tree, và sẽ bắt đầu lại từ node đó, k lưu giữa node dungeon”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau câu hỏi Q04.
- Nội dung đã chốt: **lưu/nghỉ giữ dungeon tree và node hiện tại; khi chơi tiếp bắt đầu lại node đó từ đầu; không lưu/khôi phục tiến độ giữa node dungeon**. Phương án world snapshot giữa map của agent không được chọn. Chưa suy ra trạng thái nhân vật/HP/tài nguyên/phần thưởng lúc vào lại hoặc map/seed có reroll không. Q02 vẫn hiệu lực, death kết thúc chuỗi.

### Q05 — D14.2: Nhân vật trở về trạng thái nào khi bắt đầu lại node?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **khôi phục checkpoint của nhân vật tại lúc vào node**: build/Mutation/Curse, buff/debuff, HP và bình/tài nguyên trở về trạng thái đầu node. Các thay đổi/nâng cấp và phần thưởng tạm trong node chưa clear không được mang qua khi vào lại; thành quả đã chốt từ những node trước được giữ.
- Lý do: nhất quán với việc không lưu giữa node; tránh vừa giữ nâng cấp/thưởng của phần đã đánh vừa reset quái để nhận lại. Ví dụ vào node ở 70HP/2charge thì vào lại vẫn 70HP/2charge, không tự hồi đầy và không giữ upgrade tạm đã nhặt trong lần đánh dở.
- Ranh giới: chưa chốt loại/lịch thưởng vĩnh viễn D11; khi thiết kế cần tuân thủ ranh giới node đã hoàn tất/chưa hoàn tất để không cộng trùng. Seed/layout/monster/offer lặp lại hay sinh mới, crash/reload và thời điểm autosave còn mở. Checkpoint này chỉ dùng nghỉ khi còn sống, không phục hồi sau death Q02.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau câu hỏi Q05.
- Nội dung đã chốt: **vào lại node khôi phục trạng thái nhân vật lúc bắt đầu node: build/Mutation/Curse, buff/debuff, HP, bình/tài nguyên. Bỏ nâng cấp và thưởng tạm của node đang dở, giữ thành quả đã chốt từ các node trước**. Không tự hồi đầy, không nhân thưởng qua việc nghỉ/chơi lại. Không thay death rule Q02; chi tiết economy và seed/layout còn mở.

### Q06 — D14.3 / D04.1: Dungeon trong node có sinh lại khi quay lại không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only. Lịch sử: tạm gác khi user làm rõ tree ở C01, nay user trả lời rõ Q06. “Quay lại” chỉ restart node dở sau lưu/nghỉ Q04, không backtrack tới node đã clear hoặc đổi nhánh đã khóa.
- Recommend: **giữ nguyên dungeon của node đã chọn khi bắt đầu lại**: bố cục/đường đi, vị trí và thành phần bầy quái lúc bắt đầu, Boss và modifier node. Sinh dungeon mới khi bước sang node mới; vào lại node dở đặt lại tiến độ clear từ đầu theo Q04/Q05, không reroll nội dung bằng việc nghỉ/reload.
- Lý do: giữ ý nghĩa lựa chọn nhánh và độ khó đã nhận, người chơi nhận ra nơi đang chơi khi quay lại; tránh nghỉ để đổi map khó thành dễ. Random giữa các node/hành trình vẫn là hướng hiện hành.
- Ranh giới: không yêu cầu replay chính xác từng tick combat hoặc enemy motion. Chưa chốt cơ chế offer Mutation/Curse và random reward D06/D11 (gồm phụ thuộc hành vi/build); cần tránh reroll bằng reload khi thiết kế các hệ này, không tự khóa cứng toàn bộ offer từ Q06. Tree topology/biome pool chưa chốt.
- Câu trả lời user: **“btw q06: y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trong cùng message sửa Q08.
- Nội dung đã chốt: **dungeon của node đã chọn giữ nguyên khi chơi tiếp sau nghỉ: layout/đường đi, vị trí/thành phần bầy ban đầu, Boss và modifier; reset tiến độ clear từ đầu theo Q04–Q05, không reroll dungeon bằng nghỉ/reload**. Không tự khóa random offer/reward D06/D11 hay yêu cầu replay combat từng tick.

### C01 — User làm rõ cấu trúc tree (2026-11-14)

- Nguồn: hội thoại hiện tại, không permalink, sau Q06. Trích nguyên văn: **“tree sẽ có các nấc khác nhau, đi dần về phía boss cuối cùng mạnh nhất, mỗi nấc có thể có 2-3 node, người chơi chỉ đc chọn 1 và các node cùng nấc còn lại sẽ bị disable.”** User yêu cầu tham khảo Slay the Spire để tính số nấc và hỏi có hiểu nhầm sang Darkest Dungeon không.
- Ghi nhận đúng chỉ dẫn: tree theo nấc, chỉ tiến lên, một node được chọn mỗi nấc, khóa các lựa chọn khác cùng nấc, có Boss cuối mạnh nhất. Chưa chốt số nấc, đường nối giữa nấc, hay kết quả sau Boss cuối. Không có thiết kế Darkest Dungeon được chọn; agent trước đó mới đề xuất chuỗi tiến tiếp có chặng, chưa xác định topology.
- Giữ Q02–Q05. Q01 phần endless không đích được hướng mới supersede; Q06 tạm gác để chốt topology/số nấc trước, rồi quay lại rule restart node sau nghỉ. Không tự thay GAME_BRIEF/DDR/Art Bible hoặc runtime.
- Tham khảo **Slay the Spire 1**, không lẫn bản 2: ba Act chính, Boss Act 1 ở floor 16 (15 nấc trước Boss), các nấc gồm encounter/event/shop/treasure/rest; Act Boss có rest site ngay trước. Khác với đề xuất game này, một node StS thường là một encounter/điểm dừng, không phải toàn dungeon nhiều bầy và Boss. Đường nối giới hạn lựa chọn node tiếp; không tự sao chép rule đường nối đó thay chỉ dẫn user.
- Nguồn đọc: Mega Crit trên Steam https://store.steampowered.com/app/646570/Slay_the_Spire/ ; nghiên cứu Bazzaz & Cooper 2025 https://pcgworkshop.com/archive/bazzaz2025uncertainty.pdf (sections 3, 6.6, Table 1); tham khảo thêm index wiki Map Generation https://slaythespire.wiki.gg/wiki/Map_Generation (search index, direct fetch 403). Không dùng bản board game hoặc tin StS2 để tính.

### Q07 — D02.1: Tổng bao nhiêu nấc tới Boss cuối?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **9 nấc tổng**: nấc 1–8 mỗi nấc chọn một trong 2–3 dungeon; nấc 9 hội tụ vào một dungeon Boss cuối mạnh nhất. Người chơi đi qua 9 node được chọn, không phải chơi hết mọi node trong tree. Mỗi dungeon vẫn có Boss cuối map; Boss ở cuối toàn tree là cao trào lớn nhất.
- Lý do: mỗi node là cả dungeon nhiều bầy/Boss, nên không bê số nấc của StS sang nguyên xi. 9 cho khoảng đầu/giữa/cuối để phát triển build và cộng dồn modifier, vẫn có đích rõ, hạn chế kéo dài số lần restart node nếu phải nghỉ. Có thể mô tả nhịp ba chặng 1–3/4–6/7–9; không tự yêu cầu thêm biome/Boss/content cho từng chặng.
- Giới hạn: đây là baseline thiết kế đề xuất, không phải số tối ưu đã được playtest. Quy mô dungeon, phần thưởng, độ dốc khó và thời lượng thực chưa chốt; không thêm deadline hoặc tự lấy thời gian làm điều kiện thắng. Hành vi sau Boss cuối và rule đường nối hỏi riêng.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau câu hỏi Q07.
- Nội dung đã chốt: **9 nấc tổng: 8 nấc lựa chọn dungeon (2–3 lựa chọn/nấc, chỉ chơi một) và nấc 9 một dungeon Boss cuối mạnh nhất**. Mỗi dungeon vẫn có Boss cuối map. Nhịp đầu/giữa/cuối 1–3/4–6/7–9 là khung đề xuất được bàn cùng số nấc, không tự mở thêm content. Chưa chốt sau Boss cuối hoặc luật đường nối; không suy số này đã được playtest.

### Q08 — D02.2: Ở nấc tiếp theo có được chọn bất kỳ node nào không?

- Trạng thái: **ĐÃ CHỐT — USER SỬA PHƯƠNG ÁN**, design discussion only.
- Recommend ban đầu của agent, **KHÔNG ĐƯỢC CHỌN**: clear node hiện tại thì được chọn bất kỳ node nào trong 2–3 node của nấc kế tiếp, không giới hạn thêm bằng đường nối riêng của từng node. Chỉ tiến một nấc, không nhảy nấc hoặc trở về các nấc trước; nấc 9 vẫn một dungeon Boss cuối.
- Lý do: bám cấu trúc user mô tả, mỗi lần luôn có các phương án để cân nhắc theo build/HP và buff/debuff đã cộng dồn. Với 8 dungeon dài trước final, lựa chọn modifier đã có sức nặng; không cần thêm ràng buộc tuyến đường làm mất lựa chọn phù hợp.
- Tradeoff: giảm mức cam kết từ đường đi từ xa so với cấu trúc giới hạn bằng đường nối; trọng tâm chiến lược sẽ nằm ở tích lũy modifier và chọn thử thách/phần thưởng. Giới hạn combo vẫn phải xét ở D03/D10, không giải quyết chỉ bằng topology.
- Ranh giới: chưa chốt nhìn trước toàn tree hay một số nấc, thời điểm khóa node khi chọn, seed/layout restart Q06 hoặc thông tin node được công khai. Không tự đổi count Q07.
- Câu trả lời user: **“đã là tree thì nên có đường nối riêng, như cách StS làm, và để người chơi xem trước cả cây để tự quyết định hướng đi”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q08.
- Nội dung đã chốt: **tree có đường nối riêng cho từng node, giới hạn chọn node nấc sau theo đường nối từ node hiện tại; người chơi xem trước toàn tree để quyết định tuyến**. Giữ rule một node mỗi nấc/khóa các node khác, chỉ tiến lên, final nấc 9. Chưa chốt số đường nối, rẽ/hợp cụ thể hoặc trường thông tin node công khai. Không tự copy mọi mechanic StS ngoài scope user nêu.

### Q09 — D02.3: Thông tin nào được xem trước trên mỗi node?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **công khai thông tin phục vụ chọn tuyến cho mọi node trên toàn tree**: loại/đặc điểm dungeon và mức nguy hiểm tương đối, buff/debuff với giá trị/hiệu lực/cách cộng dồn, nhóm phần thưởng chính; hiển thị Boss dự kiến nếu node đã xác định Boss. Bố cục chi tiết, vị trí bầy và kết quả loot/lựa chọn nâng cấp cụ thể để khám phá khi vào map.
- Lý do: đường nối và modifier cộng dồn khiến lựa chọn sớm ảnh hưởng các nấc sau; xem toàn tree phải đủ thông tin để cân nhắc build và risk–reward, không chỉ xem vị trí node.
- Ranh giới: chọn chính sách minh bạch thông tin, không tự chốt catalog dungeon/Boss/reward/modifier hoặc thêm loại content mới. Mức nguy hiểm tương đối chưa có công thức/giá trị được duyệt; không hứa mức độ khó chính xác cho mọi build. Chưa tạo HUD/mockup/asset.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau câu hỏi Q09.
- Nội dung đã chốt: **trên toàn tree, mỗi node công khai đặc điểm dungeon/nguy hiểm tương đối, buff/debuff với giá trị/thời hạn/cách cộng dồn, nhóm phần thưởng chính và Boss nếu đã xác định**. Layout/vị trí bầy/kết quả thưởng cụ thể khám phá trong map. Không suy đã chốt catalog/công thức hoặc approved HUD/artwork.

### Q10 — D01.5: Hạ Boss cuối nấc 9 có kết thúc hành trình thắng không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **hạ Boss cuối ở nấc 9 là hoàn thành tree và kết thúc hành trình bằng chiến thắng**; tổng kết/nhận phần thưởng hoàn thành, rồi có thể bắt đầu hành trình mới với tree random mới và build reset. Giữ unlock/progression vĩnh viễn đã nhận theo hướng đã đồng ý, không tự nối sang một tree khác với nguyên build.
- Lý do: tree 9 nấc và Boss mạnh nhất có đích đến/cao trào rõ; người chơi được ghi nhận một build thành công rồi có cơ hội thử hướng khác. Phạm vi phát triển build, độ khó cộng dồn và thưởng có mốc kết thúc để thiết kế, thay cho cần kéo dài build vô hạn.
- Ranh giới: chỉ hỏi điều kiện thắng/kết thúc sau final; loại/giá trị thưởng hoàn thành và progression lượt sau còn D11, không tự thêm currency/permanent stat/NG+/content. Không thay Q02 death hoặc Q03 chủ động kết thúc sớm. Nội dung khi bắt đầu tree mới phải theo các luật đã chốt khác.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau câu hỏi Q10.
- Nội dung đã chốt: **hạ Boss cuối nấc 9 hoàn thành tree, kết thúc hành trình bằng chiến thắng, có tổng kết/phần thưởng hoàn thành; có thể bắt đầu tree random mới với build reset, giữ unlock/progression vĩnh viễn đã nhận**. Không tiếp tục tree khác với nguyên build. Loại/giá trị thưởng và progression sau lượt còn chốt ở D11.

### Q11 — D11.1: Khi nào chốt phần thưởng vĩnh viễn của dungeon?

- Trạng thái: **TẠM GÁC — CHƯA ĐƯỢC DUYỆT**, cần xác định mô hình build/reward trước theo C02. Không coi user đã đồng ý có reward vĩnh viễn sau mỗi dungeon.
- Recommend: **chốt phần thưởng dành cho progression vĩnh viễn của từng dungeon ngay khi hạ Boss/clear node**. Đi tiếp rồi chết ở node sau vẫn giữ thành quả các node đã clear; node đang dở chưa được chốt. Thưởng hoàn thành toàn tree ở final là phần thêm theo Q10, chi tiết còn bàn.
- Lý do: người chơi luôn có tiến bộ sau mỗi dungeon, sẵn sàng thử đi sâu thay vì phải kết thúc sớm chỉ để bảo vệ phần thưởng đã kiếm. Rủi ro vẫn là mất build/hành trình hiện tại khi chết.
- Ví dụ: clear ba dungeon rồi chết ở dungeon thứ tư thì giữ phần thưởng vĩnh viễn đã chốt của ba dungeon đầu, không nhận phần thưởng clear dungeon thứ tư. Nghỉ/restart node dở vẫn theo Q05, không nhân thưởng.
- Ranh giới: chỉ chốt thời điểm/bảo toàn reward, chưa chốt loại/số lượng. Không áp máy móc economy Q9B một unlock mới mỗi Boss vào chín node; còn phải thiết kế mức thưởng theo độ sâu/hoàn thành và khi hết pool để không khuyến khích farm node đầu. Buff build trong chuỗi không trở thành vĩnh viễn từ Q11.
- Câu trả lời user: **“nếu giữ thì phải xác định thưởng cái j? có thể sẽ phải làm lại cả thiết kế về cách build và thưởng”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q11.
- Nội dung đã chốt: **chưa có luật settlement/reward nào được chốt qua Q11**. Đưa cấu trúc build + loại thưởng ra bàn trước; không tự suy quyền thay production hoặc xóa hệ cũ.

### C02 — Bàn lại build/reward tổng thể trước timing giữ thưởng (2026-11-14)

- User đặt lại thứ tự phụ thuộc ở câu trả lời Q11 phía trên. Agent đã hỏi timing trước khi có danh tính/phạm vi reward; cần sửa hướng thảo luận, không tiếp tục suy dungeon nào cũng có meta reward.
- Giữ cấu trúc tree/death/save/restart/preview/final đã chốt Q02–Q10. Giữ progression đã nhận trước đó không đồng nghĩa mỗi Boss mới bắt buộc trao progression vĩnh viễn.
- 4 Mutation/2 Curse, pool 12/8, Sigil/Branch/Legacy economy/Anomaly/Ascension là baseline hiện tại để audit, không ép proposal mới phải dùng nguyên cấu trúc. Mọi thay thế cần user chốt đúng scope; không tự xóa approval/save hoặc đổi DDR.
- Đã kiểm lại builds.ts, run/progression/Legacy economy và DD-0001/0002: economy hiện unlock hữu hạn sau Victory, không thể mặc định một unlock mới cho mỗi dungeon trong tree 9 node; catalog hiện có phải xét trùng vai trò và pool exhaustion. Không quyết định thêm inventory/crafting/currency mới chỉ để có thứ làm phần thưởng.
- Candidate tổng thể **PROPOSED / chưa duyệt**, dùng để hỏi định hướng rồi mới đi vào chi tiết:

| Nguồn | Vai trò đề xuất | Phạm vi tồn tại |
| --- | --- | --- |
| Quái blue/amber | Mutation/Curse và phát triển tương tác build; cách nhận/nâng cấp/chuyên hóa còn bàn | Trong hành trình |
| Clear Boss dungeon | Một lựa chọn nâng cấp đáng kể để thử ở dungeon sau, có thể tăng cấp/biến đổi cơ chế thay vì thêm lớp effect mới | Trong hành trình; chưa chốt catalog/slot |
| Node của tree | Thử thách/đánh đổi đã báo trước và tác động cộng dồn; tách khỏi reward build để tránh cùng một vai trò | Theo rule modifier sẽ chốt D03 |
| Meta sau hành trình/mốc phù hợp | Mở thêm lựa chọn build/biến thể hoặc mục tiêu thành thạo/cosmetic; ưu tiên đa dạng cách chơi | Unlock giữ sang lượt sau; nguồn/thời điểm chưa chốt |

- Thứ tự mới: định hướng sức mạnh giữa lượt (Q12) → cấu trúc build ban đầu/vai trò các hệ → nguồn phát triển/nâng cấp/cap xuyên 9 dungeon → danh tính reward Boss/meta và replayability → timing/death/banking Q11 → mapping/save cũ. Tiếp tục hỏi một quyết định mỗi lượt, không chốt cả bảng bằng suy đoán.

### Q12 — D06.1 / D11.2: Sức mạnh giữa các lượt phát triển theo hướng nào?

- Trạng thái: **USER ĐỒNG Ý Ở MỨC HƯỚNG, MỞ RỘNG SCOPE QUA C03**, design discussion only. Chưa chốt catalog/reward cụ thể.
- Recommend: **sức mạnh trực tiếp của build được xây lại trong từng hành trình; progression lâu dài chủ yếu mở thêm lựa chọn/cách build, không thêm hệ mua cộng HP/damage vĩnh viễn ở hướng đề xuất ban đầu**. Ví dụ unlock lựa chọn nền build/Mutation hoặc biến thể mới để đưa vào cách chọn sẽ chốt sau; không tự cấp hết effect vừa unlock vào nhân vật lượt mới.
- Lý do: giữ ý nghĩa build reset và tuyến dungeon mỗi lượt; reward lâu dài tạo thêm khả năng thử hướng mới, còn clear mạnh lên đến từ các quyết định trong tree. Tránh biến vượt map thành điều kiện phải farm chỉ số meta trước.
- Tradeoff: reward unlock phải đủ khác biệt/cho quyền lựa chọn có chủ đích, không chỉ làm loãng pool RNG; cần mục tiêu sau hết unlock. Nội dung cụ thể, tốc độ mở và có mastery/cosmetic/challenge nào thuộc scope đều chưa chốt.
- Ranh giới: hỏi hướng power/meta, không xin implement, không tự giữ/bỏ Sigil/Branch/4M2C hay chốt cả candidate C02. Không thêm permanent-stat shop/currency từ ví dụ; không thay đổi dữ liệu unlock cũ.
- Câu trả lời user: **“cũng đc, nhưng mà nếu đã lỡ z, t mún làm lại luôn hệ thống skill, hiện tại chỉ có chém và bắn, còn khá đơn giản, cần các thể loại skill khác, tham khảo hệ thống skill của POE, không cần lấy hết, nhưng có các loại cơ bản trước là đc, phần thưởng có thể là mở khoá các skill tấn công và hỗ trợ đó. đồng thời lần này re-work lớn, nên đưa vào nhánh riêng để tránh phá hỏng bản production”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q12.
- Nội dung ghi nhận: **chấp thuận hướng meta mở thêm cách build ở mức tổng thể, đồng thời yêu cầu bàn rework skill**. Unlock skill tấn công/hỗ trợ là hướng reward user đề xuất để cụ thể hóa tiếp; chưa suy mỗi Boss chắc chắn unlock một skill hoặc tự duyệt roster/slots/cost/UI. Không tự mở permanent-stat shop; quan hệ hệ cũ cần chốt riêng.

### C03 — Skill rework + nhánh riêng (2026-11-14)

- Nguồn: câu trả lời user ở Q12, nguyên văn phía trên. Tiếp tục brainstorm một câu/lượt; mở rộng checklist thêm D16 và đặt nó trước chi tiết build/reward. Không coi đây là lệnh code toàn rework ngay.
- **Nhánh làm việc đã tạo:** `codex/dungeon-skill-rework`, base main `63f4f3b88826eb556664bf240e8be538e8f654e6`. Chuyển các notes chưa commit của cuộc brainstorm sang nhánh này; không reset/stash/xóa thay đổi của user. `package-lock.json` có diff trước brainstorm, giữ nguyên/không đưa vào commit thiết kế.
- Production isolation: không sửa/push/merge main hoặc dispatch Pages từ nhánh rework khi chưa có chỉ dẫn hoàn tất rework/đưa lên production. `.github/workflows/pages.yml` hiện auto deploy push main và còn manual workflow_dispatch; không dispatch workflow thủ công cho rework. Không cần đổi workflow trong lượt docs. Runtime/deploy production hiện tại giữ nguyên; nhánh chưa có implementation.
- Tham khảo **PoE 1 — nguyên lý Skill Gem System** từ nguồn GGG chính thức: https://www.pathofexile.com/game (mục Skill Gem System), đọc 2026-11-14. Skill gem cấp khả năng chủ động; support gem biến đổi hành vi skill tương thích, ví dụ projectile nhiều tia/chain. Chỉ lấy nguyên lý kết hợp; không mặc định mang theo sockets trên equipment, màu/link, trade, crafting, passive tree hay slot count của PoE. Không dùng asset/tên skill của bên thứ ba làm production asset.
- Candidate **PROPOSED / chưa user duyệt** để có bộ cơ bản có khác biệt thao tác:

| Nhóm skill chủ động | Ví dụ minh họa của game mình |
| --- | --- |
| Cận chiến | Quét kiếm dạng cung |
| Projectile | Bắn đạn/tia phép có hướng |
| Vùng/AoE | Đặt một vụ nổ tại điểm chọn |
| Channel | Giữ tia năng lượng theo hướng |
| Di chuyển | Lướt; giữ là core cố định hay thành skill/slot chưa chốt |
| Phòng thủ | Khiên/barrier chủ động |

- Ví dụ support minh họa: xuyên mục tiêu, chain, nhiều projectile, mở rộng vùng, lặp đòn/echo, nổ khi hạ mục tiêu. Gắn theo tương thích và có giới hạn/tradeoff, không tự coi mọi support dùng được với mọi skill. Ví dụ projectile + nhiều tia khác projectile + chain; AoE + echo khác AoE + mở rộng vùng. Không chốt cả catalog/số lượng qua Q13.
- Làm rõ thuật ngữ: **support gắn skill = modifier hành vi**, không phải nút buff/heal độc lập; skill phòng thủ/di chuyển vẫn là khả năng chủ động nếu chọn đưa vào hệ đó. User có thể đổi định nghĩa, cần hỏi trước khi chốt.
- Bộ mang theo/slot/nút bấm sẽ chốt riêng để mobile + desktop đều thao tác chính xác. Không tự ép sáu nhóm phải là sáu nút hoặc giữ/bỏ bộ đòn hiện tại. Vai trò Mutation/Curse/Sigil/Branch phải xét lại để không trùng chức năng của supports.
- Reward candidate: unlock catalog skill/support để có thêm lựa chọn ở lượt sau; việc đã unlock khác với đang sở hữu/equip/tăng cấp trong hành trình. Chưa chốt cách chọn skill đầu, nguồn nhận skill/support trong node, đổi build giữa node, cadence/cap hoặc settlement Q11.
- Goal/acceptance giai đoạn hiện tại: ghi nhận scope, tạo branch cách ly, research nguồn gốc, rồi lần lượt chốt architecture → bộ skill cơ bản → equip/input/resources → support compatibility → quan hệ hệ cũ → unlock/reward. Không implementation/art/DDR/build/deploy ở lượt này.

### Q13 — D16.1: Có dùng cấu trúc skill chủ động + support gắn vào skill không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý VÀ BỔ SUNG C04**, design discussion only.
- Recommend: **hai lớp: skill chủ động tạo hành động; support gắn vào skill tương thích để thay đổi hành vi**. Ví dụ cùng projectile có thể thành nhiều tia hoặc chain; cùng AoE có thể mở rộng vùng hoặc tạo lần nổ lặp. Skill/support có thể là nội dung mở khóa lâu dài, cách nhận/equip trong lượt còn chốt sau.
- Lý do: tăng đa dạng cách chơi từ bộ skill nền nhỏ, tạo danh tính cụ thể cho phần thưởng unlock; giữ khả năng mở rộng mà không cần nhiều nút active hoặc sao chép toàn hệ PoE.
- Ranh giới: chỉ chốt architecture/ý nghĩa support, chưa duyệt toàn bộ sáu nhóm ví dụ C03, số slot/support, cost/mana/cooldown, hay giữ/bỏ Mutation/Curse/Sigil/Branch. Không tự sản xuất asset/code/framework.
- Câu trả lời user: **“y, đồng thời kèm chế độ tự ra đòn”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q13.
- Nội dung đã chốt: **hai lớp active skill tạo hành động + support gắn skill tương thích biến đổi hành vi; có thêm chế độ tự ra đòn**. Chưa chốt cụ thể skill nào tự dùng hoặc mặc định bật/tắt; không suy toàn bộ sáu nhóm minh họa/roster/slot/resource đã approved.

### C04 — Chế độ tự ra đòn do user bổ sung (2026-11-14)

- Nguồn: câu trả lời Q13 phía trên. Đây là yêu cầu mới trong rework trên nhánh riêng, chưa production approval.
- Baseline GAME_BRIEF mobile-first/desktop-equivalent hiện không tự quyết thời điểm ra đòn/resource, chém/bắn giữ lặp và Heavy/Charged giữ–thả. User mới cho phép đề xuất chế độ tự ra đòn, supersede đúng phạm vi sẽ chốt; không giữ baseline cũ để cấm feature mới, không tự đổi toàn input hoặc chiến thuật còn lại.
- Phân biệt tự ra đòn của người chơi với `harnessAutoplay.ts` dùng preview/debug: chưa dùng bot di chuyển/chọn draft để thay chế độ này hoặc coi autoplay là human acceptance.
- Cần chốt phạm vi trước: skill nào được tự dùng, ai chọn skill, bật/tắt/manual override, target/range/line-of-sight, channel/cost/cooldown, pause/draft/blur/cancel/resume. Các decision này có thể tách câu; không tự thêm mana/timer/tài nguyên giả.
- Chế độ áp dụng theo cùng contract gameplay cho touch và keyboard/mouse; layout/input theo thiết bị có thể khác, không tự thêm damage/tốc độ/cooldown/AI advantage cho riêng thiết bị nào.

### Q14 — D16.2 / D13.1: Chế độ tự ra đòn tự dùng những skill nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý VÀ CHỐT THÊM SỐ SKILL PHỤ**, design discussion only.
- Recommend: **tự dùng một skill tấn công chính do người chơi chỉ định**, khi có mục tiêu hợp lệ và skill đủ điều kiện; support gắn skill đó hoạt động theo trigger thật. Chế độ bật/tắt được trên cả mobile/desktop. Các skill dùng theo thời điểm chiến thuật như burst/AoE phụ, di chuyển, phòng thủ và bình máu vẫn do người chơi dùng; di chuyển/chọn build/node vẫn thủ công.
- Lý do: giảm thao tác lặp khi clear nhiều bầy, cho phép tập trung di chuyển/né, vẫn giữ quyền quyết định dùng đòn quan trọng và tiêu tài nguyên chiến thuật. Ví dụ di chuyển giữa bầy trong khi projectile + chain tự bắn, người chơi chủ động dùng AoE/guard/Dash khi cần.
- Ranh giới: chưa chốt số skill mang theo hoặc liệt kê skill auto-eligible; một vai trò tấn công chính không đồng nghĩa chốt một slot tổng. Không tăng tốc/damage, bỏ cooldown/cost hoặc tự tạo resource cho auto. Targeting/manual aim override/đang hold khi toggle, mặc định bật/tắt và lifecycle còn hỏi riêng; không tự duyệt UI/art.
- Câu trả lời user: **“y 1 skill chính và 2 skill phụ manual”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q14.
- Nội dung đã chốt: **một skill tấn công chính do người chơi chọn cho chế độ auto + hai skill phụ dùng tay**. Giữ bật/tắt auto trên mobile/desktop, trigger support/cost/cooldown hợp lệ theo phương án đã hỏi; không tự tăng tốc/damage hoặc auto di chuyển/chọn build/node. Chưa xác định Dash/bình máu có nằm trong hai ô phụ không; không suy thêm slot từ Q14.

### Q15 — D16.3: Dash có chiếm một trong hai ô skill phụ không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **Dash là thao tác né cố định, có nút riêng và không chiếm hai ô skill phụ**. Bộ điều khiển khi đó có một main auto + hai skill phụ manual + Dash riêng. Dash vẫn người chơi chủ động dùng, không tự né.
- Lý do: né đòn là nền tảng chung để mọi build xử lý telegraph/Boss, hai ô phụ vẫn dành cho lựa chọn chiến thuật theo build. Giữ khả năng né cơ bản đồng đều giữa các lựa chọn skill và cả touch/keyboard–mouse.
- Ranh giới: đây là đề xuất thêm Dash ngoài ba ô vừa chốt, chưa user duyệt; không tự implement hoặc tăng số nút khác. Chưa chốt bình máu/input layout/roster các skill phụ, biến thể/support cho Dash hay thay timing/charge/i-frame. Nền Dash hiện hành là fallback, không tự khóa vĩnh viễn.
- Câu trả lời user: **“y riêng”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q15.
- Nội dung đã chốt: **Dash là thao tác né cố định có nút riêng, không chiếm hai ô skill phụ, vẫn manual**. Bộ điều khiển gồm một main auto + hai skill phụ manual + Dash riêng. Không tự duyệt thay charge/timing/i-frame, variant/support Dash hoặc HUD layout.

### Q16 — D07.1 / D16.4: Bình máu có là thao tác riêng ngoài hai ô phụ không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **bình máu cơ bản là thao tác manual có nút riêng, không chiếm hai ô skill phụ**. Mọi build có quyền dùng cơ chế hồi phục cơ bản này; hai ô phụ vẫn dành cho lựa chọn build, gồm skill phòng thủ/hồi phục bổ sung nếu catalog sau này có.
- Lý do: dungeon dài và nhiều bầy cần nguồn hồi phục nền cho mọi hướng build, không buộc dành một trong hai ô phụ cho heal. Người chơi vẫn quyết định thời điểm tiêu bình, giữ vai trò quản lý tài nguyên đã đề xuất ở Q14.
- Ranh giới: chỉ hỏi vai trò/control slot; chưa chốt số charge, lượng/tốc độ hồi, cách nạp, boss không adds, hồi giữa node, nâng cấp bình hoặc anti-heal interaction. Không có hồi vô hạn/đầy máu hay bình giả từ việc chốt có nút riêng; thông số và giới hạn phải chốt sau. Chưa approved UI/layout.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q16.
- Nội dung đã chốt: **bình máu cơ bản dùng tay, có nút riêng, không chiếm hai ô skill phụ; mọi build có nguồn hồi phục nền này**. Bộ điều khiển gồm một main auto + hai skill phụ manual + Dash + bình máu. Không tự duyệt charge/lượng hồi/cách nạp/Boss interaction hoặc HUD layout.

### Q17 — D16.5: Bộ skill tấn công chính cơ bản gồm những kiểu nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **bốn kiểu main skill nền để chọn một mang theo**:

| Kiểu | Ví dụ tên tạm | Hành vi/khác biệt mong muốn |
| --- | --- | --- |
| Melee quét cung | Quét kiếm | Đánh gần theo cung, chọn vị trí áp sát/quét bầy |
| Projectile | Đạn năng lượng | Phóng đạn có hướng, lợi thế đường bắn và tương tác xuyên/chain/nhiều tia nếu support hợp lệ |
| Nova quanh người | Sóng xung kích | Phát đợt sát thương vùng quanh nhân vật, dùng khoảng cách/timing để xử lý bầy bao vây |
| Channel theo hướng | Tia năng lượng | Duy trì tia theo hướng mục tiêu; khác nhịp đạn rời, cần chốt tài nguyên/movement/interrupt riêng |

- Lý do: phân biệt cách đánh/vị trí/nhịp thật, đủ nền cho support và reward unlock đa dạng; nova/channel mở rộng ngoài chém/bắn. Đây là pool bốn lựa chọn, không thêm bốn ô/nút main hoặc bảo đảm tất cả có sẵn đầu game.
- Ranh giới: chốt số/kiểu main nền để thiết kế tiếp, chưa nguyên tố/tên chính thức/art/animation/hitbox/damage/cost/range/nhịp hoặc tương thích support cuối. Không tự lấy chém combo cũ/Heavy/Charged/Surge làm mechanic đã được giữ hoặc bỏ; cần mapping sau. Hai skill phụ manual/roster vẫn bàn riêng, không dùng Q17 để duyệt C03 toàn bộ sáu nhóm.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q17.
- Nội dung đã chốt: **pool bốn kiểu main skill nền: melee quét cung, projectile, nova quanh người, channel tia theo hướng; mỗi hành trình trang bị một main**. Chốt hành vi cấp nhóm để thiết kế tiếp, không tự approved tên/nguyên tố/timing/cost/hitbox/art hoặc cấp cả pool đầu game. Cơ chế cũ và support compatibility còn mapping riêng.

### Q18 — D16.6: Bộ skill phụ manual cơ bản gồm những vai trò nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **pool bốn vai trò skill phụ, tự chọn hai theo build**:

| Vai trò | Ví dụ tên tạm | Tác dụng mong muốn |
| --- | --- | --- |
| Burst/AoE | Vụ nổ | Chủ động gây đợt sát thương mạnh tại điểm chọn khi có cơ hội/bầy tụ lại |
| Khống chế | Vùng làm chậm | Tạo vùng kiểm soát, giữ khoảng cách hoặc gom điều kiện cho đòn tiếp |
| Phòng thủ | Khiên tạm | Chủ động che chắn trong một khoảng nguy hiểm; tách với Dash và bình máu nền |
| Triệu hồi trụ | Trụ công kích | Người chơi đặt trụ, trụ tự bắn trong thời gian ngắn; khác nhịp tấn công/positioning của main |

- Lý do: hai ô phụ tạo lựa chọn về burst/control/sống sót/thiết lập vị trí, mỗi unlock có vai trò dễ nhận biết; trụ đem lại kiểu triệu hồi cơ bản mà chưa cần roster pet di chuyển hoặc nhiều lớp AI. Tự chọn hai theo build, không ép một offensive/một defensive ở Q18.
- Ranh giới: trụ tự đánh sau khi **manual cast** không có nghĩa tự cast skill phụ, không thay Q14 một main auto. Thời gian/cap trụ, targeting/collision, khống chế Elite/Boss và tradeoff/cooldown/cost đều phải chốt riêng; không auto stun/slow-lock Boss. Chưa chốt tên/nguyên tố/roster biến thể/support slot/art/aim UI, không cấp cả pool đầu game. Không tự tạo assets hoặc code.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q18.
- Nội dung đã chốt: **pool bốn vai trò skill phụ manual: burst/AoE điểm chọn, vùng khống chế, khiên tạm, triệu hồi trụ; chọn hai theo build**. Trụ cần manual cast, sau đó tự bắn ngắn hạn. Chưa tên/nguyên tố/thông số/cap/CC Boss/support/art hoặc mở hết pool đầu game; không thêm slot hay auto cast skill phụ.

### Q19 — D16.7: Mỗi skill được gắn tối đa bao nhiêu support?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **main tối đa 3 support, mỗi skill phụ tối đa 2 support**. Trần bộ mang theo là ba active skill và tổng bảy ô support tương thích, ngoài Dash/bình máu cơ bản theo Q15–16.
- Lý do: main auto là nền clear bầy, có ba lớp biến đổi để tạo bản sắc build; hai skill phụ vẫn có đủ tùy biến cho vai trò chiến thuật. Giữ trần liên kết để còn quản lý combo/độ dễ đọc/hiệu năng trong cảnh đông, không sao chép số link của PoE.
- Ranh giới: đây là trần thiết kế, không đồng nghĩa có đủ ô/support ngay đầu hành trình hoặc cấp miễn phí. Chưa catalog/support lấy từ đâu/mở slot lúc nào/level/reroll/replace; rule trùng support trong một skill hoặc giữa các skill, compatibility/tradeoff và proc cap đều hỏi riêng. Không tự cho Dash/bình thêm ô support hoặc cấm nâng cấp riêng của chúng; phạm vi đó chưa chốt. Không approved HUD/art/runtime.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q19.
- Nội dung đã chốt: **trần support main3/phụ2/phụ2, tổng bảy ô trên ba skill mang theo**. Chưa chốt có đủ ô ngay đầu game/cấp support miễn phí, nguồn nhận, trùng support, compatibility/tradeoff hoặc proc cap; Dash/bình không tự có thêm ô từ Q19.

### Q20 — D16.8: Pool support cơ bản gồm những loại nào?

- Trạng thái: **ĐÃ CHỐT POOL — USER LƯU Ý COOLDOWN CHƯA CHỐT**, design discussion only.
- Recommend: **chín loại support nền** có lựa chọn cho damage, control, guard và trụ:

| Support — tên tạm | Vai trò mong muốn |
| --- | --- |
| Đa đạn | Thêm projectile trong mỗi lần ra đòn của skill phù hợp |
| Xuyên | Projectile tiếp tục đi qua mục tiêu |
| Chain | Đòn/projectile/tia phù hợp chuyển sang mục tiêu tiếp theo |
| Mở rộng | Mở rộng vùng ảnh hưởng của skill vùng phù hợp |
| Lặp | Thêm một lần lặp hiệu ứng cho skill phù hợp |
| Kéo dài | Tăng thời gian tồn tại của vùng/khiên/trụ hoặc channel nếu hợp lệ |
| Tăng nhịp | Tăng nhịp ra đòn/thi triển; không tự đồng nhất với giảm cooldown |
| Hồi chiêu | Giảm thời gian hồi của skill thực sự có cooldown |
| Cường hóa | Tăng hiệu lực như sát thương/độ bền khiên, có đánh đổi cần chốt |

- Lý do: main có nhiều hướng clear/single-target/nhịp, skill phụ guard vẫn có lựa chọn giữa kéo dài/hồi chiêu/cường hóa thay vì hai ô nhưng chỉ hai support tương thích. Tách attack/cast cadence và cooldown để không tạo timer giả cho skill không có cooldown. Đây là pool cơ bản, không phải chín support tự có/có hiệu lực cùng lúc.
- Ranh giới: tên/nhóm đề xuất, chưa compatibility matrix/tradeoff/damage/number/duration/caps, source unlock/equip hoặc VFX/art. Chain không tự hỗ trợ tất cả hit/beam; Lặp không tự nhân shield/resource/charge hay tạo echo đệ quy; duration/cooldown không cho shield uptime/CC Boss vô hạn. Các rule này cần chốt theo skill/trigger thật, không dùng Q20 duyệt mechanic cụ thể hoặc bỏ cost.
- Câu trả lời user: **“y, nhưng mà lưu ý chưa có quyết định về skill có hồi chiêu”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q20.
- Nội dung đã chốt: **chín loại support nền như bảng Q20**, không tự chốt từng skill có cooldown. **Hồi chiêu là support có điều kiện**, chỉ áp khi luật skill thật sự có cooldown được user duyệt; nếu cuối cùng không dùng cooldown phải bàn lại vai trò support này, không tự tạo timer. Mana/resource/cadence/cooldown/charge vẫn cần decision riêng.

### Q21 — D16.9: Hai skill phụ manual có dùng cooldown riêng không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **mỗi skill phụ manual có cooldown riêng**, không dùng chung một cooldown giữa hai ô. Dùng một skill không tự khóa skill còn lại; giá trị/thời điểm bắt đầu hồi/cancel còn bàn.
- Lý do: burst/control/guard/trụ có thời điểm sử dụng chiến thuật, cooldown riêng tạo nhịp lựa chọn mà vẫn có thể phối hai skill khi cần; support Hồi chiêu có ứng dụng hợp lệ nếu phương án này được duyệt.
- Ranh giới: chỉ hỏi hai skill phụ, chưa gán cooldown cho main/Dash/bình hoặc chốt mana/tài nguyên chung. Nhịp đánh/cast time/channel tick không tự đồng nghĩa cooldown. Không tự chốt số giây, charge, timer giả, cap uptime guard/CC/trụ, cooldown start/cancel/reset qua node hoặc UI; các phần này cần thiết kế tiếp. Không suy Q20 đã approve Q21.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q21.
- Nội dung đã chốt: **hai skill phụ manual có cooldown riêng, không dùng chung một cooldown giữa hai ô**. Có thể phối cả hai theo điều kiện cast hợp lệ. Chưa giá trị/start/cancel/charge/mana hoặc cooldown của main/Dash/bình; support Hồi chiêu có cơ sở sử dụng ở các skill có cooldown thật, compatibility/giá trị vẫn chốt riêng.

### Q22 — D16.10: Main có cooldown kỹ năng riêng hay dùng nhịp ra đòn liên tục?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **main ra đòn/thi triển theo nhịp của skill, không có thêm cooldown kỹ năng riêng như hai skill phụ**. Melee/projectile lặp theo tốc độ đòn/cast; nova phát theo nhịp; channel duy trì tia theo luật sẽ chốt. Auto chỉ thực hiện khi có target hợp lệ và đủ điều kiện thực tế.
- Lý do: main là nguồn clear bầy đều, hai phụ là quyết định chiến thuật theo thời điểm; giữ trải nghiệm auto không ngắt bởi một vòng chờ cooldown kỹ năng bổ sung. Tăng nhịp có vai trò riêng, không tự dùng support Hồi chiêu thay nhịp attack/cast.
- Ranh giới: không có cooldown kỹ năng riêng không đồng nghĩa đánh mỗi tick hoặc bỏ windup/active/recovery/timing limit. Chưa tốc độ/range/số hit/channel tick, di chuyển khi đánh, manual override/priority/cancel hoặc mana/tài nguyên. Không tự gán Hồi chiêu cho main hoặc thay Dash/bình; thông số phải chốt sau.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q22.
- Nội dung đã chốt: **main hoạt động liên tục theo nhịp attack/cast (melee/projectile lặp, nova theo nhịp, channel duy trì), không thêm cooldown kỹ năng riêng như hai phụ**. Giữ timing/điều kiện target hợp lệ, không đánh mỗi tick hoặc bỏ resource chưa chốt. Thông số/cost/movement/override/priority còn mở; không tự áp Hồi chiêu vào main.

### Q23 — D16.11: Có dùng mana/tài nguyên chung để thi triển ba skill không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **bộ skill cơ bản không dùng mana hoặc thanh năng lượng chung**. Main bị giới hạn bằng cadence/timing; hai phụ bằng cooldown riêng; Dash và bình máu giữ cơ chế riêng sẽ chốt. Không tiêu một resource chung để dùng ba skill này.
- Lý do: auto main cần duy trì clear nhiều bầy, còn quyết định chiến thuật đến từ vị trí, chọn build/support và thời điểm hai phụ/Dash/bình. Tránh cần thêm vòng nạp mana chỉ để duy trì skill nền, giữ bộ cơ bản dễ đọc trên cả hai nền tảng.
- Tradeoff: không có trục đầu tư mana/reservation/sustain mana như một hướng build. Depth phải đến từ hành vi skill/support và đánh đổi thực; không viện mana chưa tồn tại để cân bằng support Cường hóa/Đa đạn/Lặp. Các tradeoff đó cần thiết kế riêng.
- Ranh giới: chỉ hỏi resource chung cho ba active skill; chưa chốt Dash/bình/charge, trạng thái/proc/tài nguyên riêng của Mutation/Curse/Sigil/Branch hoặc xóa hệ cũ. Không tự thêm energy/heat/stamina thay tên mana, không đồng nghĩa free cast phụ qua cooldown hoặc vô hạn proc. Không tạo resource/timer giả, chưa HUD/cost values/runtime.
- Câu trả lời user: **“y k dùng mana”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q23.
- Nội dung đã chốt: **bộ ba skill không dùng mana/thanh năng lượng chung**; main theo cadence, hai phụ theo cooldown riêng. Không đổi tên thành heat/stamina hoặc tự đưa mana cost vào tradeoff support. Dash/bình, trạng thái/proc/cơ chế riêng của hệ cũ chưa chốt lại qua Q23; không có quyền xóa chúng hoặc bỏ điều kiện skill khác.

### Q24 — D16.12: Có được gắn support trùng loại không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **mỗi loại support xuất hiện tối đa một lần trong cùng một skill; được dùng cùng loại trên các skill khác nhau nếu tương thích**. Ví dụ hai skill phụ đều có thể gắn Hồi chiêu, nhưng một skill không được gắn hai Hồi chiêu.
- Lý do: ba/hai ô khuyến khích phối các hành vi khác nhau, tránh cách tối ưu chỉ dồn cùng modifier vào một skill. Cho phép lặp giữa các skill giúp lựa chọn hai skill phụ không tranh độc quyền một support phù hợp.
- Ranh giới: chỉ rule trang bị/tương thích về trùng loại, chưa quyết định một bản support dùng chung nhiều skill hay phải nhận nhiều bản riêng trong hành trình, inventory/ownership/drop/level/upgrade/refund. Compatibility/cap và tradeoff vẫn cần thiết kế; không coi lặp giữa skill là cho proc liên hoàn vô hạn hoặc giảm cooldown dưới giới hạn an toàn. Không tự cấp support miễn phí.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q24.
- Nội dung đã chốt: **không gắn trùng cùng loại trong một skill; được gắn cùng loại ở các skill khác nhau nếu tương thích**. Chỉ rule trang bị, chưa quyết định dùng chung một bản hay cần nhận nhiều bản, sở hữu/drop/upgrade/refund hoặc equip timing.

### Q25 — D16.13: Một bản support có được dùng chung nhiều skill không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý VÀ BỔ SUNG C05**, design discussion only.
- Recommend: **trong hành trình, mỗi bản support nhận được chỉ gắn vào một skill tại một thời điểm**. Muốn cùng loại trên hai skill cần hai bản riêng; không trái Q24 vì mỗi skill vẫn tối đa một bản cùng loại.
- Lý do: mỗi phần thưởng support tạo lựa chọn ưu tiên skill nào, nhận bản trùng vẫn có công dụng để hoàn thiện skill khác. Giữ quá trình xây build trong hành trình thay vì một lần nhận là cả ba skill đều dùng được loại đó.
- Ví dụ: nhận một bản Hồi chiêu có thể gắn cho khiên hoặc burst; muốn hai skill cùng dùng cần bản Hồi chiêu thứ hai. Chưa quyết định thời điểm được tháo/chuyển, cấp support đầu hành trình, nguồn nhận/drop hoặc xử lý bản thừa.
- Ranh giới: unlock catalog lâu dài và bản nhận trong hành trình là hai khái niệm cần phân biệt; nguồn/cách cấp và vai trò chính xác của unlock hỏi riêng, không tự chốt RNG-only hoặc bắt đầu không có support. Chỉ hỏi ownership/equip của một bản, không tự thêm inventory phức tạp, rarity, trade/crafting, currency hoặc hệ level. Không dùng Q25 để duyệt compatibility/tradeoff/proc cap.
- Câu trả lời user: **“y. các bản dư có thể đc phân giải thành nguyên liệu để nâng cấp skill”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q25.
- Nội dung đã chốt: **mỗi bản support trong hành trình chỉ gắn một skill tại một thời điểm; cần hai bản để hai skill dùng cùng loại**. Bổ sung **bản dư có thể phân giải thành nguyên liệu nâng cấp skill**. Chưa chốt lifetime/target/cost/cap/level/đổi skill hoặc tự phân giải.

### C05 — Phân giải support dư thành nguyên liệu nâng skill (2026-11-14)

- Nguồn: user bổ sung ngay Q25, nguyên văn phía trên. Đây là hướng mới được user nêu cho economy build, không tự bác vì scope cũ từng không thêm currency; chỉ resource nâng cấp này, không quyền mở shop/crafting/trade/rarity/framework.
- Phân biệt resource để nâng cấp với mana/tài nguyên dùng để thi triển: Q23 không mana vẫn hiệu lực. User chưa nói resource giữ qua hành trình hay chỉ trong lượt, chưa xác định skill chủ động/support hay cả hai được nâng.
- Cần bàn lifetime nguyên liệu và upgrade trước; rồi target nâng/cấp/tác dụng/chi phí/scale, thời điểm nâng/phân giải/đổi skill/refund và nguồn nhận/sink bản dư. Chưa gán thông số hoặc tự nhận auto-salvage.
- Khi đặc tả save phải đối chiếu Q04–Q06: restart node dở khôi phục checkpoint đầu node, không giữ nguyên liệu/upgrade tạm trong node bị làm lại hoặc nhân support/nguyên liệu bằng nghỉ. Không đổi death Q02 hoặc tự áp settlement meta Q11.

### Q26 — D16.14 / D11.3: Nguyên liệu phân giải và cấp skill giữ trong lượt hay vĩnh viễn?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **nguyên liệu phân giải và nâng cấp skill thuộc hành trình hiện tại**: giữ khi đi từ node này sang node sau; khi hành trình kết thúc do chết/thắng/chủ động kết thúc thì nguyên liệu chưa dùng và cấp nâng được reset cùng build. Unlock skill/support lâu dài vẫn giữ theo hướng đã đồng ý.
- Lý do: bản dư trở thành nguồn tăng sức mạnh cho build đang chơi, có ích trong các node sau; giữ việc xây lại build mỗi hành trình và meta mở thêm cách chơi, không vô tình biến thành tích lũy level skill vĩnh viễn.
- Ranh giới: chỉ lifetime, chưa số loại nguyên liệu/yield/chi phí/cap/cấp/cách nâng/target active hay support hoặc reward unlock. Save/nghỉ không kết thúc hành trình, theo checkpoint Q04–Q06; không đồng nghĩa nguyên liệu node dở được giữ khi restart. Không tự xóa progression cũ hoặc thay runtime/save.
- Câu trả lời user: **“y”** và **“btw còn bao nhiêu câu nữa”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q26.
- Nội dung đã chốt: **nguyên liệu phân giải và cấp nâng skill chỉ tồn tại trong hành trình, giữ qua node, reset khi chết/thắng/chủ động kết thúc; unlock lâu dài giữ**. Save/nghỉ không phải kết thúc; restart node dở vẫn khôi phục checkpoint đầu node, không giữ upgrade/nguyên liệu tạm của phần bị làm lại. Target/model nâng/cap/yield/cost còn mở.

## Rà phần còn lại sau Q26 — ước lượng 24 câu thiết kế lớn

User hỏi số câu còn lại, không yêu cầu dừng brainstorm. Agent đã chia một số câu quá nhỏ; tiếp tục **một quyết định/lượt**, gom chi tiết cùng một cơ chế để không hỏi từng thông số. Không gom các thay đổi độc lập thành một câu để lấy approval hàng loạt. Ước lượng dưới đây bao gồm Q27 và lượt quay lại Q11, không phải cam kết số câu bất biến; user mở scope/sửa hướng có thể làm phát sinh câu. Chưa tính review visual/spec chi tiết/playtest trước production.

| Nhóm | Số câu lớn dự kiến | Nội dung cần bao phủ |
| --- | ---: | --- |
| Skill/build/input | 8 | Model nâng cấp; compatibility/tradeoff/proc cap; build/slot ban đầu; nguồn/cadence nhận trong lượt; đổi skill/support/phân giải/refund; mapping Mutation/Curse/Sigil/Branch/Anomaly/Ascension; auto target/manual override; di chuyển/cast/priority/cancel |
| Reward lâu dài | 3 | Unlock cụ thể/cách chọn hoặc roll/pool đầu; settlement/giữ-mất/depth rewards quay lại Q11; mục tiêu khi hết unlock và thưởng final |
| Tree/modifier/difficulty | 3 | Rule đường nối/chốt lựa chọn/không ngõ cụt; modifier catalog/cộng dồn/giới hạn/Curse relation; đường cong khó/power/readability caps |
| Dungeon/quái/Boss | 5 | Map layout/biome/quy mô/minimap; rarity/thành phần bầy; aggro/leash/respawn/kéo bầy; tiến độ clear/mở Boss/chuyển node/loot pending; roster/pattern/variety Boss và final |
| Hồi phục | 2 | Model bình máu/charge/nạp/Boss không adds; hồi giữa node và tương tác sustain/anti-heal |
| Save/flow/phạm vi | 3 | Crash/reload/migration/checkpoint integrity; bỏ dở/result/menu/tutorial/audio flow theo loop mới; scope content/art refs/mobile-desktop performance và acceptance bản đầu |
| **Tổng** | **24** | Đủ luật lớn để làm spec; tham số tuning, mockup và nghiệm thu vẫn phải duyệt đúng scope sau đó |

Các bảng spec chi tiết (compatibility/cap/giá nâng...) sẽ được đề xuất để user review theo cơ chế, không hỏi từng ô/số riêng và cũng không tự đánh dấu approved khi chưa duyệt. Checklist D01–D16 vẫn là đối chiếu coverage, không bỏ phần chưa bàn để rút ngắn số câu.

### Q27 — D16.15: Model nâng cấp bằng nguyên liệu áp dụng thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **nguyên liệu nâng ba skill chủ động, mỗi skill từ cấp 1 tới tối đa cấp 5 trong hành trình; support bản đầu không có level riêng**. Nâng tăng hiệu lực chính phù hợp của skill (ví dụ sát thương/độ bền khiên), còn support định hình cách hoạt động. Chi phí tăng dần theo cấp, trị số/hiệu lực cụ thể/cap tương tác cần spec tiếp, không tự cấp đủ nguyên liệu để max cả ba.
- Lý do: support dư luôn có nơi đầu tư cho build hiện tại, tạo lựa chọn ưu tiên main hoặc hai phụ; một trục level active giữ việc quản lý đơn giản khi đã có ba skill và bảy ô support. Không thêm cấp/rarity/crafting độc lập cho từng bản support ở bộ đầu.
- Ranh giới: hỏi một model upgrade (đối tượng/cap/nguyên tắc), chưa stat multipliers/price/yield, level mapping theo skill, Boss CC/shield uptime/trụ caps, refund hoặc kế thừa cấp khi đổi skill. Không tự tăng mọi chỉ số hay cho active lên cấp mở thêm skill/nút; không nâng vĩnh viễn trái Q26. Đây chỉ proposal chưa approved.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q27.
- Nội dung đã chốt: **nâng ba active bằng nguyên liệu, cấp1–5, tăng hiệu lực chính theo skill, chi phí tăng dần; support bản đầu không level riêng**. Không tự chốt price/yield/multipliers/cap tương tác hoặc refund/kế thừa khi đổi skill. Level/nguyên liệu chỉ trong hành trình theo Q26.

Tiến độ mốc ước lượng sau Q26: đã chốt Q27 (1/24); còn khoảng **23 quyết định lớn**, gồm Q28 dưới đây. Đây là ước lượng coverage, không tự bỏ các mục khác.

### Q28 — D16.16: Build khởi đầu mỗi hành trình có những gì?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý BỘ ĐẦU VÀ ĐỔI SANG NHẬN RANDOM**, design discussion only.
- Recommend ban đầu của agent: **trước khi vào node đầu, chọn một main cấp1 + một skill phụ cấp1 + một bản support tương thích cho main, từ catalog đã mở**. User đổi phần tự chọn thành cấp ngẫu nhiên. Ô skill phụ thứ hai để trống, nhận trong hành trình; mọi ô support theo trần3/2/2 đã có sẵn từ đầu, kiếm support để lấp chứ không thêm khóa ô. Cách nhận thêm trong node/Boss chốt ở model nguồn/cadence tiếp theo.
- Lý do: vào dungeon đã có phong cách đánh và một thao tác chiến thuật; có một thay đổi main từ support để nhận ra build ngay. Còn chỗ trống/tài nguyên/cấp để tăng sức mạnh xuyên 9 dungeon. Tránh hai lớp khóa là vừa phải nhận support vừa chờ mở ô.
- Ranh giới: hỏi model khởi đầu, không cấp toàn bộ catalog đầu game hoặc bắt đầu max build. Cần starter catalog hợp lệ cho profile mới, danh tính/số starter unlock chốt cùng progression; không để thiếu main/phụ/support hợp lệ. Chưa source/drop/RNG/trọng số/đảm bảo thời điểm skill phụ thứ hai, nguyên liệu giá nâng, mapping hệ cũ, HP/bình start, UI/aim/input hoặc debug grants. Không bắt mọi skill được tự equip miễn phí trong lượt chỉ vì đã unlock.
- Câu trả lời user: **“y, và nhận random”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q28.
- Nội dung đã chốt: **bộ đầu nhận ngẫu nhiên một main cấp1 + một phụ cấp1 + một support tương thích cho main từ catalog đã mở; ô phụ2 nhận thêm trong hành trình; ô support3/2/2 mở sẵn**. Không tự cho chọn từ toàn bộ thư viện hoặc draft3chọn1 ở bộ đầu; không tự mở cả catalog/profile mới. Starter pool cụ thể còn chốt; random phải lọc tương thích và không thiếu slot nền. Rest/restart cùng node giữ checkpoint Q04–Q06, không tự reroll bộ đầu qua reload.

### Q29 — D16.17 / D11.4: Nhận thưởng build trong hành trình có được chọn không?

- Trạng thái: **ĐÃ CHỐT — USER CHỌN PHƯƠNG ÁN BA LỰA CHỌN**, design discussion only.
- Recommend: **ở mốc nhận thưởng build quan trọng trong hành trình, roll ngẫu nhiên tối đa ba lựa chọn hợp lệ để lấy một**, thay vì tự cấp luôn một kết quả duy nhất. Ưu tiên có ít nhất một lựa chọn dùng được với build đang có, vẫn có lựa chọn mở hướng khác nếu pool cho phép. Pool nhỏ hiển thị số thật, không tạo bản trùng/offer giả để đủ ba.
- Lý do: bộ khởi đầu đã random theo Q28; các mốc sau cho quyết định xây/chuyên hóa hoặc đổi hướng xuyên 9 dungeon, giữ randomness và quyền chủ động của người chơi. Không ép mọi lượt cùng một bộ từ thư viện.
- Ranh giới: **đây là thưởng trong hành trình**, không hỏi lại hoặc đổi random bộ đầu Q28. Chưa nguồn/cadence/mốc theo blue/amber/Boss, danh mục phần thưởng/cách bảo đảm phụ2 hoặc unlock lâu dài. Chỉ các mốc build quan trọng dùng draft; không suy bật bảng mỗi con quái/nhặt vật liệu nhỏ, không dừng clear liên tục. Queue/thời điểm mở bảng/auto-pause sẽ chốt theo flow; không tự chọn thay user. Không dùng Q29 để quyết định giữ/bỏ Mutation/Curse hoặc nguồn reward của chúng.
- Câu trả lời user: **“3”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q29 có hai phương án draft3chọn1 hoặc cấp random trực tiếp.
- Nội dung đã chốt: **thưởng build ở các mốc quan trọng trong hành trình random tối đa ba lựa chọn/lấy một**, ưu tiên ít nhất một hướng hợp build khi pool cho phép; pool nhỏ hiện đúng số hợp lệ. Không thay bộ đầu Q28 random trực tiếp; chưa chốt nguồn/cadence/pool/flow mở bảng hoặc settlement.

Tiến độ ước lượng sau Q26: Q27–Q28 đã chốt (2/24), còn khoảng22 quyết định lớn gồmQ29, chưa tính review spec/visual/playtest. Không dùng ước lượng để bỏ coverage.

### Q30 — D16.18 / D11.5: Nguồn và nhịp thưởng build mỗi dungeon thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **dungeon nấc1–8 có hai mốc draft build lớn**: một mốc trong dungeon từ tiến độ clear các bầy blue/amber (amber đóng góp nhiều hơn), và một mốc sau khi hạ Boss để chuẩn bị dungeon kế. White không tự bật draft. Tiến độ phục vụ mốc thưởng này, không thêm currency để cast hoặc tự đồng nhất với thanh mở Boss.
- Bảo đảm đầu run: **thưởng Boss dungeon đầu bảo đảm có lựa chọn lấp ô phụ2 nếu ô đó còn trống**. Offer lấy từ skill hợp lệ/chưa mang nếu pool cho phép, hiển thị số thật; khi chốt starter/unlock pool phải bảo đảm đủ khả năng lấp bộ cơ bản. Không tự roll ba lựa chọn trùng/khóa để giả đủ số.
- Final nấc9: mốc trong dungeon vẫn có thể tăng build trước final; **sau Boss cuối chỉ nhận thưởng hoàn thành**, không cấp draft tạm chỉ có tác dụng ở dungeon kế khi hành trình đã kết thúc Q10. Nguồn/danh tính thưởng hoàn thành/meta còn D11/Q11.
- Lý do: bầy đặc biệt có giá trị, mỗi dungeon có tiến bộ để thử build, nhưng nhiều bầy không tạo hàng loạt popup hoặc max build quá sớm. Xuyên tám dungeon đầu có16 mốc chọn lớn để lấp/đổi/phân giải/đầu tư level theo các rule đang thiết kế; không tự bảo đảm max ba active.
- Ranh giới: đề xuất model nguồn/cadence reward build mới, **không tự giữ/bỏ/thay nguồn Mutation/Curse cũ** hoặc tạo một luồng draft phụ chồng thêm cho chúng. Pool skill/support/trait cần đối chiếu mapping hệ cũ ở câu tiếp; nếu thay scope phải ghi rõ. Chưa threshold/số bầy, vật liệu yield, nguồn charge bình, loot nhỏ, queue/pause/an toàn mở bảng, hoặc Boss unlock threshold. Không tự đổi nguyên tắc3chọn1 Q29, không suy thưởng vĩnh viễn sau mỗi Boss Q11.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q30.
- Nội dung đã chốt: **hai mốc draft lớn/dungeon1–8: tiến độ clear bầy blue/amber (amber nhiều hơn) và sau Boss; Boss dungeon đầu bảo đảm lựa chọn lấp phụ2 nếu trống. Nấc9 có mốc trong map, sau final chỉ thưởng hoàn thành**. Giữ3chọn1 Q29. Chưa threshold/pool/flow/yield/charge bình/settlement hoặc tự thay Mutation/Curse.

### Q31 — D06.2 / D12.1: Mutation/Curse có còn là hệ slot riêng trong rework không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **bản rework đầu không giữ hai hệ slot Mutation/Curse riêng**, tập trung core build vào active skill + support + level; phần lợi ích/rủi ro được định hình thêm bởi node buff/debuff đã thống nhất. Ý tưởng hiệu ứng cũ phù hợp có thể được đề xuất thành skill/support/modifier sau, từng nội dung cần thiết kế/duyệt riêng, không tự bê nguyên cả pool12/8.
- Lý do: đã có ba skill/bảy support/cấp nâng và modifier cộng dồn trên tree; thêm một tầng4M/2C cũ dễ trùng vai trò và làm khó đọc nguyên nhân mạnh/yếu của build. Giữ chiều sâu ở tương tác skill/support và quyết định tuyến node, giới hạn phạm vi bộ cơ bản trước.
- **Phạm vi supersede đã được user đồng ý qua Q31:** thay yêu cầu brainstorm ban đầu “Mutation/Curse xuất hiện khi clear quái xanh/vàng” bằng reward build mới tại mốc blue/amber Q30, không thêm draft/slot M/C riêng trong rework này. Approval thiết kế cụ thể này dựa câu trả lời Q31, không suy từ việc user cho làm lại skill hoặc tests/deploy.
- Ranh giới: chỉ vai trò hai hệ Mutation/Curse trong bản rework; **chưa quyết định Sigil/Branch/Anomaly/Ascension** hoặc xóa/migrate unlock/save cũ. Giữ lịch sử approval và production/main hiện tại; không sửa GAME_BRIEF/DDR/Art Bible, không code/assets/deploy. Nếu user muốn giữ M/C riêng phải bàn contract/nguồn/cap/tương tác thay vì tự cấm hoặc tự chọn số slot mới.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q31.
- Nội dung đã chốt: **bản rework đầu không giữ slot Mutation/Curse riêng; dùng skill/support/level và node buff/debuff làm core build; blue/amber đóng góp reward build Q30 thay cho M/C ban đầu**. Ý tưởng effect cũ chỉ được đề xuất chuyển từng nội dung phù hợp và cần approval riêng. Chưa Sigil/Branch/Anomaly/Ascension/migration; không thay production hoặc xóa registry/approval cũ.

### Q32 — D12.2: Sigil/Branch có còn là lớp build riêng không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **bản rework đầu không giữ Sigil/Branch như một lớp chọn/roll/trang bị riêng**. Nguyên tố, khi có, là đặc tính của skill/support cụ thể; hướng chuyên hóa được xây bằng tổ hợp skill/support và nâng cấp, không thêm một bộ Core+Branch độc lập cho toàn nhân vật.
- Lý do: bộ đầu đã random main/phụ/support theo Q28, progression lâu dài đang hướng mở thêm lựa chọn skill/support. Một lớp roll Sigil/Branch riêng nữa chồng hướng build/proc; thống nhất danh tính và nguồn unlock giúp người chơi đọc rõ đang nhận/đổi gì.
- Phạm vi supersede **đã được user duyệt qua Q32**: trong rework đầu không dùng cơ chế đầu run chọn1/2Legacy offer và gắn1Sigil+1Branch theo contract cũ. Không suy mất toàn bộ combat nguyên tố, không bắt buộc chuyển đủ6Core/12Branch thành hàng loạt biến thể skill hoặc một skill tree mới. Ví dụ skill lửa là minh họa, không tự tạo skill/effect mới hay migration reward.
- Ranh giới: chỉ vai trò Sigil/Branch trong rework; **Anomaly/Ascension và progression/save cũ chưa chốt**. Giữ lịch sử DD-0001/0002/Q9 approvals/runtime/main, chỉ ghi notes rework; không sửa DDR/Art Bible/source/assets/deploy. Catalog nguyên tố/tag/hiệu ứng và cách xử lý unlock đã sở hữu cần spec/approval riêng.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q32.
- Nội dung đã chốt: **bản rework đầu không giữ Sigil/Branch làm lớp chọn/roll/trang bị riêng; nguyên tố khi có thuộc skill/support cụ thể, chuyên hóa từ tổ hợp build/nâng cấp**. Không tự chuyển cả6/12 thành roster mới, không xóa combat nguyên tố hoặc unlock/save/approval cũ. Anomaly/Ascension/migration còn mở.

### Q33 — D12.3 / D03.1: Anomaly có chuyển thành đặc tính của node không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **gộp vai trò Anomaly vào các modifier/đặc tính dungeon được báo trước trên node của tree**, chọn thông qua tuyến đường Q08–Q09. Không giữ một lượt chọn Anomaly riêng giữa dungeon theo mốc2:15 cũ.
- Lý do: quyết định nguy cơ/phần thưởng đã nằm trên tree, nên môi trường bất thường cũng thuộc thông tin dùng để chọn tuyến. Giảm một màn chọn độc lập giữa combat và làm node có bản sắc gameplay rõ.
- Phạm vi supersede đã được user duyệt qua Q33: thay cơ chế run2+ ở135s chọn1/2Anomaly độc lập trong rework đầu. Chưa bắt buộc đưa nguyên cả6Anomaly/giá trị/proc/VFX cũ vào map mới; mỗi modifier dùng lại phải hợp luật skill/world/counterplay và được duyệt đúng scope.
- Ranh giới: **không tự đổi yêu cầu node buff/debuff cộng dồn của user**. Lifetime/cách cộng dồn/cap/compatibility của từng modifier (kể cả hazard môi trường) còn phải chốt D03, không tự cho mọi hazard cùng tồn tại hoặc tự làm chúng hết hiệu lực sau map. Chưa reward unlock Anomaly cũ/migration/Ascension/catalog hoặc art; giữ production và lịch sử approval.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q33.
- Nội dung đã chốt: **vai trò Anomaly chuyển thành modifier/đặc tính node được xem trước trên tree/chọn qua tuyến; không giữ lượt chọn Anomaly độc lập giữa trận theo timer cũ**. Chưa catalog/cộng dồn/lifetime/hazard cap/giá trị hoặc chuyển cả6Anomaly/VFX vào map mới. Các yêu cầu cộng dồn node vẫn hiệu lực, phải chốt D03; migration/Ascension chưa duyệt.

### Q34 — D12.4 / D10.1: Có giữ Ascension làm cấp khó cho các hành trình sau không?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **giữ ý tưởng Ascension với năm mức0–4**, chọn trước khi bắt đầu hành trình. Ban đầu mở mức0; hoàn thành toàn tree9nấc ở mức cao nhất đang mở thì mở thêm mức kế (tối đa4). Có thể chơi lại mức đã mở, không bắt đi tiếp cấp cao.
- Lý do: có mục tiêu sau khi đã quen tree/hoàn thành unlock, dùng build khác để chinh phục cùng cấu trúc9nấc; độ khó không cần kéo dài hành trình hoặc thêm main slot. Mức khó là contract chung hai nền tảng, không chia luật touch/desktop.
- Phạm vi supersede đã được user duyệt qua Q34: không dùng gate đủ6Sigil đã bị Q32 thay; không bê nguyên Seal/Pulse/Hunter/Fracture/Echo, trigger theo135s hoặc Static Riposte cũ khi skill/world nền đã đổi. Chỉ giữ model progression cấp khó; phải thiết kế modifier/tuning mới phù hợp core và có counterplay, baseline normal cần playable.
- Ranh giới: chưa quyết định modifier/HP/damage/pack/giá trị từng mức, multiplier thưởng/achievement hoặc migration cao nhất từ save cũ; không tự cấp level cũ/mở thêm content/Boss/art. Không tự triển khai bốn cấp tăng khó từ approval concept này, vẫn cần spec/task/gate đúng scope. Reward cấp cao thuộc model meta cần chốt tiếp; không tự thay luật/cap/i-frame theo thiết bị.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q34.
- Nội dung đã chốt: **Ascension năm mức0–4, đầu mở0; chọn mức đã mở trước hành trình, thắng toàn tree9nấc ở mức cao nhất đang mở thì mở mức kế tới4; vẫn chơi lại mức thấp hơn được**. Mỗi lượt vẫn tree9/build reset. Chưa tier modifiers/giá trị/reward/migration/UI/spec; không dùng lại gate6Sigil hoặc tự port Seal cũ.

### Q35 — D03.2: Modifier node được nhận và cộng dồn thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend model: **mỗi node một buff + một debuff được báo trước; khi bắt đầu node đã chọn, nhận cả hai và giữ tới hết hành trình, kể cả Boss cuối**. Đây là hiệu lực của node khi vào, tách với draft/thưởng clear Boss Q30; không cấp rồi gỡ ở chuyển map.
- Cộng dồn: **cùng loại cộng thêm giá trị tới trần quy định, không nhân lũy thừa ngầm**; các loại khác nhau kết hợp theo contract modifier/skill sẽ đề xuất. Trần/readability/proc/uptime cần xét cả cấp khó Ascension, không cho stacking xuyên các nguồn bỏ qua cap.
- Ràng buộc thiết kế: các lựa chọn/gói modifier phải có counterplay; không sinh debuff triệt tiêu hoàn toàn main hoặc tắt quyền Dash/bình cơ bản khiến build không thể chơi. Hazard phải nằm trong budget/telegraph rõ; không tự cho mọi hazard cũ cùng spam vì đã có nhiều node.
- Lý do: mỗi bước chọn đường có lợi ích và rủi ro thực, hậu quả theo người chơi tới final; có thể tính được mức tăng và giữ đủ khả năng đọc/né khi đông quái. Bám yêu cầu cộng dồn ban đầu, không tự đổi lifetime Anomaly thành chỉ một map.
- Ranh giới: chưa catalog buff/debuff/giá trị/cap cụ thể/định lượng compatibility hoặc nhân quả từng hazard; phải có bảng spec/ref/approval trước implementation. Không tự đổi Q30 reward counts, main no-mana/cadence, slot3/2/2, hoặc mở thêm permanent progression. Rule khóa node/đường nối chi tiết còn chốt riêng.
- Câu trả lời user: **“y”** và **“btw compact context đi, chú ý giữ các câu hỏi”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q35.
- Nội dung đã chốt: **mỗi node một buff + một debuff xem trước; nhận khi bắt đầu node, giữ tới hết hành trình/kể cả final; cùng loại cộng giá trị tới trần, không nhân lũy thừa ngầm. Modifier phải có counterplay, không triệt tiêu main hoặc tắt Dash/bình máu cơ bản.** Chưa catalog/giá trị/cap chi tiết/hazard rules/ref hoặc implementation. Request compact không duyệt các câu chưa hỏi hoặc Q11 đang tạm gác.

NEXT ACTION: sau compact, đọc RESUME.md + CURRENT của HANDOFF; chuẩn bị và hỏi Q36 về thời điểm đổi/gắn skill-support, nâng/phân giải và xử lý đầu tư khi đổi. Recommend trước, một quyết định/lượt. Q36 chưa hỏi/chưa chốt; Q35 đã chốt, Q11 timing vẫn tạm gác. Không triển khai.
