# Product Requirements Document (PRD): ScholarAgent AI

**Project Name:** ScholarAgent AI  
**Document Purpose:** Master Blueprint & Phase-Wise Execution Spec for Autonomous Coding Agents  

---

## 1. Executive Summary & System Vision

**ScholarAgent AI** is a dual-surface autonomous scholarship discovery, eligibility reasoning, and form-execution platform. It consists of:
1. **A Central Web Dashboard (React + Tailwind CSS):** Where students manage their unified academic/demographic profile, upload verification documents into a local vault, view live **TinyFish Web Agent** SSE streams, and track matched scholarships.
2. **A Companion Chrome Extension (Manifest V3):** Enabled on any active browser tab to scrape live scholarship notices, extract DOM form schemas from legacy state/trust portals, sync captured context back to the Web Dashboard, and execute 1-click assisted form auto-fills.
3. **An Orchestration Backend (FastAPI / Node.js):** Connects the LLM Fine-Print PDF Evaluator and the **TinyFish Web Agent API** (`/v1/automation/run-sse`) to execute parallel cloud discovery and multi-step form navigation.

__NOTE:__ Don't use typescript(Use normal jsx even if you see in the PRD). keep the things simple and less dependencies. Instead of creating panels create different pages in the dashboard. Keep the UI technical things abstracted from user, as they just want their work done not to hinder around with technical jargons.

### Key Architectural Directives for the Coding Agent
* **Mock Auth Now:** Implement a dummy login screen (`username` / `password`) with session state stored locally.
* **Seamless Extension ↔ Dashboard Sync:** Use `window.postMessage` bridge scripts and `chrome.storage.local` / `BroadcastChannel` so any scholarship or form captured by the Chrome Extension immediately appears in the Web Dashboard without manual file imports.

---

## 2. System Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER ENVIRONMENT                            │
│                                                                            │
│  ┌───────────────────────────────┐      ┌───────────────────────────────┐  │
│  │   CHROME EXTENSION (MV3)      │      │   WEB DASHBOARD (React/Vite)  │  │
│  │  • Active Tab DOM Scraper     │◄────►│  • Dummy Auth Gate            │  │
│  │  • Form Field Detector        │ Sync │  • Unified Profile & Doc Vault│  │
│  │  • 1-Click Local Auto-Filler  │Bridge│  • Live TinyFish SSE Console  │  │
│  │  • PDF Link Extractor         │      │  • Opportunity Tracker        │  │
│  └──────────────┬────────────────┘      └───────────────┬───────────────┘  │
│                 │                                       │                  │
│                 ▼                                       ▼                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │            UNIFIED DATA ACCESS LAYER (Repository Pattern)            │  │
│  │  • Active: LocalStorage + IndexedDB (Blobs)                          │  │
│  │  • Ready-to-Activate: Supabase PostgreSQL + Supabase Storage         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┬──────────────────┘
                                                          │ REST / SSE
                                                          ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                   FASTAPI / NODE.JS ORCHESTRATION BACKEND                  │
│  • LLM Fine-Print Evaluator (Parses scheme PDFs & flags disqualifiers)     │
│  • TinyFish API Controller (/v1/automation/run-sse & Browser Profiles)     │
│  • Two-Layer Result Auditor (Prevents the "COMPLETED Trap" on CAPTCHAs)    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Phase-Wise Execution Instructions for the Coding Agent

Follow these phases sequentially. Complete all deliverables and verification checks in a phase before moving to the next.

---

### PHASE 1: Project Scaffolding & Dual-Adapter Storage Layer

#### Objective
Initialize the monorepo structure, shared interfaces, and the Repository Pattern data layer that stores everything locally today (`localStorage` + `IndexedDB`).

#### Tasks for Agent
1. **Create Workspace Structure:**
   ```
   scholaragent-ai/
   ├── dashboard/          # React + Vite + Tailwind CSS Web Application
   ├── extension/          # Chrome Extension (Manifest V3)
   ├── backend/            # FastAPI (Python) or Express (Node.js) TinyFish & LLM proxy
   ```
