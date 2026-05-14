---
stepsCompleted: ['step-01-init', 'step-02-context', 'step-03-starter', 'step-04-decisions', 'step-05-patterns', 'step-06-structure', 'step-07-validation', 'step-08-complete']
lastStep: 8
status: 'complete'
completedAt: '2026-04-03'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/product-brief-vital-track.md'
workflowType: 'architecture'
project_name: 'vital-track'
user_name: 'Prateek.magarde'
date: '2026-04-03'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
53 FRs across 7 capability domains:
- Identity & Account Management (FR1–6): Multi-role auth, caregiver invitations, password reset
- Child Profile & ChildID (FR7–12): Profile creation, deduplication, 6-char code + QR, multi-child management, QR revocation
- Vaccination Plan Management (FR13–20): Doctor plan creation from templates, publishing, parent view, external vaccine addition
- Vaccine Administration & Records (FR21–28): Doctor administration marking with lot number, state machine (pending/approved/rejected/expired), immutability, full audit trail
- Notifications & Reminders (FR29–34): Proactive reminders (14d/7d/day-of), approval requests, escalation, delivery tracking, channel preferences
- Access Control & Sharing (FR35–40): ChildID-scoped doctor access, access logs, caregiver tiers, signed QR token lifecycle
- Doctor Verification & Clinic Management (FR41–46): Credential submission, admin review queue, Stripe subscription billing
- Administration & Compliance (FR47–53): Admin deactivation, GDPR erasure, PHI audit log, record export, COPPA consent, regional data residency

**Non-Functional Requirements:**
- Performance: QR-to-plan <30s; API p95 <2s; approval notifications dispatched within 2min; plan visible within 5min of publish
- Security: AES-256 at rest, TLS 1.2+, JWT 15min + refresh rotation, signed time-limited QR tokens, tamper-evident audit logs, annual pen testing, HIPAA BAAs pre-launch
- Scalability: 10x growth headroom; MongoDB sharding-ready from day one; multi-region deployment for data residency; idempotent background jobs
- Accessibility: WCAG 2.1 AA (web), platform accessibility APIs (mobile), i18n-ready from launch
- Integration Reliability: 99%+ notification delivery; tri-channel fallback; PCI DSS via Stripe hosted elements; FCM token refresh
- Reliability: 99.9% uptime clinic hours; MongoDB majority write concern on all record writes; offline read + write-queue mobile; RTO 4h / RPO 1h

**Scale & Complexity:**
High-complexity greenfield SaaS with regulated health data, multi-sided marketplace, and cross-platform delivery.

- Primary domain: Full-stack (React Native + Expo, React web, Node.js, MongoDB)
- Complexity level: High
- Estimated architectural components: 8 major subsystems (Auth/RBAC, ChildID, Plan Management, Record State Machine, Notification Pipeline, Admin/Verification, Billing, Audit/Compliance)

### Technical Constraints & Dependencies

- **Stack defined by PRD:** React Native + Expo (iOS + Android), React web (Doctor portal + Admin), Node.js (API), MongoDB
- **Third-party services:** Twilio (SMS), SendGrid/AWS SES (email), FCM via Expo (push), Stripe (billing), PostHog/Mixpanel (analytics)
- **HIPAA BAAs required** before any PHI stored — all cloud and third-party providers must execute BAAs pre-launch
- **Solo development** — prefer managed services, minimize operational overhead, vertical-slice build sequencing
- **App store compliance:** Apple (medical disclaimer) + Google Play (data safety form, PHI declaration) — both at launch

### Cross-Cutting Concerns Identified

1. **Auth & RBAC** — 6 roles (Parent, Caregiver tiers, Doctor, Urgent Care QR, Clinic Admin, Platform Admin) with role-scoped middleware across all 3 portal surfaces
2. **PHI Audit Logging** — tamper-evident, append-only on every PHI access; integrity must not depend on application layer alone
3. **Multi-Tenancy Data Isolation** — ChildID-scoped access: doctors see only explicitly shared records; strict query-layer enforcement; no lateral access
4. **Notification Reliability** — dual pipeline (scheduled + event-driven), tri-channel with fallback chain, delivery status tracking, idempotency across retries
5. **Record State Machine** — enforced at application layer (Node.js validators) AND database layer (MongoDB validation rules); no state skipping
6. **Compliance Gates** — COPPA consent before child data collection; GDPR erasure workflow; India DPDP data residency toggle; all testable
7. **Offline Sync** — Parent app + Doctor mobile: read from cache, queue writes, sync on reconnect with conflict-safe state machine behavior

## Starter Template Evaluation

### Primary Technology Domain

Full-stack multi-portal SaaS: React Native + Expo (mobile), React (web portals), Node.js (API), MongoDB. Three app surfaces sharing TypeScript type contracts, deployed on AWS.

### Starter Options Considered

- **T3-Turbo** — Rejected: SQL-first (Drizzle), tRPC vs REST. Conflicts with PRD's REST API spec and MongoDB datastore.
- **Expo standalone** (`create-expo-app`) — Insufficient: no web or API; requires full manual monorepo wiring.
- **Custom Turborepo monorepo** — Selected: MongoDB-native, REST API as specified, TypeScript throughout, AWS-deployable, minimal operational overhead for solo dev.

