# Game Brief — HTML5 action roguelike

## Mục tiêu và phạm vi
- Chưa chốt tên chính thức. `cursebreak` chỉ là codename nội bộ, không dùng làm thương hiệu public.
- Top-down 2D action roguelike trên browser, **mobile-first** (điện thoại dọc/ngang và tablet), vẫn hỗ trợ desktop keyboard/mouse; một arena duy nhất.
- Hybrid: fast-paced với quái thường, precision combat với Elite/Boss; skill/build khoảng 50/50.
- Ưu tiên playable, combat feel, hiệu năng; free/open-source first và KISS.

## QUALITY BAR & EXPERIENCE ACCEPTANCE
- Chức năng chạy được không đồng nghĩa tính năng hoàn thành. Phân biệt **Functional implementation** (logic hoạt động) và **Experience acceptance** (trải nghiệm đạt yêu cầu).
- Combat phải có animation, timing, feedback và interaction có ý nghĩa; người chơi đọc được chuẩn bị, ra đòn và hồi phục.
- Art phải thể hiện Neon Occult / Fractured Geometry; hình học debug không phải artwork final. Code-generated art vẫn phải có silhouette, chất liệu, phân lớp và chuyển động có chủ đích.
- Mutation/Curse phải tạo khác biệt về cách chơi và synergy, không chỉ cộng chỉ số; Curse cần rủi ro ảnh hưởng quyết định khi chơi.
- Enemy phải có telegraph, pattern và recovery rõ ràng, có thể đọc và phản ứng.
- Chain Reaction phải là gameplay mechanic có setup, trigger và hệ quả chiến thuật, không chỉ VFX.
- Mob combat tốc độ cao phải khác rõ Elite/Boss precision combat về nhịp, khoảng trống và quyết định.
- Build/unit tests chỉ xác nhận phần kỹ thuật. Experience acceptance cần playtest và bằng chứng hình ảnh phù hợp; visual chưa được người dùng xác nhận phải ghi **AWAITING VISUAL APPROVAL**, không tự accepted.
- Các quality checkpoint giữ nguyên quyết định đã khóa và giới hạn MVP; không thêm nội dung để thay thế việc cải thiện chất lượng.

## Mobile-first — phạm vi mở rộng theo user
- Mobile là tiêu chí chính cho layout, readability và input; không chỉ thu nhỏ giao diện desktop.
- Có thể chơi các hành động hiện có bằng cảm ứng: joystick trái di chuyển; Chém/Bắn giữ để lặp; Heavy/Charged giữ chỉ để ngắm, thả mới tiêu một lượt và ra đòn. Cả6 nút phải kéo như joystick để ngắm. Nút đang giữ hiện vòng116px/núm40px; kéo vượt biên nút vẫn nhận nhờ pointer capture tới khi nhả. Joystick trái hướng player khi chưa kéo ngắm; sau khi ngón phải vượt deadzone8px, aim độc lập với di chuyển tới khi nhả. Không auto-aim; dash đang thực hiện không uốn hướng, Surge vẫn radial.
- Pad di chuyển tối thiểu 132×132px, rộng theo viewport tới 180px (160px cao trên tablet/ngang lớn); vòng joystick 116–132px, cả vùng pad nhận chạm. Pointer capture giữ di chuyển khi ngón ra ngoài. Cột trong theo thứ tự Tích lực → Đánh mạnh → Lướt, nhường vùng trái trên phone nhỏ.
- Khi đang chơi, toàn bộ arena (canvas/HUD/khoảng trống/controls) chặn selection, callout/context menu, double-tap và pinch/gesture mặc định; dùng touch-action/CSS và fallback touch/gesture listeners có scope. Pause/menu/draft/settings gỡ guard để cuộn/thao tác; không khóa zoom bằng viewport meta toàn trang. Cần playtest Safari/iOS thật sau kiểm tra browser.
- Hỗ trợ đa điểm chạm (di chuyển + ngắm/tấn công), pointer capture/cancel, reset input khi pause/draft/kết thúc run/đổi kích thước/mất focus.
- HUD/menu/draft/settings/results không tràn hoặc cắt lựa chọn trên phone; overlay có thể cuộn khi cần. Nút cảm ứng tối thiểu 44 CSS px, tôn trọng safe-area và viewport động.
- Camera ưu tiên đọc player/VFX trên phone; viewport combat chừa chỗ controls ở dọc, controls đặt hai bên dưới khi ngang. Giữ world coordinates; thay đổi va chạm/timing nằm ở phần combat đã được user giao.
- Kiểm tra touch emulation dọc/ngang/tablet và desktop regression; phân biệt kết quả giả lập với thiết bị thật/Safari. Visual và combat feel trên thiết bị vẫn cần người dùng xác nhận.
- Giữ giới hạn nội dung MVP. Cụm phải184×184: cột trong từ trên xuống Charged y0/Heavy y64/Dash y124; Bắn64px phía trên phải, Chém68px phía dưới phải; Surge48px tách góc trên trái. Theo feedback mới, Dash ở dưới cùng; bố cục cần playtest tầm với trên thiết bị thật.


## Điều khiển desktop
| Input | Hành động |
| --- | --- |
| WASD | Di chuyển |
| Mouse | Ngắm |
| Left Click | Melee combo |
| Right Click | Infinite Basic Shot |
| Giữ/thả E | Ngắm / bắn một Charged Shot |
| Giữ/thả Shift | Ngắm / dùng một lượt Heavy |
| Space | Dash |
| Q | Surge Ultimate |
| Esc | Pause |

## Combat
- Sword L1 → L2 → L3, Heavy finisher.
- Basic Shots vô hạn nhưng giới hạn fire rate.
- Melee tạo Rupture, tối đa 3 stacks; Shot hoặc Heavy kích hoạt Detonate.
- Chain Reaction có giới hạn trigger để tránh vòng lặp.
- 3 Charge Points tạo 1 Charged Shot, giữ tối đa 3 viên; Charged Shots có damage và Detonate mạnh hơn.
- Surge tối đa 100, dùng cho Ultimate.
- Dash có 2 charges, hồi lần lượt, mặc định 2.8 giây/charge.
- Perfect Dodge: cửa sổ160ms, nhận cả né khỏi đòn đang sắp trúng ở vị trí trước dash hoặc đạn đang bay tới; không buộc phải va chạm trong dash. Mỗi dash thưởng tối đa1lần; dash trống/sớm không thưởng. Telegraph gần người và đủ điều kiện lóe vàng, dùng cùng predicate với logic. Mục tiêu mở khóa vẫn3né tích lũy.
- Đi bộ có body collision với common/Elite/Boss và trượt quanh; dash xuyên thân để thoát vây. Không có contact damage mới; knockback và stun thuộc đòn đánh.
- Cần hit feedback, knockback, stagger, hitstop ngắn và attack telegraph.
- Fixed 60Hz simulation là mục tiêu kỹ thuật. Balance là tham số điều chỉnh sau playtest.
- Tham số MVP M3: Light hoặc Basic Shot hit cho1Charge Point, Detonate cho1, Perfect Dodge cho3; charge không vượt 3 viên/2 điểm dự trữ. Basic Shot20damage; Charged84damage, tự thêm1Rupture (cap3) rồi Detonate×2 kể cả mục tiêu chưa đánh dấu; Heavy Detonate ×1.4.
- Q4: relay qua marked neighbours chờ4ticks simulation (66.7ms); mỗi blast snapshot vị trí/damage/radius trước knockback. Queue quá12/tick tiếp tục ở tick sau, không bỏ; Detonate/charge chỉ tính khi nổ thật. Hitstop/pause đóng băng, reset xóa queue. Không seed quái chưa đánh dấu, giữ damage/radius và24VFX. Dấu3ô Rupture và đường truyền giúp đọc setup→trigger→relay; Q4 đã được user chấp nhận qua “thấy ok r” trên daee80a; phát sinh sau theo issue mới.
- Rupture không tự hết hạn trong MVP. Detonate gốc 12 damage/stack, bán kính 105 px; mỗi mục tiêu kích tối đa một lần/tick, tối đa 12 vụ nổ/tick.
- Surge nhận từ hit/kill/Perfect Dodge; Q dùng 100 Surge gây 100 damage trong 280 px, xóa đạn địch và cho 0.5 giây bảo vệ.
- Waves tăng áp lực theo thời gian, tối đa 18 enemies; Bulwark xuất hiện ở200kills hoặc2:30. Boss ở450kills hoặc4:00 (điều kiện nào tới trước) dọn quái thường cũ, giữ Elite còn sống, giảm tổng enemy cap còn 7 để ưu tiên precision combat.
- Chain Warden 1500 HP, ba telegraph luân phiên: chain sweep, vòng đạn, slam khóa vị trí. Dưới nửa HP tăng nhịp; không bị stun-lock bởi bắn thường.

