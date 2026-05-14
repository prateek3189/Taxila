# Starter Template Evaluation

## Primary Technology Domain

Full-stack multi-portal SaaS: React Native + Expo (mobile), React (web portals), Node.js (API), MongoDB. Three app surfaces sharing TypeScript type contracts, deployed on AWS.

## Starter Options Considered

- **T3-Turbo** — Rejected: SQL-first (Drizzle), tRPC vs REST. Conflicts with PRD's REST API spec and MongoDB datastore.
- **Expo standalone** (`create-expo-app`) — Insufficient: no web or API; requires full manual monorepo wiring.
- **Custom Turborepo monorepo** — Selected: MongoDB-native, REST API as specified, TypeScript throughout, AWS-deployable, minimal operational overhead for solo dev.

## Selected Starter: Custom Turborepo Monorepo

**Rationale:** Three app surfaces sharing TypeScript type contracts is the core value of a monorepo. No existing starter matches Expo + React web + Express + MongoDB without fighting its defaults. Turborepo provides build caching and task orchestration without imposing stack choices.

**Monorepo Structure:**

```
vital-track/
├── apps/
│   ├── mobile/          # Expo SDK 55, React Native (iOS + Android)
│   ├── web/             # Vite + React TS (Doctor portal + Admin, role-based routing)
│   └── api/             # Node.js + Express + TypeScript (/api/v1/)
├── packages/
│   ├── shared-types/    # TypeScript interfaces shared across all apps
│   └── config/          # Shared tsconfig, ESLint, Prettier
└── turbo.json
```

**Initialization Commands:**

```bash
# 1. Initialize Turborepo with pnpm
npx create-turbo@latest vital-track --package-manager pnpm

# 2. Add Expo mobile app (SDK 55)
npx create-expo-app@latest apps/mobile --template blank-typescript

# 3. Add React web portals
npm create vite@latest apps/web -- --template react-ts

# 4. Scaffold Node.js API
mkdir apps/api && cd apps/api
pnpm init
pnpm add express mongoose helmet express-rate-limit jsonwebtoken
pnpm add -D typescript @types/express @types/node ts-node nodemon
```

**Architectural Decisions Established:**

**Language & Runtime:** TypeScript strict mode throughout — all apps, all packages.

**Styling Solution:**
- Mobile: NativeWind v5 (Tailwind CSS for React Native)
- Web: Tailwind CSS v4

**Build Tooling:**
- Turborepo for monorepo task orchestration and build caching
- Vite for web app bundling
- Metro for Expo/React Native bundling
- tsc for API compilation

**Testing Framework:**
- Jest + React Native Testing Library (mobile)
- Vitest + React Testing Library (web)
- Jest + Supertest (API)

**Code Organization:**
- `packages/shared-types` — all domain interfaces (User, Child, VaccinationRecord, NotificationPayload, etc.) defined once, imported by all apps
- `apps/web` — single Vite SPA with role-based routing; Doctor portal vs Admin dashboard rendered from JWT role claim
- `apps/api` — RESTful `/api/v1/[resource]` with separate Express router + middleware stacks per role

**AWS Deployment Targets:**
- ECS Fargate — API containers
- S3 + CloudFront — web app static hosting
- MongoDB Atlas with AWS VPC peering — PHI-isolated datastore
- AWS SES — email notifications (HIPAA BAA available)
- SNS — SMS fallback channel

**Package Manager:** pnpm workspaces

**Note:** Turborepo initialization + monorepo wiring should be the first implementation story.