### Selected Starter: Custom Turborepo Monorepo

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

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Auth strategy: Custom JWT middleware (jsonwebtoken + bcrypt)
- RBAC: Role-based Express middleware factory
- Data layer: Mongoose + MongoDB Atlas
- Validation: Zod (shared across API + frontend via packages/shared-types)
- State management: TanStack Query v5 (server state) + Zustand (UI state)
- Navigation: Expo Router v4 (mobile) + React Router v7 (web)

**Important Decisions (Shape Architecture):**
- API documentation: swagger-jsdoc + swagger-ui-express
- Error handling: Centralized Express error middleware with standard envelope
- Rate limiting: express-rate-limit with role-differentiated limiters
- Forms: React Hook Form + Zod resolver
- Monitoring: Sentry (errors) + CloudWatch (infra) + PostHog (analytics)
- CI/CD: GitHub Actions + EAS Build for mobile

**Deferred Decisions (Post-MVP):**
- Redis caching layer (add if notification scheduling or session storage demands it)
- AWS WAF (post-launch hardening)
- Multi-region active-active (activate when DPDP data residency required)
- EHR/FHIR integration (Phase 2)
- Automated doctor credential verification API (Phase 2)

### Data Architecture

**ORM/Driver:** Mongoose (latest stable)
- Rationale: Schema definition + validation at ORM layer enforces record state machine, immutability rules, and audit trail subdocuments. Essential for compliance integrity.
- Affects: All collections — Child, VaccinationRecord, User, AuditLog, Notification

**Caching:** None at MVP (MongoDB with proper indexing)
- Rationale: Launch-scale read patterns (ChildID lookups, plan views, record lists) are handled by MongoDB indexes. Redis adds HIPAA BAA overhead. Revisit post-MVP.

**Schema Migration:** migrate-mongo
- Rationale: Tracked, versioned migrations for index changes and required field additions. MongoDB's flexible schema reduces frequency but explicit migrations are necessary.

**Key Indexes (day-one design):**
- ChildID (unique) — cross-tenant access primitive
- parentId — child profile lookups
- doctorId — doctor's patient panel
- dueDate — reminder scheduler queries
- record state — pending approval queue

### Authentication & Security

**Authentication:** Custom JWT middleware (jsonwebtoken + bcrypt)
- Access tokens: 15min expiry (as per PRD NFR-S2)
- Refresh tokens: Rotation on use, invalidated on logout and suspicious activity
- Rationale: Full control over PHI data residency; avoids BAA complexity with managed auth services; matches PRD spec exactly

**RBAC:** Role-based Express middleware factory
- Pattern: `requireRole('doctor')`, `requirePermission('mark-administered')`
- 6 roles: Parent, Caregiver (tiers), Doctor, Urgent Care QR, Clinic Admin, Platform Admin
- Rationale: PRD's RBAC matrix is well-defined; lightweight custom middleware is more readable than casbin/accesscontrol at this scale

**Input Validation:** Zod
- Used in API (request validation) and packages/shared-types (schema definitions)
- Same schemas drive API validation + React Hook Form validation on frontend
- Rationale: Single validation library across entire monorepo; TypeScript-native

**QR Token Security:** Signed JWTs with configurable expiry
- Time-limited, single-use for sensitive operations
- Stored in AuditLog on each scan (FR37)

### API & Communication Patterns

**Design:** RESTful `/api/v1/[resource]` with versioning
- Separate Express router + middleware stacks per role (parent, doctor, admin)
- Standard response envelope: `{ success: true, data: {} }` / `{ success: false, error: { code, message, details } }`

**Documentation:** swagger-jsdoc + swagger-ui-express
- Auto-generates OpenAPI spec from JSDoc comments
- Serves `/api/docs` in development
- Critical for compliance audits — documents all endpoints and access controls

**Error Handling:** Centralized Express error middleware
- All route handlers throw typed errors
- Middleware catches, logs to CloudWatch, and formats response
- Error codes map to FR violations for traceability

**Rate Limiting:** express-rate-limit with role-differentiated limiters
- Stricter limits on admin routes
- Brute-force protection on auth endpoints (login, password reset)
- Standard limits on user routes

### Frontend Architecture

**Server State:** TanStack Query v5 (React Query)
- Used in both web (Vite) and mobile (Expo)
- Handles caching, background refetch, optimistic updates, offline queue
- Rationale: Reduces Redux boilerplate; built-in offline support aligns with PRD NFR-R3

**UI State:** Zustand
- Global UI state: auth session, notification state, modal/drawer state
- Lightweight, TypeScript-native, zero boilerplate
- TanStack Query owns server state; Zustand owns everything else

**Navigation:**
- Mobile: Expo Router v4 (file-based, current Expo standard)
- Web: React Router v7 (Vite SPA)

**Forms:** React Hook Form + Zod resolver
- Same Zod schemas from packages/shared-types drive both API and form validation
- Write schema once, use in API validation + frontend form validation

### Infrastructure & Deployment

