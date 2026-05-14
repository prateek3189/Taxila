---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

# vital-track - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for vital-track, decomposing the requirements from the PRD and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Identity & Account Management**
FR1: Parent can register an account using email and password
FR2: Doctor can register a clinic account and submit credentials for verification
FR3: Users can authenticate using email and password with secure session management
FR4: Users can reset their password via email
FR5: Parent can invite caregivers to access their account with a configurable permission level
FR6: Caregiver can accept or decline a parent's access invitation

**Child Profile & ChildID**
FR7: Parent can create a child profile using the child's name and the parent's phone number
FR8: System prevents duplicate child profiles based on name + phone number combination
FR9: System automatically generates a unique 6-character ChildID code and QR for each child profile upon creation
FR10: Parent can view, download, and share a child's ChildID QR code
FR11: Parent can manage multiple child profiles under a single account
FR12: Parent can regenerate a child's ChildID QR code, invalidating all previous QR access tokens for that child

**Vaccination Plan Management**
FR13: Verified doctor can create a vaccination plan for a child using the child's ChildID
FR14: Doctor can add individual vaccines to a plan with name, due date, and optional notes
FR15: Doctor can use a standard pediatric vaccination schedule as a plan template
FR16: Doctor can publish a vaccination plan, making it immediately visible to the linked parent
FR17: Doctor can add external (ad-hoc) vaccinations to an existing plan
FR18: Parent can view their child's complete vaccination plan including administered, upcoming, and overdue vaccines
FR19: Parent can add external vaccinations received outside the doctor's plan to their child's record
FR20: Doctor can view and manage vaccination plans for all children who have shared their ChildID with that doctor

**Vaccine Administration & Records**
FR21: Verified doctor can mark a vaccine as administered, including vaccine lot number and administration date
FR22: System transitions a vaccine record to "pending approval" state upon doctor submission, notifying the parent immediately
FR23: Parent can approve a pending vaccine administration record with a single action
FR24: Parent can reject a pending vaccine administration record with a mandatory explanatory note
FR25: Doctor receives notification of a rejection with the parent's note, and can resubmit an amended administration record
FR26: System automatically transitions a pending record to "expired" state after a configurable timeout period (default: 48 hours) without parent action
FR27: Approved vaccination records are immutable — modifications are only permitted as append-only amendments with audit trail entries
FR28: System maintains a complete audit trail of all record state transitions, capturing actor identity, timestamp, and action type for every change

**Notifications & Reminders**
FR29: System sends proactive reminders to parents via email, SMS, and in-app push when a vaccine due date is approaching (default: 14 days and 7 days before due date)
FR30: System sends a same-day reminder to parents on the vaccine due date via all three notification channels
FR31: System sends an approval request notification to the parent via email, SMS, and in-app push immediately when a doctor submits a vaccine administration record
FR32: System escalates an unanswered approval request via SMS after a configurable timeout, and alerts the platform admin if still unanswered after a secondary timeout
FR33: Parent can configure notification preferences per channel (enable/disable email, SMS, and push independently)
FR34: System tracks delivery status for each notification attempt and retries failed deliveries through fallback channels

**Access Control & Sharing**
FR35: Any verified doctor can access a child's vaccination plan by scanning or manually entering the child's ChildID code — without requiring a prior relationship with the parent's clinic
FR36: Doctor's ChildID-based access is scoped exclusively to the records of the child whose ChildID was shared — no lateral access to other patients
FR37: Parent can view a timestamped log of all parties who have accessed their child's record via ChildID, including actor identity and access type
FR38: Caregiver with read-only access can view a child's vaccination plan but cannot add records, approve administrations, or modify any data
FR39: Parent can revoke caregiver access at any time, immediately removing all access permissions
FR40: System enforces time-limited, signed access tokens for all QR-based record access; expired tokens are automatically invalidated

**Doctor Verification & Clinic Management**
FR41: Doctor can submit credential verification by providing medical license number, country of practice, and supporting documentation
FR42: Platform admin can review, approve, or reject doctor credential verification requests from a dedicated queue
FR43: Approved doctor receives access to the full doctor portal; rejected doctor receives a reason and a path to resubmit
FR44: Clinic admin can view and manage which verified doctors are associated with their clinic subscription
FR45: Clinic can subscribe to a paid plan via credit card with monthly or annual billing options
FR46: System generates invoices, handles subscription renewals, and manages payment failure notifications automatically via Stripe

**Administration & Compliance**
FR47: Platform admin can view, filter, and action all pending doctor credential verification requests in a managed queue
FR48: Platform admin can deactivate a doctor account at any time, immediately revoking all portal access and ChildID-based record access
FR49: Parent can request full deletion of their account and all associated child data, with the system processing the deletion in compliance with GDPR right to erasure
FR50: System logs all PHI access events — including who accessed what record, when, and what action was taken — in a tamper-evident audit log
FR51: Parent can export their child's complete vaccination record in a portable, human-readable format
FR52: System enforces verifiable parental consent collection before storing or processing any data about children under 13 (COPPA compliance)
FR53: System supports regional data residency configuration, allowing child health data to be stored in the region corresponding to the parent's country of residence

### NonFunctional Requirements

**Performance**
NFR-P1: Doctor's QR scan to vaccination plan display completes in under 30 seconds on a standard mobile connection
NFR-P2: All standard API operations (plan view, profile load, record list) respond in under 2 seconds at the 95th percentile
NFR-P3: Approval request notifications are dispatched within 2 minutes of a doctor submitting a vaccine administration record
NFR-P4: Proactive reminder notifications are dispatched within 1 hour of the scheduled reminder window opening
NFR-P5: Vaccination plan published by doctor becomes visible to parent within 5 minutes of publication
NFR-P6: ChildID QR code generation completes server-side in under 1 second

**Security**
NFR-S1: All data at rest is encrypted using AES-256; all data in transit uses TLS 1.2 or higher
NFR-S2: API authentication uses JWT access tokens (short-lived, 15 minutes) with refresh token rotation; refresh tokens are invalidated on logout and on suspicious activity detection
NFR-S3: QR-based access uses signed, time-limited tokens — tokens expire after a configurable window and cannot be reused after expiry
NFR-S4: All API endpoints are protected by role-based rate limiting; admin routes have stricter limits than user routes
NFR-S5: PHI access audit logs are tamper-evident — log entries cannot be modified or deleted after creation
NFR-S6: The platform undergoes third-party penetration testing before public launch and annually thereafter
NFR-S7: HIPAA Business Associate Agreements are executed with all cloud infrastructure and third-party service providers before any PHI is processed

**Scalability**
NFR-SC1: The system architecture supports 10x growth from launch targets (5,000 parent accounts, 500 active doctors) without requiring re-architecture
NFR-SC2: MongoDB collections are designed with horizontal scaling (sharding) in mind from day one; sharding keys chosen during initial schema design
NFR-SC3: The notification pipeline handles concurrent batch reminder dispatch without degrading API response times
NFR-SC4: The system supports multi-region deployment to meet data residency requirements as new countries are activated
NFR-SC5: Background jobs (reminder scheduler, approval timeout enforcer) are idempotent and safe to run across multiple instances without duplicate notification delivery

**Accessibility**
NFR-A1: The React web application meets WCAG 2.1 Level AA compliance
NFR-A2: The React Native mobile app uses platform accessibility APIs (iOS VoiceOver, Android TalkBack) for all interactive elements
NFR-A3: All notification content (email, SMS, push) is written in plain language accessible to a general adult population
NFR-A4: The codebase is structured for internationalization (i18n) from launch — UI strings are externalized and not hard-coded, ready for multi-language support in Phase 2
NFR-A5: Colour contrast ratios for all UI text meet WCAG AA minimums (4.5:1 for normal text, 3:1 for large text)

**Integration Reliability**
NFR-I1: Email and SMS notification integrations achieve 99%+ delivery rate; undeliverable messages trigger automatic fallback to the next channel (push → SMS → email)
NFR-I2: Stripe payment integration is PCI DSS compliant; no raw card data is stored or processed by vital-track servers
NFR-I3: Firebase Cloud Messaging (FCM) push notification integration handles token expiry gracefully — stale tokens are refreshed automatically and the notification is retried
NFR-I4: All third-party integration failures are logged with full context and trigger admin alerts for persistent failures

**Reliability**
NFR-R1: The platform maintains 99.9% uptime during clinic hours (6am–10pm local time per active region)
NFR-R2: Zero vaccination records are lost due to infrastructure failure — all record writes use MongoDB majority write concern before acknowledging success to the client
NFR-R3: The parent mobile app and doctor mobile app provide graceful offline degradation — previously loaded records are readable without network connectivity; write operations are queued and synced on reconnection
NFR-R4: The system has a defined Recovery Time Objective (RTO) of 4 hours and Recovery Point Objective (RPO) of 1 hour for all vaccination record data

