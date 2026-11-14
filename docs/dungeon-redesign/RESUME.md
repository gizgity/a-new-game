# Tiếp tục sau compact — Dungeon/Skill Rework

Snapshot: DUNGEON-REVIEW-01 V1 / log R71 · C08 ĐÃ CHUẨN BỊ12MỤC · 2026-11-14 · tiếng Việt.

## Đọc và tiếp tục

- **Chỉ dẫn mới nhất C08:** user “ok chuẩn bị đi, t review”. [REVIEW_V1.md](REVIEW_V1.md) đã có đủ12proposal, tất cả Proposed;0được duyệt/12chờ review. Không tiếp tục soạn riêng R01 hoặc mở code. C07 giữ cách đếm: user muốn phần còn thiếu ở dạng câu hỏi để dễ đọc/kiểm tra. [REVIEW_QUEUE.md](REVIEW_QUEUE.md) liệt kê **12mục reviewR01–R12,0/12đã review/12còn lại**. Mỗi mục một proposal/bảng hoàn chỉnh rồi một câu chốt; không hỏi lại contract hoặc chia từng số/skill/edge case thành câu mới. “0 câu” của agent đã được đính chính;12là mục thiết kế, không số vòng visual/playtest.
- Đọc CURRENT của `HANDOFF.md` và file này trước. Toàn bộ câu hỏi/recommend/câu trả lời/supersede nằm trong [DESIGN_CHECKLIST.md](DESIGN_CHECKLIST.md), **giữ đầy đủ Q01–Q61/C01–C08**. Q61 vẫn thu hồi, không duyệt chi tiết mới từ lời phàn nàn; exact input Proposed đưa phụ lục R01/R10.
- Sau Q26 agent đã hỏi **35ID mới Q27–Q61**, vượt ước lượng23–24 chưa tính làm rõ. Ước lượng/countdown cũ được giữ trong log lịch sử nhưng không còn là dự báo; lỗi chia nhỏ/tracking của agent, không quy cho user đổi scope.
- **Q36 đã chốt**, user “y, nhưng note có thể sẽ cân bằng lại sau khi nghiệm thu”: chỉnh build tại chuẩn bị/mốc thưởng/sau Boss, cấp theo ô để skill thay vào kế thừa, chuyển support tương thích miễn phí, phân giải dư thủ công, không reset cooldown/charge/tạo effect miễn phí. Làm rõ kế thừa Q27; **có thể cân bằng lại sau nghiệm thu**, không tự tune hoặc suy experience acceptance.
- **Q37 đã chốt**: support theo đặc tính skill, lợi ích kèm đánh đổi, cho combo mạnh nhưng chặn vòng lặp vô hạn/khóa Boss vĩnh viễn/bất tử liên tục. Chưa bảng tương thích/trị số/cap approved.
- **Q38 đã chốt**: main auto lấy quái gần nhất hợp lệ khi cần target mới, giữ target ổn định; ngắm tay ưu tiên lúc giữ, thả về auto nếu bật. Trong tầm/camera/không tường, không tự di chuyển/ưu tiên elite; nova theo vùng thật. Gesture/input/channel còn mở.
- **Q39 đã chốt**: vừa đi vừa đánh, channel đi chậm hơn; Dash ngắt hành động khi được phép, phụ manual ngắt main; main trở lại sau đó khi auto hoặc giữ đánh manual. Auto-off giữ để đánh/thả dừng. Ngắt không hoàn tài nguyên/cooldown hoặc tạo hit/nhịp miễn phí. Chưa số/timing/input mapping approved.
- **Q40 đã chốt:** catalog đầu8mục (melee/projectile; burst/khiên; area/nhịp/cường hóa/hồi chiêu), dùng điểm meta riêng chủ động mở9mục còn lại; unlock bổ sung pool từ hành trình sau, không stat vĩnh viễn. Bộ đầu vẫn random3mục Q28; nguồn/settlement đã chốt Q41, chỉ giá/trị số còn cần đặc tả.
- **Q41 đã chốt, giải quyết Q11:** hạ Boss clear node chốt điểm meta ngay/giữ100% dù chết hoặc dừng; node chưa clear không điểm; nấc sâu nhiều hơn/final bonus; mỗi node chỉ thưởng một lần/hành trình, không nhân bằng restart. Trị số/giá chưa chốt. Q11 gốc giữ nguyên log tạm gác lịch sử, không hỏi lại settlement.
- **Q42 user thu scope về Ascension0–4 trước**, “scope ở ascension trước đi, đã có art đâu mà làm cosmetic”. **Cosmetic/badge/trail/đổi điểm/mở rộng Collection-Challenge ngoài scope**, không duyệt trọn proposal cũ. Điểm dư sau full catalog chưa chốt công dụng, không tự đổi/ngừng phát/xóa hoặc thêm sink; Q40–Q41 giữ nguyên.
- **Q43 đã chốt:** Ascension1–4 tăng vừa HP/damage và tỷ lệ blue/amber trên baseline0, tree9/budget tổng/timing báo đòn/cửa né giữ chung; không roster/art/đòn riêng theo cấp hoặc thêm draft/modifier. Multiplier/tỷ lệ/budget cụ thể còn mở.
- **Q44 đã chốt:** đầu chọn bất kỳ node nấc1; mỗi node1–2đường sang nấc kế, có tách/nhập/đoạn một lối, mọi nấc8 nối final9. Không ngõ cụt/node vô tuyến, tree cố định/xem toàn bộ; preview không chốt, bắt đầu dungeon mới khóa node cùng nấc/nhận modifier. Chưa thuật toán/layout/phân bố modifier.
- **Q45 đã chốt:** tuyến chính uốn khúc tới khu Boss, khoảng giao chiến rộng, ít nhánh phụ ngắn/vòng nối để đánh thêm; liền mạch/không mê cung hoặc buộc mò nhánh phụ. Minimap khám phá dần/Boss hiện khi tìm thấy. Size/biome/art/generation còn mở.
- **Q46 đã chốt:** mở Boss bằng tiến độ hạ quái có trọng số, khởi điểm tuning~75%giá trị map, không timer/100%; tuyến chính bảo đảm đủ boss-progress và elite-draft, nhánh tùy chọn. Đủ thanh mở khu Boss cuối tuyến, người chơi chủ động vào, không tự spawn/teleport. Tách thanh Boss và draft Q30; ngưỡng cuối/khóa cửa/bầy chase còn mở.
- **Q47 đã chốt cả phần làm rõ:** white+đầu đàn white/blue/amber; thêm biến thể hiếm lính blue+đầu đàn amber, không thay mọi bầy amber. Vẫn3rarity; đầu đàn blue1/amber2đặc tính tương thích, affix lính blue/count/roster/art chưa chốt. User “y” theo recommend phần làm rõ.
- **Q48 đã chốt:** bầy bố trí sẵn/gặp cả bầy; gần hoặc đánh trúng đánh động bầy, aggro cục bộ/tường chắn phát hiện; kéo nhiều bầy được, leash quá xa về khu đầu; chết không respawn, đầu đàn chết lính vẫn đánh. HP reset/distance/count/FPS/Boss leash còn mở.
- **Q49 user đổi/chốt:** bình charge liên tục, đủ cost1lần được dùng/không cần đầy; sức chứa=2,5×cost. Ví dụ100/40 chỉ minh họa (2lần còn20/thêm20đủ lần3). Kills nạp charge, Boss có ít quái cấp thấp để nạp; **bỏ3lượt rời và cấp charge trực tiếp50%**. Lượng/nhịp hồiHP, charge-per-kill, khởi đầu/giữa node chưa chốt;35%ngay không là approval.
- **Q50 đã chốt:**3đợt white nhỏ tại Boss75/50/25%lần đầu, mỗi đợt target charge~0,5lần dùng/nhất quán white ngoài map, không spawn vô hạn; Boss vẫn nhận damage/không bắt dọn lính, mỗi mốc một lần/adds chỉ charge. Count/stats/art/skip nhiều mốc còn mở.
- **Q51 đã chốt:** start đầyHP/charge, sau Boss thành công hồi đầy để đi tiếp; phụ/Dash sẵn sàng node mới, dọn effect combat tạm, giữ build/cấp/nguyên liệu/modifier node. Không refill miễn phí trước Boss/không revive. Transition chi tiết còn mở.
- **Q52 đã chốt baseline/làm rõ:**100/40charge;35%HP ngay+20%trong4s/5%maxHP/s, uống lại thay HoT cũ/phần chưa hồi cũ mất/không stack hoặc queue; hit không hủy/fullHP kết thúc. Kill white4/blue8/amber20charge, overflow bỏ/đầyHP không tiêu/bấm1lần/reuse0,5s;5white/add-wave=20charge. Baseline để thử/tuning, không balance nghiệm thu.
- **Q53 đã chốt:**3Boss thường áp sát/bắn xa/kiểm soát vùng (2–3đòn) cho nấc1–8/tránh lặp liên tiếp,1final riêng2pha tại9; pool cố định/xem trước/scaling theo độ sâu-Ascension. Ngoại hình/đòn/assets/phase threshold còn cần duyệt riêng.
- **Q54 đã chốt:** vào Boss khóa trận/quái-đạn ngoài không vào/không ra farm charge; thắng khi còn sống kết thúc combat/dọn threats để nhận thưởng an toàn.1–8 chốt meta/hồi/draft pending+Boss/chỉnh build/chọn tree/xác nhận node rồi chuyển;9 tổng kết. Save/reward queue/death đồng thời cần spec riêng.
- **Q55 USER ĐỔI HƯỚNG:** “dựa theo cảm giác và triển khai số bầy như của POE giai đoạn đi atlas”. Lấy Atlas mapping làm reference mật độ/nhịp clear, làm việc với giả định PoE1; count/spacing/rarity cần gameplay reference đại diện+actual tuning chung hai nền tảng. **Bộ số10–16/12–24bầy/60-30-10%/max1blue+amber-map CHƯA APPROVED**; không gán là count chuẩn PoE. Research GGG Atlas/PoEDB Maps có pack count/size/rarity modifiers, không đo footage/count hoặc duyệt target cụ thể. Không tự mở code từ chữ “triển khai” trong brainstorm.
- **Q56 đã chốt model/cap chặng:**1–2cap1/3–4cap2/5–6cap3/7–9cap4, roll1..cap không bắt đầy/range-tổ hợp hợp sức mạnh chặng/cap tổng effect. Random/tham khảoPoE thay1+1Q35/không pool6+6; tree cố định/xem trước/nhận khi vào node/giữ tới final/cộngcap/counterplay. Catalog/giá trị/cap effect/probability còn cần duyệt, không tự copy mana/reflect/loot/hazard/art.
- **Q57 đã chốt:** túi build không cap ô, active mỗi skill1bản/draft không trùng owned/hai phụ khác active; support nhiều bản/giữ dư hoặc salvage thủ công, không hiệu lực khi chưa gắn. Giữ qua node/reset cuối lượt/checkpoint node dở, timing đổi Q36. UI/yield/pool weighting còn mở.
- **Q58 đã chốt:** reload/crash node dở về entry Q04–Q06; sau Boss có reward pending thì tiếp đúng offer/chỉ claim một lần, đã nhận chưa đi tiếp thì tree/build đã lưu; không reroll/dupe. Death/win/end terminal không undo. Schema/storage/migration còn mở.
- **Q59 user chốt “làm mới hết”**: toàn bộ data/progression/settings rework mới, không import/quy đổi/migration hoặc legacy archive UI. Catalog8/Asc0/điểm0/default settings mới; không reset rework mỗi buổi. Production/main/browser save hiện tại ngoài scope phát triển nhánh riêng, không xóa ngay/làm lại repo/art từ câu này; lịch sử approvals giữ nguyên.
- **Q60 đã chốt:** draft giữa map báo pending/người chơi mở, pause toàn gameplay/timers/HoT-CD khi chọn/chỉnh build, xử lý pending trước Boss/chuyển node. Resume chặn input cũ/click xuyên, auto theo mode; blur tựpause/trở lại bấm tiếp. Layout/mapping/pause audio còn mở.
- **Q61 THU HỒI CÂU RIÊNG:** vai trò/target/movement/pause đã chốt Q14–Q16/Q38–Q39/Q60, không hỏi lại. Exact keys và gesture mới chưa có approval, đưa Proposed vào bảng input chung; không giữ Q61 như blocker hoặc tự hỏi Q62.
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
| Q11 | Thưởng vĩnh viễn chốt sau từng dungeon? | Gốc tạm gác để rõ build/thưởng trước; **đã giải quyết settlement bằng Q41**, giữ log lịch sử Q11. |
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
| Q27 | Model nâng cấp? | **Cấp1–5/tăng hiệu lực chính/chi phí tăng dần**, support không level riêng. **Q36 đã làm rõ cấp theo ô active, skill thay vào kế thừa**; chỉ price/yield/multipliers còn cần spec. |
| Q28 | Bộ khởi đầu? | User sửa thành **nhận random**: mainLv1 + phụLv1 + 1 bản support hợp main; phụ2 trống, ô support3/2/2 mở sẵn. Từ catalog đã mở; starter pool chưa chốt. |
| Q29 | Thưởng trong lượt random trực tiếp hay chọn? | **Random tối đa3/lấy1** ở mốc quan trọng; pool nhỏ hiện số thật, ưu tiên có hướng hợp build nếu pool cho phép. Khác bộ đầu random trực tiếp. |
| Q30 | Nguồn/cadence draft mỗi map? | Node1–8: **1 mốc từ tiến độ clear blue/amber + 1 sau Boss** (amber đóng góp hơn). Boss đầu bảo đảm lựa chọn lấp phụ2 nếu trống. Node9 có mốc trong map, sau final chỉ thưởng hoàn thành. |
| Q31 | Giữ slot Mutation/Curse riêng? | **Không trong rework đầu**; reward build Q30 thay nguồn M/C từ blue/amber ban đầu. Ý tưởng cũ chỉ chuyển từng nội dung nếu được duyệt. |
| Q32 | Giữ lớp Sigil/Branch riêng? | **Không trong rework đầu**; nguyên tố nếu có thuộc skill/support, không roll Legacy offer/Core+Branch độc lập. Không tự port cả6/12 hoặc xóa save/approval cũ. |
| Q33 | Anomaly ở đâu? | Gộp thành **modifier/đặc tính node**, xem trước/chọn tuyến; bỏ lượt chọn giữa trận ở135s. Không tự port cả6/VFX. |
| Q34 | Ascension? | **0–4**, đầu mở0, chọn trước lượt; thắng cả tree ở mức cao nhất mở mức kế, vẫn chọn thấp hơn. Bỏ gate6Sigil/không port Seal cũ; tuning/reward/migration chưa chốt. |
| Q35 | Node buff/debuff nhận/cộng thế nào? | Nhận khi bắt đầu node/giữ tới final/cộngcap/counterplay đã chốt. **Phần1buff+1debuff cố định đã bị Q56 thay bằng random có cap**, giữ log approval lịch sử. |
| Q36 | Đổi build và giữ đầu tư thế nào? | **Đã chốt** chỉnh ở chuẩn bị/mốc thưởng/sau Boss, cấp theo ô, chuyển support tương thích miễn phí, phân giải thủ công; đổi không reset cooldown/charge/tạo effect miễn phí. **Có thể cân bằng lại sau nghiệm thu**. |
| Q37 | Support tương thích/đánh đổi thế nào? | **Đã chốt** theo đặc tính skill, lợi ích kèm đánh đổi, cho combo mạnh nhưng chặn vô hạn/khóa Boss vĩnh viễn/bất tử liên tục. Bảng/trị số/cap chưa chốt. |
| Q38 | Auto target/ngắm tay thế nào? | **Đã chốt** gần nhất hợp lệ/giữ ổn định, trong tầm/camera/không tường; giữ ngắm tay ưu tiên/thả về auto nếu bật; không tự di chuyển/chọn elite thay người chơi. |
| Q39 | Vừa đi vừa đánh/ngắt đòn thế nào? | **Đã chốt** đi và đánh, channel đi chậm; Dash ưu tiên/phụ ngắt main, auto-off giữ đánh/thả dừng; không hoàn cooldown/tài nguyên hoặc tạo hit/nhịp miễn phí khi ngắt. |
| Q40 | Catalog đầu và meta unlock thế nào? | **Đã chốt** mở sẵn8mục, điểm meta riêng tự chọn mở9mục còn lại, không trùng unlock/stat vĩnh viễn, áp pool hành trình sau. Nguồn/giá/settlement chưa chốt. |
| Q41 | Quay lại Q11: điểm meta nhận/giữ khi nào? | **Đã chốt** clear Boss chốt ngay/giữ100%; node dở không điểm, đi sâu nhiều hơn/final bonus; một node thưởng một lần/hành trình, không nhân bằng restart. Trị số/giá chưa chốt. |
| Q42 | Mục tiêu/thưởng sau full catalog? | **User thu scope về Ascension0–4 trước**; cosmetic/badge/trail/đổi điểm/Collection-Challenge mở rộng ngoài scope. Công dụng điểm dư chưa chốt. |
| Q43 | Ascension tăng độ khó bằng gì? | **Đã chốt** HP/damage vừa phải và tỷ lệ blue/amber tăng; tree9/budget tổng/timing báo đòn/cửa né giữ chung, không art/đòn riêng theo cấp. Trị số cụ thể còn mở. |
| Q44 | Đường nối/khóa lựa chọn tree? | **Đã chốt**1–2đường sang nấc kế/tách-nhập, không ngõ cụt, nấc8 về final9; tree cố định, preview không khóa, bắt đầu dungeon mới chốt. |
| Q45 | Layout bên trong dungeon? | **Đã chốt** tuyến chính uốn khúc/khoảng rộng/nhánh phụ ngắn-vòng nối; minimap khám phá dần, không buộc mò nhánh phụ tới Boss. |
| Q46 | Điều kiện mở Boss? | **Đã chốt** tiến độ kill có trọng số~75%giá trị map để tuning, không timer/100%; tuyến chính đủ mốc Boss/draft, chủ động vào khu Boss sau mở, tách draft Q30. Ngưỡng cuối còn mở. |
| Q47 | Rarity và thành phần bầy? | **Đã chốt** white+đầu đàn white/blue/amber; thêm biến thể hiếm **blue+amber**, không thay mọi amber. Vẫn3rarity, chưa count/affix lính blue. |
| Q48 | Spawn/aggro/leash/respawn? | **Đã chốt** bầy bố trí sẵn/đánh động cả bầy/cục bộ, kéo nhiều bầy, leash quá xa, chết không respawn/đầu đàn chết lính vẫn đánh. HP reset/count/distance còn mở. |
| Q49 | Bình máu trong map/Boss? | **User chốt charge liên tục**, sức chứa2,5×cost, đủ cost dùng ngay, Boss có quái cấp thấp nạp charge. Bỏ3lượt rời/cấp trực tiếp50%; heal amount/timing còn mở. |
| Q50 | Nhịp adds Boss để nạp bình? | **Đã chốt**3đợt white75/50/25%HP, mỗi đợt~0,5lần dùng charge, hữu hạn/không bắt dọn/Boss không bất tử, chỉ charge. Count/trị số cuối còn mở. |
| Q51 | Hồi sau Boss/giữa node? | **Đã chốt** start/sau Boss thành công đầyHP-charge, node mới phụ/Dash sẵn sàng/dọn combat effect tạm, giữ build/modifier; không refill trước Boss/revive. |
| Q52 | Baseline heal/charge bình? | **Đã chốt**100/40charge,35%ngay+20%/4s/refresh không stack/hit không hủy/fullHP kết thúc; kill4/8/20charge/reuse0,5s/5white-add-wave. Baseline tuning, không nghiệm thu balance. |
| Q53 | Pool Boss bản đầu? | **Đã chốt**3Boss thường áp sát/bắn xa/kiểm soát vùng cho1–8,1final2pha ở9; tránh lặp liên tiếp, ngoại hình/moves/assets duyệt riêng. |
| Q54 | Khóa trận Boss/clear/transition? | **Đã chốt** khóa khu Boss/cách ly địch ngoài; thắng dọn threats/chốt meta-hồi-draft-build-tree/xác nhận rồi chuyển; final tổng kết. |
| Q55 | Quy mô/mật độ map? | User chọn **cảm giác/mật độ Atlas PoE**, count/spacing/rarity theo reference+actual tuning. Bộ quota10–16/12–24/60-30-10/max1variant chưa approved. |
| Q56 | Pool modifier node đầu? | **Đã chốt** random/tham khảoPoE,1–2/3–4/5–6/7–9→cap1/2/3/4/roll1..cap/range-tổ hợp hợp chặng/cap tổng effect, thay1+1Q35. Catalog/trị số chưa duyệt. |
| Q57 | Túi build/bản trùng? | **Đã chốt** túi không cap ô, mỗi active1bản/không draft owned/hai phụ khác skill; support nhiều bản/giữ hoặc salvage thủ công; giữ qua node/reset cuối lượt. |
| Q58 | Reload/crash/reward pending? | **Đã chốt** node dở về entry; Boss clear/reward pending tiếp đúng bước-offer/claim một lần; nhận rồi về tree/build đã lưu, không reroll/dupe hoặc undo terminal. |
| Q59 | Save/progression cũ và rework? | User chọn **làm mới hết data/progression/settings**, không migrate/import/archive; production trong thời gian nhánh riêng vẫn ngoài scope. |
| Q60 | Draft/pause giữa map? | **Đã chốt** thưởng pending/chủ động mở/pause toàn gameplay; giải quyết trước Boss/chuyển node, chặn input cũ; blur pause/bấm tiếp mới resume. |
| Q61 | Input/aim/cancel phụ hai nền tảng? | **Thu hồi câu hỏi riêng theo C06**; dùng Q14–Q16/Q38–Q39/Q60 đã chốt. Keys/gesture mới còn Proposed trong bảng input, không suy user approval. |

