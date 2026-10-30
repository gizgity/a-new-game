# Q13 — Full Game Completeness Audit

**Verdict: FEATURE-COMPLETE, NOT RELEASE-READY.**

Game có đủ nội dung và loop MVP được giao; chưa đủ bằng chứng để chốt public release candidate. Có **0 P0, 2 P1, 1 P2 chứng minh**, cùng **5 UNKNOWN ảnh hưởng cao**. Hai P1 là thông tin Boss sai và thiếu cách Perfect Dodge trong hướng dẫn desktop; không phải đề nghị thêm mechanics. Packaging vẫn là prototype. Compatibility/performance thiết bị thật, natural Victory, first-time playtest/balance và live release verification còn thiếu. Tests PASS không thay các xác minh này.

## Baseline và giới hạn scope

- Ngày 2026-10-30 UTC, repo `gizgity/a-new-game`, HEAD audit **`0472c4af6240f0afabbff959eefd27118a4144ce`**, latest `origin/main` sau fetch; branch tài liệu `q13-audit`. Worktree lúc vào sạch, branch cũ `work` tại08d7a11; runtime latest vẫn0859d08. Commit0472c4a chỉ ghi nhận Q12E accepted.
- Đọc AGENTS/HANDOFF, handoff skill, GAME_BRIEF/ART_BIBLE/DESIGN_DECISIONS, art-reference, Q7B/C/D, Q8A–D, Q9A–E/production và Q12A–E/INTEGRATION; rà src/public, package/build/workflow/tests. Doc lịch sử có số Boss1500/450kills/Glass75 và gate cũ; ưu tiên config hiện hành + approval mới. Không tự sửa doc lịch sử hoặc coi các số cũ là regression runtime.
- Giữ Q12A–E **accepted**, Arrival gốc Q8C, music V2 156BPM và Phase C Draft/hitstop continuity, Q9 content/art, mobile-first + desktop-equivalent. Q12B ngoại lệ legacy hitstop đã duyệt giữ nguyên. Gate balance50% và Auto Aim desktop playtest riêng còn nguyên; không mở lại approval accepted.
- Chỉ ghi `docs/q13/` và HANDOFF tối thiểu. Không source/assets/config/DDR, không thay RNG/tuning, không deploy/merge/Q14/Q15. Các recommendation chỉ để user xem xét.

## Ma trận 10 domain

PASS có phạm vi ghi bên cạnh; toàn domain nhiều trường hợp không được kiểm hết. N/A áp dụng phép đo không thích hợp (acoustic listening trong headless), không dùng để che thiếu coverage.

