# ScholarAgent Companion

The browser-execution layer for ScholarAgent. It connects to the signed-in
dashboard, reads a scholarship page you choose, checks the form against your
document vault, and fills only the fields you approve. It stops before the final
submission.

No build step. Plain JavaScript, Manifest V3, and a Chrome side panel.

## Package it for sharing

From the repository root, create the downloadable ZIP:

```bash
cd dashboard
npm run package:extension
```

This writes `dashboard/public/downloads/scholaragent-companion.zip`, with a
single `scholaragent-companion/` folder inside, plus
`scholaragent-companion-store.zip` with `manifest.json` at its root for a Chrome
Web Store upload. The dashboard’s download button serves the first file. See the
root [README](../README.md#publish-the-companion-on-github) for GitHub Release
steps.

## Load it in Chrome

1. Start the local dashboard:

   ```bash
   cd dashboard
   npm run dev
   ```

2. Open `chrome://extensions`, turn on **Developer mode**, choose **Load
   unpacked**, and select this `extension/` folder.

3. Pin **ScholarAgent Companion** to the toolbar. Clicking it opens the side
   panel.

4. Open the dashboard (`http://localhost:5173` or `http://127.0.0.1:5173`) and
   sign in. Open any scholarship application form in another tab.

5. Open the companion. On first launch it asks to connect. It finds the signed-in
   dashboard through its local session, so there is no second login.

The companion requires Chrome 116 or newer because it uses the Side Panel API.

## What each section does

- **Eligibility** reads the visible page, extracts form fields and document
  requests, and compares them with the cached profile and verified-document
  metadata from the dashboard. Its checks are deterministic local heuristics.
- **Auto-fill** maps known profile fields to the current form, shows you the list
  before changing anything, then fills the approved fields. It never fills
  passwords, hidden fields, file inputs, radio/checkbox controls, or submits.
- **Profile** is a read-only view of the synced file and vault readiness. Editing
  happens in the dashboard.
- **Settings** contains the connection, motion, window, API keys, custom prompt,
  and disconnect controls.

The header has a pop-out button beside the sync and settings controls. It opens
the same companion in a standalone browser window (`sidepanel.html?popup=1`).
The same option lives in **Settings → Window**. Inside the pop-up, the pop-out
control is hidden so there is no duplicate window.

## Data and API keys

The extension caches these values in `chrome.storage.local`:

- `scholaragent_connection` — dashboard origin, student id, and connection times.
- `scholaragent_workspace` — a copy of the profile and verified-document
  metadata. Document files themselves stay in the dashboard.
- `scholaragent_settings` — OpenAI, Gemini, and TinyFish keys, the custom prompt,
  and the reduced-motion preference.

Disconnecting removes the connection and cached workspace. API keys, the custom
prompt, and the motion preference stay until you replace or clear them.

**Reduced motion** is off by default so you can see the agent work: fields are
scrolled into view, outlined, and typed in sequence. Turn it on in **Settings →
Motion** for an instant fill with no page animation. The companion also respects
the operating system's `prefers-reduced-motion` setting. Either way, local
checks still guard the fill and the final Submit button is never clicked.

OpenAI and Gemini are optional. When a key is present, the **Deep-read** button
can send the visible page text and a small set of profile facts to that provider.
The local check still decides whether auto-fill is allowed; the AI read is a
supplementary second opinion. TinyFish is stored for the assisted browser-run
phase and is not called by this extension yet.

The extension never sends data to a portal, never uploads documents, never clicks
Submit, and never handles OTPs or CAPTCHAs. The final click always belongs to the
student.

## Permissions

| Permission | Why |
| --- | --- |
| `sidePanel` | Keeps the companion beside the form instead of in a popup. |
| `activeTab` | Reads and fills only the tab you deliberately act on. |
| `scripting` | Injects the page reader into tabs opened before the extension loaded. |
| `tabs` | Finds the signed-in local dashboard and the current form tab. |
| `storage` | Caches the connection, synced workspace, and settings locally. |
| `<all_urls>` | Allows the form reader on scholarship portals, plus the local dashboard and AI API calls. |

## Files

- `manifest.json` — MV3 entry points and permissions.
- `background.js` — service worker, dashboard discovery/sync, settings, AI calls,
  and tab messaging.
- `content.js` — page scanner, guarded field filler, and dashboard bridge.
- `common.js` — shared field matching, document mapping, eligibility heuristics,
  and fill-plan construction.
- `sidepanel.html` / `sidepanel.css` / `sidepanel.js` — the compact interface.
- `assets/fonts/` — bundled Fraunces, Manrope, and IBM Plex Mono.
- `icons/` — toolbar and side-panel icons.

## Manual checks

Use an application form that contains your name, contact details, category,
income, domicile, institution, course, CGPA, and document upload fields.

1. Connect from the first-launch screen.
2. Run **Eligibility** and confirm the field count and paper checks.
3. Open **Auto-fill**, review the mapped fields, and fill them.
4. Confirm the page is still unsent and the final Submit button is highlighted
   only after you choose **Show me the final button**.
5. Test a page that asks for a missing paper and confirm auto-fill is blocked
   with links to the document vault and profile.
6. Save keys/prompt in Settings, disconnect, and reconnect.
7. Fill once with **Reduced motion** off (animated sequence), then turn it on and
   fill again (instant).
8. Open the companion in a pop-up window, scan the source tab from there, and
   close it without losing the side-panel connection.
