> **Hiện hành Q8D (2026-10-26):** user đã giao Balance Validation & Final Tuning. Gate “Q8D chưa mở/không mở Q8D” bên dưới là lịch sử, được task này supersede. Q8A–Q8C vẫn ACCEPTED. [Q8D measurement/checklist](docs/q8d/README.md); không đổi runtime; user “q8d đạt” trên cbdb131 (handoff4791b27), **ACCEPTED — USER PLAYTEST APPROVAL**. Dừng, không Q9.

> Specification hiện hành Q8C: [docs/q8c/README.md](docs/q8c/README.md). Các chỉ số Boss ở contract Q3/Q7 lịch sử được Q8C thay thế; approval cũ giữ nguyên.

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
- Chém/Bắn giữ để lặp; Heavy/Charged giữ để ngắm, thả mới tiêu lượt và ra đòn, không đổi combat timing. Theo feedback Q7B ngày2026-10-26, mobile tự ngắm **quái sống gần nhất theo khoảng cách world**, không giới hạn riêng theo loại; bỏ body chết/trùng vị trí. Kéo nút combat qua deadzone8px ưu tiên hướng tay trong lúc giữ; Heavy/Charged chụp hướng riêng khi thả. Hết kéo dùng auto aim lại; không có target giữ hướng cuối/di chuyển. Desktop mouse aim giữ nguyên. Dash đang thực hiện không uốn hướng, Surge radial.
- Vùng di chuyển trái nhận chạm ở mọi điểm, joystick lấy điểm chạm làm gốc rồi kéo (floating origin), không cần trúng vòng/núm. Portrait hit area cao272px, rộng phần còn lại sau cụm combat (98px ở320,168px ở390); diện tích lớn hơn pad cũ. Capture cho phép kéo ra ngoài; deadzone8px, thả/cancel dừng. Landscape vùng156px bên trái, cao phần arena còn lại.
- Khi đang chơi, toàn bộ arena (canvas/HUD/khoảng trống/controls) chặn selection, callout/context menu, double-tap và pinch/gesture mặc định; dùng touch-action/CSS và fallback touch/gesture listeners có scope. Pause/menu/settings gỡ guard; draft dùng guard riêng giữ cuộn và chặn native mouse/selection, để cuộn/thao tác; không khóa zoom bằng viewport meta toàn trang. Cần playtest Safari/iOS thật sau kiểm tra browser.
- Hỗ trợ đa điểm chạm (di chuyển + ngắm/tấn công), pointer capture/cancel, reset input khi pause/draft/kết thúc run/đổi kích thước/mất focus.
- HUD/menu/draft/settings/results không tràn hoặc cắt lựa chọn trên phone; overlay có thể cuộn khi cần. Nút cảm ứng tối thiểu 44 CSS px, tôn trọng safe-area và viewport động.
- HUD nằm trong dải riêng ngoài canvas: portrait134px, desktop96px, landscape ngắn78px. Portrait dành284px dưới cho controls; landscape touch canvas chừa172px trái/164px phải cho hai cụm. Desktop dành96px dưới cho resource cards. Camera fit viewport mới và tối thiểu phủ arena để không lộ ngoài floor; follow/world coordinates/collision giữ nguyên. Đây là sửa theo playtest Q7B, supersede overlay cũ.
- Kiểm tra touch emulation dọc/ngang/tablet và desktop regression; phân biệt kết quả giả lập với thiết bị thật/Safari. Visual và combat feel trên thiết bị vẫn cần người dùng xác nhận.
- Correction theo ảnh user và “icon là đủ k cần chữ trong nút”: combat184×272 có4attack ghép2cặp **Bắn/Bắn mạnh** (cyan) và **Chém/Chém mạnh** (mint), bridge tĩnh chỉ trang trí; circle basic72/76px, octagon power64px, glyph khác nhau. Cặp ranged: Charged64@(8,64),Shoot72@(104,48); cặp melee:Heavy64@(0,136),Melee76@(104,132). Dash60@(28,208) gầnthumb dưới và Surge56@(4,0) tách riêng. Mặt nút chỉicon, count/ammo/%/numeric cooldown/points ởbadge mép; tên/gesture qua ARIA/tooltip vi/en. Landscape scale0.82,target≥44px. Layout180×240f9d7930 và184×184 trước đã superseded; evidence cũ giữ lịch sử.

- Mỗi draft hiển thị ngay nhưng **khóa chọn1000ms wallclock** (simulation đang dừng), có trạng thái vi/en và button disabled. Cuộn vẫn được. Đòi pointer press mới sau mở khóa; nhấn trước/thả sau hoặc giữ Enter/Space qua khóa không chọn. Đổi ngôn ngữ/rerender không reset thời gian; lượt draft tiếp khóa mới. Không đổi offers/weights/milestones/heal/Curse logic.



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
- Waves Q8A tăng áp lực theo thời gian và tốc độ clear: soft cap18–30, hard cap48; Bulwark và Boss theo cửa sổ kills/time Q8B bên dưới (Elite2:05–2:30, Boss3:40–4:00) dọn quái thường cũ, giữ Elite còn sống, giảm tổng enemy cap còn 7 để ưu tiên precision combat.
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

- Tất cả mục tiêu trong vùng đều nhận hit/Rupture/charge đúng một lần mỗi đòn. L3 vẫn chừa100° phía sau; không thêm đòn đánh360°; hướng mobile theo auto aim/manual override của bản sửa Q7B, desktop mouse aim giữ. VFX theo đúng range/arc; Heavy có2lượt, hồi từng lượt8s simulation; range164px/góc280°, damage100/finisher140, knockback80/stagger0.6s, Detonate×1.4. Charge trừ khi bắt đầu ra đòn; dash hủy Heavy đã bắt đầu không hoàn lại lượt. Phantom Edge vẫn +20px.
- Light/Basic chỉ gây khựng ngắn, không xóa telegraph hoặc reset cooldown địch; Heavy/Charged/blast mới ngắt đòn quái thường, Boss không bị stun-lock. Heavy có body windup/burst, blade dài, trail amber44px và hit impact/SFX riêng mạnh hơn L3.
- Quái xuất hiện theo cụm3 từ cùng hướng với góc cách0.16rad, khoảng cách spawn360px và tránh spawn trên player. Trước Boss Q8A soft cap18–30 theo tốc độ kill gần đây; sau4s không kill khi đủ soft cap, thêm pack≤3 mỗi4s tới hard cap48; Archer spawn thường tối đa3, pressure ưu tiên2Archer tới8; Volatile sau45s ở mỗi cụm thứ6. Boss vẫn cap7 và chỉ bổ sung từng quái, không mang pack pressure vào precision encounter.

### Cân bằng mở đầu — theo playtest mobile
- Giữ damage Light18/22/30 và HP đầu run. Basic/Charged/Heavy và nguồn tài nguyên thay theo feedback ở trên. HP gắn theo loại quái, không theo thứ tự spawn; HP chuẩn Grunt66/Archer48/Volatile48, Elite220/Boss1500.
- Trong60s đầu: Grunt36/Archer28/Volatile36 HP; bắt đầu 6 Grunt + 1 Archer, cadence cơ sở cụm≤3 mỗi1.5s, soft cap18; Q8A sau15s có thể refill nhanh và tăng soft cap theo clear rate, pressure bị chặn ở48. Grunt cần hai Light liên tiếp (18+22); Light → Basic Shot/Detonate cũng hạ được, không cần buff.
- Từ60–120s HP cơ sở quái mới tiến tới chuẩn; đồng thời từ60–300s hệ số HP tăng1→1.6, damage1→1.5, speed1→1.2. Chốt chỉ số khi spawn (đạn giữ damage nguồn), không đổi strength giữa telegraph. Elite nhận growth lúc spawn; Boss giữ1500HP/pattern/damage riêng. Interval tiến từ90ticks về cadence chuẩn, Q8A soft cap18–30 và pressure pack≤3/4s không kill tới hard cap48. Không hồi HP hoặc tăng HP quái đang sống. Sau120s giữ cadence và pressure pack, không xóa crowd khi Elite tới; Boss vẫn cap7. Draft/Elite/Boss dùng kills có floor hoặc fallback thời gian như bảng dưới; không thêm buff, quái hoặc permanent stats.
- Cấu hình ở `src/game/config/balance.ts`; tests chỉ xác nhận thông số/interaction, độ khó cần user playtest.

