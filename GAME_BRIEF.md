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
- Có thể chơi các hành động hiện có bằng cảm ứng: joystick trái di chuyển; giữ Chém/Bắn và kéo để ngắm; nút Lướt, Đánh nặng, Đạn tích lực và Surge. Nhả giữ hướng ngắm gần nhất; không auto-aim hoặc đổi balance.
- Hỗ trợ đa điểm chạm (di chuyển + ngắm/tấn công), pointer capture/cancel, reset input khi pause/draft/kết thúc run/đổi kích thước/mất focus.
- HUD/menu/draft/settings/results không tràn hoặc cắt lựa chọn trên phone; overlay có thể cuộn khi cần. Nút cảm ứng tối thiểu 44 CSS px, tôn trọng safe-area và viewport động.
- Camera ưu tiên đọc player/VFX trên phone; viewport combat chừa chỗ controls ở dọc, controls đặt hai bên dưới khi ngang. Không đổi world coordinates, hitbox, AI hoặc timing.
- Kiểm tra touch emulation dọc/ngang/tablet và desktop regression; phân biệt kết quả giả lập với thiết bị thật/Safari. Visual và combat feel trên thiết bị vẫn cần người dùng xác nhận.
- Giữ giới hạn nội dung MVP. User đã giao Q2 cùng điều chỉnh cụm nút phải: Chém 68px ở góc dưới phải, Bắn 64px phía trên, Lướt 60px phía trong ở giữa Chém/Bắn để ba nút thành tam giác (tâm các nút cách nhau ~78–82px); Heavy/Tích lực/Surge tách khỏi các nút chính (48–52px). Bố cục cần playtest tầm với trên thiết bị thật; Q3–Q5 chưa triển khai.

## Điều khiển desktop
| Input | Hành động |
| --- | --- |
| WASD | Di chuyển |
| Mouse | Ngắm |
| Left Click | Melee combo |
| Right Click | Infinite Basic Shot |
| E | Charged Shot |
| Shift | Heavy Attack |
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
- Perfect Dodge yêu cầu timing chính xác; không dùng stamina.
- Cần hit feedback, knockback, stagger, hitstop ngắn và attack telegraph.
- Fixed 60Hz simulation là mục tiêu kỹ thuật. Balance là tham số điều chỉnh sau playtest.
- Tham số MVP M3: Light hit cho 1 Charge Point, Detonate cho 1, Perfect Dodge cho 3; charge không vượt 3 viên/2 điểm dự trữ. Basic Shot 14 damage, Charged Shot 42 và Detonate ×2; Heavy Detonate ×1.4.
- Rupture không tự hết hạn trong MVP. Detonate gốc 12 damage/stack, bán kính 105 px; mỗi mục tiêu kích tối đa một lần/tick, tối đa 12 vụ nổ/tick.
- Surge nhận từ hit/kill/Perfect Dodge; Q dùng 100 Surge gây 100 damage trong 280 px, xóa đạn địch và cho 0.5 giây bảo vệ.
- Waves tăng áp lực theo thời gian, tối đa 18 enemies; Bulwark xuất hiện 2:30. Boss 4:00 dọn quái thường cũ, giữ Elite còn sống, giảm tổng enemy cap còn 7 để ưu tiên precision combat.
- Chain Warden 1500 HP, ba telegraph luân phiên: chain sweep, vòng đạn, slam khóa vị trí. Dưới nửa HP tăng nhịp; không bị stun-lock bởi bắn thường.

