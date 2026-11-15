# S1 — Dungeon world, camera và khám phá

Revision: **2 · 2026-11-15 · APPROVED — PLANNING ONLY**. Producer: DR-P1 / K-W.
Baseline design: [Review V1 R06/R11/R12](../../REVIEW_V1.md), approved tại C09; hồ sơ S1 rev2 đã được user “y”,2026-11-15, hội thoại hiện tại không permalink; duyệt hồ sơ planning/S1 rev2, không target/global lock hoặc child execution. Binding trước approval tại đầu plan; nhãn PROPOSED bên dưới là snapshot proposal planning, không production readiness; mọi mục OPEN giữ nguyên. [Plan/tickets/audit](../DR-P1_PLAN.md). Global lock DR-LOCK-01 rev0 **NOT_LOCKED**. Không implementation/asset production từ file này.

## 1. Quyền, nguồn số và ranh giới

- Một biome, world liền mạch, tuyến chính uốn khúc/pocket/nhánh ngắn hoặc loop; Boss ở phòng riêng, camera follow và minimap khám phá. Giữ R01/R09 về đơn vị, collider, tốc độ và simulation; giữ R06 về mật độ, route, kích thước, camera và hai ngân sách. Các bảng số gameplay ở R01/R05–R09 là **nguồn duy nhất**, không sao chép catalog/balance sang S1.
- S1 bổ sung thuật toán/schema/geometry và default kỹ thuật để review, không tự supersede R06. Các lựa chọn mới mang nhãn PROPOSED dù mô tả ở dạng contract. Số ở fixture §4 là geometry kiểm chứng của candidate, không là số đo Atlas hoặc target visual đã duyệt.
- Không tree/roll modifiers, combat/actions, composition/AI, Boss moves, banking/storage schema, HUD ba skill/audio/tutorial. P2/P3/P4/P5/P6 sở hữu các phần này; S1 cung cấp interface hữu hạn ở §3/10.
- Không dựng tilemap engine/procedural art; topology/collision data tách khỏi các Image/layer artwork tĩnh. Không sửa production/main/save hiện hành.

## 2. Hệ tọa độ và dữ liệu nền

- World X sang phải, Y xuống, radian quay theo quy ước actor runtime; tọa độ origin góc trên trái. D lấy R01. World/grid dùng world px, viewport/input dùng CSS px; devicePixelRatio chỉ phục vụ độ nét framebuffer.
- Navigation grid vuông **0,5D/cell**; bounds theo số nguyên cell. `walkable` là union pocket/corridor/entry/Boss room, ngoài union là solid. Artwork không sinh collision. Kích thước hành lang là bề rộng trống thực, không gồm bevel/tường vẽ.
- Circle actors có radius truyền rõ từ chủ sở hữu; Player dùng R09. Không suy hit radius từ sprite box. Queries có epsilon kỹ thuật **0,01 world px** để xử lý tiếp xúc; không nới tầm damage/đường đi bằng epsilon.
- Dữ liệu xuất immutable, mảng sắp theo ID; renderer không sửa tọa độ/state. Tên dưới là **schema đề xuất, chưa phải API/class đang có**.

| Payload | Trường / invariant |
| --- | --- |
| MapIdentity | `worldSpecVersion=1`, `generatorVersion=1`, `nodeId` opaque do P5 cấp, `mapSeed` uint32 khác 0, `depth` thuộc R10, `ascension` thuộc R04, `modifierSnapshotId`; không nhận locale/device/build làm RNG input |
| WorldDefinition | identity, bounds, cellSize, walkable mask, regions, corridor edges, entry pose, mainRoute ordered points, bossRoom, packAnchors, renderPlacements; không mutable HP/kill/claim |
| Region | id ổn định, kind `entry/main/optional/boss`, shape, mainRoute index hoặc null; home region của pack không đổi do chase/leash |
| PackAnchor | id/regionId, clusterId, home point, spawn envelope; composition/rarity/member IDs/budget weights do K-E bổ sung sau, không đoán trong world generator |
| BossRoom | interior mask, gate segment, approach point, entry point, boss anchor, adds-safe mask; anchor không tự là Boss spawn/aggro |
| WorldSession | identity, gateState, discovered cells, bossDiscovered; lifetime đúng một lần vào node, không lưu world giữa map |
| BudgetAnnotation | `packId, homeRegionId, killWeight, eliteUnits`; một record/pack, totals bằng tổng member K-E, không gồm Boss/adds/cleanup |

## 3. Seed, generation và lỗi

