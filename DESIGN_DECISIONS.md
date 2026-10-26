# Design Decisions Registry (DDR)

Nguồn sự thật cho **quyết định mới từ sau Release**. Khởi tạo ngày 2026-10-26 theo task Design Memory & Art Consistency System; **0 decision, ID tiếp theo DD-0001**. Không backfill Q7A–Q8C hoặc bất kỳ lịch sử trước Release. Task tạo hệ thống này không tự là một decision được ghi.

## Quy tắc

- Chỉ ghi qua lời gọi rõ ràng `$design-decision` kèm nội dung user đã chốt và nguồn kiểm chứng. Không auto-trigger từ thảo luận, code, handoff hay prompt chỉ nhắc tên skill.
- Append-only: không sửa/xóa entry cũ, không tái sử dụng ID. Mỗi thay đổi nội dung hoặc trạng thái tạo decision mới, ID bằng max ID hiện có + 1 (padding tối thiểu 4 chữ số); kiểm lại HEAD/registry trước commit để tránh trùng khi có người ghi đồng thời.
- Trạng thái quyết định: `Proposed`, `Approved`, `Deferred`, `Rejected`, `Superseded`. Chỉ ghi trạng thái được bằng chứng user hỗ trợ. Agent không tự chốt hoặc suy đoán approval.
- Trạng thái implementation và acceptance theo dõi riêng trong HANDOFF/task evidence; Approved không có nghĩa đã triển khai, visual approved không có nghĩa playtest accepted.
- `Supersedes: None` hoặc danh sách ID cũ. Trạng thái hiệu lực của một chuỗi được đọc từ entry mới nhất có nguồn hợp lệ; entry cũ giữ nguyên trạng thái lịch sử. Decision mới thay quyết định cũ phải chỉ rõ phần thay thế; không dùng Superseded cho quyết định kế nhiệm đang Approved. Nếu user chỉ chốt đánh dấu một entry Superseded mà chưa có nội dung kế nhiệm, ghi event mới trạng thái Superseded, liên kết ID cũ, không tự bịa phương án thay thế. Proposed/Deferred/Rejected không tự vô hiệu hóa Approved trước đó.
- Nguồn phải có quote chính xác, ngày, người chốt, link message hoặc đường dẫn evidence/commit + scope. Nếu chỉ có hội thoại hiện tại không có permalink, ghi rõ “hội thoại task hiện tại, không có permalink”, quote nguyên văn và ngày; không chế URL. Thiếu ngày/Release boundary/approval/scope thì báo phần thiếu, không ghi entry suy đoán.
- Release boundary đã xác minh từ HANDOFF trên main@bcd148b: v0.1.0, target4770bf617f292c407685c4fbed1ebf5d3c6cb84f, published2026-10-26T16:46:46Z; https://github.com/gizgity/a-new-game/releases/tag/v0.1.0 . Không lấy Q8C deploy hoặc ngày tạo registry làm Release. Mỗi lần ghi phải có bằng chứng nội dung thuộc sau Release. Artwork accepted trước Release được audit trong ART_BIBLE.md, không nhập DDR.

## Mẫu entry (không phải decision)

```markdown
### DD-<số> — <tên>
- Ngày: YYYY-MM-DD (ngày user chốt; ngày ghi nếu khác)
- Trạng thái: Proposed | Approved | Deferred | Rejected | Superseded
- Quyết định: <nội dung user đã chốt>
- Lý do: <user nêu; nếu chưa nêu ghi “Chưa được user cung cấp”>
- Phạm vi: <áp dụng và giới hạn>
- Nguồn: <người, quote, ngày, permalink/evidence, bằng chứng sau Release>
- Supersedes: None | DD-...
- Theo dõi implementation/acceptance: <link task/handoff; chưa có thì ghi chưa có>
```

## Registry

_Registry khởi tạo rỗng; decision mới được append bên dưới. Không chép ví dụ vào registry._

### DD-0001 — CURSEBREAK Legacy V1

