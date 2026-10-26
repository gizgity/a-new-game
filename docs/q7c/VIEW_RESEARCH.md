# Q7C — Research góc nhìn

Ngày2026-10-26, theo user hỏi arena nhìn90° nhưng nhân vật xéo. **User đã “visual approved q7c” sau research ngày2026-10-26.** Đã triển khai top-down¾cáchđiệu nhìnxuốngcao, xem IMPLEMENTATION.md; chưa runtimeplaytestaccepted. Phần nghiên cứu/đềxuất bên dưới giữ theo thờiđiểm nghiêncứu, không còn làgate chờduyệt. Q7D chưa mở.

## Kết luận đề xuất cho project

Ưu tiên **stylized top-down ¾, góc nhìn xuống tương đối cao**, giữ mặt đất2D/gameplay/camera/telegraph hiện có; chỉnh nhân vật để đồng nhất angle/pivot/ground contact. Không chuyển cả project sang isometric hoặc bắt buộc nhân vật chỉ nhìn thấy đỉnh đầu. Đây là suy luận phù hợp scope/mobile/combat của project, không là kết quả nghiên cứu thực nghiệm chứng minh một góc độ tối ưu.

Nhận định trước “sàn90° và nhìn thấy ngực nên sai góc” quá tuyệt đối. Trong2D, phối cảnh sprite có thể cách điệu khác mặt đất có chủ đích. Không thể đo chính xác camera elevation từ pattern sàn; camera Phaser hiện làviewport/zoom2D, góc artwork đã bake. Hướng nhân vật quay xuống-phải khác góc cao nhìn xuống; không dùng hai khái niệm này thay nhau.

## Nguồn và điều thực sự được xác minh

1. [Cornell — Perspective in 2D Games](https://www.cs.cornell.edu/courses/cs3152/2019sp/lectures/15-Perspective.pdf), slides21/23/40–41/46–49: phân biệt top-down overhead, dimetric và phối hợp góc; overhead hạn chế mặt nhìn thấy của avatar, axonometric có thể che vật và tăng côngart. Nguồn giảng dạy, không phải thử nghiệm UX tối ưu cho game này. PDF text đọc được; screenshot service lỗi nên không tuyên bố đã kiểm ảnh PDF.
2. [DodgeRollBrent giải thích trực tiếp setup Enter the Gungeon](https://www.reddit.com/r/EnterTheGungeon/comments/4sed7a/comment/d7p3jjv/): camera không nghiêng, floor và walls nghiêng ngược nhau45°. Đây là setup riêng trongUnity; **không là khuyến nghị sprite phải45° hoặc phải port setup3D sangPhaser**. Nó cho thấy góc cameraengine khác phối cảnh cuối nhìn thấy.
3. [Brotato — trang nhà phát triển trênSteam](https://store.steampowered.com/app/1942280/Brotato/) mô tả top-down arena shooter roguelite; [20MinutesTillDawn — publisherErabit](https://www.erabitstudios.com/h5/gameInfo/9) mô tả top-down bullethell/actionroguelike. Chứng minh top-down là hướng phù hợp nhóm tham chiếu, không chứng minh camera elevation cụ thể.
4. [HyperLightDrifter — HeartMachine](https://www.heartmachine.com/hyper-light-drifter) có gallerygameplay; [AlexPreston nói về combat](https://blog.playstation.com/2014/03/14/creating-the-world-of-hyper-light-drifter-on-ps4-and-ps-vita/) nêu combat nhanh và feedback. Tham chiếu phù hợp cho sword/gun/animation; không có thông số góc camera được xác minh tại đây.
5. [Hades — trang nhà phát triển trênSteam](https://store.steampowered.com/app/1145360/Hades/) cung cấp game/media, có tagIsometric (tag người dùng, không dùng như bằng chứng thông sốengine). Dùng làm lựa chọn đối chiếu art, không suy ra isometric tối ưu choarena mobile này.

## Đánh đổi — đánh giá riêng cho project

| Hướng | Lợi ích | Đánh đổi | Phù hợp hiện tại |
| --- | --- | --- | --- |
| Overhead90° nghiêm ngặt | Ít che sàn, hướng đòn/vị trí trực tiếp | Mặt nạ/lõi/thân/pose bị thu; nhận diện6role phải dựa nhiều vào vai/vũ khí | Khả thi nếu ưu tiên hình học chiến đấu tuyệt đối, nhưng mất nhiều thiết kế Q7A |
| Top-down¾ cách điệu | Giữ mặt/mask/weapon/pose, mặt đất vẫn dễ đọc | Phải kiểm chân/pivot/độ che cue, đồng nhất góc6actors | **Đề xuất**, ít thay scope nhất |
| Isometric toànscene | Có khối/chiều sâu rõ, hợp presentation giàu môi trường | Cần đồng bộ lạifloor/projection/telegraph/occlusion; mở scopeQ7A và QA đã khóa | Không đề xuất choQ7C |

Spec art nên là thấy mặt trên đầu/vai/weapon, torso/chân rút ngắn tương đối, vẫn giữ mask/core đọc được; cùng góc giữa6actors và mọi hướng/state. Thân3/4 đứng không nên xoay phẳng360° để giả facing. Pivot/visualoffset phải làm rõ ground location tương ứng collider; không thêm vòng/bóng/VFX mới như một correction tự động. Không vẽ lại floorQ7A hoặc đổi gameplay để hợp sprite.

Không có nguồn xác nhận một con số45/60/75° là tốt nhất cho project. Nếu dựng3Dguide để so, góc phải ghi mốc đo (90° từ mặt đất=overhead); đây chỉ là mẫu thử, không thông số cần sửa camera runtime.

## Kiểm chứng cần trước khi chốt art

Đề xuất bảng so sánh overhead và¾nhìnxuốngcao trên cùngfloor/vịtrí/scale/lighting, ưu tiên Player/Grunt/Bulwark/Boss, có hướng trước/sau/ngang. Kiểm100% mobile320/390, crowd và grayscale; đặt cạnh groundtelegraphs thật trước khi kết luận combat readability. Không chỉ so poster phóng lớn. Chưa sinh bộ artwork mới trong lượt research; vẫn chờ user feedback/hướng revision trước integration.
