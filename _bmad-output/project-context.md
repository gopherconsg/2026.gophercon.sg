---
project_name: '2026.gophercon.sg'
user_name: 'Valentine'
date: '2026-02-24'
status: 'complete'
sections_completed: ['technology_stack', 'critical_implementation_rules', 'cross_file_dependencies']
rule_count: 78
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

_This is a static conference website for GopherCon Singapore 2026, built with Astro 5 + Tailwind CSS v4. No client-side framework, no CMS, no automated tests._

---

## Technology Stack & Versions

### Core Framework
- **Astro** 5.x (`^5.3.0`) — static site generator, zero client JS by default
- **TypeScript** — strict mode (`astro/tsconfigs/strict`), `@/*` path alias maps to `src/`
- `astro.config.mjs`: `icon()` and `sitemap()` are Astro integrations; `tailwindcss()` and `toml()` are Vite plugins — don't mix them up

### Styling
- **Tailwind CSS v4** (`^4.0.0`) — CSS-first config via `@theme` block in `src/styles/global.css`. No `tailwind.config.js` exists or is needed
- Key v3→v4 differences that cause build errors:
  - `@tailwind base; @tailwind components; @tailwind utilities;` → `@import "tailwindcss";`
  - `tailwind.config.js` theme config → `@theme { --color-brand-blue: #14C8E0; }` in CSS (auto-generates utilities like `bg-brand-blue`)
  - `bg-opacity-*` / `text-opacity-*` → slash syntax: `bg-white/80`, `text-black/50`

### Data & Content
- **vite-plugin-toml** (`^0.6.0`) — direct TOML imports. Import in astro config as `{ ViteToml as toml }` (named export)
- **marked** (`^15.0.0`) — ESM-only; `marked.parse()` and `marked.parseInline()` return `string` synchronously — do NOT `await`
- TOML data files under `src/data/`: `content.toml`, `speakers.toml`, `schedule.toml`, `workshops.toml`, `sponsors.toml`

### Images (Two-Tier Strategy)
- **`src/assets/images/`** — speaker photos, sponsor logos → `astro:assets` `<Image />` (WebP/AVIF, srcset, lazy loading). Requires `import.meta.glob()` — dynamic string paths do NOT work
- **`public/img/`** — hero, waves, mascot, stars, CSS backgrounds → plain `<img>` or CSS `background-image`. Do NOT run through `astro:assets`
- SVG files cannot go through `<Image />` — use plain `<img>` for SVGs

### Icons
- **astro-icon** (`^1.1.5`) + **@iconify-json/fa** (`^1.2.2`) — Font Awesome 4 via Iconify
- Import: `import { Icon } from 'astro-icon/components';` (v1 path — NOT `'astro-icon'`)
- Usage: `<Icon name="fa:twitter" class="w-5 h-5" />`

### Tooling
- **Biome** (`^1.9.4`, dev) — linter/formatter. Enforces `noExplicitAny` — use `unknown` not `any`
- **@astrojs/sitemap** (`^3.2.1`)

### What This Project Does NOT Use
- No client-side framework (React, Vue) — pure Astro components, inline `<script>` only
- No Astro islands or `client:*` directives
- No automated tests — manual visual testing only
- No content collections — TOML via vite-plugin-toml
- No `tailwind.config.js` — Tailwind v4 CSS-first only
- No CommonJS — entire project is ESM (`"type": "module"`)

---

## Critical Implementation Rules

### Centralization Rules
- All TOML imports and `as unknown as Type` casts → `src/lib/data.ts` — components import typed exports: `import { speakers, content } from "@/lib/data"`
- Speaker image glob and helpers → `src/lib/images.ts` — use `resolveSpeakerImage()` (throws) or `findSpeakerImage()` (returns null)
- Sponsor image glob is local to `Sponsors.astro` — `getSponsorImage()` returns null on missing, renders name as text fallback
- All `eventStatus` checks → `isLive` / `isArchived` from `src/config.ts` (never compare strings directly)
- All Tailwind theme tokens → `@theme {}` in `src/styles/global.css`
- `global.css` is imported once in `BaseLayout.astro` — never in individual pages or components
- Always use `@/` path alias for imports — never relative `../../` chains

### Config vs Content Split
- Structural config (site URL, nav items, eventStatus, OG image) → `src/config.ts`
- Editable content (hero text, ticket copy, CoC, footer text, sponsor CTA) → `src/data/content.toml`
- New editor-facing content → `content.toml` + matching shape in `ContentData` interface in `types.ts`
- New structural/behavioral config → `config.ts`

### TOML Rules
- TOML `image` fields must reference files that physically exist in `src/assets/images/` — missing files crash the build
- TOML data is NOT validated against TypeScript interfaces at build time — invalid values silently pass through. Verify against `src/types.ts`
- TOML keys use camelCase (`topicTitle`, `speakerLink`), not snake_case
- `speakers` field in `schedule.toml` is always an array (`[[schedule.speakers]]`) even for single speakers
- Sponsor tier display order is hardcoded in `Sponsors.astro`, not derived from TOML key order
- Use `"""` triple-quoted strings for all multiline content

### Astro Component Patterns
- Components use `---` frontmatter for TypeScript logic, template below
- Props defined via `interface Props {}` in frontmatter, destructured from `Astro.props`
- Scoped `<style>` blocks for component-specific CSS; global styles in `global.css`
- `set:html` directive for rendering HTML from `marked` — never use `innerHTML`