### Additional Requirements

From Architecture — Technical requirements that impact implementation:

- **Starter Template (Epic 1, Story 1):** Custom Turborepo monorepo with pnpm workspaces. Three apps: `apps/mobile` (Expo SDK 55, React Native), `apps/web` (Vite + React TS), `apps/api` (Node.js + Express + TypeScript). Two packages: `packages/shared-types` and `packages/config`. Initialized via specific commands documented in Architecture.
- Turborepo for monorepo task orchestration and build caching; Vite for web bundling; Metro for Expo/RN bundling; tsc for API compilation
- TypeScript strict mode throughout all apps and packages
- Styling: NativeWind v5 (mobile), Tailwind CSS v4 (web)
- Testing: Jest + React Native Testing Library (mobile), Vitest + React Testing Library (web), Jest + Supertest (API); tests co-located with source files
- `packages/shared-types` must define all domain interfaces (User, Child, VaccinationRecord, NotificationPayload etc.) and Zod schemas used by both API validation and frontend React Hook Form validation
- `apps/web` — single Vite SPA with role-based routing (Doctor portal + Admin dashboard rendered from JWT role claim)
- `apps/api` — RESTful `/api/v1/[resource]` with separate Express router + middleware stacks per role
- Auth: Custom JWT middleware (jsonwebtoken + bcrypt); 15-min access tokens + refresh token rotation
- RBAC: Role-based Express middleware factory with `requireRole()` / `requirePermission()` pattern
- Data layer: Mongoose + MongoDB Atlas with AWS VPC peering (PHI-isolated, HIPAA BAA available)
- Schema migration: migrate-mongo for tracked, versioned index and schema changes
- Key MongoDB indexes designed day-one: ChildID (unique), parentId, doctorId, dueDate, record state
- QR token security: Signed JWTs with configurable expiry; stored in AuditLog on each scan
- State management: TanStack Query v5 (server state) + Zustand (UI state) across both web and mobile
- Navigation: Expo Router v4 (mobile), React Router v7 (web)
- Forms: React Hook Form + Zod resolver (same Zod schemas from packages/shared-types)
- API documentation: swagger-jsdoc + swagger-ui-express serving `/api/docs` in development
- Error handling: Centralized Express error middleware using typed `AppError` class; all thrown errors use `AppError`, never `new Error()`
- Rate limiting: express-rate-limit with role-differentiated limiters
- Internal domain events: Node.js EventEmitter singleton (`eventBus.ts`); naming: `[resource].[pastTense]`; never call notification service directly from routes
- PHI Audit Logging: Every route reading/writing PHI calls `auditLogService.log()`; audit log writes use majority write concern; audit log collection is insert-only
- Record state machine: ALL transitions in `recordStateService.ts` only; valid transitions: PENDING→APPROVED, PENDING→REJECTED, PENDING→EXPIRED (cron), REJECTED→PENDING (doctor resubmission)
- Background jobs: `reminderScheduler.ts` (daily cron, 14d/7d/day-of reminders) and `approvalTimeout.ts` (PENDING→EXPIRED after 48h, escalate SMS); both must be idempotent
- Deployment: API on AWS ECS Fargate; Web on AWS S3 + CloudFront; DB on MongoDB Atlas; Email via AWS SES; SMS via Twilio
- CI/CD: GitHub Actions (lint → type-check → test → build → deploy); Mobile builds via EAS Build + EAS Submit
- Monitoring: Sentry (errors, HIPAA BAA), AWS CloudWatch (infra), PostHog (analytics, self-hosted option)
- Environment management: AWS SSM Parameter Store (production secrets); .env via dotenv (local); all env vars validated via Zod schema in `packages/config/env.ts`
- API response envelope: `{ success: true, data: {} }` for success, `{ success: false, error: { code, message, details } }` for errors; NEVER return raw objects
- All dates stored in MongoDB as native Date objects (UTC); serialized in API responses as ISO 8601 strings; due dates stored as `YYYY-MM-DD` string
- All field/JSON naming: camelCase throughout; no snake_case in codebase (Stripe webhooks transformed at boundary)

### UX Design Requirements

No UX Design document was found for this project. UX requirements will be derived from PRD user journeys and functional requirements.

### FR Coverage Map

FR1: Epic 2 - Parent registers account with email and password
FR2: Epic 2 - Doctor registers clinic account and submits credentials
FR3: Epic 2 - Users authenticate with email/password and session management
FR4: Epic 2 - Users reset password via email
FR5: Epic 2 - Parent invites caregivers with configurable permissions
FR6: Epic 2 - Caregiver accepts or declines access invitation
FR7: Epic 3 - Parent creates child profile (name + phone number)
FR8: Epic 3 - System prevents duplicate child profiles
FR9: Epic 3 - System auto-generates unique 6-character ChildID + QR
FR10: Epic 3 - Parent views, downloads, and shares ChildID QR code
FR11: Epic 3 - Parent manages multiple child profiles
FR12: Epic 3 - Parent regenerates ChildID QR code, invalidating prior tokens
FR13: Epic 4 - Verified doctor creates vaccination plan via ChildID
FR14: Epic 4 - Doctor adds vaccines to plan with name, due date, notes
FR15: Epic 4 - Doctor uses standard pediatric schedule as template
FR16: Epic 4 - Doctor publishes plan visible immediately to parent
FR17: Epic 4 - Doctor adds ad-hoc external vaccinations to existing plan
FR18: Epic 4 - Parent views complete vaccination plan
FR19: Epic 4 - Parent adds external vaccinations to child's record
FR20: Epic 4 - Doctor views and manages all plans for shared ChildID children
FR21: Epic 5 - Doctor marks vaccine administered with lot number and date
FR22: Epic 5 - System transitions record to pending approval, notifies parent
FR23: Epic 5 - Parent approves pending vaccination record
FR24: Epic 5 - Parent rejects pending record with mandatory note
FR25: Epic 5 - Doctor receives rejection note and can resubmit
FR26: Epic 5 - System auto-expires pending records after 48h timeout
FR27: Epic 5 - Approved records are immutable with append-only amendments
FR28: Epic 5 - System maintains complete audit trail of all state transitions
FR29: Epic 6 - System sends proactive vaccine reminders (14d and 7d before)
FR30: Epic 6 - System sends same-day reminder via all channels
FR31: Epic 6 - System sends approval request notification immediately
FR32: Epic 6 - System escalates unanswered approvals via SMS and admin alert
FR33: Epic 6 - Parent configures notification preferences per channel
FR34: Epic 6 - System tracks delivery status and retries via fallback channels
FR35: Epic 7 - Any verified doctor accesses child plan via ChildID scan/entry
FR36: Epic 7 - ChildID access scoped exclusively to that child's records
FR37: Epic 7 - Parent views timestamped access log of all ChildID accesses
FR38: Epic 7 - Caregiver read-only access cannot modify or approve records
FR39: Epic 7 - Parent revokes caregiver access at any time
FR40: Epic 7 - System enforces signed, time-limited tokens for QR access
FR41: Epic 8 - Doctor submits credential verification with license and docs
FR42: Epic 8 - Platform admin reviews, approves, or rejects verifications
FR43: Epic 8 - Approved doctor accesses full portal; rejected doctor gets path to resubmit
FR44: Epic 8 - Clinic admin manages associated verified doctors
FR45: Epic 8 - Clinic subscribes to paid plan via credit card
FR46: Epic 8 - System handles invoicing, renewals, payment failures via Stripe
FR47: Epic 9 - Platform admin actions pending credential verification requests
FR48: Epic 9 - Platform admin deactivates doctor accounts immediately
FR49: Epic 9 - Parent requests full GDPR data deletion
FR50: Epic 9 - System logs all PHI access in tamper-evident audit log
FR51: Epic 9 - Parent exports child's complete vaccination record
FR52: Epic 9 - System enforces verifiable parental consent (COPPA)
FR53: Epic 9 - System supports regional data residency configuration

## Epic List

### Epic 1: Project Foundation & Developer Infrastructure
Set up the Turborepo monorepo with all apps, shared packages, CI/CD pipeline, and core tooling — enabling all subsequent development work.
**FRs covered:** Architecture starter template requirement (foundational — no direct FRs)

### Epic 2: Identity & Account Management
Users can register accounts, authenticate securely, manage sessions, reset passwords, and parents can invite and manage caregiver access.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

