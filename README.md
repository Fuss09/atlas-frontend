# Atlas Frontend

Market Intelligence UI — Next.js 15 · React 19 · TypeScript · TailwindCSS · shadcn/ui

Built against the Atlas backend (Modules 01–07): auth, companies, themes, events,
opportunity scores, and the knowledge graph.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript (strict) |
| Styling | TailwindCSS + custom design tokens |
| Components | shadcn/ui-style primitives (Radix UI under the hood) |
| Data fetching | TanStack Query v5 |
| HTTP client | Axios (with auth + refresh-token interceptors) |
| Icons | Lucide |
| Charts | Recharts (installed, not yet used — reserved for score history, see Roadmap) |
| Knowledge Graph | d3-force, d3-zoom, d3-drag, d3-selection (granular modules, not the full d3 bundle) — Canvas rendering |
| Command palette | cmdk |
| Theming | next-themes (dark mode default) |

---

## Getting started

Atlas is split across two repositories — this one (frontend) and `atlas`
(backend). Running the product locally means starting both.

### 1. Start the backend first

Full instructions live in the `atlas` repo's own README, but the short
version:

```bash
# in the atlas (backend) repo
docker compose up -d
docker compose exec backend alembic upgrade head
docker compose exec backend python -m scripts.seed_demo   # optional but recommended
```

The last step loads a small, realistic demo dataset — 10 companies
across AI, Quantum Computing, Biotech, and Energy, with events, themes,
discovery sources, graph relations, and real computed Opportunity
Scores — so every page in this frontend has something meaningful to
show without connecting a real external data source. Skip it only if
you're pointing this frontend at a backend that already has real data.

Confirm the backend is actually serving data before moving on:

```bash
curl http://localhost:8000/api/v1/companies
```

If that returns an empty `items` array, the seed step above either
didn't run or didn't run against the database this backend is
connected to — see that repo's Troubleshooting section.

### 2. Start this frontend

```bash
npm install
cp .env.example .env.local
# edit .env.local if your backend isn't at the default http://localhost:8000

npm run dev
```

Open `http://localhost:3000` — it redirects to `/dashboard`. With the
demo dataset loaded, you should immediately see populated Top
Opportunities, Latest Discoveries, Popular Themes, and Latest Events
sections.

### Other commands

```bash
npm run build        # production build
npm run start         # serve the production build
npm run lint           # eslint
npm run type-check     # tsc --noEmit
```

---

