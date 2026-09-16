# DOM & Browser Verification Rule

## Targeted Verification Only (Strict Constraint)
- When verifying UI or functionality using the browser or DOM inspection, **ONLY check the specific page, modal, or element that was modified**.
- **NEVER** dump or inspect the entire app DOM or full application tree.
- **NEVER** navigate through or audit unrelated screens unless explicitly asked.
- Keep subagent tasks and DOM queries tightly focused on the single target route/component to prevent token waste and reduce latency.
