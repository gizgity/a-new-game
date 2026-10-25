# Q5 — audit và hướng triển khai

Q5 được user mở ngày 2026-10-25. Tài liệu này là audit source và đề xuất, chưa là thiết kế được duyệt hoặc bằng chứng gameplay PASS.

## Nguồn và phạm vi

Đã đọc AGENTS.md, HANDOFF.md, GAME_BRIEF.md, builds.ts, run.ts, các nhánh Mutation/Curse trong combat.ts, dictionary và tests/run.test.mjs. Bản Brief đầu `ce17718` ghi rõ hiệu ứng chi tiết chưa chốt; Markdown hiện tại không cung cấp concept gốc bổ sung. Brief hiện yêu cầu xác nhận nguồn còn thiếu, không suy diễn hiệu ứng từ tên.

Giữ 6 Mutation/4 Curse, pool unlock, 6 draft, quyền đổi/giữ một Curse và Q2–Q4 đã accepted. Câu hỏi đang chờ: user gửi concept hay cho phép thiết kế/triển khai từ hiệu ứng hiện có.

## Đối chiếu implementation

| Nội dung | Hiện trạng và tương tác đọc từ code | Điểm cần giải quyết |
| --- | --- | --- |
| Phantom Edge | +20px mọi melee, kể cả Heavy; Light có thể đánh dấu thêm mục tiêu | Chưa có trigger riêng ngoài mở tầm |
| Catalyst | Light/Basic trúng thêm charge; Charged tự seed Detonate | Vòng bắn → tích → Charged đã có; cần kiểm synergy và trình bày rõ |
| Berserker | Dưới nửa maxHP tăng damage qua hitEnemy, gồm súng/nổ | Blood Pact tự hạ HP giúp vào ngưỡng; chưa có feedback trạng thái rõ |
| Detonation Specialist | Damage/radius chỉ tăng cho Rupture Detonate | Không tăng trực tiếp xung Riposte/Death Echo; chúng có thể kích dấu để hưởng buff gián tiếp |
| Static Riposte | Perfect Dodge tạo xung40/radius140 qua queue nổ; kích Rupture gần đó | Dash thường không kích; cần kiểm vòng đặt dấu → né đúng → phản nổ |
| Guard Breaker | Heavy +30% và xuyên giáp | Bulwark ngoài recovery là tình huống khác biệt chính; cần kiểm với Heavy finisher/Detonate |
| Volatile Soul | Rupture Detonate +40%; nhận damage +25% | Rủi ro chung, chưa có lựa chọn vị trí/thời điểm riêng |
| Ghost Step | Hồi dash2.1s; maxHP80 | Hỗ trợ Riposte gián tiếp; phần lợi ích vẫn chỉ đổi cadence |
| Blood Pact | Melee +30%; bắt đầu Light trừ1HP kể cả hụt/hủy, không tự giết | Có quyết định thật: tiêu HP để setup/Berserker hay chuyển súng |
| Death Echo | Mỗi kill tạo nổ20/radius80, có thể kích Rupture; maxHP85 | Có vòng chain thật; cần khóa không thưởng Detonate cho echo không có dấu |

Các nhận xét trên từ đọc code, chưa được xác nhận bởi focused tests Q5.

## Draft: vấn đề xác định được

- `mutationDraft` chỉ so melee/shots/dashes tích lũy; không biết Heavy, Perfect thành công hoặc Curse hiện tại.
- Khi cả bắn và dash nhiều hơn melee, luôn ưu tiên bắn dù dash nhiều hơn bắn.
- Khi lựa chọn mong muốn đã sở hữu/bị khóa, fallback ngẫu nhiên vẫn mang nhãn Adaptive/Synergy.
- Không dùng Curse để nhận ra Blood Pact → Berserker hoặc Ghost Step → Static Riposte.
- Test hiện tại chỉ chứng minh một trường hợp Catalyst → Specialist và uniqueness, chưa chứng minh fallback/trường hợp khác phù hợp nhãn.

## Hướng đề xuất nếu được phép thiết kế từ hiện trạng

1. Sửa draft để xếp hạng lựa chọn còn hợp lệ từ hành vi thực tế và quan hệ build cụ thể, kể cả Curse. Không có bằng chứng thì dùng nhãn trung tính/wildcard; mô tả lý do qua vi/en. Không cần framework scoring tổng quát.
2. Giữ các vòng đã có: Catalyst → Charged → Detonate; dấu → Perfect/Riposte → relay; Blood Pact → Berserker; kill → Death Echo → dấu. Bổ sung feedback đủ đọc và tests chứng minh tương tác thực.
3. Với các hiệu ứng chỉ cộng chỉ số, cụ thể hóa trigger thay đổi quyết định thay vì chỉ tăng sức mạnh: Phantom Edge gắn với việc tiếp cận/rời tầm chém; Specialist gắn với setup nhiều dấu; Volatile Soul gắn rủi ro vị trí khi kích nổ; Ghost Step gắn cửa sổ phản công sau né. Đây chỉ là hướng để chốt thiết kế, chưa chọn thông số hay thay effect.
4. Kiểm bounded chain/reset/đổi Curse không rò hiệu ứng, giữ budget12/tick và24VFX, pause/hitstop và input Q2–Q4.

## Validation/playtest dự kiến

Sau khi chốt thiết kế: focused tests từng trigger/trade-off và draft fallback; npm test/build; fixture renderer thật để so build có/không và draft vi/en trên phone/desktop. Một lượt gameplay input thật kiểm nhịp draft. Không dùng fixture cấp build/HP làm bằng chứng natural run.

Checklist bàn giao sẽ nêu bản deploy, cách nhận build/mốc draft và thao tác cụ thể cho các vòng tương tác đã triển khai. Chưa yêu cầu user thử bản live cũ để duyệt Q5.