**Hosting:**
- API: AWS ECS Fargate (containerized Node.js, auto-scaling)
- Web: AWS S3 + CloudFront (static hosting, global CDN)
- Database: MongoDB Atlas with AWS VPC peering (PHI-isolated, HIPAA BAA available)
- Email: AWS SES (HIPAA BAA available)
- SMS: Twilio (HIPAA BAA available)

**CI/CD:** GitHub Actions
- Pipeline: lint → type-check → test → build → deploy
- API: ECS task definition update on merge to main
- Web: S3 sync + CloudFront invalidation on merge to main
- Mobile: EAS Build + EAS Submit (App Store + Play Store)

**Mobile Build:** Expo Application Services (EAS Build + EAS Submit)
- Managed cloud builds for iOS and Android
- Eliminates Mac CI runner requirement for iOS builds

**Monitoring & Observability:**
- Sentry: Error tracking across all three apps (HIPAA BAA available)
- AWS CloudWatch: Infrastructure metrics, API request logs, alarm thresholds
- PostHog: Product analytics (self-hosted or cloud with HIPAA BAA)

**Environment Management:**
- Production secrets: AWS SSM Parameter Store
- Local development: .env files via dotenv
- All env vars typed via packages/config/env.ts (Zod schema — fails fast on missing vars)

### Decision Impact Analysis

**Implementation Sequence (respects PRD build order):**
1. Monorepo setup + shared-types package + env config
2. Auth system (JWT + RBAC middleware) — everything depends on this
3. Mongoose schemas (Child, VaccinationRecord, User, AuditLog) + migrations
4. Doctor portal API routes + React web scaffold
5. Parent app API routes + Expo scaffold
6. Notification pipeline (TanStack Query + Twilio + SES + FCM)
7. Approval workflow state machine (full pending/approved/rejected/expired)
8. Admin dashboard API + React web routes
9. Stripe billing integration
10. QR scan + ChildID sharing flows
11. CI/CD pipeline + ECS + S3 deployment
12. EAS Build setup + App Store submission

**Cross-Component Dependencies:**
- Zod schemas in packages/shared-types → consumed by API validation, React Hook Form, and TanStack Query response types
- JWT role claim → drives Expo Router navigation guards (mobile) + React Router guards (web) + Express middleware
- Record state machine → triggers TanStack Query invalidations → triggers notification dispatch
- ChildID → cross-cuts Auth, QR generation, AuditLog, and multi-tenancy isolation

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

7 areas where AI agents could make incompatible choices without explicit rules:
naming conventions, collection/field casing, API response shape, error structure,
date handling, file organization, and state management patterns.

### Naming Patterns

**MongoDB Collection & Field Naming:**
- Collections: `camelCase` plural nouns — `vaccinationRecords`, `childProfiles`, `auditLogs`
- Fields: `camelCase` — `childId`, `dueDate`, `approvedAt`, `lotNumber`
- IDs: Always `_id` (Mongoose default) for primary key; `[entity]Id` for foreign references (e.g., `parentId`, `doctorId`, `childId`)
- Timestamps: `createdAt`, `updatedAt` (Mongoose timestamps: true), `[action]At` pattern for domain timestamps (e.g., `approvedAt`, `rejectedAt`, `expiredAt`)
- Enums stored as strings, UPPERCASE — `'PENDING'`, `'APPROVED'`, `'REJECTED'`, `'EXPIRED'`

**API Endpoint Naming:**
- Plural resource nouns: `/api/v1/children`, `/api/v1/vaccination-records`, `/api/v1/doctors`
- Kebab-case for multi-word resources: `/api/v1/vaccination-plans`, `/api/v1/child-profiles`
- Nested resources for ownership: `/api/v1/children/:childId/vaccination-records`
- Actions as sub-resources: `/api/v1/vaccination-records/:recordId/approve`, `/api/v1/vaccination-records/:recordId/reject`
- Route params: `:camelCaseId` format — `:childId`, `:recordId`, `:doctorId`

**TypeScript Code Naming:**
- Files: `camelCase.ts` for utilities/services, `PascalCase.tsx` for React components
- React components: `PascalCase` — `VaccinationCard`, `ChildProfile`, `ApprovalModal`
- Hooks: `use` prefix + `PascalCase` — `useVaccinationRecords`, `useChildProfile`
- Zustand stores: `use` prefix + `PascalCase` + `Store` — `useAuthStore`, `useNotificationStore`
- TanStack Query keys: arrays with resource name first — `['vaccinationRecords', childId]`, `['children', parentId]`
- Mongoose models: `PascalCase` singular — `VaccinationRecord`, `ChildProfile`, `User`
- Zod schemas: `camelCase` + `Schema` suffix — `vaccinationRecordSchema`, `childProfileSchema`
- Environment variables: `SCREAMING_SNAKE_CASE` — `JWT_SECRET`, `MONGODB_URI`, `AWS_REGION`

### Structure Patterns

**Monorepo App Structure:**