### Q2 — timing, input và impact (ACCEPTED — USER PLAYTEST APPROVAL)
- L1/L2/L3 lấy đà 4/6/10 simulation ticks (~67/100/167ms), tổng đòn 0.24/0.30/0.44s; Heavy0.24s lấy đà/0.72s tổng. Light theo aim trong windup rồi khóa khi hit; Heavy/Charged khóa hướng tại lúc nhả; mỗi đòn resolve một lần, recovery vẫn có commitment.
- Một slot buffer tấn công, tối đa 120ms simulation time; tap mới thay ý định cũ, giữ qua hitstop. Tap cuối recovery/cooldown nối Light/Heavy/Shot/Charged; tap quá sớm hết hạn. Chém/Bắn giữ vẫn lặp; Heavy/Charged chỉ nhận release pulse, giữ không lặp. Resource hết lúc release không queue để tự ra đòn khi hồi; cancel/pause/resize/blur/draft xóa cả trạng thái đang giữ. Input adapter giữ tap ngắn tới tick, không chạy lại mỗi catch-up tick.
- Dash ưu tiên hủy đòn và buffer tấn công cũ; buffer ngắn riêng cho dash/Surge để tap qua hitstop không mất. Không xếp dash/Charged/Surge khi thiếu tài nguyên. Pause/draft/result/reset/resize/blur/pointercancel xóa ý định cũ; không queue nhiều đòn.
- Dash bảo vệ toàn bộ các tick di chuyển, gồm tick cuối; Perfect Dodge160ms như trên, số charges/speed/recharge dash giữ nguyên. Tap cuối dash có thể nối sang tấn công khi dash kết thúc.
- Miss có whoosh và slash nhưng không có contact spark/hitstop; Light mint, Heavy/Charged amber với recoil/impact mạnh hơn. Impact đặt tại điểm chạm trước knockback; Perfect Dodge dùng dấu gãy bốn hướng và notice hiện có. Sound trúng đạn khác sound chém.
- Hitstop: Basic Shot12ms, L1/L2/L3 33/45/65ms, Charged40ms, Heavy85ms (làm tròn lên tick60Hz); blast/chain giữ quy tắc cũ. User đã giao chỉnh specials/resources/ranged/build support, collision/dodge và scaling/draft; pattern AI và chain budget vẫn giữ.
- Charged feedback theo playtest: recoil 0.22s, lóe nòng dạng lance và projectile lõi ivory/amber với đuôi mảnh vỡ; khai hỏa có tiếng crack/body riêng. Theo feedback ranged mới, Charged tự đặt1Rupture trước Detonate; contact bloom0.24s và Charged Detonate có lõi sáng → sóng xung kích phân mảnh → shards (0.36s), theo đúng radius thực, SFX blast riêng. VFX giữ budget 24 và ưu tiên giữ blast chính khi chain đông; nổ lan giữ style thường để không phủ kín màn hình. Radius/shot speed/cooldown/chain budget giữ; direct damage84 và tự tạo Rupture theo feedback mới.
- **Q2 ACCEPTED:** người dùng xác nhận “ok q2 ổn đó” trên bản84fb33a. Đây là experience approval từ user cho combat feel/impact; build/tests/browser automation là bằng chứng kỹ thuật riêng. Không suy rộng sang visual Q1, Q3–Q5 hoặc xác minh mọi thiết bị mobile.

### Crowd và combo — theo playtest mobile
- L1 chém thuận nhanh, mint; L2 backhand ngược chiều, cyan, rộng hơn; L3 lấy đà/co lõi/bung vai rồi quét lớn với hai cạnh phân mảnh ivory/mint. Pose, độ dài blade, bề rộng/tồn tại trail, âm swing/contact và hitstop phân biệt; không chỉ đổi nhãn HUD.

| Light | Windup / tổng | Range / góc quét | Damage / knockback |
| --- | --- | --- | --- |
| L1 | 4 ticks /0.24s | 100px /150° | 18 /18px |
| L2 | 6 ticks /0.30s | 112px /200° | 22 /24px |
| L3 | 10 ticks /0.44s | 128px /260° | 30 /38px |

- Tất cả mục tiêu trong vùng đều nhận hit/Rupture/charge đúng một lần mỗi đòn. L3 vẫn chừa100° phía sau; không thêm đòn đánh360° hoặc auto-target. VFX theo đúng range/arc; Heavy có2lượt, hồi từng lượt8s simulation; range164px/góc280°, damage100/finisher140, knockback80/stagger0.6s, Detonate×1.4. Charge trừ khi bắt đầu ra đòn; dash hủy Heavy đã bắt đầu không hoàn lại lượt. Phantom Edge vẫn +20px.
- Light/Basic chỉ gây khựng ngắn, không xóa telegraph hoặc reset cooldown địch; Heavy/Charged/blast mới ngắt đòn quái thường, Boss không bị stun-lock. Heavy có body windup/burst, blade dài, trail amber44px và hit impact/SFX riêng mạnh hơn L3.
- Quái xuất hiện theo cụm3 từ cùng hướng với góc cách0.16rad, khoảng cách spawn360px và tránh spawn trên player. Trước Boss cap18; Archer tối đa3, chỉ bổ sung một ở mỗi cụm thứ4; Volatile sau45s ở mỗi cụm thứ6. Boss vẫn cap7 và chỉ bổ sung từng quái, không mang pack pressure vào precision encounter.

### Cân bằng mở đầu — theo playtest mobile
- Giữ damage Light18/22/30 và HP đầu run. Basic/Charged/Heavy và nguồn tài nguyên thay theo feedback ở trên. HP gắn theo loại quái, không theo thứ tự spawn; HP chuẩn Grunt66/Archer48/Volatile48, Elite220/Boss1500.
- Trong60s đầu: Grunt36/Archer28/Volatile36 HP; bắt đầu 6 Grunt + 1 Archer, sinh cụm tối đa3 quái mỗi1.5s, cap18. Grunt cần hai Light liên tiếp (18+22); Light → Basic Shot/Detonate cũng hạ được, không cần buff.
- Từ60–120s HP cơ sở quái mới tiến tới chuẩn; đồng thời từ60–300s hệ số HP tăng1→1.6, damage1→1.5, speed1→1.2. Chốt chỉ số khi spawn (đạn giữ damage nguồn), không đổi strength giữa telegraph. Elite nhận growth lúc spawn; Boss giữ1500HP/pattern/damage riêng. Interval tiến từ90ticks về cadence chuẩn, cap18. Không hồi HP hoặc tăng HP quái đang sống. Sau120s giữ waves cũ, cap18; Boss vẫn cap7. Draft/Elite/Boss dùng kills hoặc thời gian như bảng dưới; không thêm buff, quái hoặc permanent stats.
- Cấu hình ở `src/game/config/balance.ts`; tests chỉ xác nhận thông số/interaction, độ khó cần user playtest.

## Run tối đa 5 phút
| Mốc | Sự kiện |
| --- | --- |
| 0:00 | Start, Grunt + Archer |
| 25 kills hoặc0:30 | Mutation Draft #1 + hồi10HP |
| 80 kills hoặc1:00 | Curse Draft #1 + hồi10HP |
| 160 kills hoặc1:40 | Mutation Draft #2 + hồi10HP |
| 200 kills hoặc2:30 | Bulwark Elite xuất hiện |
| 220 kills hoặc2:20 | Mutation Draft #3 + hồi10HP |
| 300 kills hoặc3:00 | Curse Draft #2: đổi hoặc giữ Curse, hồi10HP |
| 380 kills hoặc3:40 | Mutation Draft #4 + hồi10HP |
| 450 kills hoặc4:00 | Chain Warden Boss xuất hiện |
| 5:00 | Boss chưa chết thì Defeat |

