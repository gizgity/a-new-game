# DR-P0 — Exact artifact inventory cho audit packet rev1

Revision: 1 · 2026-11-15 · Task DR-P0-VERIFY-01 rev2. **CURRENT BYTES / NOT_LOCKED**.

SHA256 tính trực tiếp bytes working tree tại bàn giao, không dùng HEAD thay untracked files. [SPEC_LOCK](SPEC_LOCK.md) là entry review; [report](DR-P0_CLOSURE.md) chứa actual coverage§3, deps§4, findings§5 và approval semantics. Hash bind bytes, không cấp approval. Không tự hash manifest/inventory lẫn nhau; HANDOFF/RESUME là status indices, không implementation specs. Khi input đổi phải refresh/audit binding trước lock.

Branch codex/dungeon-skill-rework; HEAD0ee02af70ab530ad81c0ff84069b7e4fbf68fd9a; main63f4f3b88826eb556664bf240e8be538e8f654e6. Không commit/push/deploy.

## 1. Baseline và control inputs

| Artifact/path | Revision/context | SHA256 current bytes | Status / approval source và phạm vi | Coverage/dependencies |
| --- | --- | --- | --- | --- |
| [REVIEW_V1.md](../REVIEW_V1.md) | V1 + approval banner | A3042A3FA81D5BD32EF2B4FC222A4296D6ED3AB4B66C3BDD5B5158255F544154 | Approved Design V1; C09 user “all y”,2026-11-14, không lock | R01–R12; R12 amended trong log |
| [DESIGN_CHECKLIST.md](../DESIGN_CHECKLIST.md) | log R72/C09 | F192452FA6F6DB6686EA365EE57813ACF757F40DC4D6916CB1EF44B5C4720E66 | Approval log; quote/amendment C09 ngày2026-11-14 | Q01–Q61/C01–C09; Q61 thu hồi |
| [DR-P0_PLAN.md](DR-P0_PLAN.md) | 1 | 785809404D276B5753C1268506142D223D4BC875516BBEC3D7E53A5525CEAF7A | APPROVED PLANNING ONLY; user “y”,2026-11-15 | C01–C32/G01–G09/K-W…K-U;§3–7 |
| [DR-P1_PLAN.md](DR-P1_PLAN.md) | 2 | 81CEECB8AFAE9EC4BEFDA6106315D8AA752DA5A635A6AEF31A17A8610DDE3563 | APPROVED PLANNING ONLY; user “y”,2026-11-15 | P1 source/refs/deps/coverage/gaps§2–7 |
| [DR-P1_WORLD.md](specs/DR-P1_WORLD.md) | 2 | 2D58E8E1E0F40520D8877D3EB70E104AAD5AE89F5C25B51DAAA28285A5569740 | APPROVED PLANNING ONLY; user “y”,2026-11-15; NOT_SPEC_READY | K-W candidate§2–10/W01–W09§11; OPEN L02–L08 |
| [WORKFLOW.md](WORKFLOW.md) | 1 + current audit index | 8189924057D0C69FE2007606E1B01684859E4FC0F3CCD1C44B3F185302E26127 | PROCESS; C09 directive, không content approval mới cho index | F2–F4→F5; all-scope lock/task assignment |
| [MILESTONE_DRAFTS.md](MILESTONE_DRAFTS.md) | 5 (progress only) | D4F57BD8B618B971C8F322FF21FF431FF36ED5F1ACB0255D60A18205CAB6B22E | R12/C09 intent; rev5 chưa user approval mới | P0–P6; không detailed specs P2–P6 |
| [TASK_TICKET_TEMPLATE.md](TASK_TICKET_TEMPLATE.md) | setup2026-11-14 | 54E9190E0335001BA0E1B7CD4B775C92A95DD74530465F6669FEC469DF03E6A7 | PROCESS TEMPLATE; C09 breakdown directive | Ticket fields/refs/deps/AC |
| [HARNESS.md](../../combat-v2/HARNESS.md) | A-H1 rev2 | D11DF2B25417FBBC1AB68BBAD4B724EE6B49A9B4838EC8BAB5DA6024DBA35A16 | APPROVED PROCESS; user “ok, làm tiếp đi”,2026-11-12 | G0–G6/boundaries, không khóa design |
| [DESIGN_BIBLE.md](../../combat-v2/DESIGN_BIBLE.md) | A2 rev1 | 342101BDB9488EB3783CA3B692BA8BD95E6473D746D71B1E3087E6A0DC1349CF | APPROVED DIRECTION; user “ok tiếp đi”,2026-11-12 | Fallback direction, không individual target |
| [REFERENCE_PROTOCOL.md](../../combat-v2/REFERENCE_PROTOCOL.md) | A3 v1 | 1CED3E43CCE34CD2A870E11446525C759486CE3EBF4B116415300A4C3A4E9A07 | APPROVED PROCESS; user “ok, tiếp đi”,2026-11-12 | Type/path/rev/rights/scale/binding/approval |
| [TASK_CARD_TEMPLATE.md](../../combat-v2/TASK_CARD_TEMPLATE.md) | A-H2 v1 | 0509D420F970E95E0BE747D73B9B3CA8107560C0498773B02CACFF94DF140BA9 | APPROVED PROCESS; user “uh chốt h2”,2026-11-12 | Execution card sau lock/task assignment |
| [MASTER_PLAN.md](../../combat-v2/MASTER_PLAN.md) | current snapshot | C5F22DD569F16281AC37B240145E090D26FD5B543DFA4D745264A9F120E27E64 | ROADMAP; scope approvals trong file, B1 PAUSED | Không mở lại B1/history NEXT ACTION |
| [SKILL.md](../../../.agents/skills/dungeon-planning/SKILL.md) | current instructions | 95046DE4CE6E9744FFFC15224898A6AB50C4C22A78ACB5E9FA3CA57AF5CB426D | SKILL; user invocation2026-11-15 | All-release lock trước CODE/ART |
| [SKILL.md](../../../.agents/skills/handoff/SKILL.md) | current instructions | CB222ACE6B3842F3AE8095167BC5EC544B244E0640292EC16CFF470A51CC5837 | SKILL; AGENTS bắt buộc | Current scope/validation/one next action |
| [DR-P0_CLOSURE.md](DR-P0_CLOSURE.md) | 1 | 39E179840A3A20FF8CCE610EF1119C69498CD818A70B0088544F3CF7BFF26EDA | AUDIT COMPLETE/CLOSURE BLOCKED; user content approval NONE | C01–C32/L01–L10; không lock |

