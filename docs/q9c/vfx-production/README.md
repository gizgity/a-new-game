# Q9C — Anomaly VFX production V1

**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “đạt r” ngày2026-10-27 trên code/deploy `59b9a61` (bàn giao `3268f15`), Pages40509711771 SUCCESS. Nguồn: hội thoại task hiện tại, không có permalink. Approval cho Q9C Arena Anomalies gồm VFX V1.1; giữ approval Q9A/Q9B và giới hạn coverage kỹ thuật đã ghi, không suy thêm thiết bị/browser hoặc chốt balance config từ approval chung. Không tự mở Q9D. Visual V1.1 đã duyệt trước qua “visual ok, làm đi”; [board/mockups](../vfx-art-v1/README.md).

## Thay đổi

- Common Anomaly source signature:4ngoặc ivory gãy, biên tròn đứt đoạnrose → solidgold ở imminent, inner progress lấy từ time/duration thật. Stroke/dark under-edge giữ rõ trên crowd/grayscale. Biên vẽ đúng radius combat; brackets/glyph ở ngoài chỉ báo nguồn, không là collider.
- Storm: notch sét, bolt ngắn tại impact. Ground: khe rạn mảnh alpha/hollowcenter, plate burst ở impact và Detonate benefit. Echo:2arc lồng, source trace đứt và extra-relay foot glyph; tách motif khỏi Storm và native mint relay/Rupture.
- Blood: crescent nhỏ cùng energy fragments chỉ khi finisher thực sự thêm Charged energy, không cuegiả ởcap/whiff/CD; pursuit chips chỉ sau movement thật, không windup/stagger/idle/Boss. Static: zigzag tới target thực của Perfect Dodge; extra bullets có forked head, giữ đạn native/hitbox/speed. Seal: splitimpact khi Heavy thật đượcboost; resistance glyph ivory ở chân common, bỏ squarecyan gợi Barrier.
- [`AnomalyVisual`](../../../src/game/AnomalyVisual.ts) chỉ render và giữ pool≤96Image/movement cache; không ghi combat state. Reset/pause/hitstop/transform giữ lifecycle hiện hữu. Graphics chỉ cho dynamic circles/progress/source trace chính xác; artwork dùng PNG production mới, không procedural replacement/board crop.
- Layer artworkwarning0.96, feedback1.16 dưới enemybody≈1.2/Player2; native telegraphgraphics1 vàCharged/combat1.5 giữ priority. Extra shots1.55 giữ visible threat. Không đổi floor/actors/HUDlayout/input/camera/collider/configbalance/save/progression/DD-0001/0002.

## Assets / provenance / consistency

- [Production atlas](source/atlas-v1.png), [khe rạn riêng](source/ground-fissures-v1.png); sinh bằng ImageGen từ approved V1.1/phonecomposite và accepted Q7CCharged/Q8CArrival **đã xem và truyền ảnh thật**. Exact prompts tại [atlas](source/PROMPT.md), [fissures](source/FISSURE-PROMPT.md). Không third-party art; model/seed không được cung cấp; quyền dùng theo điều khoản dịch vụ, không khẳng định CC0/độc quyền.
- [Registration](source/registration.json), [script](register-atlas.py): alpha0–255, source1254²; gutter thực theo nguồn, không giả cell256px. MetadataPhaser đăng ký alpha bounds+2pxpadding. **Bitmap production copy nguyên byte** sang public/assets/vfx; không redraw/resample/crop bitmap hoặc concept. Atlascell`groundCracks` không dùng vì còn shard silhouette; dùng sourcekhe rạn riêng, không hạ chuẩn Bible để hợp output.
- Draft đầu bị loại khỏi integration do halo/phát sáng lan; revision làm sạch, sửa forkedshot và glyph. [Manifest](assets.json) ghi source/raw paths/hash, reference approval và giới hạn. Source16motif cells, runtime dùng15motif atlas +1sourcekhe rạn; không coi sốframe là animation mới.
- Review trước integration: motif/identity/palette phù hợpV1.1, alpha/gutters đủ, chuẩn top-down/quietobsidian/crispcluster/localhighlight. Runtime kiểm320/390dọc,844ngang,1440desktop,crowd24,prepare/imminent/impact,4góc vàsame-scene CSSgrayscale. Glyph/resistance đặt chân, không chồng HP/Rupture, centerwarninghollow giữ Player. Geometry chính xác nhờ code/state thật, không từ pixel ImageGen mockup.
- Tăng nét/bracket và alpha fissure ở native scale trong phạm vi visual đã duyệt; không đổi radius/damage/frequency/CD. Chưa iOS/Safari/thiết bị thật/FPS/latency/thermal/audio, không tự gán experience acceptance từ screenshot/softwareWebGL.

## Validation