## Project structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── dashboard/                # Server Component — see "Data fetching" below
│   ├── explorer/                # Netflix/Spotify-style category browsing
│   ├── companies/
│   │   ├── page.tsx              # Server Component, URL-driven search/filter/sort/paginate
│   │   └── [slug]/
│   │       ├── page.tsx          # Company detail (tabs: Overview/Events/Themes/Relations/Sources)
│   │       └── graph/            # Company-centered relationship graph
│   ├── themes/[slug]/
│   ├── opportunities/            # Ranked Opportunity Score list
│   ├── events/                   # Global event feed
│   ├── graph/                    # Free graph exploration
│   ├── discovery/                # Collector status + job history
│   ├── settings/
│   ├── login/
│   ├── layout.tsx                # Root layout, providers, dark mode default
│   ├── loading.tsx / global-error.tsx / not-found.tsx
│
├── components/
│   ├── ui/                       # Design system primitives (Button, Card, Dialog, Select…)
│   ├── layout/                   # Sidebar, Header, CommandPalette (⌘K), MobileNav
│   ├── shared/                   # ScoreBadge, ScoreSummary, AtlasInsight, WatchlistButton,
│   │                               NotificationBell, EmptyState (empty AND error variants —
│   │                               see below), ErrorState, ErrorBoundary, CompanyLogo
│   ├── company/                  # CompanyCard, CompanyHeader, StatBar, ScoreBreakdown,
│   │                               CompanyTabs, tabs/ (Overview/Events/Themes/Relations/
│   │                               Sources), CompaniesFilters + CompaniesResults +
│   │                               CompaniesPagination (URL-driven search, see below)
│   ├── theme/                    # ThemeCard, ThemeHeader, ThemesMaturityFilter,
│   │                               GroupedThemes, ThemeCompaniesResults
│   ├── event/                    # EventCard, EventTypeIcon, ImportanceBadge,
│   │                               EventsFilters + EventsResults (URL-driven, see below)
│   ├── opportunity/               # OpportunityCard, OpportunitiesFilters + OpportunitiesResults,
│   │                               ScoreExplainerBanner
│   ├── graph/                    # RelationCard, RelationDetailPanel — plus the real graph
│   │                               engine: GraphCanvas (Canvas + d3-force/d3-zoom/d3-drag),
│   │                               GraphControls, GraphSearch, CompanyGraphShell,
│   │                               FreeGraphExplorer (see "Feature placeholders" below)
│   ├── explorer/                  # Category browsing grid (reads live theme color/icon/count
│   │                               from the API — no hardcoded category config, see below)
│   ├── discovery/                 # DiscoveryJobCard, SourceBadge
│   ├── dashboard/                 # SinceLastVisit (client) + 4 Server Component sections:
│   │                               TopOpportunitiesSection, LatestDiscoveriesSection,
│   │                               PopularThemesSection, LatestEventsSection
│   ├── auth/                      # LoginForm
│   ├── settings/                  # SettingsContent
│   └── providers/                 # QueryProvider, ThemeProvider, ToastProvider
│
├── hooks/                        # One hook module per API domain (TanStack Query) —
│                                    used by Client Components that need interactive,
│                                    re-fetchable data (search, mutations, graph exploration),
│                                    plus useForceSimulation (owns the d3-force lifecycle)
├── lib/
│   ├── api/
│   │   ├── client.ts              # Axios instance — Client Components (auth, mutations)
│   │   ├── server.ts               # server-only fetch layer — Server Components
│   │   ├── server-data.ts          # One function per page's server data need
│   │   └── companies.ts, events.ts, …  # Domain modules used by the Axios client
│   ├── query-keys.ts               # Centralized cache keys
│   ├── format.ts                  # Number/date/currency formatting
│   ├── utils.ts                    # cn() class merger
│   ├── nav-config.ts               # Sidebar navigation source of truth
│   ├── theme-icon.ts               # Shared kebab-case-to-Lucide-icon resolver
│   ├── entity-color.ts             # Per-entity-type color palette for the graph canvas
│   └── graph-data.ts               # Builds a connected multi-level graph (nodes/edges) from
│                                      the API's relations + neighbors response
├── types/                        # TypeScript types mirroring every backend schema
└── styles/globals.css             # Design tokens (dark mode default, light mode available)
```

---

## Data fetching: Server Components vs Client Components

Sprint 2 introduces a deliberate split, used consistently across the app:

**Server Components** (`lib/api/server.ts` + `lib/api/server-data.ts`) —
used wherever the data is public, read-only, and benefits from rendering
as HTML before any JS runs:

- `/dashboard` — every section (Top Opportunities, Latest Discoveries,
  Popular Themes, Latest Events) is its own `async` Server Component,
  each wrapped in its own `<Suspense>` boundary in `app/dashboard/page.tsx`.
  A slow or failing section never blocks the others — they stream in
  independently. Each section sets its own `revalidate` window (15–60s)
  matching how fast that data actually changes.
- `/companies` — the entire search experience (query, sector/country
  filters, sort, pagination) is driven by the URL's `searchParams`, not
  React state. `CompaniesResults` is an `async` Server Component that
  fetches exactly one page of results per request. This is what keeps the
  page fast at scale: with tens of thousands of companies, the client
  never holds more than one page (24 items) in memory, pagination is a
  real `router.push` to `?page=N` (bookmarkable, shareable, correct
  back-button behavior), and the initial page load ships fully-rendered
  HTML with no client-side fetch waterfall.

**Client Components** (`lib/api/client.ts` + `hooks/*`, via TanStack
Query) — used wherever the UI needs to be interactive beyond URL state:

- Authenticated flows (login, mutations: creating events, triggering
  discovery jobs, associating companies with themes)
- `SinceLastVisit` — depends on `localStorage`, browser-only by definition
- The entire Knowledge Graph (`GraphCanvas` and everything around it) —
  a Canvas-based physics simulation with zoom/pan/drag is inherently a
  client-side rendering concern, no Server Component equivalent exists
- `GraphSearch`'s live company search-as-you-type
- The Command Palette (⌘K)

Both layers share the same `src/types/*` definitions, so a type never
drifts between the two fetch paths.

### Why this split matters at scale

The instruction to keep Atlas "fluid with tens of thousands of companies"
is primarily a data-fetching and pagination discipline, not a rendering
trick:

- **`CompaniesPagination` is windowed** — it never renders more than ~7
  page buttons regardless of `totalPages`, so 40,000 companies at 24/page
  (1,667 pages) costs the same DOM weight as 100 companies.
- **No unbounded fetches.** Every list call sets an explicit `page_size`
  server-side; nothing in the app fetches "all companies" into memory.
- **Filter changes reset pagination** (`CompaniesFilters` strips `?page=`
  on every filter change) so users can't land on an empty out-of-range
  page after narrowing a search.
- **`fetchSectors()` / `fetchCountries()`** — used to populate filter
  dropdowns — cache for 5 minutes server-side (`revalidate: 300`), since
  the set of distinct sectors/countries changes far less often than the
  company list itself.

---

## Design system

Full reference: see the validated UX/UI document (Atlas Phase 2). Summary:

- **Dark mode by default.** Light mode available via Settings or the header toggle.
- **Color is never the only signal.** Every colored badge carries a text label
  (conviction level, importance, status) — accessibility and the "never a black
  box" principle both depend on this.
- **One accent color** (indigo, `#6366F1`), used sparingly.
- **Inter / JetBrains Mono** font stack — falls back to system fonts if
  `next/font`'s Google Fonts fetch is unavailable in your build environment
  (see note below).
- Spacing, radii, shadows, and animation durations are all defined as Tailwind
  theme tokens in `tailwind.config.ts` — no magic numbers in components.

### Note on fonts

This project ships with system-font fallbacks (`--font-inter`,
`--font-jetbrains-mono` CSS variables) instead of `next/font/google` imports,
because some build/sandbox environments cannot reach `fonts.googleapis.com`.
If your deployment environment has outbound network access, you can restore
Google-hosted Inter/JetBrains Mono by editing `src/app/layout.tsx` — the
Tailwind config already expects those two CSS variables, so no other change
is required.

---

## API integration

All backend calls go through `src/lib/api/client.ts`, an Axios instance that:

- Prefixes every request with `NEXT_PUBLIC_API_URL + /api/v1`
- Attaches the stored JWT access token to every request
- Silently refreshes the access token on a 401 (queuing concurrent requests
  during the refresh) and redirects to `/login` if the refresh itself fails
- Normalizes every failure — network errors, validation errors, and backend
  error envelopes — into a single `ApiError` class with `.message`, `.code`,
  `.status`, and `.details`

Every domain (`companies`, `themes`, `events`, `opportunities`, `graph`,
`discovery`, `auth`) has its own API module in `src/lib/api/` and its own hook
module in `src/hooks/`, each backed by centralized query keys in
`src/lib/query-keys.ts` for predictable cache invalidation.

### Error handling

- `ErrorState` — consistent inline/full error UI for any failed query, with
  a retry button when applicable. Distinguishes network errors from API
  errors.
- `ErrorBoundary` — top-level safety net for genuine React render crashes
  (not query errors, which `ErrorState` already handles).
- `global-error.tsx` / route-level `error.tsx` — Next.js App Router
  conventions for unrecoverable render failures.
- `not-found.tsx` — Atlas-styled 404.

### Loading states

Every list, card grid, and detail view has a `Skeleton`-based loading state
matching its final layout — no full-page spinners. `TanStack Query`'s
`placeholderData` keeps previous results visible (dimmed) while filters or
pagination change, avoiding layout flicker.

---

## Feature placeholders (intentional, not bugs)

Two UI surfaces are wired for future features that don't have a backend
yet. Both are deliberately honest about not persisting anything — the
tooltip says so — rather than silently simulating a feature that isn't
really there:

- **`WatchlistButton`** — an interactive star toggle with local
  component state; no `/watchlist` endpoint exists yet, and its tooltip
  says so ("Watchlist — coming soon" / "Removed (not saved yet)").
  Wiring a real mutation later requires no layout change.
- **`NotificationBell`** — renders with an unread-count dot; no
  notifications backend exists yet, tooltip reads "Notifications —
  coming soon."
- **`AtlasInsight`** — reserved card on the Company Page for future
  AI-generated analysis; shows an explicit "Coming soon" badge rather
  than empty or placeholder content.

The **Knowledge Graph** (`/companies/[slug]/graph` and `/graph`) is not
a placeholder — it's a fully real, interactive force-directed graph as
of Sprint 5 (`GraphCanvas`, driven by d3-force/d3-zoom/d3-drag): zoom,
pan, drag-to-reposition, click-to-recenter, hover-to-highlight, depth
1/2/3, relation-type filtering, and a full explainability panel per
selected edge.

---

## Responsive behavior

- **Desktop (≥1280px):** full sidebar (collapsible), multi-column grids.
- **Tablet (768–1279px):** sidebar collapses to icon-only by default.
- **Mobile (<768px):** bottom tab bar (5 primary sections) replaces the
  sidebar; hamburger menu in the header covers the remaining sections; grids
  collapse to a single column.

---

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Atlas backend (Modules 01–07) | `http://localhost:8000` |

---

## Backend coordination

Atlas is split across two repositories: `atlas` (backend, source of truth
for the API) and `atlas-frontend` (this repo). Every backend change below
was made directly in the `atlas` repo, always backward-compatible —
omitting a new parameter always preserves prior behavior exactly, no
existing caller is ever affected.

- **Sprint 2** — `GET /companies` gained `?sort=` (relevance/name/
  market_cap/score/founded/recently_updated).
- **Sprint 4** — `GET /opportunities` gained `?sort=`, plus
  sector/country/theme_id filters; `OpportunityListItem` gained
  `company_slug` (a company row's link to its profile 404'd before this
  fix), `company_sector`, `company_country`, `company_logo_url`.
- **Sprint 5** — `NeighborResponse` (the Knowledge Graph's depth-2/3
  traversal result) gained `via_entity_type`/`via_entity_id`/
  `via_relation_id` — without this, a graph request beyond depth 1
  couldn't render anything but a flat fan around the center, since there
  was no way to know which node a given neighbor actually connects
  through. `GET /events` gained `?q=` text search; `EventListItem`
  gained `company_name`/`company_slug`/`company_ticker` (the global
  Events feed's company links 404'd before this fix, same class of bug
  as the Sprint 4 Opportunities one).
- **Sprint 6** — new `scripts/seed_demo.py` in the backend repo: a
  realistic demo dataset (10 companies, 32 events, 8 graph relations
  across AI/Quantum/Biotech/Energy) so this frontend has something
  meaningful to render without any real external data source connected.
  Not an API change — a one-time data-loading script, documented in
  both repos' READMEs.

Any future frontend sprint that needs a backend capability that doesn't
exist yet will be called out explicitly rather than worked around
client-side, per the "no black box" principle governing the whole
product. Several of the fixes above (company_slug, EventListItem's
company fields) were caught specifically because a frontend sprint
wired a page against the backend's *actual* schema instead of the
assumption a prior sprint had made — worth keeping in mind before
trusting a `src/types/*` file without checking it against the real
Pydantic schema when something doesn't render as expected.

---

## Troubleshooting

**Every page shows empty states — "No companies found", "No
opportunities yet", etc.**
The frontend is reaching the backend fine, but the backend has no data.
Load the demo dataset (see "Getting started" above), or confirm you're
pointed at the right backend if you expected real data:
`curl $NEXT_PUBLIC_API_URL/api/v1/companies`.

**Pages fail to load entirely, or you see "Cannot reach Atlas API" /
"Connection lost"**
`NEXT_PUBLIC_API_URL` (in `.env.local`) doesn't match a running backend.
Confirm the backend is up (`curl http://localhost:8000/health`) and that
the URL in `.env.local` has no trailing slash and includes the protocol
(`http://`, not just `localhost:8000`).

**Changed `.env.local` but the app still points at the old URL**
Next.js only reads `NEXT_PUBLIC_*` variables at build/start time — stop
`npm run dev`, restart it. A hard browser refresh alone won't pick up
the change.

**`npm run build` or `npm run dev` fails after pulling new changes**
Dependencies likely changed. Run `rm -rf node_modules package-lock.json
&& npm install` and retry. If `.next/` is in a bad state after an
interrupted build, `rm -rf .next` first.

**Login redirects back to `/login` immediately after signing in**
Check the browser console for a CORS or network error — the backend's
`ENVIRONMENT`/CORS configuration must allow requests from
`http://localhost:3000` in local development. Most of Atlas (Dashboard,
Companies, Opportunities, Themes, Events, Graph) doesn't require being
signed in at all; only Settings and admin actions do.

**Knowledge Graph page is blank or shows no nodes**
The centered company has no relations yet. If you loaded the demo
dataset, open one of the 10 seeded companies (Nexora AI, Solstice
Quantum, Meridian Genomics, Solvane Energy, etc.) — those have real
graph relations. A company discovered but never linked to others will
correctly show an empty-relations state, not a bug.

**TypeScript or ESLint errors after editing a type in `src/types/`**
This project mirrors the backend's Pydantic schemas by hand (see
"API integration" above) — there's no code generation step. If you
changed a backend schema, the matching frontend type in `src/types/`
needs the identical manual update, or the two will silently drift
(exactly the class of bug documented throughout the Sprint changelogs
above).

---

## Roadmap

- **Sprint 1 (done)** — Foundations & Design System: layout, navigation,
  design tokens, UI primitives, full type layer, all 15 routes scaffolded.
- **Sprint 2 (done)** — Functional Dashboard & Companies: Server Component
  data fetching, URL-driven search/filter/sort/pagination, backend
  `?sort=` support added to `GET /companies`.
- **Sprint 3 (done)** — Company Detail as a Server Component end to end
  (379 kB → 212 kB First Load JS), Sources tab wired to the real
  `GET /companies/{id}/sources` endpoint, Overview tab answering all
  four "why does this matter" questions on one screen.
- **Sprint 4 (done)** — Explorer and Opportunities made real (no more
  hardcoded category colors/icons — read live from the API), global
  search debounced with a loading state. Corrected several type/field
  mismatches against the real backend contract discovered while wiring
  these pages (`ConvictionLevel`, `OpportunityScoreResponse`,
  `OpportunityListItem`) that had gone unnoticed since Sprint 1–2.
  Backend gained `?sort=` on `GET /opportunities`, sector/country/theme
  filters, and `company_slug` on `OpportunityListItem` (linking to a
  company from an opportunity row 404'd before this fix).
- **Sprint 5 (done)** — Real interactive Knowledge Graph (Canvas +
  d3-force + d3-zoom/d3-drag: zoom, pan, drag-to-reposition, click to
  recenter, hover to highlight), upgraded Relations tab (grouping,
  confidence, weight, search, filters, sort), unified Timeline across
  every event type. Backend gained `via_entity_type/via_entity_id/
  via_relation_id` on `NeighborResponse` so a depth-2/3 graph renders a
  real connected structure instead of a flat fan around the center.
  Converted the last fully-client list page (`/events`) to the Server
  Component pattern.
- **Sprint 6 (done)** — Stabilization pass for a testable V1: merged
  the accidentally-duplicated `EmptyState`/`SectionFallback` components
  into one, audited and fixed empty-state icon/copy consistency across
  every list and detail view (a distinct `SearchX` icon for "filtered
  down to nothing" vs. a domain icon for "genuinely nothing here yet"),
  made the Watchlist/Notifications placeholders explicitly honest about
  not persisting yet rather than silently simulating a feature that
  isn't there. New backend demo dataset (`scripts/seed_demo.py`, atlas
  repo) — 10 companies across AI/Quantum/Biotech/Energy, 32 events, 8
  graph relations, real computed Opportunity Scores — so Atlas is
  explorable end-to-end without any external data source connected.
  README overhauled on both repos with a combined launch sequence and
  troubleshooting sections.

See each sprint's commit message in `git log` for full implementation
detail — this summary intentionally stays high-level.

### What's next

With a stable, testable V1 in place, the natural next layer of value is
making the placeholders real, roughly in this order:

1. **Watchlist backend** — the UI (`WatchlistButton`) has been
   feature-complete since Sprint 1; wiring `POST/DELETE /watchlist`
   plus a `/watchlist` page is now the highest-leverage next step,
   since Dashboard/Companies/Opportunities are all real enough that
   "companies I'm tracking" is a meaningfully different, valuable view.
2. **Opportunity score history** — `ScoreSummary`'s "+9 this week" delta
   claim is still typed as optional/absent because there's no backend
   endpoint to source it from. Needs a short backend scoping
   conversation (likely a lightweight score-snapshot table written on
   each `recompute()`) before frontend work starts.
3. **Notifications backend** — same shape of work as Watchlist: the
   `NotificationBell` UI slot has existed since Sprint 1.
4. **Real AI analysis** (`AtlasInsight`) — the reserved slot on the
   Company Page has been visually final since Sprint 1; this is
   explicitly the largest and most architecturally separate piece of
   remaining work (a real analysis pipeline, not just an endpoint), and
   should be scoped as its own multi-sprint effort rather than folded
   into a stabilization pass.

Items 1 and 3 are similar in shape and could reasonably be combined
into one sprint. Item 2 is small once scoped. Item 4 is deliberately
last — it depends on nothing above it, but is the one piece of work
that most changes what Atlas fundamentally does, so it deserves to be
tackled once everything else is solid rather than rushed alongside
smaller fixes.
