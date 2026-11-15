# Progress ledger cho dungeon-planning next

Schema1 · workflow rev2 · chỉ scope dungeon rework.

## Nguồn và cách cập nhật

- PROGRESS.json là index nhỏ cho selector: thứ tự milestone, path plan/lock, task IDs/dependencies, readiness/issues, outputs và approval evidence. Không chứa bản sao nội dung spec hoặc status ticket.
- Status/Kind lấy từ header ticket thật: DRAFT, PLANNED, SPEC_READY, READY, IN_PROGRESS, BLOCKED, PARTIAL, NEEDS_REVIEW, ACCEPTED, DONE. PLAN/SPEC/CONCEPT có thể chạy trước lock; ART/CODE/VERIFY cần lock milestone.
- Task đang làm cập nhật IN_PROGRESS; xong kỹ thuật nhưng chưa user acceptance dùng DONE hoặc NEEDS_REVIEW đúng scope. ACCEPTED cần user evidence; CONCEPT hoàn tất luôn cần approval thật trước coi là target sẵn sàng.
- Field dependsOn liệt kê task IDs trong milestone. Hợp đồng với mốc khác ghi trong plan/spec, không tạo dependency giả tới task chưa có hoặc ép toàn planning tương lai. Khi đổi DAG, cập nhật cả plan và index rồi chạy status.

## Records

Mỗi milestone có id, plan, lock, requiredSpecs (paths), requiredTargets (IDs), planningAudit, tasks, review, acceptance. Future plan/lock path là đích dự kiến hợp lệ; không giả file đã tồn tại. Tasks có id/file/dependsOn và các record bên dưới khi thực sự có kết quả.

Proof cho output: một object có path tương đối repo và sha256. Mặc định hash bytes; Markdown/JSON/text có thể khai báo normalization="lf" và hash nội dung UTF-8 đã đổi CRLF→LF để checkout Windows không tạo stale giả. Chỉ bật lf cho đuôi text được hỗ trợ, asset binary luôn hash bytes; schema/hash sai bị chặn. File thiếu/hash sai/path ra ngoài repo đều có prompt sửa. Nên dùng report/snapshot bất biến cho completion evidence, không lấy source code sẽ thay ở milestone sau làm evidence cố định vĩnh viễn. Hash đúng không chứng minh nội dung/visual đạt; hash approval/raw lịch sử không bị sửa bởi cơ chế normalization này.

~~~json
{
  "completion": {
    "technical": "PASS",
    "outputs": [{"path": "report thật", "sha256": "hash thật"}],
    "approval": {"quote": "nguyên văn nếu đã user duyệt", "date": "YYYY-MM-DD", "source": "nguồn đúng scope"}
  },
  "review": {
    "ready": false,
    "outputs": [],
    "issues": []
  }
}
~~~

- completion: DONE cần technical PASS và outputs thật; ACCEPTED hoặc CONCEPT cần thêm user approval. Không lấy user y duyệt plan để duyệt output concept/code chưa tồn tại.
- planningAudit: status PASS/NOT_RUN/NEEDS_REPAIR, outputs proof, issues (id/file/detail/fix/doneWhen). PASS nói detailed plan/tickets/coverage đủ để làm các bước đã phân rã, không tự nói toàn artwork/runtime hoàn tất. Các task SPEC/CONCEPT còn lại vẫn phải chạy và đạt riêng trước lock.
- task issues: những gap đã biết; status BLOCKED/PARTIAL hoặc issues không rỗng chọn repair_task. Status NEEDS_REVIEW nhưng thiếu review.ready/output thật cũng chọn repair_task, không xin duyệt bản thiếu.
- review của milestone: ready true chỉ sau agent audit technical/actual-vs-target/coverage và chuẩn bị playtest rõ. Có outputs proof và issues trống trước xin nghiệm thu.
- acceptance: null tới khi có user nghiệm thu milestone thật; sau đó lưu outputs proof + approval quote/date/source. Chỉ technical PASS/all task DONE không được bỏ qua bước này.
- lock manifest dùng schema tại SPEC_LOCK.md; requiredSpecs/requiredTargets phải được cập nhật theo scope plan thật. Không dùng danh sách trống để lách gate.

## Selector và agent

Script đọc, không ghi metadata hay tự approve. Mỗi report có milestone/task/action/canExecute/reasons/suggestedPrompt. canExecute true nghĩa agent có thể thực hiện bước được next giao, không là quyền đổi design tùy ý. request_* trả canExecute false: cần user quyết định thật; agent dẫn artifact cụ thể, không xin lại quyền routine.

Agent phải đọc nội dung liên quan sau selector. Nếu biết spec/ảnh/cross-contract còn thiếu mà index chưa ghi, bổ sung issues và đưa prompt sửa, không lấy nhãn PASS làm cớ dừng chờ review. Nếu output script sai do dữ liệu lỗi, sửa index theo artifact thật và kiểm lại; không sửa trạng thái cho đủ để đi tiếp.

Các hồ sơ P0/P1 đã có trước C10 được giữ nguyên. Bước next hiện tại là reconcile process/dependencies của P1 theo milestone lock; mọi gap gameplay/art/reference thật vẫn cần được giải, không được xóa chỉ vì không còn global gate.
