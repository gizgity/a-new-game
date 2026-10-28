# Quy tắc repository

## Source of Truth
- `AGENTS.md`: quy tắc làm việc và coding conventions.
- `GAME_BRIEF.md`: mục tiêu, gameplay specification và giới hạn scope.
- `HANDOFF.md`: active task, progress, context và NEXT ACTION.
- `DESIGN_DECISIONS.md`: registry append-only quyết định mới sau Release; không backfill lịch sử.
- `ART_BIBLE.md`: chuẩn visual từ artwork accepted, cùng reference board `docs/art-reference/README.md`.
- Chỉ dẫn mới nhất của người dùng được ưu tiên khi có xung đột giữa các tài liệu này và yêu cầu của người dùng.
- Không tự ý thay đổi project goal, task goal, scope hoặc quyết định đã khóa; chỉ thay đổi khi người dùng yêu cầu.

## Ngôn ngữ
- Ngôn ngữ mặc định của repository là tiếng Việt. Trao đổi, tài liệu, báo cáo, task notes và handoff dùng tiếng Việt.
- Code identifiers (variables, functions, classes, filenames) dùng tiếng Anh theo chuẩn lập trình.
- Mọi text hiển thị cho người chơi phải qua i18n `t(key)`; tuyệt đối không hardcode trực tiếp vào UI. Mỗi key phải có trong cả dictionary `vi` và `en`.
- Game mặc định `vi`, có dictionary `en` và hàm dịch đơn giản; không cần thư viện i18n ngoài.
- Tên riêng như Mutation, Curse, Boss có thể giữ nguyên khi phù hợp.
- Không dịch console errors, technical identifiers hoặc nội dung machine-readable không dành cho người chơi.

## Phát triển
- Free/open-source first; KISS, tránh over-engineering.
- Ưu tiên game playable, combat feel và hiệu năng.
- Chỉ thêm dependency/công cụ khi thật sự cần; không tạo abstraction/framework cho nhu cầu giả định.
- Không tự thêm tính năng ngoài scope, không sửa/refactor phần không liên quan.
- Mỗi milestone phải giữ game chạy được.

## Tiêu chuẩn nền tảng chung

