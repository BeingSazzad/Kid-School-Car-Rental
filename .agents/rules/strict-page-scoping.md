# Strict Page Scoping & Design Isolation Rule

## Core Directive
When asked to modify, redesign, fix, or update a specific screen, page, or component:
- **ONLY change the requested screen/component.**
- **NEVER** alter the visual design, layout, typography, or CSS of any unrelated screen.
- **NEVER** perform unsolicited "cleanups", restyling, or visual changes across other pages.

## Reflected/Shared Content Exceptions
Modifications to other files/screens are permitted **ONLY** when:
1. The user explicitly requests a multi-page or app-wide change.
2. The change is directly required by a shared data model or global state update that cannot function without a minimal reflected change.
3. A shared reusable component (used on multiple screens) is intentionally modified, and the change must not break other screens.

## Rationale
Modifying unrelated screens causes unexpected regressions, breaks previously approved designs, and disrupts user review tracking. Every edit must be surgical and strictly confined to the targeted context.
