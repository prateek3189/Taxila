---
title: 'Story 1.1 — Monorepo Scaffold & App Skeletons'
type: 'chore'
created: '2026-04-03'
status: 'done'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The project has no codebase. All three app surfaces (mobile, web, API) and two shared packages need a working, typed foundation before any feature work can begin.

**Approach:** Initialize a Turborepo + pnpm workspaces monorepo containing `apps/mobile` (Expo SDK 55 + NativeWind v5), `apps/web` (Vite + React TS + Tailwind CSS v4), `apps/api` (Express + TypeScript), `packages/shared-types`, and `packages/config` — each with TypeScript strict mode and a minimal health-check or placeholder screen.

## Boundaries & Constraints

**Always:**
- TypeScript `strict: true` in every `tsconfig.json`
- pnpm workspaces; Turborepo task orchestration
- `GET /health` on the API returns `{ success: true, data: { status: "ok" } }`
- All packages export from an `index.ts`; no barrel files with circular deps
- `pnpm turbo build` and `pnpm turbo type-check` must pass with zero errors across all workspaces

**Ask First:**
- If Expo SDK 55 CLI creates a version conflict with NativeWind v5 that requires downgrading either — halt and confirm before proceeding
- If Tailwind CSS v4 alpha/beta APIs differ significantly from v3 patterns — halt and confirm approach