**Phân biệt fixture và release:** template §4 cùng 8 phép đối xứng chỉ là fixture kiểm world scope P1. Contract release R06 vẫn là một biome Hầm Ấn Vỡ, **ba biến thể kiến trúc trong cùng bộ art, random đường và phân bố bầy**; xoay/lật không được tính là topology mới hoặc hoàn tất contract này. Còn OPEN: P1 phải đặc tả tập biến đổi graph/tuyến chính/nhánh-loop và thuật toán chọn theo seed, tiêu chí nhận diện đường khác sau loại đối xứng; CONCEPT-01 phải định nghĩa ba biến thể kiến trúc và mapping module dùng chung/khác, không tự chọn direction ở lượt này. CODE-01 chỉ implement thuật toán release sau khi phần thiết kế này đủ và được khóa; ART-01/CODE-06 phải phủ đủ target ba biến thể. Điều kiện đóng trước lock: bảng seed→route graph/pack-placement digest/variant ID với ví dụ đường khác thực sự, kiểm connectivity/budgets/geometry và target ba biến thể được duyệt. Owner thiết kế world: P1 (hồ sơ PLAN-01/CODE-01); envelope/composition: P2 K-E; visual: CONCEPT-01. Chưa thực hiện các task này.

1. P5 cấp và persist `mapSeed` khi tạo node; P1 không tự roll expedition/node ID hoặc gọi clock/Math.random trong generation. Fixture dùng node ID cố định. Seed 0/NaN/ngoài uint32 là `INVALID_IDENTITY`, không âm thầm đổi seed.
2. Streams tách bằng FNV-1a 32-bit trên UTF-8 chuỗi `dr-world-v1|<mapSeed decimal>|<stream>|<attempt decimal>`; multiply dùng unsigned `imul`, offset basis 2166136261/prime 16777619. Hash 0 thay bằng 0x9e3779b9. Xorshift32 cùng phép dịch của `DraftRandom.next` đã audit; không import catalog/draft engine để dùng RNG. Integer `[a,b] = a+floor(next()*(b-a+1))`. Streams `layout`, `anchors`, `decoration`; K-E nhận seed riêng từ stream name `encounters`, không tiêu stream world; P3/P5 có streams độc lập.
3. Constructive template §4: draw đầu stream layout chọn index `floor(next()*8)`:0–3 quay 0/90/180/270°,4–7 quay tương ứng rồi mirror X trong bounds đã quay. X/Y cùng đổi với bounds, quay quanh tâm rectangle rồi translate origin về (0,0);90/270° đổi width/height. Không đổi D/range/physics theo thiết bị. Thuật toán này chỉ xác định fixture §4; không thay thuật toán random đường release còn OPEN ở đầu §3.
4. **PROPOSED chi tiết rounding:** pack count N theo range depth R06, draw integer uniform đầu stream anchors attempt0 và giữ N suốt generation. Phân bổ ban đầu M=floor(85×N/100+0.5) anchors main (half-up), O=N−M optional; bảo toàn M+O=N. Trong từng nhóm region main/optional sắp ID tăng, chia q=floor(total/regionCount) và dư r=total mod regionCount: r region đầu nhận q+1, còn lại q. Đây tương đương round-robin bắt đầu từ ID nhỏ nhất. Đây là phân bổ **địa điểm**, không bảo đảm weight chỉ bằng pack count. K-E phân composition/rarity/escorts/mod D06 từ nguồn R05–R09; không sinh pack trong entry/Boss/corridor chuyển cụm.
5. Trong mỗi pocket, chia anchors thành cluster 2–3 pack. **PROPOSED nhóm dư:** với n pack/region, chia q=floor(n/3), r=n mod 3; r=0 dùng q nhóm3, r=2 dùng q nhóm3+nhóm2, r=1 và n≥4 dùng (q−1) nhóm3+hai nhóm2. n=0 không cluster, n=1 là allocation invalid, không tạo nhóm1. Cluster IDs theo thứ tự nhóm3 rồi nhóm2; sau relocation phải nhóm lại và kiểm n=1, không bỏ pack. K-E cung cấp cluster/member spawn envelopes theo collider thật; sampling center dùng stream anchors: angle=`next()*2π`, radius=`sqrt(next())*availableRadius`, theo thứ tự cluster ID. `availableRadius` là pocket radius trừ cluster envelope radius; collision/spacing kiểm trước khi chấp nhận. Khoảng chuyển giữa cụm R06 đo **từ biên spawn envelope tới biên cụm sau dọc đường đi được**, không dùng khoảng cách tâm thay khoảng trống. Member placement K-E phải có clearance, không overlap khi vào node; không spawn bù trong trận. Nếu envelope cho density cao không fit pocket fixture thì báo geometry-density conflict cho P2/P1 closure, không tự giảm bầy hoặc mở rộng pocket; đây là gap K-E còn phải kiểm trước lock.
6. Pipeline `identity → layout/mask/connectivity → count → K-E roster/annotation → home allocation/budget → placement/clearance/spacing → decoration/final validation → sealed definition → session`, với stage/retry ở bước8. K-E đã biết toàn roster trước khi playable; renderer/camera không tiêu RNG. Chưa có K-E thì geometry fixture ghi **BUDGET_UNANNOTATED**, chỉ kiểm topology; không giả map đã đạt ngân sách.
7. **PROPOSED relocation cố định trước sampling vị trí:** nếu budget không đạt: chuyển **nguyên pack** từ optional sang main theo thứ tự eliteUnits giảm dần, killWeight giảm dần, packId tăng dần; chọn receiver main có số pack ít nhất (tie regionId tăng), chuyển home trước khi sampling rồi kiểm lại cả hai ngân sách. Bỏ qua candidate nếu khiến region optional còn đúng1pack; receiver/cluster allocation đã chọn giữ nguyên qua placement retries. Nếu không có candidate hợp lệ hoặc hết pack mà chưa đủ cả hai budget thì fail stage budget. Chỗ đặt thực phải được chứng minh ở stage placement, không coi home allocation là đã fit. Không reroll rarity/giảm tổng quái/đổi threshold hoặc lén chuyển weight của pack đang ở nhánh. Layout giữ nguyên, chỉ home/spawn placement trước entry thay đổi.
8. **PROPOSED retry stage:** identity→layout→count→roster/annotation→home allocation/budget→placement→decoration/validation. Fixture layout/transform dùng stream layout attempt0, N dùng draw anchors attempt0 nêu trên; K-E encounters attempt0 roll roster đúng một lần. Layout, N, member IDs/rarity/roles/radii, weights, denominators và home allocation/cluster grouping sau relocation đều đóng băng trước placement. Placement attempt a=0…15 resample duy nhất vị trí cluster/member qua stream anchors attempt a; luôn consume draw đầu của stream đó rồi mới sample center (draw này chỉ quyết N ở attempt0, ở các attempt khác bị bỏ). K-E dùng subseed placement theo clusterId/memberId từ anchors stream, không gọi lại encounters để roll roster. Mỗi attempt đặt lại toàn bộ vị trí từ đầu, không mang state/position thất bại trước sang; reject một candidate/attempt tăng a đúng một, không nested retry 16×16. Chi tiết thứ tự sample member thuộc K-E còn OPEN và phải được chốt trước lock. Collision/clearance/spacing fail chỉ sang a+1; topology/connectivity/allocation/budget hoặc input invalid fail ngay, không resample layout/count/roster để chữa. Decoration stream attempt0 chỉ chạy sau placement hợp lệ và không đổi gameplay; validation cuối không đạt invariant thì fail, không retry decoration để chữa. Relocation chỉ đổi main membership/region totals trước placement; tổng N/roster/tổng weights giữ nguyên, retries không đổi budgets đã chốt. Log stage/reason/a và hashes các snapshot cố định để kiểm deterministic. Hết chỗ/connectivity/budget fail trả `GENERATION_FAILED` kèm identity/stage/reason/attempt, giữ màn trước entry; không spawn Player vào map lỗi, không commit node/refill/reward mới. P5 quyết atomic entry và thông báo retry; retry cùng identity, không reroll tree. Thay generatorVersion cần approval/delta trước lock update, không đọc lại seed cũ bằng thuật toán mới mà giả parity.

