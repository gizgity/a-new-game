# Q7B — HUD & Combat Readability

**HIỆN HÀNH: ACCEPTED — USER PLAYTEST APPROVAL**. User xác nhận “q7b đã đạt” ngày2026-10-26 trên bản5ee970e. Pages40292060536 SUCCESS. Concept đã duyệt trước qua “approved làm đi”; các gate/evidence bên dưới là lịch sử. Xem [implementation/checks/cách thử](IMPLEMENTATION.md),[renderer trước–sau](index.html),[runtime assets](runtime-assets.json). User đã phản hồi HUD che arena và yêu cầu sửa controls/auto aim/draft lock; [HUD frame/icon-only hiện hành](HUD_V3.md), [snapshot vòng trước](REVISION.md). Balance/effects/sàn Q7A giữ nguyên, canvas/touch interaction có ngoại lệ theo user.

---

## Snapshot design / visual gate trước approval

Phần dưới giữ audit/concept trên main21f2c55, những câu chờvisual/chưaimplementation phản ánh checkpoint trước và được status hiện hành phía trên supersede.

**AWAITING VISUAL APPROVAL — chưa implementation.** Ngày2026-10-26 (Asia/Saigon). Audit main `21f2c55b847dbf4842215ca25059252eb7d85cad`; Q7B trước đây chỉ là tên task chờ scope, không có contract/implementation khác. Q7A, Q2–Q6 và draft đầu4hướng accepted; Q1 chưa có approval riêng.