### Difficulty pressure v2 — feedback tiếp sau Q5A
- User yêu cầu tăng áp lực tiếp sau f89bfa7; đây là ngoại lệ Q3/run được giao trực tiếp, không mở Q5B. Không buff HP quái/nerf damage hoặc AoE player.
- Pressure4s không kill: pack≤3 ưu tiên2Archer cho tới8Archer, phần còn Grunt; Q8A chặn tổng dân số ở48. Spawn thường vẫn cap Archer3; Boss bổ sung ưu tiên Archer tới2, tổng cap7. Kill reset clock, pause/draft/hitstop không đếm pressure.
- Grunt (user gọi “grudge”) có nhảy đón ở150–380px: windup0.68s/bay0.24s cuối, target khóa dự đoán movement160px, tầm560, radius48/damage6×growth (giảm12→6 theo feedback nhảy quá lethal). Grunt mới chờ4s+ID offset0–2.6s trước nhảy; cooldown7s+ID offset0–1.4s. Giãn start toàn nhóm1.6s khi dưới18Grunt sống,0.7s khi từ18Grunt; max3leaps concurrent vẫn giữ. Vòng đáp/progress/line và body nâng khỏi shadow; Heavy/blast interrupt, Light trì hoãn; Perfect dựa target vòng đáp, không có immunity AoE.
- Boss Q8C windup0.62 cả2phase, cooldown0.55/0.44, recovery0.32 cơ bản; chase300/345. Phase2 một lần tại≤50%HP, transform1.4s dừng toàn bộ combat và timer run, hủy đòn đang chuẩn bị an toàn, không hồi HP. Slam phase2 → gap0.25s → sweep khóa hướng mới, telegraph0.62s → recovery0.75s để phản công. Không thêm đạn/damage/range. Lượt sweep ngoài tầm chuyển slam, jump tối đa560px trong0.28s cuối tới target khóa dự đoán80px; không theo player sau khóa. Ring12+fan3 có15ray đúng geometry, projectile430. Damage/HP/pattern vòng cơ bản/Perfect giữ, recovery còn mở. Body collision tạm bỏ trong phần đang bay, không có contact damage mới.
- Theo feedback giảm burst Grunt sau e4f0ab1: thêm thời gian thích ứng đầu run, từng cú gây áp lực nhẹ; crowd tích tụ mới gây nguy hiểm. Không sửa Boss/Archer/AoE trong lượt tuning này.
- Tuning mới cần user playtest sức ép và tính thỏa mãn của AoE; tests/browser không là acceptance.

## Run tối đa 5 phút
| Mốc | Sự kiện |
| --- | --- |
| 0:00 | Start, Grunt + Archer |
| 25 kills từ0:20, fallback0:30 | Mutation Draft #1: chọn1trong4hướng + hồi10HP |
| 80 kills từ0:50, fallback1:00 | Curse Draft #1 + hồi10HP |
| 160 kills từ1:25, fallback1:40 | Mutation Draft #2 + hồi10HP |
| 220 kills từ2:00, fallback2:20 | Mutation Draft #3 + hồi10HP |
| 200 kills từ2:05, fallback2:30 | Bulwark Elite xuất hiện |
| 300 kills từ2:35, fallback3:00 | Curse Draft #2: thêm slot2 hoặc Keep, hồi10HP (Parasitic5) |
| 380 kills từ3:10, fallback3:25 | Mutation Draft #4 + hồi10HP |
| 1200 kills từ3:40, fallback4:00 | Bắt đầu warning viền2s; Boss xuất hiện sau warning |
| 5:00 | Boss chưa chết thì Defeat |

- Q8B hiện hành: `elapsed >= minSeconds && (kills >= target || elapsed >= seconds)`. Kills tích lũy cả run; không tiêu/reset kills, không cộng timer ảo. Clear nhanh được sớm10–25s/mốc, không vượt floor. Full build có ít nhất15s trước Boss (fallback3:25 → floor3:40), thường30–50s. Bảng OR không floor trước Q8B là **SUPERSEDED**, xem lịch sử docs từng checkpoint.
- HP ban đầu100; mỗi lượt chọn heal10 (Parasitic active:5) không vượt max HP. Có6lượt chọn (4Mutation khác nhau,2lượt Curse); không tăng số loại nội dung MVP hoặc stack buff trùng.
- Vượt nhiều mốc trong chain vẫn chọn tuần tự, không mất/nhân đôi. Draft đang tới hạn ưu tiên trước encounter; Boss không trước3:40; từ3:40 cần1200kills, tới4:00 bắt đầu warning; Q8C thêm2s simulation warning trước spawn, hitstop có thể kéo dài thời gian run thực; không đổi floor/fallback Q8B. Timer dừng khi Pause hoặc chọn Draft.
- Boss giữ1500HP/pattern riêng, dọn common/projectile khi vào, giữ Elite đã xuất hiện; không spawn Elite mới sau Boss. Nếu nhảy qua cả hai ngưỡng encounter cùng lúc, ưu tiên Boss, bỏ Elite chưa xuất hiện. Deadline vẫn5:00 kể cả Boss tới sớm.
- Victory khi hạ Boss trước deadline; mutual kill cùng simulation tick tính là Victory.
- Có Play Again. Theo feedback sau Q5A: hạ Boss phát vỡ ấn và chime1.1s rồi hiện dialog vàng “CHIẾN THẮNG · ĐÃ HẠ BOSS”; chết/deadline hiện dialog hồng “THẤT BẠI”. Simulation dừng ngay khi kết quả được xác định.
- Draft chặn contextmenu/selection/drag/auxclick/gesture trên arena, vẫn cuộn được; chỉ nhận primary click mới sau khi mở hoặc keyboard, không nhận cú nhả từ gameplay trước đó.

## Enemies
- Grunt: melee swarm.
- Hex Archer: ranged pressure.
- Volatile: explosion chain.
- Bulwark: armored Elite.
- Chain Warden: final Boss.

### Q3 — nhận diện và precision encounters (ACCEPTED — USER PLAYTEST/VISUAL APPROVAL)
- Feedback readability Grunt: quạt rỗng viền đứt khi lấy đà, chuyển viền liền/chevrons trong160ms cuối (cộng thời gian stagger); vàng chỉ khi predicate Perfect thật. Hit một lần có flash trắng/quạt tô2frames, recovery chỉ giữ vệt chém mờ không còn vùng quạt. Giữ windup0.42s/damage/range/Perfect160ms.
- Art quái tách trong `EnemyVisual.ts`, dùng các mảnh giáp tối/lõi sáng/cạnh gãy có silhouette riêng: Grunt mặt nạ và móc tay; Archer mũ/áo rách/cung; Volatile lò năng lượng tách mảnh; Bulwark giáp phiến lớn; Chain Warden vương miện, thân rỗng và mảnh xích lơ lửng. Có pose lấy đà, bật khi ra đòn và hồi phục; collider giữ nguyên.
- Telegraph ground vẽ dưới bodies, có boundary và tiến trình theo windup thực snapshot. Hướng melee/ring và điểm slam khóa từ đầu windup; theo feedback sau Q5A, Archer theo player suốt windup (cả stagger), đạn đã bắn không đổi hướng; ring hiển thị12hướng đạn, slam/Volatile hiển thị vòng bán kính110px. Perfect cue dùng cùng threat predicate. Active flash0.18s(common)/0.22s(Boss) chỉ là feedback sau hit một lần.
- Recovery đứng yên trong cooldown hiện có: Grunt0.22s, Archer0.4s, Bulwark0.75s; Boss0.32s hoặc0.24s dưới nửaHP (feedback sau Q5A). Volatile giữ fuse0.7s rồi nổ tại vị trí đã khóa. Không thêm pattern hoặc enemy mới.
- Bulwark bắt đầu quét khi dưới90px, range100px/arc1.7rad, windup0.65s/damage22×growth. Ngoài recovery giáp giữ damage×0.55; recovery giáp tách và nhận toàn bộ damage. Guard Breaker vẫn xuyên giáp. Grunt giữ70px/0.42s; Archer giữ0.7s.
- Boss giữ sweep230px/1.7rad →12đạn radial →slam110px,1500HP. Theo feedback sau Q5A: windup0.62s/cooldown0.55s, dưới nửaHP0.46s/0.38s; không rút windup đang chạy, không bị stun-lock. Khoảng đứng yên mở cơ hội phản công, phase nhanh hơn vẫn có recovery.
- **Q3 ACCEPTED:** user xác nhận “oki q3 r” trên bảnfa55057; cue Grunt/Perfect Dodge đã được duyệt riêng trước đó. Tests/browser geometry/timing và evidence là bằng chứng kỹ thuật riêng; approval không đồng nghĩa đã xác minh mọi thiết bị/Safari hoặc full-run.

## Mutation Draft đầu — Chọn hướng build

**ACCEPTED — USER PLAYTEST APPROVAL:** user xác nhận “approve” cho bản7843b98 ngày2026-10-26. Approval này dành cho draft đầu4hướng; sau đó user xác nhận thêm Q6 qua “aprroved q6 lun nha”.

Theo user xác nhận sau Q6 ngày2026-10-26: ở25kills từ0:20, fallback0:30 (Q8B), luôn hiện4card đại diện theo thứ tự Aegis Core (Juggernaut/Barrier), Blood Reclaimer (sustain), Phantom Edge (Perfect/counter), Detonation Specialist (ranged/chain). Chọn1Mutation, không khóa class/route; các mốc sau vẫn Adaptive Draft tối đa3card với weighted sampling/reasons/anti-repeat Q5D. Ngoại lệ4card cố định chỉ ở milestone đầu, không dùng anti-repeat để bỏ một hướng. Các offered IDs vẫn ghi history khi thực sự hiển thị để draft sau/run sau dùng quy tắc cũ. Giữ pool/unlock: nếu fixture có pool nhỏ hoặc đã sở hữu đại diện thì chỉ hiện lựa chọn hợp lệ, không bù bằng card khác hướng. Không thay damage/effects/cap4Mutation/2Curse/heal/timing. Trial Q5E cũng giữ4card đầu, gợi ý route ở các lượt sau; hướng sustain bắt đầu Reclaimer rồi lấy Catalyst. Không cấp build trước milestone.