Approved Review bytes tại cc6f54c (git show đã kiểm): **E604C6EB353BEABC3DEB45BED0A0CDCCAAAF4036459857602460A7BA3375F713**. Current Review hash khác vì approval banner. Pre-approval bindings P0/P1/S1/PLAN-01 ở SPEC_LOCK và đầu plans, không coi current hash tự chứng minh user đã approve cả file có metadata mới.

## 2. Tất cả17ticket thật

Coverage chi tiết theo từng Cxx ở report§3; dependency spec/artifact + AC/evidence trong từng ticket và report§4. P0/P1 PLAN accepted planning không cấp child execution.14child P1 rev3 chỉ sửa metadata approval; requirements/deps/AC giữ rev2, **không user approval mới cho rev3**, assignment vẫn NONE.

| Artifact/path | Revision | SHA256 current bytes | Status / approval source và phạm vi | Coverage/dependencies |
| --- | --- | --- | --- | --- |
| [DR-P0-PLAN-01.md](tickets/DR-P0-PLAN-01.md) | 1 | 7D696BC1F216B5B144383BC5383F617075844F53F19B6DA54E01AAAA0077FA77 | ACCEPTED PLAN; user “y”,2026-11-15 | C01–C32; R01–R12→P0 plan |
| [DR-P0-VERIFY-01.md](tickets/DR-P0-VERIFY-01.md) | 2 | 369DD92ABEB4EF8043580B53B4EC26EE4542EF6570891E89F7ECE64BB1F04BAA | Audit complete/closure BLOCKED; audit assignment2026-11-15, content approval NONE | C01–C32/L01–L08; input audit→report/inventory/packet |
| [DR-P1-ART-01.md](tickets/DR-P1-ART-01.md) | 3 (metadata only) | 8AAC19E0B147B4C3082EFE495FF00AC43EE4CA7AC0A5E4C1435C3AB3346D3F06 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §9. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CODE-01.md](tickets/DR-P1-CODE-01.md) | 3 (metadata only) | AA5FD6081D7E346D5A83AD8F9DC948160E69E42A36463AA24BBBEED5AC728261 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §2–4/6. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CODE-02.md](tickets/DR-P1-CODE-02.md) | 3 (metadata only) | FEF591930AC506B34880157F1A0821C7062E196F930AEE3FDA8BC1ED568B1EEC | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §5/6. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CODE-03.md](tickets/DR-P1-CODE-03.md) | 3 (metadata only) | 94A948A3F7EBCE91E71D5F837C50E8590D8FCA95223D7A657B43F74423A6D95A | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §7. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CODE-04.md](tickets/DR-P1-CODE-04.md) | 3 (metadata only) | 42162C4CF075935026305AAF771AB9784566A7AFDA264448F31152059EB0F607 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §6/8. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CODE-05.md](tickets/DR-P1-CODE-05.md) | 3 (metadata only) | 203D5F542B1674867008AB3C760F544C9F08C08005DD3AA2D95A4C58AF4E3C28 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §8/9. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CODE-06.md](tickets/DR-P1-CODE-06.md) | 3 (metadata only) | 31F1DF1B22E3FBEF5A439AF83DFBA93519C038A36348AA14FB72ACC753557811 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §9. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CODE-07.md](tickets/DR-P1-CODE-07.md) | 3 (metadata only) | 7B22A77723618816DF08A9D1DF891A57CD96D37090758A1BA8BFBC0B691D7EB6 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §3/5–8/10. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CONCEPT-01.md](tickets/DR-P1-CONCEPT-01.md) | 3 (metadata only) | 53AFB3A92EA38697C6974FF1985C000487F84318F944F25C256D422508F81E01 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §2/4/5/9. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CONCEPT-02.md](tickets/DR-P1-CONCEPT-02.md) | 3 (metadata only) | 98CFF3ADC7CBC75AA67583DFDECA0270B0650ED10B71432E7142924F2C9D6E00 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §7/9–11. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-CONCEPT-03.md](tickets/DR-P1-CONCEPT-03.md) | 3 (metadata only) | CC0D7705A8F18794981DADFD64593D352589F7C26625C7E621D1A9BE628992D8 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §8/9. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-PLAN-01.md](tickets/DR-P1-PLAN-01.md) | 2 | 69F8410BDBB67A29F5F33CFF5391A193E14BBA854E92A2EE34212DA5BDFDCBA1 | ACCEPTED PLAN; user “y”,2026-11-15 | P1 source/spec/tickets/coverage; không child assignment |
| [DR-P1-SPEC-01.md](tickets/DR-P1-SPEC-01.md) | 3 (metadata only) | DDD94B1C10AB4714972459121F82DEF300AE5C06E04476E3CB83CF54816D2FB9 | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | Plan §4; S1 §1/3/4/10. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-VERIFY-01.md](tickets/DR-P1-VERIFY-01.md) | 3 (metadata only) | 76FBB30EB6FDC6BF0DECC4DABD56F949CC70876212AC504269CE12255ABE01CF | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §11 W01–06/08. Dependency/AC xem ticket và report§3/4. |
| [DR-P1-VERIFY-02.md](tickets/DR-P1-VERIFY-02.md) | 3 (metadata only) | B66DC00E17ADBCC0491F78A8D086139D24CB18DC5E996792E312D10C0296F9CE | PLANNED/assignment NONE; approval mới NONE; P1/S1 rev2 planning approval giữ nguyên | S1 §11 W07–09; R12. Dependency/AC xem ticket và report§3/4. |

