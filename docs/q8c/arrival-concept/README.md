> Q8C runtime đã **ACCEPTED — USER PLAYTEST APPROVAL** theo user “q8c đạt” trên8cbff77 ngày2026-10-26; giữ boardV1 superseded, V2/audio approval và evidence lịch sử. Không mở Q8D.

# Boss Arrival Ambient — concept review

**VISUAL / AUDIO PREVIEW APPROVED** — user “ok, làm đi” sau khi xem boardV2 và nghe audio sketch; runtime vẫn chờ playtest. User nhận xét “boss ổn r” trên correction1302474: ghi nhận phần Boss/Enraged ổn, không suy ra toàn Q8C accepted khi warning còn cần sửa. User yêu cầu approve trước khi làm; assistant đề xuất mockup→duyệt→tích hợp, user “ok, ổn” cho hướng này. Lượt này chỉ tạo review artifacts, **không sửa src/public/workflow hoặc deploy gameplay**. Không mở Q8D.

## Review bản hiện hành

- `arrival-board-v2.png`: concept bằng ImageGen, desktop+phone dựa screenshot renderer thật `../evidence/warning-1440.png` / `warning-390.png`. Đây là ảnh thiết kế nhịp cuối mạnh nhất, không là runtime screenshot mới, không chứng minh collision/readability4góc trên renderer.
- `arrival-board-v1-superseded.png`: nháp có mảng góc quá lớn, **SUPERSEDED / KHÔNG TÍCH HỢP**. V2 bỏ plates/diagonal spokes, chỉ giữ seam rạn và halo hẹp ở đúng mép playable arena.
- `arrival-audio-sketch-v1.wav`: mẫu2giây original procedural,4nhịp tại0.10/0.60/1.10/1.60s, gain tương đối0.32/0.46/0.66/0.90, tiếng trầm+kim loại ngắn gợi xích siết, không external sample. Script/parameters/peak trong `make-audio-preview.py` và `audio-preview.json`. Đây là preview riêng, chưa mix với combat/phone speaker, chưa là final sound acceptance.
- Khung/nhịp đề xuất: viền đỏ cam rạn hẹp với halo mềm/ít embers chỉ sát mép,4nhịp tăng dần trong2s, nhịp cuối mạnh nhất rồi biến mất khi Boss spawn; khi tích hợp sẽ căn peak hình/âm cùng clock warning thật, không bám timer độc lập. Mẫu WAV chỉ duyệt màu âm/nhịp.
- HUD/controls ngoài arena giữ, không overlay đỏ toàn màn, không che center/telegraph hay chặn input. Không screen shake, thay floor/actor/Boss/build, spawn timing, freeze logic hoặc gameplay. 2s warning và controls hiện tại giữ.

## Source/provenance

ImageGen edit từ screenshot artwork riêng của repo. Reference Q7A/Q7C đã được user accepted. Prompt/source/hash trong `manifest.json`; bản board là concept, **không crop board thành runtime texture**. Sau khi được duyệt mới tạo asset edge riêng phù hợp landscape/portrait và tích hợp render/audio KISS, tận dụng hệ âm procedural hiện có. Không framework/dependency mới.

## Checks và Next Action

Đã xem baseline và review concept, WAV có2s/mono44100Hz/PCM16bit, peak không clip. Không chạy game build/tests vì không đổi implementation. Chưa kiểm runtime/performance/touch/corner/telegraph/mute/volume/Pause/Replay của thiết kế mới; chỉ làm sau visual approval.

NEXT ACTION: tích hợp/test/deploy theo approval, xem ../arrival-runtime/README.md; không yêu cầu duyệt lại Boss/Enraged. Q8C tổng thể vẫn chờ playtest. Phần mô tả “chưa sửa runtime” phía trên là snapshot khi làm concept, giữ lịch sử.
