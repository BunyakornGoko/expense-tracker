# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `pnpm dev` — start dev server
- `pnpm build` / `pnpm start` — production build and serve (build uses `output: 'standalone'`, see `next.config.mjs`)
- No `lint` script and no ESLint config exist in this repo — don't assume one.
- **Tests**: one file, `lib/parse-slip.test.ts`, using node's built-in `node:test`. There is no `test` script, and running it naively (`node --test lib/parse-slip.test.ts`) fails: Node's ESM loader (unlike Next's `moduleResolution: "bundler"`) doesn't resolve extensionless relative imports, and this file's whole import chain (`parse-slip.ts` → `transactions.ts`) omits extensions. To actually run it, add `.ts` to every relative import in that chain first (or run through a resolver like `tsx`/`ts-node`, neither of which is installed) — don't report the test as passing/failing based on the bare command.

## Architecture

**Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn (`style: base-nova`, see `components.json`). MongoDB (native driver, no ODM) for storage. All UI copy is Thai.

**Auth**: Custom, not a library. `lib/session.ts` signs/verifies a JWT (via `jose`) carrying `{id, email, name}`. `lib/auth-cookies.ts` wraps that as an httpOnly `session` cookie. `middleware.ts` is the single gate: it verifies the cookie on every request except `/login`, `/register`, `/api/auth/*`, and static assets, redirecting unauthenticated page requests to `/login` and returning 401 JSON for unauthenticated `/api/*` requests. Route handlers still call `getSession()` themselves before touching data — middleware isn't trusted as the only check. Passwords hashed with `bcryptjs` (`lib/users.ts`).

**Data layer**: `lib/mongodb.ts` caches a single `MongoClient` on `global` (survives dev hot-reload and serverless re-invocation). `lib/transactions-store.ts` is the only place that touches the `transactions` collection — it stores `amount` as BSON `Double` (to avoid Mongo silently switching to `Int32`/`Long`) and converts to `number` on read, and it scopes every query by `userId` for isolation between users. `lib/transactions.ts` (no store/DB access) holds the plain `Transaction` type plus pure formatting/aggregation helpers (month grouping, Thai date labels, percent-change math) shared by server and client.

**Client state**: no global store. `components/dashboard.tsx` is the single client-side owner of transaction state (seeded from a server-rendered `initialTransactions` prop in `app/page.tsx`); mutations go through `lib/api-client.ts` (`apiPost`/`apiPatch`/`apiDelete`, a thin `fetch` wrapper returning `{ok, data|error}`) and then merge the response into local state — never a full refetch.

**Slip-import (OCR) pipeline**: a distinct flow from the main CRUD API, triggered via the PWA `share_target` in `app/manifest.ts` (Android/iOS "Share to app" from a photo). `app/share-slip/route.ts` receives the multipart image, preprocesses it with `sharp` (grayscale/contrast/sharpen — measurably improves OCR on pastel bank-slip screenshots), runs `tesseract.js` (`tha+eng`), and hands the raw OCR text to `lib/parse-slip.ts` to extract amount/date/recipient via regex heuristics tuned against real, noisy OCR dumps (see the test file for actual examples). This route always redirects (303, relative `Location` — required behind the Caddy proxy, see comment in that file) rather than returning JSON, since it's a form POST from the OS share sheet, not an XHR call. `getWorker()` memoizes one tesseract worker for the process lifetime (this app runs on a long-lived Docker/VM process, not serverless) and is dropped and recreated on failure.

**Deployment**: Docker multi-stage build → `node:22-alpine`, output copied from `.next/standalone`. `tesseract.js`/`tesseract.js-core` are excluded from Next's file tracing (`serverExternalPackages` in `next.config.mjs`) because their worker script loads deps via `worker_threads` at runtime, invisible to static tracing — the Dockerfile compensates by shipping the full `node_modules` from the `deps` stage rather than the pruned standalone one. `docker-compose.yml` runs the app behind a Caddy reverse proxy (`Caddyfile`) for TLS.