- Mỗi mốc dùng điều kiện OR: kills hoặc elapsed simulation time, cái nào tới trước. Mỗi mốc chỉ kích hoạt1lần; thứ tự Elite và Mutation#3 có thể khác tùy tốc độ hạ quái. HUD hiển thị cả hai ngưỡng draft kế và Boss.
- HP ban đầu100; mỗi lượt chọn heal10 không vượt max HP. Có6lượt chọn (4Mutation khác nhau,2lượt Curse); không tăng số loại nội dung MVP hoặc stack buff trùng.
- Vượt nhiều mốc trong chain vẫn chọn tuần tự, không mất/nhân đôi. Draft đang tới hạn ưu tiên trước encounter; Boss không bị giữ tới4:00 nếu đủ450kills. Timer dừng khi Pause hoặc chọn Draft.
- Boss giữ1500HP/pattern riêng, dọn common/projectile khi vào, giữ Elite đã xuất hiện; không spawn Elite mới sau Boss. Nếu nhảy qua cả hai ngưỡng encounter cùng lúc, ưu tiên Boss, bỏ Elite chưa xuất hiện. Deadline vẫn5:00 kể cả Boss tới sớm.
- Victory khi hạ Boss trước deadline; mutual kill cùng simulation tick tính là Victory.
- Có Play Again.

## Enemies
- Grunt: melee swarm.
- Hex Archer: ranged pressure.
- Volatile: explosion chain.
- Bulwark: armored Elite.
- Chain Warden: final Boss.

### Q3 — nhận diện và precision encounters (ACCEPTED — USER PLAYTEST/VISUAL APPROVAL)
- Feedback readability Grunt: quạt rỗng viền đứt khi lấy đà, chuyển viền liền/chevrons trong160ms cuối (cộng thời gian stagger); vàng chỉ khi predicate Perfect thật. Hit một lần có flash trắng/quạt tô2frames, recovery chỉ giữ vệt chém mờ không còn vùng quạt. Giữ windup0.42s/damage/range/Perfect160ms.
- Art quái tách trong `EnemyVisual.ts`, dùng các mảnh giáp tối/lõi sáng/cạnh gãy có silhouette riêng: Grunt mặt nạ và móc tay; Archer mũ/áo rách/cung; Volatile lò năng lượng tách mảnh; Bulwark giáp phiến lớn; Chain Warden vương miện, thân rỗng và mảnh xích lơ lửng. Có pose lấy đà, bật khi ra đòn và hồi phục; collider giữ nguyên.
- Telegraph ground vẽ dưới bodies, có boundary và tiến trình theo windup thực snapshot. Hướng melee/Archer/ring và điểm slam khóa từ đầu windup; ring hiển thị12hướng đạn, slam/Volatile hiển thị vòng bán kính110px. Perfect cue dùng cùng threat predicate. Active flash0.18s(common)/0.22s(Boss) chỉ là feedback sau hit một lần.
- Recovery đứng yên trong cooldown hiện có: Grunt0.22s, Archer0.4s, Bulwark0.75s; Boss0.7s hoặc0.5s dưới nửaHP. Volatile giữ fuse0.7s rồi nổ tại vị trí đã khóa. Không thêm pattern hoặc enemy mới.
- Bulwark bắt đầu quét khi dưới90px, range100px/arc1.7rad, windup0.65s/damage22×growth. Ngoài recovery giáp giữ damage×0.55; recovery giáp tách và nhận toàn bộ damage. Guard Breaker vẫn xuyên giáp. Grunt giữ70px/0.42s; Archer giữ0.7s.
- Boss giữ sweep230px/1.7rad →12đạn radial →slam110px,1500HP. Windup0.95s/cooldown1.15s, dưới nửaHP0.75s/0.8s; không rút windup đang chạy, không bị stun-lock. Khoảng đứng yên mở cơ hội phản công, phase nhanh hơn vẫn có recovery.
- **Q3 ACCEPTED:** user xác nhận “oki q3 r” trên bảnfa55057; cue Grunt/Perfect Dodge đã được duyệt riêng trước đó. Tests/browser geometry/timing và evidence là bằng chứng kỹ thuật riêng; approval không đồng nghĩa đã xác minh mọi thiết bị/Safari hoặc full-run.

## Q5 Design Contract — Build diversity & survivability

**Trạng thái: DESIGN APPROVED — user xác nhận “ok làm đi, xong thì deploy để test play luôn” ngày2026-10-25.** Đây là specification theo yêu cầu user ngày 2026-10-25, chưa phải implementation hoặc experience acceptance. Nguồn concept mới thay thế yêu cầu tìm concept còn thiếu ở audit trước. Đang triển khai riêng Q5A theo contract; Q5B–Q5E chỉ mở tuần tự sau user playtest/chấp nhận checkpoint trước.

### Phạm vi và nguyên tắc khóa

- Khóa đúng **12 Mutation và 8 Curse**, không thêm class, equipment, armor, resistance, enemy, weapon, backend hoặc thư viện random. Giữ một Curse active, bốn Mutation mỗi run qua sáu draft hiện có; pool lớn hơn không tăng số slot build.
- Mục tiêu là ít nhất bốn lối chơi có quyết định khác nhau: Juggernaut giữ vị trí/phá thế; sustain chọn mục tiêu có dấu; phản công Perfect/Charged; ranged/chain giữ khoảng cách và quản lý hazard.
- Q2/Q3/Q4 vẫn ACCEPTED. Không sửa baseline damage, timing, cooldown, resources, input/aim, enemy growth/pattern/telegraph, Perfect predicate, hitstop, collision hoặc nhịp relay. Các bonus/penalty ghi dưới chỉ áp dụng khi sở hữu nội dung Q5 tương ứng, không sửa cấu hình nền. Boss không bị stun/reset windup; giữ chain12/tick và24VFX, overflow queue, relay4ticks.
- **Mọi con số Q5 dưới đây là tuning defaults đề xuất**, phải playtest trước khi chốt. Tuning Q5 không cho phép tự cân bằng lại Q2–Q4.
- Các hiệu ứng kế thừa giữ để bảo toàn tương tác đã duyệt: Phantom Edge +20px melee; Catalyst +1 Charge Point mỗi Light/Basic hit; Guard Breaker Heavy +30%/xuyên giáp. Core mới bổ sung hành vi trên nền đó. Berserker thay buff dưới50%HP bằng Frenzy; Specialist thay buff mọi Detonate bằng Charged/Fracture; Static Riposte thay xung tự động bằng phản công Charged. Bốn Curse cũ **thay toàn bộ gói cũ** bằng gói dưới, không ngầm cộng thêm passive/rủi ro cũ. Đây là thay đổi Q5 có chủ đích cần duyệt, không áp dụng khi chưa sở hữu.

### Resource và quy tắc tương tác chung

