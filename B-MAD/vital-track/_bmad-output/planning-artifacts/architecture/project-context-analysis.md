# Project Context Analysis

## Requirements Overview

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

## Technical Constraints & Dependencies

- **Stack defined by PRD:** React Native + Expo (iOS + Android), React web (Doctor portal + Admin), Node.js (API), MongoDB
- **Third-party services:** Twilio (SMS), SendGrid/AWS SES (email), FCM via Expo (push), Stripe (billing), PostHog/Mixpanel (analytics)
- **HIPAA BAAs required** before any PHI stored — all cloud and third-party providers must execute BAAs pre-launch
- **Solo development** — prefer managed services, minimize operational overhead, vertical-slice build sequencing
- **App store compliance:** Apple (medical disclaimer) + Google Play (data safety form, PHI declaration) — both at launch

## Cross-Cutting Concerns Identified

1. **Auth & RBAC** — 6 roles (Parent, Caregiver tiers, Doctor, Urgent Care QR, Clinic Admin, Platform Admin) with role-scoped middleware across all 3 portal surfaces
2. **PHI Audit Logging** — tamper-evident, append-only on every PHI access; integrity must not depend on application layer alone
3. **Multi-Tenancy Data Isolation** — ChildID-scoped access: doctors see only explicitly shared records; strict query-layer enforcement; no lateral access
4. **Notification Reliability** — dual pipeline (scheduled + event-driven), tri-channel with fallback chain, delivery status tracking, idempotency across retries
5. **Record State Machine** — enforced at application layer (Node.js validators) AND database layer (MongoDB validation rules); no state skipping
6. **Compliance Gates** — COPPA consent before child data collection; GDPR erasure workflow; India DPDP data residency toggle; all testable
7. **Offline Sync** — Parent app + Doctor mobile: read from cache, queue writes, sync on reconnect with conflict-safe state machine behavior
