## 🚀 Live Demo
Check out the live application here: [hack-scholar-agent-ai-blush.vercel.app](https://vercel.app)


# ScholarAgent AI

**Autonomous AI Web Agent Engine for Equalizing Scholarship Access**  
<!-- *Built by Team Cyber Nova for Kritical Hacks 2026 (AI & ML Open Innovation Track — Powered by TinyFish Web Agent API)* -->

```
STUDENT PROFILE  →  LIVE DISCOVERY  →  ELIGIBILITY CHECK  →  AGENTIC APPLICATION
```

<!-- 📌 PLACEHOLDER: Insert Slide 1 (Hero / Title Slide Screenshot) -->
<img width="1264" height="752" alt="image" src="https://github.com/user-attachments/assets/36b35ce2-09e1-496f-be2c-0b342867400c" />


---

## 01. The Problem: Why Grants Go Unclaimed

Students frequently discover scholarship listings but get blocked by broken, multi-portal application journeys. **Existing platforms merely list opportunities. ScholarAgent autonomously executes the applications.**

- **Zero Public APIs:** State directorates, university portals, and private trusts lack APIs, blocking traditional automation.
- **Redirection Fatigue:** Aggregators bounce students across isolated portals requiring repetitive account creation and multi-step form typing.
- **Eligibility Fine Print:** Critical disqualifiers (sibling benefit caps, hosteller-only clauses, income cutoffs) are buried inside 30–40 page scanned scheme PDFs.

---

## 02. Target Users & Core Use Cases

| Target Segment | Core Workflow & Value |
| :--- | :--- |
| **First-Gen Undergraduates & Postgraduates** | Single profile upload matches income, domicile, and category rules against 100+ regional schemes. |
| **College Financial Aid & Welfare Cells** | Batch-verify student cohorts against freshly published AICTE, UGC, and state directorate gazettes. |
| **Grassroots NGOs & Facilitation Centers** | Eliminate cyber-cafe middlemen fees with guided, human-verified form pre-filling. |

---

## 03. Proposed Solution: End-to-End Execution

ScholarAgent replaces manual portal hopping with a four-stage autonomous pipeline backed by a strict **Human-in-the-Loop Checkpoint**:

1. **Unified Profile Vault:** Students enter academic, demographic, and verified document credentials once.
2. **Live Discovery:** Parallel TinyFish cloud agents crawl state notices, gazettes, and private trust portals.
3. **Fine-Print Reasoning:** Our LLM evaluator audits multi-page scheme PDFs against the student's profile to flag disqualifiers early.
4. **Form Auto-Fill & Human Checkpoint:** Cloud agents populate multi-step forms and pause so the student can verify documents, enter OTPs, and approve the final submission.

<!-- 📌 PLACEHOLDER: Insert Slide 4 (Proposed Solution 4-Step Pipeline Screenshot) -->
<img width="1264" height="752" alt="image" src="https://github.com/user-attachments/assets/68f3c1f1-163a-4f56-ab10-8e0ca0caa5e8" />


---

## 04. Role of Machine Learning & AI

### Stage A: Unstructured Scheme Parsing (LLM Eligibility Evaluator)
- **Clause Extraction:** Converts scanned Hindi/English government gazette PDFs into structured JSON rules.
- **Exclusion Detection:** Identifies subtle edge-case disqualifiers before the student wastes time applying.
- **Confidence Scoring:** Produces explainable match scores (`0–100%`) with exact page and paragraph citations.

### Stage B: Autonomous Field Alignment (Zero-Shot DOM Schema Mapper)
- **Resilient Selectors:** Maps non-standard portal input labels to canonical PostgreSQL profile attributes.
- **Document Pre-Validation:** Verifies income and caste certificate validity dates via OCR prior to portal upload.
- **Self-Healing Navigation:** Dynamically adapts when legacy state portals alter dropdowns or form structures.

<!-- 📌 PLACEHOLDER: Insert Slide 5 (Role of ML & AI Screenshot) -->
<img width="646" height="360" alt="image" src="https://github.com/user-attachments/assets/3722b93a-093f-4a8c-82f5-d84a0ae4222d" />


---

## 05. Technical Architecture & System Stack

```
[1. User Input & React Web Dashboard]
                 │
                 ▼
[2. FastAPI / Node.js Orchestration Backend]
                 │
                 ▼
[3. LLM Fine-Print PDF Evaluator]
                 │
                 ▼
[4. TinyFish API Execution Layer]
    (Agent API • Browser Context Profiles • SSE Stream Manager)
                 │
                 ▼
[5. External State, University & Trust Portals]
```

### Production Stack
- **Frontend UI:** React.js + Tailwind CSS (Live SSE agent console & opportunity tracker)
- **Backend Core:** Python FastAPI / Node.js asynchronous SSE event dispatcher
- **Web Automation:** TinyFish Web Agent API cloud browser fleet
- **Intelligence Layer:** Structured LLM PDF parser, OCR verifier, and eligibility rule engine
- **Data & Security Vault:** PostgreSQL encrypted student profile store with ephemeral session tokens

<!-- 📌 PLACEHOLDER: Insert Slide 6 (Technical Architecture & Stack Screenshot) -->
![Technical Architecture](./assets/slide-06-architecture.png)

---

## 06. TinyFish Web Agent API Integration

ScholarAgent leverages TinyFish primitives to run resilient, observable browser workflows without local Chromium overhead:

| TinyFish Primitive | Technical Implementation | User & System Value |
| :--- | :--- | :--- |
| **`/v1/automation/run-sse`** | Streams `STARTED → STREAMING_URL → PROGRESS → COMPLETE` events | Live browser preview URL inside the student dashboard |
| **Browser Context Profiles** | Persists authenticated cookies and portal session state | Eliminates redundant logins while respecting portal OTP rules |
| **`AsyncTinyFish` Fleet** | Concurrent cloud browser runs across state & trust URLs | High-throughput discovery across dozens of portals in parallel |
| **Two-Layer Result Audit** | Verifies run status **AND** inner result payload schema | Catches CAPTCHA blocks or missing portal fields |

> **Production Guardrail — Avoiding the "COMPLETED Trap":**  
> A cloud run can return an HTTP/SSE `COMPLETED` status even if a portal throws a soft CAPTCHA wall. ScholarAgent inspects both **Layer-1 infrastructure status** and **Layer-2 goal completion schema** before marking any application ready for student review.

<!-- 📌 PLACEHOLDER: Insert Slide 7 (TinyFish Integration Table Screenshot) -->
![TinyFish API Integration](./assets/slide-07-tinyfish.png)

---

## Repository Layout

```
scholaragent-ai/
├── dashboard/          # React + Vite + Tailwind CSS web application (built)
├── backend/            # FastAPI orchestrator: TinyFish SSE proxy + evaluator (built)
└── extension/          # Chrome Extension (Manifest V3) browser execution layer (built)
```

---

## Quick Start (Local Development)

```bash
# 1. Web dashboard — no keys required, seeded with a demo applicant file
cd dashboard
cp .env.example .env          # VITE_STORAGE_DRIVER=local (by default)
npm install
npm run dev                   # http://localhost:5173
```

```bash
# 2. Chrome companion — no build step
# Open chrome://extensions, enable Developer mode, click "Load unpacked",
# and select the extension/ folder. Pin ScholarAgent to the toolbar.
```

```bash
# 3. Orchestrator — optional; the console falls back to a local simulator
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env          # leave TINYFISH_API_KEY blank to use simulation mode
.venv/bin/uvicorn main:app --reload --port 8000
```

From the repository root you can also use:

```bash
npm run install:web   # install dashboard dependencies
npm run dev:web       # start the dashboard

npm run install:api   # create backend/.venv and install requirements
npm run dev:api       # start the orchestrator
```

### Demo credentials

Any non-empty username/password opens the demo file. The quick-fill button signs
in as `ananya.deshmukh` / `scholar2026`.

### Chrome companion

The `extension/` folder is a ready-to-load Manifest V3 side panel — no build
step. After loading it unpacked, clicking the toolbar icon opens a compact
companion that:

- Connects to the signed-in dashboard through its existing local session, with
  no second login.
- Scans the current scholarship form, checks it against the synced profile and
  document vault, and shows a local first look.
- Offers an explicit Auto-fill review, then stops before the final Submit
  button. File uploads, OTPs, CAPTCHAs, and the last click remain human.
- Sends users to the dashboard when a required paper or profile detail is
  missing.
- Opens in the side panel by default, with a one-click pop-up window option in
  the header and in Settings.
- Fills with a visible field-by-field sequence by default. The Settings
  **Reduced motion** switch makes fills instant for users who prefer less motion.
- Stores optional OpenAI, Gemini, and TinyFish keys plus a custom prompt in
  extension-local storage. Only OpenAI/Gemini deep reads call a model, and only
  when the user asks. TinyFish is reserved for the assisted browser-run phase.

See [`extension/README.md`](./extension/README.md) for load, permission, and
manual-test details.

### Download the companion from the site

The landing page and **Connect extension** page both have a download button. It
serves the packaged companion from:

```text
dashboard/public/downloads/scholaragent-companion.zip
```

Rebuild that ZIP whenever the extension changes, then rebuild the site:

```bash
cd dashboard
npm run package:extension
npm run build
```

The package command also creates
`dashboard/public/downloads/scholaragent-companion-store.zip`, which has
`manifest.json` at the ZIP root for a Chrome Web Store upload.

Anyone who downloads the ZIP can install it without a build step:

1. Unzip `scholaragent-companion.zip`.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode**.
4. Choose **Load unpacked** and select the extracted `scholaragent-companion`
   folder.
5. Pin the companion and open it from the toolbar.

This GitHub/ZIP route uses Chrome’s developer mode. For a normal one-click
install for non-technical users, publish the store ZIP through the Chrome Web
Store (developer account, listing, privacy details, and review), then point the
site button at the store listing.