## 4. Fixture geometry tham chiếu — DR-WORLD-808

Fixture identity: `nodeId=dr-world-808`, `mapSeed=808`, depth1/A0, modifier snapshot rỗng **chỉ để cô lập geometry, không là node expedition hợp lệ theo R05**. Bảng dưới là template canonical **trước transform**; dùng cùng thuật toán §3, không fixture override RNG. Stream layout attempt0 có hash546285334, first draw0.35077912360429764 → index2/quay180°. Vì vậy world808 thực áp `(x,y)→(104−x,80−y)` cho mọi point/shape, entry thực (100,64) hướng−X và Boss center (88,16). Capture/mockup phải ghi transform2, không gọi bảng canonical là tọa độ world808 sau generation. Runtime khác dùng §3 và modifier snapshot hợp lệ do P5 cấp. Đây là dữ liệu đề xuất để CODE/VERIFY về sau dựng, **chưa tồn tại map runtime/ảnh target**.

| Phần | Geometry theo D |
| --- | --- |
| Bounds | [0,104]×[0,80] |
| Entry | (4,16), hướng +X; nối main đầu bằng corridor, không đặt pack/threat trong vùng an toàn R06 quanh điểm vào |
| Main pockets M1…M8 | Centers (16,16),(40,16),(64,16),(88,16),(88,40),(64,40),(40,40),(16,40); mỗi pocket radius9 |
| Main connectors | Nối liên tiếp M1→M8, corridor rộng6; không tự nối các pocket gần nhau qua wall |
| Optional pockets O1/O2 | Centers (40,64),(64,64), radius9; nối M7→O1→O2→M6, corridor rộng6: một loop, không bắt đi để tới Boss |
| Boss room | Center (16,64), radius11; nối từ M8; gate ngang y=53, x=13…19; approach (16,52.5), accepted entry (16,54), Boss anchor center |