### Epic 3: Child Profile & ChildID System
Parents can create and manage child profiles, generate unique ChildID QR codes, and share or regenerate them as needed.
**FRs covered:** FR7, FR8, FR9, FR10, FR11, FR12

### Epic 4: Vaccination Plan Management
Verified doctors can create, template, and publish vaccination plans; parents can view their child's complete schedule and add external vaccines.
**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20

### Epic 5: Vaccine Administration & Records
Doctors mark vaccines administered; parents approve or reject with mandatory notes; records are immutable with a complete audit trail; pending records auto-expire after 48h.
**FRs covered:** FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28

### Epic 6: Notifications & Reminders
System proactively notifies parents via email, SMS, and push for upcoming vaccines, due dates, and pending approvals; escalation and fallback channels enforced; parents configure preferences.
**FRs covered:** FR29, FR30, FR31, FR32, FR33, FR34

### Epic 7: Secure Access Control & ChildID Sharing
Any verified doctor can access a child's records via ChildID without a prior relationship; parents see a full access log; caregivers have scoped read-only access; time-limited signed tokens enforced.
**FRs covered:** FR35, FR36, FR37, FR38, FR39, FR40

### Epic 8: Doctor Verification & Clinic Management
Doctors submit credentials for admin review and get portal access upon approval; clinics manage associated doctors and subscribe to paid plans via Stripe with automated billing.
**FRs covered:** FR41, FR42, FR43, FR44, FR45, FR46

### Epic 9: Administration, Compliance & Data Governance
Platform admins manage verification queues and deactivate accounts; GDPR deletion, COPPA consent, PHI audit logs, data export, and regional data residency are enforced.
**FRs covered:** FR47, FR48, FR49, FR50, FR51, FR52, FR53

---

## Epic 1: Project Foundation & Developer Infrastructure

**Goal:** Set up the Turborepo monorepo with all apps, shared packages, CI/CD pipeline, and core tooling — enabling all subsequent development work.

### Story 1.1: Monorepo Scaffold & App Skeletons

As a developer,
I want a fully configured Turborepo monorepo with all three app skeletons and two shared packages,
So that the entire team can begin feature development in a consistent, typed, and properly structured codebase.

**Acceptance Criteria:**

**Given** a fresh repository with pnpm and Node.js installed
**When** `pnpm install` is run at the root
**Then** all workspaces resolve without errors and `pnpm turbo build` completes successfully for all apps and packages

**Given** the monorepo is scaffolded
**When** a developer inspects the structure
**Then** the following exist: `apps/mobile` (Expo SDK 55, React Native, NativeWind v5), `apps/web` (Vite + React TS, Tailwind CSS v4), `apps/api` (Node.js + Express + TypeScript), `packages/shared-types`, `packages/config`

**Given** TypeScript strict mode is configured
**When** `pnpm turbo type-check` is run across all apps and packages
**Then** zero TypeScript errors are reported and `strict: true` is present in each `tsconfig.json`

**Given** the mobile app skeleton
**When** `pnpm --filter mobile start` is run
**Then** the Expo dev server starts and a basic "Hello World" screen renders on the Expo Go client

**Given** the web app skeleton
**When** `pnpm --filter web dev` is run
**Then** the Vite dev server starts and a basic placeholder page renders at `localhost:5173`

**Given** the API skeleton
**When** `pnpm --filter api dev` is run
**Then** the Express server starts and `GET /health` returns `{ success: true, data: { status: "ok" } }`

---

### Story 1.2: Shared Types Package & Zod Schemas

As a developer,
I want all domain interfaces and Zod validation schemas defined in `packages/shared-types`,
So that API validation and frontend form validation share a single source of truth with no duplication.

**Acceptance Criteria:**

**Given** the shared-types package is set up
**When** a developer imports from `@vital-track/shared-types`
**Then** TypeScript interfaces are available for: `User`, `Child`, `VaccinationRecord`, `VaccinePlan`, `VaccineEntry`, `AuditLogEntry`, `NotificationPayload`, `CaregiverInvite`

**Given** Zod schemas are defined in `packages/shared-types`
**When** the API imports a Zod schema for request validation
**Then** the same schema is importable in the web and mobile apps for React Hook Form validation without re-definition

**Given** a Zod schema is used for validation
**When** invalid data is passed to `schema.parse()`
**Then** a typed `ZodError` is thrown with field-level error details

**Given** the shared-types package is built
**When** `pnpm --filter shared-types build` is run
**Then** TypeScript declarations (`.d.ts`) are emitted and importable from all other workspaces

**Given** all domain interfaces are defined
**When** a developer reviews `packages/shared-types/src/index.ts`
**Then** all interfaces are exported and no domain model is defined outside this package

---

### Story 1.3: API Foundation — Express Server & Middleware Stack

As a developer,
I want the API server to have centralized error handling, role-differentiated rate limiting, a standard response envelope, and Swagger documentation,
So that all future route implementations follow consistent, safe patterns from the start.

**Acceptance Criteria:**

**Given** any API route throws an `AppError`
**When** the centralized error middleware catches it
**Then** the response is `{ success: false, error: { code, message, details } }` with the correct HTTP status — and a raw `Error` is never returned directly

**Given** a successful API response
**When** any route returns data
**Then** the response envelope is always `{ success: true, data: {} }` — never a raw object

**Given** the `AppError` class is defined
**When** a developer throws `new AppError(400, 'VALIDATION_ERROR', 'Invalid input')`
**Then** the error middleware serializes it correctly into the error envelope format

**Given** express-rate-limit is configured
**When** a user-tier client exceeds the user rate limit
**Then** a `429 Too Many Requests` response is returned; admin-tier routes have stricter separate limits

**Given** the API is running in development
**When** a developer navigates to `GET /api/docs`
**Then** the Swagger UI renders with all currently registered routes documented via `swagger-jsdoc`

**Given** all routes follow the `/api/v1/[resource]` pattern
**When** a developer registers a new route
**Then** it is mounted under `/api/v1/` and appears in the Swagger documentation

---

### Story 1.4: CI/CD Pipeline & Environment Configuration

As a developer,
I want a GitHub Actions CI/CD pipeline and Zod-validated environment configuration,
So that every pull request is automatically verified and no app can start with missing or malformed environment variables.

**Acceptance Criteria:**

**Given** a pull request is opened against `main`
**When** the GitHub Actions CI workflow triggers
**Then** the pipeline runs in order: lint → type-check → test → build, and fails fast on any step error

**Given** all pipeline steps pass
**When** the workflow completes on the `main` branch
**Then** the deploy step runs for the appropriate target (API to ECS, web to S3/CloudFront)

**Given** `packages/config/env.ts` defines a Zod schema for all required environment variables
**When** the API, web, or mobile app starts with a missing or invalid env var
**Then** the process exits immediately with a descriptive error listing the missing/invalid fields

**Given** local development environment
**When** a developer creates a `.env` file based on `.env.example`
**Then** `packages/config/env.ts` validates it successfully and exports typed env vars for use across apps

**Given** production secrets are stored in AWS SSM Parameter Store
**When** the ECS task definition references SSM parameters
**Then** the API process receives all required env vars at runtime and passes Zod validation on startup

**Given** the CI pipeline runs tests
**When** `pnpm turbo test` executes
**Then** Jest (mobile/API) and Vitest (web) both run and report results; pipeline fails if any test fails

---

## Epic 2: Identity & Account Management

**Goal:** Users can register accounts, authenticate securely, manage sessions, reset passwords, and parents can invite and manage caregiver access.

### Story 2.1: Parent & Doctor Registration

As a parent or doctor,
I want to register an account with my email and password,
So that I can access the platform with the correct role and permissions.

**Acceptance Criteria:**

**Given** a new parent submits a valid registration form (name, email, password)
**When** `POST /api/v1/auth/register` is called with `role: "parent"`
**Then** a new User document is created with bcrypt-hashed password, role `parent`, and the response returns `{ success: true, data: { userId, email, role } }`

**Given** a new doctor submits a valid registration form (name, email, password, clinic details)
**When** `POST /api/v1/auth/register` is called with `role: "doctor"`
**Then** a new User document is created with `verificationStatus: "pending"` and the response confirms registration — doctor portal access is not yet granted

**Given** a registration attempt with an already-registered email
**When** `POST /api/v1/auth/register` is called
**Then** a `409 Conflict` AppError is returned: `{ success: false, error: { code: "EMAIL_ALREADY_EXISTS", ... } }`

**Given** a registration attempt with a password shorter than 8 characters
**When** the Zod schema validates the request body
**Then** a `400 Bad Request` AppError is returned with field-level validation details

**Given** a new user is registered
**When** the User document is stored
**Then** the password field is never stored in plain text — only the bcrypt hash is persisted