```
apps/api/src/
├── routes/          # Express routers, one file per resource
├── middleware/       # Auth, RBAC, rate-limit, error handler
├── models/          # Mongoose schemas and models
├── services/        # Business logic (state machine, notification dispatch)
├── jobs/            # Cron jobs (reminder scheduler, approval timeout)
├── utils/           # Pure utility functions
├── types/           # API-specific types (extends shared-types)
└── app.ts           # Express app setup (no server.listen here)
└── server.ts        # server.listen entry point

apps/web/src/
├── pages/           # Route-level components (maps to React Router routes)
├── components/      # Shared UI components
├── features/        # Feature-scoped components + hooks (e.g., features/vaccination/)
├── hooks/           # Shared custom hooks
├── stores/          # Zustand stores
├── lib/             # TanStack Query client, axios instance, etc.
├── types/           # Web-specific types
└── main.tsx

apps/mobile/
├── app/             # Expo Router file-based routes
├── components/      # Shared React Native components
├── features/        # Feature-scoped components + hooks
├── hooks/           # Shared custom hooks
├── stores/          # Zustand stores (same pattern as web)
├── lib/             # TanStack Query client, API client
└── types/           # Mobile-specific types

packages/shared-types/src/
├── models/          # Domain entity interfaces (User, Child, VaccinationRecord)
├── api/             # Request/response type interfaces
├── schemas/         # Zod validation schemas
└── index.ts         # Re-exports everything
```

**Test File Placement:** Co-located with source files
- `models/vaccinationRecord.ts` → `models/vaccinationRecord.test.ts`
- `services/notificationService.ts` → `services/notificationService.test.ts`
- `components/VaccinationCard.tsx` → `components/VaccinationCard.test.tsx`

**Feature Folder Convention:**
```
features/vaccination/
├── VaccinationCard.tsx
├── VaccinationCard.test.tsx
├── useVaccinationRecords.ts
└── index.ts          # exports only what other features should use
```

### Format Patterns

**API Response Envelope — ALL responses use this shape:**
```typescript
// Success
{ "success": true, "data": { ... } }

// Success with pagination
{ "success": true, "data": [...], "meta": { "total": 100, "page": 1, "limit": 20 } }

// Error
{ "success": false, "error": { "code": "RECORD_NOT_FOUND", "message": "...", "details": {} } }
```
- Never return raw objects without the envelope
- Never use HTTP status codes alone to convey error type — always include `error.code`

**Error Codes:** SCREAMING_SNAKE_CASE strings mapping to business rules
- Examples: `UNAUTHORIZED`, `FORBIDDEN`, `RECORD_NOT_FOUND`, `INVALID_STATE_TRANSITION`, `CHILD_ID_NOT_FOUND`, `APPROVAL_EXPIRED`, `DUPLICATE_CHILD_PROFILE`

**Date & Time Handling:**
- All dates stored in MongoDB as native `Date` objects (UTC)
- All dates serialized in API responses as ISO 8601 strings: `"2026-04-03T14:30:00.000Z"`
- Never use Unix timestamps in API responses
- Frontend displays in user's local timezone via `Intl.DateTimeFormat`
- Due dates stored as date-only `YYYY-MM-DD` string to avoid timezone confusion in reminder scheduling

**JSON Field Naming:** `camelCase` throughout — API requests, responses, and MongoDB documents
- No `snake_case` anywhere in the codebase
- Stripe webhooks arrive in `snake_case` — transform at the webhook handler boundary

**HTTP Status Codes:**
- `200` — successful GET, PATCH
- `201` — successful POST (resource created)
- `204` — successful DELETE (no body)
- `400` — validation error (Zod failure)
- `401` — not authenticated (no/invalid JWT)
- `403` — authenticated but forbidden (RBAC failure)
- `404` — resource not found
- `409` — conflict (duplicate child profile, invalid state transition)
- `422` — business rule violation (approval already expired)
- `500` — unexpected server error

### Communication Patterns

**Internal Domain Events (Node.js EventEmitter within API):**
- Naming: `[resource].[pastTense]` — `vaccinationRecord.submitted`, `vaccinationRecord.approved`, `vaccinationRecord.rejected`, `child.created`
- Payload always includes: `{ eventType, timestamp, actorId, actorRole, ...entityData }`
- Events trigger notification dispatch and audit log writes — never call notification service directly from routes

**TanStack Query Key Conventions:**
```typescript
// Standard pattern: ['resourceName', ...identifiers]
['children', parentId]
['vaccinationRecords', childId]
['vaccinationRecord', recordId]
['vaccinationPlans', childId]
['notifications', userId]
```
- Invalidate by prefix on mutations: `queryClient.invalidateQueries({ queryKey: ['vaccinationRecords', childId] })`

**Zustand Store Pattern:**
```typescript
const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
}))
```

### Process Patterns

**Error Handling:**

API: Throw typed `AppError` instances in route handlers; centralized middleware catches and formats response.
```typescript
throw new AppError('CHILD_ID_NOT_FOUND', 'Child not found', 404)
```

Frontend: TanStack Query `onError` → toast; `error` state → inline error UI; Sentry for unexpected errors in ErrorBoundary. Never `console.error` in production.

**Loading State Patterns:**
- Use TanStack Query `isLoading`, `isFetching`, `isPending` — never manual `useState<boolean>` for server data
- Skeleton screens for initial loads; spinner overlay for mutations
- Disable action buttons while `isPending` to prevent double-submission

