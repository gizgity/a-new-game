> **VFX follow-up V1.1:** user “visual ok, làm đi” ngày2026-10-27 đã duyệt visual và giao triển khai. Code/deploy `59b9a61`, Pages40509711771 SUCCESS; [production/evidence/6preset mới](vfx-production/README.md). Giữ gameplay/balance/progression; **AWAITING USER PLAYTEST APPROVAL**, không Q9D. Deliverya489279 bên dưới là baseline Q9C trướcVFX.

# Q9C — Arena Anomalies

**AWAITING USER PLAYTEST APPROVAL**. Scope user27/10; không Q9D. Baseline `278f439` gồm Q9A/Q9B accepted và Auto Aim desktop follow-up. Không đổi damage/AI/progression/timing của baseline ngoài các modifier Anomaly đang được chọn. Auto Aim/mobile-layout vẫn giữ trạng thái approval riêng từ HANDOFF.

## Contract và implementation

- Run#1 không Anomaly. Từ run#2, tại135s mở2offer khác nhau đã unlock; chọn1, giữ hết run. Storm/Blood mở sẵn;4ID còn lại dùng đúng rewards/dependencies/collection Q9B.
- `legacy.ts` mở rộng Run Ticket hiện hữu bằng offers/selected và previousAnomalies. RNG tách domain từ cùng seed, anti-repeat0.65, không tiêu thụ stream Draft/Sigil/reward. Save v2 cũ thiếu fields được derive từ seed/catalog; strip stat/ID lạ. Restart/refresh cùng ticket/offers/choice; simulation bắt đầu lại từ0 và tái kích hoạt choice tại135s, không reroll.
- Thứ tự: result → earned Drafts → Boss warning/spawn → Elite transition → Anomaly. Không advance combat/run/spawn khi panel đang mở; pause/blur menu không chồng panel. Boss transform freeze giữ nguyên. Offer đang chờ được xét lại ở tick an toàn, không xây event/simulation framework.
- Dùng panel/layout Draft hiện hữu, chặn1s và fresh press/tap; hủy held Heavy/Charged/touch khi đổi phase. Tab/Enter hoặc touch chọn cùng luật; vi/en. Save lỗi giữ panel và lựa chọn cũ, chỉ cho retry lựa chọn đó.
- HUD lane hiện hữu hiện tên Anomaly; chi tiết benefit/counterplay trong Build Details và2card. Không đổi touch hit areas/aim, camera, floor/actor/HUD assets đã accepted. Chỉ dynamic combat outlines/bolt/relay line, không artwork mới hoặc procedural replacement; không có visual approval mới được tự gán.

| Anomaly | Benefit / trigger | Drawback / counterplay |
| --- | --- | --- |
| Fractured Storm | Sét định kỳ gây damage lên quái trong vòng khóa vị trí | Cũng đánh player; dụ quái vào vòng rồi đi/Dash ra trước1.3s |
| Blood Moon | Light3 hoặc Heavy finisher trúng: thêm1điểm Charged, CD2.5s, tối đa1lần/attack | Chase nhanh hơn; giữ lối thoát/đẩy lùi, không tăng tốc windup hoặc Boss |
| Volatile Ground | Tăng radius của Rupture Detonate, gồm specialist | Vùng nổ định kỳ tại vị trí khóa;1.4s để rời vòng/Dash |
| Static Field | Perfect Dodge phản điện lên tối đa4quái gần, CD2s | Archer thêm2tia xòe theo CD chung; strafe/khe đạn/Dash, giữ cap80projectiles |
| Broken Seal | Heavy thêm force/stagger lên common | Sau đó chống stagger/interrupt ngắn; square cyan khi hết stagger; đổi mục tiêu/né, vẫn nhận damage/Rupture/Shatter. Boss/Elite không thêm CC |
| Echo Chamber | Tối đa1marked target ngoài radius mỗi root, CD chung; relay thật giữ delay/charge/dedup | Nguồn nối xa phản công vòng khóa vị trí1.2s; rời vòng/Dash hoặc hạ nguồn để hủy |

Thông số tại [config](../../src/game/config/anomalies.ts) là **provisional tuning, chưa approved balance**. Không ghi DDR hoặc tự tune Q9A/Q9B. Secondary có origin riêng, finite ledger/death dedup, không gọi primary hoặc tự tạo Rupture/finisher/Perfect; death synergy vẫn dùng ngân sách đã có. Anomaly Echo khác Mutation Echo Chamber dù cùng tên hiển thị.

Anomaly zones bị hủy khi Boss windup/active/followup/combo/arrival; vùng mới luôn có đủ telegraph. Static extra bullets được tag/hủy trước collision khi Boss bắt đầu đòn; đạn native giữ nguyên. Transform/hitstop/pause dừng clock. Dash mới bấm tại tick impact vẫn né được. Giới hạn2zone, không fill toàn màn, cues dưới threats/actors. Đây là technical safety, chưa chứng minh mọi tình huống thiết bị thật/human readability.

## Validation

