# Q9E Phase C — Elemental Trails V1

**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “duyệt 9e” ngày2026-10-28 trên code/deploy `2fcdfd2` (bàn giao `44e202f`), Pages40671706957 SUCCESS. Nguồn: hội thoại task hiện tại, không có permalink. Approval cho toàn bộ Q9E: Collection Codex, 6 Elemental Trails V1, 6 Challenges, History/Recap và UX/integrity theo DD-0003. Giữ Q9A–Q9D accepted và giới hạn coverage kỹ thuật đã ghi; không suy thêm thiết bị/browser, iOS/Safari, device FPS hoặc live HTTP/hash verification từ approval chung. Không tự mở Q10 hoặc yêu cầu duyệt lại Q9E. Lượt ghi nhận này chỉ tài liệu, không đổi runtime, balance, artwork hay progression.

**VISUAL APPROVED V1** — user “oki duyệt. làm tiếp đi” ngày2026-10-28, hội thoại hiện tại không permalink, trên proposal `a60f256`. Approval cho cả6motif và scale/hierarchy composite V1; cho phép production/integration/deploy PhaseC. **USER PLAYTEST APPROVAL Q9E đã có**, theo nguồn ở đầu tài liệu. DD-0003 giữ nguyên, không ghi DDR mới từ artwork approval.

Production source riêng ImageGen, không crop board: [PNG](source/trails-v1.png), [exact prompt/inputs/quyền](source/PROMPT.md), [registration/hash](source/registration.json), [script](register-atlas.py). RGBA1536×1024, alpha0–254,6frames/gutter≥4px trước padding, PNG runtime copied nguyên bytes. RGBglow ngoài marks có alpha0, không bake floor/halo. Runtime6MiBdecoded,1pooledImage/atlas; không thêm Graphics/shader/dependency.

## Implementation / integrity

[TrailVisual](../../../src/game/TrailVisual.ts) chỉ đọc vị trí, đuôi52×22worldpx, sau chân32px/y+10, alpha≤0.58, fade0.3s sau đứng yên; depth0.8 dưới telegraph1/body2, không đổi geometry. Một Image giữ suốt Scene, không cấp emitter/particle mỗi tick. Không đọc/ghi combat RNG/cooldown/collider/resources; cùng fixed-step presentation lifecycle hiện hữu, pause/hitstop/Boss transform freeze; kết thúc/reset/None/death/teleport không để trail cũ.

Mở khóa derive **collection.sigilWins** đã có từ transaction ticket/finishLegacy/receipt/journal PhaseA; không có unlock catalog thứ2. Một `settings.trail: SigilId|null`, allowlist và phải có Victory evidence, mặc định None; giữ qua run/refresh, metadata sai về None và giữ progression. Profile3 (PhaseA/B chưa deploy), Collection1; load schema1/2/3 không tự backfill thắng theoSigil từ totals. Summary thêm optional `trailUnlocked` để recap/history hiện lần mở mới, defeat/lần thắngtrùng không cấp lại. Xóa History không xóa win evidence. Chế độ Prism cũ giữ nguyên.

Dropdown menu vi/en có6trail +None, disabled khi locked, ngoài combat; không thêm overlay combat. Normalgame không tự trang bị trail mới. `?playtest=trail-{fire|water|lightning|ice|shadow|wind}` mở profile memory riêng, all6trail preview, SigilCore tương ứng; không đọc/ghi save thật/award/challenge production. Đây là fixture lựa chọn visual, không mở khóa progression thật.

## Validation

