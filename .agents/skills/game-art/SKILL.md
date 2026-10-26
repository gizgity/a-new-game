---
name: game-art
description: Dùng khi user gọi $game-art hoặc giao tạo/sửa/review artwork game; bắt buộc Art Bible, approved image references, runtime mockup và visual gate.
---

# Game art

1. Đọc `AGENTS.md`, `ART_BIBLE.md`, `docs/art-reference/README.md`, `DESIGN_DECISIONS.md` và handoff. Xác định asset type, scope, phase và evidence approval; không tự yêu cầu duyệt lại baseline đã accepted.
2. Mở/xem ảnh approved đúng loại từ reference index: actor tương ứng + arena/HUD runtime + crowd/grayscale; dùng **ảnh reference thực sự làm input ImageGen**, không chỉ nhắc filename trong prompt. Ghi paths/version/hash/provenance và phạm vi approval. Không lấy Q8C pending hoặc concept cũ làm chuẩn. Reference thiếu/không đọc được hoặc ImageGen không khả dụng: báo **BLOCKED** nêu ảnh/tool còn thiếu; không thay bằng procedural Graphics, placeholder art hoặc style khác.
3. Dùng master prompt + template đúng loại trong Art Bible, điền thông số có nguồn. Ghi exact prompt, negative constraints, inputs, output version, quyền dùng/giới hạn; seed/model không biết ghi không được cung cấp. Source concept và production tách riêng, không crop concept board thành sprite.
4. Gate bắt buộc: **concept → consistency check → user approval → production asset → integration**. Concept phải có mockup ghép ảnh mới ở đúng world scale lên **screenshot arena/HUD runtime thật** từ index hoặc capture current runtime (ghi version/viewport/fixture). Cạnh đó đặt baseline approved cùng tình huống; không chỉ review ảnh standalone. Nhãn rõ “composite concept”, không giả là renderer/live. Không sửa production để làm mockup. Kiểm desktop, phone nhỏ, portrait/landscape, crowd và grayscale cùng scene; chưa có ảnh phải báo thiếu, không đánh PASS.
5. Checklist consistency ghi PASS/FAIL/UNKNOWN + evidence: HEX palette/semantic colors; silhouette từng role và Player P0; top-down¾/four facings/handedness; obsidian/metal/plates, ánh sáng tiết chế; scale/pivot/alpha; state/animation theo simulation; HUD/VFX hierarchy P0–P3; mobile/crowd/grayscale readability; arena edges/4 góc và HUD không che actor/cue. ImageGen output lệch phải sửa/regenerate ảnh, không sửa Art Bible cho hợp ảnh.
6. Dừng **AWAITING VISUAL APPROVAL** với links concept, baseline, mockup, checklist và scope cần duyệt. Approval chỉ user xác nhận rõ trên đúng version/scope; không suy từ “tiếp tục”, tools PASS hay deploy. Approval bị thiếu/mơ hồ phải báo. Production source sau duyệt phải giữ identity, kiểm lại palette/camera/scale/alpha trong runtime mockup; lệch đáng kể quay lại gate, không tích hợp. Integration chỉ khi được giao, rồi ảnh renderer thật + chờ playtest riêng; không tự accepted.
7. Nếu user đổi art direction: cần user gọi `$design-decision` với nội dung đã chốt và bằng chứng, append decision Approved mới trước khi đổi Art Bible. Direction approval không thay artwork approval. Cập nhật Bible/index chỉ bằng accepted artwork, giữ nguồn và chỉ rõ cái superseded.
8. Handoff ghi phase, refs, prompt/version, checklist, user approval quote/ngày, production/integration/acceptance riêng, blocker và một next action. Không sửa gameplay/camera/collider/roadmap để khớp hình.

## Ví dụ gọi

```text
$game-art Tạo concept pose mới cho Grunt, giữ art direction ART_BIBLE.md.
Dùng source Grunt Q7C + ảnh crowd390/arena/HUD accepted trong reference index làm image inputs.
Chỉ concept và mockup runtime thật ở320/390/844/1440, có crowd/grayscale và checklist.
Dừng AWAITING VISUAL APPROVAL; chưa sửa production assets hoặc gameplay.
```
