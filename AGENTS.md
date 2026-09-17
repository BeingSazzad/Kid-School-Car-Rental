# Agent Guidelines & Repository Rules

## 1. Strict Page & Screen Isolation (Highest Priority)
- When a user asks to change, fix, or redesign a specific page, screen, or component, **ONLY modify that exact target**.
- **DO NOT touch or change the visual design, styles, or layout of other unrelated pages**.
- Modifying multiple pages is **STRICTLY FORBIDDEN** unless it is a shared data/component dependency that explicitly requires reflection, or the user requested an app-wide update.
- Do not perform spontaneous "beautification" or unsolicited design tweaks on pages outside the active request scope.

## 2. Design System & Palette Stability
- Always adhere to the locked palette defined in [design-system.md](file:///.agents/rules/design-system.md).
- Do not introduce arbitrary colors or deviate from established standards without explicit request.

## 3. Targeted Verification
- Only inspect and test the specific screen or element being worked on.