**Auth Flow Pattern:**
- On app start: read token from SecureStore (mobile) / localStorage (web) → validate via `/api/v1/auth/me` → populate Zustand auth store
- On 401: axios interceptor clears auth store → redirects to login
- Refresh token rotation: interceptor catches 401 → attempts refresh → retries once → clears auth on second failure

**State Machine Transitions — Vaccine Records:**
- All transitions in `apps/api/src/services/recordStateService.ts` only — never in route handlers
- Validate current state before applying; throw `INVALID_STATE_TRANSITION` if illegal
- Every transition writes audit log entry atomically in same MongoDB session
- Valid transitions: `PENDING→APPROVED`, `PENDING→REJECTED` (note required), `PENDING→EXPIRED` (cron), `REJECTED→PENDING` (doctor resubmission)

**PHI Audit Logging Pattern:**
- Every route reading or writing PHI calls `auditLogService.log(...)` before returning
- Audit log writes use `{ writeConcern: { w: 'majority' } }` — never fire-and-forget
- Audit log collection is insert-only — no updates or deletes ever

### Enforcement Guidelines

**All AI Agents MUST:**
- Use `AppError` for all thrown errors in the API — never `new Error()`
- Use the shared response envelope for all API responses — never raw objects
- Import domain types from `packages/shared-types` — never redefine entities locally
- Route all state machine transitions through `recordStateService` — never update record state directly
- Write audit log entries for every PHI access — no exceptions for read-only operations
- Use ISO 8601 date strings in all API responses — never timestamps or locale strings
- Co-locate tests with source files — never create a top-level `__tests__` directory

**Anti-Patterns:**
- ❌ `res.json({ error: 'not found' })` → ✅ `throw new AppError('CHILD_ID_NOT_FOUND', '...', 404)`
- ❌ `record.status = 'approved'` → ✅ `await recordStateService.approve(recordId, actorId)`
- ❌ `new Date().getTime()` in response → ✅ `new Date().toISOString()`
- ❌ Defining `interface VaccinationRecord` in a route file → ✅ import from `packages/shared-types`
- ❌ `useState(false)` for server data loading → ✅ TanStack Query `isLoading`/`isPending`
- ❌ Direct notification service call from route → ✅ emit domain event, notification service listens

## Project Structure & Boundaries

### Complete Project Directory Structure