- `npm test`:236tests PASS, gồm18focused Q9C cases. Benefit/drawback/trigger/CD/reset cho cả6;2:15/queue/Elite/Boss/5:00; migrate/ticket/save/anti-repeat8,000seed;108ô6×18loadouts và72ô6×all12Mutation/all8Curse theo nhóm hợp lệ4/2. Giữ toàn bộ suites Q9A/Q9B/input/chain/builds/spawn/Boss.
- `npm run build` gồm typecheck: PASS; warning Phaser chunk>500KB có sẵn.
- [Browser](browser-check.mjs), [raw](evidence/browser.json):320×740,390×844,844×390 touch +1440×1000 desktop. Normal first/second run,2offers/vi-en/pause exclusion/freeze, refresh trước/sau chọn, held Heavy cancel và save-quota retry390.6fixture×2platform, cảnh24quái/4góc và HUD lane. Cảnh/readability fixture dừng loop, state cấp có chủ đích, không natural run/deviceFPS.
- [Input](input-check.mjs), [raw](evidence/input.json):390CDPtouch/1440keyboard-mouse sau chọn Static. Heavy giữ-thả, move+Basic đồng thời, Charged cancel/fresh release, pause→locale→resume. Resource fixture để kiểm release không là progression thật.
- [Production dist](dist-check.mjs), [raw+hashes](evidence/dist.json):6preset×390touch/1440keyboard, chọn/HUD/details/pause và không ghi save thật. Preview local không tự là liveHTTP verification.
- [Combat smoke](combat-smoke.mjs), [28runs](evidence/combat-smoke.json):4route Q8D×(khôngAnomaly+6), Sigil/Branch fixture, Draft kiếm qua milestones thật, không grantHP/kills/clock. Tất cả run kết thúc hợp lệ≤300s;24offers đúng135s, Boss/Enraged tiến, bounded entities/procs. Bot có Perfect predicate/aim chính xác, không chủ động né vùng Anomaly; thắng/thua không là balance approval hoặc winrate. Giữ deadline5:00, không ép duration/winrate.
- Chưa iOS/Safari/thiết bị thật/FPS/latency/thermal/audio hoặc user experience acceptance. Screenshots renderer thật là fixture, không concept hoặc approved artwork mới.

Tái lập: `npm test && node docs/q9c/combat-smoke.mjs`; dev5173/preview5175, Chromium `/usr/bin/chromium`, các script browser dùng `PLAYWRIGHT_MODULE` trỏ package có sẵn ngoài repo. Không thêm dependency/framework.

## Playtest

Normal URL dùng save thật: run đầu khôngAnomaly; từ run#2 chơi đến2:15, chọn1/2. Thử refresh trước/sau chọn: cùng ticket/offers/choice, run bắt đầu lại và choice kích hoạt lại tại2:15. Victory/Defeat vẫn đóng ticket và thưởng theo Q9B.

Preset độc lập mở tại2:14, bỏ các Draft/Elite đã qua để vào tình huống nhanh; không đọc/ghi progression thật, không có unlock production. Sau bấm Bắt đầu, khoảng1s simulation mở panel, chờ1s rồi chọn **card đầu**:

| Preset | Link |
| --- | --- |
| Fractured Storm | [Thử](https://gizgity.github.io/a-new-game/?playtest=anomaly-fracturedStorm) |
| Blood Moon | [Thử](https://gizgity.github.io/a-new-game/?playtest=anomaly-bloodMoon) |
| Volatile Ground | [Thử](https://gizgity.github.io/a-new-game/?playtest=anomaly-volatileGround) |
| Static Field | [Thử](https://gizgity.github.io/a-new-game/?playtest=anomaly-staticField) |
| Broken Seal | [Thử](https://gizgity.github.io/a-new-game/?playtest=anomaly-brokenSeal) |
| Echo Chamber | [Thử](https://gizgity.github.io/a-new-game/?playtest=anomaly-echoChamber) |

1. Touch và keyboard/mouse: đọc2card, cuộn nếu cần, chọn1; simulation dừng và không tự đánh/xả Heavy khi đóng panel. Mở Build Details xem lại trade-off.
2. Thử6cơ chế theo bảng: Storm/Ground né vòng; Blood hoàn tất Light3; Static Perfect Dodge và né tia; Seal Heavy rồi quan sát khung chống stagger; Echo melee đánh dấu2nhóm rồi bắn/Heavy kích chuỗi nối xa, rời vòng phản công.
3. Khi đông quái/Boss: player/telegraph phải còn rõ, không bị Anomaly chặn đường né combo. Nếu gặp lỗi, báo Anomaly+tình huống/thao tác+điều quan sát+thiết bị/browser.

## Delivery

Code `a489279` đã push main fast-forward. [Pages40460402265](https://github.com/gizgity/a-new-game/actions/runs/40460402265), job122043367885 completed/SUCCESS gồm build/typecheck/upload/Deploy. [Chơi Q9C](https://gizgity.github.io/a-new-game/?v=a489279). Chưa xác minh liveHTTP/hash từ môi trường; dist/hash là preview local. Commit bàn giao tiếp theo chỉMarkdown, không redeploy. Dừng **AWAITING USER PLAYTEST APPROVAL**, không Q9D.
