> Q8B: thông số milestones OR cũ trong tài liệu này là **SUPERSEDED**; giữ làm lịch sử/evidence/approval. Quy tắc hiện hành: [GAME_BRIEF](../../GAME_BRIEF.md#run-tối-đa-5-phút), [audit Q8B](../q8b/README.md). Spawn Q8A và approvals giữ nguyên.

# Q7C — Character & Enemy Art runtime

> Đồng bộ Q8 (2026-10-26): [Q8A hiện hành](../q8a/README.md) thay thế mô tả spawn/cadence/soft cap và pressure không trần trong note cũ; giữ evidence/approval lịch sử. Milestones/Boss vẫn theo Q7D trong Q8A. Gate cũ dừng trước Q8 đã superseded bởi yêu cầu user; chỉ Q8A mở, Q8B–D chờ duyệt tuần tự.

**ACCEPTED — USER PLAYTEST APPROVAL** — User xác nhận “duyệt q7c đạt” ngày2026-10-26 trên bản đã deploy2ef6d48 (code0041064, docs5f3e938), Pages40305977315 SUCCESS. Đây là user playtest approval, không suy ra từ build/tests/fixture. Visual approval trước đó: “visual approved q7c”. Q7D được giao riêng sau approval này; xem [Q7D](../q7d/README.md).

## Deployment

Code0041064, bản deploy2ef6d48180b4873198dd666627771296f4b4837b; [Pages40305977315](https://github.com/gizgity/a-new-game/actions/runs/40305977315), job121515051426 completed/success gồm bướcDeploy. URL https://gizgity.github.io/a-new-game/?v=2ef6d48 . Livecurl bịproxy CONNECT403 (HTTP000), không giả local/dist làlive. Không đổi runtime saudeploy; commitbàn giao chỉMarkdown.

## Thay đổi

- Player,Grunt,Archer,Volatile,Bulwark,ChainWarden dùng sprite atlasPNG, không Graphics body. Source production sinh riêng bằng ImageGen sau approval,4facing/7pose mỗi actor, Player8actions và Boss9patternposes mỗi hướng. Tổng236frames; không cắt conceptboard thành runtimeasset. Q7A reference chính, sourceconcept/research/approval giữ lịch sử.
- `ActorPose.ts` chỉ chọn facing/pose từ state thật. Body3/4 không xoay phẳng360°. Idle có breathing/bob, walk hai pose theo quãng đường, windup co/lấy đà theo tiến trình, attack/recovery/shot/hit/death theo state. Player L1/L2/L3/Heavy/Basic/Charged/Dash/exit có pose riêng; Boss sweep/ring/slam riêngwindup/attack/recovery. Đây là pose-key animation+transforms, không phải25framehanddrawn mỗi action như budget sơ bộ trong spec cũ.
- `EnemySprites.ts` giữ Image theo actorID, reuse khi mất actor; death8image pool/0.28s simulation, chỉ khi coreobjecthp≤0 (không làm deathgiả khiBoss dọncommon). Không giữ collider/target/AI/reward. Player giữ6dash echoes/0.22s,cadence0.033s,tintmint/layer quan hệ cũ; silhouette echo theoart mới. Reset dọnactor/death/echo, không stale IDs.
- Clock/stride/recoil/death chỉ step khi simulation không hitstop; pause/draft đứng nguyên. Selection/render không tạo gameplay timer/resource/damage. Volatile không có recovery sống; source aftermath chỉ dành death, unit test kiểm actor bịremove đúng fuse.
- `EnemyVisual.ts` chỉ giữ telegraph/status. Telegraph nguyênbytewise; Rupture/HPbar/recoverymarks giữ hình/màu/vịtrí/transform cũ. `PlayerVisual.ts` giữ nguyênbytewise drawSlash và thuật toán muzzle/SFX pipeline. `ArenaScene.ts` tách grounddepth1 → body1.2 → status/projectiles/impacts1.5,echo1.7,slash1.8,player2,muzzle2.2,reticle3 để dynamic cues/effects giữ quan hệ với body mới.
- `combat.ts`,movement,run,AI,configbalance,BuildEffects,chargedVfx,controls/input/HUD/i18n/style,floorQ7A,Vitebase và workflow không đổi. Không newframework/dependencygame. Bốn hướng body là approximation của art; reticle,weaponVFX/projectiles và damage aim vẫn liên tục theo input thật, không snap gameplayaim.

## Asset pipeline / chi phí

[Sources/prompts](source/PROMPTS.md), [hashes/registration](runtime-assets.json), `tools/build-actor-atlas.py`. Offline packing chỉ lọc alpharời (threshold192/min32px), normalize theo scale hàng, đăng ký chân, nearest resize và trim transparentpadding với Phaser metadata. Không vẽ body/procedural engine. RawPNG giữ nguyên. Pillow/numpy/scipy chỉ dùng workspace tái đóng atlas, không dependency lúc build/deploy hoặc runtime.

Atlas cuối1024×1024,236frames,990873bytesPNG (~0.99MB),decodedRGBA4194304bytes(4MiB). Một texture, không allocate/destroytexture mỗiframe. Frame logicalboxes player96/common80/volatile64/bulwark96/boss192 để chứaweapon; trim tránh drawtransparentpadding, pivot giữ bằngsourceSize/spriteSourceSize. Bodyheight40/36/38/36/50/76worldpx; collider16/common14/Bulwark22/Boss32 giữ nguyên. OldSVG giữ nhưsource lịch sử, không còn preload.

Initial atlas2048square có nhiều transparentpadding và headlessdesktop rAF66.6ms. Đã trim/pack còn1024square,rerun5sizes, desktop49.9ms so baseline50.1ms; chi tiết [performance](runtime/performance.json). Đây là kiểm rendering softwareWebGL, không khẳng định FPS thiết bị thật.

## Validation

- `npm run build` PASS (gồm typecheck); `npm test`163PASS/0fail (159baseline+4focused art). Newtests: hitflash không chewindup/active, playerrelease trùng damage tick và đứng qua hitstop, Volatile không livingrecovery, atlas đủ tấtcảfacing/state/actionfamily. WarningPhaserbundle>500KB có sẵn.
- Renderer thật5viewports320×740/390×844/844×390/768×1024/1440×900:33enemyfixture,đủrole,3Rupture slots,realtelegraph,grayscale,Chargedblastthật và Boss3patterns. Khôngpageerrors/requesterrors/overflow; cameras/zoom khớpbaseline. Before/after dùngcùngfixture tronglocaldev, freeze quaPhaser sys.sceneUpdate, không naturalrun. Harness lần đầu override sai instance.update nênảnh bịsimulationtrôi; đã bỏ vàchụplạibefore/after saufix, không dùng lượt sai.
- [Animation/input](runtime/animation-input.json): bodykeys idle/windup/attack/recovery/hit/death vàPlayeractions; pose flags làfixture injected, không bảo đảm naturalanimationsequence từ ảnhđơn. Coretests kiểm timeline thật. Pause freeze PASS;20restart displaylist29→29, không staleghost/death. CDPtouch thậtmove+shoot390/844 vàmouse/WASD1440 PASS,vi/en/Pause/resume. Volatile recovery fixture chỉ kiểmassetkey, không là state sống tronggame.
- [Dist smoke](runtime/dist-smoke.json):5sizes,atlasđượcfetch,Heavy giữ2/2→thả1/2 trên4touchsizes,desktopShiftrelease,Pause/vi-en/resume,noerrors/overflow. Đây làinput thật tronglocaldist, không grantstats, chỉopeningngắn.
- [Frozenperf](runtime/performance.json):60CPUdrawsamples+90rAF/scene. CPUdraw medianbaseline0.3–0.4ms→~0.1ms ở5sizes; resolutiontimerthô, không hiểu làbenchmarkanimation/coretick. rAF39033.3→16.7,32016.7→16.7,84433.3→16.7,76833.3→33.3,144050.1→49.9ms. Sequential headless/softwareWebGL cónoise, chưabenchmarkphoneGPU,nhiệt/loadmạng thật.
- Source/runtimesPNG/hash/integrity,atlasnames/rectbounds,protected-filediff vàdocslinks kiểm riêng. Coverage kỹ thuật chưa gồm Safari/iOS/thiết bị thật/full-run; approval Q7C nay đến từ xác nhận của user, không phải suy luận từ fixture hoặc kiểm thêm mọi thiết bị.

## Hình before/after thật

[Before390](runtime/before-crowd-390.png) → [After390](runtime/after-crowd-390.png), [Before1440](runtime/before-crowd-1440.png) → [After1440](runtime/after-crowd-1440.png). [Grayscale390](runtime/after-grayscale-390.png), [Charged390](runtime/after-charged-390.png), [Boss sweep](runtime/after-boss-0-390.png)/[ring](runtime/after-boss-1-390.png)/[slam](runtime/after-boss-2-390.png), [atlaspose inspection](runtime/atlas-inspection.png). Ảnh này làrendererfixturethật; `evidence/` và `artwork/` cũ làconceptreview, không đổi nhãn thànhruntime.

## Playtest scope — user đã ACCEPTED (giữ hướng dẫn tham chiếu)

Mở https://gizgity.github.io/a-new-game/ và reload bảnmới sau deploy. Dọc/ngangphone hoặcdesktop:

1. Opening: di chuyển theo4hướng, giữChém/Bắn, giữ-thảHeavy/Charged vàDash. DesktopWASD+chuột,Shift/Egiữ-thả,Space. MongđợiPlayer nhìn rõ ngay, pose/hướng không giật/cắt/mấtweapon, đòn/cue/input vẫn cảmgiácđãduyệt.
2. Grunt/Archer/Volatile trongcrowd: mask/móc,cung/mũ và5shards khácnhau; đọcwindup/attack/recovery giữaRupture/Charged, sprite không chewarningquantrọng. Volatile nổ rồi biếnmất, không đứng hồi.
3. Bulwark tại200kills HOẶC2:30: giáp/khiênđóng khác lõi mởrecovery, vẫn đọc được thờiđiểmphảncông. Boss tại450kills HOẶC4:00: sweepvungxích/ringmởtay/slamgiángxuống phânbiệt; giữnhịptelegraph cũ. Không yêu cầu duyệt lại balanceQ2–Q7B.
4. Pause/resume/restart: animationkhôngtrôiquaPause, khôngghost/deathcũ; chúýđộmượt/nóngmáy khiđôngquái. Phản hồi nhânvật/state/tìnhhuống bịchìm/saihướng/giật,thiếtbị/browser. Build/tests không thayuserplaytestapproval.

Q7C đã **ACCEPTED — USER PLAYTEST APPROVAL**; approval checkpoint này giữ nguyên; user đã giao [Q7D](../q7d/README.md).
