# TP FAB Agents – Working Notes & Demo Context

> This document captures the intent, design rules, and architecture decisions for TP FAB Agents and related pages so any engineer or AI assistant (on any machine) can understand the project without chat history.

---

## 1. What TP FAB Agents is

- **TP FAB Agents (previously “Agentic Support”)**:
  - AI-powered console for **device & customer support**, currently focused on **printer support**.
  - Runs **self-healing workflows** and creates **tickets** for both self-healed and escalated cases.
  - Integrates with a **CCAS-like layer** (currently FreeSWITCH-style simulation, designed to be swappable to Genesys / Google CCAI later).
- **Key goals for C‑level demo**:
  - Show **end-to-end flow**: live interaction → intent brain → knowledge source → telemetry → workflow outcome → ticket creation.
  - UI must look **production-grade**, not “demo” (no “demo mode” text, no “mock” labels).

---

## 2. Key files & components

> Paths are relative to `src/`.

- **Main console**
  - `apps/agentic-support/components/Console.jsx`
    - Main TP FAB Agents console.
    - Handles:
      - Multi-channel input (via live interaction monitor).
      - Intent Brain (intent detection, category, alternative matches).
      - Knowledge Source (reasoning + document refs + PDF viewer).
      - Telemetry (`Input datapoints` card).
      - Workflow outcome card (self-heal vs escalate).
      - Ticket creation (always creates a ticket with full context).

- **CCAS layer**
  - `apps/agentic-support/components/CCASConnectionPanel.jsx`
    - Shows CCAS provider status (currently FreeSWITCH-styled).
    - Real-time stats (active calls, messages, throughput, latency).
  - `apps/agentic-support/components/LiveDemoController.jsx` (a.k.a. LiveInteractionMonitor)
    - Simulates realistic multi-channel traffic:
      - Auto mode: SMS scenario (printer inkjet issue).
      - Manual triggers for voice/SMS/WhatsApp/chat.
      - Live voice via browser SpeechRecognition.
    - Feeds normalized events into `Console.jsx` (`handleDemoInteraction`).

- **Knowledge / documents**
  - `apps/agentic-support/components/KnowledgeDocViewer.jsx`
    - SOP-style viewer for knowledge PDFs/texts.
    - Auto-scrolls to the right page & highlights relevant sections.
  - `apps/agentic-support/services/knowledgeBase.js`
    - Mock semantic search + category mapping for now; structured for future RAG/vector DB.

- **Tickets & Watchtower**
  - `apps/agentic-support/services/ticketsService.js`
    - Local ticket store + rich mock data for demos.
  - `apps/agentic-support/components/TicketsTable.jsx`
    - Worklist of tickets raised by TP FAB Agents:
      - Columns include complaint description, category, ticketing system, created on, knowledge source.
      - Pagination, filters, sorting, expandable rows.
  - `apps/agentic-support/components/Watchtower.jsx`
    - Operational view: tickets table + live activity (no longer a “marketing dashboard”).

- **Executive reporting**
  - `apps/agentic-support/components/ExecutiveDashboard.jsx`
    - “Reports & Analytics / Executive Dashboard”:
      - Business impact metrics (ROI, savings, efficiency).
      - Predictive insights, trends.
    - Watchtower now focuses on operations; this file holds C‑level metrics.

- **Admin & configuration**
  - `apps/agentic-support/components/Admin.jsx`
    - Admin page with 4 tabs:
      - CCAS Config, Integrations, Security & Access, Notifications.
    - Layout is **full-width**; no half-width narrow cards.

- **Layout & navigation**
  - `apps/agentic-support/components/Layout.jsx`
    - Left-nav for TP FAB Agents app.
    - Product name is **“TP FAB Agents”** everywhere (we removed “Agentic Support”).

- **FAB Store entries**
  - `data/fabApps.js`
    - `TP FAB Agents` app entry:
      - `status: "Live"` (not Preview/Coming Soon).
      - Tags: no “Live Demo”/“Demo”.
      - `launchKey: "agentic"` opens the console.
  - `data/fabPlatforms.js`
    - `agentic-support` platform: “TP FAB Agents Platform”.

---

## 3. UI / UX rules (very important for any future changes)

> These were refined through many design passes; please **preserve** them.

- **Cards & height**
  - Main console row has **three cards**: Customer Input, Intent Brain, Input Datapoints.
  - They must have **consistent height & padding** (no visible jumps).
  - No scrollbar jitter during the AI flow (avoid `overflow-y-auto` unless strictly needed).

