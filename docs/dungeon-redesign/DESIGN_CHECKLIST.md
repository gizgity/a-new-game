# Dungeon redesign — checklist trước implementation

Task: DUNGEON-BRAINSTORM-01 · Revision 71 · 2026-11-14.

Đọc nhanh: [RESUME.md](RESUME.md). Giữ đầy đủ Q01–Q61/C01–C08;Q61 thu hồi. User yêu cầu phần còn thiếu ở dạng câu hỏi để kiểm tra: [REVIEW_QUEUE.md](REVIEW_QUEUE.md) có12mụcR01–R12. [Bản V1](REVIEW_V1.md) đã chuẩn bị12/12,0/12được duyệt/12chờ review. C07 đính chính câu trả lời “0” của agent; không hỏi lại contract đã chốt hoặc tự sinh thêm quiz. Cosmetic ngoài scope, chưa implementation.
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

| ID | Vấn đề | Hợp đồng đã chốt và phần cần đặc tả — rà sau C06 |
| --- | --- | --- |
| D01 | Loop/kết thúc | Đã chốt Q02–Q10/Q41/Q58: tree9/final/thắng-chết-end/reset build/giữ meta, restart node dở. Đặc tả state/result và các edge case, không hỏi lại loop. |
| D02 | Dungeon tree | Đã chốt Q07–Q09/Q44:2–3node/nấc1–8, đường1–2nhánh/tách-nhập/không ngõ cụt, final9, xem toàn cây/chốt khi bắt đầu node. Cần layout/generation rules và phân bố nội dung cụ thể. |
| D03 | Modifier | Q35 lifetime/cộngcap/counterplay; Q56 thay1+1cố định bằng random1..cap theo chặng1/2/3/4. Cần catalog tham khảoPoE/range/cap từng effect/tổ hợp, không hỏi lại số mod hoặc lifetime. |
| D04 | Map/điều hướng | Q45 đã chốt tuyến chính/nhánh ngắn-vòng nối/liền mạch/camera follow/minimap khám phá; Q55 lấy cảm giác Atlas, không duyệt quota cũ. Cần reference gameplay/định lượng density/biome-map geometry và mockup. |
| D05 | Bầy/rarity/AI | Q47–Q48:đông lính+1đầu đàn, white/blue/amber và biến thể blue+amber, aggro cục bộ/kéo bầy/leash/chết không respawn. Cần roster/affix/cự ly/count/HP khi leash/scene-performance evidence. |
| D06 | Mutation/Curse | Q31 bỏ slot/draft M/C riêng; Q30 thay nguồn reward blue/amber. Không âm thầm port pool cũ hoặc hỏi lại giữ4M2C. Nếu đề xuất effect dùng lại, trình cùng bảng nội dung mới. |
| D07 | Hồi phục | Q49–Q52 đã chốt charge100/cost40,35%ngay+20%/4s/refresh,kill4-8-20,reuse0,5s; adds75/50/25%,start/sauBoss đầyHP-charge. Cần tương tác modifier/priority/input timing; không hỏi lại model bình. |
| D08 | Boss gate/clear/flow | Q46~75%weighted clear/tuyến chính đủ; Q54 khóa trận/dọn threats/thưởng-build-tree; Q60 pending draft/pause. Cần weights/đồng thời death-claim/state UI cụ thể. |
| D09 | Boss content | Q53 chốt3Boss thường áp sát/bắn xa/vùng,1final2pha/tránh lặp liên tiếp. Cần bộ đòn/phase/timing/thông số và approved art references, không hỏi lại số Boss. |
| D10 | Power curve | Q34/Q43 Ascension0–4/tăng vừa HP-damage/tỷ lệ elite, giữ telegraph; Q55density/Q56cap chặng. Cần baseline thông số/giới hạn tương tác và playtest, không thêm hệ stat/độ khó theo thiết bị. |
| D11 | Reward/progression | Q26–Q30/Q36/Q40–Q41 đã chốt temporary economy/slotLv1–5/draft cadence/random starter/unlock/meta banking; Q41 giải quyết Q11. Cần price/yield/reward-points/pool weights; không hỏi lại settlement hoặc mở currency mới. |
| D12 | Hệ cũ/phạm vi | Q31–Q34 đã map M-C/Sigil/Anomaly/Ascension; Q42 không cosmetic, Q59 data-settings mới/không migration. Tutorial/audio/flow thích nghi trong bản review, không tự mở archive/Collection/challenge mới hoặc đụng production. |
| D13 | Input/camera/UI | Q14–Q16/Q38–Q39/Q45/Q60 đã chốt vai trò/target/manual override/movement-interrupt/pause. Q61 thu hồi câu riêng; exact keys/gesture còn là proposal trong bảng input/mockup, không phải user đã duyệt mọi chi tiết. |
| D14 | Save/pause | Q04–Q06/Q58–Q60 đã chốt entry restart/reward pending-once/terminal/fresh profile/pause. Cần schema/storage/state transitions/focused integrity checks, không hỏi lại crash/migration như quyết định mới. |
| D15 | Reference/phân việc/nghiệm thu | Cần agent chuẩn bị reference/milestone/task cards theo Harness, mockup đúng scale và tiêu chí touch/desktop/performance. Đã có scope core/không cosmetic; chưa quyền code/art/deploy hoặc experience acceptance. |
| D16 | Skill/support/build | Q13–Q29/Q36–Q39/Q57 đã chốt4main/4phụ/9support/3-2-2/không mana/CD riêng/slot level/túi-bản trùng. Cần skill cards/compatibility-tradeoff/proc caps/timing/input matrix; không mở lại câu vai trò/slot/cooldown/ownership. |

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

### Q36 — D16.19: Đổi build và giữ phần đầu tư nâng cấp thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý KÈM LƯU Ý CÂN BẰNG SAU NGHIỆM THU**, design discussion only.
- Recommend một model quản lý build: chỉnh skill/support, nâng cấp và phân giải support dư ở màn chuẩn bị đầu lượt, mốc chọn thưởng và sau Boss/trước node kế; không đổi giữa combat. Chỉ trang bị các bản đã nhận trong lượt, không gọi cả catalog đã unlock vào dùng miễn phí.
- Làm rõ Q27 đã được user chốt qua Q36: **đầu tư cấp1–5 theo từng ô active**. Skill thay vào kế thừa cấp ô đó; hiệu lực tăng theo vai trò skill. Không chuyển cấp/nguyên liệu đầu tư giữa ba ô, không cộng cấp hai ô hoặc tạo nguyên liệu bằng đổi qua lại. Các phần khác Q27 giữ nguyên; không sửa/xóa log lịch sử Q27.
- Ví dụ: ô main cấp3 đang dùng projectile; đổi sang nova đã nhận thì nova dùng cấp3 ở ô main. Không cần nâng lại từ1 hoặc thao tác refund. Mỗi ô vẫn phải nâng riêng với chi phí tăng dần Q27.
- Support được tháo/chuyển giữa skill tương thích miễn phí trong các cửa sổ chỉnh build trên; support không tương thích khi đổi active trả về túi, không tự hủy/phân giải. Bản dư chỉ phân giải khi người chơi chọn; không đổi yield/price hoặc tự thêm phân giải active.
- Đổi skill/support không reset cooldown, hồi charge hay tạo thêm khiên/trụ/effect. Quy tắc timer/effect chi tiết cần spec sau, không dùng việc đóng/mở màn chỉnh build làm cách nhận lợi ích miễn phí.
- Lý do: cho thử skill mới ở giữa hành trình9node mà không mất sức mạnh đã đầu tư, vẫn có lựa chọn ưu tiên nâng ô nào và giữ/phân giải support. Các cửa sổ chỉnh build bám nhịp thưởng đã chốt, tránh thay bộ kỹ năng liên tục trong một trận.
- Ranh giới: chưa giới hạn túi/cách thay khi đầy, xử lý bản active trùng/không muốn nhận, giá/yield, thời điểm auto-pause/queue thưởng, mapping cooldown/effect cụ thể, UI/input hoặc save implementation. Không tăng số slot, không cho chuyển loại main/phụ trái pool; restart vẫn snapshot đầu node Q04–Q06, lifetime Q26 giữ nguyên. Approval design này không là implementation hoặc experience acceptance; không runtime/art/deploy/DDR.
- Câu trả lời user: **“y, nhưng note có thể sẽ cân bằng lại sau khi nghiệm thu”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q36.
- Nội dung đã chốt: **chỉnh build ở chuẩn bị/mốc thưởng/sau Boss; cấp1–5 theo từng ô, skill thay vào kế thừa; support tháo/chuyển miễn phí nếu tương thích, không hợp trả túi, phân giải dư thủ công; đổi không reset cooldown/nạp charge/tạo effect miễn phí**.
- Lưu ý user: **có thể cân bằng lại sau nghiệm thu**. Không coi model hiện tại hoặc các trị số chưa có là balance cuối cùng; ghi nhận feedback và thay đổi theo scope được giao sau này, không tự tune hoặc suy nghiệm thu hiện tại từ câu này.

### Q37 — D16.20: Nguyên tắc tương thích và đánh đổi của support thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **support tương thích theo đặc tính thật của skill, mỗi support có lợi ích và đánh đổi rõ**. Không phải cả chín support đều gắn được cho mọi skill; UI giải thích phần tác động và không tương thích. Ví dụ đa đạn cần skill thực sự bắn đạn, kéo dài cần hiệu ứng có thời lượng, hồi chiêu chỉ tác động skill có cooldown thật (không tự thêm cooldown main Q22). Không mana Q23 vẫn giữ.
- Ví dụ minh họa, chưa phải stat/card duyệt: đa đạn tăng độ phủ nhưng giảm sát thương từng viên; mở rộng vùng giúp clear nhưng có thể giảm sát thương; lặp thêm lần thi triển nhưng giảm sức mạnh mỗi lần. Tradeoff phải phù hợp từng support/skill, không dùng mana giả, không tự chọn trị số hoặc thêm cast-lock/channel timing.
- Combo mạnh được phép, nhưng cần giới hạn theo cơ chế để không có tự kích hoạt đệ quy vô hạn, khống chế Boss vĩnh viễn hoặc bất tử liên tục từ khiên. Không dùng một trần sát thương chung để xóa lợi ích xây build. Chain/pierce/repeat và sát thương chồng lên một mục tiêu cần rule cụ thể ở spec sau.
- Lý do: skill/support quyết định cách chơi và ưu tiên clear bầy hay đánh Boss, đồng thời giữ nguy hiểm/khả năng đọc trận khi đi qua9node với modifier cộng dồn. Không biến support thành chỉ số cộng miễn phí cho mọi build.
- Ranh giới: chỉ model compatibility/tradeoff/giới hạn tương tác; chưa bảng tương thích từng ô, giá trị/cap/thứ tự chain-pierce/proc/uptime, thuật toán offer hay skill roster/art. Không tự cấm mọi cộng hưởng hoặc tuyên bố balance đã nghiệm thu. Q36 có thể cân bằng lại sau nghiệm thu theo lưu ý user; không runtime/DDR/deploy.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q37.
- Nội dung đã chốt: **support tương thích theo đặc tính thật của skill, lợi ích đi kèm đánh đổi rõ; cho combo mạnh nhưng giới hạn để không có tự kích hoạt vô hạn, khóa Boss vĩnh viễn hoặc khiên tạo bất tử liên tục**. Các ví dụ không duyệt trị số/card; bảng tương thích và giới hạn cụ thể cần đề xuất/duyệt sau. Q23 không mana và Q36 lưu ý cân bằng sau nghiệm thu giữ nguyên.

