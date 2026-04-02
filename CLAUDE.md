# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint across the project
- `npm run preview` — Preview production build locally

## Tech Stack

- **React 18** with **TypeScript** (strict mode), built with **Vite**
- **React Router DOM v7** for routing
- **Tailwind CSS** for styling (utility-first, no component-scoped CSS)
- **react-toastify** for toast notifications
- Session-based auth via JSESSIONID cookies (backend at `localhost:8080`)

## Architecture

This is a Japanese construction/maintenance proposal form system (保全依頼フォーム).

**Routing & Auth**: `App.tsx` defines all routes. Two guard components wrap protected pages:
- `ProtectedRoute` — redirects unauthenticated users to `/login`
- `ForceChangePasswordRoute` — redirects users who must change password to `/change-password`

Auth state lives in `AuthContext` (React Context), providing `login`, `logout`, `refresh`, and `mustChangePassword` state. No external state management library is used.

**Pages** (`src/pages/`): Each page is a route target that manages its own local state, fetches data via API modules in `useEffect`, and renders inside `AppPageLayout`.

**Form system** (`src/components/eizen/`): `EizenRequestAllInOnePage` is a large multi-section form composed of 8+ sub-section components. Form state is centralized via `useState` in the parent. Submission builds a JSON payload + `FormData` for multipart file uploads (see `src/form/payload_multipart.ts`).

**API layer** (`src/form/api.ts`): Generic `request<T>()` fetch wrapper with `credentials: "include"`. Separate `postMultipart`/`putMultipart` helpers for file uploads. List page APIs in `src/api/` currently return dummy data from `src/data/dummyData.ts`.

**Layout**: `AppPageLayout` wraps all authenticated pages with `CommonSideMenu` (navigation) and `PageHeader`. List pages use `ListToolbar` for filters/search.

## Conventions

- All UI text is in Japanese
- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` enforced
- No path aliases — use relative imports
- Tailwind classes inline; shared form styles in `src/components/eizen/EizenFormStyles.ts`
- Form types defined in `src/form/formTypes.ts` and `src/components/eizen/EizenFormTypes.ts`