- `npm test`: PASS27testfiles; collection có5focusedtests gồm6Sigil unlock/equip allowlist/migration/duplicate/defeat/historyreset/corruptmetadata, cùng regression Q9A–D hiện hữu. `npm run build` gồm typecheck PASS; Phaser chunk warning có sẵn.
- [Renderer script](browser-check.mjs)/[raw](evidence/browser.json): actual PNG/Image renderer6×4viewports320/390portrait,844landscape touch emulation,1440desktop;24enemy/2windup/Q9D cue stress fixture, color +sameimagegrayscale. Full serialized combatworld trước/sauvisualstep **giống nhau**;52×22/depth/alpha đúng, oneImage/object count ổn định. Pause/hitstop/transform/stop/None/death/reset/teleport/isolation/nooverflow/noJSerrors PASS. Không đổi filecombat/balance/Boss/progression economy. Corner390/1440 cả4góc dùngEmber;6trail dùng chung footprint, chưa có screenshot từngtrail×từnggóc.
- Bounded CPU check6000idle +6000moving steps mỗiviewport: không tăng Sceneobjects (62 trongfixture); moving~2.8–6.1ms tổng trên worker. Đây chỉ CPUmicrobenchmark/softwareWebGL, **không deviceFPS/frame latency/thermal certification**. Atlasdecode6MiB; không đo GPU memory/thermal máy thật.
- [Flow](flow-check.mjs)/[raw](evidence/flow.json): productionprofilefixture unlockFire qua Victorypredicate vớiSigilFire, locked→enabled→equip→refresh, receipt khôngdouble; Defeat không mở; None/Historyreset/corruptmetadata giữevidence/core PASS touch390/desktop1440. Fixture chỉ tạo ownedFire trước run và kích BossSlain, không naturalVictory.
- [Input](input-check.mjs)/[raw](evidence/input.json): touchCDP390 +keyboard/mouse1440, trailactive cùngAnomaly/Q9D cues; Heavyhold-release, move+Basic, Chargedcancel/freshrelease, pause/vi-en/resume PASS. Giữ combat/input rules.
- [Dist](dist-check.mjs)/[raw](evidence/dist.json): builtproductionpreview2platform, equip/None/locale/refresh, PNG/JSON HTTP200 vàSHA256 khớp testedpublicassets, khôngJSerror/overflow. Không gọi preview là liveHTTPverification.
- PhaseA Codex/filter/challenges/history/recap/refresh/isolation4viewport được chạy lại trên finalcode tại [evidence](../evidence/browser.json). Static review:6motif giữidentity/palette/alpha, Player/cue nổi hơn trail, grayscale/crowd/4góc/lane phù hợp; không thay ArtBible. Chưa naturalfullrun/iOS/Safari/deviceFPS/humanfeel/audio/deviceacceptance; không tự suy useracceptance từ PASS/build/deploy.

Screenshots chính: `evidence/{sigil}-{320|390|844|1440}.png` cùng `-gray.png`; `corner-{nw|ne|sw|se}-{390|1440}.png`, unlock/dist2platform. Tất cả rendererfixture thật, tách biệt proposalcomposite PhaseB.

## Cách user playtest Q9E sau deploy

Checklist tham chiếu sau nghiệm thu; không yêu cầu thử lại.

1. Normal URL: mở Collection/filter cả4category/Seal, Challenges, History trên mobileportrait/landscape vàdesktop. Kỳ vọng29mục/catalog hiện hành, X/Y/locked/dependency vàvi/en rõ, cuộn/focus khôngkẹt, bấm Skip/Continue chơi run kế nhanh.
2. Thắng vớiSigil bất kỳ: recap hiệnbuild/unlock/challengeprogress/nextgoal, trailtươngứng mở; trangbị1trail hoặcNone, refresh/runkế giữlựa chọn; Defeat không mởtrail. History20run gầnnhất, refreshkhôngdouble; xóahistorykhôngxóachallenge/unlock. Không cần mởhết6trong1lượt thử.
3. Để xem nhanh đủ6trail mà không sửa save: `?playtest=trail-fire` (hoặc water/lightning/ice/shadow/wind), Bắtđầu→chờ1s→chọnCore, di chuyển/Dash/Heavy/Basic/Charged; pause để đổitrail/None. Kỳ vọngtrailnhỏsauchân, khônglẫnattack/telegraph, khôngchePlayerởgóc/crowd, pause/resume khôngkẹtinput. Fixture khôngtínhthànhtích/progression thật.

Checklist trên giữ làm tham chiếu cho issue sau nghiệm thu; không yêu cầu user thử lại. Phản hồi issue nếu có: trail, tình huống, thao tác, điều quan sát và thiết bị/browser. **ACCEPTED — USER PLAYTEST APPROVAL Q9E**; chờ task mới, không Q10.


## Delivery

Code/deploy **2fcdfd2** trênmain/q9e-final, [Pages40671706957](https://github.com/gizgity/a-new-game/actions/runs/40671706957) completed/SUCCESS, job122759836928: npmci/build/typecheck/upload/DeployPASS. [Chơi normal Q9E](https://gizgity.github.io/a-new-game/?v=2fcdfd2) · [PreviewFire/6trail qua dropdown](https://gizgity.github.io/a-new-game/?playtest=trail-fire&v=2fcdfd2).

Git CLIauth unavailable; dùngGitHubconnector tạo95blobSHAverified, cây `cb9adcb16c3700539ce89bf501bb6a72aa5e0ec9` **khớp100% localtested92a9146**, parenta60f256, refs fast-forward cóexpectedSHA/no-force. Không cònpush/deployblocker. Không đổi nội dung để đẩy qua phương thức khác. Workspacecheckout2fcdfd2, local92a9146 giữbackup; bàn giao sau chỉMarkdown nên khôngredeploy.

Chưa kiểm liveHTTP/hash từ môi trường; previewdist/hashes vàPagesSUCCESS không thay liveverification/devicehumanplaytest. **ACCEPTED — USER PLAYTEST APPROVAL Q9E**; chờ task mới, không Q10.