## Bản review đã chuẩn bị — chờ phản hồi

Theo user yêu cầu mới C07, bốn gói này đã chia thành **12câu review hữu hạn** tại [REVIEW_QUEUE.md](REVIEW_QUEUE.md). Bản V1 đã gắn nguồn Q đã chốt và đánh dấu Proposed cho nội dung chưa duyệt; không tự Approved hoặc mở code. Không tách bảng thành thêm câu lẻ.

| Gói | Nội dung cần đưa ra để review |
| --- | --- |
| Skill/support và điều khiển | Skill cards/compatibility/tradeoff/proc caps, timing/targeting/input matrix; kế thừa Q13–Q29/Q36–Q39/Q57/Q60, không hỏi lại vai trò/mana/CD/aim |
| Economy/balance/modifier | Yield/chi phí nâng/giá unlock/điểm theo nấc, đường cong khó; catalog-range-cap effect theo PoE/chặng Q56. Rule nguồn/giữ-mất đã chốt, số baseline chưa là balance nghiệm thu |
| Map/quái/Boss/reference | Reference Atlas đại diện/định lượng density, roster/affix/Boss moves-phase/geometry; quota cũ Q55 không approved, chưa đo footage/FPS hoặc duyệt artwork |
| Flow/visual/phân việc | Bảng UI-state/save/input edge cases, tutorial/audio thích nghi, reference/mockup/task cards và acceptance touch/desktop theo Harness |

