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

## Mutation và Adaptive Evolution
Sáu Mutation: Phantom Edge, Catalyst, Berserker, Detonation Specialist, Static Riposte, Guard Breaker.

Mỗi Mutation draft có tối đa ba lựa chọn, loại bỏ Mutation đã sở hữu. Nếu pool chỉ còn1–2 thì hiện đúng số còn, không có option undefined/trùng; pool cạn bỏ qua mốc không heal và không kẹt run:
1. Adaptive theo hành vi người chơi.
2. Synergy với build hiện tại.
3. Wildcard.

## Curse
- Bốn Curse: Volatile Soul, Ghost Step, Blood Pact, Death Echo.
- Luôn chỉ một Curse active; có hai lượt chọn, mỗi lượt tối đa ba lựa chọn. Lượt sau luôn có lựa chọn giữ Curse đang dùng; chọn Curse khác thay toàn bộ hiệu ứng/rủi ro cũ, không cộng dồn. HP clamp theo maxHP mới sau heal10.
- Curse luôn có lợi ích và rủi ro.
- Hiệu ứng MVP được chọn ở M4; giá trị là tham số cân bằng sau playtest.

**Trạng thái concept:** tên, số lượng và cấu trúc draft ở trên giữ nguyên. Hai bảng dưới mô tả **functional implementation hiện tại**, không phải xác nhận concept/trải nghiệm đã đạt. Phantom Edge, Berserker, Detonation Specialist, Volatile Soul và Ghost Step hiện chủ yếu là thay đổi chỉ số; Catalyst theo feedback ranged mới tăng charge cho cả Light và Basic Shot; Basic tự tích ammo, Charged tự seed Detonate giúp lối chơi bắn dùng được Catalyst/Detonation Specialist/Volatile Soul/Death Echo. Đây là cải thiện theo user, chưa chứng nhận toàn bộ Q5. Static Riposte, Guard Breaker, Blood Pact và Death Echo có trigger/trade-off tương tác nhưng chiều sâu synergy chưa được kiểm chứng. Cần đối chiếu concept gốc ở Q5, không hợp thức hóa các bản giản lược thành thiết kế final và không đổi hiệu ứng trong Q1.

Lịch sử Game Brief được lưu từ M0/M1 chỉ chốt tên và nguyên tắc, chưa ghi hiệu ứng concept gốc chi tiết. Khi làm Q5 cần xác nhận phần nguồn còn thiếu; không tự suy diễn hiệu ứng từ tên. Adaptive Evolution hiện chọn bằng bộ đếm melee/shots/dashes và vài điều kiện synergy; nhãn Adaptive/Synergy chưa chứng minh lựa chọn phù hợp cách chơi.

| Mutation | Hiệu ứng |
| --- | --- |
| Phantom Edge | Tầm melee +20 px |
| Catalyst | Mỗi Light/Basic Shot hit thêm1Charge Point |
| Berserker | Dưới 50% max HP: sát thương +25% |
| Detonation Specialist | Detonate: sát thương +25%, bán kính +35% |
| Static Riposte | Perfect Dodge gây xung điện 40 damage, bán kính 140 px |
| Guard Breaker | Heavy +30% damage và xuyên giáp Bulwark |

| Curse | Lợi ích | Rủi ro |
| --- | --- | --- |
| Volatile Soul | Detonate +40% damage | Nhận damage +25% |
| Ghost Step | Dash hồi 2.1 giây | Max HP 80 |
| Blood Pact | Melee +30% damage | Light tốn 1 HP, không tự kết liễu |
| Death Echo | Quái bị hạ nổ 20 damage, bán kính 80 px | Max HP 85 |

## Meta progression
- Hybrid unlocks, mở thêm Mutation, Curse và cosmetic; có 4 unlock mục tiêu.
- Không có permanent stat upgrades.
- Lưu localStorage; dữ liệu không đáng tin cậy, phải validate và whitelist khi load.
- MVP không có anti-cheat hoặc backend.
- Bốn mục tiêu tích lũy M6: hạ 1 quái → Guard Breaker; 5 Detonate → Death Echo; 3 Perfect Dodge → Static Riposte; hạ Chain Warden → cosmetic Lăng kính.
- Pool ban đầu: bốn Mutation còn lại và ba Curse còn lại. Unlock thêm lựa chọn draft, không cấp chỉ số vĩnh viễn.
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
- 6 Mutations, 4 Curses, 1 run tối đa 5 phút.
- Không multiplayer, leaderboard online, procedural dungeon, account system, monetization hoặc tính năng ngoài scope.

## Milestone
- M0: agent foundation và game brief, hoàn thành trước scaffold/package/gameplay.
- M1: Phaser/TypeScript/Vite, arena hình học, player WASD, mouse aim, camera/viewport, Start/Pause, i18n tối thiểu, dev/build hoạt động.
- M2: melee, ranged, dash và enemy combat.
- M3: Rupture, chain reaction, Charged Shots và Surge.
- M4: run timer, waves, Mutation/Curse drafts.
- M5: Elite, Boss, victory/death và restart.
- M6: unlocks, localStorage, SFX và polish tối thiểu.

M0–M6 là lịch sử functional implementation, không phải chứng nhận experience acceptance. Q1 (player art/animation/readability) đang chờ visual approval. User đã mở rộng phạm vi sang mobile-first: triển khai input cảm ứng, bố cục và camera; Q2 đã được user chấp nhận qua playtest (“ok q2 ổn đó”); Q3–Q5 chỉ triển khai khi người dùng giao tiếp.