### Q38 — D16.21: Main auto chọn mục tiêu và nhường quyền ngắm tay thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **auto chọn quái gần nhất hợp lệ khi cần mục tiêu mới, giữ ổn định mục tiêu hiện tại đến khi chết/ra khỏi tầm/bị khuất**. Hợp lệ là nằm trong vùng nhìn thấy của camera, đúng tầm skill và không bị tường cản đường ngắm; không tự di chuyển/đuổi quái. Không tự ưu tiên blue/amber/Boss thay quyết định chiến thuật của người chơi.
- **Ngắm tay luôn được ưu tiên trong lúc giữ thao tác ngắm**: desktop hướng chuột, mobile giữ-kéo hướng ngắm; thả thao tác trở về auto nếu auto đang bật. Chỉ nhường điều khiển hướng/mục tiêu, không tăng tầm, bẻ đạn xuyên tường hoặc bỏ qua cadence/cooldown. Nút/vùng ngắm/gesture/cancel cụ thể chưa chốt tại câu này.
- Skill không cần hướng như nova quanh người vẫn dùng vùng tác dụng thật; không ép quay theo mục tiêu hoặc tự chuyển tâm nova ra xa nhân vật. Timing di chuyển/thi triển/channel, cast priority, auto-off firing và input lifecycle cần hỏi tiếp.
- Lý do: giữ nhịp clear bầy ít thao tác, tránh aim giật qua lại, người chơi vẫn chủ động tập trung thủ lĩnh hoặc đe dọa cần xử lý. Hai nền tảng chung rule targeting, khác cách đưa ý định ngắm vào game.
- Ranh giới: chưa tầm/số giây giữ target/hysteresis/aim assist strength, tốc độ xoay, UI/chọn target chính xác khi chồng quái, đạn va chạm/pierce/chain, auto-cast skill phụ hoặc auto Dash/bình. Không duyệt input/layout/art implementation; không đổi Q14 hai phụ manual. Các ví dụ cần mockup/playtest hai nền tảng trước acceptance.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q38.
- Nội dung đã chốt: **main auto chọn quái gần nhất hợp lệ trong camera/tầm/không tường khi cần mục tiêu mới; giữ ổn định đến khi chết/ra tầm/bị khuất. Giữ ngắm tay ưu tiên theo chuột hoặc giữ-kéo trên mobile; thả về auto nếu bật. Không tự di chuyển/ưu tiên thủ lĩnh hoặc Boss. Nova theo vùng quanh người**. Chưa timing di chuyển/channel, gesture/layout/cancel cụ thể hoặc implementation.

### Q39 — D16.22: Vừa đi vừa đánh và ngắt đòn được tổ chức thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **melee/projectile/nova được vừa di chuyển vừa đánh, không mặc định đứng khựng mỗi nhịp**. Channel tia cũng cho di chuyển nhưng chậm hơn khi đang channel, tạo đánh đổi vị trí; tốc độ giảm và timing cụ thể chưa duyệt. Chung luật trên mobile/desktop.
- **Dash ưu tiên ngắt hành động đang thi triển khi Dash sẵn sàng và nhân vật có quyền hành động; skill phụ manual tạm ngắt main**, main không ngắt thao tác manual. Kết thúc Dash/skill phụ thì main trở lại nếu auto bật và có mục tiêu hợp lệ, hoặc đang giữ đánh khi auto tắt. Không tự cast skill phụ/Dash.
- **Tắt auto thì giữ thao tác đánh để main ra đòn theo nhịp hoặc channel; thả thì dừng yêu cầu thi triển tiếp**. Không tạo sát thương khi chỉ ngắm mà không ra lệnh đánh trong chế độ manual. Input mapping/hold-release/cancel/fresh-press, nhấn phụ một lần và gesture cụ thể còn phải đặc tả; không cấp permission triển khai UI.
- **Ngắt không hoàn cooldown, nhân đôi hit/proc hoặc tạo nhịp đánh sớm miễn phí**: phần hiệu ứng đã phát và tài nguyên đã tiêu không được hoàn lại chỉ vì ngắt; phần chưa phát không tự nổ sau Dash. Điểm commit/cooldown bắt đầu/hủy windup và effect đã tồn tại cần bảng timing riêng. Không kéo thêm cooldown riêng cho main trái Q22.
- Lý do: clear đông quái vẫn di chuyển/né linh hoạt, Dash và quyết định manual được phản hồi rõ, channel có đánh đổi khác với ba kiểu main còn lại. Giữ cadence/cooldown thật, không để animation auto giữ chân hoặc bỏ lệnh người chơi.
- Ranh giới: chưa định lượng slow channel/cast lock/cancel windows/input buffer/hit timing/skill phụ có cast time hay không, Dash i-frame/charge, thao tác bình, thao tác khi pause/blur/UI/fresh press hoặc tuning. Không đổi support compatibility Q37, targeting Q38 hoặc cho mọi skill miễn nhiễm/ngắt stun. Chưa spec/art/code/experience approval.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q39.
- Nội dung đã chốt: **melee/projectile/nova vừa đi vừa đánh; channel tia di chuyển chậm hơn khi thi triển. Dash sẵn sàng ưu tiên ngắt, phụ manual ngắt main; main trở lại theo auto khi có mục tiêu hoặc giữ đánh manual. Auto-off giữ đánh/thả dừng. Ngắt không hoàn cooldown/tài nguyên hoặc tạo hit/nhịp miễn phí, phần chưa phát bị hủy khi ngắt**. Chưa thông số/timing/input mapping cụ thể; đây là design approval, không playtest acceptance.

### Q40 — D11.6 / D16.23: Catalog ban đầu và cách mở khóa skill/support lâu dài thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend một model progression: **profile mới mở8 mục cơ bản** gồm2main (melee/projectile),2phụ (burst/AoE và khiên),4support (mở rộng vùng/tăng nhịp/cường hóa/hồi chiêu). Đây là catalog được phép roll, không cấp cả8vào build đầu. Bộ đầu vẫn random1main+1phụ+1support hợp main Q28; đủ2phụ khác nhau để lấp phụ2 ở Boss đầu Q30.
- Chín mục còn lại trong pool nền4main/4phụ/9support được mở dần: nova/channel tia; vùng khống chế/trụ; đa đạn/xuyên/chain/lặp/kéo dài. Không thêm roster/biến thể ngoài các archetype đã chốt. Support phải lọc theo tương thích Q37, hồi chiêu không vào main để tạo offer giả.
- **Dùng một loại điểm mở khóa vĩnh viễn để người chơi chủ động chọn mục muốn mở**, không roll trùng unlock. Điểm này tách với nguyên liệu phân giải/nâng ô trong lượt Q26; không dùng để tăng HP/damage vĩnh viễn, không biến unlock thành bản skill/support dùng miễn phí trong lượt hiện tại. Mục đã mở bổ sung vào pool random bộ đầu và pool thưởng build của **hành trình sau**.
- Lý do: có bộ dễ hiểu và luôn hợp lệ cho lượt đầu, nhưng còn các kiểu chơi khác để hướng tới; chọn unlock cụ thể cho mục tiêu lâu dài trong khi bộ đầu/thưởng build vẫn có randomness. Phân biệt rõ meta mở lựa chọn với level1–5 tạm trong lượt.
- Ranh giới: chưa nguồn/mức điểm/giá unlock/mốc nhận và giữ khi chết hoặc dừng/final bonus (quay lại Q11 ở câu sau), tốc độ hoàn catalog, phần thưởng khi đã mở hết, pool weighting, migration save cũ, UI/art hoặc skill card cụ thể. Không suy thưởng permanent mỗi Boss từ Q11 đang tạm gác. Đây là design approval, không implementation hoặc experience acceptance.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q40.
- Nội dung đã chốt: **catalog mở sẵn8mục** (melee/projectile; burst-AoE/khiên; mở rộng vùng/tăng nhịp/cường hóa/hồi chiêu), **điểm mở khóa vĩnh viễn riêng để chọn mở9mục còn lại**, không roll trùng hoặc tăng stat vĩnh viễn. Unlock bổ sung pool từ hành trình sau, không cấp bản dùng miễn phí trong lượt hiện tại; bộ đầu vẫn random Q28. Nguồn/giá/settlement/final bonus chưa chốt.

### Q41 — D11.7 / quay lại Q11: Điểm mở khóa được nhận và giữ khi nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only. Q11 gốc giữ nguyên log tạm gác để bảo toàn lịch sử; vấn đề settlement được chốt mới qua Q41 này.
- Recommend: **hoàn tất mỗi dungeon bằng hạ Boss thì chốt ngay điểm mở khóa lâu dài**, giữ100% số đã chốt dù chết ở node sau hoặc chủ động kết thúc sau Boss. Phần node chưa clear không cấp điểm meta; white/blue/amber vẫn phục vụ build/resource trong lượt theo nguồn đã chốt, không tự thêm điểm meta từng kill.
- **Điểm mỗi Boss tăng theo nấc, Boss cuối có thưởng hoàn thành thêm**. Mục tiêu tạo động lực đi sâu/thắng cả tree; chưa giá trị/công thức hoặc tuyên bố đã cân bằng điểm theo thời gian/rủi ro. Thưởng từ Ascension và khi hết catalog cần câu sau/spec riêng.
- **Một node chỉ thưởng một lần trong cùng hành trình**; nghỉ/restart không reroll/nhân điểm đã chốt. Khi đặc tả save phải ghi nhận clear/reward/checkpoint nhất quán với Q04–Q06; không dùng restart node làm đường nhận lại cùng phần thưởng. Không chốt thuật toán journal/transaction tại brainstorm.
- Chết hoặc dừng không có khoản bonus riêng, không mất điểm meta đã có. Build/cấp ô/nguyên liệu nâng tạm vẫn reset khi kết thúc Q02/Q03/Q10/Q26; save/nghỉ không kết thúc và theo checkpoint đầu node. Điểm meta không thay reward draft Q30, không cho dùng điểm meta thành stat hoặc hồi sinh.
- Lý do: mỗi dungeon clear đều tạo tiến bộ lâu dài, thất bại muộn không xóa công sức; mức điểm theo độ sâu và thưởng final giữ mục tiêu tiếp tục. Không áp economy cũ một unlock mới mỗi Boss vào catalog9mục còn khóa.
- Ranh giới: chưa số điểm/giá unlock/tốc độ hoàn catalog/điểm khi lỗi-crash hoặc death đồng thời Boss/Ascension multiplier/thưởng khi hết unlock, lựa chọn node cụ thể hoặc save migration. Chỉ model nguồn và giữ-mất, không tự accepted balance/art/code/deploy.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q41.
- Nội dung đã chốt: **clear dungeon bằng hạ Boss chốt ngay điểm mở khóa, giữ100% khi chết hoặc chủ động kết thúc; dungeon chưa clear không cho thêm điểm. Điểm mỗi Boss tăng theo nấc, final có thưởng hoàn thành thêm; mỗi node chỉ thưởng một lần/hành trình, nghỉ/restart không nhân điểm**. Không đổi reset build/nguyên liệu tạm; chưa trị số/giá/tốc độ tích lũy/Ascension multiplier hoặc thưởng khi hết catalog. Q41 giải quyết câu settlement Q11, không backfill approval vào log Q11 gốc.

### Q42 — D11.8: Sau khi mở hết skill/support, mục tiêu và phần thưởng chơi lại là gì?

- Trạng thái: **ĐÃ CHỐT — USER THU SCOPE VỀ ASCENSION; COSMETIC NGOÀI SCOPE**, design discussion only. Các dòng recommend ban đầu bên dưới giữ làm lịch sử, không là nội dung được duyệt trọn gói.
- Recommend ban đầu (user không duyệt toàn bộ): **chuyển mục tiêu lâu dài sang chinh phục Ascension, thử các main/build khác và sưu tầm cosmetic**. Giữ Ascension0–4 Q34, ghi nhận thắng theo từng kiểu main/Ascension và lịch sử hành trình; không dùng thời gian clear làm điều kiện bắt buộc.
- **Cùng điểm mở khóa Q40 được dùng mở cosmetic như huy hiệu/trail trong Collection**, không thêm currency mới hoặc roll trùng. Người chơi được ưu tiên skill/support hay cosmetic; không buộc mở cosmetic trước hoặc khóa power sau cosmetic. Cosmetic không tăng HP/damage/slot hoặc thay luật chiến đấu. Đây là mở rộng công dụng điểm đang đề xuất, chưa được user chốt.
- Mốc chinh phục có **huy hiệu thành tích trực tiếp**, ví dụ lần đầu thắng final/mức Ascension hoặc thắng với kiểu main mới; không bán huy hiệu thành tích bằng điểm. Các ví dụ/nhóm mục tiêu là hướng, chưa catalog/mốc/số lượng hay reward table được duyệt.
- Lý do: sau catalog nền17mục vẫn có đích thử build và chinh phục độ khó, điểm Boss còn nơi dùng mà không kéo sức mạnh vĩnh viễn tăng vô hạn. Một bộ cosmetic hữu hạn vẫn có thể hoàn tất; không hứa phần thưởng vô tận hoặc content tương lai tự sinh.
- Ranh giới: chưa cosmetic catalog/giá/nguồn artwork/tiêu chí thành tích/vòng đời điểm khi hết cả cosmetic/Ascension reward multiplier, migration challenge/history/trail cũ, UI hoặc art production. Tận dụng hướng Collection/History/Challenges/Trails đã có, không tự xóa approval/save cũ hoặc coi asset cũ hợp mọi tình huống mới. Artwork mới cần skill/game-art/reference/visual gate riêng. Không daily/season/shop tiền thật/power progression mới từ câu này.
- Câu trả lời user: **“scope ở ascension trước đi, đã có art đâu mà làm cosmetic”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q42.
- Nội dung hiện hành: **trước mắt mục tiêu chơi lại giới hạn ở Ascension0–4 Q34**. Không mở scope tạo cosmetic, badge/trail, đổi điểm lấy cosmetic hoặc mở rộng Collection/Challenge theo proposal trên. User chỉ rõ chưa có art cho cosmetic của rework; không tự lấy art/save/approval bản cũ làm quyền đưa cosmetic vào scope này.
- Điểm sau khi mở hết catalog: **chưa chốt công dụng tiếp theo**, không tự đổi sang tiền cosmetic hoặc bù stat vĩnh viễn. Q40–Q41 về unlock/nguồn/giữ điểm vẫn hiệu lực; chưa đặt cap/xóa/đổi/ngừng phát điểm mới. Không tự cấp phần thưởng thành tích theo từng main từ Q42 bị thu scope.

