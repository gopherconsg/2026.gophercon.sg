---
title: 'GopherCon Singapore 2026 Website'
slug: 'gopherconsg-2026-website'
created: '2026-02-21'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['astro', 'tailwind-v4', 'typescript', 'biome', 'astro-icon', '@iconify-json/fa', '@astrojs/sitemap', 'vite-plugin-toml', 'marked']
files_to_modify:
  - 'src/config.ts'
  - 'src/data/content.toml'
  - 'src/data/speakers.toml'
  - 'src/data/schedule.toml'
  - 'src/data/workshops.toml'
  - 'src/data/sponsors.toml'
  - 'src/types.ts'
  - 'src/env.d.ts'
  - 'src/styles/global.css'
  - 'src/lib/data.ts'
  - 'src/lib/images.ts'
  - 'src/layouts/BaseLayout.astro'
  - 'src/layouts/RedirectLayout.astro'
  - 'src/pages/index.astro'
  - 'src/pages/speakers.astro'
  - 'src/pages/schedule.astro'
  - 'src/pages/workshops.astro'
  - 'src/pages/404.astro'
  - 'src/components/Header.astro'
  - 'src/components/Footer.astro'
  - 'src/components/ComingSoon.astro'
  - 'src/components/TicketCta.astro'
  - 'src/components/SpeakerProfile.astro'
  - 'src/components/Timeline.astro'
  - 'src/components/ScheduleEntry.astro'
  - 'src/components/WorkshopEntry.astro'
  - 'src/components/index/Hero.astro'
  - 'src/components/index/VenueInfo.astro'
  - 'src/components/index/SpeakerCard.astro'
  - 'src/components/index/Sponsors.astro'
  - 'src/components/index/Tickets.astro'
  - 'src/components/index/CodeOfConduct.astro'
  - 'astro.config.mjs'
  - 'biome.json'
  - 'package.json'
  - 'tsconfig.json'
  - 'public/_redirects'
  - 'public/img/*'
  - 'src/assets/images/speakers/*'
  - 'src/assets/images/sponsors/*'
code_patterns:
  - 'TOML data files with triple-quoted strings for multiline'
  - 'Direct TOML imports via vite-plugin-toml (no Astro content collections)'
  - 'Centralized data access via src/lib/data.ts (single TOML loading + casting module)'
  - 'Centralized image utilities via src/lib/images.ts (shared glob + resolve/find helpers)'
  - 'Astro components with scoped <style> blocks'
  - 'Tailwind v4 CSS-first config via @theme in global.css'
  - 'astro:assets <Image /> for speaker/sponsor images'
  - 'CSS backgrounds in public/img/ for hero waves/patterns/mascot/stars'
  - 'Inline <script is:inline> for mobile nav toggle (event delegation) and copy-link'
  - 'Conditional rendering based on eventStatus for archived mode'
  - 'Derived isLive/isArchived booleans exported from src/config.ts'
  - 'CSS Grid auto-fill/minmax for speakers grid'
  - 'Timeline layout: vertical line at 25%, dot markers, time left, content right'
  - 'Snowplow analytics production-only via !import.meta.env.DEV'
  - 'Tito dev mode via import.meta.env.DEV'
  - 'marked for rendering markdown in TOML triple-quoted fields'
  - 'TypeScript path alias: @ maps to src/ (configured in tsconfig.json)'
  - 'Landing-page-only components in src/components/index/ subfolder'
  - 'Shared components (ComingSoon, TicketCta) for repeated UI patterns'
test_patterns:
  - 'Manual visual testing against 2025 site'
  - 'No automated tests (out of scope)'
---

# Tech-Spec: GopherCon Singapore 2026 Website

**Created:** 2026-02-21

## Overview

### Problem Statement

The GopherCon Singapore conference website needs to be rebuilt for 2026. The existing 2019 and 2025 sites are Hugo-based and the organizers want to migrate to a modern Astro + Tailwind v4 stack while preserving the visual identity and combining the best elements from both previous years.

### Solution

Build a new Astro site with Tailwind v4 in the project root, combining the best of the 2019 and 2025 sites. Use TOML data files for content (imported directly via `vite-plugin-toml`, consistent with existing Hugo sites), `astro:assets` for image optimization, timeline layout for schedule and card-based layout for workshops, the 2025 visual brand (hero, colors, Dangrek font) with Inter for headings and body text, and Biome for linting. Integrate Tito ticketing, Snowplow analytics, and astro-icon/Iconify/FA4 for icons. Seed with 2025 content data updated to 2026.

### Scope

**In Scope:**
- New Astro + Tailwind v4 project in the workspace root
- TOML data files: `speakers.toml`, `schedule.toml`, `workshops.toml`, `sponsors.toml` under `src/data/`, imported directly via `vite-plugin-toml` with TypeScript interfaces for type safety, plus `config.ts` for typed site config. Markdown fields rendered via `marked`.
- Pages: Home (`/`), `/speakers`, `/schedule`, `/workshops`, `/cfp` (redirect)
- Visual identity: 2025 hero (waves, mascot, Dangrek) + circular speaker photos, timeline layouts
- Two-font stack: Dangrek (hero/venue display), Inter (headings, body, schedule times, page titles)
- Timeline layout for `/schedule` (left-aligned vertical line, dot markers, break pills, speaker thumbnails, monospace break headers)
- Card-based layout for `/workshops` using Tailwind utility classes (individual workshop cards with header showing instructor photo/title/date, always-expanded sections for full curriculum and instructor bio, prerequisites callout, venue footer. Description split at first `####` heading — overview always visible, detailed syllabus in a separate section. Sticky jump navigation pills below header with frosted-glass background. Instructor photos use `findSpeakerImage` with gradient initial fallback for missing images. Markdown content styles in Astro scoped `<style>` with `:global()`)
- Circular cropped speaker photos + keynote badge on `/speakers` page
- Previous year video embed option on home page hero
- "Become a partner" CTA in sponsors section
- Social events (after-party) included in schedule data
- SVG social icons in footer (via astro-icon/Iconify/FA4)
- Diversity scholarship info + diversity sponsor tier (from 2025)
- Workshop venue with location icon treatment (from 2019)
- Image optimization via `astro:assets` `<Image />` for speaker photos and sponsor logos (hero images stay in `public/img/` as plain files due to CSS animation/positioning)
- CSS Grid for speakers grid on home page (auto-fill/minmax)
- Responsive design (mobile hamburger nav, desktop layout)
- Tito ticket widget integration
- Snowplow analytics tracker
- SEO meta tags, Open Graph, Twitter cards, favicons
- Code of conduct section on home page
- Footer with copyright, CU Society attribution, Gopher CC license, social icons
- Biome for JS/TS/CSS/Astro linting
- Icons: astro-icon + Iconify icon sets + Font Awesome 4 icons
- Reuse 2025 content as placeholder data, updated to 2026
- Copy 2025 image assets into the new project

**Out of Scope:**
- New visual design or rebrand
- CMS or admin interface
- Deployment/hosting configuration (Netlify, Vercel, etc.)
- The existing 2019 and 2025 Hugo sites (left untouched)
- Automated testing

## Context for Development

### Codebase Patterns

- **Data-driven architecture — two tiers:**
  - **TOML data files (direct import):** Speaker profiles, schedule, workshops, and sponsors live as `.toml` files under `src/data/`, imported directly via `vite-plugin-toml`. Each file is imported as a default export and destructured in components (e.g., `import speakerData from '../data/speakers.toml'; const { speakers } = speakerData;`). TypeScript interfaces in `src/types.ts` provide type safety. TOML chosen for consistency with existing Hugo sites (editors already familiar with the format) and clean multiline strings via triple-quoted `"""` blocks. Markdown content in TOML fields is rendered via `marked` + `set:html`.
  - **Site config (TypeScript):** `src/data/config.ts` exports a typed config object for site settings, hero content, tickets, code of conduct, footer, and other non-collection data. TypeScript gives type safety without extra dependencies. Editors rarely touch this file — it's site infrastructure, not content.
- **Image optimization strategy — two tiers:**
  - `src/assets/images/` — Speaker photos, sponsor logos. Processed by `astro:assets` at build time for WebP/AVIF conversion, responsive `srcset`, lazy loading, and CLS prevention via width/height attributes. Rendered with `<Image />` component.
  - `public/img/` — All hero section images (mascot, stars, wave layers), CSS background images (speaker background pattern, partner wave/bg), and logos. Referenced directly in CSS `background-image` rules or plain `<img>` tags. Hero images stay here because the hero is a visual composition with CSS animations and absolute positioning — `astro:assets` optimization would add complexity without meaningful benefit.
- **Visual brand — best of both years:**
  - From 2025: Hero section with wave background layers, mascot popup animation, star burst, brand colors (`--brand-blue: #10B8D6`, `--brand-red: #EE4059`, `--link-blue: #0F71BB`), Dangrek display font for hero/venue.
  - From 2019: Circular speaker photos, timeline layouts, keynote badge, location icon treatment, social icons in footer, "become a partner" CTA, previous year video embed.
  - Combined: Two-font stack — Dangrek (display), Inter (headings + body).
- **Timeline component (schedule only):** Left-aligned vertical line with circular dot markers, time displayed as text above content, break items styled as pills with badge background. Speaker thumbnails (32px circular), monospace font for break entries.
  - **Layout:** All viewport sizes use the same left-aligned layout — vertical line on the left, dot markers, content indented to the right. No separate time column.
- **Workshop cards (Tailwind utility classes):** Each workshop rendered as a standalone card in `WorkshopEntry.astro` using Tailwind utility classes — no custom CSS classes in `global.css`. Gradient header (instructor photo + title + date/time), body with overview text, always-expanded sections for curriculum and instructor bio, prerequisites callout, and venue footer. Description split at first `####` heading. Sticky jump navigation in `workshops.astro` (`sticky top-[5.5rem] z-40 bg-white/95 backdrop-blur`). Workshop cards use `scroll-mt-36` (9rem) to clear both sticky header and nav. Markdown content styling via Astro scoped `<style>` with `:global()` selectors. Mobile-responsive via Tailwind breakpoints (`flex-col md:flex-row`, etc.).
- **Speaker detail cards (Tailwind utility classes):** Each speaker rendered as a card in `SpeakerProfile.astro` using Tailwind utility classes — no custom CSS classes in `global.css`. Card with circular photo, keynote badge, name/company, talk title link, full bio, and social link. Flex basis `flex-[1_1_340px]` with `max-w-[500px]` inside a flex-wrap parent in `speakers.astro`. Hover lift + shadow transition. Markdown bio styling via Astro scoped `<style>` with `:global()` (`.speaker-bio :global(p)`).
- **Venue section (Tailwind utility classes):** `VenueInfo.astro` uses Tailwind utilities for the section wrapper (`py-8 md:py-16 bg-brand-blue font-display text-white`) — no `.venue` class in `global.css`. Internal grid layout uses Astro scoped `<style>`.
- **Component structure:** Header (responsive nav with per-item `enabled` flag + CTA button, mobile dropdown via `.navbar-nav` absolute positioning), Hero (with tagline, CTA button, optional video embed), Venue info (responsive heading that wraps on mobile), Speakers grid (CSS Grid, auto-fill/minmax), Tickets (Tito embed + `<noscript>` fallback with direct link to ti.to event page), Code of Conduct, Sponsors by tier with optional links (with "become a partner" CTA), Footer (social icons, copyright).
  - **Sponsor tier display order** is hardcoded in `Sponsors.astro` (platinum → diversity → gold → workshop), not derived from TOML key order.
  - **Auto-derived counts:** Section headings for workshops can display counts auto-derived from data file lengths (e.g., "2 Workshops"). The speakers page uses a simple "Speakers" heading without count.
