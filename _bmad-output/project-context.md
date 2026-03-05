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
  - `tailwind.config.js` theme config → `@theme { --color-brand-blue: #10B8D6; }` in CSS (auto-generates utilities like `bg-brand-blue`)
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
- `global.css` is imported once in `BaseLayout.astro` (and `RedirectLayout.astro`) — never in individual pages or components
- Always use `@/` path alias for imports — never relative `../../` chains

### Config vs Content Split
- Structural config (site URL, nav items, eventStatus, speakerLineup, OG image) → `src/config.ts`
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
- **Landing page speaker photos fail gracefully:** `SpeakerCard` uses `findSpeakerImage()` (returns null) — if image is missing, shows a circular placeholder with the speaker's initial instead of crashing the build
- **Sponsor images fail gracefully:** `Sponsors.astro` uses `getSponsorImage()` (returns null) — renders sponsor name as text fallback
- **Sponsor links:** `Sponsor` type has optional `url` field. When present, sponsor logo/name is wrapped in `<a>` tag

### Three-State eventStatus
- `"upcoming"` (default): All ticket UI hidden — Tito widget, ticket section, Tito script, header CTA, sub-page CTAs
- `"live"`: Tito widget visible, script loaded, header shows "Get Your Tickets", sub-pages show ticket CTA
- `"archived"`: Tickets hidden, header shows "Watch Recordings" → `/schedule`, "Thank you!" banner on home page
- `eventStatus: 'live'` will error if the Tito event doesn't exist on ti.to yet — only set when event is created

### Speaker Lineup Setting
- `speakerLineup` in `config.ts`: `"confirmed"` or `"unconfirmed"` (type `SpeakerLineup` in `types.ts`)
- When `"unconfirmed"`: shows "More speakers will be announced as they are confirmed." on both landing page and speakers page
- When `"confirmed"`: the message is hidden
- Check via `isLineupConfirmed` exported from `config.ts`

### Nav Item Visibility
- Each nav item in `siteConfig.nav` has an `enabled: boolean` flag
- Header only renders nav items where `enabled: true`
- Schedule and workshops pages show Conference/Workshops tab buttons only when BOTH `/schedule` and `/workshops` nav items are enabled
- Use `isNavEnabled(link)` helper from `config.ts` to check

### Copy-Link Contract
- HTML: `<button class="copy-link" data-href="/schedule#id">` + sibling `<span class="copy-link-tooltip">Copied!</span>` inside a `.copy-link-wrapper`
- CSS: `.copy-link-tooltip` opacity transition + `.copied` class in `global.css`
- JS: Classic inline script (`is:inline`) in `BaseLayout.astro` — event delegation on `.copy-link` clicks, reads `data-href`, writes to clipboard (with `execCommand` fallback for non-secure contexts), toggles `.copied` class
- All three must agree on: `.copy-link` (button class), `data-href` (attribute), `.copy-link-tooltip` (tooltip class), `.copied` (active class)

### Schedule Timeline Layout
- Shared `Timeline.astro` wrapper with left-aligned vertical line via `::before` (always visible, all viewports)
- `ScheduleEntry.astro` is a timeline child
- Left-aligned line with dot markers, time displayed as text above content, break items styled as pills (`.timeline-break-pill`)
- Timeline times (`.timeline-time`): `0.95rem`, bold, hardcoded `#0e7490` (darker cyan for readability) — does NOT use `--color-brand-blue`
- All timeline entries have `scroll-margin-top: 5.5rem` to clear sticky header
- Break/meta entries: monospace font, `font-weight: 600`. Talk entries: body font, `font-weight: 600`
- Links are not underlined by default — underline appears on hover only
- Schedule and workshops pages have Conference/Workshops tab navigation (`.schedule-tab`): active tab is solid brand-blue with white text; inactive is white with grey border

### Workshops Card Layout
- `WorkshopEntry.astro` renders each workshop as a standalone card — NOT inside a Timeline
- All workshop styling uses Tailwind utility classes directly on elements — no custom CSS classes in `global.css`. Markdown content child selectors use Astro scoped `<style>` with `:global()` (e.g., `.section-content :global(h4)`)
- Card-based design: header with instructor photo + title + date/time, body with overview, always-expanded sections for curriculum and instructor bio
- Description is split at the first `####` heading: text before = overview (always visible), text after = curriculum (in a bordered section with heading)
- Sticky jump navigation in `workshops.astro`: responsive design — desktop uses pill links (`hidden md:flex`), mobile uses a compact `<select>` dropdown (`md:hidden`) with IntersectionObserver to auto-track the currently visible workshop. Both are `sticky top-[var(--header-height)]` with frosted-glass background. Uses `overflow-x: clip` on `html, body` (not `hidden`) to avoid breaking sticky positioning
- Instructor photos use `findSpeakerImage` (returns null gracefully) — missing images show a gradient fallback with the instructor’s initial
- Workshop cards have `scroll-mt-36` (9rem) to clear both sticky header and sticky workshop nav
- Mobile responsive via Tailwind breakpoints: `flex-col md:flex-row`, `justify-center md:justify-start`, etc.

### Speaker Detail Cards
- `SpeakerProfile.astro` renders each speaker as a card using Tailwind utility classes — no custom CSS classes in `global.css`
- Card with circular photo (border brand-blue), optional keynote badge, name/company, talk title link, full bio (markdown via `set:html`), social link
- Flex layout: `flex-[1_1_340px] max-w-[500px]` inside a `flex flex-wrap gap-8 justify-center` parent in `speakers.astro`
- Hover: `-translate-y-1` lift + enhanced shadow transition
- Scoped `<style>` with `:global()` for `.speaker-bio :global(p)` margin
- Cards have `scroll-mt-[5.5rem]` to clear sticky header