2. **Implement Storage Repository (`dashboard/src/services/storage/`):**
   * Create `IStorageRepository.ts` defining async CRUD methods:
     * `loginDummyUser(username, password): Promise<UserSession>`
     * `getProfile(userId): Promise<StudentProfile>`
     * `saveProfile(profile: StudentProfile): Promise<void>`
     * `listDocuments(userId): Promise<VaultDocument[]>`
     * `uploadDocument(docMetadata, fileBlob): Promise<VaultDocument>`
     * `listOpportunities(userId): Promise<ScholarshipOpportunity[]>`
     * `upsertOpportunity(opportunity: ScholarshipOpportunity): Promise<void>`
   * Implement `LocalVaultAdapter.ts`:
     * Store structured JSON entities in `localStorage` under namespaced keys (`scholaragent_profile`, `scholaragent_opportunities`, `scholaragent_session`).
     * Store uploaded PDF/Image binary blobs in `IndexedDB` (`ScholarAgentBlobDB`) so users can preview uploaded certificates without hitting the 5MB `localStorage` limit.
     * Seed realistic default data on first launch (e.g., an undergraduate B.Tech profile + 3 sample scholarships) so the dashboard never looks empty during a hackathon demo.
   * Implement `SupabasePostgresAdapter.ts`:
     * Wire `@supabase/supabase-js` client calls matching the exact `IStorageRepository` interface, toggled via `import.meta.env.VITE_STORAGE_DRIVER`.

#### Phase 1 Acceptance Criteria
* Refreshing the browser preserves the dummy user session, student profile, uploaded document blobs, and tracked scholarships.

---

### PHASE 2: Web Dashboard — Dummy Auth, Profile Vault & Document Manager

