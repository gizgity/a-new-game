# Dungeon redesign — checklist trước implementation

Task: DUNGEON-BRAINSTORM-01 · Revision 25 · 2026-11-14.
Trạng thái: BRAINSTORM / CHECKLIST, chưa spec production hoặc quyền implementation.
Nguồn: hội thoại hiện tại, không permalink. User yêu cầu “đồng ý, list các vấn đề còn tồn đọng để clear hết trước khi bắt đầu”.

## Hướng đã thống nhất trong brainstorm

- Dungeon random liền mạch, camera theo nhân vật, cảm giác clear endgame map ARPG/PoE; nhiều bầy đông, white/blue/amber và Boss cuối map.
- Không còn deadline clear map; Mutation/Curse đến từ clear blue/amber; cần cơ chế hồi máu.
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
| D06 | Nhận và phát triển Mutation/Curse | C02: bàn lại build cùng reward cho toàn tree trước khi chốt timing giữ thưởng. Vai trò Sigil/Branch/Mutation/Curse và buff Boss cần tách; 4M/2C chỉ là baseline cũ, không tự khóa proposal mới. Blue/amber vẫn nguồn Mutation/Curse theo ý user; cadence/pool/slot/upgrade/replace/Curse risk/late build chưa chốt. |
| D07 | Hồi máu | Q16: bình máu nền manual có nút riêng ngoài hai ô phụ. Còn charge/cách nạp/lượng-tốc độ hồi/giới hạn dùng, input cụ thể; tài nguyên trong Boss không adds; hồi sau Boss; tương tác build heal/anti-heal và giới hạn farm. |
| D08 | Điều kiện Boss/clear map | Đi đến cuối là được đánh hay cần tiến độ clear; quái nào tính tiến độ; tránh tìm white cuối và chạy thẳng bỏ cả map; Boss chết có chuyển ngay không, xử lý quái sống/loot/nâng cấp chưa nhận trước khi rời map. |
| D09 | Danh sách Boss và sự đa dạng | Giữ Chain Warden bao lâu, đổi pattern/modifier theo node hay thêm Boss; mốc Boss mạnh; số lượng nội dung cho bản đầu và phần để sau, chưa tự cấp quyền artwork/content mới. |
| D10 | Difficulty và power curve | Độ khó tăng theo độ sâu/node/build thế nào; phần đến từ mật độ/phối quái/skill và phần từ HP/damage; giữ white clear nhanh; giới hạn tốc độ/chain/hồi máu/VFX và các tổ hợp không thể vượt qua. Không thay luật theo thiết bị. |
| D11 | Phần thưởng và progression | C02: phải xác định thưởng gì/cấu trúc build trước timing/bảo toàn. Q11 tạm gác, chưa duyệt thưởng vĩnh viễn sau mỗi dungeon. Còn reward trong map/Boss/meta, tính chắc chắn/chọn/random, death/settlement, replayability/hết pool, currency/item có cần không. Q12 hỏi hướng power/meta trước. |
| D12 | Hệ thống cũ | Lập mapping giữ/đổi/tạm ngừng cho Sigil/Branch, Legacy/ticket/reward, Anomaly, Ascension, challenge/Codex/history/cosmetic và tutorial/audio theo timer. Run/Victory/progression trigger cũ tính trên từng dungeon hay toàn chuỗi. Không tự xóa approval/dữ liệu cũ. |
| D13 | Combat, camera và UI trên hai nền tảng | C04 user yêu cầu chế độ tự ra đòn; phạm vi/mục tiêu/bật-tắt/manual override cần chốt cùng D16. Bộ đòn/input, target/aim qua tường, projectile/collision ở hành lang, offscreen attacks, camera/HUD/minimap; bình máu/node/reward và vi/en. Không tự khác luật combat theo thiết bị. |
| D14 | Lưu và tiếp tục hành trình | Q04–05: giữ tree/node, restart đầu node bằng checkpoint nhân vật; bỏ nâng cấp/thưởng tạm node dở, giữ thành quả node trước. Q06: giữ dungeon node đã chọn (layout/bầy/Boss/modifier), reset tiến độ clear. Còn random offer/reward khi restart, reload/crash/đóng app, pause trong phiên, migration save cũ và tránh nhận trùng thưởng. |
| D15 | Phạm vi bản đầu và cổng nghiệm thu | Map/biome/enemy/Boss nào tái sử dụng hoặc làm mới; cần concept/mockup/approved refs cho phần visual nào; chốt mục tiêu density/readability/performance trên mobile/desktop; thứ tự task nhỏ, scenario nghiệm thu chuỗi map→Boss→reward→node→map/death/save. Không code trước spec/ref/approval đúng scope. |
| D16 | Skill rework — user mở ở C03 | Q13–22: active+support, main auto/hai phụ manual/Dash+bình riêng; bốn main/bốn vai trò phụ, support cap3/2/2, chín support nền. Hai phụ cooldown riêng, main cadence không thêm cooldown kỹ năng. Còn mana/resource/compatibility/trùng/tradeoff/proc cap, nhận/mở slot/equip/aim, mapping hệ cũ và unlock/build trong lượt. Làm nhánh riêng, không tự thêm inventory/crafting/passive tree/nhiều nút. |

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

- Trạng thái: **CHỜ USER**, chưa có kết quả.
- Recommend: **bộ skill cơ bản không dùng mana hoặc thanh năng lượng chung**. Main bị giới hạn bằng cadence/timing; hai phụ bằng cooldown riêng; Dash và bình máu giữ cơ chế riêng sẽ chốt. Không tiêu một resource chung để dùng ba skill này.
- Lý do: auto main cần duy trì clear nhiều bầy, còn quyết định chiến thuật đến từ vị trí, chọn build/support và thời điểm hai phụ/Dash/bình. Tránh cần thêm vòng nạp mana chỉ để duy trì skill nền, giữ bộ cơ bản dễ đọc trên cả hai nền tảng.
- Tradeoff: không có trục đầu tư mana/reservation/sustain mana như một hướng build. Depth phải đến từ hành vi skill/support và đánh đổi thực; không viện mana chưa tồn tại để cân bằng support Cường hóa/Đa đạn/Lặp. Các tradeoff đó cần thiết kế riêng.
- Ranh giới: chỉ hỏi resource chung cho ba active skill; chưa chốt Dash/bình/charge, trạng thái/proc/tài nguyên riêng của Mutation/Curse/Sigil/Branch hoặc xóa hệ cũ. Không tự thêm energy/heat/stamina thay tên mana, không đồng nghĩa free cast phụ qua cooldown hoặc vô hạn proc. Không tạo resource/timer giả, chưa HUD/cost values/runtime.
- Câu trả lời user: CHƯA CÓ.
- Nội dung đã chốt: CHƯA CÓ cho Q23.

NEXT ACTION: chờ user chốt Q23 (có mana/resource chung không), tiếp tục một câu/lượt trên `codex/dungeon-skill-rework`; rồi compatibility/trùng/tradeoff/equip/build/reward. Q11 timing vẫn tạm gác.