- **Empty state handling (data-driven, not status-driven):** Components conditionally render based on data presence, not `eventStatus`. If the speakers array has entries → show grid. If empty → show a centered placeholder. Same pattern for schedule, workshops, sponsors. If `eventStatus` is `"archived"` → always show sections regardless (historical content). This supports the natural conference lifecycle: announcement → speaker reveals → full program → archive.
  - **Empty state placeholder text:**
    - Speakers: "Speaker lineup coming soon. Follow us on Twitter for announcements." (link to `footerConfig.twitterURL`)
    - Schedule: "Schedule coming soon. Follow us on Twitter for updates." (link to `footerConfig.twitterURL`)
    - Workshops: "Workshop details coming soon. Follow us on Twitter for updates." (link to `footerConfig.twitterURL`)
    - Sponsors: "Interested in becoming a partner? Get in touch!" (link to `mailto:hello@gophercon.sg`)
- **Post-event forward-compatibility:** Data schemas include optional fields for post-event use: `recordingUrl` on schedule entries (link to YouTube), `eventStatus` on config (`"upcoming"` | `"live"` | `"archived"`) to conditionally show/hide the ticket widget and adjust messaging. `speakerLineup` config (`"confirmed"` | `"unconfirmed"`) controls whether "More speakers will be announced" message appears on landing page and speakers page.
  - **Three-state eventStatus behavior:**
    - `"upcoming"`: Default state. Tito widget, ticket section, Tito script, header CTA button, and sub-page ticket CTAs are all hidden. Site shows conference info, speakers, schedule, workshops, sponsors, and CoC.
    - `"live"`: Tito widget and ticket section visible. Tito script loaded in `<head>`. Header shows "Get Your Tickets" CTA. Sub-pages show "Get your ticket →" CTA at bottom.
    - `"archived"`: Tito widget and ticket section hidden. Header shows "Watch Recordings" CTA linking to `/schedule`. "Thank you!" banner displayed above Hero on home page. Sub-page ticket CTAs hidden.
  - **Archived mode behavior:** When `eventStatus` is `"archived"`: ticket widget and Tito script hidden, header CTA button changed to "Watch Recordings" (linking to schedule page), "Thank you!" banner displayed at top of home page (above Hero). Keep implementation simple — just conditional visibility checks on `eventStatus`.
- **Sub-pages:** `/speakers` (detail card grid with Tailwind utility classes — circular photos, keynote badge, full bios, talk links, copy-link; markdown bio styling via scoped `<style>` with `:global()`), `/schedule` (left-aligned timeline layout with Conference/Workshops tabs — tabs only shown when both nav items are enabled — active tab solid brand-blue, inactive white/grey), `/workshops` (card-based layout with Tailwind utility classes, sticky jump navigation, always-expanded sections, matching Conference/Workshops tabs).
  - **Ticket CTA on sub-pages:** Each sub-page (`/speakers`, `/schedule`, `/workshops`) includes a brief CTA section at the bottom linking to `/#tickets` (e.g., "Ready to join us? Get your ticket →"). Ensures visitors who land directly on a sub-page from a shared link have a clear path to purchase.
- **Shareable anchors:** Every schedule entry and speaker profile has a clean anchor ID. A small "copy link" icon (via astro-icon) next to each title allows attendees and speakers to easily copy a direct link for social sharing. On click, show a brief "Copied!" tooltip that fades after 1.5s (CSS transition, no JS framework needed — just toggle a class).
  - **Scroll offset:** All anchored elements (`id` attributes on schedule entries, speaker profiles) must have `scroll-margin-top` set to match the header height (e.g., `scroll-margin-top: 5rem`). This prevents content from hiding behind a sticky/fixed header when navigating via anchor links.
- **Third-party integrations:** Tito widget (`<tito-widget event="gopherconsg/2026">`), Snowplow analytics tracker, Google Fonts (Dangrek, Inter).
  - **Font loading:** Use Google Fonts `<link>` with `preconnect` for initial implementation (matches proven 2025 pattern, simpler setup). Self-hosting in `public/fonts/` is a future optimization, not required for initial build.
  - **Tito dev mode:** For local development, include `<script>TitoDevelopmentMode = true</script>` conditionally (e.g., check `import.meta.env.DEV`). The Tito script (`https://js.tito.io/v2`) loads with `is:inline` and `async` in `<head>` — `is:inline` prevents Astro from transforming the external script tag. Tito loads its own CSS dynamically; no explicit CSS `<link>` needed (the `css.tito.io/v2` endpoint is unreliable/404). Include a `<noscript>` fallback below the `<tito-widget>`: `<noscript><p>JavaScript is required to display tickets. <a href="https://ti.to/gopherconsg/2026">Buy tickets on ti.to</a></p></noscript>`.
  - **Snowplow analytics:** Only fires in production (not dev). Config pattern from 2025: `appId: 'gcsg2026-website'`, CloudFront endpoint `d9ca3gcsg29e9.cloudfront.net`, `discoverRootDomain: true`. Wrap in a production-only conditional (`!import.meta.env.DEV`).
- **Icons:** astro-icon package with Iconify icon sets for general icons + Font Awesome 4 icons for social (Twitter/Facebook) and UI elements. This matches the 2019 site's FA usage while modernizing the integration.
- **Interactivity:** Two small inline `<script is:inline>` blocks, no JS framework needed:
  1. Mobile nav toggle in Header component (`is:inline` with event delegation — Astro module scripts run deferred and can fail on iPhone Safari). Toggle `.navbar-nav` `hidden` class. Mobile dropdown is absolute-positioned below header at `max-width: 767px` with white background and box-shadow.
  2. Copy-link-to-clipboard on schedule/speaker anchor icons (`navigator.clipboard.writeText()`) with "Copied!" tooltip feedback (toggle a `.copied` class, CSS handles fade after 1.5s).
- **Overflow prevention:** `html, body { overflow-x: clip; touch-action: manipulation; }` in `global.css`. Uses `clip` instead of `hidden` to avoid creating a scroll container that breaks `position: sticky`. `touch-action: manipulation` prevents double-tap zoom on mobile while preserving pinch-to-zoom. Header uses `height: auto; min-height: var(--header-height)` with `--header-height: 85px` defined in `@theme`. Consistent height across mobile and desktop — desktop nav items use the same padding as mobile so menu items don't push the header taller than the logo. Mobile nav dropdown centers CTA button via `text-align: center`. VenueInfo heading wraps on mobile (`overflow-wrap: break-word`), applies `white-space: nowrap` only at `min-width: 768px`.
- **BaseLayout title pattern:** Sub-pages pass `title` and `description` props. Title rendered as `{title} — GopherCon Singapore 2026` for sub-pages, or just `GopherCon Singapore 2026` for the home page. Description used for `<meta name="description">` — each sub-page provides its own (e.g., `/speakers`: "Meet the speakers at GopherCon Singapore 2026", `/schedule`: "Conference schedule for GopherCon Singapore 2026").
- **RedirectLayout:** A variant of `BaseLayout` for pages that immediately redirect to an external URL. Same `<head>` (SEO meta, OG image, Snowplow analytics) but adds `<meta http-equiv="refresh" content="0; url={redirectURL}">` and omits Tito JS and copy-link scripts. Props: `title?`, `description?`, `redirectURL`. Slot content renders a fallback message with a manual link. Used for SEO-friendly redirects (e.g., `/cfp` → Google Forms CFP).
- **SEO meta in BaseLayout `<head>`:** `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:title/type/url/image">`, `<meta name="twitter:card/title/image">`, favicon links, `<meta name="theme-color">`. Drop IE conditional comments (not needed for 2026).
- **Tailwind v4 configuration:** CSS-first — no `tailwind.config.js`. Configuration via `@theme` block in `src/styles/global.css`. Custom properties defined in `@theme`. Custom CSS (hero animations, timeline, wave backgrounds) in global CSS or scoped `<style>` blocks.
  - **IMPORTANT v4 migration notes:** The 2025 site's CSS is Tailwind v3 — use it as design intent reference only, do NOT copy-paste. Key v4 differences: `@import "tailwindcss"` replaces `@tailwind base/components/utilities`; `@theme {}` replaces `theme.extend` in config; `@apply` syntax may differ; some utility names shifted. Rewrite custom CSS for v4 syntax.
  - **Tailwind v4 quick-reference (most common v3→v4 differences):**
    - `@tailwind base; @tailwind components; @tailwind utilities;` → `@import "tailwindcss";`
    - `tailwind.config.js` `theme.extend.colors` → `@theme { --color-brand-blue: #10B8D6; }` in CSS
    - `tailwind.config.js` `theme.extend.fontFamily` → `@theme { --font-display: "Dangrek", cursive; }` in CSS
    - `bg-brand-blue` → `bg-[var(--color-brand-blue)]` or define in `@theme` as `--color-brand-blue` and use `bg-brand-blue` (v4 auto-generates utilities from `@theme` custom properties)
    - `@apply` still works but is discouraged for new code — prefer utility classes in markup
    - `text-opacity-*` / `bg-opacity-*` → use `text-{color}/{opacity}` syntax (e.g., `text-white/80`)
    - Container queries, `@starting-style`, and other modern CSS features are natively supported
- **Linting:** Biome configured for JS/TS/CSS/Astro files. Ensures consistent code style across multiple editors. Config in `biome.json` at project root.
- **Markdown in TOML fields:** Several TOML fields contain markdown content inside triple-quoted `"""` strings: `description` (speakers, schedule, workshops), `prerequisites` (workshops), `venue` (workshops), `scholarshipInfo`, `refundPolicy`, `codeOfConduct.content`, `copyright1`, `sponsorCta`. These must all be processed through `marked` and rendered via Astro's `set:html` directive in their respective components. The dev agent should use this consistent approach everywhere markdown appears in data.

### Data Schema Contracts