**Never:**
- Do not implement any domain logic, auth, DB connections, or feature code in this story
- Do not create `.env` files with real secrets; use `.env.example` only
- Do not install `packages/config` env-validation Zod schema (Story 1.4's scope)
- Do not scaffold swagger, rate-limiting, or error middleware (Story 1.3's scope)

</frozen-after-approval>

## Code Map

- `package.json` (root) -- pnpm workspaces declaration + turbo scripts
- `pnpm-workspace.yaml` -- workspace glob patterns
- `turbo.json` -- pipeline: build, dev, type-check, test, lint
- `tsconfig.base.json` -- shared strict TS config extended by all apps
- `.npmrc` -- `shamefully-hoist=false`, `strict-peer-dependencies=false`
- `apps/api/` -- Express + TypeScript skeleton; `src/index.ts` entry
- `apps/web/` -- Vite + React TS skeleton; Tailwind CSS v4
- `apps/mobile/` -- Expo SDK 55 blank-typescript + NativeWind v5
- `packages/shared-types/` -- empty typed package, exports placeholder `AppVersion`
- `packages/config/` -- empty package, exports placeholder `appConfig` stub

## Tasks & Acceptance

**Execution:**
- [x] `package.json` (root) -- create with `name: "vital-track"`, `private: true`, scripts `dev/build/test/lint/type-check` all delegating to `turbo run`, and workspace package references -- root orchestration entry point
- [x] `pnpm-workspace.yaml` -- create with `packages: ["apps/*", "packages/*"]` -- workspace resolution
- [x] `turbo.json` -- create pipeline with tasks: `build` (depends on `^build`), `dev` (persistent, no cache), `type-check` (depends on `^type-check`), `test`, `lint` -- task orchestration
- [x] `tsconfig.base.json` -- create with `strict: true`, `esModuleInterop: true`, `skipLibCheck: true`, `moduleResolution: bundler` -- shared TS base
- [x] `.npmrc` -- create with `shamefully-hoist=false` and `strict-peer-dependencies=false` -- pnpm behaviour
- [x] `apps/api/package.json` -- create with `name: "@vital-track/api"`, deps: `express`, `helmet`; devDeps: `typescript`, `@types/express`, `@types/node`, `ts-node`, `nodemon` -- API package manifest
- [x] `apps/api/tsconfig.json` -- extend `../../tsconfig.base.json`, `outDir: dist`, `rootDir: src` -- API TS config
- [x] `apps/api/src/index.ts` -- create Express app listening on `PORT` env var (default 3000); mount `GET /health` returning `{ success: true, data: { status: "ok" } }`; export `app` for testing -- API entry point
- [x] `apps/api/nodemon.json` -- watch `src/**/*.ts`, exec `ts-node src/index.ts` -- dev hot-reload
- [x] `apps/web/package.json` -- create with `name: "@vital-track/web"`, Vite + React TS + Tailwind CSS v4 deps -- web package manifest
- [x] `apps/web/vite.config.ts` -- create minimal Vite config with React plugin -- web bundler config
- [x] `apps/web/src/App.tsx` -- create placeholder component rendering `<h1>vital-track web</h1>` with a Tailwind class -- confirms Tailwind CSS v4 wired correctly
- [x] `apps/web/src/main.tsx` -- create standard Vite React entry mounting `<App />` -- web entry
- [x] `apps/web/index.html` -- create Vite HTML shell -- web HTML entry
- [x] `apps/mobile/package.json` -- create with `name: "@vital-track/mobile"`, Expo SDK 55 deps + NativeWind v4.x (`nativewind@^4.1.23`, the Metro-based generation; architecture doc refers to this as "v5" but npm package is v4.x) -- mobile package manifest
- [x] `apps/mobile/app.json` -- create Expo config with `name: "vital-track"`, `slug: "vital-track"`, SDK version 55 -- Expo config
- [x] `apps/mobile/App.tsx` -- create root component rendering a `<Text className="text-blue-500">vital-track mobile</Text>` — confirms NativeWind v5 class parsing works -- mobile entry
- [x] `apps/mobile/tailwind.config.js` -- create NativeWind v5 Tailwind config with `content` pointing to `App.tsx` and `app/**/*.tsx` -- NativeWind config
- [x] `apps/mobile/babel.config.js` -- add `nativewind/babel` preset -- NativeWind babel transform
- [x] `apps/mobile/metro.config.js` -- create Metro config with NativeWind v5 `withNativeWind` wrapper -- Metro + NativeWind
- [x] `packages/shared-types/package.json` -- create with `name: "@vital-track/shared-types"`, `main: "dist/index.js"`, `types: "dist/index.d.ts"` -- shared types package manifest
- [x] `packages/shared-types/tsconfig.json` -- extend base, `declaration: true`, `outDir: dist` -- shared-types TS config
- [x] `packages/shared-types/src/index.ts` -- export `export const APP_VERSION = "0.1.0"` as placeholder; marks package as typed and buildable -- placeholder export
- [x] `packages/config/package.json` -- create with `name: "@vital-track/config"`, `main: "dist/index.js"` -- config package manifest
- [x] `packages/config/tsconfig.json` -- extend base, `declaration: true`, `outDir: dist` -- config TS config
- [x] `packages/config/src/index.ts` -- export `export const appConfig = { version: "0.1.0" }` as placeholder -- placeholder export
- [x] `.env.example` (root) -- create with `PORT=3000` and `NODE_ENV=development` as only entries -- env documentation

**Acceptance Criteria:**
- Given the repo is cloned and `pnpm install` is run, when the command completes, then all workspace dependencies resolve with zero errors
- Given `pnpm turbo build` is run, when it completes, then all apps and packages build successfully with zero TypeScript errors
- Given `pnpm turbo type-check` is run, when it completes, then zero type errors are reported across all workspaces
- Given `pnpm --filter api dev` is run, when the server starts, then `GET http://localhost:3000/health` returns `{ "success": true, "data": { "status": "ok" } }`
- Given `pnpm --filter web dev` is run, when the dev server starts, then the placeholder page renders at `localhost:5173` with no console errors
- Given the Expo app is opened, when it loads, then the blue text "vital-track mobile" renders, confirming NativeWind class resolution

## Design Notes

**NativeWind v4.x wiring** — The architecture doc calls this "v5" but the npm package is `nativewind@4.x` (the Metro-based generation). v4.x uses a Metro transform (not a Babel-only approach). `metro.config.js` must wrap the base Metro config with `withNativeWind({ input: './global.css' })` and a `global.css` importing `@tailwind base; @tailwind components; @tailwind utilities;` must be imported in `App.tsx`. Pairs with `tailwindcss@^3.4.x` (not v4).

**Tailwind CSS v4 on web** — v4 uses a Vite plugin (`@tailwindcss/vite`) instead of PostCSS config. `vite.config.ts` should import and register `tailwindcss()` from `@tailwindcss/vite`.

## Verification

**Commands:**
- `pnpm install` -- expected: zero errors, all workspaces linked
- `pnpm turbo type-check` -- expected: exits 0, no TypeScript errors
- `pnpm turbo build` -- expected: exits 0, `dist/` present in api, shared-types, config
- `curl http://localhost:3000/health` -- expected: `{"success":true,"data":{"status":"ok"}}`
- `pnpm --filter web dev` -- expected: Vite server starts, page loads at localhost:5173

## Spec Change Log

**Entry 1 — 2026-04-03**
- Triggering finding: Acceptance auditor flagged "NativeWind v5 required, v4.x installed" as CRITICAL.
- What was amended: Task description and Design Notes updated — "NativeWind v5" corrected to "NativeWind v4.x (`nativewind@^4.1.23`)". Architecture doc informally calls the Metro-based generation "v5" but the npm package is at v4.x; no v5 package exists on npm.
- Known-bad state avoided: Developer following spec literally would attempt `nativewind@5` which does not exist on npm.
- KEEP: All wiring is correct — metro.config.js withNativeWind, babel.config.js nativewind/babel, tailwind.config.js with nativewind/preset, global.css import in App.tsx, tailwindcss@^3.4.x on mobile. Do not change any of this.

## Suggested Review Order

**API entry point**

- Express app: health endpoint + envelope shape + named `app` export for testing
  [`index.ts:1`](../../apps/api/src/index.ts#L1)

**Monorepo orchestration**

- Root workspace declaration: scripts delegate to turbo, pnpm workspace glob
  [`package.json:1`](../../package.json#L1)

- Turbo pipeline: build/dev/type-check/test/lint tasks and dependency chain
  [`turbo.json:1`](../../turbo.json#L1)

- pnpm workspace glob resolution
  [`pnpm-workspace.yaml:1`](../../pnpm-workspace.yaml#L1)

**TypeScript foundation**

- Base tsconfig: strict mode + compiler options inherited by all workspaces
  [`tsconfig.base.json:1`](../../tsconfig.base.json#L1)

- API tsconfig: overrides moduleResolution to `node` (CommonJS target requires this)
  [`tsconfig.json:1`](../../apps/api/tsconfig.json#L1)

**Web app**

- Tailwind v4 wired via Vite plugin — no postcss.config needed
  [`vite.config.ts:1`](../../apps/web/vite.config.ts#L1)

- `@import "tailwindcss"` is the v4 Vite-plugin syntax — not a typo
  [`index.css:1`](../../apps/web/src/index.css#L1)

- Placeholder page rendering with Tailwind classes confirms v4 wiring
  [`App.tsx:1`](../../apps/web/src/App.tsx#L1)

**Mobile app**

- Metro wraps base config with NativeWind transform — critical wiring for class resolution
  [`metro.config.js:1`](../../apps/mobile/metro.config.js#L1)

- Babel preset order matters: `jsxImportSource: nativewind` then `nativewind/babel`
  [`babel.config.js:1`](../../apps/mobile/babel.config.js#L1)

- App entry: imports global.css before any component — NativeWind requires this
  [`App.tsx:1`](../../apps/mobile/App.tsx#L1)

- NativeWind Tailwind config: content paths + nativewind/preset
  [`tailwind.config.js:1`](../../apps/mobile/tailwind.config.js#L1)

**Shared packages**

- shared-types: typed placeholder; domain interfaces added in Story 1.2
  [`index.ts:1`](../../packages/shared-types/src/index.ts#L1)

- config: typed placeholder; Zod env validation added in Story 1.4
  [`index.ts:1`](../../packages/config/src/index.ts#L1)

**Config / peripherals**

- pnpm behaviour: `shamefully-hoist=false` keeps workspace isolation clean
  [`.npmrc:1`](../../.npmrc#L1)

- Nodemon: watches src/*.ts only, exec via ts-node for hot reload
  [`nodemon.json:1`](../../apps/api/nodemon.json#L1)

- Expo config: SDK 55, portrait orientation, placeholder assets
  [`app.json:1`](../../apps/mobile/app.json#L1)