Rasterization: cell là walkable nếu **toàn cell** nằm trong union hình tròn/rectangle corridor, bao gồm ô ở nối nếu nằm trong union; không chỉ test tâm rồi để art vượt collision. Không erosion hai lần: queries mới inflate solid theo actor radius. MainRoute là entry→M1…M8→gate, chiều dài **193D**; tới Boss center là **204D**. Mỗi đoạn nối tâm pocket 24D; phần trống giữa hai pocket radius9 là6D, M8→Boss có4D trống. Chúng thuộc range R06; không cộng bề rộng các cluster để báo tổng route sai.

Main/optional masks được gán trước corridors, shared junction thuộc main; pack home luôn một region duy nhất. Corridor optional không cắt/vượt vào Boss room. Validate flood-fill reachable cho entry, mọi pack anchor, approach và entry Boss khi gate open. Entry không ở giữa collider; D06 không được làm mất khoảng an toàn.

Fixture khi có K-E: tổng pack/member/rarity theo R06, không pin composition trước planning P2. Ví dụ **ledger tổng hợp để kiểm công thức, không roster thật**: main kill420/optional80; main eliteUnits110/optional10. Phải PASS cả hai; case main kill399/total500 FAIL route80% dù đã đủ Boss75%; main eliteUnits40/total100 FAIL draft dù kill PASS. Zero elite total là generation invalid, không auto grant draft.

### Feasibility geometry–density — OPEN, chưa có placement evidence

Route193D/204D chỉ kiểm chiều dài tuyến; không chứng minh số bầy/cluster fit. Inputs cần pin: geometry/mask/clearance thật S1, N và chặng R06, composition/rarity/role từng pack theo R07/R09, member IDs và collider radius từng role/rarity, số hộ tống sau D06 và quy tắc làm tròn một lần, vị trí tương đối member, pack envelope và cluster envelope (polygon hoặc circle conservative), cách giữ envelope khi rotate, đường đo gap giữa **biên** envelopes và lối đi Player còn lại. P2 K-E chưa cấp đủ các trường member/collider/offset/envelope/rounding/placement order này; S1 không tự suy collider từ sprite hoặc bịa radius.

Worked example **chỉ đếm, PROPOSED theo rounding §3**, dùng N trong R06: N45→M38/O7, main8region nhận sáu region5pack và hai region4pack, optional2region nhận4/3; n5→3+2, n4→2+2. N70→M60/O10, main nhận bốn region8pack và bốn region7pack, optional5/5; n8→3+3+2, n7→3+2+2. Tổng lần lượt45/70, tất cả nhóm2–3; đây chưa phải placement hoặc phân bố sau relocation. D06 chỉ tăng escorts theo R05 (cap+35%), không tăng leader: hộ tống base18 cho giá trị trước làm tròn18×1.35=24.3; không chốt số nguyên/member cuối khi K-E chưa định rounding. Biên count trước D06 là45×(8+1)=405 tới70×(18+1)=1330 member; không dùng average14 ở R06 làm upper cap.

Closure do P2 cung cấp K-E và P1 đối chiếu: lập bảng từng region/cluster/member đã pin spec revisions, seed, N/depth/Asc/rarity/D06 (baseline và cap), trước/sau relocation; tọa độ/envelope phải nằm hoàn toàn trong walkable có clearance, không overlap collider/spawn, gap ngắn nhất dọc đường trống giữa hai biên cluster kế tiếp3–6D, entry safe và lối main/optional/gate vẫn đi được. Kiểm các đầu mút45–70 cùng các chặng trung gian R06, composition/envelope cực trị hợp lệ R07 và D06 cap; ghi margin tối thiểu/FAIL reason, không chỉ diện tích tổng. Nếu không có placement thỏa tất cả thì gap giữ OPEN, trình conflict đúng scope; không giảm N, nới pocket/spacing. Trước lock cần worked placement có tọa độ/envelope từ dữ liệu K-E và tính khả thi kiểm được; sau implementation VERIFY-01 kiểm actual placement, P2/P6 kiểm density/feel runtime. Không mở planning P2 hoặc tạo simulation/code để lấy evidence trong lượt sửa docs này.

## 5. Collision, navigation, LOS và query cho consumer