- Cosmetics/điểm dư thành cosmetic/legacy archive/migration đã ngoài scope hoặc để sau Q42/Q59; không dùng như câu hỏi/blocker bắt buộc cho core. Không tự thêm armor/crit/gear/currency hay hệ mới chỉ vì chưa từng hỏi.
- Cập nhật count theo12mục đã liệt kê sau mỗi lần review; không hỏi lại những gì index đã có hoặc chia mỗi thông số thành một lượt. Nếu scope mới thật sự ngoài danh sách, nêu rõ thay đổi trước khi tăng count; không giữ countdown cũ bằng giả định.
- Trước formal spec/art/code đọc CURRENT, Master Plan, Harness, Design Bible, Reference Protocol và đúng card. B1 cũ vẫn PAUSED/REVERTED; brainstorm approval không là production/visual/playtest approval.

## Checkpoint rà soát C06

Giữ đủ61ID Q01–Q61 vàC01–C08;Q61 thu hồi, danh sách còn thiếu dùngR01–R12chưa review, không tự có thêmQ62. Audit xác nhận35ID sauQ26;ước lượng23–24 và câu“0”đã được đính chính. Chỉ notes, không build/tests/deploy/DDR/art/runtime; package-lock/main giữ nguyên. Next action hiện hành: user review bản V1 theo R01–R12, ghi phản hồi đúng ID. Request compactQ35 là lịch sử, không tuyên bố compact mới.

## Checkpoint C08 — DUNGEON-REVIEW-01 V1

Đủ12mục có recommend/bảng cụ thể; [task card](../combat-v2/tasks/DUNGEON-REVIEW-01.md). Proposal chưa duyệt, target visual mới chưa có, chưa đo Atlas footage/runtime/FPS. Chỉ docs; không sửa main/runtime/assets/DDR/Art Bible/package-lock hoặc deploy. NEXT ACTION: chờ user review R01–R12 và ghi kết quả; không tự chuyển sang implementation.
