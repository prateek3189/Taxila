---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type"]
inputDocuments:
  - "_bmad-output/planning-artifacts/product-brief-simple-todo.md"
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
workflowType: 'prd'
---

# Product Requirements Document - simple-todo

**Author:** Prateek.magarde
**Date:** 2026-04-03

## Executive Summary

simple-todo is a browser-based, installable task manager built on a single conviction: get out of the way. It exists for people who need to capture a thought before it disappears — not manage a system. Open it, add a task, close it. No account creation, no cloud dependency, no onboarding friction between the thought and the capture.

The target user is anyone who reaches for a sticky note — instinctively, quickly, without wanting to think about it. They've tried full-featured todo apps and found them overkill. They're managing tasks in a Notes app or their head, neither of which knows the difference between a task and a thought.

simple-todo also serves as a portfolio project and active learning vehicle for its developer — demonstrating clean full-stack architecture across React, Node, offline-first patterns, and PWA development, while being genuinely dogfooded as a daily driver.

### What Makes This Special

The differentiator is restraint. In a category where every competitor adds features to justify existence, simple-todo's advantage is a deliberate refusal to add: no accounts, no sync, no projects, no notifications, no subscription. This is not minimalism as aesthetic — it's minimalism as architecture.

Privacy follows naturally: data lives in the browser's localStorage, never leaves the device, and no third party holds or monetizes it. In an era where personal data is the product, local-first is a genuine trust signal — not a limitation.

The core insight: most people don't need a productivity system. They need a place to put things so they stop living in their head. The market undershoots this need (Notes apps have no task semantics) or overshoots it (Todoist, OmniFocus add complexity to solve complexity). simple-todo holds the line.

## Project Classification

- **Project Type:** Web App (SPA + PWA)
- **Domain:** General Productivity
- **Complexity:** Low
- **Project Context:** Greenfield

## Success Criteria

### User Success

- First-time user adds a task within 5 seconds with zero instructions or onboarding
- Task capture works without hesitation — no loading states, account prompts, or modal interruptions
- App loads and is fully functional offline, every time
- No task is silently lost under normal usage (add, edit, complete, delete)

### Business Success

*This is a personal project — traditional business metrics (revenue, growth, retention) do not apply. Success is defined across two dimensions:*

- **Daily driver:** Developer uses simple-todo as their primary task list for 30+ consecutive days post-launch
- **Portfolio signal:** Codebase is clean and reviewable — a hiring reviewer or technical peer can assess React component design, localStorage architecture, PWA patterns, and Node API structure without guidance

### Technical Success

- App installs to home screen via PWA manifest and behaves as a native app
- Service Worker enables full offline support — no network required after first load
- localStorage persistence is zero-latency and fully private — no server round-trips for task data
- Responsive design functions correctly on mobile browser and desktop

### Measurable Outcomes

| Outcome | Signal |
|---------|--------|
| Speed of capture | Task added within 5 seconds of opening app |
| Reliability | Zero task loss under normal usage |
| Offline | App fully functional with no network connection |
| Daily use | 30+ consecutive days as developer's primary task list |
| Learning | PWA manifest, Service Worker, React state, localStorage all implemented hands-on |

## Product Scope

### MVP — Minimum Viable Product

- Create, read, update, delete tasks
- Optional due date per task
- Tasks ordered by creation date (newest first)
- Mark tasks complete with visual distinction
- localStorage persistence — zero-latency, fully private
- Responsive design: mobile browser and desktop
- PWA manifest for home-screen installation
- Offline support via Service Worker

### Growth Features (Post-MVP)

- Optional cloud sync — not mandatory, not account-gated, available for users who want tasks across devices
- Lightweight Node API backend to support optional sync

### Vision (Future)

simple-todo stays deliberately small. The vision is refinement, not expansion. If it earns daily use, optional sync is the one natural unlock. It will not become Todoist.

## User Journeys

### Journey 1: The 2am Thought (Primary User — Happy Path)

*Meet Maya. It's 11:47pm and she's in bed, almost asleep, when she remembers she needs to reschedule a dentist appointment before Thursday. She grabs her phone.*

Her Notes app is already open with a grocery list and half a draft email. She doesn't want to dig through that. She opens simple-todo — it was already on her home screen from a week ago, installed in thirty seconds from a browser prompt. The app opens instantly, no splash screen, no loading spinner. One text field. She types "reschedule dentist - before Thu" and taps add. Done. She closes it and goes to sleep.

The next morning, the task is still there. She marks it complete. The list shrinks. That's it.

**What this journey requires:**
- Instant load (no splash, no boot delay)
- Single prominent input field, always focused
- One-tap task add
- Persistent localStorage state across sessions
- Task completion with visual distinction
- PWA home screen installation

---

### Journey 2: Managing the List (Primary User — Returning Use)

