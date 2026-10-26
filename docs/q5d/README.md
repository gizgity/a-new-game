> Q8B: thông số milestones OR cũ trong tài liệu này là **SUPERSEDED**; giữ làm lịch sử/evidence/approval. Quy tắc hiện hành: [GAME_BRIEF](../../GAME_BRIEF.md#run-tối-đa-5-phút), [audit Q8B](../q8b/README.md). Spawn Q8A và approvals giữ nguyên.

# Q5D — weighted draft

> Đồng bộ Q8 (2026-10-26): [Q8A hiện hành](../q8a/README.md) thay thế mô tả spawn/cadence/soft cap và pressure không trần trong note cũ; giữ evidence/approval lịch sử. Milestones/Boss vẫn theo Q7D trong Q8A. Gate cũ dừng trước Q8 đã superseded bởi yêu cầu user; chỉ Q8A mở, Q8B–D chờ duyệt tuần tự.

> Tham chiếu lịch sử checkpoint trước Q6; evidence và kết quả tại thời điểm đó giữ nguyên. Hiện hành: Q5A–Q5E đã được user duyệt (task Q6 ngày2026-10-26); Q6 hỗ trợ2Curse/4Mutation, lượt Curse thứ hai thêm hoặc Keep. Xem GAME_BRIEF.md và HANDOFF.md cho contract/trạng thái mới.

Bản514063a3f3e563b4e852b64ec10c9a2d22921bac đã deploy, Actions40246492670 completed/success. Q5C b5ba138 đã được user duyệt “oki r, làm tiếp đi”; Q5D chỉ thay draft/signals/history/UI. Giữ pool12/8,4Mutation/run,1Curse và6mốc, mọi tuning gameplay/tank đã duyệt. Chờ playtest Q5D; chưa mở Q5E.

## Cách thử

Tải lại [game thường](https://gizgity.github.io/a-new-game/) để thử natural acquisition, không cần query cấp build. Mobile dùng joystick/Lướt, giữ Chém/Bắn và ngắm rồi thả Heavy/Charged; desktop WASD/Space/chuột trái-phải/Shift/E giữ-thả.

1. Run thiên bắn hoặc melee, dùng đòn trúng thật. Draft đầu25kills/0:30 và các lượt160kills/1:40,220kills/2:20,380kills/3:40: card Adaptive có thể ưu tiên hướng gây damage hiệu quả, Synergy ghi item đang sở hữu, Khám phá mở hướng khác. Đây là xác suất, không bảo đảm cùng ba tên. Bắn/chém hụt không được dùng làm bằng chứng hiệu quả.
2. Né Perfect đủ3lần Dash trở lên, hoặc Heavy đúng windup/giáp đóng ít nhất2lượt; ở draft kế, khi có card tương ứng thì lý do phải nói đúng hành vi. Có Barrier/heal hữu ích cũng có thể ảnh hưởng offer; chỉ mấtHP ghi nhu cầu yếu, không tự nhận bạn đã phòng thủ hiệu quả.
3. Curse tại80kills/1:00; lượt300kills/3:00 luôn có giữ Curse hiện tại và tối đa2alternative khác nhau. Giữ không nhân buff/reset cooldown. Thử đổi vi/en trong draft: card/lý do dịch nhưng ID không đổi. Chọn Parasitic hoặc đang giữ Parasitic thì heal5, còn lại10.
4. Sau khi thấy ít nhất một draft, thua hoặc reload để bỏ dở rồi bắt đầu run mới. Các item đã offer ở run trước (kể cả không chọn) có weight×0.4, vẫn có thể lặp. Chơi vài lượt để cảm nhận đa dạng; không kết luận chỉ từ một lần trùng. Reload trang bỏ dở run hiện tại; không thêm tính năng lưu/khôi phục run.

Phản hồi: run thiên hướng nào, mốc draft, card/lý do quan sát được, lựa chọn có đáng cân nhắc không; kèm thiết bị/browser nếu lỗi UI. Không cần thử lại mọi Mutation/Curse Q5C.

## Implementation/debug

- Sample weighted không hoàn lại theo canonical IDs; Adaptive→Synergy→Wildcard. Curse2: giữ→combined→Wildcard. Thiếu bằng chứng dùng “Khám phá”. Role/reason gắn theo chính item được lấy; không dựng label từ số lần nhấn.
- Cửa sổ hiệu quả tính từ draft trước: actual direct melee/ranged sau giáp/cost, loại overkill/proc/bonus phẳng; Perfect/Dash, marked trigger có executed relay+actual targets, Heavy phá thế một lần/cleave, enemy Barrier/HP damage và HP thực hồi. Hazard/cost/draft heal không tăng nhu cầu chống chịu.
- Damage bắt đầu có tín hiệu từ3hit/kênh, Perfect/chain từ3attempt, Heavy từ2. Confidence tăng tuyến tính tới6hit/6attempt hoặc4Heavy; score0–1. Defense/sustain dùng tỷ lệ hữu ích khi có sự kiện; nhu cầu HP contribution≤0.25. Wildcard dựa primary tag khác dominant/chưa trong build. Metadata/weights/version ở config/draft.ts; không đổi effect để chữa draft.
- Profile v1 bổ sung optional `drafts` khi đọc save cũ, whitelist20IDs, giữ settings/unlocks; lưu previous/current/active để reload/restart vẫn tính run bỏ dở. Chỉ ghi offer khi draft thực sự hiện; debug preview không lưu; không draft thì previous tập rỗng. Storage bị chặn giữ object trong bộ nhớ phiên.
- Debug opt-in: `?draftSeed=123&draftDebug=1`, đọc `window.cursebreakDraft` trong console. Seed uint32,0 đổi default; snapshot là copy gồm version, seed/state trước lấy mẫu, eligible pool, signals/maxHP, build/Curse, previous-offers, choices và weights/options mỗi slot. Có thể dựng DraftRandom từ seed rồi đặt stateBefore và gọi buildDraft(context,...). Seed một mình không tái hiện gameplay; spawn/combat không dùng luồng RNG này. Không có UI kỹ thuật trong flow chơi.

## Validation/evidence

- 136definitions/10files PASS (14focused Q5D), gồm phân bố4096seed trải đều cho mỗi điều kiện, deterministic replay, eligibility/pool0/1/2, keep-only, slotcap4, reason đúng, actual damage/armor/proc, Perfect/Heavy/chain, sustain/enemy damage, windows/pause, migration/abandon/reload/blocked storage. Phân bố ưu tiên ranged/melee/Perfect/Juggernaut và repeat penalty, vẫn không cố định names. Không là human acceptance.
- Typecheck/build PASS; Phaser bundle>500KB là warning cũ. Không dependency/QA framework mới.
- Chromium390: `ranged/melee/perfect/juggernaut/chain-390.png` dùng core/renderer thật, fixture cấp targets/build/eligible và chọn seed có đủ label để nhìn; chain dùng signal snapshot mẫu. Không là natural acquisition/probability evidence. Kiểm debug copy, offer history, reload→run mới, vi/en không reroll PASS.
- `curse-320/844/1440.png`: fixture mốcCurse2 với Parasitic, giữ+2alternative, vi/en, input chọn giữ/heal5, no-overflow/runtime errors PASS. Đã xem ảnh trực quan. Dist320/844/1440 kiểm input thật mobile/desktop vài giây, pause/resume/vi-en/save history; không inject stats. Chưa natural full-run, Safari/iOS, thiết bị thật hay experience acceptance. Browser local/dist, chưa tự nhận smoke live.
- Deploy PASS:514063a, Actions40246492670 completed/success, job121329057854;24blobs đối chiếu local/remote tree, giữ parent5a84c89, không force. Browser evidence local/dist, chưa smoke live.