| Domain | Intended / acceptance | Actual + code refs (root) | Evidence ở HEAD / lịch sử | Status / severity | Cần xác minh còn lại |
| --- | --- | --- | --- | --- | --- |
| A Gameplay & Combat | GAME_BRIEF combat/Q8C, DD-0002; 5phút, mutual kill thắng trước deadline, tradeoffs thật | `src/game/combat.ts:187` buffer; `:355` Dash/cancel, `:392` Charged; `src/game/run.ts:97` transform/draft/result; `src/game/LegacyEffects.ts:1`, `BuildEffects.ts:1`, `AnomalyEffects.ts:1`, `AscensionEffects.ts:1` tách trách nhiệm | HEAD32testfiles gồm combo/fire/Heavy/Perfect/Surge/chain/target/collision/miss/hold/cancel/Boss/branch/curse/anomaly/seal; Q13-004. Bot balance lịch sử không rerun | **PASS** logic được test; **UNKNOWN** feel/crowd/human balance, Q13-008/009/010 | Natural Victory/Boss đầy đủ; user gate50% riêng; không rebalance |
| B Art/Animation/VFX | ART_BIBLE P0–P3, Q7C scale/poses, accepted Q8C/Q9 VFX | `src/game/ActorArt.ts:7` heights40/36/38/36/50/76; `ActorPose.ts:1` state poses; `EnemySprites.ts:19` death pool8; `BossArrival.ts:1`, `AnomalyVisual.ts:1`, `AscensionVisual.ts:1`, `TrailVisual.ts:1` | Mở ảnh renderer accepted `../q7c/runtime/after-crowd-390.png`; Q8C/Q9 production evidence trong art-reference; HEAD Settings4viewport có texture/floor/HUD không pageerror | **PASS** asset/load/silhouette baseline hữu hạn; **UNKNOWN** full bright-stack/motion mọi build ở HEAD | Crowd+Boss/Seal/trail trên thiết bị thật, không tạo/replace art |
| C UI/HUD | Q7B HUD V3 và follow-up mobile accepted; resource thật, vi/en, lane riêng | `src/ui/CombatHUD.ts:94` HP/Barrier, `:100` resource/cooldown/charges (không stamina giả); `src/main.ts:68` panels, `:155` help | HEAD native slider geometry≥44px/vi-en/reload/menu→play→pause4viewport PASS; lịch sử Q9E recap/codex/history | **FAIL P1** Q13-001; phần Settings **PASS**, full accessibility **UNKNOWN** | Overflow từng card dài/corners/crowd, keyboard focus/screen reader toàn flow chưa mới |
| D Onboarding | Khám phá move/attack/roles/Rupture→Detonate/Perfect/Charged/drafts/Boss/lý do end | `src/i18n.ts:210` desktop, `:211` touch; `src/main.ts:155` chọn body; `CombatHUD.ts:115` feedback, CollectionPanels cho build/status | CODE chứng minh text; Q13-001/002; touch có giải thích Perfect, desktop không có; vi desktop thiếu giải thích nguồn ammo mà en có | **FAIL P1** hai finding; **UNKNOWN** human learnability | Confirmed missing≠players confused. Help dài/thuật ngữ chỉ là nguy cơ, cần first-time observation |
| E Flow/Replayability | Menu→encounter→6draft→anomaly(run2+)→Boss→result→recap→replay; Q9B–E dedup/unlocks | `src/main.ts:353` run ticket/start, `:385` settle, `:449` continue/save guard; `src/game/collection.ts:29` history/reward; `legacy.ts:1` roll/pity | Tests run/rewards/collection PASS ở HEAD; natural Q13 Defeat32.133s/104kills/result/history/replay100HP PASS, chưa Boss/Anomaly; TEST-MATRIX; lịch sử Q9E production flow có refresh/unlock/dedup | **PASS** tested pieces; **UNKNOWN** complete natural Victory Q13-009 | Nhiều build 6Sigil/12Branch/8Curse/4Mutation slots, Anomaly/Ascension đã có; không suy retention/human engagement từ số lượng |
| F Audio/Music | Q12A–E accepted, Q8C Arrival, V2/B156BPM, Phase C continuity | `src/game/config/audio.ts:3` cap/priority; `AdaptiveMusic.ts:12` exact grid, `:86` load fallback, `:198` destroy; `ArenaScene.ts:342` phase policy | HEAD Settings/gains/mute/duck/cache/cleanup4viewport và priority Enraged24crowd PASS; focused unit files PASS; continuity/waveform/export lịch sử Q12D/Q12E | **PASS** checks mới; **UNKNOWN** device unlock/background; acoustic assessment mới **N/A** headless | Không đổi mix/composition. Không biến acceptance thành gate mới; xem Q13-007 |
| G Mobile | 320/390portrait,844landscape; controls đồng thời/rotation/mapping/visibility | `src/ui/TouchControls.ts:48` media/cancel/gesture, `:80` sample, `:103` reset; `ArenaScene.ts:239` blur/resize | HEAD touch-emulated Settings3viewport PASS; input/movement rerun ghi trong TEST-MATRIX; lịch sử Q12B rotate/crowd/corners | **PASS** smoke hữu hạn; **UNKNOWN** real iOS/Android/WebKit/perf/thermal | Q13-007/008; emulation không là smartphone |
| H Desktop | 1440, fine pointer, WASD/mouse/Shift/E/Space/Q; cùng độ sâu gameplay | `ArenaScene.ts:110` keyboard/mouse, `:156` render-matrix restore, `:239` focus; `style.css:1` desktop layout | HEAD1440 native keyboard sliders/menu/pause PASS; natural keyboard/mouse; lịch sử mapping/resize/crowd | **FAIL P1** help Perfect; **PASS** smoke; **UNKNOWN** Firefox/perf | Kiểm focus-loss + simultaneous actions/resize theo matrix, không suy từ boot |
| I Save/Reliability | Q9B–E tickets/receipts/journal/idempotency, v1→v3, safe defaults | `progression.ts:27`, `:53`, `:68`; `legacy.ts:34`; `collection.ts:17`; `ArenaScene.ts:176` unregister game/resize listeners | HEADtests isolated memory PASS; disposable browser slider persistence PASS; lịch sử Q9B failure injection/refresh | **PASS** Q13-006; **UNKNOWN** device restrictions/crash timing ngoài test | Không cloud backup; local-only là baseline. Touch listeners sống theo app lifetime, không thấy chứng cứ restart tạo duplicate app listeners |
| J Performance/Release | Free-tier/KISS, bounded resources, public packaging/hosting/recovery | `vite.config.ts:4` base; `.github/workflows/pages.yml:28` npmci/build/deploy; AdaptiveMusic cleanup; music codec fallback; metadata prototype | HEAD build/typecheckPASS, large chunk warning; dist16MiB/publicassets14MiB; priority shutdown ownednodes0; provenance art-reference/Q12D source | **FAIL P2** Q13-003; **UNKNOWN** Q13-007/008/011 | Chưa measured device frame-time/RSS/repeated natural runs; chưa livehash/rollback; không gọi warning chunk là proven FPS defect |