- **Barrier:** một giá trị riêng, khởi đầu0, cap thử nghiệm30. Damage hợp lệ đi qua quy tắc tránh đòn/invulnerability hiện có, áp dụng modifier Curse rồi trừ Barrier trước; phần dư trừ HP. Ví dụ Barrier12/damage20 → Barrier0/HP mất8. Không cộng vào maxHP, không là armor/resistance, không tạo invulnerability khi nhận/vỡ Barrier. Hit được Barrier hấp thụ vẫn dùng phản hồi/cửa sổ chống hit lặp hiện có; không bỏ qua hurt pipeline.
- Không tự hồi hoặc decay Barrier; mọi nguồn chung cap30, phần dư bỏ, không đổi thành HP/Surge. HUD dải cyan riêng `Barrier x/30`, HP vẫn độc lập; nhận/vỡ có mảnh khiên ngắn, không che telegraph. Reset run xóa toàn bộ Barrier và trạng thái proc. Các nguồn cùng tick không vượt cap.
- **HP sustain:** mọi heal từ Mutation/Curse dùng cooldown riêng và ngân sách chung mặc định tối đa8HP thực hồi trong cửa sổ10s simulation (cửa sổ bắt đầu ở lần hồi thực đầu tiên). Không vượt maxHP, không hồi sinh; fullHP không tiêu budget/cooldown. Kiểm điều kiện ở trigger, không lưu heal để tự phát sau. Draft heal10 giữ nguyên, nằm ngoài ngân sách này; riêng Parasitic Mark giảm còn5. Không nerf draft heal nền.
- Thứ tự Q5 xác định để tuning/debug: các bonus phần trăm direct damage áp dụng nhân trên damage nền của đòn, sau đó cộng bonus phẳng Fracture/Static, rồi qua giáp hiện có; bonus phẳng không nhận thêm phần trăm. Không nhân bonus direct vào Detonate. Heal cùng tick xử lý theo thứ tự sự kiện simulation; nếu cùng sự kiện: Blood Pact → Blood Reclaimer → Parasitic Mark, nguồn sau chỉ dùng ngân sách còn lại. HUD có thể gộp số nhưng không đổi kết quả.
- Timer buff/debuff/cooldown/hazard và cửa sổ đo hành vi dùng simulation time, dừng khi pause/draft/hitstop. Snapshot hiệu ứng tại hành động khi cần, không đổi damage giữa một đòn đã bắt đầu. Mọi damage/heal/proc có nguồn và root-chain ID; proc damage không giả làm Light/Heavy/Charged để kích tài nguyên vô hạn.
- Root chain bắt đầu từ một trigger độc lập và bao gồm relay/kill echo sinh ra từ nó. Proc có giới hạn theo root, không reset khi sang tick. Chain bình thường vẫn truyền qua marked neighbours; Catalyst là ngoại lệ seed có giới hạn, không đổi luật cho build không Catalyst. Không tăng budget thực thi/VFX.
- Kill được tính đúng một lần. Blood Reclaimer dùng snapshot Rupture **trước khi đòn chí tử/Detonate tiêu dấu**; kill do relay giữ snapshot của mục tiêu đó. Không coi mọi nạn nhân AoE là có dấu. Fracture/slow là trạng thái Q5 riêng, không thay Rupture cap3.
- Khi đổi Curse: gỡ toàn bộ modifier, buff/debuff, hazard và proc đang chờ do Curse cũ sở hữu, kể cả modifier trên enemy; giữ Curse không reset cooldown/budget. Barrier đã kiếm là resource chung được giữ (vẫn cap30), không được cấp lại khi chọn giữ. Heal draft theo Curse vừa chọn, sau đó clamp HP về maxHP mới; tăng maxHP không tự hồi đầy. Reset run xóa cả buff Mutation và Curse, không hồi Soul Anchor khi pause/draft.
- Tất cả tên trạng thái, số tài nguyên, lý do draft và mô tả qua `t(key)` vi/en. Ưu tiên icon/dải nhỏ cạnh resource hiện có, không thêm nút thao tác. VFX phụ nhường telegraph và Charged blast trong budget24.

### 12 Mutation

#### 1. Phantom Edge
- **Archetype:** né chính xác → melee phản công. **Trigger:** Perfect Dodge thành công cấp một Phantom Slash sẵn sàng trong3s; Light kế tiếp trúng tiêu nó.
- **Effect:** thêm một vệt chém trễ0.12s theo snapshot hướng/vùng Light đã trúng, damage18, chỉ hit mỗi target một lần và thêm1Rupture (cap3). Giữ +20px melee hiện có.
- **Limitation/cap:** một charge, không stack; cooldown4s từ Perfect hợp lệ. Light hụt không tiêu charge, hết3s mất. Phantom Slash không cấp charge/Barrier/Frenzy, không tự kích Phantom hoặc Detonate; không thêm interrupt/knockback.
- **VFX/HUD:** bóng lưỡi mint mảnh và icon đếm thời gian; đường chém không che cue Perfect. **Synergy:** Static Riposte, Ghost Step, Catalyst (seed rồi bắn).
- **Acceptance:** né đúng Grunt → Light trúng thấy nhát phụ và dấu; né sớm không có; hụt rồi đánh lại trong3s vẫn dùng được, không sinh nhát phụ vô hạn.

#### 2. Catalyst
- **Archetype:** gieo dấu/chain. **Trigger:** Rupture Detonate thực thi, có mục tiêu sống chưa có Rupture trong radius thật.
- **Effect:** sau khi resolve blast, truyền1Rupture tới tối đa2 mục tiêu chưa có dấu gần tâm nhất (tie theo ID). Giữ bonus charge Light/Basic đã duyệt.
- **Limitation/cap:** tối đa2 mục tiêu mới cho **toàn root chain**, chỉ target sống sau blast; dấu mới không được kích bởi bất kỳ blast thuộc cùng root. Cần trigger độc lập sau đó. Không tăng stack trên target đã có dấu, không tăng damage/radius nền.
- **VFX/HUD:** đường gieo dấu mảnh khác đường relay, kim cương mới nháy một lần. **Synergy:** Blood Reclaimer, Detonation Specialist, Death Echo.
- **Acceptance:** một quái marked giữa ba quái unmarked → bắn; tối đa hai con sống nhận dấu, chưa tự relay trong root đó; bắn lần sau mới lan. Build không Catalyst giữ luật Q4.

#### 3. Berserker
- **Archetype:** melee duy trì áp lực. **Trigger:** hoàn thành L1→L2→L3, mỗi nhát trúng ít nhất một enemy; tiếp tục trong comboWindow hiện có.
- **Effect:** cấp Frenzy4s: damage trực tiếp Light/Heavy +25%; hoàn thành combo mới refresh tối đa4s.
- **Limitation/cap:** hụt một nhát, bị mất HP hoặc combo timeout làm mất tiến độ; mất HP cũng kết thúc Frenzy. Barrier hấp thụ hết không ngắt. Không tăng attack speed, không stack, không buff ranged/proc; thay buff lowHP cũ.
- **VFX/HUD:** ba khấc combo → lõi amber/Frenzy timer. **Synergy:** Aegis Core, Blood Pact, Guard Breaker.
- **Acceptance:** ba nhát trúng bật Frenzy, chém hụt không bật; giữ Barrier bảo toàn nhịp nhưng nhận HP damage kết thúc; tốc độ animation vẫn Q2.

#### 4. Detonation Specialist
- **Archetype:** Charged tạo cửa sổ dồn damage. **Trigger:** blast gốc từ Charged Detonate thực thi.
- **Effect:** chỉ blast gốc đó +25% damage, radius142px (nền105); enemy sống trúng blast nhận **Fracture3s**, khiến direct Heavy/Charged kế tiếp gây thêm20 damage rồi tiêu Fracture.
- **Limitation/cap:** một Fracture/enemy, refresh không stack; relay giữ thông số nền, không lan Fracture. Bonus20 không kích thêm proc, không đổi armor/recovery hoặc mark; dùng pipeline giáp hiện có của đòn kích.
- **VFX/HUD:** vết rạn amber khác kim cương Rupture, biến mất khi tiêu/hết hạn. **Synergy:** Catalyst, Guard Breaker, Glass Soul.
- **Acceptance:** Charged nổ vào cụm → quái sống có rạn; Basic không tiêu rạn, Heavy/Charged tiêu đúng một lần; relay ngoài blast gốc không tự được mở radius/buff.

#### 5. Static Riposte
- **Archetype:** Perfect → phản công ranged có chủ đích. **Trigger:** Perfect Dodge cấp1 Static Charge trong4s.
- **Effect:** Charged Shot kế tiếp bắn trong cửa sổ tiêu Static Charge, vẫn tốn ammo thường; direct hit đầu thêm40 damage. Giữ seed/Detonate Charged nền, không phát xung tự động cũ.
- **Limitation/cap:** tối đa1 Static Charge, cooldown4s; bắn hụt vẫn tiêu, Basic không tiêu. Bonus không nhân vào blast/relay, không tự cho ammo ngoài reward Perfect nền.
- **VFX/HUD:** một tia điện quanh icon Charged và timer, đạn có đường điện mảnh. **Synergy:** Ghost Step, Phantom Edge, Glass Soul.
- **Acceptance:** né đúng → ngắm/thả Charged để phản công, thấy damage trực tiếp tăng; Basic giữ charge, đạn hụt mất charge; không có xung40 tự gây damage khi vừa né.