*It's Friday afternoon. Maya opens simple-todo to clear out the week. She has 6 tasks.*

Two are done — she marks them complete. One is wrong — she taps to edit the text and fixes it. One has a due date she'd set for Monday that she wants to remove — she clears it. She deletes two tasks that are no longer relevant. The list is now clean: two items remaining, newest first.

She didn't need to open a menu, navigate to settings, or confirm anything twice.

**What this journey requires:**
- Inline task editing
- Mark complete / unmark
- Delete task
- Optional due date (add, edit, clear)
- Tasks ordered newest-first by default
- No confirmation dialogs for routine actions

---

### Journey 3: Offline at the Airport (Primary User — Edge Case)

*Maya's at the gate. Airplane mode. She needs to add three tasks before her flight.*

She opens simple-todo from her home screen. It loads — fully, from the Service Worker cache. She adds three tasks. No error, no "you're offline" banner, no sync warning. The tasks are in localStorage. When she lands and reconnects, nothing changes. They're still there, because they were never on a server.

**What this journey requires:**
- Service Worker caching entire app shell
- Full functionality with zero network
- No offline-state UI friction (no banners or warnings for expected offline use)

---

### Journey 4: Prateek Ships a Bug (Developer — Dogfooding)

*Prateek adds a task on his laptop. Later on his phone, the task isn't there.*

This is expected behavior — localStorage is device-specific. But the first time it happens, it needs to feel intentional, not broken. There's no error message, no sync failure, no missing toast. The app is working exactly as designed. The question is whether it feels designed or broken.

This journey is a quality signal: does the app's simplicity feel intentional, or does it feel like something is missing?

**What this journey requires:**
- No implied cross-device sync (no UI that suggests tasks should sync)
- Consistent experience per device — each is its own independent list
- Clear, honest scope: the app is a local tool, and that should feel right, not like a limitation

---

### Journey Requirements Summary

| Capability | Required By |
|-----------|------------|
| Instant app load (PWA, cached) | Journey 1, 3 |
| Add task (single input, one tap) | Journey 1 |
| Mark complete / unmark | Journey 1, 2 |
| Edit task text inline | Journey 2 |
| Delete task | Journey 2 |
| Optional due date (add, edit, clear) | Journey 2 |
| Newest-first ordering | Journey 2 |
| Full offline functionality via Service Worker | Journey 3 |
| localStorage persistence (no server) | Journey 1, 3, 4 |
| No cross-device sync implied by UI | Journey 4 |

## Web App Specific Requirements

### Project-Type Overview

simple-todo is a Single Page Application (SPA) built with React, delivered as a Progressive Web App (PWA). All application logic and state management runs client-side. The Node backend serves the application shell and provides an API scaffold — it does not handle task data in v1. The architecture is deliberately thin on the server side.

### Technical Architecture Considerations

- **SPA architecture:** React handles all UI rendering and state. No server-side rendering required.
- **PWA delivery:** App manifest enables home screen installation on iOS, Android, and desktop. Service Worker caches the full app shell for offline use.
- **Data layer:** All task data lives in `localStorage` — zero server round-trips for task operations. No database required in v1.
- **Node role:** Serves static assets and provides a clean API scaffold for optional future sync. No task data flows through it in v1.

### Browser Support Matrix

| Browser | Target | Notes |
|---------|--------|-------|
| Chrome (desktop + Android) | ✓ Primary | Full PWA support |
| Safari (iOS + macOS) | ✓ Primary | PWA install via "Add to Home Screen" |
| Firefox | ✓ Supported | PWA support varies; core functionality required |
| Edge | ✓ Supported | Chromium-based, full PWA support |
| All PWA-capable browsers | ✓ | No browser explicitly excluded |

### Responsive Design

- Mobile-first layout: full functionality on small screens (360px+)
- Desktop layout: comfortable on wide viewports
- No native device features required (no camera, GPS, etc.)

### Performance Targets

| Metric | Target |
|--------|--------|
| App load (first meaningful paint) | < 1 second |
| Task add response | < 100ms (localStorage write, synchronous) |
| Offline load (from Service Worker cache) | < 1 second |

### SEO Strategy

Out of scope for v1. No public landing page, no indexable content. The app is accessed directly by URL or home screen shortcut.

### Accessibility

Reasonable defaults targeting WCAG 2.1 AA for a personal tool:
- Keyboard navigable (tab, enter, escape)
- Sufficient color contrast for task states (default, complete)
- Screen reader compatible labels on interactive elements
- No time-based interactions

### Implementation Considerations

- Service Worker scope: full app shell caching on install; cache-first strategy for offline
- localStorage key schema: simple, flat structure (array of task objects with id, text, createdAt, completedAt, dueDate)
- PWA manifest: name, icons, start URL, display mode (standalone), theme color