**TypeScript Interfaces** (`src/types.ts`):
```ts
export interface Speaker {
  id: string;
  name: string;
  company?: string;
  image: string;              // resolves to src/assets/images/speakers/
  description: string;        // markdown — render with marked
  topicTitle: string;
  topicLink: string;
  keynote?: boolean;          // defaults to false in template logic
  socialUrl?: string;
}

export interface ScheduleSpeaker {
  name: string;
  link?: string;
  image?: string;
}

export interface ScheduleEntry {
  id: string;
  title: string;
  description: string;        // markdown — render with marked
  time: string;
  type: 'talk' | 'break' | 'meta';
  recordingUrl?: string;
  speakers: ScheduleSpeaker[];
}

export interface Workshop {
  id: string;
  title: string;
  speaker: string;
  speakerLink: string;
  speakerImage: string;
  speakerBio: string;         // markdown — render with marked
  speakerSocialUrl?: string;
  description: string;        // markdown — render with marked
  prerequisites?: string;     // markdown — render with marked
  date: string;
  time: string;
  venue: string;              // markdown — render with marked
  venueRegistration?: string;
  venueMapUrl?: string;
  additional?: string;
}

export interface Sponsor {
  name: string;
  logo: string;               // resolves to src/assets/images/sponsors/
  url?: string;               // optional link wrapping the logo/name
}

export interface SponsorsData {
  platinum: Sponsor[];
  diversity: Sponsor[];
  gold: Sponsor[];
  workshop: Sponsor[];
}

export type EventStatus = 'upcoming' | 'live' | 'archived';
export type SpeakerLineup = 'confirmed' | 'unconfirmed';
```

**Import pattern** (used in all components):
```ts
// In any .astro component or page:
import { speakers, content } from "@/lib/data";
import { speakerImages } from "@/lib/images";
import { isLive, isArchived, isLineupConfirmed, isNavEnabled } from "@/config";
```

All TOML loading and casting is centralized in `src/lib/data.ts`. Speaker image glob and helpers are centralized in `src/lib/images.ts`. The `@/` alias maps to `src/` (configured in `tsconfig.json`).

**speakers.toml** (`src/data/speakers.toml`):
```toml
[[speakers]]
id = "dave-cheney"
name = "Dave Cheney"
company = "GitHub"
image = "dave-cheney.jpg"
topicTitle = "Starting and stopping things"
topicLink = "/schedule#dave-cheney"
keynote = false
socialUrl = "https://twitter.com/davecheney"
description = """David is an open source contributor and project member for the Go programming language."""
```

**schedule.toml** (`src/data/schedule.toml`):
```toml
# speakers is always an array, even for single speaker — avoids branching logic in templates.

[[schedule]]
id = "registration"
title = "Registration"
description = "Doors open at 8 AM. See you there!"
time = "8:00 AM"
type = "meta"

[[schedule.speakers]]
name = "GopherCon Singapore Team"

[[schedule]]
id = "dave-cheney"
title = "Starting and stopping things"
time = "9:40 AM"
type = "talk"
recordingUrl = ""
description = """Multiline talk description..."""

[[schedule.speakers]]
name = "Dave Cheney"
link = "/speakers#dave-cheney"
image = "dave-cheney.jpg"

[[schedule]]
id = "am-tea-break"
title = "$GOPHERCONSG/teabreak"
description = "Coffee and snacks."
time = "10:20 AM"
type = "break"

[[schedule.speakers]]
name = "GopherCon Singapore Team"

[[schedule]]
id = "sp-digital"
title = "Joint Talk Title"
time = "3:40 PM"
type = "talk"
description = """Talk description..."""

[[schedule.speakers]]
name = "Speaker One"
link = "/speakers#speaker-one"
image = "speaker-one.jpg"

[[schedule.speakers]]
name = "Speaker Two"
link = "/speakers#speaker-two"
image = "speaker-two.jpg"

[[schedule]]
id = "after-party"
title = "$GOPHERCONSG/after/party/🎉"
description = ""
time = "7:00 PM to 11:59 PM"
type = "break"

[[schedule.speakers]]
name = "GopherCon Singapore Team"
```

**workshops.toml** (`src/data/workshops.toml`):
```toml
[[workshops]]
id = "hardware-hacking-with-tinygo"
title = "Hardware Hacking with TinyGo"
speaker = "Ron Evans"
speakerLink = "/speakers#ron-evans"
speakerImage = "ron-evans.webp"
speakerSocialUrl = "https://twitter.com/deadprogram"
date = "22 January 2026"
time = "9:30am to 5:30pm"
venueRegistration = "registration starts at 9:00am"
venueMapUrl = ""
additional = ""
speakerBio = """Instructor bio text..."""
description = """Multiline workshop description with markdown..."""
prerequisites = """
- Complete the [Go Tour](https://go.dev/tour/welcome/1)
- Have a functioning Go environment installed
"""
venue = """
**IMDA Pixel Innovation Hub**
10 Central Exchange Green
Singapore 138649
"""
```

**sponsors.toml** (`src/data/sponsors.toml`):
```toml
[[platinum]]
name = "Go"
logo = "go.png"
url = "https://go.dev"

[[platinum]]
name = "Grab"
logo = "grab.png"
url = "https://grab.com"

[[diversity]]
name = "GoBridge"
logo = "gobridge.png"

[[gold]]
name = "GovTech"
logo = "stack.png"

[[workshop]]
name = "IMDA PIXEL"
logo = "imda-pixel.png"

# NOTE: vite-plugin-toml parses this file's default export as:
# { platinum: [...], diversity: [...], gold: [...], workshop: [...] }
# This maps directly to the SponsorsData TypeScript interface — no transformation needed.
# The optional `url` field wraps the sponsor logo/name in a link.
```

**config.ts** (`src/data/config.ts`) — typed site config:
```ts
export const siteConfig = {
  title: 'GopherCon Singapore 2026',
  description: 'GopherCon Singapore is a Go programming language (Golang) conference in Southeast Asia.',
  baseUrl: 'https://2026.gophercon.sg/',
  ogImage: 'gopherconsg202x-og.png',   // NOTE: placeholder — update to 2026 OG image
  logo: 'gopherconsg202x-long.png',    // NOTE: placeholder — update to 2026 logo
  eventStatus: 'upcoming' as EventStatus, // 'upcoming' hides tickets/Tito entirely; 'live' shows tickets + Tito; 'archived' shows "Watch Recordings" + thank-you banner
  speakerLineup: 'unconfirmed' as SpeakerLineup, // 'unconfirmed' shows "More speakers will be announced" on landing + speakers page
  nav: [
    { title: 'Workshops', link: '/workshops', enabled: true },
    { title: 'Schedule', link: '/schedule', enabled: true },
    { title: 'Speakers', link: '/speakers', enabled: true },
  ],
} as const;

export const heroConfig = {
  tagline: 'Southeast Asia\'s largest Go conference',
  ctaText: 'Get Your Tickets',
  ctaLink: '/#tickets',
  previousYearText: 'Check out what happened in 2025!',
  previousYearVideoId: '',              // YouTube video ID, optional
  conferenceDate: '22&ndash;24 January 2026',
  workshopDates: '22-23 January',
  workshopVenue: 'IMDA PIXEL Innovation Hub',
  workshopVenueUrl: 'https://maps.app.goo.gl/eS1CRMc8MSDW5GFY6',
  conferenceDates: '24 January',
  conferenceVenue: 'JW Marriott Singapore Ballroom',
  conferenceVenueUrl: 'https://maps.app.goo.gl/7ag5ZuZWJ5NHSxsc9',
  practicalInfo: '',                    // optional, markdown block for venue directions — if non-empty, render below venue details in VenueInfo component using marked.parse() + set:html
} as const;

export const ticketsConfig = {
  headline: 'Tickets',
  buttonText: 'Get Your Ticket Now',
  link: '/#tickets',
  titoEvent: 'gopherconsg/2026',
  // NOTE: link duplicates heroConfig.ctaLink — both point to '/#tickets'. Use ticketsConfig.link
  // in Tickets component and sub-page CTAs; use heroConfig.ctaLink in Hero component.
  scholarshipInfo: `### Scholarships\nWe are happy to offer diversity scholarships...`,
  refundPolicy: `### Refund policy\nWe offer refunds for all requests made before...`,
} as const;

export const codeOfConductConfig = {
  content: `All attendees, speakers, sponsors and volunteers at our conference are required to agree with the following code of conduct...`,
} as const;

export const sponsorCtaText = 'Interested in becoming a partner? [Get in touch!](mailto:hello@gophercon.sg)';

