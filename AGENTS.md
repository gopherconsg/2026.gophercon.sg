# For AI Agents

**Project Context:** [`_bmad-output/project-context.md`](../_bmad-output/project-context.md)

Read the project context file before implementing any code. It contains critical rules and patterns specific to this project that you must follow.

## Quick Reference

- **Tech Stack:** Astro 5 + Tailwind CSS v4 + TypeScript
- **Data:** TOML files in `src/data/` (imported via `src/lib/data.ts`)
- **Images:** Two-tier strategy — `src/assets/images/` for optimized, `public/img/` for CSS backgrounds
- **No Framework:** Pure Astro components, inline `<script>` only
- **Verification:** `npm run build` + `npm run lint`

See the full project context for detailed implementation rules, cross-file dependencies, and common pitfalls.