## Q6 Design Contract — Curse Stacking

**ACCEPTED — USER PLAYTEST APPROVAL:** user xác nhận “aprroved q6 lun nha” ngày2026-10-26 trên bản7843b98 (stacking triển khai từ b534315); giữ mọi approval Q2–Q5. Không tự mở Q7.

Specification mới theo task user ngày2026-10-26; Q6 chưa từng có specification hoàn chỉnh trong repo. Không trùng Q5E hoặc M6. Q5A–Q5E giữ approval theo xác nhận mới nhất của user; evidence/commit Q5 bên dưới là lịch sử, không viết lại thành Q6.

- Run có tối đa **2 Curse khác nhau**, **4 Mutation**. Active Curse chỉ ở trong run; restart xóa cả hai, không đổi unlock/meta/settings. Không thêm nội dung, dependency, framework hoặc draft mới.
- Giữ6mốc kills HOẶC thời gian. Curse đầu80kills/1:00: tối đa3 hợp lệ, chọn1 vào slot1. Curse sau300kills/3:00: Keep build hiện tại + tối đa2 Curse mới chưa sở hữu; chọn mới **thêm slot2**, không bắt buộc. Pool nhỏ hiển thị đúng số. Giữ weighted sampling/reasons/anti-repeat Q5D, dùng cả hai Curse làm synergy evidence.
- Nếu đủ2slot ở draft tương lai: Keep hoặc chọn rõ slot1/2 bị thay; không tự thay random. Q6 không thêm milestone. Heal draft giữ10, nếu Parasitic active sau chọn thì5, clamp maxHP.
- Cả8Curse hoạt động ở bất kỳ slot nào: Volatile tăng Detonate/hazard; Ghost Perfect hồi Dash/risk zeroDash; Blood melee heal/Heavy cost; Death Echo kill echo/chase haste; Iron Oath Barrier/damage cost/Dash chậm; Glass direct ranged/HP75; Parasitic heal/root/draft5; Hunted kill reward/chase haste. Không thêm synergy độc quyền.
- Composition: modifier damage đã định nghĩa nhân mỗi nguồn đúng1lần (Aegis×0.8, Oath×0.75, Blood×0.8); Glass chỉ direct ranged×1.3, Volatile chỉ Rupture blast×1.4. HP75 nếu Glass; Oath Dash×1.3, Ghost chỉ giảm1s recharge khi Perfect. Death Echo và Hunted cùng chase haste dùng một hệ số×1.15 (OR như Q5), không nhân hai lần. Không thêm modifier không có trong card.
- Giữ cap Barrier30, chung heal8HP/10s; Blood riêng6HP/10s,2HP/2s và không heal khi Barrier>0; các cooldown/root caps/chain12 mỗi tick/VFX24/SFX budget Q5 giữ nguyên. Thêm Curse không reset clocks/budget/root/Anchor; gỡ chỉ dọn effect của Curse bị gỡ, không xóa Curse khác; reset run dọn tất cả. Không sửa global HP/damage/enemy difficulty.
- Giữ thứ tự simulation Q5: clocks/action/enemy/damage/queue theo code hiện có; mỗi kill xử lý một lần, root giữ provenance và cap Echo6/seed2. Healing sources cùng tiêu một budget theo thứ tự event thực thi, không cấp budget riêng cho slot.
- HUD HTML/CSS vi/en hiện rõ2slot kể cả trống; draft ghi Thêm Curse, Keep giữ cả build; đủslot ghi rõ slot thay. Cards dùng mô tả Benefit/Risk i18n hiện có. Mobile không tăng HUD che combat/controls.
- Acceptance A–F: hai effects+risks; Keep; Oath+sustain cap/trade-offs; Volatile+Echo bounded; Glass+Ghost HP/Dash/risk; restart/save cũ/unlock/settings/4Mutation/2Curse/draft/timer/mobile-desktop. Focused tests, typecheck/build, browser nếu hỗ trợ; gameplay balance/readability thiết bị thật cần user duyệt. Không tự ACCEPTED hoặc mở Q7.

## Q5 Design Contract — Build diversity & survivability

> Lịch sử Q5: draft Mutation đầu3card được feedback sau Q6 thay bằng4hướng; quy tắc1Curse/replace trong mục này được Q6 supersede; các effect, tuning, milestone và approval vẫn giữ.

**Trạng thái: DESIGN APPROVED — user xác nhận “ok làm đi, xong thì deploy để test play luôn” ngày2026-10-25.** Đây là specification theo yêu cầu user ngày 2026-10-25; Q5A đã được user playtest/chấp nhận trên fa4045d; Q5B đã triển khai và deploy, tank trade-off d42cdaf được user duyệt “oki, ổn r á”; các vòng Q5B khác chưa có xác nhận riêng, Q5C b5ba138 đã được user duyệt “oki r, làm tiếp đi”; Q5D514063a đã được user duyệt “oki r, làm tiếp đi” ngày2026-10-26; Q5E8b1571d đã được user playtest/chấp nhận qua “playtest oki” ngày2026-10-26, giữ tuning. Design approval không là experience acceptance. Nguồn concept mới thay thế yêu cầu tìm concept còn thiếu ở audit trước. Q5A đã deploy theo contract; Q5B–Q5E chỉ mở tuần tự sau user playtest/chấp nhận checkpoint trước.

### Phạm vi và nguyên tắc khóa

- Khóa đúng **12 Mutation và 8 Curse**, không thêm class, equipment, armor, resistance, enemy, weapon, backend hoặc thư viện random. Giữ một Curse active, bốn Mutation mỗi run qua sáu draft hiện có; pool lớn hơn không tăng số slot build.
- Mục tiêu là ít nhất bốn lối chơi có quyết định khác nhau: Juggernaut giữ vị trí/phá thế; sustain chọn mục tiêu có dấu; phản công Perfect/Charged; ranged/chain giữ khoảng cách và quản lý hazard.
- Q2/Q3/Q4 vẫn ACCEPTED. Không sửa baseline damage, timing, cooldown, resources, input/aim, enemy growth/pattern/telegraph, Perfect predicate, hitstop, collision hoặc nhịp relay. Các bonus/penalty ghi dưới chỉ áp dụng khi sở hữu nội dung Q5 tương ứng, không sửa cấu hình nền. Boss không bị stun/reset windup; giữ chain12/tick và24VFX, overflow queue, relay4ticks.
- **Mọi con số Q5 dưới đây là tuning defaults đề xuất**, phải playtest trước khi chốt. Tuning Q5 không cho phép tự cân bằng lại Q2–Q4.
- Các hiệu ứng kế thừa giữ để bảo toàn tương tác đã duyệt: Phantom Edge +20px melee; Catalyst +1 Charge Point mỗi Light/Basic hit; Guard Breaker Heavy +30%/xuyên giáp. Core mới bổ sung hành vi trên nền đó. Berserker thay buff dưới50%HP bằng Frenzy; Specialist thay buff mọi Detonate bằng Charged/Fracture; Static Riposte thay xung tự động bằng phản công Charged. Bốn Curse cũ **thay toàn bộ gói cũ** bằng gói dưới, không ngầm cộng thêm passive/rủi ro cũ. Đây là gói rework Q5B đã được duyệt thiết kế; chỉ áp dụng khi sở hữu, cần user playtest experience trước Q5C.

### Resource và quy tắc tương tác chung