---

### Story 2.2: User Authentication & Session Management

As a registered user,
I want to log in with my email and password and receive JWT tokens,
So that I can access protected resources and stay authenticated across sessions.

**Acceptance Criteria:**

**Given** a registered user submits valid credentials
**When** `POST /api/v1/auth/login` is called
**Then** the response returns a 15-minute access token (JWT) and a refresh token, with role claim embedded in the access token payload

**Given** a valid refresh token is submitted
**When** `POST /api/v1/auth/refresh` is called
**Then** a new access token and a rotated refresh token are returned; the old refresh token is invalidated immediately

**Given** an expired or invalid access token is used on a protected route
**When** the JWT middleware validates the token
**Then** a `401 Unauthorized` AppError is returned

**Given** a user calls `POST /api/v1/auth/logout`
**When** the request is processed
**Then** the current refresh token is invalidated and can no longer be used for rotation

**Given** the RBAC middleware is applied to a route requiring role `doctor`
**When** a user with role `parent` calls that route
**Then** a `403 Forbidden` AppError is returned

**Given** suspicious activity is detected (e.g., token reuse after rotation)
**When** the refresh token middleware detects the anomaly
**Then** all refresh tokens for that user are invalidated and a `401` is returned

---

### Story 2.3: Password Reset via Email

As a registered user,
I want to reset my password via a secure email link,
So that I can regain access to my account if I forget my password.

**Acceptance Criteria:**

**Given** a user submits their registered email to `POST /api/v1/auth/forgot-password`
**When** the request is processed
**Then** a time-limited password reset token (JWT, 1 hour expiry) is generated and a reset email is dispatched via AWS SES — the response is always `200 OK` regardless of whether the email exists (no user enumeration)

**Given** a user clicks the reset link and submits a new password to `POST /api/v1/auth/reset-password`
**When** the reset token is valid and not expired
**Then** the user's password is updated with a new bcrypt hash, all existing refresh tokens are invalidated, and a confirmation response is returned

**Given** a reset token that has already been used or has expired
**When** `POST /api/v1/auth/reset-password` is called
**Then** a `400 Bad Request` AppError is returned: `{ code: "INVALID_OR_EXPIRED_TOKEN" }`

**Given** a new password that fails validation (too short, no complexity)
**When** the Zod schema validates the request
**Then** a `400 Bad Request` with field-level errors is returned before any token is consumed

---

### Story 2.4: Caregiver Invitation & Access Management

As a parent,
I want to invite a caregiver to access my account with a configurable permission level, and revoke that access at any time,
So that trusted caregivers can view my child's records without full account access.

**Acceptance Criteria:**

**Given** a parent submits a caregiver invite (email, permission level: `read-only`)
**When** `POST /api/v1/caregivers/invite` is called by an authenticated parent
**Then** a `CaregiverInvite` document is created with status `pending` and an invite email is sent to the caregiver via AWS SES

**Given** a caregiver receives an invite and calls `POST /api/v1/caregivers/invite/:token/accept`
**When** the invite token is valid and not expired
**Then** the caregiver is linked to the parent's account with `read-only` permission and the invite status transitions to `accepted`

**Given** a caregiver calls `POST /api/v1/caregivers/invite/:token/decline`
**When** the invite token is valid
**Then** the invite status transitions to `declined` and no access is granted

**Given** a parent calls `DELETE /api/v1/caregivers/:caregiverId`
**When** the request is processed
**Then** the caregiver's access is immediately revoked, all their active sessions for this parent's data are invalidated, and they can no longer view any child records

**Given** a caregiver with `read-only` permission attempts to call a write endpoint (e.g., approve a vaccination record)
**When** the `requirePermission()` middleware evaluates the request
**Then** a `403 Forbidden` AppError is returned

---

## Epic 3: Child Profile & ChildID System

**Goal:** Parents can create and manage child profiles, generate unique ChildID QR codes, and share or regenerate them as needed.

### Story 3.1: Create & Manage Child Profiles

As a parent,
I want to create child profiles using my child's name and my phone number, and manage multiple profiles under my account,
So that each of my children has a unique, trackable health record.

**Acceptance Criteria:**

**Given** an authenticated parent submits a valid child profile (childName, parentPhoneNumber)
**When** `POST /api/v1/children` is called
**Then** a new Child document is created linked to the parent's userId, and the response returns `{ success: true, data: { childId, childName, createdAt } }`

**Given** a parent attempts to create a child profile with the same name and phone number as an existing profile
**When** `POST /api/v1/children` is called
**Then** a `409 Conflict` AppError is returned: `{ code: "DUPLICATE_CHILD_PROFILE" }` — no duplicate document is created

**Given** an authenticated parent calls `GET /api/v1/children`
**When** the request is processed
**Then** all child profiles linked to that parent's userId are returned in the response array

**Given** an authenticated parent calls `GET /api/v1/children/:childId`
**When** the childId belongs to that parent
**Then** the full child profile is returned; if the childId belongs to a different parent, a `403 Forbidden` AppError is returned

**Given** an authenticated parent updates a child profile via `PATCH /api/v1/children/:childId`
**When** valid fields (e.g., childName) are submitted
**Then** the Child document is updated and the updated profile is returned in the response

---

### Story 3.2: ChildID Generation & QR Code

As a parent,
I want each of my child's profiles to have a unique 6-character ChildID and a downloadable QR code,
So that I can share the ChildID with any verified doctor to give them access to my child's vaccination records.

**Acceptance Criteria:**

**Given** a new Child document is created
**When** the creation handler runs
**Then** a unique 6-character alphanumeric ChildID is automatically generated server-side in under 1 second, stored on the Child document with a unique index, and no two children share the same ChildID

**Given** a parent calls `GET /api/v1/children/:childId/qr`
**When** the request is processed
**Then** a signed JWT QR access token is generated with a configurable expiry, a QR code image (PNG) is returned in the response, and the token generation event is logged via `auditLogService.log()`

**Given** a parent calls `GET /api/v1/children/:childId/qr?format=download`
**When** the request is processed
**Then** the response includes a downloadable QR code image with appropriate `Content-Disposition` headers

**Given** a QR access token has expired
**When** a doctor attempts to use it to access a child's records
**Then** a `401 Unauthorized` AppError is returned: `{ code: "QR_TOKEN_EXPIRED" }` and the token cannot be reused

**Given** a parent shares their child's ChildID code (text, not QR)
**When** a doctor manually enters it at `POST /api/v1/children/lookup`
**Then** the child's profile is returned if the ChildID exists and the doctor is verified; otherwise a `404` AppError is returned

---

### Story 3.3: ChildID Regeneration & Token Invalidation

As a parent,
I want to regenerate my child's ChildID QR code and invalidate all previously issued QR tokens,
So that I can revoke access from anyone who previously had my child's QR code.

**Acceptance Criteria:**

**Given** an authenticated parent calls `POST /api/v1/children/:childId/regenerate-qr`
**When** the request is processed
**Then** a new 6-character ChildID is generated, the Child document is updated, and all previously issued QR access tokens for that child are invalidated

**Given** a QR token was issued before a regeneration event
**When** a doctor attempts to use that old token to access records
**Then** a `401 Unauthorized` AppError is returned: `{ code: "QR_TOKEN_INVALIDATED" }` — the old token cannot be used

**Given** a ChildID regeneration occurs
**When** the event is processed
**Then** the regeneration is logged via `auditLogService.log()` with the parent's userId, timestamp, and action type `CHILDID_REGENERATED`

**Given** the parent regenerates a ChildID
**When** they subsequently call `GET /api/v1/children/:childId/qr`
**Then** a new valid QR token is generated for the new ChildID and the old ChildID is no longer resolvable via `POST /api/v1/children/lookup`

---

## Epic 4: Vaccination Plan Management

**Goal:** Verified doctors can create, template, and publish vaccination plans; parents can view their child's complete schedule and add external vaccines.

### Story 4.1: Doctor Creates & Manages a Vaccination Plan

As a verified doctor,
I want to create a vaccination plan for a child using their ChildID and add individual vaccines with due dates,
So that parents have a structured, up-to-date schedule for their child's immunisation.

**Acceptance Criteria:**

**Given** an authenticated, verified doctor submits a ChildID to `POST /api/v1/plans`
**When** the ChildID resolves to an existing child
**Then** a new VaccinePlan document is created in `draft` status linked to that child, and the response returns `{ success: true, data: { planId, childId, status: "draft" } }`

**Given** a doctor without `verificationStatus: "approved"` calls any plan management endpoint
**When** the `requireRole("doctor")` + verification guard middleware runs
**Then** a `403 Forbidden` AppError is returned: `{ code: "DOCTOR_NOT_VERIFIED" }`

