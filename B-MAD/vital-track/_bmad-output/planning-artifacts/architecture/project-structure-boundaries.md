# Project Structure & Boundaries

## Complete Project Directory Structure

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

## Architectural Boundaries

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

## Requirements to Structure Mapping

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

## Integration Points

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

## Development Workflow

```bash
pnpm dev                    # Run all apps concurrently (Turborepo)
pnpm dev --filter api       # API only (port 3000)
pnpm dev --filter web       # Web only (port 5173)
pnpm build                  # Build all apps in dependency order
pnpm test                   # All test suites with Turborepo caching
pnpm lint && pnpm typecheck # Full quality gate
```