- **Barrier:** một giá trị riêng, khởi đầu0, cap thử nghiệm30. Damage hợp lệ đi qua quy tắc tránh đòn/invulnerability hiện có, áp dụng modifier Curse rồi trừ Barrier trước; phần dư trừ HP. Ví dụ Barrier12/damage20 → Barrier0/HP mất8. Không cộng vào maxHP, không là armor/resistance, không tạo invulnerability khi nhận/vỡ Barrier. Hit được Barrier hấp thụ vẫn dùng phản hồi/cửa sổ chống hit lặp hiện có; không bỏ qua hurt pipeline.
- Không tự hồi hoặc decay Barrier; mọi nguồn chung cap30, phần dư bỏ, không đổi thành HP/Surge. HUD dải cyan riêng `Barrier x/30`, HP vẫn độc lập; nhận/vỡ có mảnh khiên ngắn, không che telegraph. Reset run xóa toàn bộ Barrier và trạng thái proc. Các nguồn cùng tick không vượt cap.
- Tank trade-off d42cdaf đã được user duyệt qua “oki, ổn r á”; giữ các giá trị dưới, không tự tuning tiếp. Theo feedback tank sau Q5B: Aegis Core nhân mọi damage player gây ra×0.8, Iron Oath×0.75, Blood Pact×0.8 (thay bonus melee+30% cũ). Các cost nhân với nhau, áp dụng một lần cho direct/Phantom/Static/Fracture/Detonate/relay/echo/Surge; không giảm damage môi trường/enemy. Không thay baseline khi không có các lựa chọn này. HUD/card hiển thị cost.
- **HP sustain:** mọi heal từ Mutation/Curse dùng cooldown riêng và ngân sách chung mặc định tối đa8HP thực hồi trong cửa sổ10s simulation (cửa sổ bắt đầu ở lần hồi thực đầu tiên). Không vượt maxHP, không hồi sinh; fullHP không tiêu budget/cooldown. Kiểm điều kiện ở trigger, không lưu heal để tự phát sau. Draft heal10 giữ nguyên, nằm ngoài ngân sách này; riêng Parasitic Mark giảm còn5. Không nerf draft heal nền. Riêng Blood Pact chỉ hồi khi Barrier bằng0 (kiểm sau khi đòn đã cấp Barrier), tối đa6HP/10s, trong cùng cửa sổ/ngân sách chung8HP/10s; đổi Curse không reset lượng đã hồi trong cửa sổ này.
- Thứ tự Q5 xác định để tuning/debug: các bonus phần trăm direct damage áp dụng nhân trên damage nền của đòn, sau đó cộng bonus phẳng Fracture/Static, áp dụng cost chống chịu của build rồi qua giáp hiện có; bonus phẳng không nhận thêm phần trăm. Không nhân bonus direct vào Detonate. Heal cùng tick xử lý theo thứ tự sự kiện simulation; nếu cùng sự kiện: Blood Pact → Blood Reclaimer → Parasitic Mark, nguồn sau chỉ dùng ngân sách còn lại. HUD có thể gộp số nhưng không đổi kết quả.
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
- **Limitation/cap:** mọi damage player gây ra×0.8 khi sở hữu Aegis; tối đa4 Barrier/giây simulation từ Aegis trước modifier Iron Oath (tối đa5 với Oath), cap chung30; bỏ phần quy đổi vượt rate/cap, không tích kho để tự cấp sau. Proc/slash/echo không tính, không thể chém không khí để farm.
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
- **Archetype:** melee sustain/Heavy commitment. **Trigger/effect:** direct melee hit chỉ hồi khi Barrier=0: 2HP, cooldown2s, giới hạn riêng Blood Pact6HP/10s (nerf theo feedback sau Q5B) và ngân sách heal chung; đánh đổi mọi damage gây ra×0.8, bỏ bonus melee+30% cũ theo feedback tank quá mạnh.
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
- **Risk/cap:** mọi damage player gây ra×0.75; Dash recharge duration ×1.3 khi Curse active, không giảm số charges hoặc thay tốc độ/duration dash. Bonus4Heavy không tự nhân1.25; chỉ một lần/Heavy đã tiêu lượt, không thưởng khi buffer bị hủy trước khi bắt đầu. Không là damage reduction.
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
| Q5D — Weighted Adaptive Draft + anti-repetition | Triển khai sampling, signals, seed debug, offered-history và lý do vi/en; không đổi hiệu ứng build để chữa phân bố draft. | Chơi run thiên melee, ranged, Perfect và Juggernaut; ở các draft theo bảng Q8B hiện hành (lịch sử Q5D OR cũ superseded), lý do phù hợp hiệu quả; wildcard mở hướng khác. Run kế ít lặp hơn nhưng không loại sạch pool. Kiểm giữ/đổi Curse và pool nhỏ; user xác nhận có lựa chọn đáng cân nhắc, không còn cảm giác ba option cố định. |
| Q5E — Playtest build diversity & balance | Tuning **chỉ defaults Q5** dựa feedback, không thêm nội dung; giữ checkpoints đã accepted trừ chỉnh Q5 được user đồng ý. | Thử ít nhất bốn build đại diện: Juggernaut; Catalyst+Reclaimer/Parasitic sustain; Phantom/Static+Ghost phản công; Specialist/Echo+Glass hoặc Volatile ranged/chain. Mỗi build đi từ draft tới Elite/Boss hoặc ghi rõ lý do chết; có điểm mạnh/yếu khác nhau, baseline run không build không bị sửa. User duyệt survivability, rủi ro, nhịp build và readability mobile/desktop; không yêu cầu mọi build thắng mọi run. |

Bàn giao từng checkpoint phải có version/link và cách vào build/tình huống cụ thể: fixture có seed/build preset riêng chỉ phục vụ kiểm tương tác; run thật theo milestone để kiểm draft/độ khó. Hướng dẫn mobile (Chém/Bắn giữ, Heavy/Charged giữ-thả, Dash) và desktop (chuột trái/phải, Shift/E giữ-thả, Space) chỉ các thao tác cần cho scenario. Ghi rõ phần đã kiểm tự động, phần cần cảm nhận/thiết bị thật; nhận feedback theo bước gặp lỗi, quan sát, thiết bị/browser. Không yêu cầu duyệt lại Q1–Q4.

### Các quyết định được duyệt cùng contract (defaults còn cần playtest)

1. Barrier cap30 không decay, ngân sách sustain chung8HP/10s, Soul Anchor không cứu hit chí tử; các số là tuning defaults.
2. Gói rework thay passive cũ có liệt kê; giữ ba bonus Q2 có liên quan, giới hạn Catalyst seed/cùng root, cơ chế Fracture và các trade-off Curse ở trên.
3. Draft weights/anti-repeat0.4, định nghĩa run trước gồm run bỏ dở, seed kèm snapshot; nội dung Q5 mới eligible mặc định khi checkpoint tương ứng được triển khai, giữ ba unlock Guard/Static/Death Echo hiện có, không thêm mục tiêu meta mới.
4. Cổng tuần tự: duyệt contract trước Q5A; Juggernaut Q5A phải được user playtest và chấp nhận trước Q5B, tương tự tới Q5E. User đã duyệt contract; Q5A đã được user duyệt “q5a ok”; Q5B đã deploy b06bf69, đang chờ playtest acceptance.

## Meta progression
- Hybrid unlocks, mở thêm Mutation, Curse và cosmetic; có 4 unlock mục tiêu.
- Không có permanent stat upgrades.
- Lưu localStorage; dữ liệu không đáng tin cậy, phải validate và whitelist khi load.
- MVP không có anti-cheat hoặc backend.
- Bốn mục tiêu tích lũy M6: hạ 1 quái → Guard Breaker; 5 Detonate → Death Echo; 3 Perfect Dodge → Static Riposte; hạ Chain Warden → cosmetic Lăng kính.
- Implementation Q5C có pool ban đầu10 Mutation/7 Curse (tổng12/8); hiệu ứng theo contract và tank trade-off đã duyệt. Đích Q5 sau các checkpoint: pool ban đầu10 Mutation/7 Curse; Guard Breaker, Static Riposte và Death Echo vẫn theo unlock cũ. Nội dung mới eligible mặc định chỉ khi checkpoint của nó đã triển khai; không thêm unlock objective hoặc permanent stats. Quyết định này được duyệt cùng contract; triển khai theo checkpoint.
- Lưu locale, mute, volume, cosmetic và tiến độ theo schema version 1; validate kiểu, enum, whitelist và giới hạn counter khi load. Save lỗi/bị chặn vẫn chơi trong phiên được.

## Art
- Neon Occult / Fractured Geometry, original geometric pixel art.
- Kích thước nền tảng Q1: Player32×32/common24–32. Q7C hiện dùng bodyheight40/36/38/36/50/76worldpx (Player/Grunt/Archer/Volatile/Bulwark/Boss), spritebox trim theo asset; collider không đổi.
- Palette tối, neon dùng để truyền thông tin chiến đấu.
- Artwork mới theo Q7A dùng illustration-first/asset-first: PNG/WebP hoặc SVG có chủ đích, Phaser Image/TileSprite và static layers. Graphics chỉ cho dynamic combat shapes/telegraphs/VFX/debug; không dùng làm artwork môi trường chính. Quy tắc này thay định hướng ưu tiên Graphics cũ, không yêu cầu thay sprite/VFX đã accepted. Procedural SFX hiện có giữ nguyên.
- Không custom art engine, không sao chép asset từ game khác.

### Fractured Vessel — nền tảng Q1 (lịch sử, artwork được Q7C thay thế)
- Player có lõi năng lượng trắng mint nằm trong khoảng hở giữa các mảnh giáp tối; mặt cắt jade, cạnh sáng và khe nứt giúp nhận diện ở kích thước chơi. Silhouette gồm đầu/mặt nạ có chóp gãy, vai bất đối xứng, thân rỗng và các chi tách rời.
- Thân cơ sở 32×32; vũ khí và VFX có thể vượt khung, không thay collider. Idle: lõi thở và giáp lơ lửng; movement: nhịp chi và độ trễ các mảnh; melee: lấy đà, chém, hồi; shoot: giật súng/lõi và lóe nòng; dash: giáp co lại, bung mảnh và afterimages.
- Slash là vệt cắt đa đoạn sắc cạnh biến đổi theo thời gian, đọc được hướng/tầm. Dash là dấu lưu hình các mảnh giáp ở vị trí đã đi qua. Mint là năng lượng player, amber nhấn Heavy/Charged; tránh che telegraph địch.
- Repo chưa lưu Art Bible riêng; mục này cụ thể hóa Neon Occult / Fractured Geometry và yêu cầu Fractured Vessel của task Q1, chờ người dùng duyệt hình ảnh, không tuyên bố khôi phục đầy đủ một Art Bible không có trong repo.