**Given** a verified doctor calls `POST /api/v1/plans/:planId/vaccines`
**When** a valid vaccine entry is submitted (vaccineName, dueDate as `YYYY-MM-DD`, optional notes)
**Then** a VaccineEntry document is created linked to the plan, and the plan's vaccine list is updated

**Given** a verified doctor calls `GET /api/v1/plans` with their auth token
**When** the request is processed
**Then** all plans for children who have shared their ChildID with that doctor are returned, scoped exclusively to those children

**Given** a verified doctor calls `PATCH /api/v1/plans/:planId/vaccines/:vaccineId`
**When** valid updated fields are submitted (e.g., dueDate, notes)
**Then** the VaccineEntry is updated and `auditLogService.log()` records the modification

---

### Story 4.2: Standard Pediatric Schedule Template

As a verified doctor,
I want to apply a standard pediatric vaccination schedule as a template when creating a plan,
So that I don't have to manually enter every routine vaccine for each child.

**Acceptance Criteria:**

**Given** a verified doctor calls `GET /api/v1/plans/templates`
**When** the request is processed
**Then** a list of available schedule templates is returned (e.g., WHO standard pediatric schedule) with vaccine names and recommended age-based due date offsets

**Given** a verified doctor calls `POST /api/v1/plans/:planId/apply-template`
**When** a valid templateId and child date-of-birth are submitted
**Then** all vaccines from the template are added to the plan as VaccineEntry documents with due dates calculated from the child's DOB, and existing manually-added entries are preserved

**Given** a template is applied to a plan
**When** the doctor reviews the plan
**Then** each template-derived vaccine entry is clearly marked with its source template and can be individually edited or removed

**Given** a doctor applies a template to a plan that already has template entries
**When** `POST /api/v1/plans/:planId/apply-template` is called again with the same template
**Then** duplicate entries are not created — existing template entries are updated in place

---

### Story 4.3: Publish Plan & Parent View

As a verified doctor,
I want to publish a vaccination plan so it becomes immediately visible to the linked parent,
So that parents are informed of their child's complete immunisation schedule.

**Acceptance Criteria:**

**Given** a verified doctor calls `POST /api/v1/plans/:planId/publish`
**When** the plan is in `draft` status and contains at least one vaccine entry
**Then** the plan status transitions to `published`, a `vaccinationPlan.published` domain event is emitted via `eventBus.ts`, and the response confirms publication

**Given** a doctor attempts to publish a plan with zero vaccine entries
**When** `POST /api/v1/plans/:planId/publish` is called
**Then** a `400 Bad Request` AppError is returned: `{ code: "PLAN_HAS_NO_VACCINES" }`

**Given** a plan is published
**When** the parent calls `GET /api/v1/children/:childId/plan`
**Then** the full vaccination plan is returned within 5 minutes of publication, including all vaccine entries categorised as upcoming, administered, or overdue based on due date and current date

**Given** an authenticated parent views their child's plan
**When** the request is processed
**Then** `auditLogService.log()` records the PHI read event with the parent's userId, childId, timestamp, and action `PLAN_VIEWED`

**Given** a parent's child has no published plan
**When** `GET /api/v1/children/:childId/plan` is called
**Then** a `404 Not Found` AppError is returned: `{ code: "NO_PUBLISHED_PLAN" }`

---

### Story 4.4: Ad-hoc & External Vaccine Entries

As a verified doctor or parent,
I want to add vaccines that were administered outside the standard plan to a child's record,
So that the child's complete vaccination history is captured in one place.

**Acceptance Criteria:**

**Given** a verified doctor calls `POST /api/v1/plans/:planId/vaccines?type=external`
**When** a valid ad-hoc vaccine entry is submitted (vaccineName, administeredDate, optional notes)
**Then** a VaccineEntry document is created with `entryType: "external"` and `addedBy: doctorId`, linked to the existing plan

**Given** an authenticated parent calls `POST /api/v1/children/:childId/external-vaccines`
**When** a valid external vaccine entry is submitted (vaccineName, administeredDate, optional notes)
**Then** a VaccineEntry document is created with `entryType: "external"` and `addedBy: parentId`, associated with the child's record

**Given** either a doctor or parent adds an external vaccine entry
**When** the parent views `GET /api/v1/children/:childId/plan`
**Then** external entries appear in the full plan alongside plan-originated entries, clearly labelled with their `entryType` and who added them

**Given** a parent adds an external vaccine with a future administeredDate
**When** the Zod schema validates the request
**Then** a `400 Bad Request` AppError is returned: `{ code: "INVALID_ADMINISTERED_DATE" }` — administered dates cannot be in the future

---

## Epic 5: Vaccine Administration & Records

**Goal:** Doctors mark vaccines administered; parents approve or reject with mandatory notes; records are immutable with a complete audit trail; pending records auto-expire after 48h.

### Story 5.1: Doctor Submits Vaccine Administration Record

As a verified doctor,
I want to mark a vaccine as administered with the lot number and administration date,
So that the parent is notified and can approve the record to make it official.

**Acceptance Criteria:**

**Given** a verified doctor calls `POST /api/v1/records` with vaccineEntryId, lotNumber, and administeredDate
**When** the request is processed
**Then** a VaccinationRecord document is created with `status: "PENDING"`, linked to the vaccine entry, child, and doctor; the response returns `{ success: true, data: { recordId, status: "PENDING" } }`

**Given** a record is created with `status: "PENDING"`
**When** the creation handler completes
**Then** a `vaccine.submitted` domain event is emitted via `eventBus.ts` and `auditLogService.log()` records the submission with majority write concern before the response is sent

**Given** a doctor submits an administration record for a vaccine that already has an `APPROVED` record
**When** `POST /api/v1/records` is called
**Then** a `409 Conflict` AppError is returned: `{ code: "RECORD_ALREADY_APPROVED" }` — duplicate submissions are blocked

**Given** a doctor submits a record with a future administeredDate
**When** the Zod schema validates the request
**Then** a `400 Bad Request` AppError is returned: `{ code: "INVALID_ADMINISTERED_DATE" }`

**Given** a record is submitted
**When** the parent calls `GET /api/v1/children/:childId/records`
**Then** the new `PENDING` record appears in the list immediately

---

### Story 5.2: Parent Approves or Rejects Administration Record

As a parent,
I want to approve or reject a pending vaccine administration record,
So that only verified, correct records become part of my child's permanent health history.

**Acceptance Criteria:**

**Given** an authenticated parent calls `POST /api/v1/records/:recordId/approve`
**When** the record is in `PENDING` status and belongs to their child
**Then** `recordStateService.ts` transitions the status to `APPROVED`, a `vaccine.approved` domain event is emitted, and `auditLogService.log()` records the transition with majority write concern

**Given** a parent attempts to approve a record not in `PENDING` status (e.g., already `APPROVED` or `EXPIRED`)
**When** `POST /api/v1/records/:recordId/approve` is called
**Then** a `409 Conflict` AppError is returned: `{ code: "INVALID_STATE_TRANSITION" }`

**Given** an authenticated parent calls `POST /api/v1/records/:recordId/reject` with a rejection note
**When** the record is in `PENDING` status
**Then** `recordStateService.ts` transitions the status to `REJECTED`, the note is stored on the record, a `vaccine.rejected` domain event is emitted, and `auditLogService.log()` records the transition

**Given** a parent attempts to reject a record without providing a note
**When** the Zod schema validates the request body
**Then** a `400 Bad Request` AppError is returned: `{ code: "REJECTION_NOTE_REQUIRED" }`

**Given** a record belonging to a different parent's child
**When** any parent calls approve or reject on it
**Then** a `403 Forbidden` AppError is returned — cross-child record access is blocked

---

### Story 5.3: Doctor Resubmission After Rejection

As a verified doctor,
I want to receive the parent's rejection note and resubmit an amended administration record,
So that I can correct any errors and give the parent an updated record to approve.

**Acceptance Criteria:**

**Given** a record transitions to `REJECTED`
**When** the `vaccine.rejected` domain event is processed
**Then** the doctor receives a notification (in-app at minimum) containing the parent's rejection note and the recordId

**Given** a verified doctor calls `POST /api/v1/records/:recordId/resubmit` with an amended lotNumber or administeredDate
**When** the record is in `REJECTED` status
**Then** `recordStateService.ts` transitions the status back to `PENDING`, the amendment is stored as an append-only entry on the record's amendment history, and `auditLogService.log()` records the resubmission

**Given** a doctor attempts to resubmit a record not in `REJECTED` status
**When** `POST /api/v1/records/:recordId/resubmit` is called
**Then** a `409 Conflict` AppError is returned: `{ code: "INVALID_STATE_TRANSITION" }`