#### 6. Guard Breaker
- **Archetype:** Juggernaut/phá thế. **Trigger:** Heavy trực tiếp trúng ít nhất một enemy đang windup và thật sự interrupt, hoặc trúng giáp đóng của Bulwark và xuyên giáp.
- **Effect:** nhận10 Barrier sau resolve đòn; giữ Heavy +30%/xuyên giáp hiện có.
- **Limitation/cap:** một lần/Heavy, cooldown2s; không nhận thêm theo số mục tiêu. Heavy hụt/đánh enemy idle hoặc recovery không thưởng. Boss không bị phá thế, không cấp thưởng interrupt giả.
- **VFX/HUD:** giáp nứt tại mục tiêu, mảnh khiên về player và `+Barrier`. **Synergy:** Aegis Core, Iron Oath, Iron Reversal.
- **Acceptance:** thả Heavy đúng windup Grunt hoặc giáp đóng Bulwark → Barrier tăng; cùng Heavy quét nhiều con vẫn +10; đánh Boss không stun/reset telegraph.

#### 7. Aegis Core
- **Archetype:** Juggernaut/chống chịu chủ động. **Trigger:** direct Light/Heavy gây actual HP damage cho enemy.
- **Effect:** tích damage thực sau giáp, loại overkill; mỗi40 damage tích lũy →4 Barrier, giữ phần dư dưới40.
- **Limitation/cap:** tối đa8 Barrier/giây simulation từ Aegis trước modifier Iron Oath (tối đa10 với Oath), cap chung30; bỏ phần quy đổi vượt rate/cap, không tích kho để tự cấp sau. Proc/slash/echo không tính, không thể chém không khí để farm.
- **VFX/HUD:** icon lõi có vòng tiến độ ngắn và flash khi chuyển thành Barrier. **Synergy:** Guard Breaker, Berserker, Iron Oath.
- **Acceptance:** melee trúng tích khiên, hụt không tăng; một cleave đông quái không vượt rate; fullBarrier không cất lượng dư rồi tự refill sau khi bị đánh.

#### 8. Blood Reclaimer
- **Archetype:** sustain/chọn mục tiêu marked. **Trigger:** kill enemy có Rupture theo snapshot trước đòn chí tử.
- **Effect:** hồi3HP thực, không vượt maxHP.
- **Limitation/cap:** cooldown2s và ngân sách heal chung8HP/10s; một multi-kill chỉ heal một lần, enemy không có dấu không thưởng. Không tự cấp Barrier.
- **VFX/HUD:** sợi máu đỏ mảnh từ target và `+HP`; icon tối khi cooldown. **Synergy:** Catalyst, Parasitic Mark, Phantom Edge.
- **Acceptance:** ở nửaHP, kết liễu marked bằng Basic/Detonate vẫn hồi dù dấu đã bị tiêu; kill unmarked không hồi, chain đông không hồi đầy ngay.

#### 9. Iron Reversal
- **Archetype:** chịu đòn → phản công Heavy. **Trigger:** enemy damage thật làm giảm HP (Barrier hấp thụ hết không tính).
- **Effect:** Heavy kế tiếp bắt đầu trong4s nhận +40% direct damage, tiêu buff khi bắt đầu.
- **Limitation/cap:** một buff, cooldown6s từ trigger; không cộng dồn/refresh bằng nhiều hit; self-hazard, HP cost không kích. Heavy hụt/hủy vẫn mất buff, không trả Heavy charge.
- **VFX/HUD:** cạnh Heavy sáng đỏ-amber kèm timer. **Synergy:** Guard Breaker, Aegis Core, Blood Pact.
- **Acceptance:** mất HP rồi Heavy trúng có phản công mạnh; chờ quá4s hoặc hụt mất cơ hội; đứng trong Volatile Soul không farm buff.

#### 10. Soul Anchor
- **Archetype:** cứu nguy hữu hạn. **Trigger:** sau enemy damage hợp lệ, còn sống và HP≤25% maxHP.
- **Effect:** cấp20 Barrier, đẩy common80px/Elite32px trong radius120; Boss không bị đẩy hoặc interrupt.
- **Limitation/cap:** đúng một lần/run, không cứu hit đã gây HP≤0, không heal/invulnerability; không kích bởi self-cost/hazard hoặc lúc chỉ chọn draft. Không reset khi đổi Curse.
- **VFX/HUD:** vòng neo vỡ một lần, icon chuyển trạng thái đã dùng. **Synergy:** Iron Reversal, Blood Reclaimer, Kinetic Battery.
- **Acceptance:** enemy hit đưa HP xuống20/100 → Barrier/đẩy lùi xuất hiện; lần nguy cấp tiếp không kích; hit chí tử vẫn thua.

#### 11. Echo Chamber
- **Archetype:** chain kiểm soát đám đông. **Trigger:** root chain đạt4 Rupture Detonate đã thực thi, không đếm echo/hazard đơn thuần.
- **Effect:** tại blast thứ4 phát một xung radius160; common/Elite trong vùng giảm movement speed30% trong2s, không giảm tốc telegraph/projectile hoặc gây damage.
- **Limitation/cap:** một pulse/root và cooldown5s; refresh slow tối đa2s, không stack; Boss miễn slow. Không tính vụ đang queue là đã nổ.
- **VFX/HUD:** vòng sóng tím mảnh và dấu slow dưới chân; không thay màu cue Perfect. **Synergy:** Catalyst, Death Echo, Detonation Specialist.
- **Acceptance:** chain ba dấu không pulse; đủ bốn sau relay mới pulse, đám đông di chuyển chậm tạo khoảng trống nhưng windup vẫn kết thúc đúng Q3.

#### 12. Kinetic Battery
- **Archetype:** cơ động → dự trữ phòng thủ. **Trigger:** di chuyển thật bằng walk/dash trong combat (có enemy sống trong360px).
- **Effect:** mỗi120px quãng đường thực tích1 năng lượng, cap3; lần enemy hit hợp lệ kế tiếp tiêu toàn bộ, chuyển mỗi điểm thành4 Barrier **trước** hấp thụ hit.
- **Limitation/cap:** tích tối đa1 điểm/giây, không tính knockback/teleport/đẩy do collision hoặc chạy vào tường; chuyển đổi cooldown3s, không tự kích bởi hazard/cost, không tự heal.
- **VFX/HUD:** ba ô pin nhỏ cạnh Barrier; hit bật khiên. **Synergy:** Ghost Step, Soul Anchor, Hunted Vessel.
- **Acceptance:** vòng quanh quái tích pin, đứng im/đi vào tường không tích; enemy hit với3pin cho12Barrier trước damage, không tăng cap30 hoặc tạo miễn thương.

### 8 Curse

#### 1. Volatile Soul
- **Archetype:** AoE lớn, định vị rủi ro. **Trigger/effect:** Rupture Detonate +40% damage; blast đầu mỗi root đặt một self-hazard tại tâm snapshot, báo trước0.8s rồi gây8 damage cho player trong radius70.
- **Risk/cap:** tối đa1 hazard/root, cooldown2s giữa lần đặt, tối đa2 hazard đang chờ; không tạo thêm hazard từ hazard. Damage đi qua Barrier/avoidance hiện có nhưng không thưởng Perfect, Iron Reversal hoặc Soul Anchor. Thay rủi ro nhận damage+25% cũ.
- **VFX/HUD:** vòng cam sọc đếm ngược khác enemy/Perfect cue; hiển thị phạm vi thật, không báo vàng Perfect. **Synergy:** Specialist/Catalyst dọn đám từ xa, Kinetic Battery để đổi vị trí.
- **Acceptance:** kích nổ sát người thấy đủ báo trước để bước ra; đứng lại chịu8 qua Barrier; nổ xa an toàn, chain không tạo hàng chục vòng tự hại.

#### 2. Ghost Step
- **Archetype:** né chính xác liên tục. **Trigger/effect:** Perfect Dodge giảm1s thời gian còn lại của lượt Dash đang hồi, tối đa một lần/dash.
- **Risk/cap:** khi Dash charges=0, enemy damage nhận +20%; hết rủi ro ngay khi hồi ít nhất1. Không vượt2charges, không tích credit nếu không có lượt đang hồi; giữ dash duration/Perfect160ms nền. Bỏ maxHP80/hồi2.1s cố định cũ.
- **VFX/HUD:** Dash lóe khi hoàn thời gian; icon rạn khi0charges. **Synergy:** Static Riposte, Phantom Edge, Kinetic Battery.
- **Acceptance:** né đúng hồi lượt sớm hơn; dash trống không thưởng; tiêu cả hai rồi bị đánh thấy rủi ro, không đổi cửa sổ i-frame.