## Q7A Design Contract — Arena Art & Visual Contrast

**ACCEPTED — USER PLAYTEST APPROVAL** ngày2026-10-26: user xác nhận “hiện 7a chỉ mới có thay đổi về sàn arena? nếu vậy thì t approved” sau khi làm rõ scope chỉ artwork sàn obsidian (code0e0a9af/board2e48166), gameplay/camera/controls/sprites/VFX giữ nguyên. Concept V2 đã được duyệt trước qua “approved, làm tiếp đi”; checks/deploy PASS. Task user ngày2026-10-26 mở riêng Q7A; audit main `fbc994b6` không thấy Q7 đã dùng cho mục tiêu khác. Q2–Q5 và draft đầu4hướng `7843b98` giữ accepted; Q6 Curse Stacking đã ACCEPTED theo main bc07fd4 (user “aprroved q6 lun nha”); Q1 chưa visual approved. Q7A không tự hoàn thành Q1 hoặc mở Q7B.

Q7A đã đóng bằng approval của user. Q7B concept đã được duyệt và có runtime đang sửa theo playtest; xem contract riêng bên dưới. Approval Q7A không suy rộng sang Q1 hoặc xác minh mọi thiết bị/Safari.

### Arena / art direction
- Một arena **1600×1000, inset64**, player radius16 và toàn bộ clamp/collision giữ nguyên. Giữ follow/zoom/resize trong ArenaScene; không fit toàn arena vào phone theo mockup. Không procedural dungeon, tilemap phức tạp hoặc vật cản mới.
- Hướng đề xuất **Ấn phong bị vỡ / The Broken Seal V2**: mặt cắt obsidian tối lớn, bevel nông và khe chìm; hai vòng nghi lễ đứt đoạn, rune/magical circuitry ít, có chủ đích. Ba dấu ấn phẳng cố định: split-crown tây bắc, các phiến lồng phía đông, fan ba phiến phía nam. Là hình inlay trên sàn đi xuyên bình thường, không là tường/pit/collider.
- Material hierarchy: nền obsidian chìm → các mặt kính đá rộng → khắc nghi lễ/xước cạnh nông → actors/VFX. Khoảng65% trung tâm là vùng yên; không rải rubble/random noise, không lấy bloom/glow làm depth. Chi tiết nhận diện gần rìa cũng phải tối vì combat có thể diễn ra ở mọi vị trí.
- Original Neon Occult / Fractured Geometry, dark fantasy pixel art và fragmented armor. Giữ Fractured Vessel, enemy visual Q3, combat effects Q2/Q4/Q5 hiện có; không thay hàng loạt sprite/VFX để giống nhân vật ImageGen.

### Contrast / readability

| Ưu tiên | Nội dung | Cách đọc ngoài màu |
| --- | --- | --- |
| P0 | Player, enemy attacks, danger telegraphs, immediate threats | Lõi mint/ivory sáng trong giáp tối; viền threat rõ; dashed prepare → solid/chevrons imminent → flash hit theo timing hiện có |
| P1 | Enemy bodies, projectiles, Boss cues | Silhouette mask/hooks/hood/five-shards/plates/crown, outline, hướng bay/pose và quy mô hiện hành |
| P2 | Rupture, Charged, Chain/Detonate, Barrier, resource feedback | 3diamond pips; đường nguồn→đích mảnh; vòng nổ gãy có tâm/radius thật; Barrier segmented; không phủ player/threat |
| P3 | Floor, runes, cracks, ambient decoration | Chìm, ít cạnh sáng, không dùng hue danger, không pulse/animation giống telegraph |

- Palette sàn đề xuất: `#090D19 #111925 #202D3A`; rune chìm tối đa sắc độ tham chiếu `#35474D`, không xem đây là mức sáng bắt buộc. Mint/ivory player `#9DFFE2/#E9FFF0`; rose danger `#FF6F87`; imminent `#FFE599`; hostile violet `#C399FF`; Charged amber `#FFCC80`; Barrier cyan `#63D9F5`. Đây là bảng tham chiếu; giữ mapping màu đang có của EnemyVisual, không đổi Bulwark sang cyan chỉ vì ảnh palette.
- Kiểm màu **và** luminance, outline, size, shape, pose/animation. Player phải nhận ra ngay trên center/rìa và giữa crowd; danger phải sáng/rõ hơn khe sàn. Khe/rune không có chevrons, nhịp đóng vòng hay pixel sáng như projectile.
- Floor giữ tĩnh; không tăng bloom/particle budget, không thêm shader/post-processing nặng. Giữ chain/impact budgets hiện hành. Một ảnh đẹp tĩnh không chứng minh telegraph lúc nổ/di chuyển đọc tốt.
- Kiểm grayscale thực bằng CSS grayscale trên cùng ảnh trong board; sau implementation kiểm screenshot renderer màu/grayscale, threat prepare/imminent/hit/recovery và crowd. Không cần visual regression framework.

### Visual gate / deliverables
- [Gói review và audit](docs/q7a/README.md), [board](docs/q7a/index.html), [prompts](docs/q7a/PROMPTS.md). Arena concept V2, combat mobile/desktop mockup V2, contrast/palette V1 và crowd mockup V2 là **minh họa**, không là screenshot game hoặc runtime asset đã duyệt. Bản V1 environment/mocks giữ làm iteration lịch sử, được V2 supersede.
- ImageGen có thể tạo file PNG local; không dùng paid API mới hoặc dịch vụ khi game chạy. Prompt/inputs/provenance/quyền dùng và sai lệch ảnh nằm trong README Q7A. Không dùng reference có bản quyền không phù hợp làm asset.
- User duyệt hướng material, mức yên của floor, ba motif và combat contrast trước khi triển khai. Chưa duyệt: chỉ tài liệu/artwork review, không thay ArenaScene/public assets/gameplay. Nếu cần chỉnh concept, tiếp tục vòng minh họa rồi dừng lại cùng gate.

### Implementation sau approval
- Tách source artwork trong docs/q7a/artwork với optimized runtime PNG/WebP/SVG trong public/assets/arena. Ưu tiên một floor texture tĩnh và rất ít lớp decal tái sử dụng, preload một lần, Phaser Image layers dưới depth1 combat; không thêm custom art engine/dependency frontend.
- Bỏ title/footer khỏi runtime source, cân scale theo world, loại hình dễ hiểu nhầm vật cản, kiểm độ nét/khả năng nạp texture trên mobile trước chốt kích thước. Không đưa nguyên board có actor/HUD vào game.
- Dự kiến sửa ArenaScene preload/drawArena và thêm assets/metadata; PlayerVisual/EnemyVisual/BuildVisual/chargedVfx/BarrierVisual chỉ làm đối chiếu, không dự kiến sửa trong gói arena.
- Khóa timing/damage/resources/Mutation/Curse/draft, AI/Boss patterns, input desktop/mobile, bounds/collider/camera. Free/open-source first, KISS.

Hiện hành: một WebP1600×1000,1Image depth0/tint#7a8791; source artwork/prompt/provenance và renderer evidence tại [Q7A implementation](docs/q7a/IMPLEMENTATION.md). Các bước gate bên trên là quy trình/điều kiện; concept đã được user duyệt, không còn chờ visual gate.

### Acceptance sau implementation
1. Arena có art identity rõ, depth/material hierarchy có chủ đích, vượt nền lưới debug.
2. Player vẫn focal point khi đông quái; enemy/Boss threats đọc rõ ở center/rìa.
3. Rupture/Detonate/Chain/Charged/Barrier không bị background che hoặc hòa lẫn.
4. Desktop và mobile dọc/ngang giữ camera/layout/control readability; kiểm size320/390/844/1440 phù hợp và thiết bị thật khi có.
5. Artwork không gây suy giảm performance rõ: so cùng crowd/viewport trước–sau (frame time, texture/load), ghi thiết bị và giới hạn; không dùng fixture làm bảo đảm mọi mobile.
6. Không regression gameplay; typecheck/build PASS, focused checks phù hợp thay đổi, không comprehensive E2E.
7. Có screenshot/video **renderer thật** trước–sau và provenance fixture/input; ảnh ImageGen không thay bằng chứng này.
8. Sau checks: commit/push, deploy workflow hiện có, bàn giao URL/commit/ảnh; ghi **AWAITING USER PLAYTEST APPROVAL**, chờ user xác nhận chất lượng. Không tự chuyển Q7B.

## Q7B Design Contract — HUD & Combat Readability

