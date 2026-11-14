# Tiếp tục sau compact — Dungeon/Skill Rework

Snapshot: DUNGEON-BRAINSTORM-01 R38 · 2026-11-14 · tiếng Việt.

## Đọc và tiếp tục

- Đọc CURRENT của `HANDOFF.md` và file này trước. Toàn bộ câu hỏi, recommend, câu trả lời user, phạm vi supersede và giới hạn nằm trong [DESIGN_CHECKLIST.md](DESIGN_CHECKLIST.md), **Q01–Q35 và C01–C05 được giữ đầy đủ**.
- User muốn **hỏi từng câu một, recommend trước dựa trên toàn bộ design**; user đồng ý/từ chối/bổ sung thì ghi kết quả trước câu tiếp. Gom chi tiết cùng cơ chế, không hỏi từng con số hoặc gộp các quyết định độc lập để lấy approval hàng loạt.
- **Q35 vừa được user trả lời “y”; đã ghi nhận. Q36 chưa hỏi/chưa chốt.** Lượt mới chuẩn bị Q36 về đổi/gắn skill-support, nâng/phân giải và xử lý đầu tư khi đổi; recommend một model rồi hỏi một quyết định. Không hỏi lại Q35.
- **Q11 vẫn TẠM GÁC/CHƯA DUYỆT:** chưa có luật thưởng vĩnh viễn sau mỗi dungeon. Phải rõ reward/build/meta trước khi quay lại timing/giữ-mất.
- **Q01 là lịch sử đã bị C01/Q07/Q10 thay:** hiện là tree hữu hạn 9 nấc tới final, không dùng endless không đích cũ làm lệnh.
- Chỉ brainstorming/ghi notes. Chưa quyền implementation/asset/deploy từ các câu trả lời design. Khi lập spec/art/code V2 phải đọc đúng Master Plan/Harness/Design Bible/Reference Protocol/task card/refs và đi gate; không tự suy acceptance từ commit/build/Pages.

## Git và production

- Nhánh: **`codex/dungeon-skill-rework`**, tạo theo user từ main **`63f4f3b88826eb556664bf240e8be538e8f654e6`**. Main/production không sửa trong brainstorm.
- Đã commit notes: `30a2c20`, `d50c418`; checkpoint sau có thể xem `git log -1`. Nhánh được tạo local, chưa push remote/merge main/deploy. Không tự dispatch Pages cho nhánh này.
- `package-lock.json` có diff **trước task** (một dòng), giữ nguyên, **không stage/commit/reset**. Chỉ stage notes do agent viết.
- `.github/workflows/pages.yml`: auto deploy push main, có manual dispatch. Không cần sửa workflow trong scope notes.
- Production gần nhất theo baseline handoff: Boss V1 code/deploy `b0c3760`, notes main `63f4f3b`; còn user playtest riêng, không coi rework discussion là nghiệm thu nó. B1 exploration cũ vẫn PAUSED/REVERTED, không tự mở lại.

## Chỉ mục các câu hỏi — đầy đủ, không thay log bằng tóm tắt