**Given** a record is resubmitted
**When** the parent views the record
**Then** the full amendment history is visible, showing the original submission, the rejection note, and the resubmitted values in chronological order

---

### Story 5.4: Approval Timeout & Record Expiry

As the platform,
I want pending approval records to automatically transition to `EXPIRED` after 48 hours without parent action,
So that unactioned records do not remain in a permanent pending state.

**Acceptance Criteria:**

**Given** a VaccinationRecord has been in `PENDING` status for 48 hours without parent action
**When** the `approvalTimeout.ts` cron job runs
**Then** `recordStateService.ts` transitions the record to `EXPIRED`, a `vaccine.expired` domain event is emitted, and `auditLogService.log()` records the transition with majority write concern

**Given** the `approvalTimeout.ts` cron job runs multiple times (idempotency check)
**When** it processes a record already in `EXPIRED` status
**Then** no duplicate transitions or duplicate audit log entries are created

**Given** a record transitions to `EXPIRED`
**When** the `vaccine.expired` event is processed
**Then** a notification is dispatched to the platform admin if the escalation timeout threshold is also exceeded (per FR32 — implemented in Epic 6)

**Given** a parent attempts to approve or reject an `EXPIRED` record
**When** `POST /api/v1/records/:recordId/approve` or `reject` is called
**Then** a `409 Conflict` AppError is returned: `{ code: "INVALID_STATE_TRANSITION" }`

**Given** the cron job is deployed across multiple API instances
**When** it runs simultaneously on two instances
**Then** only one instance processes each expiry transition — no duplicate state changes occur

---

### Story 5.5: Record Immutability, Amendments & Audit Trail

As the platform,
I want approved vaccination records to be immutable and all state transitions to be captured in a tamper-evident audit trail,
So that the integrity of a child's health history is guaranteed and fully traceable.

**Acceptance Criteria:**

**Given** a VaccinationRecord is in `APPROVED` status
**When** any endpoint attempts to directly modify the record's core fields (lotNumber, administeredDate, vaccineEntryId)
**Then** a `403 Forbidden` AppError is returned: `{ code: "RECORD_IMMUTABLE" }` — direct mutation of approved records is blocked at the service layer

**Given** a correction is needed on an `APPROVED` record
**When** an authorised actor calls `POST /api/v1/records/:recordId/amend`
**Then** the amendment is stored as an append-only entry in the record's `amendments` array with actorId, timestamp, changed fields, and reason — the original fields are never overwritten

**Given** any state transition occurs on a VaccinationRecord
**When** `auditLogService.log()` is called
**Then** a new AuditLog document is created with: actorId, actorRole, childId, recordId, action, previousStatus, newStatus, and timestamp — using MongoDB majority write concern before the transition response is returned

**Given** the AuditLog collection
**When** any process attempts to update or delete an existing audit log entry
**Then** the operation is rejected at the database layer — the collection enforces insert-only behaviour

**Given** an authenticated parent calls `GET /api/v1/children/:childId/audit-log`
**When** the request is processed
**Then** a chronological list of all state transitions for that child's records is returned, and `auditLogService.log()` records this read event itself

---

## Epic 6: Notifications & Reminders

**Goal:** System proactively notifies parents via email, SMS, and push for upcoming vaccines, due dates, and pending approvals; escalation and fallback channels enforced; parents configure preferences.

### Story 6.1: Notification Service & Channel Integrations

As the platform,
I want a unified notification service that dispatches messages via email, SMS, and push with delivery tracking and fallback retry,
So that all notification-sending epics have a reliable, consistent delivery layer to build on.

**Acceptance Criteria:**

**Given** any internal domain event triggers a notification
**When** the notification service receives the request
**Then** it is dispatched via `eventBus.ts` — the notification service is never called directly from a route handler

**Given** the notification service dispatches an email
**When** AWS SES processes the send request
**Then** delivery status is recorded on the notification attempt document; on failure, the service retries via the fallback chain (push → SMS → email)

**Given** the notification service dispatches an SMS
**When** Twilio processes the send request
**Then** delivery status is recorded; on failure, fallback to the next available channel is attempted

**Given** the notification service dispatches a push notification via FCM
**When** FCM returns a stale/invalid device token error
**Then** the token is refreshed automatically, the notification is retried once, and the updated token is persisted on the user's device record

**Given** a notification delivery attempt fails across all fallback channels
**When** all retries are exhausted
**Then** the failure is logged with full context (channel, error, userId, notificationType) and an admin alert is triggered for persistent failures

**Given** a notification attempt is made
**When** the attempt completes (success or failure)
**Then** a NotificationAttempt document is created with: userId, channel, notificationType, status, timestamp, and any error details

---

### Story 6.2: Vaccine Due Date Reminders

As a parent,
I want to receive proactive reminders via email, SMS, and push when my child's vaccines are due,
So that I never miss an upcoming immunisation appointment.

**Acceptance Criteria:**

**Given** a vaccine entry has a dueDate 14 days from today
**When** the `reminderScheduler.ts` daily cron runs
**Then** a reminder notification is dispatched to the parent via all enabled channels, within 1 hour of the scheduled reminder window opening

**Given** a vaccine entry has a dueDate 7 days from today
**When** the `reminderScheduler.ts` daily cron runs
**Then** a second reminder notification is dispatched to the parent via all enabled channels

**Given** a vaccine entry has a dueDate equal to today
**When** the `reminderScheduler.ts` daily cron runs
**Then** a same-day reminder is dispatched to the parent via all enabled channels

**Given** the `reminderScheduler.ts` cron runs multiple times in the same day (idempotency check)
**When** a reminder for a specific vaccine+dueDate combination has already been sent today
**Then** no duplicate notifications are dispatched

**Given** a vaccine has already been administered and approved
**When** the `reminderScheduler.ts` cron evaluates due dates
**Then** no reminder is sent for that vaccine entry

**Given** the cron runs across multiple API instances simultaneously
**When** both instances evaluate the same due date
**Then** only one set of reminders is dispatched — duplicate delivery is prevented via idempotency key or distributed lock

---

### Story 6.3: Approval Request & Escalation Notifications

As a parent,
I want to be notified immediately when a doctor submits a vaccine administration record, and receive escalating reminders if I don't respond,
So that I can take timely action on pending approvals.

**Acceptance Criteria:**

**Given** a `vaccine.submitted` domain event is emitted
**When** the notification service processes the event
**Then** an approval request notification is dispatched to the parent via email, SMS, and push within 2 minutes of the doctor's submission

**Given** the approval request notification has been sent
**When** 24 hours elapse without parent action (configurable escalation timeout)
**Then** an escalation SMS is sent to the parent

**Given** the escalation SMS is sent
**When** a further configurable timeout elapses without parent action
**Then** a platform admin alert is triggered notifying the admin of the unactioned approval request

**Given** a parent approves or rejects the record before the escalation timeout
**When** the approval/rejection is processed
**Then** all pending escalation timers for that record are cancelled and no further escalation notifications are sent

**Given** a `vaccine.approved` or `vaccine.rejected` domain event is emitted
**When** the notification service processes the event
**Then** the originating doctor receives a notification of the outcome within 2 minutes

---

### Story 6.4: Parent Notification Preferences

As a parent,
I want to configure which notification channels I receive alerts on,
So that I only get notifications through the channels I prefer.

**Acceptance Criteria:**

**Given** an authenticated parent calls `PATCH /api/v1/users/me/notification-preferences`
**When** a valid preferences object is submitted (e.g., `{ email: true, sms: false, push: true }`)
**Then** the parent's NotificationPreferences document is updated and the response confirms the new settings

**Given** a parent has disabled a specific channel (e.g., `sms: false`)
**When** the notification service evaluates channels for that parent
**Then** SMS notifications are skipped for that parent and only enabled channels are used

**Given** a parent has disabled all channels
**When** the notification service attempts to send a critical approval request notification
**Then** the notification is still attempted via the last-resort channel (email) to ensure critical alerts are not silently dropped, and a warning is logged

**Given** an authenticated parent calls `GET /api/v1/users/me/notification-preferences`
**When** the request is processed
**Then** the current preferences are returned with all three channel states (email, sms, push)

---

## Epic 7: Secure Access Control & ChildID Sharing

**Goal:** Any verified doctor can access a child's records via ChildID without a prior relationship; parents see a full access log; caregivers have scoped read-only access; time-limited signed tokens enforced.

**Note:** Caregiver read-only enforcement (FR38) and caregiver revocation (FR39) were implemented in Story 2.4.