**ACCEPTED — USER PLAYTEST APPROVAL** — User xác nhận “q7b đã đạt” ngày2026-10-26 trên bản5ee970e. Code5ee970ed41802ce75d222b714c74361949d0aae6, Pages40292060536/job121469197980 completed/success gồm Deploy. Scope accepted: HUD/feedback/details và authoredframes, icon-only4attack theo2pair+Dash/Surge, lanes/floatingjoystick/mobileautoaim/draft1s. [Implementation/checks/evidence](docs/q7b/HUD_V3.md). Concept đã duyệt trước qua “approved làm đi”; vòng6664ee0 rồif9d7930 được sửa theo feedback user, lịch sử/evidence giữ nguyên. Q2–Q7A/draft đầu4hướng giữ ACCEPTED; Q1 chưa visual approved riêng. Không tự mở Q7C.

### Phạm vi / nguồn dữ liệu
- Cải thiện HUD/feedback hiện có, không xây lại toàn UI. **Ngoại lệ theo feedback user Q7B:** thay viewport/camera fit, vùng touch/radial mapping, auto aim mobile và draft interaction lock1s. Giữ floor `broken-seal-v2.webp` nguyên hash, world bounds/collision/follow, damage/timing/resources/effects/AI/Boss/draft offers và save/unlocks. Không suy rộng thành duyệt lại Q2–Q7A.
- HUD chỉ đọc CombatWorld/RunDirector/BuildEffects/Barrier và translation keys. Không thêm resource, đổi cooldown/damage, điều kiện proc hoặc logic heal để dễ hiển thị. Không suy luận damage/heal tổng từ net HP delta khi nhiều sự kiện cùng tick.
- Baseline renderer hiện hành và audit: [Q7B review](docs/q7b/README.md); đo fixture full build HUD cao198.5px ở390,213.5px ở320,352.5px ở1440 và157.5px ở844landscape. Là bounding box, không là đo mọi pixel che khuất; fixture không natural run.

### A. Combat HUD
- **HP / Barrier:** cùng card sống sót, tách rõ heart + thanh HP liên tục và shield + thanh Barrier có phân đoạn; số HP/maxHP và Barrier/30 độc lập. Không dùng thanh chồng lên nhau. HP mint ở bình thường, rose + warning khi≤25%maxHP (ngưỡng presentation); Barrier cyan,0 vẫn đọc được/broken icon ngắn khi vỡ, không tự có cooldown hồi khiên.
- **Tài nguyên:** Dash/Heavy hiển thị lượt còn/tối đa + fill/timer phần hồi;1/2 vẫn AVAILABLE dù lượt tiếp đang hồi. Charged hiển thị đạn0–3 và chargePoints theo state hiện hành; không timer giả vì đạn không tự hồi theo thời gian. Surge hiện% và chữ/icon READY chỉ khi100. Empty/cooldown/ready khác nhau bằng số, nét đặc/rỗng, label/timer và icon; không chỉ hue/opacity.
- Desktop1440: HP/Barrier trái trên, build phải trên, timer/Boss giữa, notice ngoài canvas. Top lane96px và resource/milestones lane96px dưới; không HUD card nào che nhân vật dù vào4góc.
- Portrait390/320: vitals + build + feedback + timer/Boss trong top lane134px. Số quan trọng≥12–14px; không lặp4resource rows vì6nút có readouts. Canvas nằm giữa HUD và controls284px, không chỉ thu nhỏ overlay.
- Correction theo ảnh user: HUD có authoredSVG9slice bevel/góc gãy/inset rõ,2cặpattack vàutility riêng. [Chi tiết/evidence mới](docs/q7b/HUD_V3.md). Cụm cảm ứng theo phần Mobile-first hiện hành: floating joystick nhận cả vùng, combat184×272 dạng cung,2cặp4attack +Dash/Surge icon-only; available không dùng HTML disabled làm mất capture/giữ-thả. Giữ6hành động/resource/hold-release và lifecycle reset, thay geometry/aim theo user.
- Landscape667/844 và tablet768: top lane78px khi height≤600, controls hai dải bên ngoài canvas; tablet dọc dùng portrait lanes. Kiểm Boss6nút/4góc, min target44px, không coi mockup là bằng chứng PASS.
- **Build4Mutation/2Curse:** bốn ô diamond và hai ô hex, empty/owned có nét/fill khác nhau, stable order theo state; một summary button≥44px cho cả dải trên phone, không6touch targets quá nhỏ. Count/names đầy đủ và effect/risk/cooldown ở panel details dùng t(id)/t(idDesc) hiện có; không cắt tên trong panel. Chưa đủ slot hiện đúng0–4/0–2, không giả full build.
- Tap/click summary mở panel chi tiết cuộn được qua pause hiện có; giữ vi/en, focus/close/Resume rõ. Không hover-only. Mở/đóng clear armed input/capture/buffer theo lifecycle hiện có, không biến cú nhả đang aim thành action/chọn UI; resume chỉ sau thao tác mới rõ ràng. Không tự nhận input từ HUD text trang trí. Không dùng details để chọn/đổi build; draft có lock1s theo ngoại lệ user, Pause/Victory/Defeat giữ flow.
- Mốc draft tiếp/Boss vẫn xem được gọn khi chơi hoặc đầy đủ trong details/Pause, không xóa thông tin hay đổi milestones. Boss bar có vùng riêng ở đỉnh, không phủ tâm cue/đạn; nếu thiếu chỗ, ẩn thông tin P2/P3 trước.

### B. Feedback / chống nhiễu
- Giữ VFX/audio đã accepted: hurt tint/ring, segmented Barrier break, Perfect glyph, heal/build cues và charged/chain budgets. Ưu tiên bổ sung nhận diện trên **card/icon HUD**, không thêm bloom/full-screen vignette/particles/floating-damage-text.
- HP hit → card edge/heart flash ngắn và “Trúng đòn”; heal → arrow/+HP từ actual heal state (không cộng số giả); Barrier break → shield nứt/0 và “Vỡ Barrier”; Perfect → glyph và notice ngắn. Các ví dụ trong board là các thời điểm khác nhau, không yêu cầu cùng xuất hiện.
- Một notice visible ở hàng ngoài center, tối đa2pending, stale bỏ; target tồn tại0.8–1.0s simulation, không refresh mỗi render. Gộp cùng loại/cùng burst, chỉ thêm khi có transition/event thực từ flags/counters; không đọc cờ đang active thành event mỗi frame. Pause/draft/hitstop không làm trôi timer combat feedback; restart xóa presentation snapshot/queue.
- Ưu tiên immediate risk/hit/Barrier break trước Perfect, rồi heal/proc; persistent lowHP/Ghost-risk vẫn có icon/label ở card để không mất khi notice khác hiện. Risk notice chỉ phát khi đi vào trạng thái, không giữ queue bận suốt lúc lowHP/zeroDash; persistent warning ở card vẫn còn. Không toast từng Light/shot/combo tick, không đọc screen-reader live-region liên tục.
- Proc quan trọng gắn với hành động: Static→Charged lightning/timer; Reversal→Heavy; Phantom/Frenzy→melee hoặc mutation icon; Kinetic→3pips gần Barrier; Anchor→ready/spent; heal sources/chamber→icon cooldown. Dữ liệu từ state hiện có, không thêm proc hay đổi effect.
- Curse: Ghost zeroDash có warning ngắn khi risk active; Blood cost/heal blocked, defensive damage cost, Glass maxHP, Hunted/DeathEcho risk và Parasitic heal trade-off xem rõ qua icon/details. Self-hazard vẫn giữ world cue thật. Không chuyển passive trade-off thành dòng thông báo lặp mãi.
- Chỉ flash khi trạng thái đổi; READY giữ static mark sau một lần nhấn nhẹ. Respect prefers-reduced-motion cho CSS; không thêm loop rung/chớp liên tục. Không đổi pose/silhouette Q1 hoặc timing/threat shape Q2/Q3.

### C. Visual language / kỹ thuật
- Neon Occult / Fractured Geometry đồng bộ floor Q7A: panel obsidian/charcoal, bevel/broken corners tiết chế, hierarchy P0player/threat → vitals/readiness → build/proc → milestones/decor. Icon shape, contrast, spacing và numeral cùng truyền nghĩa; giữ hue enemy/threat.
- Asset-first cho icon/decoration có chủ đích: một SVG sheet hoặc ít PNG/WebP; CSS chỉ layout/responsive/typography/state/interaction. Không UI drawing engine, procedural artwork loop, frontend/shader framework hoặc dependency mới.
- File hiện hành: main.ts,style.css,i18n.ts,CombatHUD/HUDFeedback và authored SVG. Vòng sửa user bổ sung TouchControls input/origin, ArenaScene viewport fit/auto aim adapter + pure touchAim.ts, DraftInteractionGuard1s. CombatWorld/RunDirector/Draft/BuildEffects/config/PlayerVisual/BuildVisual/BarrierVisual/floor không sửa. [Revision](docs/q7b/REVISION.md) phân biệt baseline8a469c0 và bản sửa; evidence cũ được giữ lịch sử.