### Prior revision2 hashes của14child trước metadata correction

Đây là **input lịch sử, không current hashes**; khớp snapshot revision2 trong SPEC_LOCK.

| Ticket | SHA256 input revision2 |
| --- | --- |
| [DR-P1-ART-01.md](tickets/DR-P1-ART-01.md) | 0AB4AC4470189D52ADBCA030BEB1F85B6C827301403FF55EEDB23D12E28D4B2A |
| [DR-P1-CODE-01.md](tickets/DR-P1-CODE-01.md) | 68950BED340891A7CC64C5CF657765DCFBC20A98A297D422733C7A04AFD024AE |
| [DR-P1-CODE-02.md](tickets/DR-P1-CODE-02.md) | 87D836A2C3B5FD9C712AFB1AF9694EC389E276BE3437728F4AF07A759949427E |
| [DR-P1-CODE-03.md](tickets/DR-P1-CODE-03.md) | D13731C77C88AE677CBDC3A22653B0434706A15F1DFB716A599481E6BFE7A3E7 |
| [DR-P1-CODE-04.md](tickets/DR-P1-CODE-04.md) | 2E45790C8EDF16D96BDF55CDA046969DEC8552588ADCEB1BD91D3245F197B28A |
| [DR-P1-CODE-05.md](tickets/DR-P1-CODE-05.md) | 69AE6FD5549F4EB698EC9EE1987FE179FA32ADB0C027052AC539811ADBE81F66 |
| [DR-P1-CODE-06.md](tickets/DR-P1-CODE-06.md) | FF48F1EE74964088EBA3C7BF7D3CE39E6D7A94D4CD2CBD0870C03AFA4B505682 |
| [DR-P1-CODE-07.md](tickets/DR-P1-CODE-07.md) | 25F79A67F9218C2E3FFECEE083DC11FE3D5A8AB7E3D0980A16F95C3561E7D3FD |
| [DR-P1-CONCEPT-01.md](tickets/DR-P1-CONCEPT-01.md) | 23CF7DC19C680A8A5BC41A52C6C99FCC034B0E6B275E1E21DF301ED15907F5B8 |
| [DR-P1-CONCEPT-02.md](tickets/DR-P1-CONCEPT-02.md) | 8AB516B6C84C0C95EC91AD8C415551CFD212C82965E208D009B64D3D955E49CE |
| [DR-P1-CONCEPT-03.md](tickets/DR-P1-CONCEPT-03.md) | 3F656ED97EAA8474D60C1BAA92A3627C39799BA5578CCE58AF8479B8C0778270 |
| [DR-P1-SPEC-01.md](tickets/DR-P1-SPEC-01.md) | 0D7FF5DCACD50F890E43CFBF76FD14CAB2750BDCB363B1F4519F50113630D9D7 |
| [DR-P1-VERIFY-01.md](tickets/DR-P1-VERIFY-01.md) | FEEA3359DAD68671B8D35BD21734678C2C9E4D0FE96F03F89E6F52C41B3A69A2 |
| [DR-P1-VERIFY-02.md](tickets/DR-P1-VERIFY-02.md) | DE75605708F5BC7B83AE8A682596A97726AF16E0D2B9B5388DE52E2C714281B3 |