export const footerConfig = {
  email: 'hello@gophercon.sg',
  twitterURL: 'https://twitter.com/gopherconsg',
  facebookURL: 'https://www.facebook.com/GopherConSG',
  copyright: '&copy; GopherCon Singapore 2026',
  copyright1: 'GopherCon Singapore is run under the auspices of the [CU Society](https://cu.sg) (UEN: T18SS0020F).',
  copyright2: 'The Gopher character is based on the Go mascot designed by Renee French and copyrighted under <a rel="license" href="http://creativecommons.org/licenses/by/3.0/us/"><img alt="Creative Commons License" style="display: inline-block; border-width:0" src="https://i.creativecommons.org/l/by/3.0/us/80x15.png" /></a>',
  updatedDate: '21 February 2026',
} as const;
```

### Project Structure

```
/                              # project root (Astro project)
├── src/
│   ├── assets/
│   │   └── images/
│   │       ├── speakers/      # Speaker photos (optimized by astro:assets)
│   │       └── sponsors/      # Sponsor logos (optimized by astro:assets)
│   ├── components/
│   │   ├── index/             # Components used only on the landing page
│   │   │   ├── Hero.astro
│   │   │   ├── VenueInfo.astro
│   │   │   ├── SpeakerCard.astro
│   │   │   ├── Sponsors.astro
│   │   │   ├── Tickets.astro
│   │   │   └── CodeOfConduct.astro
│   │   ├── Header.astro       # Shared — used in BaseLayout
│   │   ├── Footer.astro       # Shared — used in BaseLayout
│   │   ├── ComingSoon.astro   # Shared empty-state placeholder
│   │   ├── TicketCta.astro    # Shared "Get your ticket" CTA for sub-pages
│   │   ├── SpeakerProfile.astro  # Used in /speakers page
│   │   ├── Timeline.astro     # Shared timeline wrapper (schedule + workshops)
│   │   ├── ScheduleEntry.astro   # Timeline entry for schedule
│   │   └── WorkshopEntry.astro   # Timeline entry for workshops
│   ├── data/
│   │   ├── content.toml       # All editable content (hero, tickets, CoC, footer, sponsor CTA)
│   │   ├── speakers.toml      # Speaker profiles
│   │   ├── schedule.toml      # Conference day schedule
│   │   ├── workshops.toml     # Workshop details
│   │   └── sponsors.toml      # Sponsor tiers and logos
│   ├── layouts/
│   │   ├── BaseLayout.astro       # <head>, meta, analytics, fonts, nav, footer
│   │   └── RedirectLayout.astro   # Like BaseLayout but with meta refresh, no Tito/copy-link
│   ├── lib/
│   │   ├── data.ts            # Centralized TOML loading + typed exports
│   │   └── images.ts          # Shared speaker image glob + resolve/find helpers
│   ├── pages/
│   │   ├── index.astro
│   │   ├── speakers.astro
│   │   ├── schedule.astro
│   │   ├── workshops.astro
│   │   ├── cfp.astro              # Redirect to external CFP form (uses RedirectLayout)
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css         # Tailwind v4 @theme + custom CSS (hero, timeline, etc.)
│   ├── config.ts              # Site config (title, baseUrl, eventStatus, nav) + isLive/isArchived
│   ├── env.d.ts               # TOML module declaration + Astro client types
│   └── types.ts               # TypeScript interfaces for TOML data shapes
├── public/
│   ├── _redirects             # Netlify-style redirects (carry forward from 2025)
│   ├── img/                   # Hero images, wave backgrounds, mascot, stars, logos, patterns
│   └── (favicons)
├── astro.config.mjs
├── biome.json
├── package.json
└── tsconfig.json
```

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `2025/data/index.toml` | Home page content: tickets, CoC, sponsors (5 tiers: platinum, diversity, gold, workshop) |
| `2025/data/speakers.toml` | 13 speaker profiles with id, name, company, image, description, topicTitle, topicLink |
| `2025/data/schedule.toml` | 18 schedule entries with id, title, description, speaker, speakerLink, time |
| `2025/data/workshops.toml` | 2 workshops with full descriptions, venue, prerequisites, speaker info |
| `2025/data/footer.toml` | Footer: email, twitter, facebook, copyright, copyright1, copyright2, updatedDate |
| `2025/config.toml` | Site config: baseurl, title, theme, params (name, description, ogimage, logo, ticket) |
| `2025/themes/gopherconsg-2023/layouts/index.html` | Home page: hero → venue → speakers grid → tickets → CoC → partners → footer |
| `2025/themes/gopherconsg-2023/layouts/partials/header.html` | Responsive nav: logo, hamburger toggle, menu items, CTA button |
| `2025/themes/gopherconsg-2023/layouts/partials/footer.html` | Footer: title, copyright1 (markdownify), copyright2 (safeHTML), copyright, updatedDate |
| `2025/themes/gopherconsg-2023/layouts/partials/head.html` | SEO meta, OG/Twitter cards, favicons, Google Fonts (Dangrek+Inter), Snowplow, Tito |
| `2025/themes/gopherconsg-2023/tailwind.css` | Tailwind v3 CSS: custom properties, hero animations, wave backgrounds, venue, speakers, partners |
| `2025/themes/gopherconsg-2023/layouts/speakers/single.html` | Speaker list: photo + name/title/company + description + topic link |
| `2025/themes/gopherconsg-2023/layouts/schedule/single.html` | Table layout: time / topic / description columns |
| `2025/themes/gopherconsg-2023/layouts/workshops/single.html` | Table layout: date+time+venue / title+description columns |
| `2019/themes/gopherconsg-2017/layouts/schedule/single.html` | Timeline: `.timeline` div, `.timeline-point` dots, `.timeline-time` col-xs-3, `.timeline-event` col-xs-8 |
| `2019/themes/gopherconsg-2017/layouts/workshops/single.html` | Timeline workshops: same structure + venue with SVG location icon + instructor section |
| `2019/themes/gopherconsg-2017/layouts/speakers/single.html` | Speakers: 170px circular photos, keynote tag, bio, talk link |
| `2019/themes/gopherconsg-2017/static/css/gopherconsg.css` | Timeline CSS (`:before` line at 25%, 15px dot markers), Merriweather headings, speaker styles |
| `2019/data/schedule/conference.toml` | 2019 schedule: nested TOML objects with class (timeline-sub-header/timeline-mono-header), fragmentid, multi-speaker support |
| `2019/data/schedule/workshops.toml` | 2019 workshops: venue, address, venueinfo, instructor, profile, twitter, bio, mapiframeurl |

### Asset Inventory (from 2025 site)

**Speaker photos** (`2025/assets/images/speakers/`): adrian-cole.jpg, axel-wagner.jpg, bjorn-andersson.jpg, charles-korn.jpg, chewxy.jpg, dave-cheney.jpg, elisa-xu.jpg, johnny-boursiquot.webp, jon-kartago-lamida.jpg, manuel-de-la-pena.jpg, ron-evans.webp, sau-sheong.jpg, swami.webp

**Sponsor logos** (`2025/assets/images/sponsors/`): go.png, gobridge.png, grab.png, imda-pixel.png, stack.png

**Hero/background images** (`2025/static/img/`): gopherconsg202x-long.png, gopherconsg202x-og.png, gopherconsg202x.png, hero-mascots.png, hero-stars.png, hero-wave-back.png, hero-wave-front.png, hero-wave-mid.png, partners-bg.png, partners-wave.png, speakers-bg.png, twitter_logo.svg

**Favicons** (`2025/static/`): android-chrome-192x192.png, android-chrome-512x512.png, apple-touch-icon.png, browserconfig.xml, favicon-16x16.png, favicon-32x32.png, favicon.ico, mstile-144x144.png, mstile-150x150.png, mstile-310x150.png, mstile-310x310.png, mstile-70x70.png, safari-pinned-tab.svg, site.webmanifest

### Integration Details (from investigation)

**Snowplow analytics** (from `2025/themes/gopherconsg-2023/layouts/partials/head.html`):
- Script: `//dq946n1u2xxy.cloudfront.net/t.js`
- Tracker endpoint: `d9ca3gcsg29e9.cloudfront.net`
- App ID pattern: `gcsg{year}-website` → `gcsg2026-website`
- Production-only: Hugo uses `$.Site.IsServer` check; Astro equivalent is `!import.meta.env.DEV`

**Tito ticketing** (from `2025/themes/gopherconsg-2023/layouts/partials/head.html`):
- Script: `https://js.tito.io/v2` (`is:inline`, async in `<head>`)
- CSS: `https://css.tito.io/v2` (explicit `<link>` in `<head>` for reliability)
- Widget: `<tito-widget event="gopherconsg/2025">` → update to `gopherconsg/2026`
- Dev mode: `<script>TitoDevelopmentMode = true</script>` when `import.meta.env.DEV`

**Google Fonts** (from 2025 head partial):
- Dangrek (400 only — display font, single weight)
- Merriweather (400, 700 — headings, schedule times)
- Inter (400, 500, 600 — body text, nav, UI)
- Google Fonts URL: `https://fonts.googleapis.com/css2?family=Dangrek&family=Inter:wght@400;500;600&family=Merriweather:wght@400;700&display=swap`
- Include `&display=swap` for font-display swap (prevents invisible text during load)
- Note: hero PNG images in `public/img/` should be manually compressed before copying from 2025 (run through ImageOptim or similar)

**Mobile nav toggle** (from `2025/themes/gopherconsg-2023/layouts/partials/default_foot.html`):
- Simple inline script: toggle `hidden` class on `#navbar-container`, update `aria-expanded`

### Technical Decisions

- **Astro** — modern static site generator, component-based, zero JS by default
- **Tailwind v4** — CSS-first configuration via `@theme`, no config JS file
- **TOML data files** — consistent with existing Hugo sites (editors already know the format), imported directly via `vite-plugin-toml` as a Vite plugin, `"""` triple-quoted blocks for multiline. TypeScript interfaces for type safety (no Zod/content collections).
- **`marked`** — lightweight markdown renderer for TOML fields containing markdown (descriptions, bios, prerequisites, venue, CoC, copyright). Rendered via `set:html` in Astro components.
- **`astro:assets`** — built-in image optimization (WebP/AVIF, srcset, lazy loading, CLS prevention)
- **Two-tier image strategy** — `src/assets/images/` for `<Image />` (speakers, sponsors), `public/img/` for hero composition + CSS backgrounds
- **CSS Grid** for speakers grid — `auto-fill` / `minmax` for consistent responsive columns
- **Timeline layout** for schedule + workshops — ported from 2019's vertical timeline design into Tailwind
- **Three-font stack** — Dangrek (display), Merriweather (headings/serif accent), Inter (body)
- **astro-icon + Iconify + FA4** — modern icon integration with access to Font Awesome 4 set for social/UI icons
- **Biome** — fast linter/formatter for JS/TS/CSS/Astro, configured for multi-editor consistency
- **No framework (React/Vue/etc.)** — pure Astro components, inline `<script>` for mobile nav toggle
- **Inline scripts only** — no client-side hydration, no Astro islands needed

## Implementation Plan

### Tasks

#### Phase 1: Project Scaffolding & Configuration

- [ ] Task 1: Initialize Astro project and install dependencies
  - File: `package.json`
  - Action: Run `npm create astro@latest` in project root (empty template), then install dependencies: `tailwindcss @tailwindcss/vite vite-plugin-toml astro-icon @iconify-json/fa @astrojs/sitemap marked` and dev dependencies: `--save-dev @biomejs/biome`
  - Notes: Use `--template minimal` to avoid boilerplate. Any recent Astro 5.x works. The workspace root already contains `2019/` and `2025/` subdirectories — Astro scaffolds new files alongside them, not inside them. If scaffolding creates a conflicting `README.md`, keep the existing one.

- [ ] Task 2: Configure Astro
  - File: `astro.config.mjs`
  - Action: Set `site: 'https://2026.gophercon.sg'`, add `icon()` and `sitemap()` integrations, add `tailwindcss()` and `toml()` as Vite plugins
  - Notes: Import statements: `import tailwindcss from '@tailwindcss/vite'`, `import toml from 'vite-plugin-toml'`, `import icon from 'astro-icon'`, `import sitemap from '@astrojs/sitemap'`. Follow the exact pattern from the "Astro Config Pattern" section below. Configure `sitemap()` with a filter to exclude `/404`: `sitemap({ filter: (page) => page !== 'https://2026.gophercon.sg/404' })` (exact URL match, not substring).

- [ ] Task 3: Configure TypeScript
  - File: `tsconfig.json`
  - Action: Extend `astro/tsconfigs/strict`, no additional customization needed
  - Notes: Astro scaffolding creates this; just verify it's set to strict

- [ ] Task 4: Configure Biome
  - File: `biome.json`
  - Action: Create Biome config for JS/TS/CSS/Astro. Enable formatter (indent: tab or 2-space per team preference), linter with recommended rules, organize imports
  - Notes: Include `"files": { "ignore": ["dist/**", "node_modules/**", ".astro/**"] }`

- [ ] Task 5a: Create Tailwind v4 base theme and tokens
  - File: `src/styles/global.css`
  - Action: Create with `@import "tailwindcss"`, `@theme {}` block defining custom properties: `--color-brand-blue: #10B8D6`, `--color-brand-red: #EE4059`, `--color-link-blue: #0F71BB`, font families (Dangrek, Inter), and any custom spacing/sizing tokens. Include base typography styles (body font, heading font, link colors). Links use `text-decoration: none` by default, underline on hover only.
  - Notes: Reference `2025/themes/gopherconsg-2023/tailwind.css` for design intent only. Key v4 differences: `@import "tailwindcss"` replaces `@tailwind` directives; `@theme {}` replaces `theme.extend`; utility names may differ.