- `canOccupy(point,radius,zone)` kiểm disc đối với solid/outside/closed gate; radius hữu hạn ≥0. `sweepDisc(from,to,radius,zone)` trả first hit fraction, point, normal; earliest collision trước movement/hit. Gates là mask boundary có version để invalidate cached navigation.
- Đi bộ: normalize vector như `movePlayer`, delta từ speed thật; sweep→đến trước contact epsilon→chiếu phần dịch chuyển còn lại lên tiếp tuyến wall→sweep lại, tối đa 3 contacts/tick. Concave/corner dừng phần còn lại nếu không còn tiến triển, không teleport, không tăng distance bằng slide. Dash/knockback dùng cùng swept collision (không xuyên wall), giữ duration/charge/i-frame thuộc K-A. Kẹt/invalid spawn là lỗi generation, không dịch Player sang nhánh gần nhất.
- Navigation: A* 4-neighbor trên mask đã clearance theo radius; heuristic Manhattan, cost theo world distance, ties f rồi h rồi cell index `y*width+x`. Chỉ smooth waypoint nếu swept disc đoạn thẳng đi được; không cắt góc. Không có route trả `NO_PATH`, K-E giữ/chờ/repath theo AI, không xuyên tường. Home/leash metric là **độ dài đường đi được** từ home, K-E sở hữu điều kiện thời gian/leash R07.
- LOS: segment đối solid cells + gate, không qua góc chạm hai solid; endpoint trong solid invalid. LOS point dùng cho phát hiện; movement radius riêng. `firstWallHit(segment,projectileRadius,zone)` dùng swept disc; tường thắng nếu cùng distance với actor hit. Projectile trừ range theo quãng đường world thực, không theo camera; P3/P4 sở hữu pierce/chain/hits.
- Melee/beam/area không gây hit xuyên tường: K-A phải kiểm LOS origin→candidate ngoài test cone/radius, beam/projectile dừng ở first wall; điểm đặt phụ clamp range trước, còn blocked thì invalid, không tự tìm vùng trống/tiêu CD. Chi tiết resolver do P3; S1 không viết damage algorithm.
- Không collision theo alpha texture; tường vẽ và silhouette occlusion phải bám geometry. Viền cao có thể che nền, **không che Player/cue** tại mép trên/4góc; production target quyết occlusion cutaway nếu cần, không tự thêm shader.

## 6. Route budgets và gate state

K-E là chủ ownership/kill event/two progress bars. S1 chỉ kiểm world/placement và cung cấp main membership. Baseline weights/threshold lấy R06; elite dùng integer tenths (`eliteUnits`) để hộ tống blue không tích sai số. Boss/adds không nằm trong denominator, cleanup không là kill. Member ID ổn định do K-E; dead/leader/chase không đổi home hoặc denominator.

- Invariant route: mainKillWeight×100 ≥ totalKillWeight×80; mainEliteUnits×100 ≥ totalEliteUnits×45; total>0 cả hai. Gate threshold và draft threshold riêng theo R06. Giết đủ main chắc chắn có thể đạt cả hai, không yêu cầu vét optional.
- Boss marker discovered và gate unlocked độc lập. Gate state `locked → open → engaged → cleared`; P2 gửi `progressReady` sau xử lý toàn damage batch, nhưng không mở UI/teleport/spawn Boss tự động. Nếu draft pending, giữ gate locked với reason `DRAFT_PENDING` dù đủ kill.
- Người chơi tự đi qua approach vào gate open → `requestBossEntry(identity)`; P2/K-B xác nhận còn sống, draft đã resolve, đứng ở điểm hợp lệ → trả `accepted` một lần mới chuyển engaged. Rejected giữ ngoài gate, trả reason; held movement không tạo request lặp mỗi tick, rearm sau rời approach hoặc explicit fresh entry.
- Engaged đóng boundary với Player/enemy và projectile/LOS cả hai chiều; K-E cô lập địch ngoài, K-B mới kích hoạt Boss. Không bắn trước vào Boss chưa active; gate opening không reset HP/charge. Khi cleared, giữ phòng an toàn/khóa threats cho flow reward/tree của K-X, không mở farming ra ngoài. Defeat/restart hủy session.
- P1 không bank/refill/roll offers hoặc serialize claim. Hook request/result không là quyền chuyển trạng thái profile.

## 7. Camera và input mapping — DR-CAMERA target chưa có

`playRect` là CSS rectangle **chỉ canvas world**, đã trừ HUD/control/minimap lanes và safe-area. P6 cấp rectangle cuối, P1 không lấy full window làm world. Candidate camera:

