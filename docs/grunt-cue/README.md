# Grunt — phân biệt chuẩn bị / Perfect / hit

- `prepare.png`: windup0.42s, HP100, quạt rỗng/viền đứt hồng.
- `perfect-window.png`: còn dưới160ms và player đang bị đe dọa; viền liền/vàng + chevrons, HP vẫn100.
- `strike.png`: tick windup về0, HP88; flash trắng/tô quạt chỉ2frames.
- `recovery.png`: sau5ticks simulation, chỉ slash gãy mờ, không fill/radial edges.
- `prepare-320.png`, `prepare-844.png`: viewport khác; `production-390.png`: input Bắn thật trong opening bản production.

Bốn ảnh phase là fixture 1Grunt, core step/renderer thật. Browser cũng xác nhận dash sớm không Perfect, dash khi vàng có1Perfect, rời vùng threat không có vàng; tests/build/prod smoke PASS. Không chứng minh user đã đọc nhịp dễ hơn trên máy thật.

Scope user thử lần này: Grunt ở opening, không đánh để tránh ngắt/làm chậm windup. Dụ quạt, đợi viền vàng rồi Lướt (Space desktop), trước flash trắng. Mong đợi Perfect Dodge và không mất HP; thử lướt sớm lúc viền đứt để đối chiếu. Chưa cần thử lại Elite/Boss.