- HUD runtime hiện đã có: một CombatHUD + bounded HUDFeedback,authoredSVG glyphsheet,details qua pause; [evidence/checks/cách thử](docs/q7b/IMPLEMENTATION.md). Ảnh ImageGen có thể sai text/shape/icon/camera và vị trí nút; **contract + controls hiện hành ưu tiên hơn mockup**. Không import board thành HUD texture; không dùng ảnh BEFORE sinh lại thay baseline renderer.

### Visual gate / acceptance scenarios
- Deliverables: [Desktop V1](docs/q7b/artwork/hud-desktop-v1.png), [Portrait V2](docs/q7b/artwork/hud-mobile-v2.png), [Crowd/Feedback V1](docs/q7b/artwork/crowd-feedback-v1.png), [Before/after concept](docs/q7b/artwork/before-after-v1.png). [Review board](docs/q7b/index.html) còn đặt baseline thật cạnh concept để không giả pixel-perfect. Source/prompt/license/version/giới hạn trong README/PROMPTS/manifest. PortraitV1 superseded vì chữ cảnh báo sai.
- Visual gate đã hoàn tất bằng user “approved làm đi”; không tự ART APPROVED cho ảnh sinh. Các correction frame/controls được user giao trực tiếp sau concept; runtime5ee970e nay được user chấp nhận “q7b đã đạt”. Bằng chứng kỹ thuật/fixture vẫn tách riêng, không suy ra đã kiểm mọi thiết bị.
- Sau approval kiểm tối thiểu:
  1. HP100/22/Glass75 với Barrier0/30/vỡ: số/thanh/icon phân biệt, nguy hiểm không chỉ dựa màu, grayscale đọc được.
  2. Dash/Heavy0,1,2charges và recharge; Charged0/3 với points0–2, available và Surge0/99/100: không hiển thị sai timer/READY hoặc làm mất giữ-thả.
  3. Build0/0 tới4Mutation+2Curse, tên dài vi/en; mở/cuộn/đóng details qua mouse/touch/keyboard-focus, không tự cast/chọn draft; restart/reset không giữ status cũ.
  4. Crowd+Perfect/Static/Phantom/Reversal, đồng thời hit/heal/break: bounded notice, đúng priority, không refresh spam/che player/đạn.
  5. Elite/Boss3patterns tại center/rìa, cả full build: cue không bị HUD/controls che; floor Q7A nguyên hash.
  6. Desktop1440,phone390/320,landscape844/tablet768: touch targets≥44px,6nút không chồng, safe-area/aim-drag/hold-release/pointercancel/pause/blur giữ; HUD/controls không giao canvas và player4góc thấy rõ. Floating joystick nhiều gốc; auto nearest/live/manual override/no target; draft1s/fresh press/keyboard/rerender.
  7. Draft đầu4hướng/các draft sau, Pause/Victory/Defeat/settings và vi/en vẫn thao tác; t(key) đủ cả2dictionary, không stale panel/notice.
  8. Focused tests phù hợp presentation snapshot/reset/priority + typecheck/build, renderer screenshots trước–sau, browser input/overflow/runtime checks và perf so cùng scene. Không comprehensive E2E/framework; fixtures/tests không là user approval.
- Implementation/checks/push/Pages và bàn giao renderer đã hoàn tất; user đã xác nhận Q7B đạt trên5ee970e. Đồng bộ acceptance và dừng, không tự mở Q7C.

## Q7C Design Contract — Character & Enemy Art Overhaul

**ACCEPTED — USER PLAYTEST APPROVAL** — User xác nhận “duyệt q7c đạt” ngày2026-10-26 trên bản đã deploy2ef6d48 (code0041064, docs5f3e938), Pages40305977315 SUCCESS. Đây là user playtest approval, không suy ra từ build/tests/fixture. Visual đã được duyệt trước qua “visual approved q7c” sau [research góc nhìn](docs/q7c/VIEW_RESEARCH.md). **Q7C = Character/Enemy Art; Q7D = Full Run Polish**, Q7D được user giao ngày2026-10-26. Q7B5ee970e/approval78f07e6 accepted; câu “khôngtựQ7C” tronglịchsử Q7A/Q7B làgate cũ,user đãgiaoQ7C riêng.

- Player/Grunt/Archer/Volatile/Bulwark/ChainWarden asset-first/ImageGen,NeonOccult/FracturedGeometry theoảnhuser **Q7A VisualHierarchy/ContrastStudyV1**,giữsilhouette/palette/P0–P3. Top-down¾cáchđiệu nhìn xuốngcao,giữfloor/camera2D; khôngchuyểnisometric hoặcép overhead90°. Khôngvẽbodyprocedural/Graphics,khôngcropconceptboardthànhsprite.
- Runtime:sourceproduction riêng4facings/idle-move-windup-attack-recovery-hit-death,PlayerL1/L2/L3/Heavy/Basic/Charged/Dash/exit vàBoss sweep/ring/slam.236poseframes,atlasPNG1024square/4MiBdecoded;pose-key animation+transforms đọcstate simulation. Bodykhôngxoayphẳng360°,aim/hit/projectile/VFX vẫnliêntục. Volatilekhôngrecovery sống;deathghostkhônggiữcollider/target/AI/killreward. Boss khônghitstagger.
- Giữhitbox/AI/damage/timing/telegraph/VFX/controls/HUD/Q2–Q7B; khônggameplaycontent/framework/gamedep mới. PoolImages/8enemydeath/6playerecho;clock chỉsimulation,reset/pause/draft/hitstop bảo toàn. Telegraph/drawSlashnguyênhàm,cues/status/vfxgiữrelative layers,hình/màu/budget;silhouetteecho theoart mới.
- [Implementation/checks/cáchtest](docs/q7c/IMPLEMENTATION.md):build/typecheck163testsPASS,renderer5sizes/crowd/grayscale/Charged/Boss3/realinput/dist/perfsoftwareWebGL. Fixturekhôngnaturalrun/device/Safari hoặcuseracceptance. Đã push/deploy/bàn giao URL/commit/ảnh before-after/checklist và nay user đã chấp nhận Q7C; không suy rộng coverage kỹ thuật từ approval.
- [Sources/prompts](docs/q7c/source/PROMPTS.md),[runtimehash/registration](docs/q7c/runtime-assets.json),[reviewarchive](docs/q7c/index.html),[asset specification](docs/q7c/ASSET_SPEC.md). Q1art cũđượcQ7C thaythế,khôngtựacceptedQ1 từbuildchecks. Giữapprovalhistory.
- Q7D hiện hành theo contract bên dưới; không suy rộng approval Q7C.

## Q7D Design Contract — Full Run Experience Polish

**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “đã đạt q7d” ngày2026-10-26 trên bản code/deploy `66e0799` (handoff `bcfbfbe`), Pages40311723418 SUCCESS. Đây là approval trực tiếp của user, không suy ra từ build/tests/fixture. Gate cũ không mở Q8 đã được user supersede bằng task Q8 ngày2026-10-26; Q8A đã accepted, Q8B được user giao riêng; Q8C được giao riêng; Q8D chưa mở. User giao ngày2026-10-26 trên baseline main688f331; Q2–Q7C giữ ACCEPTED.

Goal: hoàn thiện Start → Combat → 6 Draft → Elite → Boss → Victory/Defeat → Replay trong run5phút. Chỉ ba ưu tiên:
1. **Âm thanh chuyển mốc:** cue ngắn Start/Draft/chọn card/Elite/Boss/Defeat, giữ Victory và combat SFX. Stop combat tails khi rời phase, mute/volume/autoplay giữ; không nhạc/dependency mới, không đổi timing.
2. **Kết thúc sạch:** death remnant Q7C được fade xong sau khi simulation dừng; dọn slash/muzzle/dash echo ở result. Giữ nguyên artwork, Victory reveal1100ms và pose/VFX đã duyệt. Chỉ presentation tiếp tục, tuyệt đối không tick AI/damage/rewards sau result.
3. **Liên tục panel/Replay:** panel mới mở về đầu và focus heading, locale/settings rerender giữ tương tác; Replay đồng bộ HUD/canvas ngay, không frame build/resource cũ. Giữ draft grace1s/fresh-press và reset input hiện có.

Audit/evidence/giới hạn tại [Q7D](docs/q7d/README.md). Phân biệt lỗi tái hiện được (death bị freeze, focus không đến panel mới) với bổ sung polish (cue chuyển mốc). Không coi ý tưởng nhạc nền, camera cutscene, art mới hoặc rebalance là bug.

Giữ CombatWorld/RunDirector/config/AI/timing/damage/12Mutation/8Curse/4Mutation+2Curse/weighted Draft/controls/balance bytewise; không thay floor/actor atlas/HUD artwork. Không artwork mới nên không mở visual gate hay ImageGen.

Acceptance kỹ thuật: run qua đủ6draft/Elite/Boss bằng browser input thật không grants; Victory/Defeat/Replay; mobile/desktop/pause/audio/vi-en/overflow/performance. Fixture chỉ cho edge cases (deadline/mutual result/reveal/cancel), ghi rõ; automation không thay user/device acceptance. Build/tests PASS → commit/push main khôngforce → Pages SUCCESS → bàn giao checklist, dừng chờ user.

## Q8 — Run Pacing & Boss Challenge (2026-10-26)