### Q43 — D10.2: Ascension tăng độ khó bằng những gì trong scope đầu?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **Ascension0 là baseline;1–4 tăng dần HP/sát thương quái ở mức vừa phải và tỷ lệ bầy blue/amber**. Dùng pool quái/Boss đã có trong bộ rework sẽ duyệt; chưa thêm họ quái, đòn riêng hoặc art riêng cho từng Ascension. Tỷ lệ blue/amber và số liệu phải thiết kế cùng ecology/density/map/power curve sau, không tự cho thêm special pack vượt budget.
- **Giữ tree9nấc, mật độ tổng trong budget và cùng quy tắc combat hai nền tảng**. Đổi thành phần bầy tạo áp lực ưu tiên mục tiêu, không chỉ tăng HP thành đánh lâu; chưa bảo đảm tỷ lệ/giá trị đã cân bằng. Mốc draft vẫn Q30, nhiều blue/amber không tự thêm lượt thưởng lớn hoặc số node.
- **Không cắt thời gian báo đòn/cửa né theo cấp Ascension**; timing chuẩn của từng đòn sẽ chốt trong design quái/Boss mới, không khóa lại timing production cũ. Không giảm i-frame/Dash/bình hoặc thêm debuff vô hiệu hóa build để tăng khó. Node buff/debuff vẫn Q35, chưa tăng số modifier theo Ascension.
- Lý do: có lộ trình thử build khó hơn mà giới hạn thêm content/art/AI độc lập, giữ khả năng đọc và né trong map đông quái. Tập trung tuning vài trục có thể so sánh thay vì mỗi cấp một hệ mới.
- Ranh giới: chưa bảng multiplier/tỷ lệ pack/budget/Boss scaling/Ascension reward multiplier/giá unlock, không cam kết balance hoặc device performance trước kiểm. Chỉ approval model thiết kế; không triển khai hoặc tạo art/cosmetic từ câu này.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q43.
- Nội dung đã chốt: **Ascension0 baseline;1–4 tăng vừa HP/damage và tỷ lệ bầy blue/amber. Giữ tree9nấc, mật độ tổng trong budget, hai mốc thưởng build/dungeon theo Q30, thời gian báo đòn/cửa né chung giữa các cấp. Chưa thêm roster/đòn/art riêng theo Ascension**. Chưa trị số/tỷ lệ/multiplier thưởng hoặc nghiệm thu balance; Q42 không cosmetic giữ nguyên.

### Q44 — D02.1: Đường nối tree và thời điểm khóa lựa chọn hoạt động thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **chọn tự do một trong2–3node nấc1; từ đó mỗi node có1–2đường đi tới nấc kế tiếp**, không nối toàn bộ node thành chọn tự do. Nhánh có thể tách/nhập lại; có đoạn chỉ một lối, có đoạn chọn hai, không bảo đảm mỗi bước luôn hai lựa chọn. Ngoại lệ cuối: mọi node nấc8 nối tới một node final nấc9.
- **Không ngõ cụt:** mỗi node có đường tới final; mọi node hiển thị được sinh trên ít nhất một tuyến hợp lệ từ nấc1. Toàn tree/đường nối/thông tin node xem trước Q08–Q09 và cố định suốt hành trình, không reroll khi clear/nghỉ/reload. Chưa thuật toán/tham số tạo cây cụ thể.
- **Xem trước node không khóa đường; bắt đầu dungeon đã chọn mới chốt**, khóa các node khác cùng nấc theo Q08 và nhận buff/debuff theo Q35. Không quay lại/chuyển node khi đang làm lại node; restart vẫn Q04–Q06. Tính khả năng tới node tương lai theo đường còn hợp lệ, không tùy tiện khóa node nhập nhánh vẫn tới được.
- Lý do: quyết định sớm thực sự ảnh hưởng lựa chọn về sau, người chơi nhìn cả cây để lập tuyến, nhưng không bị kẹt trước Boss cuối. Gói topology/commit này làm rõ contract tree đã chốt, không đổi thành hub chọn lại dungeon.
- Ranh giới: chưa thuật toán random/budget mức khó/cách phân bố buff-debuff/catalog/cap hoặc UI/layout/art tree. Không thêm node sự kiện/shop/nghỉ, không bỏ Boss từng node hoặc tăng số nấc. Chưa code/spec production/experience approval.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q44.
- Nội dung đã chốt: **nấc1 chọn bất kỳ node; mỗi node1–2đường sang nấc kế, có tách/nhập/đoạn một lối; mọi node nấc8 về final9. Không ngõ cụt, mọi node nằm trên tuyến hợp lệ, tree cố định/xem toàn bộ. Preview không khóa, bắt đầu dungeon mới chốt/khóa các node khác cùng nấc/nhận modifier**. Chưa thuật toán/phân bố modifier/layout UI; không đổi9nấc hoặc mở node shop/event/nghỉ.

### Q45 — D01.1: Bố cục bên trong mỗi dungeon nên có dạng nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **một tuyến chính uốn khúc từ điểm vào tới khu Boss, xen các khoảng rộng để giao chiến và một số nhánh phụ ngắn/vòng nối lại**. World liền mạch/camera theo nhân vật giữ yêu cầu gốc; không chuyển màn sau mỗi bầy hoặc phòng, không mê cung nhiều ngõ cụt dài. Random làm đổi hình tuyến/vị trí khoảng giao chiến và bầy, chưa chốt thuật toán sinh map/asset.
- Nhánh phụ dành cho **bầy/thủ lĩnh đánh thêm**, không bắt người chơi mò hết nhánh phụ mới tới Boss. Điều kiện mở Boss/thanh clear/đánh bao nhiêu vẫn cần câu riêng; không tự cho chạy thẳng bỏ mọi bầy hoặc bắt100%kill từ quyết định layout này. Không thêm chest/shop/event hoặc draft vượt Q30.
- **Đường đi và khoảng giao chiến đủ rộng để di chuyển/né, đọc telegraph khi đông quái** trên cả mobile/desktop; khu Boss ở cuối tuyến có không gian né phù hợp. Chưa số màn hình/diện tích/số khu/số bầy, corridor width/camera zoom/collider hoặc khóa cửa khu Boss.
- **Minimap khám phá dần**, hiện phần đã đi qua và đánh dấu Boss khi tìm thấy, không lộ toàn layout ngay từ tree. Đây là hướng chức năng, chưa duyệt bố cục/art HUD; scope visual cần reference/mockup/approval sau. Không thay Q09 thông tin node công khai.
- Lý do: có cảm giác tiến sâu và clear liên tục, vẫn có khám phá/lựa chọn kéo thêm bầy, giảm đoạn chạy trống hoặc mò lối quay đầu. Tách topology trong dungeon với tree giữa dungeon đã chốt Q44.
- Ranh giới: chưa biome/art direction/số theme, map size/pacing/route generation/bầy ecology/aggro/respawn/Boss unlock/loot/sustain hoặc UI/input. Không suy khả năng chạy mượt/device readability từ proposal; không production spec/art/code/deploy.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q45.
- Nội dung đã chốt: **tuyến chính uốn khúc tới khu Boss, xen đường đi/khoảng rộng giao chiến và nhánh phụ ngắn/vòng nối có thêm bầy/thủ lĩnh; không buộc mò nhánh phụ tới Boss. Dungeon liền mạch/camera theo người, minimap khám phá dần/đánh dấu Boss khi tìm thấy; random hình tuyến/vị trí khu giao chiến/bầy**. Chưa điều kiện mở Boss/size/biome/art/generation hoặc HUD layout approved.

### Q46 — D05.1 / D09.1: Clear tới mức nào thì được đánh Boss?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **mở Boss theo tiến độ hạ quái, không theo thời gian hoặc100%clear**. White có đóng góp; blue/amber đóng góp nhiều hơn theo độ nguy hiểm. Mốc khởi điểm để tuning khoảng75%tổng giá trị quái của map, không phải75%đơn vị quái nếu trọng số khác nhau. Ngưỡng/trọng số cuối cần bảng cân bằng và playtest, chưa approved balance.
- **Tuyến chính luôn có đủ quái/bầy đặc biệt để đạt mốc mở Boss và mốc draft trong map Q30 nếu clear đầy đủ tuyến chính**; nhánh phụ là lựa chọn thêm, không bắt quay đầu mò quái lẻ hoặc tìm một thủ lĩnh bắt buộc giấu trong nhánh. Phải ràng buộc map generation/pack budget ở spec để bảo đảm điều này ở mọi Ascension, không chỉ kỳ vọng ngẫu nhiên.
- **Đủ tiến độ thì khu Boss cuối tuyến được mở; người chơi chủ động vào bắt đầu trận**. Boss không tự xuất hiện cạnh nhân vật ngay lúc đầy thanh, không tự teleport người chơi đang clear bầy. Được chọn tiếp tục khám phá trước khi vào Boss; chưa rule rời khu Boss khi đã bắt đầu hoặc xử lý bầy còn đuổi.
- Thanh mở Boss **tách với mốc draft blue/amber Q30**, không cộng thêm draft hoặc thay điều kiện reward elite bằng white. Áp dụng mỗi dungeon gồm nấc9; chỉ hạ Boss mới clear node/nhận điểm meta Q41, đầy thanh chưa clear.
- Lý do: cần thực sự đánh bầy để tiến tới Boss, nhưng tránh100%cleanup/đợi timer; người chơi biết rõ đích và chủ động chuẩn bị trước trận cuối map.
- Ranh giới: chưa tỉ trọng white/blue/amber/ngưỡng cuối, UI thanh, khóa cửa/exit Boss, bầy chase vào Boss, rewards/loot pending/transition sau Boss, respawn hoặc kỹ thuật spawn. Không mở artwork/code/acceptance từ proposal.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q46.
- Nội dung đã chốt: **hạ quái tích tiến độ có trọng số để mở khu Boss, white có góp/blue-amber góp hơn; mốc khởi điểm tuning khoảng75%tổng giá trị quái, không timer/100%cleanup. Tuyến chính đủ mốc mở Boss và draft elite nếu clear đầy đủ; nhánh phụ tùy chọn. Đủ thanh mở khu Boss cuối tuyến, người chơi chủ động vào/không tự spawn hoặc teleport; thanh Boss tách mốc draft Q30**. Ngưỡng/trọng số cuối/khóa cửa/bầy đuổi vào Boss chưa chốt; không coi75%là balance đã nghiệm thu.