| Câu | Nội dung hỏi | Kết quả hiện hành |
| --- | --- | --- |
| Q01 | Chuỗi có kết thúc bắt buộc không? | Endless từng được đồng ý, **đã được C01/Q07/Q10 supersede** thành tree9/final/thắng kết thúc. |
| Q02 | Chết có kết thúc chuỗi không? | Có; không revive/load checkpoint cứu death; reset build, giữ unlock/progression đã nhận. |
| Q03 | Có được chủ động kết thúc sau Boss không? | Có, sau Boss/trước node tiếp; đóng lượt/reset build, giữ progression đã nhận. |
| Q04 | Lưu/nghỉ có giữ giữa dungeon không? | User sửa: giữ tree/node, vào lại **từ đầu node**, không world-save giữa dungeon. |
| Q05 | Nhân vật vào lại node ở trạng thái nào? | Checkpoint đầu node: build/buff/HP/bình/tài nguyên; bỏ thay đổi/thưởng tạm node dở. |
| Q06 | Restart node sau nghỉ có đổi dungeon không? | Giữ layout/bầy ban đầu/Boss/modifier, reset clear; không backtrack/đổi nhánh. |
| Q07 | Tree có bao nhiêu nấc? | **9 tổng**: nấc1–8 mỗi nấc2–3 dungeon chọn1; nấc9 một dungeon Boss cuối mạnh nhất. |
| Q08 | Chọn tự do mọi node nấc sau không? | User sửa: **đường nối riêng** giới hạn tuyến; xem trước **toàn tree**; chọn1 khóa các node cùng nấc còn lại. |
| Q09 | Node xem trước thông tin gì? | Đặc điểm/nguy hiểm tương đối, buff-debuff đủ giá trị/hiệu lực/cộng dồn, nhóm thưởng, Boss nếu đã xác định; layout/loot cụ thể khám phá trong map. |
| Q10 | Sau final nấc9 thế nào? | Thắng/kết thúc/tổng kết/thưởng hoàn thành; lượt mới tree random mới/build reset, giữ progression đã nhận. |
| Q11 | Thưởng vĩnh viễn chốt sau từng dungeon? | **TẠM GÁC/CHƯA DUYỆT**; user yêu cầu rõ thưởng gì và làm lại build trước. Không suy mỗi Boss một permanent reward. |
| Q12 | Meta tăng chỉ số hay mở cách build? | Đồng ý hướng meta mở lựa chọn ở mức tổng thể; user mở scope làm lại skill + reward unlock skill/support, chưa catalog/economy chi tiết. |
| Q13 | Active skill + support gắn skill? | Có; user thêm yêu cầu chế độ tự ra đòn. |
| Q14 | Auto bao nhiêu skill? | **1 main auto + 2 skill phụ manual**; auto bật/tắt trên hai nền tảng, cost/timing thật, không tự di chuyển/chọn build/node. |
| Q15 | Dash tính trong hai ô phụ? | **Không**, Dash manual cố định/nút riêng; timing/charge/i-frame chưa đổi. |
| Q16 | Bình máu tính trong hai ô phụ? | **Không**, bình nền manual/nút riêng; charge/nạp/lượng hồi chưa chốt. |
| Q17 | Main nền gồm kiểu nào? | Chọn1 trong pool4 kiểu: **melee quét cung, projectile, nova quanh người, channel tia**. Chưa tên/nguyên tố/giá trị/art/cấp cả pool đầu game. |
| Q18 | Skill phụ nền gồm vai trò nào? | Chọn2 trong pool4: **burst/AoE, vùng khống chế, khiên, trụ công kích**. Trụ đặt tay rồi tự bắn ngắn hạn, không auto cast phụ. |
| Q19 | Trần ô support? | **3 main / 2 phụ1 / 2 phụ2**, tổng7; không mặc định cấp đầy đầu lượt. |
| Q20 | Pool support cơ bản? | **9**: đa đạn/xuyên/chain/mở rộng/lặp/kéo dài/tăng nhịp/hồi chiêu/cường hóa. User nhắc chưa tự quyết cooldown; Q21/Q22 chốt tiếp. |
| Q21 | Hai phụ có cooldown? | Có, **riêng từng skill**; không chung cooldown, thông số/start/cancel còn mở. |
| Q22 | Main có cooldown kỹ năng? | Không thêm cooldown kỹ năng riêng; dùng attack/cast cadence, nova theo nhịp, channel duy trì; vẫn timing/điều kiện thật. |
| Q23 | Dùng mana/resource chung không? | **Không** cho ba skill; không thay tên thành energy/heat/stamina. Dash/bình/proc riêng của hệ cũ chưa bị quyết qua câu này. |
| Q24 | Trùng support loại? | Cùng skill tối đa1/loại; giữa skill khác được trùng nếu tương thích. |
| Q25 | Một bản support dùng chung? | **Một bản chỉ gắn một skill**; cần hai bản cho hai skill. User thêm **phân giải bản dư → nguyên liệu nâng skill**. |
| Q26 | Nguyên liệu/cấp nâng giữ vĩnh viễn? | Chỉ trong lượt, giữ qua node, reset khi chết/thắng/kết thúc chủ động; nghỉ/restart theo checkpoint đầu node. |
| Q27 | Model nâng cấp? | Ba active **cấp1–5**, tăng hiệu lực chính theo skill, chi phí tăng dần; support bản đầu **không level riêng**. Chưa price/yield/multipliers/refund. |
| Q28 | Bộ khởi đầu? | User sửa thành **nhận random**: mainLv1 + phụLv1 + 1 bản support hợp main; phụ2 trống, ô support3/2/2 mở sẵn. Từ catalog đã mở; starter pool chưa chốt. |
| Q29 | Thưởng trong lượt random trực tiếp hay chọn? | **Random tối đa3/lấy1** ở mốc quan trọng; pool nhỏ hiện số thật, ưu tiên có hướng hợp build nếu pool cho phép. Khác bộ đầu random trực tiếp. |
| Q30 | Nguồn/cadence draft mỗi map? | Node1–8: **1 mốc từ tiến độ clear blue/amber + 1 sau Boss** (amber đóng góp hơn). Boss đầu bảo đảm lựa chọn lấp phụ2 nếu trống. Node9 có mốc trong map, sau final chỉ thưởng hoàn thành. |
| Q31 | Giữ slot Mutation/Curse riêng? | **Không trong rework đầu**; reward build Q30 thay nguồn M/C từ blue/amber ban đầu. Ý tưởng cũ chỉ chuyển từng nội dung nếu được duyệt. |
| Q32 | Giữ lớp Sigil/Branch riêng? | **Không trong rework đầu**; nguyên tố nếu có thuộc skill/support, không roll Legacy offer/Core+Branch độc lập. Không tự port cả6/12 hoặc xóa save/approval cũ. |
| Q33 | Anomaly ở đâu? | Gộp thành **modifier/đặc tính node**, xem trước/chọn tuyến; bỏ lượt chọn giữa trận ở135s. Không tự port cả6/VFX. |
| Q34 | Ascension? | **0–4**, đầu mở0, chọn trước lượt; thắng cả tree ở mức cao nhất mở mức kế, vẫn chọn thấp hơn. Bỏ gate6Sigil/không port Seal cũ; tuning/reward/migration chưa chốt. |
| Q35 | Node buff/debuff nhận/cộng thế nào? | **1 buff + 1 debuff/node**, nhận khi bắt đầu node, giữ hết lượt/final; cùng loại cộng tới cap, không nhân lũy thừa ngầm; có counterplay, không khóa main/Dash/bình. **Đã user “y” 2026-11-14.** |

