# Core Architectural Decisions

## Decision Priority Analysis

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

## Data Architecture

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

## Authentication & Security

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

## API & Communication Patterns

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

## Frontend Architecture

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

## Infrastructure & Deployment

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

## Decision Impact Analysis

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
