> **VISUAL APPROVED — V1.1**: user “duyệt, làm đi” ngày2026-10-28, hội thoại hiện tại không permalink; đã giao production/integration. [Delivery mới](../vfx-production/README.md). Các nhãn candidate/chờ duyệt bên dưới là snapshot trước approval, không là gate hiện hành. Chưa Q9D playtest acceptance.

# Q9D — VFX proposal V1.1

**CONCEPT CANDIDATE — chưa visual approval.** Feedback user ngày2026-10-28: “chưa có vfx, k thể phân biệt được lúc chơi”. Scope: presentation cho4modifier, không đổi damage/radius/CD/timing/progression/save/input/camera; không Q9E hoặc DDR Approved. Runtimeafd084a vẫn chưa user playtest accepted.

## Audit

`ArenaScene.drawCombat` hiện chỉ dùng2pxcircle/crosshair cho Pulse/Echo, tam giác nhỏ trên Hunter. Pulse vàEcho giống geometry, không có motif nguồn/nhịp imminent riêng; Echo tồn tại rất ngắn tại impact; Fractured proc và penalty không có cue riêng ngoài text card. Cảnh24quái làm cue lẫn enemyHP/Rupture/fan. Các checks logic/build/browser cũ không chứng minh readability, user feedback này chưa được giải quyết bằng tests.

## Visual contract đề xuất

| Modifier | Nhận diện / state | Bảo toàn combat |
| --- | --- | --- |
| Unstable Pulse | Hai ripple gãy trong vòng damage,2sẹo ấn ivory đối nhau ở ngoài. Prepare rose dashed → imminent gold → active ivory/low fragments. Không bolt/cracks/4ngoặc Anomaly. | Warning1.5s/active0.5s/radius48; đặt lệch player, không mở rộng hitbox theo sóng. |
| Hunter Instinct | Split-eye crest nhỏ có nền tối trên đầu Grunt, táchHPbar; warning gold0.8s, active ivory+2trailchips amber4s, crest vỡ khi hết. | Chỉ trên Hunter thật, không clones/đường dự đoán giả/fan tấn công mới; giữ sprite/AI/timing/collider. |
| Fractured Choice | Static proc thật có split-fork lavender/ivory tại contact; nhánh phụ mảnh hơn. Penalty có2sẹo rose nhỏ cạnh chân player, hết25s tắt. | Không projectile/target mới, không ngụ ý delay gameplay; cùng proc/root hiện hữu. Debuff không là ground damage/shield/CC. |
| Warden Echo Strike | Dấu xích phẳng+crown3mũi tại vị trí cũ, perimeter damage rõ; warning rose→gold, single low chain-snap ivory rồi tan. | Warning1.3s/radius52; không pillar/beam/knockback/extra hits, không sóng mở rộng. |

Hai sẹo đối nhau là source signature Ascension nhỏ, không thay4ngoặc Anomaly đã accepted. Hunter/Fracture không cần vòng hazard giả. Damage boundary luôn là vòng thật; art cố định vào footprint, chỉ ripple nằm bên trong. P0Player/instant threat ưu tiên, P2 feedback tiết chế; không màu mint/cyan khiến hazard trông an toàn, không bloom/fog/fullscreenfill. Freeze/reset theo simulation thật. Chỉ event/state thật được phát VFX sau approval; không dùng timer độc lập để tạo proc/echo giả.

## Review

- [Board4motif/state V1.1](source/concept-v1.1.png): **concept**, không spritesheet production/renderer.
- [Before/after4viewport và grayscale](review.html): baseline actual renderer đối chiếu composite concept trên đúng cảnh; grayscale CSS cùng ảnh.
- Mockups [320](mockups/proposed-320.png), [390](mockups/proposed-390.png), [844](mockups/proposed-844.png), [1440](mockups/proposed-1440.png). Đây là ImageGen composite, không live game; có thể resample/redraw.
- [Baseline captures](baseline/captures.json): current runtimeafd084a,24quái/2windup/Hunter/Pulse/Echo/penalty. Co-occurrence bị inject để stress visual, không chứng minh reachable encounter hoặc progression.4góc390 chỉ baseline, chưa proposed corner proof.
- [Exact prompts / refs / provenance](source/PROMPT.md), [manifest/hash](manifest.json). Q7C/Q8C/Q9C accepted refs giữ approval gốc; Q9D baseline chưa accepted.