- [ ] Task 5b: Create custom CSS (hero, timeline, waves, patterns)
  - File: `src/styles/global.css` (append to file from 5a)
  - Action: Add custom CSS blocks for: hero wave backgrounds and keyframe animations (mascot-popup, star-burst, wave drift), timeline layout (`::before` line, dot markers, time/content columns), speaker background pattern, partners wave/bg, and copy-link tooltip fade. Rewrite all CSS for Tailwind v4 syntax — do NOT copy-paste from 2025 v3 CSS.
  - Notes: Map from 2025 CSS file (`2025/themes/gopherconsg-2023/tailwind.css`):
    - Lines with `.hero-*` → hero section animations and wave positioning
    - Lines with `.timeline*` → timeline vertical line and dot markers (also reference "Timeline Visual Spec" section in this spec)
    - Lines with `.speakers-*` → speaker background pattern
    - Lines with `.partners-*` → sponsors section wave and background
    - Lines with `@keyframes` → all animation definitions (mascot popup, star burst, wave drift)
    - Also add `.copied` tooltip styles (opacity 0→1 transition, 1.5s fade-out)

#### Phase 2: Static Assets & Data Files

- [ ] Task 6: Copy image assets from 2025 site
  - Files: `src/assets/images/speakers/*`, `src/assets/images/sponsors/*`, `public/img/*`, `public/*.png`, `public/*.ico`, `public/*.svg`, `public/site.webmanifest`, `public/browserconfig.xml`
  - Action: Copy speaker photos from `2025/assets/images/speakers/` → `src/assets/images/speakers/`. Copy sponsor logos from `2025/assets/images/sponsors/` → `src/assets/images/sponsors/`. Copy hero/background images from `2025/static/img/` → `public/img/`. Copy favicons from `2025/static/` → `public/`.
  - Notes: Manually compress hero PNGs through ImageOptim or similar before copying if possible. Preserve original filenames.

- [ ] Task 7: Create redirects file
  - File: `public/_redirects`
  - Action: Create empty `_redirects` file (or with only a comment). Do NOT carry forward the 2025 Slido `/qna` redirect.
  - Notes: Add redirects as needed for 2026 only

- [ ] Task 8: Create site config
  - File: `src/data/config.ts`
  - Action: Create with all exported config objects: `siteConfig`, `heroConfig`, `ticketsConfig`, `codeOfConductConfig`, `sponsorCtaText`, `footerConfig`. Use exact values from the "Data Schema Contracts" section of this spec.
  - Notes: All configs use `as const` for type narrowing. Markdown fields use template literals.

