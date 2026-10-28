# Q9E — Elemental Trails Concept V1

**VISUAL APPROVED V1** — user “oki duyệt. làm tiếp đi” ngày2026-10-28 trên a60f256, hội thoại hiện tại không permalink. PhaseB checklist dưới là snapshot proposal; [PhaseC production/runtime](../production/README.md) có coverage hiện hành, user playtest còn pending. Chỉ concept/review theo `$game-art`; không production texture, không tích hợp cosmetic mới, không deploy, không userplaytestacceptance.

[Review HTML — baseline / six alternatives / grayscale](review.html) · [Board V1](source/concept-v1.png) · [Exact prompts](source/PROMPTS.md) · [Hashes/provenance](manifest.json).

## Scope cần duyệt

| Sigil / Victory hợp lệ | Cosmetic | Motif / palette proposal |
| --- | --- | --- |
| Fire | Ember Trail | Lozenge ember đồng/cam trầm, ngắt đoạn |
| Water | Tidal Echo | Comma/ripple đôi teal |
| Lightning | Volt Trace | Zigzag góc gãy blue ngắt đoạn |
| Ice | Frost Shards | Tam giác nhỏ pale blue |
| Shadow | Umbral Wake | Crescent notch lavender tối |
| Wind | Gale Spiral | Feather/curl celadon |

Sáu lựa chọn loại trừ nhau; tối đa1 hoặc None. Visual-only khi production/integration sau approval; không thay timing/collider/RNG/combat. Board closeup/fade là phóng lớn ý tưởng, không animation timing hoặc fixture renderer.

## Cách xem

1. Mở board để so sáu silhouette, rồi review HTML hoặc các ảnh dưới trên mobile/desktop. Trong HTML mỗi nhóm320/390/844/1440 có baseline và6alternatives ở CSSnativeviewport; cuộn ngang.
2. Bật grayscale cùng ảnh; tìm Player và phân biệt cue rose/gold/current Q9D trước rồi mới nhìn trail dưới chân. Kỳ vọng trail nhỏ/thấp hơn Player và nguy hiểm, không giống đòn đánh/ring damage. Không cần trail cực nổi hoặc nhận diện nguyên tố chỉ từ màu trong crowd.
3. Duyệt **Q9E Trails V1 cả6motif + mức sáng/kích thước ở composite**, hoặc nêu trail/tình huống cần sửa. Approval chỉ visual, không tự nghiệm thu implementation/feel/performance Q9E.

| Viewport | Baseline | Ember | Tidal | Volt | Frost | Umbral | Gale |
| --- | --- | --- | --- | --- | --- | --- | --- |
|320portrait|[ảnh](baseline/current-320.png)|[ảnh](mockups/composite-320-0.png)|[ảnh](mockups/composite-320-1.png)|[ảnh](mockups/composite-320-2.png)|[ảnh](mockups/composite-320-3.png)|[ảnh](mockups/composite-320-4.png)|[ảnh](mockups/composite-320-5.png)|
|390portrait|[ảnh](baseline/current-390.png)|[ảnh](mockups/composite-390-0.png)|[ảnh](mockups/composite-390-1.png)|[ảnh](mockups/composite-390-2.png)|[ảnh](mockups/composite-390-3.png)|[ảnh](mockups/composite-390-4.png)|[ảnh](mockups/composite-390-5.png)|
|844landscape|[ảnh](baseline/current-844.png)|[ảnh](mockups/composite-844-0.png)|[ảnh](mockups/composite-844-1.png)|[ảnh](mockups/composite-844-2.png)|[ảnh](mockups/composite-844-3.png)|[ảnh](mockups/composite-844-4.png)|[ảnh](mockups/composite-844-5.png)|
|1440desktop|[ảnh](baseline/current-1440.png)|[ảnh](mockups/composite-1440-0.png)|[ảnh](mockups/composite-1440-1.png)|[ảnh](mockups/composite-1440-2.png)|[ảnh](mockups/composite-1440-3.png)|[ảnh](mockups/composite-1440-4.png)|[ảnh](mockups/composite-1440-5.png)|