### Q2 — timing, input và impact (chờ experience approval)
- L1/L2/L3 lấy đà 4/5/6 simulation ticks (~67/83/100ms), tổng đòn 0.24/0.28/0.36s; Heavy giữ 0.24s lấy đà / 0.58s tổng. Hướng chém theo aim trong windup, khóa khi hit; mỗi đòn resolve một lần, recovery vẫn có commitment.
- Một slot buffer tấn công, tối đa 120ms simulation time; tap mới thay ý định cũ, giữ qua hitstop. Tap cuối recovery/cooldown nối Light/Heavy/Shot/Charged; tap quá sớm hết hạn. Giữ nút vẫn lặp theo cadence hiện có. Input adapter giữ tap ngắn tới tick, không chạy lại mỗi catch-up tick.
- Dash ưu tiên hủy đòn và buffer tấn công cũ; buffer ngắn riêng cho dash/Surge để tap qua hitstop không mất. Không xếp dash/Charged/Surge khi thiếu tài nguyên. Pause/draft/result/reset/resize/blur/pointercancel xóa ý định cũ; không queue nhiều đòn.
- Dash bảo vệ toàn bộ các tick di chuyển, gồm tick cuối; timing Perfect Dodge, số charges, speed và recharge giữ nguyên. Tap cuối dash có thể nối sang tấn công khi dash kết thúc.
- Miss có whoosh và slash nhưng không có contact spark/hitstop; Light mint, Heavy/Charged amber với recoil/impact mạnh hơn. Impact đặt tại điểm chạm trước knockback; Perfect Dodge dùng dấu gãy bốn hướng và notice hiện có. Sound trúng đạn khác sound chém.
- Hitstop yêu cầu: Basic Shot 12ms, Light 33ms, Charged 40ms, Heavy 65ms (làm tròn lên tick 60Hz); blast/chain giữ quy tắc cũ. Không đổi damage, range, tài nguyên, AI, build hoặc chain depth ở Q2.
- Build/tests và browser automation xác nhận timing/input/rendering; cảm nhận combat và bố cục ngón cái vẫn **AWAITING PLAYTEST APPROVAL**, không tự accepted.

## Run tối đa 5 phút
| Mốc | Sự kiện |
| --- | --- |
| 0:00 | Start, Grunt + Archer |
| 1:00 | Mutation Draft #1 + hồi 10 HP |
| 2:00 | Curse Draft + hồi 10 HP |
| 3:00 | Mutation Draft #2 + hồi 10 HP |
| 4:00 | Chain Warden Boss xuất hiện |
| 5:00 | Boss chưa chết thì Defeat |

- HP ban đầu 100; heal không vượt max HP.
- Timer dừng khi Pause hoặc chọn Draft.
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

Mỗi draft có ba lựa chọn:
1. Adaptive theo hành vi người chơi.
2. Synergy với build hiện tại.
3. Wildcard.

## Curse
- Bốn Curse: Volatile Soul, Ghost Step, Blood Pact, Death Echo.
- Mỗi run có một Curse, chọn từ ba lựa chọn.
- Curse luôn có lợi ích và rủi ro.
- Hiệu ứng MVP được chọn ở M4; giá trị là tham số cân bằng sau playtest.

**Trạng thái concept:** tên, số lượng và cấu trúc draft ở trên giữ nguyên. Hai bảng dưới mô tả **functional implementation hiện tại**, không phải xác nhận concept/trải nghiệm đã đạt. Phantom Edge, Berserker, Detonation Specialist, Volatile Soul và Ghost Step hiện chủ yếu là thay đổi chỉ số; Catalyst mới tăng tốc tích tài nguyên. Static Riposte, Guard Breaker, Blood Pact và Death Echo có trigger/trade-off tương tác nhưng chiều sâu synergy chưa được kiểm chứng. Cần đối chiếu concept gốc ở Q5, không hợp thức hóa các bản giản lược thành thiết kế final và không đổi hiệu ứng trong Q1.

Lịch sử Game Brief được lưu từ M0/M1 chỉ chốt tên và nguyên tắc, chưa ghi hiệu ứng concept gốc chi tiết. Khi làm Q5 cần xác nhận phần nguồn còn thiếu; không tự suy diễn hiệu ứng từ tên. Adaptive Evolution hiện chọn bằng bộ đếm melee/shots/dashes và vài điều kiện synergy; nhãn Adaptive/Synergy chưa chứng minh lựa chọn phù hợp cách chơi.

| Mutation | Hiệu ứng |
| --- | --- |
| Phantom Edge | Tầm melee +20 px |
| Catalyst | Mỗi melee hit thêm 1 Charge Point |
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

M0–M6 là lịch sử functional implementation, không phải chứng nhận experience acceptance. Q1 (player art/animation/readability) đang chờ visual approval. User đã mở rộng phạm vi sang mobile-first: triển khai input cảm ứng, bố cục và camera; Q2 và chỉnh cụm nút phải mobile đã được giao, đang chờ playtest bản mới; Q3–Q5 chỉ triển khai khi người dùng giao tiếp.
