# Q7C — Character & Enemy Art Overhaul

**VISUAL APPROVED** — user “visual approved q7c”2026-10-26 sau research góc nhìn. Đã triển khai và deploy2ef6d48, Pages40305977315 SUCCESS; **AWAITING PLAYTEST APPROVAL**, chưa runtimeACCEPTED. Q7D = Full Run Polish, chưa mở. Q2–Q7B giữ approval lịch sử, không đòi duyệt lại.

[Chơi bản Q7C](https://gizgity.github.io/a-new-game/?v=2ef6d48) · [Implementation/checks/cách playtest](IMPLEMENTATION.md) · [Board before/after](index.html) · [Source production/prompts](source/PROMPTS.md) · [Runtime asset/provenance](runtime-assets.json) · [Research góc nhìn](VIEW_RESEARCH.md) · [Asset specification](ASSET_SPEC.md).

Sixroles: Player mint/ivory P0; Grunt hookedmask rose; Archer hood/bow violet; Volatile5shardsamber; Bulwark blueplate/shield; ChainWarden crown/thânrỗng/xích bronze tiết chế. Reference chính là ảnh user Q7A Visual Hierarchy / Contrast StudyV1 và bản gốc `../q7a/artwork/contrast-palette-v1.png`. GiữP0player/threat→P1roles/projectile→P2mark/field→P3floor. Không importconceptboard vào spriteatlas.

Runtime dùngsourceImageGenproduction riêng,236frames/4facings,atlas1024square/4MiBdecoded. Pose đọcstate simulation, không rotatehumanoidphẳng360°. Giữfloor/camera/collider/AI/damage/timing/telegraph/VFX/controls/HUD/gameplay. OldSVG/ảnhconcept giữlịch sử. Volatilekhônglivingrecovery; deathvisual không giữbodycollision/reward.

[Before390](runtime/before-crowd-390.png) / [After390](runtime/after-crowd-390.png) · [Grayscale](runtime/after-grayscale-390.png) · [Chargedblast](runtime/after-charged-390.png) · [Desktop](runtime/after-crowd-1440.png) · [Boss3patterns](IMPLEMENTATION.md#hình-beforeafter-thật). Đây làrendererfixturethật, không naturalrun. `evidence/`,`artwork/`,[conceptmanifest](manifest.json),[conceptprompts](PROMPTS.md) làarchivevisualreview; các dòng chờgate trongsnapshot cũ đã đượcuserapproval supersede.

Auditbaseline: fetchedmain78f07e6(runtime5ee970eQ7Baccepted), auditd747f49; review7a1db73,research2bb4792; đã merge main87c1ca8 trong3c940dd và ghiuserapproval. Giữmain/remotehistory, khôngforce. SànQ7AWebP giữhash71b8d5b2b0850d40cd7c39a795a8caee129e4b14dc7f08f20093d17c18fea70a.

Build/typecheck163tests vàfocusedbrowser/distPASS; mọi giới hạn/ảnh/perf tạiIMPLEMENTATION. Chưa device/iOS/Safari/fullrun hoặc runtimeapproval. Saudeploy:user thửđọcpose/hướng/telegraph vàđộmượt trênmáythật. Báonhânvật/state/bướcgặplỗi+thiếtbị/browser. Không tựQ7D.