- [ ] Task 9: Create TypeScript interfaces and TOML module declaration
  - Files: `src/types.ts`, `src/env.d.ts`
  - Action: Create TypeScript interfaces for all TOML data shapes: `Speaker`, `ScheduleSpeaker`, `ScheduleEntry`, `Workshop`, `Sponsor`, `SponsorsData`. Use exact interfaces from the "Data Schema Contracts" section of this spec. Also create (or extend Astro's existing) `src/env.d.ts` with a module declaration for `.toml` files:
    ```ts
    declare module '*.toml' {
      const value: Record<string, any>;
      export default value;
    }
    ```
  - Notes: Without the `.toml` module declaration, TypeScript will error on every TOML import with "Cannot find module". Components cast imported data to these types (e.g., `speakerData.speakers as Speaker[]`).

- [ ] Task 10: Create speakers TOML data
  - File: `src/data/speakers.toml`
  - Action: Convert 2025 speaker data (`2025/data/speakers.toml`) to the new schema format. Use `"""` triple-quoted strings for multiline descriptions.
  - Field mapping (2025 → 2026): `id` → `id`, `name` → `name`, `company` → `company`, `image` → `image`, `description` → `description`, `topicTitle` → `topicTitle`, `topicLink` → `topicLink`. NEW fields: `keynote` (set `false` for all, no keynotes in 2025 data), `socialUrl` (optional, leave empty or omit).
  - Notes: Reference `2025/data/speakers.toml` for all 13 speaker entries. Preserve exact content, just restructure to match new `[[speakers]]` array-of-tables format. Workshop instructors (e.g., Ron Evans) who also appear in `workshops.toml` MUST be included in `speakers.toml` as well — their `/speakers#` anchor links from workshop entries depend on it. Keep speaker data as the single source of truth for bios on the speakers page; workshop entries carry their own `speakerBio` for the workshops page.

- [ ] Task 11: Create schedule TOML data
  - File: `src/data/schedule.toml`
  - Action: Convert 2025 schedule data (`2025/data/schedule.toml`) to new schema. Use `"""` for multiline descriptions.
  - Field mapping (2025 → 2026): `id` → `id`, `title` → `title`, `description` → `description`, `time` → `time`, `speaker` → `speakers[0].name`, `speakerLink` → `speakers[0].link`, `speakerImage` (derive from speaker id) → `speakers[0].image`. NEW fields: `type` (classify each entry as `talk`, `break`, or `meta` based on content), `recordingUrl` (empty string for all). The `speakers` field is always an array — even single-speaker entries use `[[schedule.speakers]]`.
  - Notes: Reference `2025/data/schedule.toml` for all 18 entries. Add an after-party entry at the end. The `speakers` array pattern avoids branching logic in templates.

- [ ] Task 12: Create workshops TOML data
  - File: `src/data/workshops.toml`
  - Action: Convert 2025 workshop data (`2025/data/workshops.toml`) to new schema. Use `"""` for multiline description, prerequisites, venue, bio.
  - Field mapping (2025 → 2026): `id` → `id`, `title` → `title`, `description` → `description`, `date` → `date`, `time` → `time`, `venue` → `venue`, `prerequisites` → `prerequisites`, `speaker` → `speaker`, `speakerLink` → `speakerLink`, `speakerImage` → `speakerImage`, `speakerBio` → `speakerBio`. NEW fields: `speakerSocialUrl` (optional), `venueRegistration` (e.g., "registration starts at 9:00am"), `venueMapUrl` (optional), `additional` (optional, default empty).
  - Notes: Reference `2025/data/workshops.toml` for both workshop entries.

- [ ] Task 13: Create sponsors TOML data
  - File: `src/data/sponsors.toml`
  - Action: Convert 2025 sponsor data (from `2025/data/index.toml` partners section) to flat TOML arrays: `[[platinum]]`, `[[diversity]]`, `[[gold]]`, `[[workshop]]`. Each entry has `name` and `logo` fields.
  - Notes: Logo filenames reference images in `src/assets/images/sponsors/`. Imported directly via `vite-plugin-toml`.

#### Phase 3: Layout & Core Components

- [ ] Task 14: Create BaseLayout
  - File: `src/layouts/BaseLayout.astro`
  - Action: Create layout with `<head>` containing: charset, viewport, `<title>` (sub-page pattern: `{title} — GopherCon Singapore 2026`), `<meta name="description">`, canonical URL, OG tags, Twitter card tags, favicon links, `<meta name="theme-color">`, Google Fonts `<link>` with `preconnect` (Dangrek, Merriweather 400/700, Inter 400/500/600), Tito script (async, with dev mode conditional), Snowplow analytics (production-only via `!import.meta.env.DEV`). Import `global.css`. Props: `title?: string`, `description?: string`. Body renders a skip-to-content link (`<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2">Skip to content</a>`), then `<Header />`, then `<main id="main-content"><slot /></main>`, then `<Footer />` — pages only provide slot content, never import Header/Footer directly.
  - Notes: Use `import.meta.env.DEV` for Tito dev mode and Snowplow production guard. Include `&display=swap` on Google Fonts URL. Drop IE conditional comments. `<head>` element order: charset → viewport → preconnect (Google Fonts — TWO links: `https://fonts.googleapis.com` AND `https://fonts.gstatic.com`) → title → meta description → canonical → fonts CSS link → favicon links → OG/Twitter meta → theme-color → Tito script (async) → Snowplow script (production-only). Import `global.css` in the component frontmatter: `import '../styles/global.css'` — do NOT use a `<link>` tag, as that bypasses Tailwind's processing pipeline.

- [ ] Task 15: Create Header component
  - File: `src/components/Header.astro`
  - Action: Responsive nav with: logo image (linked to `/`), hamburger button (mobile), nav links from `siteConfig.nav`, CTA button ("Get Your Tickets" → `/#tickets`). Hide CTA when `eventStatus === 'archived'` or change to "Watch Recordings" → `/schedule`. Include inline `<script>` for mobile nav toggle (toggle `hidden` class, update `aria-expanded`). Active nav link highlighting: compare `Astro.url.pathname` against each nav item's `link` and apply an active class (e.g., `text-brand-blue font-semibold` or underline) to the matching link. On the home page (`/`), no nav link is active.
  - Notes: Sticky/fixed header with height of `5rem` (80px) — this value is referenced by `scroll-margin-top` throughout the site. Include proper `aria-label`, `aria-expanded`, `role` attributes for accessibility.

- [ ] Task 16: Create Footer component
  - File: `src/components/Footer.astro`
  - Action: Footer with: site title, social icons (Twitter, Facebook, email) via `astro-icon` with `fa:twitter`, `fa:facebook`, `fa:envelope`. Copyright line, CU Society attribution (render markdown from `copyright1`), Gopher CC license (render HTML from `copyright2`), updated date. Import from `footerConfig`.
  - Notes: Use `marked` to render `copyright1` markdown. Use `set:html` for `copyright2` (already contains HTML). Social icon links open in new tab with `rel="noopener noreferrer"`.

#### Phase 4: Home Page Sections

- [ ] Task 17: Create Hero component
  - File: `src/components/Hero.astro`
  - Action: Hero section with: wave background layers (back, mid, front as CSS backgrounds from `public/img/`), mascot popup animation, star burst, conference title in Dangrek, tagline, date, CTA button, optional previous year video embed (YouTube iframe, conditional on `previousYearVideoId` being non-empty — use responsive 16:9 aspect ratio container with `<iframe>` inside, e.g., `<div class="aspect-video"><iframe src="https://www.youtube.com/embed/{previousYearVideoId}" ...></iframe></div>`). Use `heroConfig` for all content.
  - Notes: Reference `2025/themes/gopherconsg-2023/tailwind.css` for hero animation keyframes and wave positioning (rewrite for Tailwind v4). Hero images are plain `<img>` or CSS backgrounds from `public/img/`, NOT `astro:assets`.

- [ ] Task 18: Create VenueInfo component
  - File: `src/components/VenueInfo.astro`
  - Action: Display workshop and conference venue info from `heroConfig`: dates, venue names (linked to Google Maps URLs), Dangrek font for venue names. Two-column layout (workshops left, conference right) on desktop, stacked on mobile. If `heroConfig.practicalInfo` is non-empty, render it below the venue details as markdown using `marked.parse()` + `set:html`.
  - Notes: Use `set:html` for `conferenceDate` (contains `&ndash;` entity).

- [ ] Task 19: Create SpeakerCard component
  - File: `src/components/SpeakerCard.astro`
  - Action: Card for home page speakers grid. Props: speaker data object. Display: square photo (`<Image />` from `astro:assets`), name, company, topic title (linked to schedule anchor). No circular crop on home page — square display.
  - Notes: Image source resolves from `src/assets/images/speakers/{image}`. The `<Image />` component requires explicit `width` and `height` props for proper optimization (srcset generation, CLS prevention). Use `width={280}` and `height={280}` on the `<Image />` component, then apply `w-full aspect-square object-cover` via CSS/Tailwind classes to make it responsive within the grid. The explicit dimensions enable astro:assets optimization while CSS handles the responsive sizing.

- [ ] Task 20: Create Tickets component
  - File: `src/components/Tickets.astro`
  - Action: Section with headline, `<tito-widget event="gopherconsg/2026">`, `<noscript>` fallback linking to `https://ti.to/gopherconsg/2026`. Below widget: scholarship info and refund policy (rendered from markdown via `marked`). Hide entire section when `eventStatus === 'archived'`.
  - Notes: Tito script is loaded in BaseLayout `<head>`. Widget just needs the custom element here.

- [ ] Task 21: Create CodeOfConduct component
  - File: `src/components/CodeOfConduct.astro`
  - Action: Section displaying code of conduct content from `codeOfConductConfig.content`, rendered as markdown via `marked` + `set:html`.
  - Notes: Keep it simple — heading + rendered content block.

- [ ] Task 22: Create Sponsors component
  - File: `src/components/Sponsors.astro`
  - Action: Display sponsors by tier in hardcoded order: platinum → diversity → gold → workshop. Each tier: heading, grid of sponsor logos (`<Image />` from `astro:assets`, source from `src/assets/images/sponsors/`, `alt` set to sponsor `name`). Below all tiers: "Become a partner" CTA (rendered from `sponsorCtaText` markdown). Conditionally render each tier only if it has entries. Show empty state placeholder if no sponsors at all (unless archived).
  - Notes: Sponsor tier order is hardcoded in component, NOT derived from TOML key order. Import sponsors data via `import sponsorsData from '../data/sponsors.toml'` and cast to `SponsorsData` type.

- [ ] Task 23: Build home page
  - File: `src/pages/index.astro`
  - Action: Compose home page using BaseLayout + sections in order: Hero → VenueInfo → Speakers grid (CSS Grid `auto-fill/minmax`, using SpeakerCard, with count in heading) → Tickets → CodeOfConduct → Sponsors. Import speakers via `import speakerData from '../data/speakers.toml'`. Empty state: if no speakers, show "Speaker lineup coming soon" placeholder with Twitter link (from `footerConfig.twitterURL`). Add `id="tickets"` anchor on Tickets section.
  - Notes: Speakers grid uses CSS Grid with `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` and `gap-6` (1.5rem gap between items). Section headings can show auto-derived counts (e.g., "Our Speakers (13)").

- [ ] Task 23b: Create archived-mode "Thank you!" banner
  - File: `src/pages/index.astro`
  - Action: Add a conditional banner at the top of the home page content (above Hero), visible only when `siteConfig.eventStatus === 'archived'`. Text: "Thank you!" Styled with brand colors (e.g., `--color-brand-blue` background, white text, centered, padded). Simple `<div>` — no component file needed, just a conditional block in `index.astro`.
  - Notes: When `eventStatus` is not `'archived'`, the banner is not rendered at all (not hidden — absent from DOM).

#### Phase 5: Sub-Pages & Timeline Components

- [ ] Task 24: Create SpeakerProfile component
  - File: `src/components/SpeakerProfile.astro`
  - Action: Full speaker profile for `/speakers` page. Circular photo (170px, `<Image />` with `rounded-full overflow-hidden` container, `object-cover`), keynote badge (conditional on `keynote` field), name, company, description (rendered as markdown), topic title linked to schedule anchor, social link icon. Anchor `id` set to speaker's `id` field. Copy-link icon next to name. `scroll-margin-top: 5rem` on the anchored element.
  - Notes: Copy-link uses inline `<script>` (shared across page, defined once). "Copied!" tooltip via CSS class toggle + 1.5s fade transition.

- [ ] Task 25: Create Timeline component
  - File: `src/components/Timeline.astro`
  - Action: Shared timeline wrapper. Renders a vertical line at 25% width via `::before` pseudo-element (desktop only, `md:` breakpoint). Accepts `<slot />` for timeline entries. On mobile (`< md`): no vertical line, no dots — stacked layout.
  - Notes: The timeline visual treatment (line + dots) is desktop-only. Reference the "Timeline Visual Spec" section for exact values.

- [ ] Task 26: Create ScheduleEntry component
  - File: `src/components/ScheduleEntry.astro`
  - Action: Timeline entry for schedule. Props: schedule entry data. Layout: dot marker at 25% line, time on left (Merriweather, `#33b0c0` color), content on right (title, description rendered as markdown, speaker thumbnails 50px circular). Break entries: monospace font, `font-weight: 600`. Talk entries: Inter font, `font-weight: 600`. Anchor `id` from entry `id`. Copy-link icon. `scroll-margin-top: 5rem`. Speaker thumbnails link to `/speakers#` anchors. For speakers with no `image` field (break/meta entries like "GopherCon Singapore Team"), do NOT render a thumbnail — just show the speaker name as text. If `recordingUrl` is non-empty (truthy check: `if (entry.recordingUrl)` — empty string `""` is falsy), render a "Watch Recording ▶" link below the description (styled as a small pill/badge linking to the URL). This enables post-event archive mode without component changes — just populate the field in TOML.
  - Notes: Dot marker: 15px diameter, `#272727`, `border-radius: 50%`, centered on vertical line. Mobile: time above content, no dot. The `meta` type renders with the same styling as `break` (monospace, font-weight 600) — there is no distinct visual treatment for `meta` entries. The copy-link markup includes a `<span class="copy-link-tooltip">Copied!</span>` sibling to the button — see Copy-Link Contract section for exact HTML structure.

- [ ] Task 27: Create WorkshopEntry component
  - File: `src/components/WorkshopEntry.astro`
  - Action: Timeline entry for workshops. Props: workshop data. Layout: dot marker, date+time on left, content on right (title, full description as markdown, prerequisites callout as markdown, venue with `fa:map-marker` location icon + optional map link, instructor section with circular photo 170px + bio as markdown + social link). Anchor `id` from workshop `id`. Copy-link icon. `scroll-margin-top: 5rem`.
  - Notes: Venue registration info below venue. Prerequisites rendered in a distinct callout/box style. If `prerequisites` is undefined or empty, do NOT render the prerequisites callout at all — skip it entirely rather than showing an empty box.

- [ ] Task 28: Build speakers page
  - File: `src/pages/speakers.astro`
  - Action: Load speakers via `import speakerData from '../data/speakers.toml'`. Render page title "Our Speakers" (with count). Map speakers to SpeakerProfile components. Empty state if no speakers. Ticket CTA section at bottom linking to `/#tickets` — hide this CTA when `eventStatus === 'archived'`. Pass `title="Speakers"` and `description="Meet the speakers at GopherCon Singapore 2026"` to BaseLayout.
  - Notes: Include copy-link icon markup (`.copy-link` class + `data-href` attribute) on each SpeakerProfile — the actual script is in BaseLayout via event delegation (Task 32).

- [ ] Task 29: Build schedule page
  - File: `src/pages/schedule.astro`
  - Action: Load schedule via `import scheduleData from '../data/schedule.toml'`. Render page title "Schedule". Wrap entries in Timeline component, map to ScheduleEntry components. Empty state if no schedule. Ticket CTA at bottom — hide when `eventStatus === 'archived'`. Pass `title="Schedule"` and `description="Conference schedule for GopherCon Singapore 2026"` to BaseLayout.
  - Notes: Schedule entries are already ordered in the TOML file — render in data order.

- [ ] Task 30: Build workshops page
  - File: `src/pages/workshops.astro`
  - Action: Load workshops via `import workshopData from '../data/workshops.toml'`. Render page title (with count, e.g., "2 Workshops"). Wrap entries in Timeline component, map to WorkshopEntry components. Empty state if no workshops. Ticket CTA at bottom — hide when `eventStatus === 'archived'`. Pass `title="Workshops"` and `description="Workshops at GopherCon Singapore 2026"` to BaseLayout.
  - Notes: Workshops ordered by date in TOML file.

- [ ] Task 31: Build 404 page
  - File: `src/pages/404.astro`
  - Action: Branded 404 page with mascot image, "Page not found" message, links to home page and past event sites (2025, 2019). Use BaseLayout with `title="Page Not Found"`.
  - Notes: Keep it simple and on-brand.

#### Phase 6: Copy-Link Script & Final Polish

- [ ] Task 32: Implement copy-link inline script
  - File: `src/layouts/BaseLayout.astro`
  - Action: Add a shared inline `<script>` in BaseLayout (before `</body>`) that uses event delegation on `document` to handle clicks on `.copy-link` elements. On click: read the element's `data-href` attribute, call `navigator.clipboard.writeText(window.location.origin + href)`, toggle `.copied` class on a sibling tooltip element, remove class after 1.5s via `setTimeout`. Event delegation means it works on any page without per-page scripts — harmless on pages with no `.copy-link` elements.
  - Notes: CSS for the `.copied` tooltip (opacity transition, 1.5s fade) goes in `global.css`. No JS framework needed.

- [ ] Task 33: Verify build and fix issues
  - Action: Run `npx astro build` to verify the site builds without errors. Fix any type errors, missing imports, or schema validation failures. Run `npx biome check .` to verify linting passes.
  - Notes: This is a verification step, not a feature. Address any issues found.

### Acceptance Criteria

- [ ] AC 1: Given a fresh clone of the repo, when `npm install && npm run build` is executed, then the site builds successfully with zero errors
- [ ] AC 2: Given the home page is loaded, when viewing on desktop (≥1024px), then the hero section displays with wave backgrounds, mascot animation, star burst, conference title in Dangrek font, tagline, date, and CTA button
- [ ] AC 3: Given the home page is loaded, when scrolling to the speakers section, then speakers are displayed in a CSS Grid (auto-fill/minmax 280px) with square photos, names, companies, and topic titles linked to schedule anchors
- [ ] AC 4: Given the home page speakers section, when no speaker data exists in the TOML file, then a centered placeholder "Speaker lineup coming soon" message is displayed with a Twitter link
- [ ] AC 5: Given the home page is loaded, when scrolling to the tickets section, then the Tito widget renders with event `gopherconsg/2026` and a noscript fallback link is present
- [ ] AC 6: Given the site is running in dev mode (`npm run dev`), when the Tito widget loads, then `TitoDevelopmentMode` is set to `true`
- [ ] AC 7: Given the site is built for production, when the page loads, then Snowplow analytics fires with appId `gcsg2026-website` and the correct CloudFront endpoint
- [ ] AC 8: Given the site is running in dev mode, when the page loads, then Snowplow analytics does NOT fire
- [ ] AC 9: Given the `/speakers` page is loaded, when viewing on desktop, then each speaker displays with a 170px circular photo, name, company, description (rendered markdown), topic link, and optional keynote badge
- [ ] AC 10: Given the `/schedule` page is loaded on desktop (≥768px), when viewing the timeline, then a vertical line appears at 25% width with circular dot markers, times on the left in Merriweather font (#33b0c0), and content on the right
- [ ] AC 11: Given the `/schedule` page is loaded on mobile (<768px), when viewing the schedule, then entries display in a stacked layout (time above content) with no vertical line and no dot markers
- [ ] AC 12: Given a schedule entry of type `break`, when rendered in the timeline, then the title displays in monospace font with font-weight 600
- [ ] AC 13: Given a schedule entry with multiple speakers, when rendered in the timeline, then all speaker thumbnails (50px circular) are displayed with links to their `/speakers#` anchors
- [ ] AC 14: Given the `/workshops` page is loaded, when viewing a workshop entry, then it displays date/time on left, full description (markdown), venue with map-marker icon, and instructor section with circular photo and bio
- [ ] AC 15: Given any schedule entry or speaker profile, when the copy-link icon is clicked, then the direct URL (with anchor) is copied to clipboard and a "Copied!" tooltip appears and fades after 1.5s
- [ ] AC 16: Given a direct URL with an anchor hash (e.g., `/schedule#dave-cheney`), when navigated to, then the page scrolls to the correct entry with proper offset (not hidden behind the sticky header)
- [ ] AC 17: Given the header is viewed on mobile, when the hamburger button is clicked, then the nav menu toggles visibility and `aria-expanded` is updated correctly
- [ ] AC 18: Given `eventStatus` is set to `"archived"` in config, when the home page loads, then the Tito ticket widget is hidden and the header CTA is either hidden or changed to "Watch Recordings"
- [ ] AC 19: Given the `/speakers`, `/schedule`, or `/workshops` page is loaded and `eventStatus` is NOT `"archived"`, when scrolling to the bottom, then a ticket CTA section is visible linking to `/#tickets`
- [ ] AC 20: Given any page is loaded, when viewing the HTML source, then proper `<title>`, `<meta description>`, OG tags, and Twitter card tags are present with page-specific values
- [ ] AC 21: Given the sponsors section on the home page, when sponsors exist in the TOML data, then they display in tier order: platinum → diversity → gold → workshop, with a "Become a partner" CTA below
- [ ] AC 22: Given the footer is rendered, when viewing on any page, then social icons (Twitter, Facebook, email) are displayed via astro-icon, copyright text renders correctly (including CU Society markdown link and Gopher CC license HTML), and the updated date is shown
- [ ] AC 23: Given the 404 page is accessed, when any invalid URL is visited, then a branded 404 page displays with links to the home page and past event sites
- [ ] AC 24: Given any component rendering markdown from TOML fields (speaker descriptions, workshop prerequisites, venue, bios, CoC, copyright1, sponsorCta), when the page loads, then markdown is rendered as HTML (links are clickable, bold text is bold, lists are formatted) and no raw markdown syntax is visible
- [ ] AC 25: Given the VenueInfo section on the home page, when viewed on desktop (≥768px), then workshop and conference venues display side-by-side in two columns; when viewed on mobile (<768px), then they stack vertically
- [ ] AC 26: Given `eventStatus` is set to `"archived"` in config, when the home page loads, then a "Thank you!" banner is displayed above the hero section; when `eventStatus` is `"upcoming"` or `"live"`, then no banner is present in the DOM
- [ ] AC 27: Given `eventStatus` is set to `"archived"` in config, when any sub-page (`/speakers`, `/schedule`, `/workshops`) is loaded, then the ticket CTA section at the bottom is not rendered
- [ ] AC 28: Given a schedule entry with a non-empty `recordingUrl`, when the schedule page is loaded, then a "Watch Recording" link is displayed below the entry description

## Additional Context

### Dependencies

- astro (latest, 5.x)
- @tailwindcss/vite (Tailwind v4 Vite plugin — used directly in astro.config.mjs, replaces the old @astrojs/tailwind)
- tailwindcss v4
- vite-plugin-toml (enables direct `import data from './data/speakers.toml'` in Astro components — the sole TOML integration, no content collections used)
- astro-icon
- @iconify-json/fa (Font Awesome icon set for Iconify)
- @astrojs/sitemap (generates sitemap.xml)
- @biomejs/biome (dev dependency — install with `--save-dev`)
- marked (lightweight markdown renderer for TOML `"""` fields containing markdown)

### Testing Strategy

Manual visual testing against the 2025 site for parity, with specific attention to:
- Timeline layout matching 2019's visual style
- Circular speaker photos rendering correctly
- Responsive behavior on mobile/tablet/desktop
- Tito widget loading and displaying
- Image optimization (WebP served, lazy loading working)

### Notes

- The 2025 Hugo theme is named `gopherconsg-2023`, suggesting it was originally built for 2023 and reused.
- Speaker images are in `2025/assets/images/speakers/` and sponsor logos in `2025/assets/images/sponsors/`.
- Hero/background images are in `2025/static/img/`.
- The 2019 site used Bootstrap + jQuery with Merriweather + Open Sans fonts; the 2025 site uses Tailwind with Dangrek + Inter. The 2026 site combines both font approaches.
- The 2019 timeline CSS uses a vertical line at 25% with absolute-positioned dot markers. This will be reimplemented with Tailwind utility classes + minimal custom CSS.
- The 2025 `_redirects` file contains a 2025-specific Slido redirect (`/qna`). Clear this and start fresh for 2026 — only add redirects as needed.
- Biome should be configured to format on save and lint on commit for team consistency.

### Astro Config Pattern

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import toml from 'vite-plugin-toml';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://2026.gophercon.sg',
  integrations: [icon(), sitemap({
    filter: (page) => !page.includes('/404'),
  })],
  vite: {
    plugins: [tailwindcss(), toml()],
  },
});
```

### Timeline Visual Spec (from 2019 CSS)

Key values to match the 2019 timeline feel:
- Vertical line: `1px` width, `#272727` color, positioned at `left: 25%` (via `::before` pseudo-element on `.timeline` container)
- Dot markers: `15px` diameter, `#272727` background, `border-radius: 50%`, positioned at `left: 25%` with `margin-left: -7px` to center on line
- Time column: `25%` width, `text-align: right`, `padding-right: 5em`, font: Merriweather, color: `#33b0c0`
- Content column: offset from 25% + gap, word-wrap: break-word
- Anchored blocks: Use `scroll-margin-top: 5rem` (modern CSS property). Do NOT use the 2019 `padding-top: 5em / margin-top: -4em` hack — that was a workaround for browsers that didn't support `scroll-margin-top`.
- Break entries: monospace font (`Source Code Pro, Inconsolata, Courier, monospace`), `font-weight: 600`
- Talk entries: `font-family: Open Sans` (→ Inter in 2026), `font-weight: 600`
- Speaker thumbnails in timeline: `50px × 50px`, `border-radius: 50%`, `margin-right: 1.5em`
- Mobile (`< md`): No vertical line, no dots, stacked layout (time above content)

