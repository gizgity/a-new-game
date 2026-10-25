# Q4 — Chain depth

- `setup-390.png`: fixture bốn Grunt500HP, lần lượt1/2/3/0Rupture. Các ô hình thoi cho biết stack, không phải natural run.
- `trigger-390.png`: Basic vào con đầu, root nổ ngay; marked neighbour được queue, chưa cộng Detonate/charge.
- `relay-390.png`: sau8ticks core (gồm hitstop), relay thứ hai với đường nối nguồn→đích. Blast giữ tâm/radius snapshot trước knockback. Con thứ ba tiếp tục relay sau4ticks simulation; con không dấu chỉ nhận AoE.
- `layout-320/844/1440.png`: fixture renderer ở các viewport, không overflow/runtime error.
- `opening-390.png`: tải lại sạch, Start/giữ nút Bắn5giây/pause-resume/vi-en, không grant stats.
- `production-320/390/844/1440.png`: dist với base `/a-new-game/`, Start/pause/resume/vi-en và giữ Bắn390; không grant stats, không runtime/request errors.
- Focused tests kiểm bridge/gap/unmarked, stack damage/radius, snapshot khi chết,30vụ thực thi đủ với budget12/tick, charge/unlock trả lúc nổ, freeze hitstop và reset. Typecheck/build PASS; không thay thế human playtest, Safari/iOS hoặc full-run.
- Playtest: gom2–3Grunt, Chém đặt dấu rồi Bắn/Đánh mạnh một con; mong đợi nổ nối qua marked neighbours ở gần. Tách xa để đối chiếu không lan. Tích lực vẫn tự seed khi chưa melee. Kiểm relay có rõ, có chậm hoặc che telegraph không; báo setup/thực tế/thiết bị/browser.