#### Objective
Build the minimal, high padding, abstarcted(since user doesn't want much of techniacal things), high-contrast light editorial Web Dashboard (`#FAFAFA` background, `#0F172A` slate text, `#EA580C` orange, `#2563EB` blue, and `#0D9488` teal accents).

#### Tasks for Agent
1. **Dummy Authentication Gate (`/login`):**
   * Render a clean login card with `Username` and `Password` inputs and a `"Demo Quick-Fill"` button.
   * Accept any non-empty username/password, create a `UserSession` in `LocalVaultAdapter`, and redirect to the main workspace.
   * Display a subtle badge in the header: `Storage Mode: Local Vault (Supabase PostgreSQL Ready)`.
2. **Panel 1 — Unified Profile & Document Vault (`/dashboard`):**
   * **Student Profile Form:** Editable fields for Academic Year, Institution, CGPA, Income Category (`EWS`, `OBC`, `SC/ST`, `General`), Annual Family Income, Domicile State, and Hosteller status.
   * **Document Vault Manager:** Drag-and-drop file uploader for Income Certificate, Domicile Certificate, Marksheet, and ID Proof.
   * **Simulated OCR Verification:** When a document is uploaded, run a lightweight client/backend check that extracts file metadata, marks status as `Verified`, and displays a preview modal fetched from `IndexedDB`.
3. **Panel 3 — Application & Opportunity Tracker:**
   * Display all captured or discovered scholarships with status pills (`98% Eligible`, `Review Needed`, `Auto-Filling`, `Disqualified`).
   * Clicking an opportunity opens an **Inspection Drawer** showing:
     * Extracted PDF fine-print rules & citations.
     * Detected DOM form fields mapped to the student's profile values.
     * A **"Launch Assisted Auto-Fill"** or **"Approve Submission"** human-in-the-loop button.

#### Phase 2 Acceptance Criteria
* User can log in with dummy credentials, edit their profile, upload a PDF/image certificate, preview it after page reload, and inspect scholarship cards.

---

### PHASE 3: Companion Chrome Extension (Manifest V3) — Screen Scraper & Auto-Filler

#### Objective
Build a Chrome Extension that reads scholarship information and form fields from whatever webpage is currently open on the user's screen and syncs it directly with the Web Dashboard.

#### Tasks for Agent
1. **Create Manifest V3 Configuration (`extension/manifest.json`):**
   * Permissions: `activeTab`, `scripting`, `storage`, `sidePanel` (or popup).
   * Host permissions: `<all_urls>` so it works on any state portal, university site, or local test portal.
2. **Content Script — Screen & DOM Extractor (`extension/content.js`):**
   * **Page Context Scraper:** Extracts `document.title`, `window.location.href`, visible deadline/amount keywords, and all `<a href="*.pdf">` links (scheme guidelines/gazettes) on the screen.
   * **Form Schema Detector:** Scans all visible `<input>`, `<select>`, and `<textarea>` elements on the active page. Extracts their `id`, `name`, `placeholder`, associated `<label>` text, and unique CSS selector.
   * **Zero-Shot Field Matcher:** Maps detected page labels (e.g., *"Annual Family Income (Rs.)"*, *"Applicant Full Name"*, *"Domicile State"*) to the student's canonical `StudentProfile` keys.
   * **1-Click DOM Auto-Filler:** When triggered from the extension popup or dashboard, injects the student's verified profile values into the active webpage's form inputs, dispatches native `input` and `change` events (so React/Angular/legacy ASP.NET portals register the values), and highlights filled inputs with a `#0D9488` teal outline.
3. **Extension Popup UI (`extension/popup.html` & `popup.js`):**
   * **"Scan Current Screen" Button:** Scrapes the active tab and displays the number of detected form fields, PDF links, and scholarship text snippets.
   * **"Send to ScholarAgent Dashboard" Button:** Pushes the scraped opportunity and form schema to the Web Dashboard.
   * **"Auto-Fill Current Form" Button:** Pulls the latest `StudentProfile` from shared storage and fills all matched fields on the active tab, pausing before any `type="submit"` button (Human-in-the-Loop checkpoint).
4. **Cross-Context Sync Bridge (`extension/bridge.js`):**
   * When the Web Dashboard is open on `localhost`, the content script listens for `chrome.storage.onChanged` and posts a `SCHOLARAGENT_EXTENSION_SYNC` message via `window.postMessage` so the React Dashboard updates in real time without refreshing.

#### Phase 3 Acceptance Criteria
* Opening any scholarship page or mock government form and clicking **"Scan Current Screen"** in the extension captures the page title, URL, PDF links, and form fields, and immediately populates a new card in the Web Dashboard.
* Clicking **"Auto-Fill Current Form"** populates the webpage's inputs using the student's saved profile from the Web Dashboard.

---

### PHASE 4: TinyFish Web Agent API & LLM Fine-Print Reasoning Engine

#### Objective
Build the FastAPI/Node.js backend and wire the **Live Agent Console (Panel 2)** in the Web Dashboard to stream real-time TinyFish SSE events (`STARTED → STREAMING_URL → PROGRESS → COMPLETE`) and evaluate scheme PDFs.

#### Tasks for Agent
1. **TinyFish SSE Proxy Endpoint (`POST /api/agent/run-sse`):**
   * Integrate the TinyFish Web Agent API (`https://agent.tinyfish.ai/v1/automation/run-sse`) using the `X-API-Key` header.
   * Support passing a `goal` prompt (e.g., *"Scan this scholarship portal, locate the scheme PDF guidelines, and extract the eligibility criteria and application form fields as JSON"*) and optional `browser_profile` context.
   * **Fallback Simulation Mode:** If `TINYFISH_API_KEY` is not set or offline during local testing, stream realistic SSE events (`STARTED` → `STREAMING_URL` → `PROGRESS: State portal scanned` → `PROGRESS: Reading scheme PDF` → `COMPLETE`) so the UI can always be demonstrated end-to-end.
2. **Two-Layer Result Auditor:**
   * Inspect both Layer-1 (`event.status === "COMPLETED"`) and Layer-2 (`event.resultJson.goalAchieved === true && !event.resultJson.captchaBlocked`). If a CAPTCHA or OTP wall is detected, set the opportunity status to `Review Needed` and surface the `streamingUrl` so the student can manually complete the OTP/CAPTCHA.
3. **LLM Fine-Print Evaluator Endpoint (`POST /api/evaluate-eligibility`):**
   * Accept the student's `StudentProfile` JSON and either extracted scheme text or a PDF file.
   * Compare student credentials against scheme fine print (income ceiling, category, academic year, hosteller rules) and return:
     * `eligibilityScore` (`0–100`)
     * `matchedRules` (e.g., `["Income ₹1.8L is below ₹2.5L EWS ceiling"]`)
     * `disqualifierFlags` (e.g., `["Requires Hosteller certificate — Student is Day Scholar"]`)
4. **Panel 2 — Live Agent Console UI:**
   * Render a real-time step log with animated status indicators (`State portal scanned`, `Reading scheme PDF`, `Checking eligibility`, `Pre-filling form`).
   * Include a progress bar and a `LIVE • X portals checked` counter matching Slide 8 of the presentation.

#### Phase 4 Acceptance Criteria
* Triggering a **Discovery / Verification Run** from the Web Dashboard streams live SSE progress steps in the middle panel and updates the opportunity cards in the right panel.

---

### PHASE 5: Built-In Mock State Portal & End-to-End Demo Polish

#### Objective
Include a built-in **"Mock State Scholarship Portal"** route (`/mock-gov-portal`) inside the project so judges can test the Chrome Extension screen-scraping, fine-print disqualifier detection, and 1-click form auto-fill on the spot without relying on slow external government websites.

#### Tasks for Agent
1. **Create `/mock-gov-portal` Page:**
   * Design a realistic legacy state government scholarship page (*"State Merit & EWS Technical Education Grant 2026"*).
   * Include a downloadable/viewable Fine-Print Guidelines section containing specific rules (e.g., *Annual Income < ₹2,50,000*, *Minimum CGPA 7.5*, *Undergraduate B.Tech/B.E. only*).
   * Include a 10-field application form (Full Name, Email, Mobile, Category dropdown, Annual Income, Domicile State, Institution Name, Course, CGPA, and Document Upload status) plus an OTP verification box and a disabled-by-default final Submit button.
2. **End-to-End Demo Verification Flow:**
   * Verify that the user can:
     1. Log in to the Dashboard with dummy credentials.
     2. Update their profile and upload a sample document in the Vault.
     3. Open `/mock-gov-portal`, click the Chrome Extension, and click **"Scan Current Screen"**.
     4. Watch the opportunity appear in the Dashboard with an LLM eligibility score and fine-print breakdown.
     5. Click **"Auto-Fill Current Form"** in the Extension (or trigger TinyFish SSE execution) and watch all 10 form fields populate automatically while stopping safely at the Human-in-the-Loop checkpoint.

---

## 5. Non-Functional Requirements & Guardrails

* **UI/UX Fidelity:** Strictly follow the minimal light editorial aesthetic (`#FAFAFA` / `#FFFFFF` backgrounds, `#0F172A` typography, `#EA580C` orange, `#2563EB` blue, and `#0D9488` teal accents, `Plus Jakarta Sans` + `JetBrains Mono` fonts).
* **Zero Hardcoded Storage Calls in UI:** Every React component must use hooks (`useProfile()`, `useVaultDocuments()`, `useOpportunities()`) backed by `IStorageRepository`.
* **Human-in-the-Loop Safety:** Neither the Chrome Extension nor the TinyFish cloud agent may automatically click a final irreversible `Submit Application` button without explicit user confirmation.