1. `zoom = min(playRect.width,playRect.height)/(16D)` CSS px/world px; không minimum fit toàn dungeon, không kéo giãn world; trục ngắn đúng minimum R06, trục dài thấy thêm. DPR không thay zoom. P6 phải giữ playRect dương và touch hit target R12; nếu lane thiếu chỗ, báo layout fail, không âm thầm zoom để che lỗi.
2. Camera desired = Player center + aim unit×offset, offset tối đa R06; manual aim hợp lệ ưu tiên, không ngắm thì offset0. Không kéo camera tới target xa/elite hoặc tới nhánh chưa khám phá.
3. Follow exponential `a=1-exp(-dt/0.08s)` theo presentation dt có cap như scene hiện tại; pause/transform đóng băng follow, resume không replay khoảng tab ẩn. Center sau smooth được clamp **quanh Player**, từng trục với half-span−7D−0.25D, để vòng aim7D và margin0.25D nằm trong playRect. Trục ngắn cho offset/lag tối đa0.75D, không cộng lag vô hạn. Center khởi tạo/teleport node snap về Player, không pan xuyên map.
4. Không clamp camera trong bounds map nếu khiến Player/cue sát canvas edge; backdrop tối ngoài walkable/bounds là hợp lệ. Collider vẫn ở world, backdrop không là đường đi. Minimap/UI không nằm đè vòng thao tác.
5. `visibleRect` theo camera **không shake**, dùng world transform một nguồn. K-A lọc target sống+range+LOS+camera+zone; không cho desktop chọn xa hơn do màn rộng. P1 chỉ cung cấp query, không port tier Rupture/elite cũ. Body center candidate nằm trong visibleRect, range/cap cụ thể theo R01.
6. Pointer: client CSS→trừ canvas boundingRect→scale vào logical camera viewport→inverse camera matrix không shake. Touch angle là angle world, touch ground point dùng Player+direction×range preview K-A; không dùng dx/dy CSS như world coordinate. `worldToScreen/screenToWorld` roundtrip ≤0.5 CSSpx ở mọi viewport.
7. Shake chỉ render matrix như nguyên tắc hiện tại, restore trước input/query; resize/orientation/blur/pause/node exit flush held/armed/pointer captures và ground preview; cần fresh press, không cast từ thao tác cũ. Mapping action/gesture nằm K-A, UI guard nằm K-U. P1 không thêm auto target algorithm.

Viewport acceptance: theo toàn matrix R12; mỗi viewport ghi viewport CSS, safe insets, playRect, zoom, world span, Player screen point, aim radius overlay. Center, sát wall/gate, cả4góc bounds; 4góc world không đồng nghĩa chỉ chụp Player ở center. Đo/cảm nhận camera lag, readability và scene stress sau implementation, không chấm PASS bằng công thức.

## 8. Minimap và fog — DR-MINIMAP target chưa có

- Candidate dùng **minimap fog**, không thêm lớp sương che combat world hay mechanic stealth. Khám phá cells có tâm trong radius7D quanh Player và point LOS; xét khi đổi grid cell hoặc gate version, chỉ khi simulation playing, không từ renderer/hover tree. Known cells giữ tới hết live node; unknown không vẽ topology/pack/Boss ở đó. Known có nét dim, Player/entry/gate marker có shape rõ; không enemy radar/loot route/auto navigation.
- Boss discovered khi approach cell của doorway vào tập revealed; marker tại doorway, chưa lộ vị trí/moves Boss. `discovered` có thể true trước `open`; đủ kill chưa khám phá vẫn không hiện marker hoặc mũi tên dẫn vị trí bí mật. Gate lock/open/engaged/cleared có ký hiệu phân biệt, legend qua i18n; main/optional không gắn màu như hướng tối ưu.
- North-up, cùng transform và geometry world, fit toàn bounds trong minimap content với unknown transparent/tối; không co bounding theo vùng đã reveal khiến marker nhảy. Chấm Player theo vị trí thật, rotation marker theo aim. Không click/tap di chuyển, không zoom/pan hoặc map overlay mới trong V1.
- Slot trong **lane ngoài playRect**, do CONCEPT-03 đề xuất và K-U đối chiếu; 320px phải đọc được đường nối/player/gate, không chỉ thu cả map thành noise. Nếu không đạt phải sửa target/spec trước lock, không đẩy minimap overlay lên gameplay.
- UI text dự kiến: `dungeonMap`, `mapUnexplored`, `bossGateLocked`, `bossGateOpen`, `bossGateEngaged`, `bossGateCleared`, `worldLoadFailed`, `worldRetry`; cả vi/en trong `src/i18n.ts` hiện tại. Khi tách dictionary theo convention phải có task P6, không tự refactor i18n trong P1. Map thụ động không giữ pointer; retry dùng Enter/Space/tap mới, không click-through.
- Restart/reload node dở: map seed/layout/initial packs giữ; fog, gate progress, enemies và HP rollback entry theo K-X. Không persist fog giữa node dở để tạo world-save trá hình. Pause giữ fog live; reward pending/tree do K-X lưu bước đúng, không rebuild map để bank lại.

## 9. Biome, source và target inventory

