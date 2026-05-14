---
title: "Product Brief: vital-track"
status: "draft"
created: "2026-04-03"
updated: "2026-04-03"
inputs: ["User interview session - 2026-04-03", "Web market research - April 2026"]
---

# Product Brief: vital-track

## Executive Summary

Every year, millions of parents scramble to piece together their child's vaccination history from paper cards, clinic printouts, and memory — only to discover records are lost, incomplete, or held by a doctor they no longer visit. For parents managing multiple children across multiple healthcare providers, this chaos is routine. vital-track eliminates it.

vital-track is a cross-platform (web + mobile) health tracking app for children, starting with a Vaccination Tracker that connects parents and doctors in a shared, real-time record. Doctors create and publish personalized vaccination plans from a dedicated portal. Parents view and manage their children's plans. When a vaccine is administered, the doctor marks it complete — and the parent approves via email, SMS, or push notification before the record is finalized. No paper. No guessing. No disputes.

The timing is structurally right. A 2023 regulatory mandate (ONC/CMS in the US, with equivalents expanding globally) now requires EHR systems to expose immunization data via open APIs — creating the interoperability infrastructure that makes a portable, cross-provider vaccination record finally possible. No existing consumer app has built the workflow layer on top of it. vital-track does. The global pediatric digital health market is valued at $4.2B and growing at 18–22% CAGR, with no dominant, clinician-connected vaccination tracker at consumer scale.

## The Problem

A parent with two kids, three pediatricians between them, and a school enrollment deadline next month has no reliable single source of truth for their children's vaccination records. The status quo:

- Paper "yellow cards" that get lost in moves, floods, or junk drawers
- Vaccination history split across multiple clinics with no shared view
- Manual entry apps where accuracy depends entirely on the parent's memory
- EHR portals (like MyChart) that only work if every doctor is on the same hospital network
- School enrollment and travel deadlines that require records on demand — with no easy way to compile or share them

Doctors face the mirror problem: when a new patient walks in, vaccination history is often unknown, leading to redundant vaccinations or dangerous gaps. There is no lightweight, cross-provider mechanism for a clinician to quickly access a child's existing plan without navigating a different EHR system.

## The Solution

vital-track connects parents and doctors around a single, authoritative vaccination record for each child — with the doctor as the trusted source of data and the parent as the final approver.

**For parents:**
- Create a family account and add each child — uniquely identified by name + phone number, with a system-generated **ChildID**: a 6-character code and scannable QR
- View the vaccination plan published by their child's doctor
- Receive tri-channel notifications (email, SMS, in-app push) when a vaccine is marked as administered
- Approve every record update before it's finalized — parents are never passive recipients
- Add external vaccinations received outside the primary plan
- Grant access to caregivers (grandparents, co-parents, nannies) at appropriate permission levels

**For doctors:**
- Access a dedicated doctor portal (web + mobile), available after credential verification
- Create and publish master vaccination plans per child
- Access any child's plan instantly via ChildID code or QR scan — no EHR network required
- Mark vaccines as administered; changes only finalize upon parent approval
- One child, many doctors — the plan is shared across all linked providers

## What Makes This Different

**Clinician-sourced, parent-controlled:** Every existing consumer vaccination app relies on parent-entered data. vital-track's records are created by verified doctors and confirmed by parents — giving schools, clinics, and future providers something they can actually trust.

**The ChildID — a portable health identity:** The 6-character code + QR system is a novel, lightweight identity primitive for pediatric health that is not tied to any national ID, insurance system, or hospital network. Any verified doctor with the app can access a child's record instantly — enabling true cross-clinic, cross-country continuity. No competitor offers this.

**Approval-gated records:** Every vaccine administration requires explicit parent approval before it's recorded. Parents retain legal control. Trust is built structurally, not by policy statement.

**Independent of EHR lock-in — by design:** EHR vendors (Epic, Cerner, Oracle Health) have no commercial incentive to build portability across their competitors' systems. vital-track is structurally independent — the coordination layer between providers and families, not a replacement for clinical systems and not beholden to any vendor.

**The network flywheel:** Each doctor who joins activates their patient panel. Each parent who joins makes the platform more valuable to the next doctor. The ChildID QR means doctors at urgent care clinics or specialist offices actively recommend the app to access a child's record — turning every clinical encounter into a potential acquisition event.

## Who This Serves

