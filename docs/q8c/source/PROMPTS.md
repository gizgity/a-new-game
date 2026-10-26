# Enraged pose v1 — ImageGen production asset

Ngày 2026-10-26. Reference: `docs/q7c/source/chain-warden-production-v1.png` (art Q7C đã accepted). Source mới `enraged-v1.png`, tạo bằng OpenAI ImageGen với transparent background, quyền sử dụng generated asset cho project; không third-party art. Không xem ảnh sinh là user approval.

Prompt: Dedicated production sprite sheet of exact Chain Warden ENRAGED transformation pose; match painted dark bronze/black armor, crown, hooked chains, angular fractured occult art, top-down 3/4. Four isolated views in one row, same proportions. Angry braced stance, shoulders raised, fists spreading chains, brighter ember core and restrained red orange cracks confined to armor. Transparent, no text/scenery/circles/ground/shadow/aura. Readable at76px. Production poses, not concept board.

Chỉ dùng pose đầu nhìn trước trong transform1.4s, tư thế đứng gồng nhìn trước có chủ đích. Các view còn lại chưa dùng (north sinh không đủ khác biệt). Packer offline `tools/build-enraged-pose.py` trim alpha, normalize76px, foot pivot134 trong box192 theo Q7C; không vẽ body. Phase2 combat tiếp tục dùng đủ4facings/pattern poses Q7C với tint ember nhẹ; không ép pose transform vào mọi animation hay xoay body360°. Atlas Q7C nguyên hash. Asset/version/hash/giới hạn tại `asset.json`.
