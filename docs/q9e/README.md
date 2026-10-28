# Q9E — Final Design & Implementation

**ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “duyệt 9e” ngày2026-10-28 trên code/deploy `2fcdfd2` (bàn giao `44e202f`), Pages40671706957 SUCCESS. Nguồn: hội thoại task hiện tại, không có permalink. Approval cho toàn bộ Q9E: Collection Codex, 6 Elemental Trails V1, 6 Challenges, History/Recap và UX/integrity theo DD-0003. Giữ Q9A–Q9D accepted và giới hạn coverage kỹ thuật đã ghi; không suy thêm thiết bị/browser, iOS/Safari, device FPS hoặc live HTTP/hash verification từ approval chung. Không tự mở Q10 hoặc yêu cầu duyệt lại Q9E. Lượt ghi nhận này chỉ tài liệu, không đổi runtime, balance, artwork hay progression.

Design **DD-0003 Approved**, source user2026-10-28. Q9A–D accepted giữ nguyên; baseline remote `a4ea34b` gồm Q9D VFX V1.1.

## Phase A

Codex derive catalog6/12/6 + Ascension0–4, filter, dependency và X/Y; menu details native focus/touch/keyboard và vi/en, không thay HUD/combat artwork. Sáu challenge chỉ badge/completion, không reward/stat. History20run và recap build/rewards/challenges/nextgoal, Skip/Continue; không replay. Reset chỉ xóa history, giữ evidence challenge và progression.

Profile schema3 migration1/2, Collection sub-schema1. Run summary và win sets ghi cùng transaction finishLegacy/ticket/receipt, lastRunId chặn duplicate; journal hiện hữu phục hồi nguyên snapshot. Save allowlist giới hạn20history,6Sigil/6Anomaly win IDs,4M/2C. Quota retry bỏ optionalhistory trước khi báo thất bại main; core progression không bị reset bởi metadata sai. Nếu mọi ghi đều bị browser chặn, giữ memory và cơ chế retry Q9B; không hứa persistence qua refresh. Save read cap64KB cho history hữu hạn. Cosmetics metadata/selector/runtime chỉ PhaseC sau visual approval; Prism cũ giữ nguyên. Không backfill run detail/win-by-Sigil/Anomaly từ totals lịch sử; FirstVictory/unlock/Seal challenges derive evidence progression sẵn có.

Validation: `npm test` PASS27files (4focused Q9E + migration assertions cập nhật schema3), `npm run build` gồm typecheck PASS. Phaser chunk warning có sẵn. [Browser script](browser-check.mjs), [evidence](evidence/browser.json):320/390portrait,844landscape touch emulation +1440desktop, codex/filter/vi-en/challenges/Victory recap/refresh-dedup/reset/playtest-isolation/nooverflow/noJSerrors. Fixture kích hoạt BossSlain, không naturalrun/useracceptance. Chưa iOS/Safari/deviceFPS/human input feel. Chưa deploy theo gate user.

## Phase B / C

PhaseA commit/push `e2c1b92`, PhaseB `a60f256` trên branch `q9e-final`. User “oki duyệt. làm tiếp đi” ngày2026-10-28 đã **VISUAL APPROVED Q9E Trails V1**:6motif/scale/hierarchy, mởPhaseC. [Proposal](art/README.md) giữprovenance; [PhaseC production/validation/cáchthử](production/README.md) có evidence hiệnhành. Q9E đã được user nghiệm thu theo approval hiện hành ở đầu tài liệu. DD-0003/ArtBible/Q9A–D giữnguyên. Deploy final sau kiểmtraPASS; không Q10.


## Delivery / gate hiện hành

**ACCEPTED — USER PLAYTEST APPROVAL Q9E** — bảnhoànchỉnh **2fcdfd2**, [chơi](https://gizgity.github.io/a-new-game/?v=2fcdfd2), [Pages40671706957](https://github.com/gizgity/a-new-game/actions/runs/40671706957) completed/SUCCESS. [Cáchthửngắn +6previewtrails](production/README.md#cách-user-playtest-q9e-sau-deploy). Build27testfiles/browser/input/flow/distPASS không làuseracceptance; device/iOS/Safari/naturalfullrun/FPS vàliveHTTP/hashverification giữgiớihạn. KhôngQ10.