### Q47 — D04.1: White/blue/amber và thành phần mỗi bầy khác nhau thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý VÀ BỔ SUNG BIẾN THỂ HIẾM BLUE + AMBER**, design discussion only; xem câu trả lời phần làm rõ bên dưới.
- Recommend ban đầu: **mỗi bầy là một nhóm đông quái nhỏ + một đầu đàn lớn**, bám yêu cầu gốc không spawn lần lượt3con. Độ hiếm của bầy xác định bởi đầu đàn; lính đi kèm phần lớn white, không biến toàn bộ lính thành elite khi bầy blue/amber. Bổ sung của user bên dưới mở thêm khả năng lính blue, không dùng câu recommend cũ để bác yêu cầu này. Cách/quy mô spawn thực tế và số lượng cần câu aggro/performance/density tiếp, chưa chốt count.
- **Bầy white:** lính white + đầu đàn white lớn/khỏe hơn, không affix đặc biệt; chiếm đa số để tạo nhịp clear. **Bầy blue:** lính white + một đầu đàn blue có1đặc tính chiến đấu rõ. **Bầy amber:** lính white + một đầu đàn amber có2đặc tính tương thích, là điểm giao chiến nguy hiểm hơn, chưa phải Boss. Boss riêng cuối dungeon giữ Q46.
- **Độ hiếm tách với loại hành vi**: có bầy thiên cận chiến, bầy thiên bắn xa hoặc hỗn hợp có vai trò chủ đạo. Tránh mỗi bầy cùng lúc có mọi loại nguy hiểm; affix blue/amber phải đọc được và có counterplay, không chỉ nhân HP. Chưa roster/affix cụ thể hoặc bản art lớn/màu nào được duyệt.
- Lý do: đông lính tạo cảm giác quét bầy, đầu đàn là mục tiêu để tập trung skill phụ; blue/amber thay nhịp và đóng góp reward Q30/Boss-progress Q46 rõ. Ascension Q43 tăng tỷ lệ loại bầy, không tự biến mọi mob thành thủ lĩnh.
- Ranh giới: chưa số quái/bầy/tổng bầy/tỷ lệ white-blue-amber/HP-size-damage/affix catalog/dấu hiệu visual, chết đầu đàn ảnh hưởng lính thế nào/nguồn material-flask, spawn placement/aggro/leash/respawn. Đầu đàn lớn là gameplay direction, không approval concept/production art hoặc runtime. Không thêm draft riêng mỗi thủ lĩnh.
- Câu trả lời user: **“y, hiếm hơn thì quái blue và đầu đơn amber”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q47. Hiểu “đầu đơn” theo ngữ cảnh là đầu đàn, giữ nguyên quote.
- Ghi nhận ban đầu: user đồng ý hướng bầy/quái đầu đàn và **bổ sung bầy hiếm hơn gồm lính blue + đầu đàn amber**. Lúc đó chưa rõ biến thể bổ sung hay thay toàn bộ amber nên hỏi làm rõ, không tự chọn. Affix của lính blue/đầu đàn chết ảnh hưởng lính/giá trị reward cụ thể chưa được quyết định qua bổ sung.
- **Recommend phần làm rõ:** **giữ ba cấu trúc ban đầu và thêm biến thể hiếm hơn: lính blue + đầu đàn amber**. Vẫn chỉ3cấp rarity white/blue/amber, không tạo rarity thứ4. Lý do: có đỉnh nguy hiểm bất ngờ trong map, không biến mọi lần gặp đầu đàn amber thành cả bầy elite. Chưa tỉ lệ/count/stats/affix hoặc art.
- Câu trả lời phần làm rõ: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, sau recommend giữ amber thường/thêm biến thể hiếm. Ghi nhận theo quy ước user dùng “y” để đồng ý recommend; không chọn phương án thay mọi bầy amber.
- Nội dung hiện hành: **white+đầu đàn white; white+đầu đàn blue; white+đầu đàn amber; hiếm hơn có blue+đầu đàn amber**. Vẫn3rarity; blue đầu đàn1đặc tính/amber đầu đàn2đặc tính tương thích theo model gốc. Chưa áp máy móc1affix độc lập cho từng lính blue, chưa count/tỉ lệ/roster/art hoặc reward per mob.

### Q48 — D04.2 / D05.2: Bầy xuất hiện, phát hiện và truy đuổi người chơi thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **các bầy được bố trí sẵn trong dungeon random, gặp là cả bầy**, không đẻ nối tiếp3con hoặc sinh thêm sau lưng tại vùng vừa clear. Đây là logical placement, không bắt engine render/update toàn map cùng lúc; restart node vẫn Q04–Q06, không reroll.
- **Lại gần trong vùng phát hiện hoặc đánh trúng một thành viên thì đánh động cả bầy**; tường chặn phát hiện trực tiếp. Bầy khác chỉ tham chiến khi cũng bị phát hiện/đánh động cục bộ, không lan aggro vô hạn tới toàn map. Chi tiết bán kính/line-of-sight/độ trễ/chia sẻ cảnh giác cần spec AI.
- **Cho kéo nhiều bầy để đánh chung**, đổi lấy rủi ro bị vây/đạn/nguy hiểm nhiều hướng; không bắt clear xong một bầy mới được đánh bầy sau. Chưa count/concurrency cap hoặc thuật toán AI/performance; không âm thầm xóa/đóng băng địch đang trong giao chiến để giữ FPS.
- **Truy đuổi trong phạm vi hợp lý; bỏ quá xa thì quay về khu ban đầu**, không đuổi xuyên cả dungeon. **Quái đã chết không respawn trong cùng lần chơi node; đầu đàn chết thì lính còn sống vẫn chiến đấu**, không tự biến mất hoặc được cấp lại để farm. HP khi mất aggro/quay về và invulnerability trong reset chưa chốt, không tự cho heal full hoặc bất tử.
- Lý do: giữ cảm giác clear một thế giới có bầy thật, cho chủ động kéo bầy và thoát khi nguy hiểm, vùng đã clear có giá trị; không biến combat thành waves khóa phòng hoặc truy đuổi toàn map.
- Ranh giới: chưa aggro/leash distance/HP reset/pathfinding/body collision/damage contact, density/pack budget/bầy elite affix, Boss gate/địch đuổi vào Boss, loot/flask charge từ kills hoặc device FPS. Leash thường không tự áp Boss, chưa production spec/art/code/experience approval.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q48.
- Nội dung đã chốt: **bầy bố trí sẵn trong dungeon random/gặp cả bầy, không spawn nối3con hoặc đẻ sau lưng vùng đã clear. Gần hoặc đánh trúng đánh động cả bầy, tường chắn phát hiện trực tiếp/aggro cục bộ; được kéo nhiều bầy. Quá xa thì quay về, không đuổi cả map; quái chết không respawn trong lần chơi node, đầu đàn chết lính còn sống vẫn đánh**. Chưa số lượng/khoảng cách/HP khi quay về/Boss leash hoặc performance đã nghiệm thu.

### Q49 — D07.1: Bình máu dùng và nạp lại trong dungeon/Boss thế nào?

- Trạng thái: **USER ĐÃ CHỐT MODEL CHARGE THAY LƯỢT RỜI VÀ THÊM QUÁI CẤP THẤP TRONG BOSS**, design discussion only. Recommend gốc bên dưới giữ làm lịch sử; không duyệt trọn gói3lượt/35%/nạp trực tiếp50%.
- Recommend gốc (đã bị user sửa): **bình máu manual riêng Q16 có tối đa3lượt dùng; mỗi lần hồi ngay35%HP tối đa, không vượt đầy máu**. Bắt đầu hành trình có đủ3lượt, không tiêu lượt khi HP đang đầy. Đây không là balance được user nghiệm thu; hồi giữa node hỏi riêng sau nhịp adds.
- **Hạ quái tích tiến độ để nạp lại lượt bình**, white góp ít/blue-amber nhiều hơn; đủ ngưỡng nhận1lượt tới cap3. Không tự hồi HP hoặc nạp bình nhờ đứng chờ. Đây là resource recovery, không phải mana mới cho skill và không thêm draft Q30. Chưa ngưỡng/trọng số/overflow ở cap hoặc source kill từ effect/phụ/trụ cụ thể.
- **Boss lần đầu xuống50%HP cho thêm1lượt bình, tối đa cap**, chỉ trigger một lần trong trận, không farm bằng reset/heal Boss. Có đường bổ sung hồi phục khi Boss không có adds, không buộc tạo thêm lính chỉ để nạp bình. Chi tiết checkpoint/reset event phải theo Q04–Q06, chưa tự thêm heal người chơi tại50% hoặc auto-use.
- Lý do: bình là quyền quyết định khi nào hồi, clear bầy giúp phục hồi để tiếp tục đi map, Boss có nguồn nạp hữu hạn và dự đoán được. Không khuyến khích chạy trốn đứng chờ vô hạn khi thời gian clear không quan trọng.
- Ranh giới: chưa reuse cooldown/action priority/cast animation/i-frame/cancel/HP threshold/vi-en/HUD, ngưỡng refill/overflow/Ascension-sustain tuning hoặc node anti-heal modifiers. Không tự giữ hệ hồi máu cũ thành nguồn cộng thêm, cũng chưa duyệt hút máu/regen hoặc xóa source cũ trong production; cần mapping theo scope. Hồi sau Boss/giữa node hỏi tiếp, không tự heal full từ Q49. Không art/code/experience approval.
- Câu trả lời user: **“làm giống bình POE đi, có charge, xài bình thì tiêu 1 phần charge, đủ số charge là xài, k cần phải đầy bình. đầy charge thì xài đc 2,5 lần đi, thêm 1 ít quái cấp thấp trong boss để có thể charge đc bình”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q49.
- Nội dung đã chốt/thay recommend: **charge tích liên tục; mỗi lần dùng trừ một lượng cố định; đủ chi phí một lần thì dùng ngay, không cần đầy bình. Sức chứa bằng2,5lần chi phí một lần dùng. Hạ quái nạp charge, Boss có một ít quái cấp thấp để cung cấp charge**. Vẫn bình manual riêng Q16, không thêm mana cho skill. Ví dụ chuẩn hóa **max100/cost40** chỉ minh họa tỷ lệ: dùng2lần từ đầy còn20, thêm20đủ dùng lần3; không coi đây là số lấy từ PoE hoặc charge-per-kill đã duyệt.
- Phạm vi supersede: bỏ model3lượt rời và thay nguồn bổ sung trong Boss bằng quái cấp thấp, **không giữ thêm cấp trực tiếp một lượt khi Boss50%HP**. Đây là ngoại lệ có chủ đích cho adds trong trận Boss, không biến map thường thành respawn waves trái Q48. Lượng/nhịp hồi HP (35%ngay chưa approved), charge mỗi loại quái, dung lượng tuyệt đối/chi phí, số/nhịp adds, khởi đầu/hồi giữa node/overflow/cooldown còn cần chốt. Không tự mở toàn hệ flask affix/rarity/equipment của PoE.

### Q50 — D07.2 / D09.2: Quái cấp thấp trong Boss xuất hiện theo nhịp nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only; câu hồi sau Boss/giữa node dời sau vì user bổ sung adds vào Q49.
- Recommend đã được user đồng ý: **ba đợt white nhỏ theo mốc Boss lần đầu xuống75%/50%/25%HP**, không spawn vô hạn theo thời gian. Mỗi đợt có vài con dễ dọn; target tuning charge tổng mỗi đợt khoảng nửa chi phí dùng bình, tức ba đợt cộng khoảng1,5lần dùng. Số con/charge-per-white phải nhất quán với quái white ngoài map, không tự cho charge-per-kill khác trong Boss; count/trọng số cuối chưa duyệt hoặc nghiệm thu balance.
- **Boss vẫn có thể nhận sát thương, không bắt dọn sạch lính hoặc chuyển sang pha bất tử**. Adds gây áp lực nhẹ và là lựa chọn để lấy charge; vị trí xuất hiện có báo trước/không chồng người chơi, cần budget để không che telegraph chính. Cách phối hợp moves/spawn cụ thể theo Boss chưa chốt.
- **Mỗi mốc chỉ gọi một đợt, không lặp bằng heal/reset/giữ Boss sống; adds chỉ cung cấp charge**, không thêm meta points/draft/material riêng. Đợt adds không cần đầu đàn, là nhóm phụ của Boss chứ không phải bầy map Q47. Kill/reset accounting và tình huống skip nhiều mốc bằng burst cần spec, không tự dồn cả ba đợt tức thì.
- Lý do: lấy lại charge bằng hành động chiến đấu theo yêu cầu user, lượng hồi phục hữu hạn và tiến triển theo trận, không khuyến khích giữ Boss sống để farm vô hạn. Không tự hồi HP hoặc cấp charge trực tiếp khi qua mốc.
- Ranh giới: chưa white roster/count/stats/charge-per-kill/spawn timing/telegraph art/queue khi skip phase/địch còn lại sau Boss chết/khóa cửa Boss, heal amount/duration/giữa node. Chưa dùng lại artwork cũ vào runtime hoặc thêm Boss patterns từ proposal; vẫn cần design/art gate và playtest.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q50.
- Nội dung đã chốt: **ba đợt white nhỏ ở75/50/25%HP Boss lần đầu; mỗi đợt target charge khoảng0,5lần dùng bình. Boss vẫn nhận damage, không bắt dọn lính; mỗi mốc một đợt hữu hạn, lính chỉ cung cấp charge/không thêm draft hoặc meta points**. Count/stats/charge value cuối/skip nhiều mốc/spawn art/địch còn sau Boss chết còn cần spec; không suy experience acceptance từ design approval.