## Điểm mạnh đã chứng minh

Combat không chỉ là placeholder: có bounded buffering, hit-on-contact/miss/cancel, swept collisions, phản công và build tradeoffs được test; encounter/draft/deadline điều phối riêng. Nội dung Q9, Codex/Challenges/History/recap/trails và reward idempotency đã triển khai, không cần milestone content mới để lấp checklist. Art source/runtime có provenance và approved renderer; actor/floor/telegraph không bị thay bằng artwork audit. Audio có buses thật, fallback WAV, lifecycle cleanup, cue priority/budget và music continuity accepted.

## Khoảng trống quyết định public RC

Q13-001/002 cần user cho phép sửa lời hướng dẫn; Q13-003 cần lựa chọn packaging, không dùng codename công khai. Những phần UNKNOWN cần kiểm nhỏ, có mục tiêu; không buộc làm test framework hoặc thêm backend. Xem [FINDINGS](FINDINGS.md) cho từng ID/evidence/độ tin cậy/khuyến nghị/effort và [ROADMAP](ROADMAP.md) cho thứ tự.

## Phân biệt mức hoàn thiện

| Trục | Kết luận |
| --- | --- |
| Content completeness | Đủ scope MVP hiện hành; không phát hiện mechanic/content bắt buộc chưa implement |
| Technical correctness | Build/typecheck và32testfiles PASS; smoke/cleanup hữu hạn PASS, không bảo đảm toàn game |
| UX quality | Hai khoảng trống hướng dẫn chứng minh; first-time learnability chưa quan sát |
| Performance/compatibility | Browser emulation có coverage; mobile thật/Safari/thermal/frame-time chưa đủ |
| Human playtest confidence | Approval Q9/Q12 giữ nguyên; balance50% và người mới cần xác minh riêng, không có HUMAN mới Q13 |
| Release packaging | Prototype labels/version, live artifact/rollback verification chưa chốt cho RC |

Không thể gọi RELEASE-READY hoặc RC READY chỉ dựa build/tests và approval milestone. Verdict không hủy acceptance cũ, không khẳng định game thiếu feature hoặc chắc chắn lỗi trên Safari.

**Q13 AUDIT COMPLETE — AWAITING USER REVIEW**