### Venue Section
- `VenueInfo.astro` uses Tailwind utilities for the section wrapper (`py-8 md:py-16 bg-brand-blue font-display text-white`) — no `.venue` class in `global.css`
- Internal grid layout (workshop dates + conference dates side by side) uses Astro scoped `<style>`

### Header Height
- `--header-height: 85px` defined in `@theme` in `global.css` — used for both `min-height` on `.header` and `top` on the workshop nav
- Desktop and mobile header heights are identical — no extra vertical padding on desktop nav items
- `.menu-item a` uses the same `padding: 0.5rem 0` at all breakpoints; only `text-align: left` changes on desktop
- Workshop nav uses `top-[var(--header-height)]` to sit flush below the header; timeline entries and speaker cards use matching `scroll-margin-top: 85px`

### Component Organization
- `src/components/index/` — landing-page-only (Hero, VenueInfo, SpeakerCard, Sponsors, Tickets, CodeOfConduct)
- `src/components/` root — shared across pages (Header, Footer, Timeline, ScheduleEntry, WorkshopEntry, SpeakerProfile, ComingSoon, TicketCta). Timeline is used by schedule only; WorkshopEntry uses its own card layout
- New shared components → `src/components/`. New home-page-only → `src/components/index/`

### Page Pattern
- All pages use `BaseLayout` with optional `title` and `description` props
- Pages provide only `<slot />` content — never import Header or Footer directly
- Sub-page title: `{title} — GopherCon Singapore 2026`; home page omits the prefix
- **Redirect pages** use `RedirectLayout` instead of `BaseLayout` — same `<head>` (SEO meta, OG tags, analytics) but adds `<meta http-equiv="refresh">` and omits Tito JS / copy-link script. Props: `title`, `description`, `redirectURL`. Slot content is a fallback message with a manual link

### Script Handling
- Astro processes `<script>` tags through its build pipeline by default (TypeScript, bundling, deferred as ES modules)
- Use `is:inline` on scripts that must run as-is without processing (e.g., `<script is:inline>TitoDevelopmentMode = true;</script>`)
- **Tito widget script uses `is:inline`** — `<script is:inline src="https://js.tito.io/v2" async>` prevents Astro from transforming it. Tito loads its own CSS dynamically; no explicit CSS `<link>` needed (the `css.tito.io/v2` endpoint is unreliable/404)
- **Header mobile nav toggle uses `is:inline`** with event delegation (`document.addEventListener('click', ...)` + `e.target.closest('#navbar-toggle')`) — Astro-bundled module scripts run deferred and can fail on iPhone Safari. Keep this script `is:inline`
- Mobile nav dropdown: `.navbar-nav` class on the `<nav>` element, absolute-positioned below header on `max-width: 767px`. Links stack vertically with white background and box shadow

### Code Quality & Style
- Biome handles all formatting and linting — 2-space indent, organized imports. No ESLint, no Prettier
- Font usage: Dangrek = display/hero/venue, Inter = headings/schedule times/body, Source Code Pro = break entries
- Responsive: `md:` (768px) is the primary breakpoint used consistently across all components
- **Overflow prevention:** `html, body { overflow-x: hidden; touch-action: manipulation; }` in `global.css` — safety net against horizontal scroll and prevents double-tap zoom on mobile (preserves pinch-to-zoom). Header uses `height: auto; min-height: 5rem` to accommodate mobile nav expansion. Mobile nav dropdown centers CTA button via `text-align: center`
- **VenueInfo responsive text:** `.venue-heading` class wraps text on mobile (`overflow-wrap: break-word`) and applies `white-space: nowrap` only at `min-width: 768px` — prevents "Pre-conference Workshops" from causing horizontal scroll on mobile
- Layout: `.container` class for page-width wrapper — don't reinvent it

---

## Cross-File Dependencies (What Changes Together)

- **Add a speaker:** `speakers.toml` + image file in `src/assets/images/speakers/` (image is optional — landing page renders gracefully without it)
- **Speakers page layout:** Detail card grid (`.speakers-detail-grid` flexbox with `justify-content: center`, `.speaker-detail-card`) — last row centered
- **Add a schedule entry:** `schedule.toml` only (speaker images resolve from existing photos)
- **Add a workshop:** `workshops.toml` + instructor image in `src/assets/images/speakers/` (if not already there)
- **Add a sponsor:** `sponsors.toml` + logo file in `src/assets/images/sponsors/` + optional `url` field for linking
- **Add a sponsor tier:** `sponsors.toml` + `SponsorsData` in `types.ts` + render order in `Sponsors.astro`
- **Add a page:** `.astro` in `src/pages/` + nav entry in `siteConfig.nav` in `config.ts`
- **Add a redirect page:** `.astro` in `src/pages/` using `RedirectLayout` with `redirectURL` prop — no nav entry needed (e.g., `/cfp` → Google Forms)
- **Add a content section:** `content.toml` + `ContentData` interface in `types.ts` — cast in `data.ts` silently loses untyped sections
- **Update site copy:** edit `content.toml` only — no TypeScript changes needed
- **Change event status:** single field in `src/config.ts` — all components react via `isLive`/`isArchived`
- **Toggle speaker lineup message:** `speakerLineup` in `config.ts` — `"unconfirmed"` shows announcement note, `"confirmed"` hides it
- **Enable/disable nav links:** `enabled` flag on each nav item in `siteConfig.nav` — Header, schedule tabs, and workshop tabs all react
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

Last Updated: 2026-03-06