### Icon Inventory

Import: `import { Icon } from 'astro-icon/components';` (astro-icon v1 syntax)

Usage in template: `<Icon name="fa:twitter" class="w-5 h-5" />`

Exact Iconify names for `astro-icon` with `@iconify-json/fa`:
- `fa:twitter` — footer social, speaker social links
- `fa:facebook` — footer social
- `fa:link` — copy-link anchor icon on schedule/speaker entries
- `fa:map-marker` — venue location icon on workshops
- `fa:envelope` — footer email link

### Copy-Link Contract

The copy-link feature spans three locations that must use consistent naming. Here is the exact contract:

**HTML markup** (in SpeakerProfile, ScheduleEntry, WorkshopEntry):
```html
<span class="copy-link-wrapper" style="position: relative; display: inline-flex; align-items: center;">
  <button class="copy-link" data-href="/schedule#dave-cheney" aria-label="Copy link to this section">
    <Icon name="fa:link" class="w-4 h-4" />
  </button>
  <span class="copy-link-tooltip" aria-live="polite">Copied!</span>
</span>
```

**CSS** (in `global.css`, Task 5b):
```css
.copy-link-tooltip {
  position: absolute;
  left: 100%;
  margin-left: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
  font-size: 0.75rem;
}
.copy-link-tooltip.copied {
  opacity: 1;
}
/* On narrow viewports, flip tooltip to the left to avoid overflow */
@media (max-width: 480px) {
  .copy-link-tooltip {
    left: auto;
    right: 100%;
    margin-left: 0;
    margin-right: 0.5rem;
  }
}
```

**JavaScript** (in BaseLayout, Task 32):
```js
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-link');
  if (!btn) return;
  const href = btn.getAttribute('data-href');
  const tooltip = btn.parentElement.querySelector('.copy-link-tooltip');
  try {
    navigator.clipboard.writeText(window.location.origin + href);
  } catch {
    // Fallback for HTTP or older browsers
    const ta = document.createElement('textarea');
    ta.value = window.location.origin + href;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  tooltip.classList.add('copied');
  setTimeout(() => tooltip.classList.remove('copied'), 1500);
});
```

All three must agree on: `.copy-link` (button class), `data-href` (attribute name), `.copy-link-tooltip` (tooltip class), `.copied` (active class).
- Verify these exist in the `@iconify-json/fa` package; if any are missing, check `@iconify-json/fa-brands` or `@iconify-json/mdi` as fallbacks
- **Verification:** Before building components, run a quick check by importing one icon in a test component or browse https://icon-sets.iconify.design/fa/ to confirm exact names. The `fa` set is Font Awesome 4 — social icons like Twitter/Facebook are in the main set, not a separate `fa-brands` split (that's FA5+).

### Circular Speaker Photo Implementation

Circular crop uses a fixed-size square container with overflow hidden. The `<Image />` component receives the full intrinsic dimensions from `ImageMetadata` — sizing is controlled entirely via CSS on the container and `object-cover` on the image. Do NOT pass explicit `width`/`height` props to `<Image />` for display sizing; let CSS handle it.