User giao tuần tự Q8A → Q8B → Q8C → Q8D; mỗi checkpoint focused tests/build/gameplay evidence/commit/push/Pages rồi dừng chờ user. Approval Q2–Q7D giữ nguyên, chỉ thay balance Q8 được giao. Không enemy/weapon/map/framework mới hoặc nerf hàng loạt Mutation/Curse.

- **Q8A — Dynamic Spawn: ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “q8a đạt yêu cầu” ngày2026-10-26 trên code/deploy394341c, Pages40338795004 SUCCESS; [spec/audit/evidence/checklist](docs/q8a/README.md). Sau15s, EMA kill rate cửa sổ6s, bonus=max(0,rate−1). Cadence cơ sở chia(1+bonus), sàn24ticks; soft cap18+min(12,floor(bonus×3)). Pack≤3, không spawn debt/catch-up; pressure4s không kill giữ Archer cap8 nhưng hard cap48, không xóa quái khi cap hạ. Khoảng cách spawn hiện có360px/clamp/fallback≥220px được giữ và test tại tâm/biên/góc. Freeze adaptation/spawn khi hitstop/draft; pause không step; Replay reset. Boss vẫn bổ sung từng quái/cap7. HP/growth/damage/effects/art/input giữ nguyên.
- **Q8B — ACCEPTED — USER PLAYTEST APPROVAL:** user xác nhận “oki duyệt q8b” ngày2026-10-26 trên code/deployeb6fbbe (docs7b2d005), Pages40341327061 SUCCESS; user giao riêng Run Pacing & Milestone Balance; công thức/window hiện hành ở bảng Run. Không thay spawn Q8A, HP/damage/growth/effects/pattern/input; không warning2s hoặc Enraged Q8C. Deadline5:00 giữ. User xác nhận “Giữ mục tiêu mềm; cho phép thắng sớm” ngày2026-10-26: Victory4:30–5:00 là mục tiêu mềm, thắng sớm khi hạ Boss nhanh được phép. Bot hiệu quả hạ Boss5–13s, Victory3:46–3:53 dù arrival đúng3:40; giữ nguyên evidence. Không khóa Victory/chờ sau Boss chết. Quyết định mục tiêu mềm riêng biệt với approval Q8B sau đó; giữ giới hạn coverage kỹ thuật. [Audit/A-B/giới hạn/checklist](docs/q8b/README.md).

- **Q8C — ACCEPTED — USER PLAYTEST APPROVAL:** user “q8c đạt” ngày2026-10-26 trên8cbff77 (handoff8e70df3), Pages40357489627 SUCCESS. Giữ giới hạn coverage kỹ thuật;  warning viền đỏ4nhịp/2s simulation, pause spawn thường không tích debt, giữ input/crowd hiện có, Boss sau warning mới cleanup common/projectiles như Q8B. Pause/draft/hitstop freeze warning; Replay reset. Phase2 tại≤50%HP một lần, transform1.4s/pose ImageGen riêng; dừng timer/player/quái/đạn/damage/resources trong transform, không hồi HP; speed+15%, cooldown0.55→0.44, giữ windup/recovery cơ bản/damage/range/projectiles. Slam→gap0.25→sweep khóa hướng0.62→recovery0.75. Reuse đúng sector230px/1.7rad và Perfect predicate, không projectile mới. [Spec/evidence/playtest](docs/q8c/README.md). Chỉ Q8C, không mở Q8D; user giao triển khai→test→deploy trực tiếp, không suy ra visual/playtest approval.
- **Q8D — ACCEPTED — USER PLAYTEST APPROVAL:** validation4hướng×2cấu hình×2cadence/policy, density/kill-rate/damage/pacing/Boss và regression; giữ nguyên runtime khi chưa đủ evidence tune. [Báo cáo trước/sau, raw data và checklist](docs/q8d/README.md). User xác nhận “q8d đạt” ngày2026-10-26 trên cbdb131 (handoff4791b27), Pages40360458461 SUCCESS; approval trực tiếp, không suy ra từ bot. Giữ giới hạn coverage kỹ thuật; không mở Q9.

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
- Scope Q5 khóa ở12 Mutations,8 Curses,1 run tối đa5phút; implementation Q5C hiện12/8; Draft có trọng số chỉ ở Q5D. Hiện hành Q6: mỗi run tối đa4 Mutation và2 Curse active.
- Không multiplayer, leaderboard online, procedural dungeon, account system, monetization hoặc tính năng ngoài scope.

## Milestone
- M0: agent foundation và game brief, hoàn thành trước scaffold/package/gameplay.
- M1: Phaser/TypeScript/Vite, arena hình học, player WASD, mouse aim, camera/viewport, Start/Pause, i18n tối thiểu, dev/build hoạt động.
- M2: melee, ranged, dash và enemy combat.
- M3: Rupture, chain reaction, Charged Shots và Surge.
- M4: run timer, waves, Mutation/Curse drafts.
- M5: Elite, Boss, victory/death và restart.
- M6: unlocks, localStorage, SFX và polish tối thiểu.

M0–M6 là lịch sử functional implementation, không phải chứng nhận experience acceptance. Q1 (player art/animation/readability) là lịch sử; Q7C thay artwork và đã được user chấp nhận “duyệt q7c đạt” trên bản deploy2ef6d48. User đã mở rộng phạm vi sang mobile-first: triển khai input cảm ứng, bố cục và camera; Q2 đã được user chấp nhận qua playtest (“ok q2 ổn đó”); Q3 đã được user chấp nhận qua “oki q3 r”; Q4 đã được user chấp nhận qua “thấy ok r” trên daee80a, phát sinh sau theo issue mới; Q5 Design Contract12/8 được soạn theo yêu cầu ngày2026-10-25, DESIGN APPROVED; Q5A đã được user duyệt “q5a ok” trên fa4045d; Q5A–Q5E đã được user xác nhận hoàn tất/duyệt trong task Q6 ngày2026-10-26 (approval/evidence từng lượt Q5 ở contract lịch sử và HANDOFF). Q6 Curse Stacking đã ACCEPTED theo user ngày2026-10-26. Q7A arena floor đã được user ACCEPTED sau deploy. User mở Q7B HUD/readability ngày2026-10-26: runtime5ee970e đã user xác nhận “q7b đã đạt” — ACCEPTED. Q7C Character/Enemy Art nay đã ACCEPTED theo user; Q7D Full Run Experience Polish đã được user xác nhận “đã đạt q7d” ngày2026-10-26 trên66e0799 — ACCEPTED; Q8 nay được user giao riêng; Q8A đã được user xác nhận “q8a đạt yêu cầu” trên394341c — ACCEPTED; Q8B đã được user xác nhận “oki duyệt q8b” trêneb6fbbe — ACCEPTED; Q8C đã được user xác nhận “q8c đạt” trên8cbff77 — ACCEPTED; dừng, không mở Q8D.

### Q8C playtest shortcut theo yêu cầu user
`?playtest=boss` cấp1150kills tại3:40,4Mutation Phantom/Static/Reclaimer/Kinetic và2Curse Ghost/Parasitic, bỏ draft/Elite đã qua. Thêm50kills hoặc fallback4:00 kích hoạt warning2s bình thường; không sửa Boss/deadline/run thường. Replay reset cùng preset, không lưu progression. Đây là fixture có grants, không là experience approval. Chi tiết tại docs/q8c/README.md.

### Q8C Arrival ambient — ACCEPTED — USER PLAYTEST APPROVAL
User xác nhận phần Boss ổn, warning thiếu ambient/thu hút. Hướng đã duyệt để làm mockup: seam rạn đỏ cam/halo hẹp sát mép arena,4nhịp tăng cường độ/2s, âm trầm+xích đồng bộ. Không phủ đỏ màn hình/che telegraph/input, không đổi Boss/Enraged/run. User “ok, làm đi” đã duyệt boardV2 và audio sketch trước tích hợp. Runtime mới dùng texture edge production riêng, halo10px(screen mobile)/14px(desktop),4strip dưới actors/telegraph,4beat âm cùng simulationclock tại0.1/0.6/1.1/1.6s với gain0.32/0.46/0.66/0.90; không timer âm riêng, không phát lại nhịp cũ sau Resume/unmute. Mute/volume và cap8SFX giữ. Pause/Draft/result stop tails; Replay reset. Spec/evidence tại docs/q8c/arrival-runtime/README.md. Viền Graphics5px ban đầu được supersede, timing warning/combat giữ. Không tự ACCEPTED/Q8D.

### Q8C final approval
**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “q8c đạt” ngày2026-10-26 trên code/deploy `8cbff77` (handoff `8e70df3`), Pages40357489627 SUCCESS. Đây là approval trực tiếp cho Q8C gồm Boss/Enraged và ArrivalV2/âm cảnh báo, không suy ra từ tests/build/deploy. Giữ giới hạn coverage kỹ thuật và lịch sử approval Q2–Q8B. Dừng, không mở Q8D. Các trạng thái chờ duyệt trong ghi chép trước đây giữ để tham chiếu lịch sử, không yêu cầu duyệt lại.