- **Knowledge Source**
  - Shown **inside the Intent Brain card**.
  - Must **not increase card height noticeably**; use a compact strip with:
    - Matched category, 1–2 lines of reasoning, doc/page ref, and “View document”.
  - Alternative matches should remain visible; knowledge strip co-exists below them.

- **Telemetry (`Input datapoints`)**
  - Renamed from “Device telemetry”.
  - Must feel **smart & compact**, not empty:
    - Show device, OS, connection, last error, sentiment, etc., based on the detected issue.

- **Workflow & tickets**
  - Even when intent is unknown:
    - Flow must still proceed through stages.
    - A **ticket is always created** with full context and category, marked as escalation.
  - Ticket modal must show for **both** self-healed and escalated flows.

- **CCAS / Live interaction**
  - No “demo”, “mock”, or obviously fake labels in UI copy.
  - Headers:
    - **CCAS Integration Layer** (top).
    - **TP Console Core** for the main console band.
  - CCAS cards and Live Interaction Monitor must share a consistent purple/dark theme.
  - Agentic storyboard / extra progress chips were removed; progress is implied by the main cards.

- **Scrolling & layout**
  - The **entire workflow** (CCAS header, 3 cards, workflow outcome) should be visible with minimal scrolling on a typical laptop.
  - Use compact spacing but keep the UI “breathable”; no giant white gaps.

---

## 4. Demo flows

### 4.1 Primary auto demo (used for C‑suite)

1. Start **AI Auto** mode in `LiveInteractionMonitor`.
2. Auto SMS comes in: **printer inkjet / cartridge not recognized**.
3. Console stages:
   - Customer Input (transcribed issue).
   - Intent Brain (matches `ink_error`; shows category + alternatives + knowledge strip).
   - Knowledge Source (reasoning + SOP snippet).
   - Input Datapoints (device & context).
   - Workflow Outcome:
     - Either self-heal (ink error fixed) or escalate.
4. Ticket modal:
   - Always appears.
   - Ticket is saved into `ticketsService` and visible in **Watchtower → TicketsTable**.

### 4.2 Manual demo

- Use **Manual** mode in `LiveInteractionMonitor` to trigger:
  - Sample voice call.
  - Sample SMS / WhatsApp / chat messages.
- Same downstream flow in `Console.jsx`.

---

## 5. CCAS integration direction (future work)

> For now we simulate FreeSWITCH-like behaviour, but the architecture is designed to plug in real CCAS (Genesys, Google CCAI, etc.).

- Recommended backend structure (not yet fully implemented):
  - `backend/src/services/ccas/genesys/GenesysClient.js`
    - OAuth client for Genesys Cloud API.
  - `backend/src/services/ccas/genesys/GenesysWebhookHandler.js`
    - Normalizes Genesys webhooks into internal events.
  - `backend/src/services/ccas/events/EventRouter.js`
    - Maps CCAS events to workflow engine triggers.
  - `backend/src/routes/ccasRoutes.js`
    - Routes: `/api/v1/ccas/genesys/webhook`, `/status`, etc.

- Frontend integration plan:
  - `apps/agentic-support/services/genesysService.js`
    - SSE/WebSocket client for live events from backend.
  - `Console.jsx`
    - `handleGenesysEvent` that normalizes CCAS events and forwards into the existing `handleDemoInteraction`.

---

## 6. Ngrok & Windows demo launcher

- **Ngrok setup**
  - See `NGROK_DEMO_SETUP.md` and `ngrok.yml` for how we run public links for the frontend.

- **Windows demo launcher**
  - `Start Demo.bat` and `Start Demo.vbs`:
    - Double-clickable launcher on Windows.
    - Handles:
      - Checking/starting Node server.
      - Optionally starting ngrok.
      - Opening browser on the right URL.
    - Includes a splash screen and supports a custom icon.

---

## 7. How to talk to AI inside this repo

When using Cursor (on any machine), keep these constraints in mind:

- **Branding**
  - Use **“TP FAB Agents”** (solution) and **“TP FAB Agents Platform”** (backend platform).
  - FAB Store titles and descriptions should not say “demo”.

- **Design constraints**
  - Maintain **consistent card sizing and padding** across Console cards.
  - Do not add new sections that push the workflow off-screen without a strong reason.

- **Content**
  - Avoid “Coming Soon” and “Copy” items in any customer-facing section unless explicitly intended.
  - For FAB Store, TP FAB Agents is **Live** and should appear as a first-class app.

---

_Last updated: 2026-01-07_