## 3. Baseline references và source snapshot

Chỉ kiểm file path/bytes và binding đã ghi P1 plan§2; **không mở ảnh/chấm visual QA mới**, không nâng BASELINE thành TARGET. Source hash trùng snapshot P1 không là full call-graph/runtime rework verification.

| Artifact/path | Revision/context | SHA256 current bytes | Status / approval source và phạm vi | Binding/limits |
| --- | --- | --- | --- | --- |
| [broken-seal-v2.webp](../../../public/assets/arena/broken-seal-v2.webp) | Q7A1600×1000 | 71B8D5B2B0850D40CD7C39A795A8CAEE129E4B14DC7F08F20093D17C18FEA70A | BASELINE; Q7A accepted/P1 plan§2 | Mood/material, không dungeon kit |
| [after-crowd-390.png](../../q7c/runtime/after-crowd-390.png) | 390×844/fixture33enemies | 1B6B1A91C04363BE680AB087B9A08C0788823D9FFABDA169DBEA1CBE6713DE92 | BASELINE; Q7C accepted/P1 plan§2 | Hierarchy/scale, không FPS/target |
| [after-crowd-1440.png](../../q7c/runtime/after-crowd-1440.png) | 1440×900 thực | D53E1E3C749C2FC05C4E44E390D63BBBCA57C60A2432B8A4FBB8642BCB50923E | BASELINE; Q7C accepted/P1 plan§2 | Không1440×1000 R12 target |
| [after-grayscale-390.png](../../q7c/runtime/after-grayscale-390.png) | Q7C grayscale390 | 61608A41B87AB91688035DE9BCA1995A212E3B95BA1761DB61309A564190CD7A | BASELINE; Q7C accepted/P1 plan§2 | Hierarchy, không dungeon target |
| [runtime-asset.json](../../q7a/runtime-asset.json) | Q7A provenance | A46B139335E0DBEFE07A53E684F2BFBB8FF89A668F065090C7D169D6A58F9BAD | BASELINE MANIFEST; source/rights trong file | Không external PoE assets |
| [runtime-assets.json](../../q7c/runtime-assets.json) | Q7C provenance | 324C969C197CAA7601532DB0F85E4E3AB58F4301B0AC6EEFA530E09184C237D4 | BASELINE MANIFEST; source/rights trong file | Không approve states/rarity mới |
| [runtime-assets.json](../../q7b/runtime-assets.json) | Q7B glyph/frame provenance | D490F3A11531AAE336663FD5019ADE61054FB02DC044FB41CDB9D68CDC859E62 | BASELINE MANIFEST; source/rights trong file | Reuse phải bind scope mới |
| [movement.ts](../../../src/game/movement.ts) | P1 source snapshot | 4EAE84A6BFEF01F2610D3606D97D6AEA3B98BFD974B53442488E96E7B5839DE2 | SOURCE; P1 plan§2 | Không world implementation |
| [ArenaScene.ts](../../../src/game/ArenaScene.ts) | P1 source snapshot | 36631EC8C09F9D2DDBBD6ABF3E08281C0368069DA3FB9DEF9ED3FE5A92DE9C58 | SOURCE; P1 plan§2 | Default accepted giữ nguyên |
| [combat.ts](../../../src/game/combat.ts) | P1 source snapshot | 86E49C29B6434DB1E07EE9F78FCB7D3732F78CA254D6675E04408572090402B8 | SOURCE; P1 plan§2 | Không legacy action port ngầm |
| [run.ts](../../../src/game/run.ts) | P1 source snapshot | 3B3FCB61203BEDB05334E9A8D496F6C7539681FF62E348DA62FC038FB6ADC546 | SOURCE; P1 plan§2 | Không timer legacy làm rework gate |
| [occult-actors.png](../../../public/assets/actors/occult-actors.png) | Q7C actor atlas | E5C40AC0851BE3F1147719C79EED3E574A6664510406A5DE7EB7CB83F4542A71 | BASELINE; Q7C accepted/P1 plan§2 | Identity/metadata, không state target rework |
| [occult-actors.json](../../../public/assets/actors/occult-actors.json) | Q7C atlas metadata | 473B58F57757F00E6A9A0C8A35DB0A902096815A57A5807C1A09F1C742F1554C | BASELINE; Q7C accepted/P1 plan§2 | Identity/metadata, không state target rework |