- Ngày: 2026-10-26 (ngày user chốt và ngày ghi).
- Trạng thái: **Approved — Design Only** (`Approved` trong schema DDR; chỉ duyệt thiết kế).
- Quyết định: toàn bộ contract Legacy V1 ở các mục 1–7 dưới đây.
- Lý do: Chưa được user cung cấp.
- Phạm vi: CURSEBREAK Legacy V1; chỉ ghi tài liệu, không implementation, không sửa gameplay, Art Bible hay roadmap; không backfill lịch sử trước Release.
- Nguồn: user, ngày 2026-10-26, **hội thoại task hiện tại, không có permalink**; invocation nguyên văn: “$design-decision — CURSEBREAK Legacy V1”; chỉ thị nguyên văn: “Đọc AGENTS.md và skill $design-decision. Ghi toàn bộ quyết định dưới đây vào DESIGN_DECISIONS.md, dùng ID tiếp theo, trạng thái Approved — Design Only.”; giới hạn nguyên văn: “Documentation only. No implementation.” Nội dung các mục 1–7 ghi lại kết luận user cung cấp trong cùng message, không phải thiết kế tự đề xuất của agent.
- Bằng chứng sau Release: đây là quyết định mới được user giao trong task hiện tại sau khi registry đã được khởi tạo trên main@66254cd; Release boundary đã xác minh tại HANDOFF/DDR là [v0.1.0](https://github.com/gizgity/a-new-game/releases/tag/v0.1.0), target `4770bf617f292c407685c4fbed1ebf5d3c6cb84f`, published `2026-10-26T16:46:46Z`. Không lấy deploy/ngày khởi tạo registry làm Release, không nhập lịch sử Q7A–Q8D.
- Supersedes: None.
- Theo dõi implementation/acceptance: [HANDOFF.md](HANDOFF.md#legacy-v1-status). Chưa triển khai Legacy V1; chưa có implementation/visual/playtest acceptance cho Legacy V1. Approval thiết kế không cấp phép tự mở implementation.

#### 1. Elemental Legacy

- **Controlled Power Growth**; không tích lũy stat vô hạn.
- 6 Sigil, mỗi loại 2 Branch:

| Sigil | Core / cơ chế | Branch 1 | Branch 2 |
| --- | --- | --- | --- |
| Fire | Ignite | Wildfire | Furnace |
| Water | Soaked | Undertow | Flow State |
| Lightning | Perfect Dodge | Arc Relay | Overclock |
| Ice | Frostbite/Shatter | Brittle | Crystal Echo |
| Shadow | Dodge/Ambush | Nightfall | Veilstep |
| Wind | Momentum | Tailwind | Cyclone |

- Mỗi run: 1 Sigil + tối đa 1 Branch (ngoại lệ run #1 theo mục 2).
- Không có phản ứng chéo giữa các nguyên tố trong V1.
- Giữ nguyên 4 Mutation + 2 Curse và combat hiện tại.

#### 2. Run & Unlock Loop

- Run #1: không Sigil, không Anomaly.
- Victory #1: nhận 2 Sigil cơ bản ngẫu nhiên khác nhau.
- Victory tiếp theo: 1 unlock ngẫu nhiên chưa sở hữu, không trùng; Defeat không thưởng.
- Branch chỉ unlock sau Sigil tương ứng; Sigil chưa có Branch dùng Core.
- Đầu mỗi run từ #2: RNG đưa ra 2 bộ Sigil+Branch hợp lệ khác nhau, chọn 1. Roll Sigil trước rồi Branch để tránh thiên vị.
- Giữa run (~2:15): RNG đưa ra 2 Anomaly khác nhau, chọn 1; pause simulation và tránh trùng các Draft/transition.
- Restart/refresh giữ ticket, seed và offers đến Victory/Defeat. Defeat/Victory đóng ticket; run kế tiếp tạo roll mới.

#### 3. Weighted RNG

- Victory reward: chỉ xét unlock chưa sở hữu, đủ dependency.
- Trọng số từng unlock: Sigil **5**, Branch **3**, Anomaly **2**.
- Pity: sau **3 Victory liên tiếp** không nhận Sigil mới, nếu còn Sigil chưa mở thì Victory tiếp theo bảo đảm Sigil.
- Run offers: không trùng nhau; giảm xác suất Sigil/Anomaly vừa xuất hiện, không loại hoàn toàn.
- Không reroll miễn phí qua Restart.

#### 4. Arena Anomalies

- 6 Anomaly V1; 2 mở sẵn nhưng chỉ hoạt động từ run #2.
- 4 Anomaly còn lại mở qua Victory.
- Mỗi Anomaly phải có benefit + drawback, buộc thay đổi chiến thuật; không chỉ cộng/trừ stat.
- Pool đề xuất của user:

| Anomaly | Benefit | Drawback |
| --- | --- | --- |
| Fractured Storm | Sét đánh trúng quái | Sét cũng đánh trúng player |
| Blood Moon | Melee finisher hồi tài nguyên | Quái truy đuổi tích cực |
| Volatile Ground | Detonate lan rộng | Sàn có vùng nổ |
| Static Field | Perfect Dodge phản kích | Projectile dày hơn |
| Broken Seal | Heavy kiểm soát tốt hơn | Quái chống stagger ngắn |
| Echo Chamber | Chain relay lan thêm | Quái phản công |

- **Fractured Storm** và **Blood Moon** mở sẵn.

#### 5. Ascension & Endgame

- 5 cấp: **0–4**, mở hệ thống sau khi sở hữu đủ 6 Sigil.
- Người chơi tự chọn cấp đã mở trước run.
- Thắng cấp hiện tại để mở cấp tiếp theo.
- Collection hoàn tất: tiếp tục tiến trình Ascension và Cosmetic hữu hạn; không tăng sức mạnh vô hạn.
- **6 cosmetic variants dự kiến**, không ảnh hưởng gameplay.

#### 6. Balance & Integrity

- Không proc loop vô hạn; secondary effects có cooldown/budget.
- Boss không bị slow/stagger lock.
- Attack-speed bonus có hard cap; không phá animation/readability.
- Anomaly phải có telegraph, counterplay và không gây tình huống bất khả kháng.
- Save chỉ lưu unlock IDs, ticket và progression; combat stats luôn derive từ catalog.
- Validation, allowlist, schema migration, idempotent reward, pending reward và tách debug/playtest khỏi progression thật.
- Offline-only; không khóa hoặc chống DevTools.

#### 7. Phạm vi và Balance Tuning / TBD

- Lưu đúng quyết định vào DDR; không backfill lịch sử trước Release.
- Thông số **damage/cooldown/radius**: **Balance Tuning / TBD**; không chốt số mới trong decision này.
- Chi tiết cosmetic của 6 variants dự kiến: **Balance Tuning / TBD**.
- Không tự thay đổi design, không sửa gameplay, Art Bible hay roadmap.
- Chỉ documentation; không implementation. Commit/push tài liệu và báo Decision ID cùng commit hash.