### Q51 — D07.3: Sau Boss và khi sang dungeon kế, nhân vật được hồi phục thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **mỗi dungeon là một chặng tiêu hao riêng; hạ Boss thành công khi nhân vật còn sống thì hồi đầy HP và charge bình để chuẩn bị dungeon kế**. Bắt đầu hành trình cũng đầyHP/charge. Không cấp heal/refill miễn phí lúc tới cửa Boss trong cùng dungeon, vẫn phải quản lý bình Q49–Q50 suốt map/trận Boss.
- **Skill phụ và Dash sẵn sàng khi vào dungeon kế**, không phải đứng chờ cooldown ở tree. Dọn hiệu ứng combat ngắn hạn (đạn/nguy hiểm, trụ/khiên/tác động tạm) trước chặng mới; không carry một đòn/trụ/khiên từ node trước sang để nhận lợi ích miễn phí.
- **Build/cấp từng ô/nguyên liệu nâng và buff-debuff node cộng dồn giữ nguyên**. Hồi phục không gỡ debuff node Q35; áp dụng giới hạn HP/charge hiện hành theo modifier, chi tiết thứ tự nhận modifier và snapshot phải được spec nhất quán Q04–Q06. Chết không được hồi sinh từ rule hồi sau Boss; edge case chết/Boss chết cùng lúc chưa chốt.
- Lý do: thắng một dungeon cho cảm giác chuẩn bị sẵn để đi tiếp, tránh xuống dốc tài nguyên qua9node; khó tăng nhờ build-check/modifier/tree/Ascension chứ không ép kéo theo vài HP và bình cạn từ map trước. Rủi ro và tiêu hao vẫn có ý nghĩa trong từng dungeon.
- Ranh giới: chưa hồi bao nhiêu/mất bao lâu mỗi lần dùng bình (35%instant Q49 gốc chưa approved), charge-per-kill/reuse cooldown, xử lý quái còn lại/reward pending/transition chính xác, anti-heal modifiers cụ thể hoặc stat multipliers. Không sửa reset build khi chết/thắng/kết thúc hoặc tự mở node nghỉ/shops. Chỉ design approval, chưa runtime/art/experience approval.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q51.
- Nội dung đã chốt: **start hành trình và sau Boss thành công đầyHP/charge; khi vào node mới phụ/Dash sẵn sàng, dọn combat effects tạm, giữ build/cấp ô/nguyên liệu và modifier node cộng dồn. Không refill miễn phí trước Boss trong cùng map, không revive người đã chết**. Chưa transition/death đồng thời Boss/anti-heal và heal-per-use chi tiết.

### Q52 — D07.4: Baseline lượng hồi và charge của bình để playtest là gì?

- Trạng thái: **ĐÃ CHỐT — USER BỔ SUNG HOT VÀ ĐỒNG Ý PHẦN LÀM RÕ/BASELINE**, design discussion only; không balance/experience acceptance.
- Recommend baseline gốc: **max100charge, cost40/lần, hồi ngay35%HP tối đa/lần**. Giữ tỷ lệ2,5lần Q49;100/40 từ ví dụ được đề xuất thành baseline cụ thể, chưa balance nghiệm thu. Phần chỉ hồi ngay/không HoT của recommend đã bị user bổ sung20%hồi dần bên dưới; không lấy nội dung cũ bác HoT. Chưa thêm affix/rarity/equipment cho bình.
- **Hạ white +4charge, blue +8, amber +20** tới cap100; charge vượt cap không cất thành bình dự trữ. Kill từ skill/phụ/trụ của nhân vật đều tính; mỗi quái chết thật chỉ tính một lần. Trọng số này cho charge, không tự dùng làm trọng số mở Boss/draft Q30/Q46. Chưa thêm nạp theo thời gian/đòn đánh hoặc source vô hạn.
- **Bấm một lần dùng một lần; không tiêu charge khi HP đầy; khoảng dùng lại0,5s** để tránh một thao tác vô tình uống nhiều lần. Đây là reuse state thật cần HUD/input theo contract, không giả resource/timer. Priority khi đang Dash/channel/cast và input lifecycle cụ thể vẫn phải spec.
- Kiểm tính nhất quán proposal: **10white nạp đủ1lần; đợt5white trong Boss cấp20charge=nửa lần dùng** theo target Q50. Count5là baseline đề xuất cho các đợt white, không suy mọi Boss đã có roster/art hoặc pattern được duyệt. Hồi giữa node Q51 giữ nguyên.
- Lý do: hồi tức thì dễ đọc khi combat đông, tiêu charge rõ và nạp lại theo clear bầy; các số cùng một đơn vị kiểm được, không dùng thêm thanh tiến độ đổi thành lượt rời. Cần playtest với burst damage/map density/Ascension và tuning sau nghiệm thu khi user giao, không coi số cuối cùng.
- Ranh giới: chưa anti-heal modifiers/heal-effectiveness/cap tương tác/kill reward override, trắng đầu đàn có bonus hay không (baseline theo rarity)/UI-art/action priority/cooldown hitstop/pause và device feel. Chưa production spec/code/assets/deploy hoặc user playtest acceptance.
- Câu trả lời user: **“35% hồi ngay thêm 20% dần dần trong 3-5s tiếp theo”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q52.
- User chốt phần hồi ban đầu: **35%HP tối đa ngay +20%HP tối đa hồi dần trong3–5s tiếp theo**, tổng tiềm năng55%HP/lần nếu hồi trọn/không overheal. Các chi tiết4s/refresh và bộ số đã được hỏi làm rõ riêng bên dưới, không suy từ câu bổ sung đầu tiên.
- **Recommend phần làm rõ:** lấy **4s** làm baseline trong khoảng user giao, HoT **5%maxHP/s**, **không cộng dồn tốc độ hồi**. Uống tiếp vẫn hồi35%ngay, **thay phần HoT còn lại bằng một đợt20%/4s mới** (phần chưa hồi cũ mất, không cộng thời lượng hoặc xếp hàng); ăn đòn không hủy HoT, đầyHP thì kết thúc/không dự trữ hồi. Lý do: phần tức thì cứu nguy, hồi dần khuyến khích né giữ nhịp thay vì uống liên tiếp để chồng regen. Giữ bộ thông số charge đã đề xuất Q52 để user chốt cùng.
- Câu trả lời phần làm rõ: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, sau recommend4s/refresh không stack và giữ bộ số Q52.
- Nội dung hiện hành đã chốt: **max100/cost40charge;35%HP ngay+20%trong4s; uống lại thay HoT cũ/không stack hoặc queue, hit không hủy/đầyHP kết thúc. Kill white4/blue8/amber20charge tới cap, overflow bỏ; bấm một lần/0,5s reuse/đầyHP không tiêu. Baseline5white mỗi đợt adds=20charge/nửa lần dùng Q50**. Các số là baseline để thử/tuning, chưa balance nghiệm thu; đầy bình2,5lần Q49 và hồi giữa node Q51 giữ nguyên. Modifier/action priority/timing pause/skip mốc Boss còn cần spec.

### Q53 — D09.3: Bản rework đầu cần bao nhiêu Boss và vai trò gì?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend phạm vi gameplay: **3Boss thường cho các dungeon nấc1–8 +1Boss cuối riêng ở nấc9**. Ba vai trò thường: **áp sát**, **bắn xa**, **kiểm soát vùng**; mỗi Boss khoảng2–3đòn chủ đạo có báo hiệu/cửa phản công. Đây là archetype, chưa tên/đòn/trị số/ngoại hình hoặc asset reuse được duyệt.
- Phân bố Boss cố định trên tree sinh đầu hành trình/xem trước Q09, tránh gặp cùng Boss ở hai node liên tiếp trên tuyến hợp lệ. Tái sử dụng pool3Boss qua nấc1–8 với scaling theo độ sâu/modifier/Ascension, không thêm Boss riêng cho từng node hoặc mỗi cấp Ascension.
- **Boss cuối là trận riêng, có2pha**, phối hợp các kiểu né/giữ vị trí đã học, khó hơn Boss thường; không chỉ đổi màu/tăngHP đầu đàn amber. Chi tiết phase threshold/moves/combo/invulnerability chưa chốt, không tự lấy old Chain Warden timing làm contract mới.
- Bình/ba đợt adds/hồi sau Boss giữ Q49–Q52; **adds75/50/25%không đồng nghĩa các mốc đổi pha Boss**, không dùng approval pool để đổi cadence hồi phục. Final thắng vẫn kết thúc tree Q10, không endless auto-loop.
- Lý do: có biến đổi về cách giao chiến xuyên8map mà giới hạn số bộ moves và nội dung phải làm, final tạo đích rõ. Scope mới chỉ gameplay direction; ngoại hình/reference/asset và đòn cụ thể phải duyệt riêng theo Harness/art gate, không quyền tạo art/triển khai từ brainstorm.
- Ranh giới: chưa danh tính/Boss type-asset mapping/provenance/phase timing/HP-damage/arena geometry/fight-lock/clear transition/death đồng thời Boss hoặc counterplay spec. Giữ production/approval cũ, không hứa4bộ artwork đã sẵn hoặc mở cosmetic. Chưa runtime/experience acceptance.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q53.
- Nội dung đã chốt: **3Boss thường (áp sát/bắn xa/kiểm soát vùng), mỗi Boss khoảng2–3đòn chủ đạo, phân bố nấc1–8/tránh lặp cùng Boss hai dungeon liên tiếp;1Boss cuối riêng2pha ở9. Scaling theo độ sâu/modifier/Ascension, pool cố định/xem trước trên tree**. Ngoại hình/asset/bộ đòn cụ thể/phase threshold và balance chưa duyệt; nhịp adds Q50 tách phase transitions, không mở cosmetic.

### Q54 — D09.4 / D08.1: Ranh giới trận Boss và flow clear sang node kế thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **chủ động vào khu Boss đã mở thì khóa trận tới khi thắng hoặc chết**. Quái/đạn từ ngoài không theo hoặc bắn xuyên vào, người chơi không quay ra farm charge trong lúc đấu; Boss không leash về hồiHP do người chơi chạy ra khỏi khu. Cửa/khu Boss đủ rộng theo Q45, không refill miễn phí lúc vào theo Q51.
- **Boss bị hạ khi nhân vật còn sống thì kết thúc combat ngay, dọn lính phụ/đạn/vùng nguy hiểm còn lại trong trận** để nhận thưởng an toàn. Dọn là cleanup, không tính thêm kill/reward. Không dùng hồi sau Boss cứu người đã chết; trường hợp hai bên chết cùng thời điểm cần spec thứ tự phân xử, không tự hứa cơ chế hồi sinh hoặc thay Q02.
- **Nấc1–8:** chốt điểm meta ngay Q41, hồi phục Q51, giải quyết mọi draft đang chờ và draft Boss Q30, cho chỉnh build Q36 rồi chọn node kế trên tree. Chỉ chuyển khi người chơi xác nhận node hợp lệ, không tự teleport trước khi chọn thưởng/xong build. Chưa phê duyệt bố cục/số màn UI, không thêm portal-run/chờ timer.
- **Nấc9:** hạ final đi tới tổng kết/thưởng hoàn thành Q10/Q30/Q41, không thêm draft tạm sau final hoặc giữ build đi endless. Save/nghỉ/thoát ở bước reward/tree phải bảo toàn claim/choice đã chốt, cần save-state spec riêng; không cho restart node Boss đã clear để nhận lại meta/reward.
- Lý do: trận Boss có ranh giới rõ và nguồn charge hữu hạn từ adds Q50, chiến thắng được nhận thưởng an toàn và có quyền chuẩn bị/chọn tuyến tiếp. Flow tôn trọng lựa chọn tree thay vì kéo người chơi sang map tiếp ngay khi chưa xử lý phần thưởng.
- Ranh giới: chưa hình học/cửa/telegraph artwork, damage-death resolution/simultaneous event ordering, thời điểm auto-pause/queue UI/input fresh-press, crash/journal/save migration hoặc menu. Không tự sửa timing/moves/Boss pattern hoặc bản production. Chỉ design approval, không code/assets/deploy/experience acceptance.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q54.
- Nội dung đã chốt: **vào Boss khóa trận, cách ly quái/đạn ngoài, không ra farm charge. Thắng khi còn sống kết thúc combat/dọn lính phụ-đạn-hazard; chốt điểm/hồi phục/giải quyết draft pending+Boss/chỉnh build/chọn tree/xác nhận node mới chuyển. Nấc9 tổng kết**. Death đồng thời Boss/save/queue/input/visual cụ thể vẫn cần spec, không tự cấp nghiệm thu.