### Story 7.1: Doctor ChildID-Based Record Access

As a verified doctor,
I want to access a child's vaccination plan by scanning or manually entering their ChildID,
So that I can view their records and provide care without needing a pre-existing relationship with the parent's clinic.

**Acceptance Criteria:**

**Given** a verified doctor submits a valid ChildID to `POST /api/v1/access/childid`
**When** the ChildID resolves to an existing child
**Then** a scoped access token is returned granting read access to that child's vaccination plan only, and `auditLogService.log()` records the access event with doctorId, childId, timestamp, and `accessType: "CHILDID_ACCESS"`

**Given** a verified doctor uses the scoped access token to call `GET /api/v1/children/:childId/plan`
**When** the token is valid and not expired
**Then** only that specific child's vaccination plan is returned — no other patients' records are accessible with this token

**Given** a verified doctor with a valid scoped token attempts to access a different child's records
**When** any endpoint is called with a mismatched childId
**Then** a `403 Forbidden` AppError is returned: `{ code: "ACCESS_SCOPE_VIOLATION" }` — lateral access between patients is blocked

**Given** a doctor without `verificationStatus: "approved"` submits a ChildID
**When** `POST /api/v1/access/childid` is called
**Then** a `403 Forbidden` AppError is returned: `{ code: "DOCTOR_NOT_VERIFIED" }`

**Given** an invalid or non-existent ChildID is submitted
**When** `POST /api/v1/access/childid` is called
**Then** a `404 Not Found` AppError is returned: `{ code: "CHILDID_NOT_FOUND" }`

---

### Story 7.2: Parent Access Log & Audit Visibility

As a parent,
I want to see a timestamped log of every party that has accessed my child's record via ChildID,
So that I have full visibility of who has viewed my child's health information.

**Acceptance Criteria:**

**Given** an authenticated parent calls `GET /api/v1/children/:childId/access-log`
**When** the request is processed
**Then** a chronological list of all ChildID-based access events is returned, each entry containing: actorId, actorRole, actorName, accessType, timestamp, and ChildID used

**Given** a verified doctor accesses a child's records via ChildID
**When** the access event is logged by `auditLogService.log()`
**Then** the entry appears in the parent's access log within 5 minutes and is never modifiable after creation

**Given** the access log contains entries from multiple doctors across different dates
**When** the parent calls `GET /api/v1/children/:childId/access-log?from=YYYY-MM-DD&to=YYYY-MM-DD`
**Then** only access events within the specified date range are returned

**Given** a parent views the access log
**When** the read event occurs
**Then** `auditLogService.log()` records the parent's own read of the access log with `action: "ACCESS_LOG_VIEWED"`

**Given** a parent with multiple children
**When** they call the access log endpoint for a specific childId
**Then** only access events for that specific child are returned — never events for other children

---

### Story 7.3: Signed Time-Limited QR Token Enforcement

As the platform,
I want all QR-based record access to use signed, time-limited tokens that are automatically invalidated on expiry or regeneration,
So that physical QR codes cannot be misused after their intended access window.

**Acceptance Criteria:**

**Given** a QR access token is generated via `GET /api/v1/children/:childId/qr`
**When** the token is inspected
**Then** it is a signed JWT containing: childId, issuedAt, expiresAt (configurable window, default 24h), and a unique jti (JWT ID) — it cannot be modified without invalidating the signature

**Given** a doctor scans a QR code and submits the token to `POST /api/v1/access/qr`
**When** the token signature and expiry are validated
**Then** if valid: a scoped access token is issued and the scan is logged in AuditLog with the jti; if expired: a `401 Unauthorized` AppError is returned: `{ code: "QR_TOKEN_EXPIRED" }`

**Given** a valid QR token is used once to gain access
**When** the same token jti is submitted again
**Then** the system checks the AuditLog for prior use — if the jti has already been used, a `401` AppError is returned: `{ code: "QR_TOKEN_ALREADY_USED" }` — tokens are single-use

**Given** a parent regenerates their child's ChildID (Story 3.3)
**When** any previously issued QR token for that child is submitted
**Then** a `401 Unauthorized` AppError is returned: `{ code: "QR_TOKEN_INVALIDATED" }` — all pre-regeneration tokens are rejected regardless of their expiry time

**Given** the token expiry window is configurable via environment variable
**When** the env var is updated and the API restarts
**Then** newly generated tokens use the updated expiry window; previously issued tokens retain their original expiry

---

## Epic 8: Doctor Verification & Clinic Management

**Goal:** Doctors submit credentials for admin review and get portal access upon approval; clinics manage associated doctors and subscribe to paid plans via Stripe with automated billing.

### Story 8.1: Doctor Credential Submission & Verification Queue

As a doctor,
I want to submit my medical credentials for platform verification and receive portal access upon approval,
So that I can create vaccination plans and access child records as a trusted, verified provider.

**Acceptance Criteria:**

**Given** an authenticated doctor calls `POST /api/v1/verification/submit`
**When** a valid submission is provided (medicalLicenseNumber, countryOfPractice, supportingDocumentUrl)
**Then** the doctor's `verificationStatus` transitions to `"pending"`, a VerificationRequest document is created, and a confirmation response is returned

**Given** a doctor with `verificationStatus: "pending"` attempts to resubmit credentials
**When** `POST /api/v1/verification/submit` is called
**Then** a `409 Conflict` AppError is returned: `{ code: "VERIFICATION_ALREADY_PENDING" }`

**Given** a platform admin calls `GET /api/v1/admin/verification-queue`
**When** the request is processed
**Then** all pending VerificationRequest documents are returned, ordered by submission date, with doctor details and submitted credential information

**Given** a platform admin calls `POST /api/v1/admin/verification/:requestId/approve`
**When** the request is processed
**Then** the doctor's `verificationStatus` transitions to `"approved"`, all doctor portal access guards (`requireRole("doctor")` + verification check) now pass for that user, and a notification is sent to the doctor confirming approval

**Given** a platform admin calls `POST /api/v1/admin/verification/:requestId/reject` with a reason
**When** the request is processed
**Then** the doctor's `verificationStatus` transitions to `"rejected"`, the rejection reason is stored, a notification is sent to the doctor with the reason and instructions to resubmit, and `verificationStatus` is reset to allow a new submission

**Given** a rejected doctor calls `POST /api/v1/verification/submit` again with corrected credentials
**When** the request is processed
**Then** a new VerificationRequest is created and the doctor's `verificationStatus` returns to `"pending"`

---

### Story 8.2: Clinic Doctor Management

As a clinic admin,
I want to view and manage which verified doctors are associated with my clinic's subscription,
So that I can maintain accurate records of who is practising under our clinic account.

**Acceptance Criteria:**

**Given** an authenticated clinic admin calls `GET /api/v1/clinic/doctors`
**When** the request is processed
**Then** all verified doctors linked to the clinic's subscription are returned with their name, verificationStatus, and association date

**Given** a clinic admin calls `POST /api/v1/clinic/doctors/:doctorId/add`
**When** the doctor exists and has `verificationStatus: "approved"`
**Then** the doctor is linked to the clinic and a confirmation response is returned

**Given** a clinic admin attempts to add a doctor with `verificationStatus: "pending"` or `"rejected"`
**When** `POST /api/v1/clinic/doctors/:doctorId/add` is called
**Then** a `403 Forbidden` AppError is returned: `{ code: "DOCTOR_NOT_VERIFIED" }`

**Given** a clinic admin calls `DELETE /api/v1/clinic/doctors/:doctorId`
**When** the request is processed
**Then** the doctor is unlinked from the clinic; any existing ChildID-based access tokens issued by that doctor remain valid until their natural expiry

---

### Story 8.3: Clinic Subscription & Stripe Billing

As a clinic admin,
I want to subscribe to a paid plan via credit card with monthly or annual billing, and have invoices and renewals handled automatically,
So that the clinic maintains uninterrupted access to the doctor portal without manual billing intervention.

**Acceptance Criteria:**

**Given** a clinic admin initiates a subscription via `POST /api/v1/clinic/subscription`
**When** a billing interval (`monthly` or `annual`) is submitted
**Then** a Stripe Checkout session is created and the redirect URL is returned — no raw card data touches vital-track servers (PCI DSS compliant)

**Given** a Stripe `checkout.session.completed` webhook is received
**When** the webhook handler processes the event
**Then** the clinic's `subscriptionStatus` is set to `"active"`, the Stripe customerId and subscriptionId are stored on the Clinic document, and snake_case Stripe fields are transformed to camelCase at the boundary

**Given** a Stripe `invoice.payment_failed` webhook is received
**When** the webhook handler processes the event
**Then** the clinic admin receives a payment failure notification via email and the clinic's `subscriptionStatus` is updated to `"past_due"`