## Phần còn mở — không được tự chốt

- Q36 tiếp theo: thời điểm đổi/gắn skill-support/nâng/phân giải, cách giữ hoặc hoàn đầu tư khi đổi; **chưa hỏi/chưa có câu trả lời**, không tạo approval giả. Cần recommend model có xử lý lạm dụng đổi skill để bỏ cooldown nhưng không tự hardcode rule.
- Compatibility/support tradeoffs/proc caps, cap shield/CC/trụ/cadence/hazard, giá nâng/yield/level mapping. Không có mana để làm tradeoff. Thông số cần bảng spec user review, không tự accepted.
- Auto target/line-of-sight/manual override, vừa đi vừa đánh/channel, cast priority/cancel/hold-release/pause/blur; UI/vi-en và mobile/desktop contract.
- Catalog mở sẵn/nguồn unlock/meta choices/nhịp đi sâu/hết unlock/final rewards; quay lại Q11 sau khi rõ loại thưởng. Reward build tạm không đồng nghĩa permanent reward.
- Tree đường nối/sinh tuyến/khóa lựa chọn chi tiết; modifier catalog/cap/tương thích; difficulty curve/Ascension modifiers và reward.
- Map quy mô/biome/layout/minimap; white/blue/amber roles/pack composition/density/aggro/leash/respawn; tiến độ mở Boss/chuyển node/loot pending; Boss roster/pattern/final.
- Bình máu charge/nạp/lượng hồi/Boss không adds; hồi giữa node/sustain/anti-heal. Save crash/reload/journal/migration và flow/tutorial/audio/history/cosmetic cũ.
- Scope content/approved art references/performance/device/acceptance bản đầu. Giữ skill game-art/Harness gates khi sang visual; B1 cũ không tự mở.
- Sau Q26 từng báo **ước lượng24 quyết định lớn**, không số cam kết khi scope đổi/chi tiết cần tách. Không bỏ coverage để ép đủ số. Chưa tính duyệt spec/visual/playtest, **không có quyền code chỉ vì gần hết câu hỏi**.

## Checkpoint compact

Q35 ghi nhận từ user “y” + “btw compact context đi, chú ý giữ các câu hỏi”. Lưu bản ngắn này, rút CURRENT của HANDOFF để đọc nhanh; log đầy đủ không cắt/xóa Q01–Q34, chỉ ghi kết quả Q35. Chỉ Markdown, kiểm diff/đủ câu hỏi và links, không build/test/deploy/DDR/art/runtime. Không tuyên bố công cụ đã kích hoạt compact nếu chưa có kết quả thực tế từ app.