```
vital-track/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # lint + typecheck + test on PR
│       ├── deploy-api.yml            # ECS Fargate deploy on main merge
│       └── deploy-web.yml            # S3 + CloudFront deploy on main merge
├── apps/
│   ├── api/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   ├── migrate-mongo-config.js
│   │   └── src/
│   │       ├── server.ts             # server.listen entry point
│   │       ├── app.ts                # Express app setup, middleware registration
│   │       ├── routes/
│   │       │   ├── index.ts          # mounts all routers at /api/v1
│   │       │   ├── auth.ts           # POST /auth/register, /auth/login, /auth/refresh, /auth/me
│   │       │   ├── children.ts       # CRUD /children, /children/:childId/qr
│   │       │   ├── vaccinationPlans.ts
│   │       │   ├── vaccinationRecords.ts # /vaccination-records/:id/approve|reject|resubmit
│   │       │   ├── doctors.ts        # /doctors/verify, /doctors/patients
│   │       │   ├── notifications.ts  # /notifications, /notifications/preferences
│   │       │   ├── caregivers.ts
│   │       │   ├── billing.ts        # /billing/subscribe, /billing/webhook (Stripe)
│   │       │   └── admin.ts          # /admin/doctors/queue, /admin/doctors/:id/approve|reject
│   │       ├── middleware/
│   │       │   ├── auth.ts           # JWT verification, populates req.user
│   │       │   ├── rbac.ts           # requireRole(), requirePermission() factory functions
│   │       │   ├── rateLimiter.ts    # role-differentiated express-rate-limit configs
│   │       │   ├── errorHandler.ts   # centralized AppError catch + response format
│   │       │   └── auditLog.ts       # PHI access logging middleware
│   │       ├── models/
│   │       │   ├── user.ts           # User schema (parent, doctor, admin roles)
│   │       │   ├── childProfile.ts   # ChildProfile schema + ChildID index
│   │       │   ├── vaccinationPlan.ts
│   │       │   ├── vaccinationRecord.ts  # State machine enum, immutability rules
│   │       │   ├── auditLog.ts       # Insert-only, tamper-evident
│   │       │   ├── notification.ts   # Notification delivery tracking
│   │       │   └── clinicSubscription.ts
│   │       ├── services/
│   │       │   ├── recordStateService.ts  # ALL state machine transitions live here
│   │       │   ├── childIdService.ts      # 6-char code generation, QR token signing
│   │       │   ├── notificationService.ts # tri-channel dispatch (FCM + Twilio + SES)
│   │       │   ├── auditLogService.ts     # PHI audit log writes (majority writeConcern)
│   │       │   ├── qrTokenService.ts      # Signed time-limited QR access tokens
│   │       │   ├── stripeService.ts       # Clinic subscription billing
│   │       │   ├── credentialService.ts   # Doctor credential verification queue
│   │       │   └── eventBus.ts            # Node.js EventEmitter singleton
│   │       ├── jobs/
│   │       │   ├── reminderScheduler.ts   # Daily cron: find upcoming vaccines, dispatch reminders
│   │       │   └── approvalTimeout.ts     # Cron: PENDING→EXPIRED after 48h, escalate to SMS
│   │       ├── utils/
│   │       │   ├── AppError.ts            # Typed error class (code, message, statusCode)
│   │       │   ├── asyncHandler.ts        # Express async route wrapper
│   │       │   ├── generateChildId.ts     # 6-char nanoid generation
│   │       │   └── dateUtils.ts           # ISO 8601 helpers, due date calculations
│   │       ├── types/
│   │       │   └── express.d.ts           # Augments Express Request with req.user
│   │       └── config/
│   │           ├── env.ts                 # Zod env schema (fails fast on missing vars)
│   │           ├── database.ts            # Mongoose connection setup
│   │           └── swagger.ts             # swagger-jsdoc configuration
│   │
│   ├── web/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx                    # React Router v7 root, role-based route guards
│   │       ├── pages/
│   │       │   ├── auth/
│   │       │   │   ├── LoginPage.tsx
│   │       │   │   └── RegisterPage.tsx
│   │       │   ├── doctor/
│   │       │   │   ├── DashboardPage.tsx
│   │       │   │   ├── PatientPlanPage.tsx
│   │       │   │   └── RecordAdministrationPage.tsx
│   │       │   └── admin/
│   │       │       ├── VerificationQueuePage.tsx
│   │       │       └── DoctorDetailPage.tsx
│   │       ├── features/
│   │       │   ├── auth/
│   │       │   │   ├── LoginForm.tsx
│   │       │   │   ├── useAuth.ts
│   │       │   │   └── index.ts
│   │       │   ├── vaccination/
│   │       │   │   ├── VaccinationPlanTable.tsx
│   │       │   │   ├── RecordAdministrationForm.tsx
│   │       │   │   ├── useVaccinationPlan.ts
│   │       │   │   └── index.ts
│   │       │   ├── childId/
│   │       │   │   ├── QrScanner.tsx
│   │       │   │   ├── useQrAccess.ts
│   │       │   │   └── index.ts
│   │       │   └── admin/
│   │       │       ├── VerificationCard.tsx
│   │       │       ├── useVerificationQueue.ts
│   │       │       └── index.ts
│   │       ├── components/
│   │       │   ├── ui/
│   │       │   ├── layout/
│   │       │   └── ErrorBoundary.tsx
│   │       ├── hooks/
│   │       │   ├── useDebounce.ts
│   │       │   └── useLocalStorage.ts
│   │       ├── stores/
│   │       │   ├── authStore.ts
│   │       │   └── notificationStore.ts
│   │       ├── lib/
│   │       │   ├── queryClient.ts
│   │       │   ├── apiClient.ts           # Axios instance + interceptors (401 → refresh)
│   │       │   └── queryKeys.ts           # Centralized TanStack Query key factory
│   │       └── types/
│   │           └── web.d.ts
│   │
│   └── mobile/
│       ├── package.json
│       ├── tsconfig.json
│       ├── app.json                       # Expo config
│       ├── eas.json                       # EAS Build config
│       ├── app/                           # Expo Router file-based routes
│       │   ├── _layout.tsx                # Root layout, auth guard
│       │   ├── (auth)/
│       │   │   ├── login.tsx
│       │   │   └── register.tsx
│       │   ├── (parent)/
│       │   │   ├── _layout.tsx            # Parent tab navigator
│       │   │   ├── index.tsx              # Children dashboard
│       │   │   ├── child/
│       │   │   │   ├── [childId].tsx      # Child detail + vaccination plan
│       │   │   │   └── qr.tsx             # ChildID QR display + share
│       │   │   ├── notifications.tsx
│       │   │   └── settings.tsx
│       │   ├── (doctor)/
│       │   │   ├── _layout.tsx
│       │   │   ├── index.tsx              # Patient list
│       │   │   ├── scan.tsx               # QR scanner → patient plan
│       │   │   └── patient/
│       │   │       └── [childId].tsx
│       │   └── approval/
│       │       └── [recordId].tsx         # Deep-link target for approval notifications
│       └── src/
│           ├── features/
│           │   ├── auth/
│           │   ├── vaccination/
│           │   ├── childId/
│           │   └── approval/
│           │       ├── ApprovalCard.tsx
│           │       ├── useApproval.ts
│           │       └── index.ts
│           ├── components/
│           │   ├── ui/
│           │   └── ErrorBoundary.tsx
│           ├── hooks/
│           ├── stores/
│           │   ├── authStore.ts
│           │   └── offlineQueueStore.ts   # Queued writes pending sync
│           └── lib/
│               ├── queryClient.ts
│               ├── apiClient.ts           # Axios + SecureStore token management
│               └── queryKeys.ts
│
├── packages/
│   ├── shared-types/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── models/
│   │       │   ├── user.ts               # User, Role, CaregiverPermission interfaces
│   │       │   ├── child.ts              # ChildProfile, ChildId interfaces
│   │       │   ├── vaccinationRecord.ts  # VaccinationRecord, RecordState enum
│   │       │   ├── vaccinationPlan.ts    # VaccinationPlan, Vaccine interfaces
│   │       │   ├── auditLog.ts           # AuditLogEntry interface
│   │       │   └── notification.ts       # NotificationPayload, DeliveryStatus
│   │       ├── api/
│   │       │   ├── auth.ts               # LoginRequest, LoginResponse, RegisterRequest
│   │       │   ├── children.ts           # CreateChildRequest, ChildResponse
│   │       │   ├── vaccinationRecords.ts # ApproveRequest, RejectRequest (note required)
│   │       │   └── responses.ts          # ApiResponse<T>, ApiError, PaginatedResponse<T>
│   │       ├── schemas/
│   │       │   ├── userSchema.ts         # Zod schemas (API + React Hook Form)
│   │       │   ├── childSchema.ts
│   │       │   └── vaccinationSchema.ts
│   │       └── index.ts
│   │
│   └── config/
│       ├── package.json
│       ├── tsconfig.base.json            # Shared TS strict config
│       ├── eslint-base.js
│       └── prettier.config.js
│
├── migrations/                           # migrate-mongo migration files
│   └── 20260403_initial_indexes.js
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json                          # Root (dev tooling only)
├── .gitignore
└── .env.example
```