## Consistency checklist

| Check | Status / evidence |
| --- | --- |
| Palette/material/style | PASS định tính trênboardV1.1 vàmockups320/390/844/1440 đã xem; rose/gold/ivory danger; lavender chỉ proc; obsidian ground giữ tối, không đổi direction/Bible. |
| Source distinction | PASS định tính trênboardV1.1: ripple / eye / splitfork / chaincrown; không reuseQ9C4brackets,3diamondRupture/cyanhexBarrier. |
| Actor silhouette/handedness/camera | Baseline accepted; concept phải giữPlayer/Grunt/Boss; exact matching trong generated composite UNKNOWN. |
| Scale/footprint/pivot/alpha | Runtime radius48/52 và zoom có metadata; concept registration/productionalpha/pivot UNKNOWN. Không đổi collider theo hình. |
| Mobile/desktop/crowd |4viewport+24enemies baseline; mockups320/390/844/1440 có motifripple/chain/eye rõ hơn ở cùngCSSwidth.390final đã khôi phục Archer từảnh renderer gốc;390draft lỗi bịloại. Chưa motion/deviceFPS/inputlatency acceptance. |
| Grayscale | PASS định tính shape ở320/390/844/1440: chainrim khác ripple, eyecrest không là3diamondRupture; [review-gray](mockups/review.json) dùng CSSgrayscale cùng ảnh.390 đã recapture saucorrection. Không dùng ImageGen grayscale khácscene. |
| Edge/4góc/HUD |4góc390baseline; proposedcorner/clip sau integration UNKNOWN. HUD/control layout giữ nguyên. |
| Timing/proc budgets | Concept minh họa labels, không evidence simulation mới; VFX production phải lấy actual event/state và không đổi gameplay. |

## Gate

Dừng **AWAITING VISUAL APPROVAL — Q9D VFX V1.1** sau review. Cần user duyệt4motif, khác biệt prepare/imminent/active và readability trên mockup. Theo `.agents/skills/game-art/SKILL.md` bước4: “concept → consistency check → user approval → production asset → integration”. Chưa approval nên không tạo production source/tích hợp/deploy. Không crop board làm sprites. Không build/test gameplay vì chưa sửa runtime; chỉ kiểm links/hash/diff và capture renderer đọc.

### Giới hạn board/ảnh sinh

V1draft bị loại khỏi scope duyệt: labelEcho active0.5s sai và Fracture vẽbeam. V1.1 đã sửa Echo thànhsingleimpact và Fracture localcontact; Player scale label40worldpx. Pulse active vẫn có vài mảnhrose ở biên ngoài cùng ivoryripple: chỉ minh họa field còn gây damage trong0.5s, không warning cho đòn mới; không tạo pulse thế hệ2. Text “marks a target” trênboardHunter là caption minh họa kém chính xác; runtime chỉ crest trênGrunt đã chuyểnHunter, **không thêm target-mark mechanic**. README/config là nguồntruthtiming. Composite tái vẽ một số pixels/fonts; không dùng làm atlas hoặc chứng nhận exactregistration.

Production sau duyệt cần darkunder-edge cục bộ và line≥2worldpx (≈1.5screenpx tại zoom0.75); crest18–22worldpx, nhỏ hơn bodyGrunt36px, không chạm HP/Rupturepips. Đây là constraint presentation, không đổi collider/range hoặc gameplay theo thiết bị. Board/ảnh concept không thay verification thực của animation/footprint/layers/alpha sauintegration.

390draft làm mấtArcher nên không trong scope duyệt; finalproposed390 đã sửa bằngImageGen với input renderer gốc. Các bảndraft được giữ làm audit, không runtime/approved art.
