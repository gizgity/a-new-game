# Q7C — Asset specification (đề xuất, chưa runtime approved)

Reference khóa tại README; V1 enemy/Boss và V2 Player là candidates hiện hành. Sheet lớn dùng duyệt pose/material, không được auto-slice7ô thành atlas production. Sprite source riêng, không concept-board crops.

| Actor | Body height đề xuất (world px) | Collider radius (giữ) | Frame box đề xuất |
| --- | --- | --- | --- |
| Player | 40, thân cơ sở gần32; weapon có thể vượt | 16 | 64×64 |
| Grunt | 36 | 14 | 64×64 |
| Archer | 38 | 14 | 64×64 |
| Volatile | 36 | 14 | 64×64 |
| Bulwark | 50 | 22 | 96×96 |
| Chain Warden | 76 | 32 | 128×128 |

Frame box bao gồm padding/weapon; kích thước artwork không đổi collider. Pivot chân/ground anchor ổn định, visual offset riêng cho leap; pixel snapping và nearest filtering xem trong renderer sau duyệt. Alpha phải sạch, không matte/edge residue, không trail/projectile/impact bake, không floor/mark/bar/threat bake. Lossless PNG source; atlas PNG/WebP lossless nếu kiểm không mất alpha. Không palette swap enemy bằng player tint.

Pose coverage sau approval: idle4/move6frames; windup/attack/recovery có tối thiểu3pose mỗi phase khi phù hợp; hit2/death4. Đây là budget sơ bộ, không timeline: map normalized phase vào **state simulation hiện có**, không kéo dài windup để đủ frames. Volatile không có recovery sống. Enemy death chỉ bounded visual ghost, không giữ body collision/target/AI/rewards. Boss hit chỉ flash/pose presentation, không interrupt.

Player L1/L2/L3/Heavy/basic/charged/dash phải giữ identity, chiều tay/weapon và hướng aim hiện có. Boss sweep/ring/slam riêng windup/active/recovery, enrage theo state thật, không tự thêm timer. Cần source direction phù hợp góc nhìn3/4 (ưu tiên4hướng + mirror chỉ khi weapon/handedness đúng); không xoay cả humanoid3/4 như hình phẳng để giả mọi hướng. Direction/frame count cuối duyệt qua renderer, không thay aim/hit geometry để khớp art.

Hiệu năng sau approval: ít atlas, cache một lần, pooled Images/Sprites theo actor ID, không tạo/destroy texture hoặc Graphics body mỗi frame, không shader/new framework. Static poses không thêm particles/VFX budget. Ước lượng memory theo decodedRGBA width×height×4 của atlas thực, không theo PNG bytes; chưa có atlas nên chưa báo budget/FPS đạt. So render/memory/frame-time/loading cùng fixture baseline và mobile/desktop sau tích hợp, tách headless khỏi thiết bị thật.

Review hiện tại kiểm sourcePNG/hash và composition1:1/crowd/grayscale; chưa kiểm motion readability, direction registration, atlas performance, thiết bị/Safari hoặc natural run. Không dùng build/tests PASS thay visual/playtest approval.