Mỗi composite có bản `-gray.png` cùng thư mục. Baseline `-1` trong mockups cũng giữ cùng capture pipeline để so.

## Consistency check — chỉ static proposal

| Check | Kết quả / evidence / giới hạn |
| --- | --- |
| Palette/material/semantic anchors | PASS định tính: jade/ivory Player giữ P0,6trail dim local P2, floor P3 nguyên renderer; màu thuộc họ Bible, không chốt HEX mới. Board phóng lớn sáng hơn composite, không lấy board brightness làm runtime target. |
| Silhouette / top-down¾ / handedness | PASS baseline Player/enemy/boss artwork không đổi;6motif tách shape. Không tạo animation/facing mới cho actor. |
| Scale/foot anchor/hierarchy | PASS proposal footprint52×32worldpx chéo sau chân, opacity58% screenblend, camera zoom. Không che player hoặc threat; không ring damage. Đây là layoutreview, không exact productionregistration. |
| Mobile/landscape/desktop/crowd | PASS định tính24proposed+4baseline ở320/390/844/1440,24enemy/2windup/Q9D cues. Chỉ fixture stress đồng thời, không naturalrun/progression. |
| Grayscale | PASS ưu tiên Player/threat trong cùngảnh; shape trail còn local/dim, một số chi tiết cố ý rất nhẹ ở320, không hứa nhận diện trail trong mọi crowd. |
| HUD / geometry | PASS baseline layer bất biến trong exact composites; không đổi controls/resources/input/camera/collider. Generated redraw studies không dùng làm geometryproof. |
| 4góc | Baseline390 đủ4ảnh; proposedtrail corners và desktopcorners **UNKNOWN/PENDING PhaseC**, chưa có rendererintegration. Không suy từ center. |
| Alpha/pivot/animation/fade/freeze/reset/performance | **UNKNOWN/PENDING PhaseC**, không có productionalpha/motion/FPS/device/iOS/Safari. Fade board là study, không thêm simulationstates. |

## Method / provenance

ImageGen tạo boardV1 từ approved player source +Charged/crowd/grayscaleQ7C và current arena/HUD thật, đã mở/xem inputs; prompt/refs/hashes lưu riêng. Current baseline capture từ runtime a4ea34b +PhaseA e2c1b92 bằng Playwright script, profileplaytest memory riêng, không ghi save thật. Review dùng screenshot nền **nguyên pixels**, motif board được clip qua CSS image chỉ trong docs, screenblend58% và size/anchor có chủ đích. **Không crop board thành runtime assets**, không dùng Graphics vẽ artwork; production phải sinh source riêng sauapproval. Blend có thể còn background shading nhẹ, không là bằng chứng alpha sạch.

ImageGen contact sheets ban đầu tại `source/studies/redraw-*` bị redraw/đổi aspect/HUD, **FAIL geometry fidelity**, không trình làm mockup chính hoặc renderer evidence. Giữ raw/provenance, thay bằng exact screenshot composites; không sửa ArtBible để hợp output.

`build-review.mjs` dựng layoutHTML, `capture-review.mjs` chụp28color+grayscale pairs (4baseline +24alternatives). `baseline/captures.json` mô tảfixture; `mockups/review.json` coverage. Manifest hashes chỉ ảnh/ref, không tự approve. Model/seed không cung cấp, quyền theo điều khoản ImageGen, không khẳng định CC0/độc quyền.

Sau uservisualapproval đúngV1: PhaseC production source riêng, max1/None và persistence theo Victory evidence đã journal; purevisual integration; mobileportrait/landscape+desktop motion/performance/regression/4góc, commit/push main/Pages theo gate, cập nhật evidence rồi dừng **AWAITING USER PLAYTEST APPROVAL Q9E**. Không Q10.
