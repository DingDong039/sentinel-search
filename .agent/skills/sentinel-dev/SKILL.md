---
name: sentinel-dev
description: definitive guide for developing features in the Sentinel Search project, enforcing FSD architecture, Next.js 16 patterns, and Premium UI standards.
---

# Sentinel Search Development Skill

This skill allows you to expertly navigate and contribute to the Sentinel Search project. It encapsulates the specific architectural decisions (FSD), technology stack choices (Next.js 16, Tailwind v4), and design standards (Premium Dark) used in this codebase.

## 1. Technology Stack & Environment

- **Core Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
  - Uses `@theme` and `@import "tailwindcss"` in `globals.css`
  - Uses **OKLCH** color space for perceptible uniformity
  - **NO** `tailwind.config.ts` (CSS-centric configuration)
- **UI Library**: Shadcn UI (Atomic, accessible)
- **Data & Backend**:
  - **Supabase**: Authentication & Database
  - **Firecrawl**: Web Scraping & Search Intelligence
- **State Management**: React Server Actions (Data Fetching), Local State (UI)

## 2. Architecture: Feature-Sliced Design (FSD)

We strictly follow FSD. Do NOT create chaotic folder structures. Code must be organized into these layers (ordered by scope):

1.  **`src/app`**: (App Layer) Global entry points, providers, styles, and routing (`page.tsx`, `layout.tsx`).
2.  **`src/pages`**: (Pages Layer) Composition of Widgets to form full pages. _(Note: Next.js App Router uses `app` dir for routing, so this layer is often virtual or used for specific page components if needed, but currently we map `app` routes directly to Widget compositions)_.
3.  **`src/widgets`**: (Widgets Layer) Big standalone UI chunks (e.g., `Sidebar`, `Dashboard`, `MainLayout`). Composed of Features and Entities.
4.  **`src/features`**: (Features Layer) User interactions that bring value (e.g., `JobSearch`, `ProductFilter`).
5.  **`src/entities`**: (Entities Layer) Domain business logic and UI (e.g., `JobCard`, `ProductModel`).
6.  **`src/shared`**: (Shared Layer) Reusable primitives.
    - `shared/ui`: Shadcn components (Button, Card, Input).
    - `shared/api`: API clients and Services (`JobService`, `ProductService`).
    - `shared/lib`: Utils (`cn`, `formatDate`).

### Rules of Dependency

- **Lower layers (Shared) cannot import from Higher layers (Widgets).**
- **Linear Flow**: App -> Widgets -> Features -> Entities -> Shared.

## 3. UI/UX Standards: Premium Dark Editorial

The "Sentinel" aesthetic is critical.

- **Visuals**: Glassmorphism (`backdrop-blur`), subtle gradients (`bg-linear-to-*`), and deep dark backgrounds used via OKLCH variables.
- **Interaction**: Micro-animations using `framer-motion` are mandatory for high-value interactions.
- **Typography**: Clean, sans-serif, high-legibility.

## 4. Workflows

### A. Adding a New Feature (e.g., "Stock Monitor")

1.  **Define Entity**: Create `src/entities/stock/` (model, types, basic UI card).
2.  **Create Feature**: Create `src/features/stock-monitor/` (search logic, filter logic).
3.  **Compose Widget**: Add to `src/widgets/dashboard/` or create `src/widgets/stock-panel/`.
4.  **Integrate**: Add to `src/app/page.tsx` or relevant route.

### B. Using Firecrawl (Scraping/Search)

- **Server Actions**: ALWAYS use Server Actions (`src/app/actions.ts`) to call Firecrawl SDK.
- **Service Layer**: Wrap logic in `src/shared/api/services/` (e.g., `StockService.ts`).
- **Type Safety**: Firecrawl often returns `any`. You MUST type-cast or validate results in the Service layer before returning to the UI.

### C. Styling with Tailwind v4

- **Do not** look for `tailwind.config.ts`.
- Edit **`src/app/globals.css`** for theme variables or `@theme` directives.
- Use `oklch()` for defining new colors if needed.

## 5. Deployment & Build

- Run `npm run build` to verify standard Next.js build.
- Ensure all environment variables (`FIRECRAWL_API_KEY`, Supabase keys) are set.
- **Security Note**: `FIRECRAWL_API_KEY` must NOT have `NEXT_PUBLIC_` prefix to prevent client-side exposure.