- `npm test`:239tests PASS (236baseline +3focused visual-provenance cases: actual resourcegain/cap/CD/whiff, Static/Seal/Echo trigger và source coordinates, hazardidentity/freeze/reset).
- [`parity-check.mjs`](parity-check.mjs), [parity](evidence/parity.json):28/28run báo cáo **giống toàn bộ fields** với baseline`a489279`: result/time/HP/kills/perfects/detonations/Elite/Boss/Enraged/combo/Drafts/offer/density. [Raw](evidence/combat-smoke.json). Không tuning hoặc ép kết quả bot; bot không là human/device test.
- `npm run build` gồm typecheck: PASS; warningPhaser>500KB có sẵn. Không thêm dependencies/framework.
- [`browser-check.mjs`](browser-check.mjs), [raw](evidence/browser.json):14scenario(Storm4viewport+5Anomalykhác390/1440), actual combat triggers, poolcap/purerender state identical, native shots/forkedshots, freeze/pause/hitstop/Bosscombo/transform/reset; prepare/imminent/impact và4góc. Đây là explicit fixture, không naturalrun hoặc deviceFPS. Blood/Static snapshots lấy postcontact để thấy feedback bên cạnh primary effects hiện hữu.
- [`flow-check.mjs`](flow-check.mjs), [raw](evidence/flow.json):normal flow4viewports/run#1excluded/run#2~135s/twooffers/freeze/locale/heldHeavycancel/save-quota retry390/refreshbefore-after/HUDdetails; không bypass progression production.
- [`input-check.mjs`](input-check.mjs), [raw](evidence/input.json):390CDPtouch/1440keyboard-mouse, Heavyhold-release/move+Basic/Chargedcancel-fresh/pause-locale-resume, isolatedpreset save. Navigation timeout do chạy nhiều softwareWebGL đồng thời được kiểm lại tuần tự; không giả timeout thành PASS.
- [`dist-check.mjs`](dist-check.mjs), [raw/hashes](evidence/dist.json):production bundle390touch/1440desktop,all3VFXassetsHTTP200,2offers/HUDdetails/pause-resume/profileisolation; previewlocal không làliveHTTP/deviceacceptance. Không lặp toàn bộ tests sau chỉnh Markdown.

## User playtest

Các [6preset](../README.md#playtest) mở2:14, sau Bắt đầu~1s chọncardđầu; profile memory riêng không ghi unlock/save thật. Normalrun#2 vẫn chọn1/2tại2:15, ticket/RNG/choice giữ refresh.

| Preset VFX mới | Link |
| --- | --- |
| Fractured Storm | [Thử](https://gizgity.github.io/a-new-game/?v=59b9a61&playtest=anomaly-fracturedStorm) |
| Blood Moon | [Thử](https://gizgity.github.io/a-new-game/?v=59b9a61&playtest=anomaly-bloodMoon) |
| Volatile Ground | [Thử](https://gizgity.github.io/a-new-game/?v=59b9a61&playtest=anomaly-volatileGround) |
| Static Field | [Thử](https://gizgity.github.io/a-new-game/?v=59b9a61&playtest=anomaly-staticField) |
| Broken Seal | [Thử](https://gizgity.github.io/a-new-game/?v=59b9a61&playtest=anomaly-brokenSeal) |
| Echo Chamber | [Thử](https://gizgity.github.io/a-new-game/?v=59b9a61&playtest=anomaly-echoChamber) |

1. **Storm/Ground/Echo:** chờ khoảng5–6s simulation sau chọn để thấy hazard định kỳ; nhìn vòng gãy+4ngoặc để phân biệt nguồn với quái; khi gần impact đổi gold, rời vùng/Dash; sau nổ không còn warninggiả. Storm bolt / Ground fissure+plates / Echo arcs phải phân biệt được.
2. **Blood/Static/Seal:** Tiêu bớt Charged rồi Light3→energy fragments từ contact vềvũkhí; Perfect Dodge→zigzag vàArcherforkedshots; Heavy→sealbreak; quái sống sót mới cófootglyphresistance. Resource/trigger đúng, không hiểu nhầm làhồiHP/Barrier/đònBoss.
3. Thử touch vàkeyboard/mouse khi crowd/Boss: Player/Rupture/Charged/telegraphchính còn rõ, không cheHUD/corner hoặc kẹtinput. Báo Anomaly+tìnhhuống+quan sát+thiếtbị/browser. Acceptance kỹ thuật không thay cảm nhận user.

## Delivery

Code `59b9a61` đã push main fast-forward; [Pages40509711771](https://github.com/gizgity/a-new-game/actions/runs/40509711771), job122208075138 completed/SUCCESS (npmci/build/typecheck/upload/Deploy). [Chơi VFX V1.1](https://gizgity.github.io/a-new-game/?v=59b9a61). Chưa xác minh liveHTTP/hash từ môi trường; dist/hash đã kiểm là previewlocal, không thay liveverification. Commit bàn giao sau chỉMarkdown, không redeploy. User đã duyệt playtest qua “đạt r” ngày2026-10-27; dừng, không Q9D. Lượt ghi nhận approval chỉ Markdown, không chạy lại tests/build/deploy.