Material/palette/actor scale lấy Bible và ảnh BASELINE đã mở trong [audit plan §2](../DR-P1_PLAN.md#2-audit-sourceassets); không sửa Bible/DDR. Floor hiện tại chỉ reference mood, không là wall/module dungeon. Candidate inventory **10 module families** nằm trong khoảng R11, phải có mapping đủ **ba biến thể kiến trúc R06** (dùng chung/khác family/state/orientation); đây không mặc định là30source hoặc ba biome. Target/visual differences/variant selection contract vẫn OPEN qua CONCEPT-01, chưa có tên/direction mới được chọn:

| ID | Source mới / cách dùng |
| --- | --- |
| ENV-01 | floor field yên, seamless; lặp bằng Image/TileSprite, không bake collision/actor/text |
| ENV-02/03/04 | wall straight / outer corner / inner corner; bám footprint grid, đủ orientation bằng export có kiểm ánh sáng, không xoay sprite actor để giả view |
| ENV-05/06 | corridor join / pocket rim; chỉ ornament trên geometry, không tạo đường giả |
| ENV-07 | entry threshold, phi threat, không shrine/reward mechanic |
| ENV-08 | gate family **locked/open/engaged/cleared**; distinct physical silhouette, không chỉ recolor; state art khớp collision |
| ENV-09 | Boss floor/threshold accents, không đoán identity/moves Boss P4 |
| ENV-10 | backdrop edge, fill tối ngoài world/camera, không apparent walkable exit |

Production source riêng sau target approval+lock, không crop board. Output PNG/WebP alpha cho wall/overlay, floor RGB; mỗi export metadata ID/version/source hash/world rectangle/pixel size/anchor/occlusion footprint/orientation/state/rights. Texture resolution/pivot **phải được CONCEPT-01 chốt theo scale camera**, không tự pick khi xuất; chưa có metadata này nên ART chưa ready. Minimap glyph/frame cần design có chủ đích trong CONCEPT-03; tái dùng SVG frame/glyph đã audit hoặc hand-authored SVG theo target được duyệt, không phát sinh một bộ ImageGen bitmap chỉ vì đủ loại ticket.

Layer intent: backdrop→floor→rim/low wall→ground cue→actors→priority cues; giá trị depth cụ thể là implementation choice khi giữ thứ tự/occlusion target. No shader/Graphics floor/procedural illustration. Renderer cull layers ngoài camera để giảm draw, không cắt enemies/threats theo device. Không bake glow màu threat lên lối đi.

Target IDs dự kiến, **NONE hiện tại**:

- `DR-ENV-T01`: board module + gate states + collision registration/pivot/export sheet + runtime composite cùng baseline actors/HUD, approved geometry §4.
- `DR-CAMERA-T01`: full viewport matrix, playRect annotation/follow/aim/bounds/4góc; storyboard camera entry/turn/gate, không giả motion proof từ stills.
- `DR-MINIMAP-T01`: unknown/partially known/Boss discovered+locked/open/engaged/cleared/reload, vi/en/320 + desktop lane.

Mỗi target cần manifest A3 có path/revision/hash/source/rights/binding/quote. Concepts dùng screenshot **renderer baseline thật**, geometry mới annotation/composite, ghi chưa renderer dungeon; crowd/grayscale cùng scene và cả4góc. Chỉ planning inventory lượt này, không tạo ảnh/production.

## 10. Consumer contracts và closure

| Consumer | K-W cung cấp | Consumer trả / owner gap |
| --- | --- | --- |
| K-A / P3 | D/coords/sweep/LOS/visibleRect/zone/first-wall/query invalid; không requires P3 runtime để viết S1 | Action query origins/radii/ground validation/target lock; P3 không copy clamp arena hoặc tier cũ |
| K-E / P2 | regions/anchors/paths/home tags/budget verifier/gate request/result | Final pack schema/member IDs/weights, placement collider radii, aggro/nav invalidation, kill batch/progress/draft pending/entry isolation |
| K-B / P4 | Room22D baseline, gate/mask/add safe candidates, camera minimum | Legal pattern/escape envelope sau mods, spawn adds ≥distance R08 và path hợp lệ; room/timing conflict phải báo delta, không tự tăng room/giảm attack |
| K-X / P5 | Identity/version/error, pure deterministic rebuild, live fog reset/entry hooks | Node seed persisted, modifier snapshot, atomic entry/refill/reward/restart, readonly profile namespace, no reroll/errors |
| K-U / P6 | playRect input/output transforms, minimap slot/content/states, viewport matrix | Actual HUD/control/safe-area rectangles, i18n keys/cancel/resize/fresh-press, device measurement plan |

Gói K-W **candidate đủ để planning consumers**, chưa APPROVED/SPEC_READY: Atlas comparison, actual targets và các closure trên chưa đủ. Không chờ code P2/P4/P6 để planning; chờ contract revision/target khi khóa. Mọi delta ảnh hưởng geometry/camera phải cập nhật S1/targets/ticket bindings trước lock; sau lock đánh STALE theo workflow.

## 11. Acceptance và evidence cần có

### Ranh giới nghiệm thu P1 và kiểm tích hợp

| Phạm vi | Tiêu chí/evidence bắt buộc | Owner |
| --- | --- | --- |
| P1 world core | Một seed fixture playable; definition/seed rebuild deterministic, rounding/retry/rejection traces; connectivity/clearance/movement/wall/path queries, hai route budgets và feasibility từ annotated K-E data đã pin. BUDGET_UNANNOTATED/ledger giả không đủ nghiệm thu core | CODE-01/02/07, VERIFY-01; P2 cung cấp dữ liệu K-E, chưa cần combat runtime |
| P1 camera/minimap/lifecycle | World renderer/camera/minimap thật: matrix R12,320px đọc được, slot ngoài playRect, input transform/di chuyển/aim+fresh press, fog/gate state qua injected commands có nhãn, pause/resize/restart session và no production-key writes | CODE-03…07, VERIFY-01/02 |
| P1 visual/user | Approved targets ENV/CAMERA/MINIMAP đúng fixture scope, actual-vs-target/crowd fixture/grayscale/4góc; technical result, target approval và user playtest world có quote/version là ba kết quả riêng | CONCEPT/ART/CODE-06, VERIFY-02, user |
| Contract release trước global lock | Ba biến thể kiến trúc + random đường/phân bố bầy vẫn phải được đặc tả/target/coverage đủ theo §3/9 trước lock; P1 fixture accepted không đóng requirement release. VERIFY chỉ một seed không là evidence toàn generator | P1 world/concept owners, P2 K-E, P0 closure |
| Tích hợp P2/P3/P4 | Actual pack activation/density/kill progress, action Dash/knockback/projectile/ground casts vào wall, combat gate isolation/Boss patterns/adds; yêu cầu traces/hit geometry/threat clips actual đúng versions | P2 encounters, P3 actions, P4 Boss; P1 VERIFY chuyển case W04/05/06 liên quan |
| Tích hợp P5/P6 | Actual persisted entry/pending/terminal/reload/claim-once/full9node; HUD shell/audio/device responsiveness/FPS theo R12; storage traces/full-loop và device measurements thật | P5 persistence/expedition, P6 experience; P1 VERIFY chuyển W08 phần full-save và W09 phần full combat/device |

Không bắt P1 hoàn tất combat/full-save/full-run để nghiệm thu world; **mọi hàng P1 core/camera/minimap/visual-user vẫn phải đạt**, thiếu một mục không được dùng nhãn PARTIAL của tích hợp để ACCEPT P1. Cases W01–09 dưới đây giữ phạm vi hệ thống; khi báo cáo phải phân outcome P1 với phần owner consumer theo bảng, không bỏ toàn case vì consumer chưa implement. Fixture scope không thu nhỏ release hoặc lách global lock.


| Case | Expected / evidence sau execution |
| --- | --- |
| W01 same identity | Canonical hash geometry/anchors/annotated roster bằng nhau giữa 2 rebuild, vi/en/touch/desktop/resize không thay; khác render culling không đổi state |
| W02 routes | 808 + một seed từng phép đối xứng + matrix depth/Asc/mod cap bởi P2/P5: mọi anchor reachable đúng radius; route budgets cả hai PASS, optional không bắt buộc |
| W03 reject | Disconnected/zero elite/overlap/overflow/invalid identity có structured reason, không entry commit; hết16attempt không random seed khác |
| W04 movement | Đi/Dash/knockback vào wall, dọc wall, góc lồi/lõm/door: không xuyên/kẹt/tăng quãng; actor lớn có NO_PATH thay vì cắt góc; cần action adapter P3 cho Dash thật |
| W05 wall queries | Projectile quãng >1cell/tick dừng earliest wall, tường trước enemy tie; melee/area/beam/ground cast qua wall không hit/commit sai; action assertions owner P3/P4 |
| W06 discovery/gate | Unknown không lộ đường/Boss; khám phá marker trước/sau đủ kill độc lập; pending draft chặn entry, fresh approach một lần; engaged cô lập hai chiều, no refill ngoài reward |
| W07 camera | Matrix R12 + safe-area/resize/4góc: roundtrip≤0.5CSSpx, 7D ring+margin trong playRect, Player/cue không HUD che; shake không lệch aim/LOS |
| W08 lifecycle | Pause/blur/transform không khám phá/chạy timers, resume không stale input; reload về entry cùng geometry/packs, fog reset đúng; no writes production keys |
| W09 visual | Before/approved target/actual cùng scale+crowd+grayscale+gate states/4góc; registrations không wall giả; technical PASS tách user visual/playtest |

Evidence dự kiến `docs/dungeon-redesign/evidence/<task-id>/`, chỉ tạo khi có dữ liệu thật; seed/identity/spec+target+code hashes/viewport/playRect/device/scenario/expected/actual đi kèm. Tests focused theo changed logic, build/typecheck sau implementation; không comprehensive framework. FPS/latency device protocol thuộc P6, không đòi runtime PASS trước code. Hiện **NOT CHECKED** toàn runtime; không ảnh dungeon/Atlas measured data/visual approval mới.
