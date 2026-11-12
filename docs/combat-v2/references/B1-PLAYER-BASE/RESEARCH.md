# B1-SOUL — Research / separated crystal body

2026-11-12 · spec revision4 · PROPOSED. Nghiên cứu phục vụ visual prototype, không technical prototype/production. Không có game tham khảo nào được coi là hoàn toàn trùng art direction CURSEBREAK.

## Sources đã tra

| Nguồn | Điều đã xác minh / quan sát | Bài học chuyển thành thử nghiệm | Không lấy |
| --- | --- | --- | --- |
| [Xerath — Riot official](https://www.leagueoflegends.com/en-us/champions/xerath/) / [official splash](https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Xerath_0.jpg) | Official mô tả thực thể năng lượng và mảnh sarcophagus; đã mở trang và ảnh. [In-game model reference](https://static.inven.co.kr/image_2011/site_image/lol/dataninfo/icon/skingame/xerath_classic.jpg?v=260108a) đã mở qua web | Khoảng tối giữa khối vật chất giúp năng lượng có hiện diện riêng; phải kiểm từ góc gameplay chứ không chỉ splash | Không sao chép giáp/crown/chain/palette/anatomy; thân năng lượng liền vẫn có thể làm khối quá kín |
| [Knack — PlayStation official](https://www.playstation.com/en-us/games/knack/) / [developer discussion](https://blog.playstation.com/2013/10/18/a-deeper-look-at-the-world-of-knack-on-ps4/) | Official xác nhận hero có sức mạnh từ relics/biến đổi; image search trả modular model, official cover đã mở. Full-res third-party model retrieval timeout, screenshot khác404; không giả đã phân tích ảnh đó ở native scale | Gom nhiều phần thành các cụm chức năng lớn, giữ tỷ lệ/pose làm bản sắc trong khi vật chất đổi — đây là suy luận thiết kế, không quote từ developer | Không mascot face, red spikes, nhiều vụn nhỏ/khối đá cơ bắp, không copy scale/growth mechanics |
| [Rayman — Ubisoft official](https://www.ubisoft.com/en-us/company/about-us/our-brands/rayman) / [reference pose đã mở](https://www.pngkey.com/png/detail/190-1907668_posing-rayman-rayman-origins.png) | Official xác nhận franchise/character; ảnh pose cho thấy hands/feet rời vẫn có thể đọc một nhân vật | Pose/tương quan head–hand–feet liên kết các phần qua khoảng trống, không cần anatomy nối liền — suy luận quan sát | Không lấy cartoon face/hair/clothes/colors/tone, không coi Rayman cùng art style occult |

Web image search/text/ảnh trực tiếp chỉ là nghiên cứu; không có external image được tải vào repo hoặc đưa vào ImageGen. Artwork/trademarks thuộc chủ sở hữu tương ứng, không cấp phép dùng production. Không chọn mua/download model bên thứ ba.

## Hypothesis → visual prototype

Bản trước “các tinh thể dính nhau quá, chưa đẹp”: thay topology khớp liền bằng các cụm tách thật ở vai/eo/chi; giữ nền tối nhìn xuyên khoảng hở. Rút trụ dài thành khối năng lượng gọn, forearm/foot crystal riêng, không nối bằng glow tube, không tiny orbit shards. Nguyên tắc tham khảo được diễn giải thành prompt gốc; không tạo Xerath/Knack/Rayman reskin.

Output [B1-SOUL-separated-v1.png](B1-SOUL-separated-v1.png), ImageGen original từ text, một nhân vật neutral, nền study, nhãn CONCEPT — PROPOSED — NOT PRODUCTION. Không 3D runtime hay mesh/model.

Observed: phần lớn cụm tách rõ; không trụ dài/khớp đá liền; palette có warm highlights, hình khối2.5D ít noise hơn. Chưa hoàn toàn đáp ứng prompt khoảng9masses: có thêm mảnh dưới pelvis và có chỗ chi che khuất/đọc gần nhau; không coi mọi chi tách hoàn hảo.
Risks: khoảng hở có thể quá lớn và phá unity; vai mảnh, hướng/head focus chưa mạnh; hình vẫn có thể giống một construct/enemy. Cần user đánh giá vẻ đẹp/protagonist, không tự PASS.
Unverified: native gameplay scale, crowd/telegraphs, grayscale, motion/body reassembly/mobile/desktop/performance. Không có comparison runtime hợp lệ mới.


## Refinement — spec revision5

User thấy spec4 gần hơn, yêu cầu agent tự cải thiện thiếu sót. Không đổi game references hay hướng soul/crystal. Cải thiện có chủ đích: gap ngắn để unity, head compact có hướng, palm/foot distinct khỏi shards lặp, pelvis gọn và bớt frame ngực.

Lượt cohesion cải thiện stance nhưng thêm filler bắp tay/đùi và head lớn — đã tự phát hiện và edit correction. Lưu intermediate để trace input, không approved target. Correction bỏ filler, giảm head, giữ gap ngắn và rõ feet. Soul vẫn có vệt gần swirl/palm hơi claw, góc chưa overhead đủ; không chấm quality/readability PASS. Native game scale/mobile/desktop/crowd/telegraph chưa checked. Xem exact prompts và metadata trong manifest.
