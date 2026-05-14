---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
classification:
  projectType: 'consumer-b2b-saas-platform'
  domain: 'healthcare-pediatric'
  complexity: 'high'
  projectContext: 'greenfield'
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-vital-track.md
workflowType: 'prd'
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
---

# Product Requirements Document - vital-track

**Author:** Prateek.magarde
**Date:** 2026-04-03

## Executive Summary

vital-track is a cross-platform (web + mobile) pediatric health tracking application designed to eliminate the paper-based vaccination record problem for families with children. Built by a parent who needed it, for every parent who will — vital-track connects parents and verified doctors around a single authoritative vaccination record per child, with the doctor as the trusted data source and the parent as the final approver.

The MVP delivers a **Vaccination Tracker** with two primary workflows: (1) proactive reminders alerting parents ahead of upcoming vaccine due dates based on a doctor-published plan, and (2) an approval workflow that notifies parents via email, SMS, and in-app push when a doctor marks a vaccine as administered. Parents approve before records are finalized. No manual entry. No paper. No lost cards.

The platform serves two primary user types: **parents** (free tier) who manage multi-child profiles and receive notifications, and **doctors/clinics** (subscription tier) who create and publish vaccination plans and record administrations. Children are identified by a system-generated **ChildID** — a 6-character code and QR — enabling any verified doctor to access a child's record across clinics and healthcare systems without EHR lock-in.

### What Makes This Special

**Clinician-sourced, proactively delivered:** Unlike every existing consumer vaccination app that relies on parent-entered data, vital-track's records originate from verified doctors. Parents don't track — they get told, ahead of time, exactly what's coming and when.

**ChildID — portable health identity:** The 6-character code + QR is a lightweight, network-agnostic identity primitive. Any doctor, any clinic, any country — scan the code, access the plan. No shared EHR system required.

**Approval-gated records:** Every administration requires explicit parent approval before it enters the permanent record. Parents retain legal and practical control. Trust is structural, not assumed.

**The network flywheel:** Each doctor who joins activates their patient panel. Each parent account makes the platform more valuable to the next provider. The QR access model turns every clinical encounter into an acquisition event.

**Built-in proactive reminders:** The system doesn't wait for parents to check — it pushes upcoming vaccination dates ahead of time via tri-channel notifications, turning reactive record-keeping into proactive health management.

## Project Classification

