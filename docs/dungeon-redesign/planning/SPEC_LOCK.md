# Spec lock theo milestone — index hiện hành

Revision2 · 2026-11-15 · nguồn: C10 / WORKFLOW rev2.

**Không còn global lock chặn toàn rework.** Mỗi milestone plan→spec/target→user lock→implement→nghiệm thu riêng. Bản packet global cũ được lưu nguyên tại [SPEC_LOCK_R1_HISTORY.md](SPEC_LOCK_R1_HISTORY.md), report/inventory P0 vẫn là lịch sử audit có thật, không bị xóa hoặc biến thành milestone acceptance.

| Milestone | Lock path khi chuẩn bị đủ | Trạng thái hiện tại |
| --- | --- | --- |
| DR-P1 | locks/DR-P1_LOCK.json | Chưa tạo; plan/S1/tickets có thật nhưng cần reconcile flow C10, Atlas/feasibility/targets còn thiếu |
| DR-P2 | locks/DR-P2_LOCK.json | Chưa planning; không chặn P1 vì chưa có lock P2 |
| DR-P3 | locks/DR-P3_LOCK.json | Chưa planning |
| DR-P4 | locks/DR-P4_LOCK.json | Chưa planning |
| DR-P5 | locks/DR-P5_LOCK.json | Chưa planning |
| DR-P6 | locks/DR-P6_LOCK.json | Chưa planning |

Chỉ tạo file lock thật khi next chọn prepare_lock cho milestone đó. **Chưa lock nào được user khóa.** PROGRESS.json dẫn path và yêu cầu spec/target; script kiểm file, hashes, scope và approval trước task production. R01–R12/P0/P1 approval cũ giữ nguyên phạm vi, không tự nâng thành các lock ở bảng này.

## Cấu trúc manifest khi trình khóa

~~~json
{
  "milestone": "DR-P1",
  "revision": 1,
  "status": "DRAFT",
  "issues": [],
  "artifacts": [
    {"type": "SPEC", "path": "đường dẫn thật", "sha256": "64 ký tự hash thật", "revision": 3},
    {"type": "TARGET", "id": "ENV-T01", "path": "ảnh thật", "sha256": "hash thật", "revision": 1,
     "approval": {"quote": "nguyên văn user duyệt đúng target", "date": "YYYY-MM-DD", "source": "hội thoại/file có evidence"}}
  ],
  "approval": null
}
~~~

Đây chỉ là schema minh họa, không phải manifest thật/approval thật. DRAFT chỉ được trình khi đủ specs/targets/coverage và không blocking issues. User khóa đúng revision mới ghi LOCKED và approval quote/date/source. Nếu hash thay đổi: STALE, chuẩn bị delta/impact để review lại; không cập nhật hash âm thầm mà giữ approval cũ.

Manifest phải bao phủ scope core milestone. Non-visual logic không tự cần ảnh nhưng milestone có visual thì target tương ứng cần thật/approved. Interface tạm hoặc fixture dùng để tách mốc phải có giới hạn/expected behavior rõ, không dời thiếu thiết kế sang lúc code. Specs/targets cho mốc sau chưa làm không tự là blocker milestone hiện tại.
