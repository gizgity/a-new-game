# B1 — Player Base V2 (DESIGN ONLY)

Status: PAUSED BY USER — session exploration reverted
Kind: DESIGN
Revision: 1
Owner approval: NONE
Last updated: 2026-11-12
Related phase: B — Combat Core
Source request: User “ok, tiếp theo” sau khi nhận audit A-H4 PASS và đề nghị “Chốt Gate A → bắt đầu B1 — thiết kế Player Base V2 bằng hình ảnh để bạn duyệt”, 2026-11-12 (conversation, no permalink).
Docs read: AGENTS.md, HANDOFF.md, MASTER_PLAN.md, HARNESS.md, TASK_CARD_TEMPLATE.md, EXPERIENCE_VISION.md, DESIGN_BIBLE.md, REFERENCE_PROTOCOL.md, ART_BIBLE.md, docs/art-reference/README.md.

## Pause / rollback — 2026-11-12

User “revert hết đi, k đúng ý t, để t suy nghĩ lại”. Toàn bộ exploration trong phiên đã revert về41407d5; phần card baseline dưới đây chỉ là lịch sử, không hướng đang được triển khai. Không target approved, không tự tiếp tục design/implementation/B2.

## 1. One change / outcome
Before: Player Q7C accepted base, existing sprite atlas and runtime. See [approved Player source](../../q7c/source/player-production-v1.png), [actions source](../../q7c/source/player-actions-production-v1.png), [atlas](../../../public/assets/actors/occult-actors.png), [Art Reference Board](../../art-reference/README.md). Runtime accepted visuals are historical baseline; no production V2 change yet.
After (PROPOSED): a more striking, immediately legible Player **base silhouette and design identity** at actual game scale. Must remain recognizable when many enemies/VFX overlap; support later distinct melee/ranged/dash/Mutation states without specifying those assets in B1.
Why: Experience Vision Immediate Power + Visible Evolution + Distinct Actions.

**Scope IN:** player base appearance/silhouette/material/value groups/readability only, design-only concept and target proposal.
**Scope OUT:** code, texture atlas changes, animations/moves/attacks, projectile/VFX, camera/angle/facing-count decisions, hitbox/input/damage/balance, enemies/Boss/HUD/environment, actual production art.
Dependency: Gate A accepted for **opening design task** (user “ok, tiếp theo”); implementation requires separate user approval of exact B1 design revision+references.

## 2. Design choices — not locked
Baseline fallback: [Art Bible](../../../ART_BIBLE.md), [Q7C Player](../../q7c/source/player-production-v1.png), default top-down three-quarter/fractured occult pixel as a **starting reference**, not law.
Proposed change: increase distinctiveness of silhouette with clearer large-scale armor/mask/core and asymmetric weapon readable at runtime scale; preserve agile combat identity.
Keep: player's melee/ranged hybrid identity and gameplay mapping; all baseline gameplay untouched.
Supersedes: NONE yet. User may accept one concept or request a different style/angle; exact superseded features identified after approval.
Unknown/TBD: approved style, camera angle/facings, visual details, asset resolution, animation compatibility and exact target PNG.
Platform/context: mobile portrait and 16:9 desktop at actual gameplay size; crowd/telegraph overlap for verification, not just zoomed character study.

## 3. References
Baseline: [Q7C Player source](../../q7c/source/player-production-v1.png) (accepted legacy, NOT B1 TARGET), [Q7C runtime crowd 390](../../q7c/runtime/after-crowd-390.png), [runtime crowd 1440](../../q7c/runtime/after-crowd-1440.png).
Concept refs: first exploratory concept displayed in conversation 2026-11-12 — **NOT YET REPOSITORY-BACKED**, pending selected image to be supplied/saved. Do not invent ref ID/path or grant approval.
Target ref: NONE — NOT APPROVED.
Reference manifest: NONE — create only when selected image actually exists in repo.
Must match: TBD after user selects design.
Flexible: TBD after user approval.
Must not infer: gameplay mechanics, animation timing, hitbox, camera perspective or hard-coded palette from generic concept.
Source/rights: concept may be AI-assisted and must be labeled as such if saved; no external image crop into production.

## 4. Acceptance
- [ ] AC1: User clearly prefers/approves a specific B1 design revision and image.
- [ ] AC2: Base silhouette recognizable at actual game scale against crowd, separate from telegraph.
- [ ] AC3: Feasible for later states / mobile and desktop.
- [ ] AC4: No gameplay/input/physics or other system changed.
Evidence plan: approved concept file/revision + before and scaled game-context comparison after concept is accepted, then candidate runtime evidence after code.
Non-goals: animation or production asset acceptance, gameplay modifications.

## 5. Approval gate
Approval status: AWAITING USER VISUAL APPROVAL.
Approved scope: NONE.
Approved spec revision: NONE.
Approved refs: NONE.
Approval quote/date/source: NONE.
STOP if: attempting production without approved target, or changing sprite logic/angle/gameplay while only B1 design is open.

## 6. Implementation
NOT STARTED. No code or production art permission.

## 7. Review and handoff
Technical: NOT CHECKED (design-only).
Visual review: AWAITING USER.
User playtest: NOT APPLICABLE.
Known gaps: no approved B1 target or runtime-scaled comparison yet. Reference source from GitHub is historical baseline.
Final status: PAUSED BY USER.
NEXT ACTION (exactly one): DỪNG, chờ user suy nghĩ và đưa chỉ dẫn mới.
