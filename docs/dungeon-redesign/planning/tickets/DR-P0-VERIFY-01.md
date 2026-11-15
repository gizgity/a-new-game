# DR-P0-VERIFY-01 — Audit coverage toàn release và chuẩn bị manifest để review lock

Parent milestone: DR-P0
Kind: VERIFY
Status: BLOCKED — audit hoàn tất, closure/spec-lock chưa đủ inputs; AWAITING USER REVIEW
Revision: 2 · 2026-11-15
Session assignment: User “Rà soát planning toàn rework. Kiểm coverage, dependencies, specs và approved targets. Chuẩn bị bản spec-lock hoàn chỉnh để t review; chưa implement.”,2026-11-15, hội thoại hiện tại không permalink. Chỉ audit/docs, không tự planning P2–P6 hoặc thực hiện SPEC/CONCEPT con.
Source: R12 amended/C09 và [DR-P0_PLAN rev1](../DR-P0_PLAN.md) §4–8, user “y” duyệt kế hoạch ngày2026-11-15; assignment audit mới ở trên. Không có lock approval mới.
Lock binding: DR-LOCK-01 rev0 NOT_LOCKED
Execution card: NONE — audit tài liệu, không CODE/ART.

## Intent và scope

Before: bản đồ coverage có owner, nhưng specs/targets/tickets thật P1–P6 chưa tồn tại.
Outcome: báo cáo đóng coverage và manifest exact revisions/hashes đủ để user quyết định lock, hoặc blocker cụ thể khi chưa đủ; không tự cấp LOCKED.
IN: đối chiếu planning/spec/ref toàn release, audit deps/contract/approval/AC và chuẩn bị manifest.
OUT: tự viết specs để lấp gap, tạo concept/source, đổi baseline/scope, implement/runtime tests, merge/main/Pages/DDR/Bible.

## Dependencies và thứ tự