## 4. Missing manifest entries — không hash giả

| Scope/contract | Path/revision/hash/approval | Owner/gap |
| --- | --- | --- |
| P2–P6 plans/specs/tickets, S2–S6 | NONE/NONE/NONE/NONE | L01; homes dự kiến P0§3, chưa tạo |
| Release random-route/K-E annotated feasible placement | Chưa có artifact final; S1 candidate có hash ở§1 | L02/L03; task sản xuất spec closure còn NONE |
| Atlas comparison memo | NONE/NONE/NONE/NONE | P1-SPEC-01/L04; output tương lai |
| DR-ENV-T01 / DR-CAMERA-T01 / DR-MINIMAP-T01 | NONE/NONE/NONE/NONE | P1-CONCEPT-01…03/L05/K-U L08 |
| Actor/rarity/skill/Boss/HUD/build/tree/result/error targets khác | NONE; chưa ID/path/rev/approval | R11/P2–P6/L05 |
| K-B/K-X/K-U final/device/audio protocols | NONE/NONE/NONE/NONE | L06–L08; payload/targets chưa có |

Không hash outputs tương lai/production source/runtime dungeon vì chưa tạo. [Report§5](DR-P0_CLOSURE.md#5-findings-và-cách-đóng) quy định evidence đóng gap. **User review inventory/packet không tự là lock hoặc execution approval.**