#### 3. Blood Pact
- **Archetype:** melee sustain/Heavy commitment. **Trigger/effect:** direct melee hit hồi2HP, cooldown1.5s và ngân sách heal chung; giữ lợi ích melee+30% của gói cũ.
- **Risk/cap:** Heavy không trúng enemy nào khi resolve trừ4HP trực tiếp bỏ qua Barrier, không tự kết liễu (sàn1HP). Heavy bắt đầu rồi bị dash hủy cũng tính hụt; cancel trước khi bắt đầu không tính. Bỏ Light cost1HP cũ; multi-hit không nhân heal.
- **VFX/HUD:** tia hồi đỏ khi hit, cảnh báo mất HP tại Heavy miss; card nói rõ hủy sau khi ra đòn vẫn mất. **Synergy:** Berserker, Aegis Core, Iron Reversal.
- **Acceptance:** melee trúng hồi có cadence, Heavy vào khoảng trống/hủy mất4HP dù còn Barrier; không thể hút máu từ proc/đánh không khí.

#### 4. Death Echo
- **Archetype:** kill waves/đổi áp lực. **Trigger/effect:** mỗi kill phát echo20damage/radius80, có thể kích dấu theo luật Q4.
- **Risk/cap:** enemy sống bị echo chạm nhận movement speed+15% trong3s; refresh không stack. Boss không bị speed modifier; Elite/common có. Echo kill chỉ sinh tối đa6 echo/root, phần vượt vẫn tính kill nhưng không tạo echo mới; toàn bộ vẫn chịu budget12/tick. Bỏ maxHP85 cũ.
- **VFX/HUD:** sóng tím, enemy sống có vệt chân đỏ chỉ rõ tăng tốc. **Synergy:** Catalyst, Echo Chamber (slow30% × haste1.15, không cộng trừ tùy ý).
- **Acceptance:** kill yếu gần cụm gây wave; quái khỏe còn sống đuổi nhanh hơn trong3s rồi về tốc độ spawn snapshot; không tăng windup/projectile speed hoặc tạo vòng nổ vô hạn.

#### 5. Iron Oath
- **Archetype:** Juggernaut/Heavy tanking. **Trigger/effect:** Barrier gain từ Guard Breaker/Aegis và nguồn khác ×1.25 trước cap30; khi Heavy bắt đầu với Barrier>0, cấp thêm4Barrier đúng một lần.
- **Risk/cap:** Dash recharge duration ×1.3 khi Curse active, không giảm số charges hoặc thay tốc độ/duration dash. Bonus4Heavy không tự nhân1.25; chỉ một lần/Heavy đã tiêu lượt, không thưởng khi buffer bị hủy trước khi bắt đầu. Không là damage reduction.
- **VFX/HUD:** khiên có viền sắt, HUD Dash thể hiện cooldown dài hơn; Heavy hiện khiên nhỏ khi điều kiện đủ. **Synergy:** Guard Breaker+Aegis Core là slice Q5A.
- **Acceptance:** tạo Barrier bằng melee rồi Heavy phá thế giúp giữ vị trí; so cùng tình huống không Curse thấy Dash hồi chậm hơn, Heavy hụt không farm vô hạn vì vẫn mất lượt8s.

#### 6. Glass Soul
- **Archetype:** ranged mỏng manh. **Trigger/effect:** direct Basic/Charged damage +30% khi bắn.
- **Risk/cap:** maxHP75, clamp khi chọn; không buff Detonate/echo/proc hoặc miễn damage; không đổi fire rate/ammo. Buff Static Riposte bonus40 không nhân thêm.
- **VFX/HUD:** lõi súng pha lê mảnh, HP hiển thị max75 rõ tại draft/HUD. **Synergy:** Static Riposte, Specialist, Kinetic Battery.
- **Acceptance:** cùng mục tiêu bắn gây damage cao hơn nhưng chịu ít đòn hơn; đổi sang Curse khác gỡ ranged buff/maxHP penalty, không tự hồi HP đã mất.

#### 7. Parasitic Mark
- **Archetype:** Detonate sustain. **Trigger/effect:** một Rupture Detonate thực thi và gây actual damage lên ít nhất một enemy → hồi2HP.
- **Risk/cap:** cooldown2s, một heal/root, ngân sách chung8HP/10s; draft heal còn5 khi Curse này được chọn/giữ. Detonate trống/echo không có dấu không heal; phần heal vượt budget bỏ.
- **VFX/HUD:** đường hút xanh-đỏ mảnh từ blast; draft hiển thị heal5 trước khi chọn. **Synergy:** Catalyst, Blood Reclaimer, Specialist; combo sustain chia sẻ budget chứ không nhân hồi vô hạn.
- **Acceptance:** nổ vào quái hồi, chain nhiều vụ vẫn một heal/root; chọn/giữ Curse hồi5 ở draft, đổi đi lại hồi10 theo Curse mới.

#### 8. Hunted Vessel
- **Archetype:** kill momentum/sống nhờ tấn công. **Trigger/effect:** kill cấp thêm3Surge và2Barrier; cooldown1s dùng chung cho cả hai, Surge cap100/Barrier cap30.
- **Risk/cap:** common/Elite đang ở trạng thái đuổi player có movement speed×1.15 khi Curse active; không đổi tốc độ khi windup/recovery, projectile, spawn hoặc Boss. Không stack với haste Death Echo sau đổi Curse vì hiệu ứng cũ đã gỡ.
- **VFX/HUD:** dấu truy đuổi trên quái, nhịp sáng Surge/Barrier khi thưởng. **Synergy:** Kinetic Battery, Blood Reclaimer, Echo Chamber.
- **Acceptance:** đang hạ quái liên tục thấy resource lên đều có cap, ngừng giết thì lợi ích dừng nhưng quái vẫn áp sát nhanh; đổi Curse gỡ truy đuổi ngay.

### Draft v2 — weighted Adaptive/Synergy/Wildcard