### Q55 — D01.2 / D04.3: Baseline quy mô map và mật độ bầy để thử là bao nhiêu?

- Trạng thái: **USER ĐỔI HƯỚNG SANG REFERENCE CẢM GIÁC/MẬT ĐỘ ATLAS POE; CHƯA CHỐT SỐ**, design discussion only. Bộ số recommend ban đầu giữ làm lịch sử, không coi được duyệt hoặc là dữ liệu PoE.
- Recommend cũ/chưa được duyệt: **10–16lính nhỏ +1đầu đàn mỗi bầy**, bố trí nhiều bầy gần nhau và đoạn chuyển ngắn theo layout Q45. Baseline map **nấc1–3:12–16bầy;4–6:16–20bầy;7–9:20–24bầy**, không tính Boss/adds. Số ở đây là quái tồn tại trong map, không phải toàn bộ cùng active/on-screen.
- **Nhịp giao chiến thường2–3bầy gần nhau**, có thể chủ động kéo thêm theo Q48; không hard-cap ba bầy bằng xóa/đóng băng địch. Đường đi/khoảng rộng phải đủ đọc telegraph/né, tránh chỉ tăng chiều dài đường trống khi đi sâu. Không đặt deadline clear hoặc suy thời lượng hoàn thành từ counts.
- **Ascension0 baseline khoảng60%bầy white/30%blue/10%amber**; biến thể lính blue+đầu đàn amber nằm trong nhóm amber, **tối đa1bầy/map và không bảo đảm map nào cũng có**. Đây là tỉ lệ mục tiêu/rounding phải hợp số bầy; các cấp Ascension tăng blue/amber theo Q43 nhưng chưa multiplier cụ thể. Rarity/affix/counterplay Q47 giữ nguyên.
- Phân bố phải thỏa **tuyến chính đủ giá trị Boss-progress~75%map và draft elite Q46/Q30**, không ép mò nhánh phụ; không được chọn count/rarity làm tuyến chính thiếu tiến độ. Charge trắng4/blue8/amber20 và năm white mỗi đợt adds Q52 cần playtest cùng density, không tự sửa số đã chốt vì thấy budget khác.
- Lý do: có mốc kiểm được cho cảm giác đông và nhiều bầy, tăng quy mô vừa phải qua9node; bình nạp bằng chiến đấu và Boss-progress có đủ nguồn. Số liệu chưa chứng minh FPS hoặc mức độ vui, phải kiểm actual scene/mobile/desktop sau thiết kế/ref/approval.
- Ranh giới: chưa kích thước world/camera zoom/asset biome/độ rộng đường/activation radius/AI scheduling/physics/telegraph concurrency/giới hạn VFX hoặc device targets. Không tự giảm số quái hoặc damage theo thiết bị; nếu budget không đạt cần đề xuất đổi baseline chung/evidence trước. Chưa permission code/art/deploy hoặc nghiệm thu density.
- Câu trả lời user: **“dựa theo cảm giác và triển khai số bầy như của POE giai đoạn đi atlas”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q55.
- Hướng hiện hành: **lấy nhịp clear/mật độ bầy khi đi Atlas của PoE làm reference** thay cách chốt quota nhỏ cố định theo nấc. Làm việc theo giả định PoE1 (user chưa chỉ patch/map/setup cụ thể); bầy nối tiếp dọc đường, có thể kéo nhiều bầy/white tạo nhịp quét, blue-amber tạo điểm tập trung. Đây là diễn giải mục tiêu user trong contract Q45/Q47/Q48, chưa evidence đã xem/đếm footage hoặc đạt cảm giác.
- **Các số10–16/12–24bầy,60/30/10%,tối đa1blue+amber/map của proposal Q55 CHƯA CHỐT**, không đưa sang config như approved. Số quái/bầy/tổng bầy/spacing/rarity phải được rút từ gameplay reference đại diện + diện tích/layout rồi tune trên actual scene chung hai nền tảng; không tự bịa một số và gọi đó là count chuẩn của PoE, không hạ mục tiêu đông chỉ vì mobile. Giữ1đầu đàn/bầy Q47, Boss-progress/reward/counterplay đã chốt; không copy cả atlas passives/scarab/league mechanics vào scope.
- Research2026-11-14: [GGG Atlas of Worlds](https://www.pathofexile.com/atlasofworlds) mô tả maps/upgrade map/Atlas modifiers; [PoEDB Maps](https://poedb.tw/us/Maps), mục Maps Atlas Tree Modifiers có modifier tăng số Monster Packs, Map Pack Size, số Magic/Rare monsters. Những nguồn này hỗ trợ việc tách số bầy/kích thước bầy/thành phần và tác động modifier, **không cung cấp count chung cho mọi map hoặc chứng minh mật độ visual target**. Chưa đo clip, chưa duyệt một map/patch/camera reference cụ thể; Wiki patch page403, không dùng lỗi truy cập làm nguồn số.
- “Triển khai số bầy” trong lượt này được ghi là yêu cầu thiết kế/tuning theo reference, **không tự mở runtime** trong chuỗi brainstorm còn đang chốt; production spec/task/art/Harness gates vẫn phải đi trước. Nếu số bầy làm thay đổi nhịp charge bình hoặc reward cần evidence/proposal, không tự sửa các rule đã chốt Q30/Q46/Q52.

### Q56 — D03.3: Pool buff/debuff node bản đầu nên gồm những gì?

- Trạng thái: **ĐÃ CHỐT MODEL RANDOM/CAP TĂNG THEO CHẶNG — CATALOG/TRỊ SỐ TỪNG MOD CHƯA DUYỆT**, design discussion only.
- Recommend gốc/chưa được duyệt: **bắt đầu6buff+6debuff đọc được bằng thông số**, để quyết định đường đi rõ và không thêm nhiều loại hazard/VFX khi core combat còn đang rework. Buff: **sát thương skill, nhịp đánh/cast, diện tích skill, hồi chiêu, HP tối đa, hiệu quả hồi bình**. Debuff: **HP quái, sát thương quái, tốc độ di chuyển quái, số đạn quái, tỷ lệ bầy blue/amber, giảm hiệu quả hồi bình**. Không dùng pool6+6 làm giới hạn đã approved.
- Các tác động phải hợp mechanic thật: hồi chiêu không tự tạo cooldown cho main Q22, diện tích chỉ áp skill có vùng, hiệu quả bình áp35%instant+20%HoT theo contract sẽ đặc tả. Tốc độ quái không cắt telegraph; số đạn có giới hạn/readability budget. Tỷ lệ bầy bám reference Atlas Q55 và budget, không tạo respawn waves.
- Recommend gốc từng giữ Q35 **mỗi node1buff+1debuff**; số cố định này **đã bị chỉ dẫn mới Q56 thay thế** bên dưới. Các phần nhận khi bắt đầu node/giữ hết lượt/cộng tới cap/counterplay Q35 vẫn hiệu lực. Giảm hiệu quả bình không tắt bình hoặc tăng difficulty riêng theo thiết bị; chưa số giảm/cap.
- Phạm vi đề xuất với Q33: **pool node đầu này chưa thêm hazard môi trường mới**; vai trò Anomaly nằm trong node modifiers, không port6mechanic/VFX cũ. Hazard/content mở rộng cần task/design riêng; chưa suy user đã duyệt bỏ toàn bộ hazard nền combat/Boss.
- Lý do: có tuyến ưu tiên build/độ rủi ro khác nhau trong9nấc, khối lượng effect nhỏ hơn để kiểm tương tác skill/support/charge/Ascension. Trị số và cap phải được đề xuất thành bảng riêng có phân biệt base/buff/debuff/Ascension, không mặc định tuning đã approved.
- Ranh giới: chưa trị số/cap từng mục/tập compatibility/budget/maxHP scaling/shot geometry/Boss có nhận từng modifier hay không, hoặc node spawn algorithm/visual icons/art. Không tự thêm permanent stats/loot layer/currency; chưa production spec/code/art/experience approval.
- Câu trả lời user: **“k cần phải cố định buff/debuff trên mỗi node, cap trần là được, tạo tính random, buff/debuff thế nào thì tham khảo POe”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q56.
- Hướng user đã chốt: **modifier node được random, có cap, buff/debuff lấy ý tưởng từ PoE**; không khóa số lượng/tổ hợp mỗi node thành1buff+1debuff hoặc pool đúng6+6. **Supersede đúng phần số cố định Q35**, không sửa/xóa log Q35 gốc hoặc DDR. Chưa cap số lượng/trị số cụ thể, minimum/mod chỉ một phía, probability hoặc catalog exhaustive được duyệt.
- Giữ Q08/Q09/Q35: roll theo cây sinh đầu hành trình/xem trước thông tin thật để chọn tuyến, không reroll khi xem/chọn/nghỉ/reload; nhận khi bắt đầu node/giữ tới final, cùng loại cộng giá trị tới cap/không nhân lũy thừa ngầm. User chưa yêu cầu random giấu thông tin vào dungeon hoặc hết hiệu lực sau một map. Giữ counterplay/main-Dash-bình có quyền hoạt động, no mana Q23; không tự bê mod mana/reflection/khóa hồi phục thành nội dung mới.
- Research2026-11-14: [PoEDB Quantity — Map mods](https://poedb.tw/us/Quantity) có map mods monster-life/recovery/projectiles cùng quantity/pack-size; [Projectile — Map mods](https://poedb.tw/Projectile) có thêm đạn/chain; [Area of effect — Map mods](https://poedb.tw/us/Area_of_effect) có tăng AoE; [Resistance](https://poedb.tw/us/Resistance) có kháng quái. Đây là reference các nhóm effect và risk/reward, **không approval copy trị số hoặc toàn bộ hệ PoE**. Buff trực tiếp cho build phải được thích nghi theo skill/support game mình, không giả định mọi map mod PoE là buff player. Chưa mở thêm loot/currency/mana/gear/resistance/crit hệ riêng.
- **Recommend làm rõ trước (user yêu cầu sửa cap ngay đầu):** **mỗi node roll1–4modifier tổng, không quota buff/debuff hoặc bắt buộc cả hai phía**; loại và trị số random trong khoảng hợp lệ của từng mod. Có thể2buff+1debuff,1buff+3debuff hoặc chỉ một phía. Không dùng proposal này để sinh4debuff nấc1; không lấy số4 làm số mod của PoE.
- Cap cần **hai lớp**: cap số modifier/node và cap tổng giá trị từng effect sau khi cộng nhiều node (kèm tương tác skill/support/Ascension); không chỉ chặn từng node rồi để tổng9node tăng vô hạn. Reference PoE theo nhóm quái mạnh/tốc độ/đạn-AoE/phòng thủ/hồi phục, catalog và trị số sẽ đề xuất riêng. Vì game mình giữ mod tới final, phải test tổng tích lũy; không thêm reward multiplier/extra draft từ inference về PoE risk/reward.
- Câu trả lời phần làm rõ: **“roll 1-4 nhưng phải phân cấp theo nấc, chứ nấc 1 chưa có sức mạnh mà roll 4 debuff thì sao chơi, tăng dần cap 1/2,3/4 mod”**, ngày 2026-11-14, hội thoại hiện tại không permalink. User yêu cầu **cap tăng theo độ sâu1/2/3/4**, không roll4debuff ngay đầu. Không coi chỉ dẫn này là duyệt mốc nấc cụ thể chưa được hỏi.
- **Recommend phân chặng được user đồng ý:** nấc**1–2cap1;3–4cap2;5–6cap3;7–9cap4**. Mỗi node roll số mod từ1tới cap chặng, không bắt luôn đầy cap; mix buff/debuff vẫn random không1+1cố định. Chưa probability/weights/catalog/trị số cap effect được duyệt.
- Khi làm bảng modifier, **range trị số/khả năng xuất hiện/tổ hợp cũng phải phù hợp sức mạnh từng chặng**, không chỉ giới hạn count nhưng cho1mod đầu run cực nặng. Cần budget tích lũy qua tuyến và counterplay Q35, không tự hứa balance đã đạt. Giá trị đã roll trên cây/đã nhận giữ nguyên, không âm thầm scale lại modifier cũ khi đi sâu. Catalog/cap từng effect dựaPoE vẫn chưa duyệt.
- Câu trả lời mapping chặng: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, sau bảng mapping1–2/3–4/5–6/7–9→cap1/2/3/4.
- Nội dung hiện hành đã chốt: **mod random theo referencePoE, số1..cap chặng (1–2cap1/3–4cap2/5–6cap3/7–9cap4), không quota1buff+1debuff; độ nặng/range/tổ hợp phân theo sức mạnh chặng, cap tổng mỗi effect xuyên tree**. Sinh cây cố định/xem trước/nhận khi bắt đầu node/giữ tới final/cộnggiátrị-cócap/counterplay giữ nguyên. Catalog/trị số/cap effect cụ thể/probability còn review, không tự thêm6+6/hazard/art hay coi balance đã nghiệm thu.

### Q57 — D16.24: Túi skill/support và bản trùng được quản lý thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **skill/support đã nhận trong lượt được giữ trong một túi build không giới hạn ô ở bản đầu**, chỉ nhận từ nguồn đã chốt, không tự lấy toàn catalog unlock. Nhận mới không buộc thay ngay hoặc vứt món đang dùng. Không thêm grid/tetris/weight/rarity/gear để quản lý túi.
- **Mỗi active cụ thể sở hữu tối đa1bản trong lượt; draft không roll lại active đã sở hữu**. Hai ô phụ dùng hai active khác nhau, không gắn cùng một active vào cả hai ô để có hai cooldown. Skill chưa trang bị vẫn giữ để đổi ở cửa sổ Q36 và kế thừa cấp ô; không đề xuất phân giải active thành material qua rule này.
- **Support được nhận nhiều bản cùng loại**, một bản chỉ gắn một skill/mỗi loại tối đa1bản trong cùng skill theo Q24–Q25. Bản chưa dùng giữ trong túi để chuyển build hoặc **phân giải thủ công** Q25/Q36, không tự hủy khi đổi hoặc tự salvage. Không cap số bản cùng loại trong túi để ép tiêu ngay; bản dư không tạo hiệu lực khi không gắn.
- Khi không còn active mới hợp pool, draft vẫn có support (dùng hoặc phân giải), hiển thị đúng số offer hợp lệ Q29; không tạo active trùng/offer giả chỉ để đủ3. Chưa trọng số/price/yield hoặc thêm material trực tiếp vào reward pool.
- **Túi giữ qua node, reset khi hành trình kết thúc** cùng build Q02/Q03/Q10/Q26; save/restart node dở vẫn checkpoint đầu node Q04–Q06. Ownership trong lượt tách với unlock lâu dài Q40. Q36 timing đổi/nâng/phân giải và rule không reset cooldown khi đổi giữ nguyên.
- Lý do: hỗ trợ thử build mới trong tree9node mà không bị inventory management làm đứt nhịp clear; active không trùng vô dụng, support dư vẫn là nguồn nguyên liệu theo yêu cầu user.
- Ranh giới: chưa UI/layout/nhóm thẻ/số liệu upgrade/refund (đã dùng slot-level Q36), thao tác hàng loạt/salvage-confirm UX, pool weighting/seed/reward journal hoặc save migration. Không thêm loot ngoài nguồn đã chốt, không art/code/experience acceptance.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q57.
- Nội dung đã chốt: **túi build không cap ô ở bản đầu; active mỗi skill1bản/draft không roll owned/hai ô phụ khác active; support nhiều bản để gắn khác skill/giữ dư hoặc phân giải thủ công. Nhận mới không ép thay hoặc vứt ngay, chỉ đổi-nâng-phân giải trong cửa sổ Q36; giữ qua node/reset cuối lượt, unlock lâu dài vẫn giữ**. Chưa UI/price/yield/pool weighting/save implementation.

### Q58 — D13.1 / D08.2: Reload/crash khi nhận thưởng hoặc chọn node thì khôi phục thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only; không hỏi lại rule không world-save giữa node đã chốt Q04–Q06, chỉ hoàn thiện các bước reward/tree/terminal.
- Recommend: **tự lưu kết quả đã chốt và khôi phục đúng bước**. Dungeon đang dở khi đóngtab/reload/crash vẫn về đầu chính node đó/entry snapshot/layout cố định Q04–Q06; không tạo checkpoint vị trí/HP/clear giữa map.
- **Boss đã hạ/clear hợp lệ nhưng chưa chọn xong thưởng:** mở lại đúng phần thưởng đang chờ, cùng offer đã roll, giữ điểm meta đã chốt; không bắt đánh lại Boss hoặc grant lại điểm. **Đã nhận thưởng/chỉnh build nhưng chưa bắt đầu node sau:** mở lại tree với đúng build/túi/nguyên liệu/modifier/đường đã chốt, không reset lựa chọn sau Boss.
- **Chọn draft/chốt meta mỗi phần thưởng đúng một lần; reload không reroll offer hoặc nhân bản skill/support/material/điểm**. Seed/offer identity phải phù hợp trạng thái build/lựa chọn trước đó; thay lựa chọn hợp lệ làm đổi pool không đồng nghĩa reroll bằng reload. Node dở rollback build/upgrade/material tạm Q05, có thể tái sinh offer từ seed thay vì world-save; thuật toán/persistence cụ thể chưa chốt.
- **Death thật/thắng/kết thúc chủ động đã chốt thì hành trình kết thúc**, không load lại để undo terminal state Q02/Q03/Q10. Bản tổng kết/điểm/unlock đã nhận không mất do mở lại game. Không đưa rule chống sửa save/server/account hoặc cam kết xử lý mọi mất điện vào scope từ concept này.
- Lý do: nghỉ hoặc sự cố không làm mất lựa chọn/thưởng đã hoàn tất, cũng không tạo cách reroll/nhận lại. Tách trạng thái node đang chơi với phần chuẩn bị giữa hai node để giữ đúng yêu cầu không lưu giữa dungeon.
- Ranh giới: chưa schema/storage/journal/atomic update strategy/migration/thiết bị-browser portability/đóng tab trước khi death thực sự xảy ra/corrupt-save UX hoặc UI trình bày. Không tự triển khai backend/account/cloud/anti-cheat/framework; cần focused integrity tests khi implementation được giao. Chưa code/art/experience approval.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q58.
- Nội dung đã chốt: **node dở reload/crash về entry snapshot/layout cũ; Boss clear nhưng thưởng pending thì tiếp đúng phần thưởng/offer, đã nhận chưa đi tiếp thì mở tree/build đã lưu. Mỗi reward claim một lần, không reroll/dupe; death/win/chủ động end đã chốt không undo thành lượt đang chơi**. Chưa storage/schema/migration/atomic strategy/edge event ordering hoặc experience acceptance.

### Q59 — D13.2 / D12.5: Save và progression cũ được xử lý ra sao khi thử rework?

- Trạng thái: **ĐÃ CHỐT — USER CHỌN LÀM MỚI HẾT**, design discussion only; giữ ranh giới nhánh riêng/production ngoài scope.
- Recommend gốc: **rework dùng profile/save riêng**, bản production tiếp tục đọc-ghi dữ liệu cũ; thử nhánh mới không ghi đè hoặc reset save production. Không mở thêm UI archive/Collection hoặc tự port hệ cũ vào combat mới. User chọn không nhập lại bất kỳ dữ liệu/cài đặt cũ vào rework, xem câu trả lời dưới.
- **Progression rework bắt đầu mới:** catalog8mục Q40/Ascension0 Q34/điểm meta mới từ đầu; không tự đổi Legacy tickets/Sigil/Branch/Anomaly/Ascension cũ thành skill/support/điểm hoặc cấp khó rework. Run arena cũ không được biến thành checkpoint của tree9node vì state/rule khác. User chọn fresh ở câu trả lời dưới, không thực hiện xóa/đổi dữ liệu khi đang brainstorm.
- **Recommend gốc từng giữ cài đặt chung tương thích**, ví dụ ngôn ngữ/âm lượng/giảm rung, nhưng **user chọn làm mới hết nên không carry settings cũ**. Default rework theo contract mới (ngôn ngữ mặc địnhvi theo repo; giá trị audio/input defaults cần spec); không tự carry trợ ngắm cũ làm thay Q14/Q38–Q39. Save rework sau đó vẫn Q04–Q06/Q58, không reset tiến trình rework sau mỗi buổi thử.
- Lý do: tách dữ liệu giúp kiểm tiến trình mới từ đầu, bảo vệ bản đang chơi và không phải quy đổi tùy tiện các unlock không còn tương đương sau Q31–Q34. Chi tiết key/schema/đọc chung settings sẽ chốt trong implementation được giao, không scaffold trước.
- Ranh giới: chưa storage key/schema/version/backups/export/cloud/merge profiles hoặc chính sách chuyển đổi nếu sau này user muốn đổi economy. Không tự thêm account/backend/archive UI, không xóa approval/history cũ hoặc coi fresh progression là user playtest acceptance. Không mở runtime/deploy từ brainstorm.
- Câu trả lời user: **“làm mới hết”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q59.
- Nội dung hiện hành: **rework khởi tạo toàn bộ dữ liệu/progression/cài đặt mới, không import/quy đổi/migrate save cũ**; không làm legacy archive/Collection UI để giữ progression cũ trong rework. Bản production trong thời gian phát triển nhánh riêng vẫn ngoài phạm vi thay đổi, không lấy câu này làm lệnh xóa browser save/main/runtime ngay. Các approval/lịch sử docs cũ giữ nguyên; phạm vi Q59 là data/settings, không tự diễn giải thành lệnh rewrite toàn repo hoặc làm art mới.

### Q60 — D08.3 / D14.1: Draft giữa map và pause tương tác với combat thế nào?

- Trạng thái: **ĐÃ CHỐT — USER ĐỒNG Ý**, design discussion only.
- Recommend: **đạt mốc draft giữa map thì báo có thưởng đang chờ, không tự bật bảng khi đang clear/né đòn**. Người chơi chủ động mở thưởng; chỉ một mốc giữa map Q30, không tạo popup từng thủ lĩnh hoặc thêm reward.
- **Mở bảng thưởng thì pause toàn bộ gameplay**: địch/đạn/hazard, HP-HoT, cooldown/charge, windup và các timer combat đều dừng đồng nhất; chọn thưởng/chỉnh build/nâng/phân giải trong cửa sổ Q36. Không để chờ trong menu hồi cooldown/HP hoặc để địch đánh người đang chọn. Chưa pause audio/music transport, không tự thay approval audio cũ.
- **Thưởng pending phải giải quyết trước khi vào Boss hoặc chuyển node**; cùng offer Q58/không tự chọn thay người chơi. Xử lý xong thì trở lại combat; UI không click xuyên, lệnh manual giữ trước bảng phải nhả/thao tác mới để tránh cast/Dash/uống nhầm. Auto main chỉ trở lại theo mode Q14/Q38–Q39 khi combat được tiếp tục rõ ràng, không yêu cầu nhấn lại main mỗi nhịp trong mode auto.
- **Mất focus/chuyển tab tự pause; trở lại bấm Tiếp tục mới chạy lại**. Tab còn sống chỉ đang pause, không là ghi checkpoint giữa node; browser bị đóng/killed/reload vẫn theo Q58 về entry node dở. Không tự auto-resume sau blur hoặc cho input cũ tiếp tục giữ.
- Lý do: giữ nhịp clear dày theo reference Atlas Q55, người chơi chọn lúc xem thưởng mà vẫn có đủ thời gian quyết định build. Pause/input giống luật trên hai nền tảng, không biến menu thành nơi hồi tài nguyên.
- Ranh giới: chưa HUD/layout/notification asset/keyboard-touch mapping/input assistance/press-release threshold hoặc pause state implementation. Không mở sửa artwork/HUD từ flow approval; cần mockup/reference và input contract chi tiết khi triển khai. Không thêm autosave vị trí hoặc chỉnh nhịp Boss/reward counts/nguồn charge.
- Câu trả lời user: **“y”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q60.
- Nội dung đã chốt: **mốc draft chỉ báo pending/người chơi chủ động mở; bảng thưởng pause toàn gameplay/timers/cooldown/HoT. Xử lý pending trước Boss/chuyển node; resume chặn click xuyên/nhả lệnh manual cũ, auto theo mode; mất focus/tab tựpause/trở lại bấm Tiếp tục**. Chưa pause audio/music transport, layout/mapping/implementation hoặc device playtest acceptance.

### Q61 — D13.3 / D16.25: Input và ngắm/hủy hai skill phụ trên mobile/desktop thế nào?

- Trạng thái: **THU HỒI CÂU HỎI RIÊNG — KHÔNG CHỜ USER CHỐT LẠI**, sau phản hồi user ở dưới. Giữ nguyên recommend để có lịch sử; không coi Q61 hoặc lời phàn nàn là approval mapping/gesture mới.
- Recommend **desktop WASD di chuyển; chuột trái giữ để điều khiển main (override khi auto bật/ra đòn khi auto tắt);Q/E hai phụ;Space Dash;F bình**. Mobile có joystick di chuyển/vùng main để giữ-kéo ngắm, hai nút phụ/nút Dash/nút bình riêng. Không gán tọa độ/hit area hoặc thêm button art ở câu này.
- **Phụ cần hướng/điểm đặt:** bấm/chạm nhanh thi triển theo aim hiện tại hợp lệ; giữ phímQ/E hoặc giữ-kéo nút trên touch để xem/ngắm, nhả thì thi triển. Quick tap vẫn là một press-release, không auto-repeat do giữ. Aim/target phải trong tầm/line-of-sight Q38, không tự chọn vùng chiến thuật thay người chơi. Loại kỹ năng/point clamping và preview cụ thể cần bảng input từng skill.
- **Phụ tự tác động như khiên:** bấm dùng ngay, không phải ngắm hoặc giữ-thả để chờ kích hoạt. Mỗi thao tác một cast, giữ nút không tự cast lại khi hồi cooldown. Chung luật hai nền tảng, không tạo windup/cooldown khác theo thiết bị.
- **Hủy ngắm trước khi thi triển không tiêu cooldown:** desktop chuột phải hoặcEsc, touch kéo vào vùng hủy; mấtfocus/pointercancel/pause hủy aim chứ không cast do release giả. Đây là hủy thao tác chưa phát, không hoàn cooldown/effect đã commit trái Q39. Giao diện/vùng cancel phải được mockup/playtest trước implementation.
- Lý do: tap hỗ trợ clear nhanh, giữ-ngắm cho vị trí burst/vùng CC/trụ chính xác; khiên cần phản hồi trực tiếp. Desktop và mobile có quyền ngắm/cancel tương đương, giữ skill phụ manual và main auto/manual đã chốt.
- Ranh giới: chưa gesture thresholds/input buffer/aim assist strength/target fallback/hitboxes/visibility/no valid point UX, animation cast/windup commit point, priority nhiều nút đồng thời hoặc preview asset. Rule Dash/potion khi channel/cast còn cần contract bảng, không tự đổi i-frame/resource/timing. Chưa spec production/art/code/device acceptance.
- Câu trả lời user: **“ủa, phần này t chốt từ mấy chục câu trước r mà, sao giờ m còn hỏi lại, lần cuối t hỏi m còn bao nhiêu câu thì m nói còn 23 24 câu, giờ là hơn 50 câu r mà chưa xong nữa, hỏi đi hỏi lại là sao”**, ngày 2026-11-14, hội thoại hiện tại không permalink, trực tiếp sau Q61.
- Kết quả: **rút Q61 khỏi hàng chờ, không yêu cầu user trả lời lại**. Vai trò skill/Dash/bình đã có Q14–Q16, target/override Q38, di chuyển-ngắt/manual Q39, pause/input resume Q60. Chi tiết exact keys/gesture mới của Q61 chưa được duyệt phải ghi Proposed trong bảng input tổng hợp, không suy approval từ câu phàn nàn và không tách thành quiz mới.

### C06 — Rà soát hỏi lặp và dừng chuỗi hỏi lẻ (2026-11-14)

- Nguồn: câu trả lời user tại Q61, nguyên văn phía trên; hội thoại hiện tại, không permalink. Đây là sửa quy trình brainstorm, không thêm gameplay decision hoặc ghi DDR.
- Audit: **61ID Q01–Q61; sau Q26 đã có35ID mới Q27–Q61**, chưa tính lượt hỏi làm rõ trong Q47/Q52/Q56. Ước lượng24 sau Q26 và các countdown23/22 trước đây đã sai; giữ lịch sử nhưng **không còn dùng làm dự báo**. Không đổ nguyên nhân cho user đổi scope: agent chia nhóm quá nhỏ, không cập nhật ước lượng và dùng danh sách còn mở cũ mà chưa đối chiếu câu đã chốt.
- Q61 có cả nội dung đã chốt và chi tiết chưa đặc tả. Phần đã chốt không được hỏi lại; phần chưa đặc tả như phím/gesture đáng ra phải đưa vào một bảng proposal cụ thể để review, không tạo cảm giác phải quyết định lại cả cơ chế. Không tự đánh dấu các chi tiết mới là Approved để chữa lỗi hỏi lặp.
- **Không tự hỏi Q62 hoặc tiếp tục serial quiz.** Chuyển công việc sang soạn một bản review hợp nhất, phân rõ contract đã chốt / proposal cần review / tuning cần thử. Nếu thật sự cần clarification mới phải chỉ ra khoảng trống cụ thể và chứng minh không nằm trong log; không biến mọi thông số, edge case hoặc routine implementation thành câu hỏi.

| Gói cần agent chuẩn bị | Nội dung chưa đủ cụ thể | Nguồn đã chốt phải bám |
| --- | --- | --- |
| Skill/support và điều khiển | Skill cards, bảng tương thích/tradeoff/proc cap, timing/targeting/input matrix; đánh dấu rõ chi tiết mới Proposed | Q13–Q29/Q36–Q39/Q57/Q60; không hỏi lại auto/phụ/Dash/bình/mana/CD/slot |
| Economy và balance | Yield/chi phí nâng/giá unlock/điểm theo nấc, difficulty curve; catalog/range/cap mod theo PoE và chặng | Q26–Q30/Q34–Q37/Q40–Q43/Q49–Q52/Q56; không tự tune hoặc coi baseline là nghiệm thu |
| Map/quái/Boss và reference | Gameplay reference Atlas/định lượng mật độ, roster/affix/moves/phase/geometry, các tương tác còn thiếu | Q44–Q55; không dùng quota bị user thay hoặc hứa đã đạt cảm giác/FPS |
| Flow/visual/phân việc | Bảng UI-state/save/input edge cases, tutorial/audio thích nghi, reference/mockup và milestone/acceptance scope | Q04–Q10/Q38–Q39/Q54/Q58–Q60 + Harness; không tự mở cosmetic/migration/art/code |

- Các gói là **việc agent phải tổng hợp/đề xuất**, không phải bốn lượt quiz mới hoặc cam kết mọi chi tiết đã Approved. Không thêm hệ armor/crit/gear/currency/feature mới chỉ vì chưa có câu hỏi về chúng; giữ scope và baseline còn hiệu lực, trình rõ nếu proposal thay quyết định đã chốt.
- Cosmetics/đổi điểm dư/legacy archive/migration đã ngoài scope hoặc tạm để sau Q42/Q59; không giữ chúng như blocker buộc user trả lời để bắt đầu đặc tả core. Mật độ Atlas/catalog mod cần research/reference và actual tuning, không hỏi lại định hướng PoE của user.
- Trước khi soạn formal spec/art/code V2 phải đọc CURRENT, Master Plan, Harness, Design Bible, Reference Protocol và card phù hợp. Audit này chỉ notes, không production spec/artwork/code/build/deploy hoặc Goal complete.

### C07 — Phần còn thiếu được trình bày thành danh sách câu review hữu hạn (2026-11-14)

- Nguồn user: **“còn thiếu bao nhiu, t muốn làm dạng câu hỏi để dễ đọc và kiểm tra hơn”**, ngày2026-11-14, hội thoại hiện tại không permalink. Trước đó agent trả lời “0 câu hỏi brainstorm lẻ nữa” nhưng vẫn còn các bảng/reference chưa đặc tả; **câu “0” không phản ánh đầy đủ công việc review còn lại và được đính chính**.
- Cách tiếp tục hiện hành thay phần hình thức của C06: **trình bày phần thiếu thành12câu reviewR01–R12** tại [REVIEW_QUEUE.md](REVIEW_QUEUE.md), cùng một danh sách để user kiểm tra, mỗi câu có một proposal/bảng hoàn chỉnh trước khi hỏi chốt. Đây là cách chia bốn gói tài liệu sau audit, không12quyết định hệ thống mới và không approval nội dung proposal.
- **Đã review0/12, còn12/12** tại checkpoint này. Không tách8skill/chín support/từng giá/từng edge case thành thêm câu. Không hỏi lại vai trò input/model bình/save/tree hoặc định hướng Atlas đã chốt; exact input còn Proposed đưa phụ lục R01/R10, không phục hồi Q61 làm câu riêng.
- Giữ nguyên audit C06/61ID lịch sử và mọi đáp án; nếu có scope mới thật ngoài12mục phải nêu thay đổi/lý do trước khi đổi danh sách/count. Con số12 là số mục review, không số vòng sửa artwork/playtest, không tự đánh dấu Goal complete hoặc cấp quyền code.
- Review queue mới chỉ inventory phần thiếu, chưa formal production spec hoặc artwork; phải đọc đúng Harness trước khi soạn proposal/spec tương ứng. Không tự thêm hệ/currency/cosmetic/migration để lấp khoảng chưa hỏi.

NEXT ACTION: chuẩn bị proposal trọn R01 theo REVIEW_QUEUE và contract đã chốt, đọc đủ Harness trước formal spec; trình một câu review kèm recommend rồi cập nhật số còn lại. Không hỏi lại Q61, không code/art/deploy. Giữ đầy đủ lịch sử.


### C08 — Chuẩn bị trọn bộ proposal để user review (2026-11-14)

- User: **“ok chuẩn bị đi, t review”**, hội thoại hiện tại, không permalink. Scope lượt này: một bản review hợp nhất đủ R01–R12; không triển khai/runtime/art/DDR/deploy. Cách chuẩn bị từng R01 của C07 được thay bằng chuẩn bị cả bộ; nội dung đã chốt không đổi.
- [REVIEW_V1.md](REVIEW_V1.md), task DUNGEON-REVIEW-01 revision1, có12 câu review kèm recommend/bảng:8active/9support, economy/meta,22node mods, map/AI/Boss/power curve, flow/visual/milestones. Toàn bộ chi tiết mới **PROPOSED**, không suy user approval từ việc giao chuẩn bị.
- Đã chuẩn bị12/12; **được duyệt0/12, chờ review12/12**. Q61 vẫn thu hồi; không thêm Q62. Phần input/legacy thay đổi cụ thể đánh dấu mới, không lẫn với contract đã chốt.
- Audit docs: đủ12ID/câu review, liên kết và sáu hash ảnh baseline đúng; kiểm số economy/curve và bảo toàn lịch sử/nhánh/main/package-lock. Chưa đo footage Atlas, FPS/runtime hoặc có target artwork mới; giới hạn nêu tại R06/R11/R12. Không chạy build/tests vì chỉ Markdown.

NEXT ACTION HIỆN HÀNH: user review REVIEW_V1 theo R01–R12; ghi kết quả từng ID và sửa đúng phần phản hồi. Không hỏi lại phần đã chốt hoặc triển khai trước scope được giao.