[Design Contract](../../GAME_BRIEF.md#q7b-design-contract--hud--combat-readability) · [Review board](index.html) · [Exact prompts](PROMPTS.md) · [Provenance/hash](manifest.json).

## Bốn deliverables

| Hình | Vai trò / giới hạn |
| --- | --- |
| [Desktop V1](artwork/hud-desktop-v1.png) | Gom vitals trái trên/build phải trên,4resources sát rìa; giảm cột prose. HP trong ảnh vẫn có khấc do ImageGen: contract yêu cầu HP liên tục |
| [Portrait V2](artwork/hud-mobile-v2.png) | Card HP/Barrier riêng, summary4M/2C, một hàng warning;6nút ở vùng dưới. Đây là hướng chính cho mobile; chưa chứng minh pixel-fit320 |
| [Crowd + Feedback V1](artwork/crowd-feedback-v1.png) | Cảnh đông + bốn thời điểm trúng đòn/heal/break/Perfect; proc gắn icon, một notice. ImageGen có làm lệch nút ở phone inset; không dùng inset này làm layout controls |
| [Before/After V1](artwork/before-after-v1.png) | Sheet giải thích hierarchy/contrast; cả sheet được ImageGen sinh, không là phép so runtime. Board còn đặt PNG baseline nguyên gốc cạnh concept V2 để đối chiếu thật |

Portrait V1 giữ lịch sử iteration; cảnh báo chữ ngoại ngữ sai đã superseded bằng V2 (“HP THẤP · HẾT LƯỚT”). Không gán ART APPROVED cho output thành công.

## Audit code: giữ và cải thiện

| Phần | Đã tốt / giữ | Thiếu hoặc gây nhiễu / đề xuất |
| --- | --- | --- |
| Main UI / renderCombatHUD | HP/maxHP/Barrier, resource counts,6milestones,4Mutation/2Curse,locale đều có state thật; Pause/Draft/Results đã hoạt động | Health/Barrier cùng bar style, nhiều rows cùng weight; build/status prose mỗi render, curse innerHTML tái dựng; chuyển grouping/icon/cache-on-change sau approval |
| CSS | Safe-area/dvh,portrait204px controls reserve,landscape layout,min44px,overlay cuộn,pointer-events:none cho text | HUD không có backing đủ đặc, font9–11 nhỏ, build ellipsis, long status tăng chiều cao; giới hạn bounds, opacity nền/spacing, chữ/số phân cấp |
| TouchControls |6actions và aim joystick, pointercapture, release-only Heavy/Charged, aria-disabled không phá pointer | Heavy có wait khi0,Dash chỉ count,Charged chỉ ammo,Surge%; đề xuất readout bổ sung timer/point thật, available/cooldown shape. Không thay bind/sample/release/gesture |
| i18n |vi/en dictionary đơn giản,t(id)/t(idDesc),slot/resource/risk/feedback keys có sẵn | Thêm key presentation cho readiness,build/details,notice nếu thiếu; không hardcode chữ trong UI hoặc embed text vào artwork icon |
| PlayerVisual / ArenaScene |Hurt tint/ring,Perfect glyph,Barrier segments,player/attack poses có sẵn,enemy cue đúng geometry | Giữ tất cả baseline; làm feedback rõ ở HUD trước, không sửa Q1 sprite/pose hoặc Q2/Q3 timing |
| BuildVisual / BarrierVisual |HealFlash,lastHeal,timers,pips,hazard/slow/fracture,barrier.broken/flash có cue | Đang thiếu hierarchy HUD: mọi cooldown/risk thành chuỗi text; chuyển trạng thái quan trọng sang icon/card,details cho mô tả dài; không bắn toast mỗi tick |
| Feedback notice hiện tại |Perfect/Heavy/combo được dịch và lấy từ state | Notice dựa cờ level chưa là queue; không notification riêng cho hurt/heal/break, risk lẫn với proc; đề xuất snapshot transitions/bounded notices bên UI |
| Build/details |Tên4Mutation và2Curse có trong HUD; draft mô tả effects/risk | HUD names bị cắt ởphone; không có interactive details, text pointer-events:none. Đề xuất1summary≥44px mở panel qua pause/reset input hiện có |

Đã đọc AGENTS/handoff skill/HANDOFF/GAME_BRIEF và main.ts/style.css/i18n/TouchControls/PlayerVisual/BuildVisual/BarrierVisual/ArenaScene; đối chiếu BuildEffects/barrier state. Rà docs Q3/Q4/Grunt/Q5audit+A–E/tank/pressure/post-Q5A/Q6/Q7A và references hiện hành; repo không có README root. Những README evidence cũ là lịch sử, không đổi số/approval theo thiết kế Q7B chưa triển khai.

## Baseline hiện hành

Ảnh chụp **renderer thật từ source21f2c55**, không ImageGen: baseline/crowd-full-build-{1440,390,320,844}.png và feedback-390.png. Browser fixture grant4Mutation (Phantom/Static/Reversal/Battery),2Curse (Ghost/Oath),HP22/100,Barrier30,Dash0/recharge1.4,Charged0+2points,Heavy0/recharge2.6,Surge100 và timers. Crowd33enemy/Charged blast từ fixture Q7A; feedback snapshot có flags heal/break/Perfect. Không natural acquisition/run hoặc human approval.

[Audit raw](baseline/audit.json): pageerrors0/overflowfalse ở4viewports. Chỉ xác nhận baseline và bounds HUD; không là tests cho UI mới.

| Viewport | HUD box hiện tại | Canvas | Nhận xét |
| --- | --- | --- | --- |
| 390×844 |348×198.5 tại(21,105) |372×570 |Chuỗi status kéo xuống vùng enemy/đạn, tênMutation bị ellipsis |
| 320×740 |278×213.5 tại(21,105) |302×466 |HUD cao hơn do wrap; không tràn document nhưng vẫn cạnh tranh combat |
| 1440×900 |200×352.5 tại(61,186) |1374×734 |Cột dài, trạng thái critical/proc/passive ngang cấp; vùng center vẫn thoáng |
| 844×390 |600×157.5 tại(21,89) |826×332 |Chiếm nhiều chiều cao ởlandscape, cần thử Boss/controls kỹ sau approval |

Các số là bounding box fixture ở thời điểm đó, không tỷ lệ pixel opaque. Target128px portrait/104px landscape là **mục tiêu thiết kế**, chưa đo implementation và không bảo đảm bằng ảnh ImageGen.

## Nguồn / quyền dùng / sai lệch

- 5PNG concept tạo thật bằng ImageGen có sẵn, không cài paid API/service/dependency; source outputs giữ /workspace/generated_images và copy vào artwork. Model/seed không được tool cung cấp. Inputs chỉ screenshot repo/ảnh sinh trong phiên; không third-party reference.
- Quyền dùng generated output theo điều khoản dịch vụ áp dụng, không khẳng định CC0/độc quyền/license runtime. Đây là **concept-review-only**, không import toàn ảnh vào HUD. Sau approval mới chuẩn bị icon SVG/PNG/WebP có chủ đích, không phụ thuộc dịch vụ lúc chạy.
- All prompts/inputs tại PROMPTS; manifest phân loại renderer baseline/generated concept, dimensions/bytes/SHA256 và hash floor Q7A. Floor runtime không đổi: `71b8d5b2b0850d40cd7c39a795a8caee129e4b14dc7f08f20093d17c18fea70a`.
- ImageGen có đổi aspect/scale/spacing, glyphID củaMutation/Curse, typography/locale, HPkhấc, vị trí/actiongroup ởcrowd inset. Symbol chỉ là direction, không map sai itemID/benefit. PortraitV2 + contract là hướngmobile; **controls/hit areas/core hiện hành ưu tiên hơn ảnh**. Không tự đổi camera/floor/sprite/threat để khớp mockup.
- Before/after generated sheet có thể tái vẽ cả phần BEFORE; baseline PNG bên cạnh trong HTML giữ nguyên mới là nguồn đối chiếu. Checkbox grayscale trên cùng ảnh là CSS filter; các hình chưa được dùng để tự accepted chất lượng.

## File dự kiến sau approval

- main.ts: markup/wiring/read-only HUD,build details/notice lifecycle; style.css: grouping/responsive/states; i18n.ts: đủvi/en.
- TouchControls.ts: chỉ updateResources/translate/decoration nếu cần thông tin hiển thị; không bind/sample/release changes. Có thể1CombatHUD.ts để main không phình, không framework.
- public/assets/ui: icon/decoration tối giản đã chốt. PlayerVisual/BuildVisual/BarrierVisual/ArenaScene là nguồn đối chiếu; không dự kiến rework; Q7A floor nguyên hash.
- Lượt hiện tại chỉ docs/artwork/baseline capture; **src/public/tests/package/workflow không đổi**. Kiểm10PNG headers/dimensions/hash và liên kết tài liệu/diff PASS; board browser390/1440 image-load/grayscale/no-overflow/no-pageerror PASS (chỉ trang review, không HUD mới). Chưa chạy build/test cho design milestone. Sau implementation mới focused checks/typecheck/build/real screenshots/perf/deploy và AWAITING USER PLAYTEST APPROVAL.

## Acceptance và câu hỏi review

Contract có8scenario: lowHP+Barrierfull/broken;0/1/full resource+cooldown/points;4Mutation+2Curse+details vi/en;crowd+Perfect/synergy+bounded feedback;Elite/Boss cues;320/390/1440/landscape/tablet+controls;Draft/Pause/Victory/Defeat;reset/perf/no-regression. Chưa có scenario nào được chứng minh cho HUD mới.

User duyệt: (1)grouping HP/Barrier và build summary; (2)readiness/cooldown ởresources/nút hiện có; (3)panel details mở qua pause; (4)feedback ngắn/icon-linked thay prose. Nếu cần đổi, chỉ tên hình/vùng. Không yêu cầu chơi lại Q2–Q7A ở lượt concept này.

**Dừng AWAITING VISUAL APPROVAL. Không sửa HUD production, không tự mở Q7C.**
