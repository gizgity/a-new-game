# Q9E — Final Design & Implementation

Design **DD-0003 Approved**, source user2026-10-28. Q9A–D accepted giữ nguyên; baseline remote `a4ea34b` gồm Q9D VFX V1.1.

## Phase A

Codex derive catalog6/12/6 + Ascension0–4, filter, dependency và X/Y; menu details native focus/touch/keyboard và vi/en, không thay HUD/combat artwork. Sáu challenge chỉ badge/completion, không reward/stat. History20run và recap build/rewards/challenges/nextgoal, Skip/Continue; không replay. Reset chỉ xóa history, giữ evidence challenge và progression.

Profile schema3 migration1/2, Collection sub-schema1. Run summary và win sets ghi cùng transaction finishLegacy/ticket/receipt, lastRunId chặn duplicate; journal hiện hữu phục hồi nguyên snapshot. Save allowlist giới hạn20history,6Sigil/6Anomaly win IDs,4M/2C. Quota retry bỏ optionalhistory trước khi báo thất bại main; core progression không bị reset bởi metadata sai. Nếu mọi ghi đều bị browser chặn, giữ memory và cơ chế retry Q9B; không hứa persistence qua refresh. Save read cap64KB cho history hữu hạn. Cosmetics metadata/selector/runtime chỉ PhaseC sau visual approval; Prism cũ giữ nguyên. Không backfill run detail/win-by-Sigil/Anomaly từ totals lịch sử; FirstVictory/unlock/Seal challenges derive evidence progression sẵn có.

Validation: `npm test` PASS27files (4focused Q9E + migration assertions cập nhật schema3), `npm run build` gồm typecheck PASS. Phaser chunk warning có sẵn. [Browser script](browser-check.mjs), [evidence](evidence/browser.json):320/390portrait,844landscape touch emulation +1440desktop, codex/filter/vi-en/challenges/Victory recap/refresh-dedup/reset/playtest-isolation/nooverflow/noJSerrors. Fixture kích hoạt BossSlain, không naturalrun/useracceptance. Chưa iOS/Safari/deviceFPS/human input feel. Chưa deploy theo gate user.

## Phase B / C

PhaseB đang chuẩn bị6trail concept và mockup runtime theo [art](art/README.md). Chưa visual approval. PhaseC production/cosmetic persistence/integration/performance/regression/deploy và user playtest còn pending. Không Q10.