**Primary — Parents of young children (free tier)**
Tech-comfortable parents managing vaccination schedules for one or more children. Juggling work, school enrollment, travel, and multiple doctors. They are the final authority on their child's health decisions. Success: zero vaccination record surprises, ever.

**Primary — Pediatricians and GPs (subscription tier)**
Doctors who want a lightweight, direct channel to their patients' families outside of slow, expensive EHR patient portal systems. Success: faster intake, fewer "we don't have the records" delays, and a parent population that shows up prepared. The model mirrors proven B2B2C healthcare platforms (Doximity, Zocdoc) — charge the supply side, grow the demand side for free.

**Secondary — Urgent care clinics and specialists**
Providers who see a child occasionally and need rapid, audited read access to vaccination history. The ChildID QR serves this use case with zero friction and no account required.

**Secondary — Caregivers and co-parents**
Grandparents, nannies, divorced co-parents, and foster carers who need situational access. Tiered caregiver permissions (read-only, notification-only, approval-capable) address real household complexity that single-account apps ignore.

## Business Model

| Tier | Users | Model |
|------|-------|-------|
| Free | Parents & caregivers | No cost; non-intrusive contextual advertising (health/parenting category only, no behavioral targeting of child data); optional donation ("Buy Me a Coffee") |
| Subscription | Doctors / Clinics | Monthly or annual subscription for doctor portal access and plan management |

Revenue mix: subscription (primary), contextual advertising (secondary), donations (supplementary). The free parent tier removes all adoption barriers and drives the network growth that makes the doctor subscription valuable. **Note: advertising must be strictly contextual — no behavioral targeting of children's health data — to comply with COPPA and GDPR.**

## Regulatory & Compliance

Handling children's health data globally is a regulated activity. Key frameworks in scope:

- **HIPAA (US):** BAAs required with all cloud infrastructure providers; audit logging; breach notification; encryption in transit and at rest
- **COPPA (US):** Verifiable parental consent for data involving children under 13; no behavioral advertising on child profiles
- **GDPR (EU/UK):** Enhanced protections for children's data; right to erasure implemented from day one
- **India DPDP Act (2023):** Explicit consent required; behavioral monitoring of children prohibited

Compliance is scoped into the MVP engineering budget — not deferred. Doctor credential verification is a launch requirement, not a post-launch feature.

## Success Criteria

**MVP validation (months 1–6):**
- 500+ active parent accounts with at least one child profile
- 50+ doctors actively using the portal (defined as: published ≥1 plan and marked ≥1 vaccination in the trailing 30 days)
- Median time-to-parent-approval under 24 hours for doctor-submitted records
- <5% parent rejection rate on doctor-submitted vaccine administration records

**Growth signal (month 12):**
- Doctor-to-parent referral as primary acquisition path (target: 40%+ of parent signups from doctor recommendation or ChildID QR scan)
- Active usage in 3+ countries

## Scope

**MVP — Vaccination Tracker:**
- Parent account with multi-child profile management
- Doctor portal with vaccination plan creation and publishing (after credential verification)
- ChildID system: name + phone uniqueness → 6-character code + QR
- Multi-doctor access per child via ChildID
- Vaccine administration + parent approval workflow (with defined states: pending, approved, rejected, expired)
- Tri-channel notifications: email, SMS, in-app push
- External vaccination addition (by parent or doctor)
- Basic caregiver access tiers
- Web (primary) + mobile (cross-platform, phased)

**Explicitly out of scope for MVP:**
- Medical history tracking (treatments, allergies, medications) — Phase 2
- EHR / FHIR direct integration — post-MVP
- School, insurance, or government portal integrations
- AI-powered schedule personalization
- Travel health readiness checks
- In-app billing or payments
- Outbreak/recall alerting

## Vision

vital-track starts as a vaccination tracker. It becomes the pediatric health record layer that travels with the child — not tied to any hospital, clinic, or country.

As the platform matures, it absorbs the full arc of a child's medical history: allergy records, treatment timelines, medication logs, growth charts. Families that relocate, change doctors, or travel internationally will never need to reconstruct what they already know about their child's health.

Strategic expansion paths include school compliance certification (digital proof of vaccination for enrollment), travel health readiness, outbreak alerting tied to the child's record and location, and partnerships with pediatric hospital networks and pharmacy chains.

In 3 years, vital-track is the portable, parent-controlled health passport for every child — connected to doctors globally, trusted by schools and clinics, and fully owned by the family. As children age into adolescence and adulthood, their record transitions with them — creating a lifetime health identity that begins at birth.
