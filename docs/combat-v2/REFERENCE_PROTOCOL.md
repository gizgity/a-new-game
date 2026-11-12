# A3 — Reference & Evidence Protocol (Combat V2)

> **PROPOSED v1 · 2026-11-12 · chờ user duyệt.** Đây là quy định QUẢN LÝ reference, không khóa camera, style, màu sắc, pose hay gameplay. `HARNESS.md` là workflow; `DESIGN_BIBLE.md` là creative direction có thể đổi. Preview app chỉ là công cụ quan sát.

## 1. Một reference phải chứng minh điều gì?

Codex chỉ được implement visual dựa trên **đúng phiên bản thiết kế + reference đã được user duyệt cho một task cụ thể**. Ảnh đẹp nhưng không thể nối tới task/approval/scale không phải implementation target.

Có bốn loại reference (ghi rõ type, không trộn):
- **BASELINE** — screenshot/runtime/asset hiện tại; bằng chứng “before”, không tự coi là thiết kế V2 được chọn.
- **CONCEPT** — hình thăm dò hướng, thay đổi được, chưa dùng làm runtime asset.
- **TARGET** — mockup/keyframe/turnaround được user duyệt cho **một task**, nêu rõ phần hình mang tính quy định và phần chỉ minh họa.
- **EVIDENCE** — ảnh/clip/screenshot từ candidate runtime dùng để kiểm tra implementation; không phải approved target.

Một hình có thể được nâng trạng thái từ CONCEPT thành TARGET chỉ bằng ghi nhận approval rõ cho đúng revision; không tự đổi tên/ghi đè ảnh gốc để tạo “approval”.

## 2. File và đặt tên tối thiểu

Chỉ tạo folder khi task thực tế cần:
- `docs/combat-v2/references/<TASK-ID>/`: lưu asset tham chiếu.
- `docs/combat-v2/tasks/<TASK-ID>.md`: design card, liên kết refs và trạng thái approval.
- `docs/combat-v2/references/<TASK-ID>/README.md`: manifest ngắn chứa metadata, khi có ảnh đầu tiên.
- `docs/combat-v2/evidence/<TASK-ID>/`: runtime screenshots/clip và notes nếu cần lưu lâu dài.

Tên ảnh có vai trò và phiên bản, ví dụ `B1-player-base-target-v2.png`, `B1-player-base-runtime-mobile-v1.png`. Không dùng “final.png” vô phiên bản. Không lưu bản nháp nặng hàng loạt; chỉ giữ refs quyết định thực thi và nguồn thiết kế cần thiết.

## 3. Metadata tối thiểu cho từng reference

| Trường | Yêu cầu |
| --- | --- |
| `ref_id` | ID ổn định, ví dụ `B1-TARGET-01` |
| `task_id` | Task cụ thể sử dụng ref |
| `type` | BASELINE / CONCEPT / TARGET / EVIDENCE |
| `status` | PROPOSED / APPROVED / SUPERSEDED / REJECTED |
| `path` | Đường dẫn repo chính xác, có thể mở |
| `revision` | Số bản của hình và spec tương ứng |
| `source` | Người/tác nhân tạo, prompt / tài liệu nguồn và quyền sử dụng khi cần |
| `view_context` | Góc nhìn, scale xuất hiện trên màn chơi, thiết bị/viewport hoặc ghi N/A |
| `binding` | Phần nào PHẢI bám; phần nào chỉ minh họa / không suy từ ảnh |
| `approval` | User quote, ngày, scope, file/ref version hoặc `NONE` |

Trạng thái không được cấp tự động từ git commit, PNG đã tồn tại, build PASS hoặc ChatGPT khen concept. Nếu đường dẫn ảnh chưa có trong repo, ghi `UNAVAILABLE` và STOP trước code.

## 4. Các hình cần cho mỗi loại visual task (đề xuất linh hoạt)

