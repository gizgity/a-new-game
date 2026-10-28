# Q9D VFX V1.1 — production

**VISUAL APPROVED — V1.1**: user “duyệt, làm đi” ngày 2026-10-28, hội thoại hiện tại không có permalink. Approval cho [board và mockup](../vfx-art-v1/README.md), đồng thời giao production/integration. Chưa có Q9D user playtest acceptance; không ghi DDR Approved, không mở Q9E.

## Thay đổi

Đã tạo atlas production riêng bằng ImageGen, dùng đúng bốn ảnh reference đã mở: board V1.1, composite390, Q9C atlas accepted và Q7C grayscale accepted. Không crop board thành texture hoặc vẽ lại artwork bằng code. [Prompt/correction](source/PROMPT.md), [source final](source/atlas-v1.1.png), [registration](source/registration.json), [provenance/hash](source/assets.json).

Atlas RGBA1254² có alpha thật,9frames với gutter; runtime PNG giữ nguyên bytes, chỉ đăng ký frame qua metadata. Một texture khoảng6MiB decoded; pool tối đa48 Image tái sử dụng. Graphics chỉ vẽ biên damage/progress động, artwork dùng Image. Config trình bày tại `src/game/config/ascensionVfx.ts`; config gameplay giữ nguyên.

| Modifier | VFX đã tích hợp |
| --- | --- |
| Pulse | Circle đúng48worldpx, ripple bên trong và2scar nguồn bên ngoài. Rose prepare → gold imminent → ivory active0.5s; không mở rộng hitbox theo sóng. |
| Hunter | Eye crest22worldpx, tách HP/Rupture; gold warning0.8s, ivory active4s. Hai trail chips chỉ theo chuyển động chase thật, không windup/recovery/stagger. Hết trạng thái có chips tan. |
| Fracture | Fork lavender nhỏ sát contact, chỉ phát khi proc phụ thực sự gây damage; đặt cạnh Charged flash để không bị che. Hai tick rose ở chân trong penalty25s, phía trước chân nhưng không che pips. Không thêm beam/projectile. |
| Echo | Chain rim và crown tại circle52worldpx, warning1.3s; một chain snap rồi fade hình0.32s, không thêm active window hoặc hit. VFX sàn nằm dưới actor, không xóa/che Archer hoặc Boss. |

`AscensionVisual` chỉ đọc state. Impact metadata lấy từ Pulse/Echo bắt đầu hit, Hunter hết hạn và Static bonus gây damage; dùng budget24 impacts hiện hữu. Không gọi primary, cấp resource hoặc đổi root ledger. Clock dựa trên simulation, freeze theo pause/hitstop/transform; Restart/reset ẩn pool/trails; Seal0 không có hiệu ứng. Giữ damage/CD/radius/AI/Boss/progression/save/slots/input/HUD layout.

## Validation

- `npm test`:26testfiles PASS, gồm4focused VFX cases mới: trigger một lần, không phát từ warning/whiff/lethal primary, actual contact, dodged Echo vẫn có impact, unsafe cancel, freeze/reset/Hunter end.
- Typecheck/build PASS; warning Phaser chunk>500KB có sẵn.
- [Parity](evidence/parity.json):15cases Seal0–4 × none/Blood Moon/Storm. Full serialized combat state trừ presentation impacts giống compiled baselineafd084a ở mỗi300ticks, tới180s hoặc Defeat tự nhiên. Seeded Draft/combat, không cấp HP; không là balance/winrate/human acceptance.
- [Renderer](evidence/browser.json):9states ×4viewports320/390 portrait,844 landscape touch và1440 desktop; atlas thật,24quái/2windup, actual proc/Echo events khi đã ghi. PASS read-only renderer, frame/layer, pool≤48, freeze/hitstop/transform/reset, HUD lane/no overflow/no errors. Có grayscale cùng ảnh và4góc390/1440. Stack fixture cố ý inject để stress visual, không là natural encounter.
- [Input](evidence/input.json):CDP touch390 và keyboard/mouse1440 PASS Heavy hold/release, move+Basic, Charged cancel/fresh release, pause/locale/resume khi Seal4/penalty/Pulse active. Memory profile không ghi save thật.
- [Dist](evidence/dist.json):production bundle2platform PASS Legacy→Draft Mutation thứ2→Fractured Choice, vi/en/details/pause, PNG/JSON200, no errors/save isolation; lưu bundle/asset hashes. Preview local không thay liveHTTP verification.
- Chưa thiết bị thật/iOS/Safari/FPS/latency/thermal/audio hoặc human readability acceptance. Ảnh fixture không thay playtest.

## Playtest

Dùng normal progression hoặc5preset tại [checklist Q9D](../README.md). Preset có profile memory riêng, không ghi unlock thật.

1. `?playtest=seal-1`: chọn Legacy/Anomaly tại2:15; sau35s simulation quan sát2scar+ripple. Warning đổi rose→gold; đi khỏi vòng hoặc Dash trước nổ. Phải khác Storm bolt/4brackets và melee fan.
2. `?playtest=seal-2`: chạy giữ khoảng cách với cùng nhóm Grunt≥5s. Eye crest gold báo trước, ivory/trail active4s trên đúng một Hunter; không lẫn HP/Rupture pips.
3. `?playtest=seal-3`: tại1:40 chọn Static Riposte Fractured, thấy2tick rose ở chân25s. Perfect Dodge rồi Charged trong4s vào quái còn sống để thấy fork tím nhỏ tại contact; bắn hụt không có proc cue.
4. `?playtest=seal-4`: Boss fallback4:00, đánh xuống≤50% để phase2. Sau combo slam→followup, rời dấu xích/crown ở vị trí cũ trong1.3s; nổ một lần, không nhầm Pulse/Echo Chamber/Arrival.
5. Thử riêng mobile dọc/ngang và desktop: đông quái,4góc, giữ–thả attack/Dash, pause/resume/Draft; Player/cue vẫn rõ, không kẹt input. Báo Seal, bước gặp lỗi, điều quan sát và thiết bị/browser.

Tái lập: `npm test && npm run build`; dev5173 cho browser/input, preview5175 cho dist. `parity-check.mjs` dùng `BASELINE_BUILD` trỏ thư mục đã compile combat/run từafd084a; snapshot `/tmp/q9d-vfx-baseline` chỉ có trong workspace kiểm hiện tại, không là dependency production. Chromium software WebGL và Playwright có sẵn ngoài repo, không thêm dependency.

## Delivery

Code `ffd39a9` đã push main fast-forward. [Pages40629442727](https://github.com/gizgity/a-new-game/actions/runs/40629442727) completed/SUCCESS, job122622110158 gồm npmci/build/typecheck/upload/Deploy. [Chơi Q9D VFX V1.1](https://gizgity.github.io/a-new-game/?v=ffd39a9). Chưa xác minh liveHTTP/hash từ môi trường; dist/hashes là preview local. Commit bàn giao chỉMarkdown, không redeploy. **AWAITING USER PLAYTEST APPROVAL Q9D**, không Q9E hoặc DDR Approved.
