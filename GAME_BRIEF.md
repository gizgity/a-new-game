# Game Brief — HTML5 action roguelike

## Mục tiêu và phạm vi
- Chưa chốt tên chính thức. `cursebreak` chỉ là codename nội bộ, không dùng làm thương hiệu public.
- Top-down 2D action roguelike trên desktop browser, một arena duy nhất.
- Hybrid: fast-paced với quái thường, precision combat với Elite/Boss; skill/build khoảng 50/50.
- Ưu tiên playable, combat feel, hiệu năng; free/open-source first và KISS.

## Điều khiển
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

Session bootstrap chỉ M0/M1. M1 không triển khai combat nâng cao, Curse, Mutation hoặc Boss; chỉ sang M2 khi user yêu cầu.