### Architectural Boundaries

**API Boundaries:**
- All client requests enter via `/api/v1/` — no direct database access from frontend apps
- Auth boundary: `middleware/auth.ts` runs before all protected routes; sets `req.user`
- RBAC boundary: `middleware/rbac.ts` runs after auth; enforces role-scoped permissions
- PHI boundary: `middleware/auditLog.ts` wraps all routes touching ChildProfile or VaccinationRecord
- Stripe boundary: webhook payloads validated by Stripe signature; `snake_case` → `camelCase` transform at handler entry

**Service Boundaries:**
- `recordStateService` — sole authority for VaccinationRecord state transitions
- `notificationService` — sole authority for tri-channel dispatch; triggered by domain events only
- `auditLogService` — sole authority for AuditLog writes; always majority writeConcern
- `childIdService` — sole authority for ChildID generation and QR token signing/verification

**Data Boundaries:**
- Child health data isolated by `parentId` — all queries scoped to authenticated parent's children
- Doctor access scoped to ChildIDs explicitly shared — `childId` must exist in doctor's `patientIds`
- Urgent care (QR) access: read-only, time-limited, no persistent relationship created
- Audit logs: insert-only collection

**Frontend Boundaries:**
- `packages/shared-types` — only source of truth for domain types
- `lib/apiClient.ts` — only place Authorization headers are set or token refresh handled
- `lib/queryKeys.ts` — only place TanStack Query keys are defined

### Requirements to Structure Mapping

| FR Category | API Routes | Services | Models | Frontend |
|-------------|-----------|---------|--------|----------|
| Identity & Auth (FR1–6) | `routes/auth.ts` | — | `models/user.ts` | `features/auth/` |
| ChildID (FR7–12) | `routes/children.ts` | `childIdService`, `qrTokenService` | `models/childProfile.ts` | `app/(parent)/child/qr.tsx` |
| Vaccination Plans (FR13–20) | `routes/vaccinationPlans.ts` | — | `models/vaccinationPlan.ts` | `features/vaccination/` |
| Records & State Machine (FR21–28) | `routes/vaccinationRecords.ts` | `recordStateService` | `models/vaccinationRecord.ts` | `features/approval/` (mobile) |
| Notifications (FR29–34) | `routes/notifications.ts` | `notificationService` | `models/notification.ts` | `stores/notificationStore.ts` |
| Access & Sharing (FR35–40) | (middleware) | `qrTokenService` | (auditLog) | `features/childId/` |
| Doctor Verification & Billing (FR41–46) | `routes/doctors.ts`, `routes/billing.ts` | `credentialService`, `stripeService` | `models/clinicSubscription.ts` | `features/admin/` (web) |
| Admin & Compliance (FR47–53) | `routes/admin.ts` | `auditLogService` | `models/auditLog.ts` | `pages/admin/` (web) |

**Cross-Cutting Concerns:**

| Concern | Location |
|---------|----------|
| HIPAA PHI audit logging | `middleware/auditLog.ts` + `services/auditLogService.ts` |
| COPPA consent gate | `middleware/auth.ts` + `models/user.ts` |
| GDPR erasure | `routes/admin.ts` DELETE + cascade delete service |
| JWT auth | `middleware/auth.ts` + `lib/apiClient.ts` (both apps) |
| Offline sync | `stores/offlineQueueStore.ts` + TanStack Query `networkMode: 'offlineFirst'` |
| Data residency | MongoDB Atlas cluster region config + `config/env.ts` `MONGODB_REGION` var |

### Integration Points

