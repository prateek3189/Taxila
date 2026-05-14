---
title: "Product Brief: simple-todo"
status: "draft"
created: "2026-04-03"
updated: "2026-04-03"
inputs: ["user-discovery-session", "web-market-research"]
---

# Product Brief: simple-todo

## Executive Summary

Most people don't need a productivity system. They need a place to put things so they stop living in their head. The 2am thought, the mid-meeting idea, the shower realization — these need to go somewhere fast, with no friction between the thought and the capture.

Yet every major todo app demands setup: create an account, choose a workspace, pick a project. By the time you're ready to add the task, you've forgotten what it was.

simple-todo is a cross-platform task manager built on a single conviction: get out of the way. Open it, add a task, close it. Your tasks never leave your device — no account, no cloud, no third party holding your data. It installs on your home screen like a native app with zero App Store friction. It works offline, always.

This is a personal project serving three purposes: a daily driver the developer genuinely uses, a portfolio showcase of clean full-stack architecture, and a hands-on learning vehicle for React, Node, offline-first patterns, and PWA development.

---

## The Problem

Existing todo apps fail in two ways. The premium ones (Things 3, OmniFocus) are powerful and beautiful — but Apple-only, paid, and overkill. The free ones (Todoist, TickTick) require accounts, upsell constantly, and accumulate features until they're indistinguishable from the complexity they claimed to solve.

The alternative most people actually use? Their phone's native Notes app. It's always there, always open — but it doesn't know the difference between a task and a thought. No completion state. No due date. No intentional act of "done." Tasks and notes blur together, and the list never shrinks.

The actual need is simpler than the market serves: *I have things to do. I don't want to lose them. I want to mark them done. That's it.*

---

## The Solution

simple-todo is a browser-based, installable task manager with exactly what you need:

- **Add tasks** — one field, one tap, instant capture
- **Set due dates** — optional and lightweight, no reminder noise
- **Edit task text** — because you'll change your mind
- **Mark complete / delete** — the satisfying part
- **Ordered by creation date** — newest first, always

Everything lives in your browser's localStorage. No server round-trips for data. No account creation. Open the URL and you're in, on any device, in any browser. Install it to your home screen as a PWA and it behaves like a native app — including full offline support.

**Architecture:** The React frontend handles all UI and state. Node serves the application and provides an API scaffold ready for optional future sync. Data persists in localStorage — private, instant, and zero-latency by design.

---

## What Makes This Different

The differentiator is not a feature — it's a refusal.

**vs. heavyweight apps (Todoist, TickTick):** No account. No subscription. No onboarding. Open and go.

**vs. minimalist apps (Things 3):** Cross-platform from day one. Works on Android, iOS, and any desktop browser. Free. No install required.

**vs. notes apps (Apple Notes, Google Keep):** Task-shaped, not note-shaped. Every item has a completion state. Due dates are first-class. The list is meant to shrink, not grow forever.

**The privacy angle:** Your tasks never leave your device. localStorage is not a server — it's your browser's memory. No company has access to what you need to do today. In an era where personal data is the product, local-first is a genuine trust signal.

---

## Who This Serves

**Primary user: Anyone who just needs to remember things.**

They're not building a second brain. They're not a GTD enthusiast. They reach for a todo app the way they'd reach for a sticky note — instinctively, quickly, without wanting to think about it. They've tried Todoist, found it overkill, and are either back to Notes or keeping tasks in their head.

What they need: open fast, add fast, close fast. Works when offline. Doesn't ask for an email address.

**Secondary user: The developer (Prateek) as daily driver.**

The app will be dogfooded from day one. Every rough edge will be felt and fixed by the person who built it — the most honest quality signal a personal project can have.

---

## Success Criteria

| Dimension | Signal |
|-----------|--------|
| **Daily driver** | Developer uses it as primary task list for 30+ consecutive days |
| **UX standard** | First-time user adds a task within 5 seconds, zero instructions needed |
| **Reliability** | No task loss under normal usage; app loads and functions fully offline |
| **Portfolio quality** | Clean, reviewable codebase demonstrating React component design, localStorage architecture, PWA patterns, and Node API structure |
| **Learning** | Hands-on implementation of offline-first architecture, PWA manifest + Service Workers, React state management |

---

## Scope

**In for v1:**
- Create, read, update, delete tasks
- Optional due date per task
- Tasks ordered by creation date (newest first)
- Mark tasks complete (with visual distinction)
- localStorage persistence — zero-latency, fully private
- Responsive design: works on mobile browser and desktop
- PWA manifest for home-screen installation
- Offline support via Service Worker

**Explicitly out of scope for v1:**
- User accounts / authentication
- Cloud sync or cross-device data sharing
- Projects, lists, or folders
- Tags or labels
- Reminders or push notifications
- Collaboration or sharing
- Recurring tasks
- Priority levels or reordering
- Search or filtering
- Data export

**Known constraint:** localStorage data is browser- and device-specific. Tasks added on a phone won't appear on a laptop. This is an intentional v1 boundary — not a bug, but a scope decision with future optionality (optional sync as a v2 path).

---

## Vision

simple-todo is deliberately small. The vision is not expansion — it's refinement.

The honest two-year path: if the app earns daily use, the one natural unlock is optional cloud sync — not mandatory, not account-gated, but available for users who want tasks across devices. A PWA that optionally backs up to a lightweight Node API is achievable without betraying the simplicity core.

What it will not become is Todoist. The measure of success is a tool the developer is genuinely proud to have built and genuinely reaches for every day — a rare combination in personal projects, and the clearest possible definition of done.