- Giữ nguyên bảng milestones kills/time, draft pause, chọn tuần tự khi vượt nhiều mốc, heal và luật đổi/giữ Curse. Mutation: loại đã sở hữu/chưa unlock/chưa triển khai checkpoint, tối đa3 option khác nhau. Curse: lần đầu tối đa3; lần sau giữ Curse hiện tại là slot bảo đảm, tối đa2 alternative khác nhau. Không lấy ngẫu nhiên rồi gắn nhãn sai.
- Mỗi slot **sample có trọng số, không hoàn lại** từ eligible pool, không chọn ứng viên đứng đầu cố định. Theo thứ tự Adaptive → Synergy → Wildcard; mỗi lần lấy bỏ ID khỏi pool. Với Curse lần2: slot giữ, một Adaptive+Synergy kết hợp, một Wildcard. Nếu không có tín hiệu, dùng base weight và nhãn “Khám phá”, không gọi là thích nghi/tương tác.
- **Tín hiệu hiệu quả:** snapshot từ draft trước đến draft này (draft đầu tính từ run start); direct actual damage theo melee/ranged (sau giáp, loại overkill); Perfect thành công/dash, số target có dấu được kích, hiệu quả chain (target thực bị damage, không đếm VFX), Heavy interrupt/armor hit; Barrier hấp thụ và HP thực hồi cho defensive/sustain. Không dùng số lần nhấn hoặc tổng damage proc để gán là melee/ranged. Self-cost/hazard không là nhu cầu chống chịu. Khi chưa sở hữu defense/heal, HP mất do enemy trên maxHP là tín hiệu nhu cầu yếu, không ghi thành “chơi phòng thủ hiệu quả”.
- Chuẩn hóa score hành vi0–1: damage là tỷ trọng direct damage; Perfect là tỷ lệ thành công (chỉ đủ tin cậy sau3dash); chain là tỷ lệ marked trigger có relay (sau3trigger); Heavy phá thế là tỷ lệ thành công (sau2Heavy); defense là absorbed/(absorbed+HP damage); sustain là heal thực/(heal thực+HP damage), chỉ dùng khi có sự kiện. Độ tin cậy tăng dần với sample, tối thiểu3hit cho kênh damage; thiếu dữ liệu → score0 thay vì ưu tiên melee mặc định. Nhu cầu HP là min(1, enemy HP damage/maxHP), contribution tối đa0.25. Không dùng dữ liệu run cũ để giả hiệu quả run mới.
- **Adaptive:** base1 × (1+3×behaviorScore của tag phù hợp). Một item nhiều tag lấy score lớn nhất, không cộng tràn để luôn thắng. **Synergy:** base1 × (1+3×synergyScore), strong link1, hỗ trợ gián tiếp0.5, không link0; lấy link mạnh nhất từ Mutation/Curse sở hữu. Map tối thiểu: Juggernaut Guard/Aegis/Iron Oath; Perfect Phantom/Static/Ghost; chain Catalyst/Specialist/Echo/Death Echo; sustain Reclaimer/Parasitic; melee Frenzy/Blood Pact/Aegis; ranged Glass/Static/Specialist; movement Kinetic/Ghost/Hunted. Không gọi hai item cùng màu là synergy nếu không có trigger/resource liên kết như các entry trên.
- **Wildcard:** base1 × (1+2×novelty), novelty1 khi tag chính khác dominant style hiện tại và chưa có trong build,0.5 nếu chỉ thỏa một điều kiện,0 nếu không. Khi chưa có tín hiệu/build, mọi ứng viên novelty1. Vẫn có xác suất ra cùng style; không bắt buộc offer item thiếu unlock.
- Curse slot kết hợp dùng base1 × (1+1.5×behaviorScore+1.5×synergyScore). Card hiển thị tối đa một lý do thực tế mạnh nhất, ví dụ “Hợp với Perfect Dodge” hoặc “Tương tác với Aegis Core”; không hiển thị xác suất như cam kết.
- **Anti-repetition:** nhân weight×0.4 cho ID từng xuất hiện trong draft của **run ngay trước**, dù đã chọn hay không; không cấm tuyệt đối. Áp dụng Mutation và alternative Curse, không áp dụng slot giữ Curse hiện tại. Chỉ lưu tập ID bounded (12+8), không lưu lịch sử dài. Run đã bắt đầu rồi bỏ dở/restart vẫn là run trước; ghi offered IDs khi draft thực sự hiển thị, không phải lúc debug preview. Run không có draft ghi tập rỗng. Validation whitelist/schema migration giữ nguyên unlock/settings cũ; storage bị chặn dùng bộ nhớ phiên, không kẹt game.
- **Seeded PRNG:** đề xuất xorshift32 (dịch13 trái,17 phải unsigned,5 trái; state uint32, random=state/2^32) với seed uint32 khác0 (0 đổi sang hằng mặc định), tạo seed mỗi run; luồng random draft riêng, không ảnh hưởng spawn/combat. Sort eligible theo danh sách ID canonical trước sample. Cùng seed + version contract/weights + eligible/unlocks + behavior snapshot + build + previous-offers + lịch sử lựa chọn → cùng draft; seed một mình không tái hiện gameplay. Debug có thể nhập seed và xem snapshot tối thiểu này; không thêm replay framework/UI kỹ thuật vào flow người chơi.
- **Fallback:** pool1–2 hiện đúng số; pool0 bỏ qua mốc không heal. Role thiếu evidence dùng sampling cơ sở/nhãn Khám phá; Synergy slot không link có thể là khám phá style khác. Weight finite dương, nếu tổng không hợp lệ fallback uniform qua cùng PRNG và ghi debug warning, không thêm option undefined. Không reroll khi render/đổi ngôn ngữ/pause/giữ Curse.
- **Acceptance draft:** cùng snapshot/seed cho cùng offer; nhiều seed ở melee/ranged/Perfect/Juggernaut cho ưu tiên phù hợp mà không cố định ba tên. So hai run liên tiếp thấy item vừa offer giảm khả năng xuất hiện, vẫn có thể xuất hiện khi pool nhỏ; kiểm eligible1/2/0, owned/unlock, slot giữ Curse, reload/render không đổi draft. Test phân bố là bằng chứng kỹ thuật; user phải thấy lựa chọn đa dạng và lý do hữu ích trong run thật.

### Checkpoints triển khai và cổng duyệt bắt buộc

Triển khai **tuần tự Q5A→Q5B→Q5C→Q5D→Q5E**, không làm song song nhiều checkpoint để tăng số lượng. Contract được duyệt mới được bắt đầu Q5A. Mỗi checkpoint sau implementation/checks phải ghi **AWAITING PLAYTEST APPROVAL** và dừng; chỉ user playtest/xác nhận trải nghiệm mới cho chuyển checkpoint kế tiếp. Tests/build/deploy PASS không là completion/experience acceptance. Nếu feedback yêu cầu thay đổi Q2–Q4 ngoài interaction đã nêu, trình user trước, không tự chỉnh.

| Checkpoint | Phạm vi duy nhất | Gameplay acceptance scenarios / điều kiện qua |
| --- | --- | --- |
| Q5A — Barrier + defensive/sustain foundation | Vertical slice **Juggernaut hoàn chỉnh: Barrier + Guard Breaker + Aegis Core + Iron Oath**. Chưa triển khai heal hoặc nội dung Q5B/C; sustain bằng HP để Q5C. Tạm dùng draft hiện tại, chỉ thêm nội dung đã hoàn thiện vào eligible pool. | Chơi cùng một cụm Grunt/Bulwark có/không bộ Juggernaut: melee tạo Barrier, Heavy đúng windup/giáp đóng cấp thưởng một lần, hụt/đánh recovery không thưởng Guard. Barrier12 nhận20 mất8HP, nhiều nguồn không vượt30; Heavy khi có khiên giúp giữ vị trí, Dash hồi chậm do Oath tạo đánh đổi rõ. Boss không stun. User xác nhận tank chủ động hữu dụng nhưng không đứng im bất tử và HUD đọc được trên mobile. |
| Q5B — Rework existing Mutation/Curse | 5 Mutation cũ còn lại và 4 Curse cũ theo contract; giữ Guard Q5A đã duyệt. | Né đúng → Phantom Light hoặc Static Charged có lựa chọn phản công; L1–3 trúng bật Frenzy, hụt không bật; Charged tạo Fracture rồi Heavy tiêu. Catalyst seed tối đa2/new root, không cascade vô hạn. Thử từng Curse: thoát/đứng hazard; Ghost về0Dash; Blood Pact Heavy hụt; Death Echo để quái sống đuổi nhanh. Đổi/giữ Curse không nhân buff/reset cooldown. User xác nhận mỗi vòng khác lối chơi cũ và rủi ro đọc được. |
| Q5C — New Mutation/Curse pool | Thêm Blood Reclaimer, Iron Reversal, Soul Anchor, Echo Chamber, Kinetic Battery; Glass Soul, Parasitic Mark, Hunted Vessel. Aegis/Iron Oath đã ở A. Tổng đúng12/8. | Marked kill/heal chain ở nửaHP không vượt8/10s; Reversal sau enemy HP hit, Anchor một lần và không hồi sinh; chain4 mở khoảng trống, pin từ di chuyển thật hấp thụ hit. So Glass ranged với HP75, Parasitic draft5, Hunted giết liên tục/ngừng giết; gỡ Curse trả modifier đúng. User thấy sustain/ranged/control/movement đều có quyết định hữu dụng, không bị Juggernaut lấn hết. |
| Q5D — Weighted Adaptive Draft + anti-repetition | Triển khai sampling, signals, seed debug, offered-history và lý do vi/en; không đổi hiệu ứng build để chữa phân bố draft. | Chơi run thiên melee, ranged, Perfect và Juggernaut; ở các draft30s/1m/1m40/2m20/3m/3m40 hoặc kills sớm hơn, lý do phù hợp hiệu quả; wildcard mở hướng khác. Run kế ít lặp hơn nhưng không loại sạch pool. Kiểm giữ/đổi Curse và pool nhỏ; user xác nhận có lựa chọn đáng cân nhắc, không còn cảm giác ba option cố định. |
| Q5E — Playtest build diversity & balance | Tuning **chỉ defaults Q5** dựa feedback, không thêm nội dung; giữ checkpoints đã accepted trừ chỉnh Q5 được user đồng ý. | Thử ít nhất bốn build đại diện: Juggernaut; Catalyst+Reclaimer/Parasitic sustain; Phantom/Static+Ghost phản công; Specialist/Echo+Glass hoặc Volatile ranged/chain. Mỗi build đi từ draft tới Elite/Boss hoặc ghi rõ lý do chết; có điểm mạnh/yếu khác nhau, baseline run không build không bị sửa. User duyệt survivability, rủi ro, nhịp build và readability mobile/desktop; không yêu cầu mọi build thắng mọi run. |