- **Nhân vật:** baseline runtime đúng scale + candidate ở cùng scale; turnaround/keyframe chỉ theo số hướng mà task đã chọn; silhouette trên nền cảnh đông nếu thay silhouette.
- **Animation/attack:** tối thiểu pose trước/impact/sau hoặc clip, direction và phase mapping theo mechanics; chú thích timing/hitbox nếu là yếu tố bắt buộc.
- **Mutation/Curse:** trước/sau selection, khi trigger, payoff tương ứng effect thật; nếu chỉ thay một phần thì chỉ yêu cầu refs cho phần đó.
- **Enemy/Boss:** silhouette + windup/active/recovery hoặc phase transition tương ứng scope; có telegraph trong crowd.
- **HUD/arena:** mockup full viewport mobile/desktop nếu ảnh hưởng layout; ghi safe area và vùng không che gameplay.

Những mục trên là **hướng dẫn chọn evidence**, không phải yêu cầu cố định 4 facings, góc top-down hay frame count. Một task nhỏ chỉ cần refs đủ để Codex không phải đoán; không ép portfolio lớn nếu không cần.

## 5. Khóa phạm vi và xử lý khi user đổi ý

Task card phải có:
1. `baseline_ref`, `approved_target_ref`, `design_revision`, `approval_status`.
2. **Must match:** các điểm quan sát được Codex không được thay (ví dụ bố cục silhouette, hướng động tác, màu được chỉ định trong task).
3. **Flexible:** phần được phép điều chỉnh kỹ thuật để đúng runtime.
4. **Must not infer:** các chi tiết không được quyết định bởi ảnh (ví dụ FPS, damage, collider, gameplay timing).
5. **Supersedes:** ref/spec nào bị thay thế, phạm vi thay thế; phần không đề cập giữ baseline hiện hữu.

User có thể đổi góc nhìn, style, camera hay bất kỳ lựa chọn thiết kế nào. Khi đó tạo revision/target mới, ghi phạm vi và impact; **không sửa Harness để khóa/giữ thiết kế cũ**, không xóa lịch sử approval. Nếu scope đổi kéo theo nhiều phần code, chia từng task sau khi impact được chốt.

## 6. Kiểm chứng: design target ≠ runtime result

1. Codex đọc đúng spec/ref approved, kiểm đường dẫn mở được.
2. Triển khai **một thay đổi** không ngoài scope.
3. Ghi candidate revision, screenshot/runtime evidence ở trạng thái và tỷ lệ tương ứng ref; screenshot thật phải ghi phiên bản game/viewport/scenario.
4. So từng điểm **Must match**; báo PASS/FAIL/NOT CHECKED, không chỉ “nhìn giống”.
5. Dùng preview app để xem autoplay/slow motion, nhưng không gọi hai iframe cùng version là A/B thật; nếu không đồng bộ frame, ghi limitation.
6. Build/typecheck/focused tests nếu có code; không suy visual approval hoặc playtest acceptance từ CI.
7. User duyệt/hủy/yêu cầu sửa; ghi chính xác scope/revision và NEXT ACTION trong task/HANDOFF.

Bản so sánh phải có **before, target, actual** (có thể là link), không được tráo ảnh concept cho screenshot đã chạy.

## 7. Stop conditions

Dừng trước implementation nếu thiếu TARGET approved, sai revision, reference không load, approval không chỉ đúng task/scope, thiếu phần Must match quan trọng, hoặc có xung đột spec/ref chưa được user giải quyết. Khi đang thiết kế, có thể tạo CONCEPT PROPOSED và xin duyệt mà không cần approved target từ trước.

Không tự tạo sprite “theo cảm giác”, không biến hình minh họa không xác định thành art canon. Không tự thay nguồn ảnh bên thứ ba thành production asset thiếu quyền sử dụng.

## 8. Audit & Gate A

A3 hoàn thành ở mức DOC khi protocol này giải thích được: loại ảnh, version, approval, binding, lưu trữ và evidence; **chưa có refs B1 thật** vì chưa bắt đầu B1. Thử nghiệm việc tuân thủ theo A-H4 với task minh họa, không build/deploy hoặc tạo artwork trong A3.

**A3 status: PROPOSED, awaiting user review.** Sau user duyệt, NEXT ACTION: **A-H2 — Task Card Template**. Chưa sửa production.
