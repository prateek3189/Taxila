# Implementation Patterns & Consistency Rules

## Critical Conflict Points Identified

7 areas where AI agents could make incompatible choices without explicit rules:
naming conventions, collection/field casing, API response shape, error structure,
date handling, file organization, and state management patterns.

## Naming Patterns

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

## Structure Patterns

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

## Format Patterns

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

## Communication Patterns

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

## Process Patterns

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

## Enforcement Guidelines

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