- **Mobile-first + Desktop-equivalent**: cùng gameplay depth, combat precision và visual quality; desktop không là nền tảng phụ. Áp dụng [tiêu chuẩn chung/acceptance riêng touch và keyboard–mouse](GAME_BRIEF.md#mobile-first--desktop-equivalent--tiêu-chuẩn-chung).
- Chung damage/RNG/cooldown/i-frame/enemy AI/Boss timing; khác layout/input assistance theo contract đã duyệt, không thay luật/difficulty theo thiết bị. Assistance hỗ trợ thao tác, không tự giải quyết quyết định chiến thuật.
- Kiểm riêng responsiveness, camera/HUD, telegraphs, target selection, VFX/readability và input precision trên mỗi nền tảng; không suy desktop đạt từ game boot hoặc mobile PASS. Giữ approval cũ và ghi rõ phần kỹ thuật/device/user playtest chưa kiểm; yêu cầu chung không tự cấp phép đổi runtime/artwork hoặc mở milestone.

## Tổ chức source code
Cấu trúc tham chiếu; chỉ tạo thư mục/file khi thực sự cần, không scaffold trước toàn bộ cây:

```text
src/
├── main.ts
├── game/
│   ├── scenes/
│   ├── entities/
│   ├── systems/
│   └── config/
├── ui/
└── i18n/
    ├── index.ts
    ├── vi.ts
    └── en.ts
public/assets/
```

- `main.ts` chỉ bootstrap ứng dụng.
- Không dồn toàn bộ gameplay logic vào một Phaser Scene hoặc một file lớn.
- Tách code theo trách nhiệm thực tế, không chia file máy móc; phân tách hợp lý game logic, rendering, UI và configuration.
- Tập trung thông số balance trong `src/game/config/`; nội dung dịch thuộc `src/i18n/`, UI thuộc `src/ui/`, assets thuộc `public/assets/` khi cần.
- Không tạo abstractions, frameworks, placeholder modules hoặc barrel files không cần thiết; `src/i18n/index.ts` dành cho API dịch `t(key)`, không chỉ re-export.
- Giữ code đơn giản, dễ đọc, dễ mở rộng theo milestone; chỉ tổ chức lại code liên quan trong phạm vi task được giao.

## Artwork và visual gate
- Checkpoint artwork đã duyệt: **Q7C = Character & Enemy Art Overhaul** (Player, Grunt, Archer, Volatile, Bulwark, Chain Warden); **Q7D = Full Run Experience Polish**, user đã giao ngày2026-10-26; scope3ưu tiên tại GAME_BRIEF/docs/q7d. Q7B đã user accepted trên5ee970e (approval78f07e6). Q7C dùng Q7A Visual Hierarchy / Contrast Study V1 làm reference chính; giữ P0–P3, silhouette và palette.
- **Q7C ACCEPTED — USER PLAYTEST APPROVAL:** user “duyệt q7c đạt” ngày2026-10-26 trên bản deploy2ef6d48/code0041064. Visual đã duyệt trước qua “visual approved q7c”. Giữ top-down¾, floor/camera/gameplay và các approval Q2–Q7B; không yêu cầu duyệt lại Q7C. Q7D chỉ polish presentation/flow; user đã xác nhận “đã đạt q7d” ngày2026-10-26 trên66e0799 — ACCEPTED — USER PLAYTEST APPROVAL. Approval Q7D giữ nguyên. Gate dừng trước Q8 được user supersede ngày2026-10-26: Q8A đã ACCEPTED — USER PLAYTEST APPROVAL qua “q8a đạt yêu cầu” trên394341c ngày2026-10-26; giữ spawn Q8A. Q8B Run Pacing đã ACCEPTED — USER PLAYTEST APPROVAL qua “oki duyệt q8b” ngày2026-10-26 trêneb6fbbe; Victory4:30–5:00 là mục tiêu mềm, cho phép thắng sớm. Dừng tại Q8B; Q8C–D chưa mở.
- Q7C phải tạo sprite source riêng bằng ImageGen, preview đủ idle/move/windup/attack/recovery/hit/death và Boss3đòn; không crop concept board thành runtime sprite hoặc thay bằng procedural Graphics. State không tồn tại trong simulation (như Volatile recovery sống) phải ghi N/A, không thêm timing/gameplay. Dừng **AWAITING VISUAL APPROVAL** trước tích hợp; sau duyệt mới rendering/animation/deploy và **AWAITING PLAYTEST APPROVAL**. Không tự accepted.
- Asset-first, illustration-first: audit rendering/approval và tạo concept, mockup gần tỷ lệ chơi, palette/contrast cùng cảnh đông quái trước khi thay artwork arena. Dừng **AWAITING VISUAL APPROVAL**; chỉ user duyệt mới cho triển khai concept. Ảnh sinh thành công không là ART APPROVED.
- Artwork môi trường chính dùng PNG/WebP hoặc SVG có chủ đích, render bằng Phaser Image/TileSprite/layers tĩnh. Không thay artwork bằng vòng lặp Graphics, procedural art engine, tilemap phức tạp hoặc shader nặng. Graphics dành cho dynamic combat shapes/telegraphs/VFX/debug.
- Lưu source artwork, prompt, nguồn/quyền sử dụng, version và giới hạn riêng với runtime assets. Concept/mockup và screenshot renderer thật phải ghi nhãn khác nhau; không dùng reference bên thứ ba chưa có quyền phù hợp làm asset.
- Giữ player/threats nổi hơn floor qua luminance, outline, shape, size và animation; kiểm mobile/desktop/crowd/grayscale phù hợp. Giữ sprite/VFX đã accepted, gameplay bounds/camera/collider/input và balance trừ khi user giao thay đổi.
- HUD không được che canvas tại biên/góc: ưu tiên lane riêng và kiểm player4góc trên mobile/desktop, không chỉ chụp center. Những thay đổi input/auto aim/draft interaction phải có scope user, kiểm giữ-thả/cancel/fresh-press và ghi rõ ngoại lệ contract.
- HUD/UI visual milestone cũng illustration-first: mockup dựa screenshot/bố cục thật, ghi rõ concept và baseline renderer; user duyệt trước sửa HUD production. CSS dùng cho layout/typography/interaction, asset cho icon/art có chủ đích; không UI drawing engine. Readiness/cooldown chỉ đọc resource state thật, không tạo timer/resource giả; text vi/en và giữ-thả/cancel phải được bảo toàn; thay touch hit areas/aim chỉ khi user giao.

## Kiểm thử
- Chạy typecheck/build sau thay đổi implementation liên quan.
- Focused tests cho gameplay logic rủi ro cao; playtest ngắn sau milestone gameplay.
- Không tự xây comprehensive QA, E2E suite, replay framework hay CI phức tạp.
- Không lặp lại test khi không có lý do.
- Không chạy build/test nếu chỉ sửa Markdown; kiểm tra diff và tính nhất quán của tài liệu.

## Bàn giao playtest
- Khi cần người dùng playtest/duyệt visual, phải nêu rõ scope của lượt thử: tính năng/quái/tình huống cần kiểm, phiên bản hoặc link chơi; không chỉ nói “chờ playtest”.
- Cung cấp checklist ngắn có cách vào tình huống (mốc xuất hiện nếu có), thao tác cụ thể trên mobile/desktop và kết quả mong đợi để người dùng biết thế nào là đạt hoặc lỗi.
- Nói rõ phần đã được kiểm tự động, phần còn cần cảm nhận/thiết bị thật; không coi fixture hoặc build/tests PASS là user acceptance. Ghi scope và cách thử hiện tại trong HANDOFF.md để session sau tiếp tục đúng.
- Hướng dẫn phản hồi ngắn: tình huống/bước gặp vấn đề, điều quan sát được và thiết bị/browser nếu liên quan. Không biến playtest thành comprehensive QA hoặc yêu cầu user kiểm lại mọi milestone.

## Token Efficiency
- Chỉ đọc file cần thiết; không đọc lại toàn repo khi không cần.
- Không xuất logs dài nếu không có lỗi; không viết báo cáo dài hoặc tài liệu ngoài yêu cầu.
- Báo cáo cuối task ngắn gọn: thay đổi, kiểm tra, blocker/next step; khi cần user playtest phải kèm scope/cách thử/kết quả mong đợi đủ thực hiện.

## Deployment
- Người dùng đã cho phép tự deploy sau khi hoàn tất công việc và các kiểm tra phù hợp PASS, không cần chờ xác nhận riêng.
- Dùng GitHub Actions `.github/workflows/pages.yml` để build `dist/` và deploy lên GitHub Pages đã setup; giữ Vite base `/a-new-game/`. Bảo toàn thay đổi remote, push `main` không force và theo dõi workflow tới trạng thái kết thúc.
- Visual approval/device playtest còn thiếu phải ghi rõ trong handoff; việc deploy không đồng nghĩa experience acceptance. Không tự mở rộng checkpoint gameplay chưa được giao.

## Handoff — bắt buộc
- Trước khi bắt đầu/resume task, đọc `HANDOFF.md`.
- Nếu task chưa hoàn thành, tiếp tục theo NEXT ACTION trong phạm vi đã được giao sau compact/session mới mà không cần xin phép lại, trừ khi user giao mục tiêu mới.
- Task mới phải xác định Goal và acceptance criteria trước khi bắt đầu.
- Sử dụng workflow `.agents/skills/handoff/SKILL.md`.
- Chủ động cập nhật handoff ở checkpoint quan trọng, khi có blocker, khi kết thúc session và trước compaction nếu nhận biết được; không cập nhật sau mỗi thay đổi nhỏ.
- Không đánh dấu Goal hoàn thành khi acceptance criteria chưa đạt; không thay đổi Goal đã xác nhận khi user chưa yêu cầu.
- Sau khi hoàn thành milestone được giao, cập nhật progress, validation, context và NEXT ACTION rồi dừng; không tự chuyển sang milestone tiếp theo nếu user chưa yêu cầu, kể cả khi resume.
- Khi cập nhật handoff, giữ nguyên project goal, task goal đã xác nhận và các quyết định quan trọng còn hiệu lực.
- Không dựa duy nhất vào auto-trigger của skill; các quy tắc handoff này luôn có hiệu lực.

## Checkpoint lịch sử — Q8C
- User giao riêng Q8C ngày2026-10-26: triển khai Boss warning/Enraged/combo, test, commit/push/Pages và dừng **AWAITING USER PLAYTEST APPROVAL**. Q8A394341c/Q8Beb6fbbe ACCEPTED; không mở Q8D.
- Scope này cho phép thêm pose Enraged ImageGen đồng bộ Q7C và tích hợp/deploy theo chỉ dẫn trực tiếp của user; không tự gán visual/playtest approval. Quy tắc gate artwork Q7C phía trên là lịch sử của overhaul, không chặn task Q8C đã giao. Spec hiện hành tại GAME_BRIEF.md và docs/q8c/README.md. Giữ1500HP/5:00/Q8A/Q8B/build/input/art đã duyệt ngoài đúng phần Boss được giao.

- Feedback Q8C sau preset: user cho phép transform1.4s (thay0.8s), animation chậm và freeze timer run/toàn combat trong transform; chỉ presentation Boss tiến. Scope này supersede timing/vulnerability ban đầu; giữ AWAITING USER PLAYTEST APPROVAL.

- Arrival ambient V2 và audio sketch đã được user duyệt qua “ok, làm đi” trước tích hợp. Cho phép edge asset production riêng/ImageGen +4nhịp xích/trầm; chỉ warning2s, không thay Boss/Enraged đã ổn. Dừng AWAITING USER PLAYTEST APPROVAL sau test/deploy, không Q8D.

## Q8C approval hiện hành
- **ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “q8c đạt” ngày2026-10-26 trên code/deploy `8cbff77` (handoff `8e70df3`), Pages40357489627 SUCCESS. Đây là approval trực tiếp cho Q8C gồm Boss/Enraged và ArrivalV2/âm cảnh báo, không suy ra từ tests/build/deploy. Giữ giới hạn coverage kỹ thuật và lịch sử approval Q2–Q8B. Dừng, không mở Q8D. Các chỉ dẫn dừng chờ playtest Q8C phía trên là gate lịch sử đã hoàn tất; không yêu cầu duyệt lại hoặc tự triển khai Q8D.

## Checkpoint hiện hành — Q8D
- User giao riêng Q8D ngày2026-10-26, supersede các gate lịch sử “không mở Q8D” ở trên; không thay approval Q2–Q8C.
- Baseline main7625fa2/runtime8cbff77. Chỉ validation/tune nhỏ có evidence, không ép build cùng DPS/winrate; bot không thay user acceptance. Không thêm content/framework/hệ thống balance.
- Báo cáo/raw data/regression/cách thử tại [docs/q8d/README.md](docs/q8d/README.md). Hiện không đổi runtime/thông số vì chưa đủ evidence; số cũ đã bị Q8B/Q8C supersede giữ nguyên nhãn lịch sử.
- **ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “q8d đạt” ngày2026-10-26 trên bản deploy `cbdb131` (handoff `4791b27`), Pages40360458461 SUCCESS. Đây là approval trực tiếp của user, không suy ra từ bot/tests/build/deploy. Giữ baseline và lịch sử approval Q2–Q8C, cùng giới hạn coverage kỹ thuật. Dừng, không mở Q9. Các gate chờ duyệt Q8D trước đây đã hoàn tất; không yêu cầu duyệt lại.

## Design memory và art consistency
- Chỉ ghi DDR khi user gọi rõ `$design-decision` kèm nội dung đã chốt; theo `.agents/skills/design-decision/SKILL.md`. Không tự gọi/ghi từ thảo luận, không suy approval, không nhập lại quyết định trước Release v0.1.0. Mỗi thay đổi/status tạo ID mới + Supersedes; implementation và acceptance theo dõi riêng.
- Dùng `$game-art` / `.agents/skills/game-art/SKILL.md` cho tạo/sửa/review artwork. Bắt buộc đọc Art Bible, mở đúng approved image refs và truyền ảnh thật vào ImageGen; mockup trên arena/HUD runtime thật, so mobile/crowd/grayscale/4góc. Thiếu tool/reference thì báo blocker, không fallback procedural Graphics cho artwork.
- Gate: concept → consistency check → user approval → production asset → integration. Không dùng tests/deploy/ảnh sinh thành công thay approval; không đổi style/Bible để hợp thức hóa ảnh lệch.
- User chốt đổi art direction: cần invocation `$design-decision` và bằng chứng, ghi decision Approved mới trước, rồi mới cập nhật Art Bible đúng scope. Direction approval không tự approve từng artwork. Artwork accepted trước Release được audit trong Bible/index, không DDR.
- Task Design Memory chỉ docs/skills/reference index; không sửa gameplay/production assets/roadmap, không build/deploy. Ví dụ invocation nằm trong từng SKILL.md, không phải decision/approval thật.

## Checkpoint hiện hành — Q9A

- User ngày2026-10-27 “duyệt dd-0002. bắt đầu triển khai q9a”: DD-0002 Approved — Design Only, contract revision09267ed; mở lại Q9A, supersede các gate lịch sử không mở Q9/Q9A ở trên. Không hủy approval Q2–Q8D, không tự mở Q9B.
- Contract hiệu lực tại DESIGN_DECISIONS.md DD-0001/DD-0002; implementation/validation và cách thử6Sigil/12Branch tại docs/q9a/README.md, trạng thái tại HANDOFF. Q9A được nghiệm thu với tuning hiện tại; cân bằng sau này theo issue mới của user. Q9A không cấp unlock/reward. Fixture Legacy dùng profile riêng không ghi save thật; không bypass progression production.
- **ACCEPTED — USER PLAYTEST APPROVAL** — user “duyệt 9a, nếu cần cân bằng sẽ mở issue mới” ngày2026-10-27 trên code/deploy1a08448 (handoff49394c0), Pages40428188955 SUCCESS. Đây là approval trực tiếp; không suy full-device coverage từ approval chung hoặc tests/build/Pages. Gate chờ duyệt Q9A đã hoàn tất; không yêu cầu duyệt lại. Nếu cần cân bằng, chờ issue mới; không tự tune/tạo issue/mở Q9B. Không đổi runtime/artwork ở lượt ghi nhận này.

## Checkpoint hiện hành — Q9B
- User giao Q9B ngày2026-10-27: mở scope Victory reward/Legacy permanent progression/ticket lifecycle/reward+collection UI vi-en, test/deploy/commit/push; supersede gate khôngQ9B lịch sử phía trên. Giữ Q9A accepted và toàn bộ tuning; không tự tuning/Q9C/artwork/Anomaly combat/Ascension/Cosmetic/reaction. Chi tiết tại docs/q9b/README.md và HANDOFF.
- **ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “duyệt 9b xong” ngày2026-10-27 trên code/deploy `c0a8247` (bàn giao `e9cc11c`), Pages40444521840 SUCCESS. Nguồn: hội thoại task hiện tại, không có permalink. Đây là approval trực tiếp của user; không suy thêm device/iOS/Safari coverage từ approval chung hoặc tests/build/deploy. Giữ Q9A accepted và toàn bộ tuning. Không tự mở Q9C. Gate chờ duyệt Q9B đã hoàn tất; không yêu cầu duyệt lại. Lượt ghi nhận này chỉ docs, không runtime/deploy.

## Checkpoint hiện hành — Q9C
- User giao Q9C Arena Anomalies ngày2026-10-27; supersede gate lịch sử “không mở Q9C” trong đúng scope này. Giữ Q9A/Q9B accepted, Auto Aim/mobile follow-up và balance/progression/art baseline278f439.
- Run#1 không Anomaly, run#2+ chọn1/2tại~2:15;6mechanics/ticket/queue/UX/tunableconfig và coverage/cách thử tại docs/q9c/README.md. Không tự coi thông số Q9C là approved balance, không artwork mới.
- Test/build/commit/push/Pages theo task, dừng **AWAITING USER PLAYTEST APPROVAL**; không tự Q9D hoặc suy acceptance từ bot/fixtures/deploy.

## Q9C VFX visual approval / implementation
- User “visual ok, làm đi” ngày2026-10-27 duyệt board/common signature6AnomalyV1.1 và giao production/integration; supersede gate chờvisual và scope “không artwork mới” của bản Q9C đầu trong đúng VFX follow-up này. Không cần duyệt lại V1.1.
- Production source sinh riêng quaImageGen, không cropboard, giữ gameplay/balance/progression/input/camera/art baseline ngoài AnomalyVFX. Evidence tại docs/q9c/vfx-production và handoff; visual approval không là user playtest acceptance. Test/build/commit/push/Pages rồi dừng **AWAITING USER PLAYTEST APPROVAL**, không Q9D.

## Q9C approval hiện hành
- **ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “đạt r” ngày2026-10-27 trên code/deploy `59b9a61` (bàn giao `3268f15`), Pages40509711771 SUCCESS. Nguồn: hội thoại task hiện tại, không có permalink. Approval cho Q9C Arena Anomalies gồm VFX V1.1; giữ approval Q9A/Q9B và giới hạn coverage kỹ thuật đã ghi, không suy thêm thiết bị/browser hoặc chốt balance config từ approval chung. Không tự mở Q9D. Các gate chờ playtest Q9C phía trên đã hoàn tất; không yêu cầu duyệt lại. Lượt ghi nhận chỉ Markdown, không runtime/DDR/art direction/deploy.

## Q9D VFX visual approval hiện hành
- User “duyệt, làm đi” ngày2026-10-28 duyệt board/mockupsQ9DVFXV1.1 và giao production/integration; không cần duyệt lại concept. Scope giữ gameplay/save/progression/input/balance, artwork dùng production source riêng quaImageGen, không cropboard.
- Spec/provenance/renderer/checklist tại docs/q9d/vfx-production/README.md; test/build/commit/push/Pages rồi dừng **AWAITING USER PLAYTEST APPROVAL Q9D**. Visual approval không là Q9D experience acceptance; không DDR Approved hoặc Q9E.

## Q9D approval hiện hành
- **ACCEPTED — USER PLAYTEST APPROVAL** — user xác nhận “duyệt 9d” ngày2026-10-28 trên code/deploy `ffd39a9` (bàn giao `a985145`), Pages40629442727 SUCCESS. Nguồn: hội thoại task hiện tại, không có permalink. Approval cho Q9D Ascension System V1 gồm VFX V1.1; giữ Q9A–Q9C accepted và giới hạn coverage kỹ thuật đã ghi, không suy thêm thiết bị/browser hoặc chốt balance trong DDR từ approval chung. Không tự mở Q9E hoặc yêu cầu duyệt lại Q9D. Lượt ghi nhận này chỉ tài liệu, không đổi runtime/balance/artwork/progression.
- Gate chờ user playtest Q9D phía trên đã hoàn tất; các note này giữ làm lịch sử. Giữ config hiện tại; thay đổi sau này theo task mới, không tự mở Q9E.