Spec dependencies: R01–R12/C09; WORKFLOW F2–F4; các S1–S6/K-W..K-U theo plan §3/5 phải có nội dung thực trước khi tuyên bố đủ lock.
Artifact/task dependencies: user đã giao audit; detailed plans/tickets P1–P6 và các task SPEC/CONCEPT/targets là inputs để đóng closure. Thiếu inputs vẫn audit/report phần có thật, không tự tạo specs/targets. Không phụ thuộc runtime implementation hoặc device playtest chưa thể có trước code.
Inputs: [coverage C01–C32](../DR-P0_PLAN.md#4-coverage-matrix-toàn-release), [SPEC_LOCK](../SPEC_LOCK.md); P0/P1 plans, S1 và17tickets thật; P2–P6/targets **UNAVAILABLE**, không giả điền.
Outputs thực: [DR-P0_CLOSURE](../DR-P0_CLOSURE.md) rev1 với coverage actual IDs, [manifest audit packet rev1](../SPEC_LOCK.md) và [inventory](../DR-P0_LOCK_INVENTORY.md); handoff. Lock revision vẫn0 NOT_LOCKED, chưa đủ trình khóa.
Downstream: quyết định lock của user; các execution sessions sau đó vẫn phải được giao riêng.

## Việc cần làm / contract

1. Re-read CURRENT/assignment và đúng baseline/manifest, kiểm plan revisions đã review.
2. Với từng C01–C32, tìm actual spec section/ticket(s)/AC/evidence dự kiến và approval; rà thêm requirement chi tiết trong baseline, không chỉ kiểm đủ12nhãn Rxx.
3. Đối chiếu producer/consumer K-W/K-A/K-E/K-B/K-X/K-U: units/coordinate/LOS, action/cancel/clock, stat/caps/kill owner, progress/flask/add queue, death batch, claims/snapshots, HUD/input/audio lifecycle. Spec một nguồn, không số trùng mâu thuẫn.
4. Kiểm riêng feedback closure: camera↔HUD/safe area, Boss geometry↔modifier legality, offers↔pending persistence, entry↔refill/cleanup; mâu thuẫn ghi blocker/owner/impact, không tự đổi design.
5. Kiểm targets thật mở được, type/binding/scale/version/hash/source/rights và approval đúng scope. Concept/composite chưa runtime ghi đúng nhãn; inventory production/source/export/state đủ nhưng production chưa thực hiện trước lock.
6. Kiểm verify plan theo R12: scenario/seed/build yếu-mạnh/two-platform/device/browser/metrics/error flow; không yêu cầu PASS runtime trước code, không dùng measurement cũ thành rework coverage.
7. Nếu còn blocker: ghi báo cáo thiếu và giữ NOT_LOCKED. Nếu đủ: lập manifest revision mới với exact artifacts và approval, trình user khóa bản đó; chưa ghi LOCKED khi chưa có quote/date/source cụ thể.

Audit source: N/A cho code mutation; nếu plan dùng path/API chưa audit, yêu cầu owner xử lý, không giả xác nhận từ P0. Data contract là manifest rows ID/path/rev/hash/coverage/deps/approval/status. Approval/event ordering: artifact đủ→audit→manifest→user lock; không ngược từ “all y” hoặc commit. Không auto-run sibling task để lấp gap.

## Visual/audio/UI bindings

Không tạo/review mỹ thuật mới. Audit binding/approval/provenance theo A3/game-art cho toàn target liên quan; không thay visual approval bằng check file tồn tại. UI vi/en/input và audio mapping/acceptance lấy S6 đã hoàn thiện. Thẩm định artwork thực tế thuộc đúng task visual được giao, không tự chấm approved ở closure.

## Acceptance và evidence

- [ ] AC1 Từng requirement baseline có actual spec/tickets/AC; không requirement mồ côi hoặc chỉ owner dự kiến.
- [ ] AC2 Hai graph hợp đồng/artifact không vòng/hidden prerequisite; cross-contract table có producer/consumer đúng revision, không conflict/TBD chặn lock.
- [ ] AC3 Visual targets phù hợp có thật/approved/bound; protocol device/verify cụ thể, runtime/user acceptance còn thiếu ghi riêng.
- [x] AC4 Manifest giữ full P1–P6/R12 amendment, exact revision/hash/approval của artifacts có thật; missing khai báo rõ, không tự thu scope hoặc LOCKED/READY CODE khi chưa được user khóa/giao task. Chưa là manifest đủ điều kiện khóa.

Verify plan: local links/hashes/diff, so requirement→spec→ticket→target/AC, walkthrough entry/pending/terminal/cancel/threshold/camera-mod interactions trên tài liệu. Không build game.
Evidence dự kiến: DR-P0_CLOSURE, manifest, coverage actual IDs; ghi PASS/FAIL/NOT CHECKED từng AC và blocker nếu có.
Giới hạn: không chứng minh visual/runtime/device FPS/humanfeel từ audit tài liệu.

## Readiness và approval

Blocking TBD: [findings L01–L08](../DR-P0_CLOSURE.md#5-findings-và-cách-đóng); P2–P6 specs/tickets, S1 release generation/feasibility/Atlas, targets/cross-contract/device protocol còn thiếu. L09/L10 sửa metadata/index, không đóng blocker.
Spec ready audit: NOT READY FOR CLOSURE. P0 rev1/P1 plan+S1 rev2 APPROVED PLANNING ONLY; final specs/targets NONE. AC1 FAIL completeness, AC2 PARTIAL (P1 DAG PASS, full release chưa audit được), AC3 FAIL readiness; AC4 PASS scope/truthful inventory. Không ACCEPTED task/milestone khi AC1–3 chưa đạt.
Global lock: DR-LOCK-01 rev0 NOT_LOCKED; audit packet rev1 chỉ để review. Audit/docs authorized theo assignment; CODE/ART execution authorized: NO.
STOP: không đủ inputs thì báo thiếu, giữ scope/lock; đủ inputs vẫn chờ user lock đúng bản sau review.

## Kết quả khi task thực sự diễn ra

Changed files/evidence: DR-P0_CLOSURE + inventory + SPEC_LOCK + status indices/HANDOFF +14child P1 metadata approval rev3. P0/P1 approved plans/S1/PLAN tickets giữ nguyên bytes. Commit/push/deploy NONE.
Technical docs PASS:28Markdown/300local links/39anchors/46current hashes/32coverage rows/15node P1 DAG;14child reverse metadata khớp input hashes, approved P1 bytes/Review commit hash/protected tracked paths/package-lock giữ nguyên; git diff --check PASS. Audit/report hoàn tất, completeness closure BLOCKED. Runtime/visual/new target approval/user playtest: NOT CHECKED/NONE. User review audit: AWAITING USER.
NEXT ACTION: User review audit packet rev1 tại SPEC_LOCK và findings L01–L08; dừng chờ giao planning/design-only đóng gap, không implementation.