- **Project Type:** Consumer + B2B SaaS Platform (Web + Mobile)
- **Domain:** Healthcare — Pediatric Health Records
- **Complexity:** High (HIPAA, COPPA, GDPR, India DPDP Act; multi-jurisdiction; children's sensitive data)
- **Project Context:** Greenfield

## Success Criteria

### User Success

**For parents:**
- Receives a proactive reminder via email, SMS, and in-app push at least 2 weeks before a vaccine is due — with zero action required on their part
- Can view their child's full doctor-published vaccination plan immediately after account setup
- Receives an approval notification when a vaccine is marked administered, and can approve or reject with a single action
- Never needs to manually enter a vaccination record that their doctor has administered
- Can share their child's record with a new doctor via ChildID in under 60 seconds

**For doctors:**
- Can access any child's vaccination plan via ChildID QR scan in under 30 seconds — without creating an account dependency on the parent's clinic
- Can publish a vaccination plan and have the parent see it within minutes of publishing
- Marks a vaccine as administered and the parent is notified immediately, approval confirmed within 24 hours

### Business Success

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Active parent accounts | 500+ | Month 6 |
| Active doctors | 50+ (≥1 plan published + ≥1 vaccination marked in trailing 30 days) | Month 6 |
| Median parent approval time | <24 hours | Ongoing |
| Parent rejection rate | <5% of doctor-submitted administrations | Ongoing |
| Doctor-referral acquisition | 40%+ of new parent signups | Month 12 |
| Geographic reach | Active usage in 3+ countries | Month 12 |

### Technical Success

Technical quality attributes are fully specified in the Non-Functional Requirements section. Summary gates: 99%+ notification delivery rate, zero records finalized without parent approval, 99.9% uptime during clinic hours, full compliance stack active at launch (HIPAA BAAs, COPPA consent, GDPR erasure, India DPDP).

### Measurable Outcomes

- A parent who installs the app and completes onboarding can view their child's vaccination plan within 10 minutes of their doctor publishing it
- A doctor who scans a ChildID QR reaches the child's vaccination plan in <30 seconds
- 90%+ of approval notifications result in a parent action (approve or reject) within 48 hours
- Zero instances of a vaccine being recorded as administered without parent approval in the audit log

## Product Scope

**MVP (Phase 1):** Complete core vaccination workflow — ChildID system, doctor plan creation, proactive reminders, parent approval state machine, urgent care QR access, credential verification, clinic billing, compliance baseline. All 5 user journeys supported.

**Phase 2 (Growth, months 3–9):** Medical history, full caregiver tiers, automated credential verification, FHIR integration, school certificates, travel health readiness.

**Phase 3 (Expansion, year 2+):** Insurance documentation, outbreak alerting, pharmacy integration, AI schedule personalization, full pediatric health passport.

Full sequencing, build order, and risk mitigation in the Project Scoping & Phased Development section.

## User Journeys

### Journey 1 — Parent: Happy Path (Priya, mother of two)

**Opening Scene:** Priya has a 14-month-old and a 4-year-old. She juggles work and daycare drop-offs and genuinely cannot remember if her younger child got the second dose of hepatitis B or if the clinic just said "come back in a month." The paper card is somewhere in a kitchen drawer.

Her pediatrician, Dr. Arora, invites her to vital-track during a routine visit and shares her older child's ChildID.

**Rising Action:** Priya downloads the vital-track Expo app on her phone, creates her account, and adds both children. She enters each child's name and her phone number — the system deduplicates and generates ChildIDs. She shares the QR with Dr. Arora, who links both children in the doctor portal and publishes their vaccination plans.

Within minutes, Priya's app shows her exactly where each child stands: what's been done, what's coming up. She sees a badge: *"Hepatitis B Dose 2 — due in 3 weeks."* That's the answer she's been wondering about for months.

**Climax:** Three weeks later, at 8am, Priya gets a push notification, an email, and an SMS: *"Reminder: your child Maya is due for Hepatitis B Dose 2 today."* She's at the clinic by 10am. Dr. Arora administers the vaccine and marks it in the doctor portal. Priya's phone buzzes: *"Dr. Arora has marked Hepatitis B Dose 2 as administered. Approve?"* One tap. Done. The record is permanent, timestamped, doctor-sourced.

**Resolution:** Priya now has a complete, accurate vaccination record for both children that lives on her phone — not in a drawer. School enrollment next year: she exports the ChildID QR. The school scans it. Done in 60 seconds.

**Capabilities revealed:** multi-child profile management, ChildID generation, plan publishing, proactive reminders (tri-channel), approval notification (tri-channel), single-tap approval, record finalization, QR export.

---

### Journey 2 — Parent: Edge Case (Marcus, skeptical co-parent)

**Opening Scene:** Marcus and his ex-partner share custody of their 3-year-old son, Eli. His ex added Eli to vital-track and granted Marcus notification-only access. When Marcus gets a notification that Eli received a flu vaccine he didn't know was scheduled, he's not sure he believes it actually happened today — or that it was the right vaccine.

**Rising Action:** Marcus receives the approval notification. He taps through and sees the record details: Dr. Chen, date, time, vaccine lot number. He doesn't recognize this doctor — it's an urgent care clinic his ex took Eli to while Marcus was working.

He taps **Reject** and adds a note: "I don't recognize this doctor. Please confirm."

**Climax:** The system transitions the record to **Rejected** state and notifies Dr. Chen and Eli's primary care doctor. Marcus's ex receives a notification explaining the rejection and the note. She calls Marcus, confirms the visit, sends a photo of the clinic visit summary. Marcus re-opens the app and taps **Approve on second review** (the system allows re-submission from the doctor).

**Resolution:** The record is finalized 6 hours later. The audit trail captures the full state history: submitted → rejected → resubmitted → approved. Both co-parents have visibility. No record was permanently entered without Marcus's awareness.

**Capabilities revealed:** co-parent caregiver access (notification-only), rejection flow with notes, record state history (pending → rejected → resubmitted → approved), doctor re-submission, audit trail, dispute communication channel.

---

### Journey 3 — Doctor: Happy Path (Dr. Sarah Chen, pediatrician)

**Opening Scene:** Dr. Chen runs a busy pediatric practice with 400 active patients. She spends 15 minutes per new patient visit asking "do you have the vaccination record?" and getting blank stares or crumpled paper cards. Her clinic administrator signs up for vital-track's clinic subscription.

**Rising Action:** Dr. Chen completes the credential verification flow — enters her medical license number, uploads a verification document. The platform admin reviews and approves within 24 hours. She receives a confirmation email and logs into the doctor portal (React web app).

She creates her first vaccination plan for a new patient, 2-month-old Liam, using the standard pediatric schedule as a template. She publishes it. Liam's mother, who was invited via SMS, signs up within the hour. The plan appears in her app immediately.

**Climax:** At Liam's 4-month visit, Dr. Chen opens the doctor portal on her tablet, pulls up Liam's profile, and marks DTaP Dose 2 as administered. She adds the lot number. The system sends Liam's mother a tri-channel approval request. The mother approves from her phone while still in the waiting room. The record finalizes before Dr. Chen finishes her notes.

**Resolution:** Dr. Chen has cut her "where's the vaccine record?" conversation from 15 minutes to zero. She now onboards every new patient to vital-track at their first visit. Each new doctor she refers brings more families — she's become the platform's most effective acquisition channel.

**Capabilities revealed:** doctor credential verification, clinic subscription management, plan template creation, plan publishing, patient invitation via SMS, administration recording (with lot number), approval trigger, record finalization, doctor referral loop.

---

### Journey 4 — Urgent Care Doctor: QR Access (Dr. Ravi Patel)

**Opening Scene:** It's 9pm. A parent rushes in with 18-month-old Aisha, who has a high fever. Dr. Patel needs to know Aisha's vaccination history immediately — specifically whether she's received the meningococcal vaccine. There's no pediatrician on call, no EHR access, no paper card.

**Rising Action:** The parent opens the vital-track app, navigates to Aisha's profile, and shows Dr. Patel the ChildID QR. Dr. Patel opens the vital-track app on his phone, taps "Access Patient Record," and scans the QR. Within 30 seconds he sees Aisha's complete vaccination plan — what's been given, what's pending, who the primary pediatrician is.

**Climax:** Dr. Patel confirms Aisha has received the MenB series. He administers a different treatment. At the parent's request, he marks tonight's visit in the app with a note. This triggers a parent approval notification.

**Resolution:** The parent approves. The urgent care visit is logged in Aisha's record. Dr. Patel didn't need an account, didn't need to be on the same EHR, and didn't need to call anyone. The record is there the next morning when Aisha's regular pediatrician checks in.

**Capabilities revealed:** QR scan access (no prior relationship required), read-only vaccination history view, optional administration marking from urgent care context, parent approval for external records, audit log of who accessed the record and when.

---

### Journey 5 — Platform Admin: Doctor Credential Verification

**Opening Scene:** A new doctor, Dr. Okonkwo, signs up for vital-track from Lagos, Nigeria. He enters his name, clinic name, and medical license number. The system flags his account as **Pending Verification** and queues it for admin review.

**Rising Action:** The platform admin logs into the admin dashboard (React web app). She sees Dr. Okonkwo's request: license number, country, uploaded document. She runs a manual check against the Nigerian Medical and Dental Council register (the system links to the relevant registry by country). Everything matches.

**Climax:** She clicks **Approve**. Dr. Okonkwo receives an email: "Your vital-track doctor account is verified. You can now create vaccination plans." He logs in within the hour and creates his first plan.

**Resolution:** The admin dashboard logs the approval: who approved, when, what was verified. If a doctor is later reported for fraudulent records, the verification audit trail is the first line of investigation. Rejected doctors receive a clear reason and a resubmission path.

**Capabilities revealed:** admin dashboard (separate from parent/doctor portals), credential verification queue, country-specific medical registry linking, approval/rejection workflow, verification audit trail, re-submission path for rejected doctors.

---

### Journey Requirements Summary

| Capability Area | Revealed By |
|----------------|-------------|
| Multi-child profile management | Journey 1 |
| ChildID generation (name + phone → 6-char + QR) | Journey 1 |
| Doctor plan creation + publishing | Journeys 1, 3 |
| Proactive reminders (tri-channel, date-driven) | Journey 1 |
| Approval notification + single-tap workflow | Journeys 1, 2, 4 |
| Record state machine (pending/approved/rejected/expired) | Journey 2 |
| Rejection flow with notes + doctor re-submission | Journey 2 |
| Co-parent / caregiver access tiers | Journey 2 |
| Audit trail for all state transitions | Journeys 2, 5 |
| Doctor credential verification + admin queue | Journeys 3, 5 |
| Clinic subscription management | Journey 3 |
| QR scan access (no prior relationship) | Journey 4 |
| Admin dashboard | Journey 5 |
| Country-specific medical registry integration | Journey 5 |

## Domain-Specific Requirements

### Compliance & Regulatory

**HIPAA (United States)**
- All cloud infrastructure providers must execute Business Associate Agreements (BAAs) before any PHI is stored or processed
- Encryption required: AES-256 at rest, TLS 1.2+ in transit
- Audit logs required for all PHI access: who accessed, when, what action
- Breach notification within 60 days of discovery
- Minimum necessary access principle enforced across all roles

**COPPA (United States)**
- Verifiable parental consent required before collecting data about or on behalf of children under 13
- No behavioral advertising on child profiles — contextual advertising only
- Data minimization: collect only what is necessary for vaccination tracking
- Parents have the right to review and delete their child's data on request

**GDPR (EU / UK)**
- Children's data (under 16, varies by member state) requires explicit parental consent
- Right to erasure ("right to be forgotten") must be implemented at account and child-profile level
- Data processing agreements required with all third-party processors
- Data Protection Officer (DPO) designation required if processing at scale in EU
- Cross-border data transfer to non-EU countries requires Standard Contractual Clauses (SCCs)

**India DPDP Act (2023)**
- Explicit consent required before processing children's personal data
- Behavioral monitoring and targeted advertising for children prohibited
- Data localization requirements may apply — architecture must support regional data residency

**Doctor Credential Verification**
- No doctor may access patient records or publish vaccination plans without verified credentials
- Verification must reference country-specific medical licensing authority registries
- Verification audit trail retained permanently (not subject to deletion requests)
- Revocation mechanism required: compromised or fraudulent accounts must be instantly deactivated

### Technical Constraints

**Security**
- Role-based access control (RBAC): Parent / Caregiver / Doctor / Admin roles with strictly scoped permissions
- Doctor access to child records is scoped to records explicitly shared via ChildID — no lateral access
- All API endpoints authenticated via JWT; refresh token rotation enforced
- QR code access tokens: time-limited (configurable expiry), single-use for sensitive operations
- Penetration testing required before public launch

**Data Integrity**
- Vaccine records are immutable once approved — only append-only amendments permitted
- Full state machine enforcement: records cannot skip states (pending → approved/rejected/expired)
- MongoDB write-concern set to majority for all vaccination record writes
- Soft deletes only — no hard deletion of health records (legal retention requirements)

**Availability & Performance**
- 99.9% uptime SLA during clinic hours (6am–10pm local time per region)
- Notification delivery must not depend on app uptime — email/SMS channels are fallback when push fails
- Doctor portal must degrade gracefully with offline read access for previously loaded records

**Privacy by Design**
- Child profiles are not publicly searchable — ChildID is the only access mechanism
- Parent/guardian is the data controller for their child's record
- All notification content must be minimal — no PHI in SMS/email subject lines

### Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Data breach exposing children's PHI | Encryption at rest + in transit, BAAs, penetration testing, breach response plan |
| Doctor impersonation / fraudulent records | Mandatory credential verification before portal access; audit trail on all record changes |
| Incorrect vaccine marked by doctor | Parent approval gate; rejection flow with notes; doctor re-submission; lot number required |
| Notification delivery failure | Tri-channel with fallback chain; delivery status tracked; failed notifications retried and alerted to admin |
| QR code stolen / shared maliciously | Time-limited access tokens; audit log of all QR scans; parent-controlled revocation |
| Compliance violation in new market | Market-by-market compliance review before enabling registrations in that country |

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. ChildID — Portable Pediatric Health Identity**

The 6-character code + QR system is a genuinely novel identity primitive for children's health records. It is not tied to any national ID, insurance number, EHR system, or country — making it the first lightweight, globally portable child health identity that any verified doctor can access without a pre-existing relationship with the family's healthcare system.

No current competitor combines identity portability + clinician access + parent control in a single artifact. Paper cards are portable but unverifiable. EHR portals are verifiable but siloed. ChildID is both — and works offline (QR display requires no network).

**2. Approval-Gated Clinical Record Finalization**

The pattern of requiring explicit parent approval before a clinical record is finalized is novel at consumer scale. Existing EHR patient portals are read-only for patients. vital-track inverts this: the parent is an active participant in record creation, not a passive recipient. This creates:
- A structural trust mechanism (not just a policy claim)
- A legal audit trail that satisfies multiple regulatory frameworks simultaneously (COPPA, GDPR, HIPAA)
- A natural dispute resolution surface built into the core data model

**3. Proactive + Reactive Dual Notification Architecture**

Most health apps are reactive — they show you what happened. vital-track introduces a dual-mode notification architecture:
- **Proactive:** push/SMS/email reminders *before* vaccine due dates, derived from doctor-published schedules
- **Reactive:** approval requests *after* a doctor marks an administration

This transforms the parent experience from record-keeping (checking what was done) to health management (being ahead of what's coming). No existing vaccination app combines both modes driven by a clinician-authored source of truth.

### Market Context & Competitive Landscape

The market gap is confirmed: no product at consumer scale combines all three patterns. The closest players:
- **Docket** — pulls IIS records (reactive, read-only, US-only, no doctor portal)
- **MyChart/Epic** — EHR portal (reactive, read-only for patients, hospital network lock-in)
- **Immunify/VaxiTrack** — parent manual entry (no clinical source, no approval, no reminders from a doctor plan)

The 2023 ONC/CMS FHIR mandate creates the infrastructure precondition that makes vital-track's approach viable at scale — authoritative immunization data can now be accessed via open APIs, removing the historical dependency on closed EHR networks.

### Validation Approach

| Innovation | Validation Method | Success Signal |
|-----------|------------------|---------------|
| ChildID adoption | Measure % of doctor-initiated sessions that start with QR scan vs. manual search | >60% QR-initiated within 3 months of launch |
| Approval-gated records | Track approval rate, rejection rate, and time-to-action | >90% action within 48h; <5% rejection |
| Proactive reminders driving visits | Correlate reminder send → clinic visit within 7 days | >30% reminder-to-visit conversion |

### Risk Mitigation

| Innovation Risk | Mitigation |
|----------------|-----------|
| ChildID QR not adopted by doctors (they type instead) | Make QR scan the default flow in doctor portal; manual entry as fallback only |
| Parents feel overwhelmed by approval requests | Batch low-urgency notifications; single-tap approval UX; clear plain-language copy |
| Proactive reminders perceived as spam | Allow notification frequency preferences; honor opt-down (not just opt-out); respect quiet hours |
| Approval-gating slows record finalization at busy clinics | Implement approval timeout (48h default → auto-escalate to SMS) and configurable expiry per record |

## Platform-Specific Requirements

### Project-Type Overview

vital-track is a multi-sided Consumer + B2B SaaS Platform delivered across React (web), React Native + Expo (mobile), with a Node.js backend and MongoDB datastore. It serves three distinct portal surfaces — Parent App, Doctor Portal, and Admin Dashboard — each with different access patterns, permission scopes, and offline requirements.

### Multi-Tenancy Model

**Tenant hierarchy:**
```
Platform (vital-track)
  └── Clinic (subscription tenant)
        └── Doctor (member of clinic, verified)
  └── Parent Account (free tenant)
        └── Child Profile (owned by parent, shared via ChildID)
              └── Vaccination Record (authored by doctor, approved by parent)
```

- **Clinic subscriptions** are the B2B billing unit — all verified doctors at a clinic operate under the clinic's subscription
- **Parent accounts** are independent free tenants — not scoped to any clinic
- **Child records** are owned by the parent tenant, accessed by doctor tenants via explicit ChildID grant
- **Data isolation:** A doctor can only see records for children who have shared their ChildID with that doctor — no lateral access across patients
- **Urgent care access:** Time-limited, QR-gated, read-only — no persistent tenant relationship created

### RBAC Permission Matrix

| Role | Create Child Profile | View Vaccination Plan | Add External Vaccine | Mark Administered | Approve Record | Manage Clinic | Verify Doctors |
|------|---------------------|----------------------|---------------------|-----------------|---------------|--------------|---------------|
| Parent | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Caregiver (read-only) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Caregiver (notification-only) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Caregiver (approval-capable) | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Doctor (verified) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Urgent Care (QR) | ❌ | ✅ (read-only) | ✅ (with parent approval) | ✅ (pending approval) | ❌ | ❌ | ❌ |
| Clinic Admin | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Platform Admin | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### Subscription Tiers

| Tier | Who | Billing Unit | Features |
|------|-----|-------------|----------|
| Free | Parents & caregivers | N/A | Child profiles, plan view, notifications, approvals, QR sharing |
| Clinic Subscription | Clinics | Per clinic / month or year | All verified doctors at clinic, plan creation, administration recording, patient panel |
| Platform Admin | Internal | N/A | Credential verification queue, clinic management, audit dashboard |

**Billing notes:**
- Clinic subscription covers unlimited doctors under that clinic
- Monthly and annual billing options (annual discounted)
- Free trial period for new clinic signups (e.g., 30 days) to drive doctor activation
- Ads shown to parent/caregiver free tier (contextual, health/parenting category only, no behavioral targeting)
- Optional donation ("Buy Me a Coffee") surfaced non-intrusively in parent app

### Mobile Requirements (React Native + Expo)

**Platform targets:** iOS (App Store) + Android (Google Play) — both at launch

**Device features required:**
- Camera access — QR code scanning (doctor portal: scan ChildID; parent app: share ChildID)
- Push notifications — FCM via Expo Notifications API
- Local storage — offline data caching for read access

**Offline capability — both apps:**
- **Parent app:** cached vaccination plans and records readable offline; notifications received when connectivity restores; no record approval or external vaccine addition while offline
- **Doctor portal (mobile):** cached patient records readable offline; vaccine administration can be queued offline and synced when connectivity restores (pending parent approval starts on sync)

**App store compliance:**
- Apple App Store: HealthKit integration not required at MVP; medical disclaimer required in app description
- Google Play: Health & Fitness category; data safety form must declare PHI handling, encryption, and data deletion support
- Both: parental consent flow must meet store guidelines for apps handling children's data

### Integration List

| Integration | Purpose | Provider |
|------------|---------|----------|
| Email notifications | Proactive reminders + approval requests | SendGrid or AWS SES |
| SMS notifications | Global SMS delivery | Twilio |
| Push notifications | In-app push for mobile | Firebase Cloud Messaging (FCM) via Expo |
| QR code generation | ChildID QR creation | Server-side (Node.js library, e.g., `qrcode`) |
| QR code scanning | Doctor/parent QR scan | Expo Camera + `expo-barcode-scanner` |
| Credential verification | Doctor license registry lookup | Manual (admin-assisted) at MVP; automated API post-MVP |
| Payment/billing | Clinic subscription billing | Stripe |
| Analytics | Usage tracking (privacy-compliant) | PostHog or Mixpanel (self-hosted option for PHI compliance) |

### Implementation Considerations

**API design (Node.js):**
- RESTful API with versioning (`/api/v1/`)
- JWT authentication with refresh token rotation
- Separate middleware stacks for parent, doctor, and admin routes
- Rate limiting per role (stricter on admin routes)
- Webhook support for notification delivery status callbacks (Twilio, SendGrid)

**MongoDB data model considerations:**
- Child profiles as top-level documents with embedded ChildID index
- Vaccination records as separate collection with parent reference + audit trail subdocument
- Record state machine enforced at application layer (Node.js) + MongoDB validation rules
- Write concern: `majority` for all vaccination record writes
- Indexes: ChildID (unique), parentId, doctorId, dueDate (for reminder scheduling)

**Notification scheduling:**
- Reminder scheduler: cron job (Node.js) runs daily, queries MongoDB for vaccinations due within configurable window (default: 14 days, 7 days, day-of)
- Approval timeout enforcer: cron job checks pending records older than 48h, escalates to SMS
- All notification jobs must be idempotent — safe to re-run on retry

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP — the complete core workflow ships together or not at all. Parent sees the plan, gets reminded, approves the vaccine. Doctor publishes, marks, and gets confirmation. ChildID works. Notifications arrive. Records finalize. If any one of these breaks, the trust model breaks — so they ship as a unit.

**Resource Reality:** Solo development. This shapes *sequencing*, not scope. Build in vertical slices (one complete user journey at a time) rather than horizontal layers.

**Recommended build sequence for solo:**
1. Auth + ChildID system (foundation everything else depends on)
2. Doctor portal — plan creation + publishing (React web)
3. Parent app — plan view + child profile (React Native + Expo)
4. Notification system — proactive reminders + approval requests (tri-channel)
5. Approval workflow — full state machine (pending/approved/rejected/expired)
6. Admin dashboard — credential verification queue
7. Stripe billing — clinic subscription
8. QR scan access — urgent care + sharing flow
9. Caregiver tiers
10. App store submission (iOS + Android)

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Journey 1: Parent happy path (proactive reminder → clinic → approve)
- Journey 3: Doctor happy path (onboard → create plan → mark administered)
- Journey 4: Urgent care QR access
- Journey 5: Platform admin credential verification

**Must-Have Capabilities:**

| Capability | Justification |
|-----------|--------------|
| Parent account + multi-child profiles | Foundation of every parent journey |
| ChildID generation (6-char + QR) | Core identity primitive — everything else depends on it |
| Doctor portal — plan creation + publishing | Clinician-sourced data is the entire differentiator |
| Doctor credential verification + admin queue | Cannot launch without — patient safety requirement |
| Proactive reminders (tri-channel) | Primary parent value proposition |
| Approval workflow — full state machine | Trust mechanism — cannot be partial |
| Rejection flow + doctor re-submission | Required for completeness of state machine |
| QR scan access (urgent care) | Validates the ChildID portability claim |
| Basic caregiver access (read-only tier minimum) | Co-parent scenario must work at launch |
| Clinic subscription billing (Stripe) | Revenue model must function at launch |
| Compliance baseline (HIPAA/COPPA/GDPR/DPDP) | Legal requirement — not optional |
| Web (React) + Mobile (React Native + Expo) | Both stores at launch |

**Deferred within MVP (post-launch, pre-Phase 2):**
- Caregiver approval-capable and notification-only tiers — read-only ships first
- Automated doctor credential verification — manual admin review at launch
- Notification preference controls (quiet hours, frequency) — basic on/off at launch

### Post-MVP Features

**Phase 2 — Growth (months 3–9 post-launch):**
- Medical history tracking: treatments, allergies, medications
- Full caregiver tier permissions (notification-only, approval-capable)
- Automated doctor credential verification API
- Notification preference controls (quiet hours, batching, frequency)
- EHR / FHIR direct integration (SMART on FHIR)
- School compliance certificate generation
- Travel health readiness check (destination-based vaccine gap analysis)

**Phase 3 — Expansion (year 2+):**
- Insurance / FSA reimbursement documentation
- Outbreak and vaccine recall alerting
- Pharmacy chain integration
- AI-powered schedule personalization
- Government / NGO partnership infrastructure
- Full pediatric health passport (growth charts, full medical history)
- Child record transition to adult health identity

### Risk Mitigation Strategy

**Technical risks (solo dev):**

| Risk | Mitigation |
|------|-----------|
| Notification reliability across 3 channels | Build and test notification pipeline first — it's the critical path; use Expo's notification testing tools |
| State machine complexity (6 record states) | Implement as explicit MongoDB state enum + Node.js transition validators; write unit tests before UI |
| Compliance implementation (HIPAA/COPPA/GDPR) | Use established Node.js libraries (helmet, express-rate-limit); engage a compliance consultant for BAA templates before launch |
| App store approval with medical/children's data | Test submission early with a beta build; have medical disclaimer and privacy policy reviewed before submission |
| Solo bandwidth | Build in vertical slices; each slice is shippable; don't start Phase 2 features until MVP is stable |

**Market risks:**
- **Doctor adoption** — biggest risk. Mitigation: start with one trusted clinic (personal network if possible); prove the workflow with real doctors before opening to public signups
- **Parent trust** — Mitigation: launch with verified doctors only; clear "verified by vital-track" badge; HIPAA/compliance messaging prominent

**Resource contingency:**
- If time becomes constrained: defer Stripe billing (manual invoicing for first clinic), defer iOS (Android + web first), defer QR scan (manual code entry only)
- Non-negotiables even under maximum constraint: ChildID system, approval workflow, tri-channel notifications, compliance baseline

## Functional Requirements

This is the capability contract. Every feature in the final product must trace to one of these requirements. Anything not listed here will not exist unless explicitly added.

### Identity & Account Management

- **FR1:** Parent can register an account using email and password
- **FR2:** Doctor can register a clinic account and submit credentials for verification
- **FR3:** Users can authenticate using email and password with secure session management
- **FR4:** Users can reset their password via email
- **FR5:** Parent can invite caregivers to access their account with a configurable permission level
- **FR6:** Caregiver can accept or decline a parent's access invitation

### Child Profile & ChildID

- **FR7:** Parent can create a child profile using the child's name and the parent's phone number
- **FR8:** System prevents duplicate child profiles based on name + phone number combination
- **FR9:** System automatically generates a unique 6-character ChildID code and QR for each child profile upon creation
- **FR10:** Parent can view, download, and share a child's ChildID QR code
- **FR11:** Parent can manage multiple child profiles under a single account
- **FR12:** Parent can regenerate a child's ChildID QR code, invalidating all previous QR access tokens for that child

### Vaccination Plan Management

- **FR13:** Verified doctor can create a vaccination plan for a child using the child's ChildID
- **FR14:** Doctor can add individual vaccines to a plan with name, due date, and optional notes
- **FR15:** Doctor can use a standard pediatric vaccination schedule as a plan template
- **FR16:** Doctor can publish a vaccination plan, making it immediately visible to the linked parent
- **FR17:** Doctor can add external (ad-hoc) vaccinations to an existing plan
- **FR18:** Parent can view their child's complete vaccination plan including administered, upcoming, and overdue vaccines
- **FR19:** Parent can add external vaccinations received outside the doctor's plan to their child's record
- **FR20:** Doctor can view and manage vaccination plans for all children who have shared their ChildID with that doctor

### Vaccine Administration & Records

- **FR21:** Verified doctor can mark a vaccine as administered, including vaccine lot number and administration date
- **FR22:** System transitions a vaccine record to "pending approval" state upon doctor submission, notifying the parent immediately
- **FR23:** Parent can approve a pending vaccine administration record with a single action
- **FR24:** Parent can reject a pending vaccine administration record with a mandatory explanatory note
- **FR25:** Doctor receives notification of a rejection with the parent's note, and can resubmit an amended administration record
- **FR26:** System automatically transitions a pending record to "expired" state after a configurable timeout period (default: 48 hours) without parent action
- **FR27:** Approved vaccination records are immutable — modifications are only permitted as append-only amendments with audit trail entries
- **FR28:** System maintains a complete audit trail of all record state transitions, capturing actor identity, timestamp, and action type for every change

### Notifications & Reminders

- **FR29:** System sends proactive reminders to parents via email, SMS, and in-app push when a vaccine due date is approaching (default: 14 days and 7 days before due date)
- **FR30:** System sends a same-day reminder to parents on the vaccine due date via all three notification channels
- **FR31:** System sends an approval request notification to the parent via email, SMS, and in-app push immediately when a doctor submits a vaccine administration record
- **FR32:** System escalates an unanswered approval request via SMS after a configurable timeout, and alerts the platform admin if still unanswered after a secondary timeout
- **FR33:** Parent can configure notification preferences per channel (enable/disable email, SMS, and push independently)
- **FR34:** System tracks delivery status for each notification attempt and retries failed deliveries through fallback channels

### Access Control & Sharing

- **FR35:** Any verified doctor can access a child's vaccination plan by scanning or manually entering the child's ChildID code — without requiring a prior relationship with the parent's clinic
- **FR36:** Doctor's ChildID-based access is scoped exclusively to the records of the child whose ChildID was shared — no lateral access to other patients
- **FR37:** Parent can view a timestamped log of all parties who have accessed their child's record via ChildID, including actor identity and access type
- **FR38:** Caregiver with read-only access can view a child's vaccination plan but cannot add records, approve administrations, or modify any data
- **FR39:** Parent can revoke caregiver access at any time, immediately removing all access permissions
- **FR40:** System enforces time-limited, signed access tokens for all QR-based record access; expired tokens are automatically invalidated

### Doctor Verification & Clinic Management

- **FR41:** Doctor can submit credential verification by providing medical license number, country of practice, and supporting documentation
- **FR42:** Platform admin can review, approve, or reject doctor credential verification requests from a dedicated queue
- **FR43:** Approved doctor receives access to the full doctor portal; rejected doctor receives a reason and a path to resubmit
- **FR44:** Clinic admin can view and manage which verified doctors are associated with their clinic subscription
- **FR45:** Clinic can subscribe to a paid plan via credit card with monthly or annual billing options
- **FR46:** System generates invoices, handles subscription renewals, and manages payment failure notifications automatically via Stripe

### Administration & Compliance

- **FR47:** Platform admin can view, filter, and action all pending doctor credential verification requests in a managed queue
- **FR48:** Platform admin can deactivate a doctor account at any time, immediately revoking all portal access and ChildID-based record access
- **FR49:** Parent can request full deletion of their account and all associated child data, with the system processing the deletion in compliance with GDPR right to erasure
- **FR50:** System logs all PHI access events — including who accessed what record, when, and what action was taken — in a tamper-evident audit log
- **FR51:** Parent can export their child's complete vaccination record in a portable, human-readable format
- **FR52:** System enforces verifiable parental consent collection before storing or processing any data about children under 13 (COPPA compliance)
- **FR53:** System supports regional data residency configuration, allowing child health data to be stored in the region corresponding to the parent's country of residence

## Non-Functional Requirements

### Performance

- **NFR-P1:** Doctor's QR scan to vaccination plan display completes in under 30 seconds on a standard mobile connection
- **NFR-P2:** All standard API operations (plan view, profile load, record list) respond in under 2 seconds at the 95th percentile
- **NFR-P3:** Approval request notifications are dispatched within 2 minutes of a doctor submitting a vaccine administration record
- **NFR-P4:** Proactive reminder notifications are dispatched within 1 hour of the scheduled reminder window opening
- **NFR-P5:** Vaccination plan published by doctor becomes visible to parent within 5 minutes of publication
- **NFR-P6:** ChildID QR code generation completes server-side in under 1 second

### Security

- **NFR-S1:** All data at rest is encrypted using AES-256; all data in transit uses TLS 1.2 or higher
- **NFR-S2:** API authentication uses JWT access tokens (short-lived, 15 minutes) with refresh token rotation; refresh tokens are invalidated on logout and on suspicious activity detection
- **NFR-S3:** QR-based access uses signed, time-limited tokens — tokens expire after a configurable window and cannot be reused after expiry
- **NFR-S4:** All API endpoints are protected by role-based rate limiting; admin routes have stricter limits than user routes
- **NFR-S5:** PHI access audit logs are tamper-evident — log entries cannot be modified or deleted after creation
- **NFR-S6:** The platform undergoes third-party penetration testing before public launch and annually thereafter
- **NFR-S7:** HIPAA Business Associate Agreements are executed with all cloud infrastructure and third-party service providers (SendGrid/SES, Twilio, Stripe, FCM, hosting provider) before any PHI is processed

### Scalability

- **NFR-SC1:** The system architecture supports 10x growth from launch targets (5,000 parent accounts, 500 active doctors) without requiring re-architecture
- **NFR-SC2:** MongoDB collections are designed with horizontal scaling (sharding) in mind from day one; sharding keys chosen during initial schema design
- **NFR-SC3:** The notification pipeline handles concurrent batch reminder dispatch without degrading API response times
- **NFR-SC4:** The system supports multi-region deployment to meet data residency requirements as new countries are activated
- **NFR-SC5:** Background jobs (reminder scheduler, approval timeout enforcer) are idempotent and safe to run across multiple instances without duplicate notification delivery

### Accessibility

- **NFR-A1:** The React web application meets WCAG 2.1 Level AA compliance
- **NFR-A2:** The React Native mobile app uses platform accessibility APIs (iOS VoiceOver, Android TalkBack) for all interactive elements
- **NFR-A3:** All notification content (email, SMS, push) is written in plain language accessible to a general adult population
- **NFR-A4:** The codebase is structured for internationalization (i18n) from launch — UI strings are externalized and not hard-coded, ready for multi-language support in Phase 2
- **NFR-A5:** Colour contrast ratios for all UI text meet WCAG AA minimums (4.5:1 for normal text, 3:1 for large text)

### Integration Reliability

- **NFR-I1:** Email and SMS notification integrations achieve 99%+ delivery rate; undeliverable messages trigger automatic fallback to the next channel in the chain (push → SMS → email)
- **NFR-I2:** Stripe payment integration is PCI DSS compliant; no raw card data is stored or processed by vital-track servers — all card handling is delegated to Stripe's hosted elements
- **NFR-I3:** Firebase Cloud Messaging (FCM) push notification integration handles token expiry gracefully — stale tokens are refreshed automatically and the notification is retried
- **NFR-I4:** All third-party integration failures are logged with full context and trigger admin alerts for persistent failures

### Reliability

- **NFR-R1:** The platform maintains 99.9% uptime during clinic hours (6am–10pm local time per active region)
- **NFR-R2:** Zero vaccination records are lost due to infrastructure failure — all record writes use MongoDB majority write concern before acknowledging success to the client
- **NFR-R3:** The parent mobile app and doctor mobile app provide graceful offline degradation — previously loaded records are readable without network connectivity; write operations are queued and synced on reconnection
- **NFR-R4:** The system has a defined Recovery Time Objective (RTO) of 4 hours and Recovery Point Objective (RPO) of 1 hour for all vaccination record data