**Given** a Stripe `customer.subscription.deleted` webhook is received
**When** the webhook handler processes the event
**Then** the clinic's `subscriptionStatus` is set to `"cancelled"` and all associated doctors lose portal access until the subscription is renewed

**Given** a Stripe `invoice.paid` webhook is received for a subscription renewal
**When** the webhook handler processes the event
**Then** the clinic's `subscriptionStatus` is confirmed as `"active"` and a renewal confirmation is logged

**Given** an incoming Stripe webhook
**When** the webhook handler validates the request
**Then** the Stripe signature is verified using the webhook signing secret before any processing occurs — unverified webhooks are rejected with `400`

---

## Epic 9: Administration, Compliance & Data Governance

**Goal:** Platform admins manage verification queues and deactivate accounts; GDPR deletion, COPPA consent, PHI audit logs, data export, and regional data residency enforced.

### Story 9.1: Admin Verification Queue & Doctor Deactivation

As a platform admin,
I want to action all pending doctor credential verification requests from a managed queue and deactivate doctor accounts when necessary,
So that only trusted, verified doctors access the platform and bad actors can be removed immediately.

**Acceptance Criteria:**

**Given** a platform admin calls `GET /api/v1/admin/verification-queue`
**When** the request is processed
**Then** all pending VerificationRequest documents are returned with filtering support by status (`pending`, `approved`, `rejected`) and date range

**Given** a platform admin calls `GET /api/v1/admin/verification-queue` with `?status=pending`
**When** multiple pending requests exist
**Then** only pending requests are returned, ordered by submission date ascending (oldest first)

**Given** a platform admin calls `POST /api/v1/admin/doctors/:doctorId/deactivate`
**When** the request is processed
**Then** the doctor's account is immediately deactivated: `verificationStatus` is set to `"deactivated"`, all active JWT sessions are invalidated, all ChildID-based access tokens issued by that doctor are revoked, and a deactivation audit entry is logged

**Given** a deactivated doctor attempts to log in
**When** `POST /api/v1/auth/login` is called
**Then** a `403 Forbidden` AppError is returned: `{ code: "ACCOUNT_DEACTIVATED" }`

**Given** a deactivated doctor's previously issued scoped access token is used
**When** any protected endpoint validates the token
**Then** the token is rejected with `401 Unauthorized`: `{ code: "ACCOUNT_DEACTIVATED" }`

---

### Story 9.2: GDPR Account & Data Deletion

As a parent,
I want to request full deletion of my account and all associated child data,
So that my personal and my children's health data is completely removed from the platform in compliance with GDPR right to erasure.

**Acceptance Criteria:**

**Given** an authenticated parent calls `POST /api/v1/users/me/delete-request`
**When** the request is processed
**Then** a DeletionRequest document is created with status `"pending"`, a confirmation email is sent to the parent, and a 30-day grace period is initiated before permanent deletion

**Given** a DeletionRequest reaches the end of the grace period
**When** the deletion job processes it
**Then** the parent's User document, all Child documents, all VaccinationRecord documents, all CaregiverInvite documents, and all NotificationPreferences are permanently deleted from the database

**Given** a deletion is processed
**When** the job completes
**Then** AuditLog entries referencing the deleted user are anonymised (actorId replaced with `"[DELETED]"`) rather than deleted — audit trail integrity is preserved per HIPAA requirements

**Given** a parent calls `POST /api/v1/users/me/delete-request/cancel` within the grace period
**When** the request is processed
**Then** the DeletionRequest status is set to `"cancelled"` and the account remains active

**Given** a deletion request is in progress
**When** the parent attempts to log in or use the account during the grace period
**Then** the account remains fully functional until the grace period expires

---

### Story 9.3: PHI Audit Log & Tamper-Evidence

As the platform,
I want every PHI access and mutation event to be logged in a tamper-evident, insert-only audit log,
So that all access to sensitive health data is fully traceable and compliant with HIPAA requirements.

**Acceptance Criteria:**

**Given** any API route reads or writes PHI (child records, vaccination records, plans)
**When** the route handler executes
**Then** `auditLogService.log()` is called with: actorId, actorRole, resourceType, resourceId, action, timestamp — using MongoDB majority write concern before the response is sent

**Given** an AuditLog document is created
**When** any process attempts to update or delete that document
**Then** the operation is rejected — the MongoDB collection enforces insert-only behaviour via application-layer guards and the absence of update/delete permissions on the audit collection role

**Given** a platform admin calls `GET /api/v1/admin/audit-log`
**When** the request is processed with optional filters (actorId, resourceType, dateRange)
**Then** matching AuditLog entries are returned in chronological order with full event details

**Given** the audit log is queried for a specific child's records
**When** `GET /api/v1/admin/audit-log?resourceId=:childId` is called
**Then** all PHI access events for that child are returned, enabling a complete chain-of-custody view

**Given** a PHI audit log write fails (e.g., MongoDB write error)
**When** the failure occurs
**Then** the originating API operation is also failed and rolled back — PHI operations without a successful audit log entry are not permitted to complete

---

### Story 9.4: Vaccination Record Export

As a parent,
I want to export my child's complete vaccination record in a portable, human-readable format,
So that I can share it with schools, travel authorities, or other healthcare providers outside the platform.

**Acceptance Criteria:**

**Given** an authenticated parent calls `GET /api/v1/children/:childId/export`
**When** the request is processed
**Then** a PDF document is generated containing the child's name, ChildID, full vaccination history (vaccine name, administered date, lot number, administering doctor, approval status), and the export timestamp

**Given** the export is generated
**When** the response is returned
**Then** the `Content-Disposition` header is set to `attachment; filename="childName-vaccination-record.pdf"` and the Content-Type is `application/pdf`

**Given** the export request is made
**When** `auditLogService.log()` is called
**Then** the export event is recorded with: parentId, childId, timestamp, and `action: "RECORD_EXPORTED"`

**Given** a parent requests an export for a child that belongs to a different parent
**When** the authorization check runs
**Then** a `403 Forbidden` AppError is returned — cross-parent export access is blocked

---

### Story 9.5: COPPA Parental Consent Enforcement

As the platform,
I want to collect and store verifiable parental consent before processing any data about children under 13,
So that the platform complies with COPPA requirements for child data protection.

**Acceptance Criteria:**

**Given** a parent attempts to create a child profile for a child under 13
**When** `POST /api/v1/children` is called
**Then** the request is blocked until a verifiable parental consent record is created for that child

**Given** a parent calls `POST /api/v1/children/:childId/consent`
**When** a valid consent submission is provided (parentId, consentTimestamp, consentMethod)
**Then** a ConsentRecord document is created with the parent's userId, IP address, timestamp, and consent method; the child profile creation proceeds

**Given** a ConsentRecord is created
**When** the document is stored
**Then** it is immutable — consent records cannot be updated or deleted, only superseded by a new consent record if required

**Given** a child profile exists without a valid ConsentRecord
**When** any PHI-reading endpoint is called for that child
**Then** a `403 Forbidden` AppError is returned: `{ code: "CONSENT_REQUIRED" }` — data processing is blocked until consent is recorded

**Given** a platform admin queries consent records
**When** `GET /api/v1/admin/consent-records?childId=:childId` is called
**Then** all consent records for that child are returned with full metadata for compliance audit purposes

---

### Story 9.6: Regional Data Residency Configuration

As the platform,
I want to support regional data residency configuration so that child health data is stored in the region corresponding to the parent's country of residence,
So that the platform meets international data localisation regulations as new countries are activated.

**Acceptance Criteria:**

**Given** a parent registers an account and provides their country of residence
**When** the User document is created
**Then** the country is stored and mapped to the appropriate data residency region (e.g., EU, US, APAC) based on a configurable region mapping

**Given** a child profile is created under a parent with a designated data residency region
**When** the Child and VaccinationRecord documents are written
**Then** they are written to the MongoDB Atlas cluster configured for that region — cross-region writes are blocked

**Given** the region mapping configuration is updated to activate a new country
**When** the API restarts with the updated configuration
**Then** new registrations from that country are routed to the correct regional cluster without requiring code changes

**Given** a parent's data residency region is set at registration
**When** the parent attempts to change their country of residence post-registration
**Then** a `400 Bad Request` AppError is returned: `{ code: "DATA_RESIDENCY_IMMUTABLE" }` — region changes require a formal data migration process coordinated by a platform admin

**Given** the platform is deployed to multiple regions
**When** a request arrives at the API
**Then** the JWT middleware resolves the user's data residency region and routes all database operations to the correct regional cluster for that request