Bàn giao từng checkpoint phải có version/link và cách vào build/tình huống cụ thể: fixture có seed/build preset riêng chỉ phục vụ kiểm tương tác; run thật theo milestone để kiểm draft/độ khó. Hướng dẫn mobile (Chém/Bắn giữ, Heavy/Charged giữ-thả, Dash) và desktop (chuột trái/phải, Shift/E giữ-thả, Space) chỉ các thao tác cần cho scenario. Ghi rõ phần đã kiểm tự động, phần cần cảm nhận/thiết bị thật; nhận feedback theo bước gặp lỗi, quan sát, thiết bị/browser. Không yêu cầu duyệt lại Q1–Q4.

### Các quyết định được duyệt cùng contract (defaults còn cần playtest)

1. Barrier cap30 không decay, ngân sách sustain chung8HP/10s, Soul Anchor không cứu hit chí tử; các số là tuning defaults.
2. Gói rework thay passive cũ có liệt kê; giữ ba bonus Q2 có liên quan, giới hạn Catalyst seed/cùng root, cơ chế Fracture và các trade-off Curse ở trên.
3. Draft weights/anti-repeat0.4, định nghĩa run trước gồm run bỏ dở, seed kèm snapshot; nội dung Q5 mới eligible mặc định khi checkpoint tương ứng được triển khai, giữ ba unlock Guard/Static/Death Echo hiện có, không thêm mục tiêu meta mới.
4. Cổng tuần tự: duyệt contract trước Q5A; Juggernaut Q5A phải được user playtest và chấp nhận trước Q5B, tương tự tới Q5E. User đã duyệt contract; Q5A đang triển khai, chưa có experience acceptance.

## Meta progression
- Hybrid unlocks, mở thêm Mutation, Curse và cosmetic; có 4 unlock mục tiêu.
- Không có permanent stat upgrades.
- Lưu localStorage; dữ liệu không đáng tin cậy, phải validate và whitelist khi load.
- MVP không có anti-cheat hoặc backend.
- Bốn mục tiêu tích lũy M6: hạ 1 quái → Guard Breaker; 5 Detonate → Death Echo; 3 Perfect Dodge → Static Riposte; hạ Chain Warden → cosmetic Lăng kính.
- Implementation hiện tại có pool ban đầu4 Mutation/3 Curse. Đích Q5 sau các checkpoint: pool ban đầu10 Mutation/7 Curse; Guard Breaker, Static Riposte và Death Echo vẫn theo unlock cũ. Nội dung mới eligible mặc định chỉ khi checkpoint của nó đã triển khai; không thêm unlock objective hoặc permanent stats. Quyết định này được duyệt cùng contract; triển khai theo checkpoint.
- Lưu locale, mute, volume, cosmetic và tiến độ theo schema version 1; validate kiểu, enum, whitelist và giới hạn counter khi load. Save lỗi/bị chặn vẫn chơi trong phiên được.

## Art
- Neon Occult / Fractured Geometry, original geometric pixel art.
- Player 32×32; common enemy 24×24 hoặc 32×32.
- Palette tối, neon dùng để truyền thông tin chiến đấu.
- Sprite/SFX có thể tạo bằng code; ưu tiên Phaser Graphics, SVG/PNG, Sharp chỉ nếu cần.
- Không custom art engine, không sao chép asset từ game khác.

### Fractured Vessel — nền tảng Q1
- Player có lõi năng lượng trắng mint nằm trong khoảng hở giữa các mảnh giáp tối; mặt cắt jade, cạnh sáng và khe nứt giúp nhận diện ở kích thước chơi. Silhouette gồm đầu/mặt nạ có chóp gãy, vai bất đối xứng, thân rỗng và các chi tách rời.
- Thân cơ sở 32×32; vũ khí và VFX có thể vượt khung, không thay collider. Idle: lõi thở và giáp lơ lửng; movement: nhịp chi và độ trễ các mảnh; melee: lấy đà, chém, hồi; shoot: giật súng/lõi và lóe nòng; dash: giáp co lại, bung mảnh và afterimages.
- Slash là vệt cắt đa đoạn sắc cạnh biến đổi theo thời gian, đọc được hướng/tầm. Dash là dấu lưu hình các mảnh giáp ở vị trí đã đi qua. Mint là năng lượng player, amber nhấn Heavy/Charged; tránh che telegraph địch.
- Repo chưa lưu Art Bible riêng; mục này cụ thể hóa Neon Occult / Fractured Geometry và yêu cầu Fractured Vessel của task Q1, chờ người dùng duyệt hình ảnh, không tuyên bố khôi phục đầy đủ một Art Bible không có trong repo.

## Audio
- Procedural SFX đơn giản qua Phaser Sound Manager.
- Ưu tiên Light/Heavy Hit, Gun, Dash, Perfect Dodge, Detonate, Player Hurt.
- Giới hạn âm chồng trong Chain Reaction; nhạc nền có thể bổ sung sau.

## i18n
- Dictionary `vi` và `en`, một hàm `t(key)` đơn giản; mặc định `vi`, không cần package ngoài.
- Toàn bộ HUD, Menu, Settings, Draft, Victory/Defeat, tutorial text qua translation keys.
- Tách nội dung dịch khỏi combat/game logic; thêm text mới phải có key cho cả hai locale.
- Tên riêng có thể giữ nguyên; không dịch technical identifiers, console errors, machine-readable content.

## Technical
- Phaser + TypeScript + Vite; gameplay logic tách hợp lý khỏi rendering.
- Không cần ECS framework, database, server, visual regression suite hoặc full replay framework.
- Typecheck/build khi implementation thay đổi; kiểm thử đơn giản, tập trung combat logic rủi ro cao; playtest ngắn mỗi milestone gameplay.

## Giới hạn MVP
- 1 arena, 1 player, 1 sword + 1 gun.
- 3 common enemies, 1 Elite, 1 Boss.
- Scope Q5 khóa ở12 Mutations,8 Curses,1 run tối đa5phút; implementation trước Q5 vẫn6/4 cho tới checkpoint tương ứng. Mỗi run vẫn tối đa4 Mutation và1 Curse active.
- Không multiplayer, leaderboard online, procedural dungeon, account system, monetization hoặc tính năng ngoài scope.

## Milestone
- M0: agent foundation và game brief, hoàn thành trước scaffold/package/gameplay.
- M1: Phaser/TypeScript/Vite, arena hình học, player WASD, mouse aim, camera/viewport, Start/Pause, i18n tối thiểu, dev/build hoạt động.
- M2: melee, ranged, dash và enemy combat.
- M3: Rupture, chain reaction, Charged Shots và Surge.
- M4: run timer, waves, Mutation/Curse drafts.
- M5: Elite, Boss, victory/death và restart.
- M6: unlocks, localStorage, SFX và polish tối thiểu.

M0–M6 là lịch sử functional implementation, không phải chứng nhận experience acceptance. Q1 (player art/animation/readability) đang chờ visual approval. User đã mở rộng phạm vi sang mobile-first: triển khai input cảm ứng, bố cục và camera; Q2 đã được user chấp nhận qua playtest (“ok q2 ổn đó”); Q3 đã được user chấp nhận qua “oki q3 r”; Q4 đã được user chấp nhận qua “thấy ok r” trên daee80a, phát sinh sau theo issue mới; Q5 Design Contract12/8 được soạn theo yêu cầu ngày2026-10-25, DESIGN APPROVED; đang triển khai riêng Q5A. Q5A–Q5E phải được user playtest/chấp nhận tuần tự, không tự chuyển checkpoint.