- `/speakers` page: `w-[170px] h-[170px] rounded-full overflow-hidden` container, `<Image />` inside with `class="w-full h-full object-cover"`
- Home page grid (`SpeakerCard`): `w-full aspect-square` container (fills grid cell width, maintains square ratio), `<Image />` inside with `class="w-full h-full object-cover"`. No circular crop — square display. The grid cell width is determined by `minmax(280px, 1fr)`, so photos scale with the column.
- Timeline thumbnails: `w-[50px] h-[50px] rounded-full overflow-hidden` container, same `object-cover` pattern
- This handles non-square source images (mix of portrait/landscape) gracefully

### Image Import Pattern (CRITICAL)

Astro's `<Image />` component requires statically analyzable imports — you CANNOT use dynamic string interpolation like `` <Image src={`../assets/images/speakers/${speaker.image}`} /> ``. Instead, use `import.meta.glob()` to build an image map at build time:

```ts
// In any component that renders speaker/sponsor images:
import { Image } from 'astro:assets';

const speakerImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/speakers/*.{jpg,jpeg,webp,png}',
  { eager: true }
);

function getSpeakerImage(filename: string) {
  const key = `/src/assets/images/speakers/${filename}`;
  const image = speakerImages[key];
  if (!image) throw new Error(`Speaker image not found: ${filename}`);
  return image.default;
}
```

Then in template:
```astro
<Image src={getSpeakerImage(speaker.image)} alt={speaker.name} />
```

Apply the same pattern for sponsor logos (`/src/assets/images/sponsors/*.{png}`). Do NOT include `.svg` in the sponsor glob — Astro's `<Image />` does not support SVG optimization. If any sponsor logos are SVGs, use a plain `<img>` tag instead. This is the standard Astro pattern for dynamic image sources from `src/assets/`.

**Note:** If a TOML `image` field references a filename that doesn't exist in the corresponding `src/assets/images/` directory, the build will fail with a clear error pointing to the missing file. This is intentional — it prevents broken images in production. Fix by correcting the filename in TOML or adding the missing image file.

### Markdown Rendering Pattern

All markdown content in TOML fields and config strings must be rendered consistently using `marked`:

```ts
// In component frontmatter:
import { marked } from 'marked';

// For multiline/block markdown (descriptions, bios, prerequisites, CoC, venue):
const descriptionHtml = marked.parse(speaker.description);

// For single-line inline markdown (copyright1, sponsorCta, topicTitle with links):
const copyrightHtml = marked.parseInline(footerConfig.copyright1);
```

Then in template:
```astro
<!-- Block markdown: -->
<div set:html={descriptionHtml} />

<!-- Inline markdown (no <p> wrapper): -->
<span set:html={copyrightHtml} />
```

Use `marked.parse()` for multiline content (wraps in `<p>` tags). Use `marked.parseInline()` for single-line fields where `<p>` wrapping would cause layout issues. Both return `string` synchronously in marked v12+. If using an older version of marked that has `parseSync()`, use that instead of `parse()` to avoid async Promise returns.

### Hero CSS Architecture

The hero is a layered CSS composition with absolute positioning. Layer order (back to front):
1. **Background gradient** — dark base color
2. **Wave back** (`hero-wave-back.png`) — CSS background, bottom-positioned, subtle parallax feel
3. **Wave mid** (`hero-wave-mid.png`) — CSS background, overlaps back wave, slight animation
4. **Wave front** (`hero-wave-front.png`) — CSS background, foreground wave with animation
5. **Stars** (`hero-stars.png`) — absolute positioned, burst/twinkle animation
6. **Mascot** (`hero-mascots.png`) — absolute positioned, popup animation from bottom
7. **Content overlay** — title, tagline, date, CTA button (z-index above all layers)

Key animations (reference `2025/themes/gopherconsg-2023/tailwind.css` for exact keyframes):
- `mascot-popup`: translateY from off-screen to final position
- `star-burst`: scale + opacity pulse
- Wave layers: subtle translateX or translateY drift

All hero images are in `public/img/` and referenced via CSS `background-image` or plain `<img>` tags — NOT `astro:assets`. The dev agent must rewrite the 2025 Tailwind v3 animation CSS for v4 syntax.

**Mobile hero behavior:** On small screens (`< md`), the hero should gracefully degrade: hide or significantly scale down the mascot and stars (they're decorative, not essential), ensure wave layers don't overflow, and keep the content overlay (title, tagline, CTA) readable with adequate padding. Reference the 2025 site's mobile hero for guidance — the key principle is that decorative elements yield to content legibility on small screens.


## Post-Implementation Changes

Changes made after initial implementation, during visual review:

### Visual & Layout Fixes

1. **Hero section:** Removed CTA button from hero — hero now shows only title + date (matching 2025 pattern). CTA lives in the header nav only.
2. **Hero layer order:** Reordered hero layers to match 2025 stacking: waves → mascot → wave-front → stars. Added `z-index: 10` on `.hero-text` so content sits above decorative layers.
3. **Venue section:** Updated to match 2025 proportions — `text-2xl md:text-[2rem]` with `leading-[1.25]`, left border divider between columns, proper mobile stacking via scoped `<style>` block. Headings ("Pre-conference Workshops", "Conference") use Dangrek font.
4. **Speaker cards (home page):** Shrunk significantly to fit all 13 in a single row on desktop. Cards use `flex: 1 1 0%` with `flex-wrap: nowrap` on `md:` breakpoint. Images 120px source, text 0.8rem. On mobile, cards wrap at 100px width. Removed talk titles from landing page cards — shows only name + company.
5. **Sponsors/Partners section:** Added massive top padding (`pt-[8rem] md:pt-[14rem]`) on heading to clear wave background. Switched to 2025's horizontal tier row layout (label left, logos right) instead of centered headings.
6. **Tickets + Code of Conduct alignment:** Both sections now use identical structure: full `.container` → nested `div` with `max-width: 800px; margin: 0 auto` for consistent text alignment.
7. **Footer:** Replaced inverted logo image with "GopherCon Singapore" text heading in Dangrek font (matching 2025 footer pattern).

### Font Changes

8. **Dropped Inter:** Body font changed from Inter to system font stack (`Helvetica Neue, Arial, ui-sans-serif, system-ui, sans-serif`). Inter removed from Google Fonts link.
9. **Nav CTA button:** Uses Dangrek font (`font-family: var(--font-display)`).

### eventStatus Behavior Change

10. **Three-state ticketing logic:** Tito widget, ticket section, Tito `<script>` tag, header "Get Your Tickets" CTA, and sub-page ticket CTAs now only render when `eventStatus === 'live'`. When `upcoming`, all ticket-related UI is hidden (prevents "Cannot connect to event" errors before the Tito event is created). When `archived`, shows "Watch Recordings" CTA and thank-you banner instead.

### Adversarial Review Fixes

11. **WorkshopEntry instructor photo:** Fixed 100px → 170px per spec.
12. **Tito dev mode script:** Added `is:inline` directive to prevent Astro from processing the script tag.
13. **`<Image />` dimensions:** Added explicit `width`/`height` props to all `<Image />` components (SpeakerCard: 120×120, SpeakerProfile: 170×170, ScheduleEntry thumbnails: 50×50, WorkshopEntry instructor: 170×170).
14. **Sponsors double CTA:** Fixed — `sponsorCtaHtml` now renders once (inside sponsor tiers block or as empty state, not both).

### Config Restructuring

15. **Moved `siteConfig` to `src/config.ts`:** The `siteConfig` object (site title, description, baseUrl, ogImage, logo, eventStatus, nav) now lives at `src/config.ts` instead of `src/data/config.ts`. This keeps the core site configuration at the source root for easy access.
16. **Extracted content to `src/data/content.toml`:** All non-structural configuration (hero text, ticket copy, code of conduct, sponsor CTA, footer details) moved from TypeScript to `src/data/content.toml`. Components import the TOML file and cast via `ContentData` interface. This separates content from code, making it easier for non-developers to edit copy.
17. **Deleted `src/data/config.ts`:** The old monolithic config file was removed. All imports across components and pages updated to use `src/config.ts` for `siteConfig` and `src/data/content.toml` for content data.

### Biome Lint Fix

18. **Replaced `Record<string, any>` with `ContentData` interface:** Biome's `noExplicitAny` rule flagged all TOML content casts using `Record<string, any>`. Added a `ContentData` interface to `src/types.ts` with fully typed sections (hero, tickets, codeOfConduct, sponsors, footer). All 10 affected files now use `contentRaw as unknown as ContentData` instead.

### Code Review Refactors (DRY + Structure)

19. **Centralized TOML data loading into `src/lib/data.ts`:** All TOML imports and `as unknown as` casts now happen once in `src/lib/data.ts`. Components and pages import typed, ready-to-use exports (`content`, `speakers`, `schedule`, `sponsors`, `workshops`) instead of repeating the import-cast-destructure boilerplate. Eliminated ~7 duplicate import blocks across the codebase.

20. **Centralized speaker image utilities into `src/lib/images.ts`:** The `getSpeakerImage` helper (previously copy-pasted into 4 components) and the `import.meta.glob` speaker image glob (previously duplicated across 4 pages) now live in a single module. Exports `resolveSpeakerImage` (throws on missing — for required images), `findSpeakerImage` (returns null — for optional images), `speakerImages` (the glob result), and `ImageMap` type.

21. **Exported `isLive`/`isArchived` from `src/config.ts`:** Derived booleans `isLive` and `isArchived` are now exported alongside `siteConfig`, replacing 9 scattered `siteConfig.eventStatus === "..."` comparisons across components and pages.

22. **Extracted `ComingSoon.astro` component:** The "coming soon / follow us on Twitter" empty-state pattern (previously copy-pasted in 4 pages) is now a single component accepting a `message` prop.

23. **Extracted `TicketCta.astro` component:** The "Get your ticket →" CTA block (previously copy-pasted verbatim in 3 sub-pages) is now a single component that self-manages its `isLive` visibility check.

24. **Moved landing-page-only components to `src/components/index/`:** Hero, VenueInfo, SpeakerCard, Sponsors, Tickets, and CodeOfConduct — all used exclusively by `index.astro` — moved into a dedicated subfolder to reduce clutter in the shared components directory.

25. **Removed obvious HTML comments:** Deleted self-evident comments like `<!-- Circular photo -->`, `<!-- Info -->`, `<!-- Speaker thumbnails -->`, `<!-- Instructor -->`, `<!-- Venue -->`, `<!-- Conference -->`, `<!-- Workshops -->`, `<!-- Speakers Section -->` from component templates.

26. **Restored `execCommand` clipboard fallback:** The copy-link `is:inline` script in BaseLayout now uses `navigator.clipboard.writeText()` with a `document.execCommand('copy')` textarea fallback for non-secure contexts. The script is marked `is:inline` to run as a classic script (not an Astro module), ensuring reliable event delegation across all pages.

27. **Added `@` path alias:** `tsconfig.json` now maps `@/*` to `src/*`. All relative imports across the codebase updated to use `@/` prefix (e.g., `import { content } from "@/lib/data"`), eliminating fragile `../../` chains especially in the `components/index/` subfolder.
