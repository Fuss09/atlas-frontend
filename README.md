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
| Charts | Recharts (wired for Sprint 2+) |
| Command palette | cmdk |
| Theming | next-themes (dark mode default) |

---

## Getting started

```bash
npm install
cp .env.example .env.local
# edit .env.local — point NEXT_PUBLIC_API_URL at your running Atlas backend

npm run dev
```

App runs at `http://localhost:3000`. It expects the Atlas backend (Modules 01–07)
running at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).

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
│   ├── dashboard/
│   ├── explorer/                # Netflix/Spotify-style category browsing
│   ├── companies/
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
│   │                               NotificationBell, EmptyState, ErrorState, ErrorBoundary
│   ├── company/                  # CompanyCard, CompanyHeader, StatBar, ScoreBreakdown, tabs/
│   ├── theme/                    # ThemeCard, ThemesExplorer, ThemePageContent
│   ├── event/                    # EventCard, EventTypeIcon, ImportanceBadge, EventsExplorer
│   ├── opportunity/               # OpportunityCard, OpportunitiesExplorer
│   ├── graph/                    # RelationCard, RelationDetailPanel, SimpleGraphCanvas
│   ├── explorer/                  # Category browsing grid
│   ├── discovery/                 # DiscoveryJobCard
│   ├── dashboard/                 # SinceLastVisit, DashboardContent
│   ├── auth/                      # LoginForm
│   └── providers/                 # QueryProvider, ThemeProvider, ToastProvider
│
├── hooks/                        # One hook module per API domain (TanStack Query)
├── lib/
│   ├── api/                      # Axios client + one module per backend Module (companies.ts, events.ts…)
│   ├── query-keys.ts               # Centralized cache keys
│   ├── format.ts                  # Number/date/currency formatting
│   ├── utils.ts                    # cn() class merger
│   ├── nav-config.ts               # Sidebar navigation source of truth
│   └── explorer-categories.ts      # Explorer's 10 discovery categories → Theme slugs
├── types/                        # TypeScript types mirroring every backend schema
└── styles/globals.css             # Design tokens (dark mode default, light mode available)
```

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

Per the validated product spec, three UI surfaces are wired for future
features that don't have a backend yet:

- **`WatchlistButton`** — fully interactive star toggle with local state;
  no `/watchlist` endpoint exists yet. Wiring a real mutation later requires
  no layout change.
- **`NotificationBell`** — renders with an unread-count dot; no notifications
  backend exists yet.
- **`AtlasInsight`** — reserved card on the Company Page for future
  AI-generated analysis; currently shows an explanatory "Coming soon" state.

The **Knowledge Graph visualization** on `/companies/[slug]/graph` and
`/graph` uses a simplified radial SVG layout for Sprint 1 (see
`SimpleGraphCanvas`). It already implements the validated interaction model
(select a relation → explainability panel with type, confidence, weight, and
source) — only the rendering engine itself is scheduled to be upgraded to a
full force-directed layout in Sprint 6, per the frontend roadmap.

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

## Roadmap

This is **Sprint 1** of the frontend roadmap (Foundations & Design System).
See the validated UX/UI reference document for Sprints 2–8:

2. Companies (read) · 3. Themes & Events · 4. Dashboard & Opportunities ·
5. Write & Admin flows · 6. Knowledge Graph (full force-directed engine) ·
7. Responsive & Polish · 8. Final product polish.