**Approval Workflow Data Flow:**
```
Doctor marks vaccine administered
  → POST /api/v1/vaccination-records/:id/submit
  → recordStateService.submit() → PENDING state + AuditLog (same DB session)
  → EventBus emits vaccinationRecord.submitted
  → notificationService dispatches tri-channel approval request
  → Parent receives push + SMS + email
  → Parent taps deep link → approval/[recordId].tsx (mobile)
  → PATCH /api/v1/vaccination-records/:id/approve
  → recordStateService.approve() → APPROVED (immutable) + AuditLog
  → TanStack Query invalidates ['vaccinationRecords', childId] on both apps
```

**External Integrations:**

| Service | File | Auth |
|---------|------|------|
| MongoDB Atlas | `config/database.ts` | Connection string (SSM) |
| AWS SES | `services/notificationService.ts` | IAM task role |
| Twilio | `services/notificationService.ts` | API key (SSM) |
| FCM | `services/notificationService.ts` | Service account key (SSM) |
| Stripe | `services/stripeService.ts` + `routes/billing.ts` | API key + webhook secret (SSM) |
| Sentry | `app.ts` + `main.tsx` + `_layout.tsx` | DSN (env var) |

### Development Workflow

```bash
pnpm dev                    # Run all apps concurrently (Turborepo)
pnpm dev --filter api       # API only (port 3000)
pnpm dev --filter web       # Web only (port 5173)
pnpm build                  # Build all apps in dependency order
pnpm test                   # All test suites with Turborepo caching
pnpm lint && pnpm typecheck # Full quality gate
```

## Architecture Validation Results

### Coherence Validation ✅

All technology choices are mutually compatible and form coherent, well-proven stacks.
Patterns are consistent with chosen technologies. Structure supports all decisions.
No contradictory decisions identified.

### Requirements Coverage Validation ✅

All 53 FRs are architecturally supported with explicit file/service mappings.
All 6 NFR categories (Performance, Security, Scalability, Accessibility,
Integration Reliability, Reliability) are addressed by architectural decisions.

### Implementation Readiness Validation ✅

All critical decisions documented with explicit file locations.
7 conflict categories addressed with concrete naming/format/process rules.
Anti-pattern examples provided. Single-source-of-truth boundaries enforced.

### Gap Analysis Results

**Important (address in implementation):**
- Offline sync reconciliation: when `offlineQueueStore` syncs on reconnect and encounters
  an `EXPIRED` or already-`APPROVED` record, the mobile app must call
  `queryClient.invalidateQueries(['vaccinationRecord', recordId])` and surface a
  clear error state — never silently fail. Document this in the approval feature spec.

**Minor (address at setup):**
- i18n: Add `react-i18next` to both `apps/web` and `apps/mobile` during Turborepo init.
  All user-visible strings must use `t('key')` from setup day one (NFR-A4).
- At-rest encryption: MongoDB Atlas default encryption (AES-256) + AWS ECS volume
  encryption satisfies NFR-S1. Confirm both are enabled in MongoDB Atlas cluster
  config and ECS task definition before any PHI is processed.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (53 FRs, 6 NFR categories)
- [x] Scale and complexity assessed (High — regulated health data, multi-portal SaaS)
- [x] Technical constraints identified (stack, HIPAA BAAs, solo dev, app store)
- [x] 7 cross-cutting concerns mapped to specific files

**✅ Architectural Decisions**
- [x] Critical decisions documented (auth, RBAC, ORM, validation, state mgmt, navigation)
- [x] Technology stack fully specified with current versions
- [x] AWS deployment targets defined with HIPAA BAA coverage
- [x] Deferred decisions documented with rationale

**✅ Implementation Patterns**
- [x] Naming conventions: collections, API endpoints, TypeScript code, env vars
- [x] Structure patterns: feature folders, test co-location, app/package boundaries
- [x] Format patterns: API response envelope, error codes, date handling, HTTP status codes
- [x] Communication patterns: domain events, TanStack Query keys, Zustand stores
- [x] Process patterns: error handling, loading states, auth flow, state machine, audit logging
- [x] Anti-patterns documented with ✅ examples

**✅ Project Structure**
- [x] Complete directory tree defined (all files and directories)
- [x] 8 service boundaries established
- [x] All 53 FRs mapped to specific files/directories
- [x] Cross-cutting concerns mapped to locations
- [x] Integration points and approval workflow data flow documented

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- State machine enforcement is architecturally isolated — zero risk of bypass
- PHI audit logging is structural (middleware + service), not optional
- Shared types eliminate type drift between API, web, and mobile from day one
- Domain event pattern decouples notification dispatch from business logic
- Offline reconciliation failure mode identified before implementation

**Areas for Future Enhancement:**
- Redis caching layer (post-MVP, if notification scheduling or session demands it)
- AWS WAF (post-launch hardening)
- Multi-region active-active (when DPDP data residency activates at scale)
- Automated doctor credential verification API (Phase 2)

### Implementation Handoff

**First Implementation Story:** Turborepo monorepo init + `packages/shared-types` + `packages/config` + env setup + `react-i18next` scaffolding in both web and mobile apps.

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently — refer to anti-patterns section
- All domain type imports come from `packages/shared-types` only
- All state machine transitions go through `recordStateService` only
- All PHI routes wrap with `middleware/auditLog.ts`
- All API responses use the standard success/error envelope