### Markdown Rendering
- Block content (descriptions, bios, CoC, prerequisites, venue): `marked.parse(text)` → `<div set:html={html} />`
- Inline content (copyright1, sponsorCta): `marked.parseInline(text)` → `<span set:html={html} />`
- `parse()` wraps in `<p>` tags; `parseInline()` does not — use the right one to avoid layout issues

### Image Handling
- `<Image />` requires explicit `width` and `height` props. CSS handles responsive sizing (`w-full`, `object-cover`)
- Circular photos: fixed-size container with `rounded-full overflow-hidden`, `<Image class="w-full h-full object-cover" />` inside

### Three-State eventStatus
- `"upcoming"` (default): All ticket UI hidden — Tito widget, ticket section, Tito script, header CTA, sub-page CTAs
- `"live"`: Tito widget visible, script loaded, header shows "Get Your Tickets", sub-pages show ticket CTA
- `"archived"`: Tickets hidden, header shows "Watch Recordings" → `/schedule`, "Thank you!" banner on home page
- `eventStatus: 'live'` will error if the Tito event doesn't exist on ti.to yet — only set when event is created

### Copy-Link Contract
- HTML: `<button class="copy-link" data-href="/schedule#id">` + sibling `<span class="copy-link-tooltip">Copied!</span>` inside a `.copy-link-wrapper`
- CSS: `.copy-link-tooltip` opacity transition + `.copied` class in `global.css`
- JS: Event delegation in `BaseLayout.astro` listens for `.copy-link` clicks, reads `data-href`, writes to clipboard, toggles `.copied` class
- All three must agree on: `.copy-link` (button class), `data-href` (attribute), `.copy-link-tooltip` (tooltip class), `.copied` (active class)

### Timeline Layout
- Shared `Timeline.astro` wrapper with left-aligned vertical line via `::before` (always visible, all viewports)
- `ScheduleEntry.astro` and `WorkshopEntry.astro` are timeline children
- Left-aligned line with dot markers, time displayed as text above content, break items styled as pills (`.timeline-break-pill`)
- All timeline entries have `scroll-margin-top: 5rem` to clear sticky header
- Break/meta entries: monospace font, `font-weight: 600`. Talk entries: body font, `font-weight: 600`
- Schedule and workshops pages have Conference/Workshops tab navigation (`.schedule-tab`): active tab is solid brand-blue with white text; inactive is white with grey border

### Component Organization
- `src/components/index/` — landing-page-only (Hero, VenueInfo, SpeakerCard, Sponsors, Tickets, CodeOfConduct)
- `src/components/` root — shared across pages (Header, Footer, Timeline, ScheduleEntry, WorkshopEntry, SpeakerProfile, ComingSoon, TicketCta)
- New shared components → `src/components/`. New home-page-only → `src/components/index/`

### Page Pattern
- All pages use `BaseLayout` with optional `title` and `description` props
- Pages provide only `<slot />` content — never import Header or Footer directly
- Sub-page title: `{title} — GopherCon Singapore 2026`; home page omits the prefix

### Script Handling
- Astro processes `<script>` tags through its build pipeline by default (TypeScript, bundling)
- Use `is:inline` on scripts that must run as-is without processing (e.g., `<script is:inline>TitoDevelopmentMode = true;</script>`)

### Code Quality & Style
- Biome handles all formatting and linting — 2-space indent, organized imports. No ESLint, no Prettier
- Font usage: Dangrek = display/hero/venue, Inter = headings/schedule times/body, Source Code Pro = break entries
- Responsive: `md:` (768px) is the primary breakpoint used consistently across all components
- Layout: `.container` class for page-width wrapper — don't reinvent it

---

## Cross-File Dependencies (What Changes Together)

- **Add a speaker:** `speakers.toml` + image file in `src/assets/images/speakers/`
- **Speakers page layout:** Detail card grid (`.speakers-detail-grid`, `.speaker-detail-card`) — no thumbnail row
- **Add a schedule entry:** `schedule.toml` only (speaker images resolve from existing photos)
- **Add a workshop:** `workshops.toml` + instructor image in `src/assets/images/speakers/` (if not already there)
- **Add a sponsor:** `sponsors.toml` + logo file in `src/assets/images/sponsors/`
- **Add a sponsor tier:** `sponsors.toml` + `SponsorsData` in `types.ts` + render order in `Sponsors.astro`
- **Add a page:** `.astro` in `src/pages/` + nav entry in `siteConfig.nav` in `config.ts`
- **Add a content section:** `content.toml` + `ContentData` interface in `types.ts` — cast in `data.ts` silently loses untyped sections
- **Update site copy:** edit `content.toml` only — no TypeScript changes needed
- **Change event status:** single field in `src/config.ts` — all components react via `isLive`/`isArchived`
- **Empty states:** reuse `ComingSoon.astro` with `message` prop — don't create new placeholders
- **Redirects:** `public/_redirects` — 2026-specific only, do NOT carry forward 2025 entries

### Verification
- `npm run build` — primary verification step (no automated tests)
- `npm run lint` — `biome check .` (do NOT install ESLint/Prettier)
- `npm run format` — `biome format --write .`

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Check `src/types.ts` for data shapes before writing TOML
- Check `src/lib/data.ts` and `src/lib/images.ts` before creating new import patterns

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack or patterns change
- Remove rules that become obvious over time

Last Updated: 2026-03-05
