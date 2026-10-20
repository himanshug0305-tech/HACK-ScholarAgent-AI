# ScholarAgent Companion — GitHub & Chrome Installation Guide

## What is included in the site

The site now has a working extension download flow.

- Landing page: **Download companion** button in the hero.
- Connect page: **Download extension** as the primary action.
- Both serve `dashboard/public/downloads/scholaragent-companion.zip`.
- `npm run package:extension` rebuilds the ZIP after extension changes.
- A Chrome Web Store-ready ZIP is also generated as `scholaragent-companion-store.zip`.
- The download responds with `200` and `application/zip`; the dashboard build passes.

---

## 1. Push the repository to GitHub

From the repository root:

```bash
git add .
git commit -m "Add ScholarAgent dashboard and Chrome companion"
git branch -M main
git remote add origin https://github.com/OWNER/REPO.git
git push -u origin main
```

`node_modules`, `dist`, and `.env` are ignored. The extension source and the generated ZIPs under `dashboard/public/downloads/` will be committed.

Before committing again after extension changes:

```bash
cd dashboard
npm run package:extension
cd ..
```

---

## 2. Create a GitHub Release

A normal Git repository does not give users a one-click Chrome install. Use a GitHub Release to provide a clean downloadable ZIP.

1. Open the repository on GitHub.
2. Go to **Releases → Draft a new release**.
3. Create a tag such as `v0.1.0`.
4. Attach:
   - `dashboard/public/downloads/scholaragent-companion.zip` — for users to unzip and load
   - `dashboard/public/downloads/scholaragent-companion-store.zip` — for a future Chrome Web Store upload
5. Publish the release.

The stable download URL will be:

```text
https://github.com/OWNER/REPO/releases/latest/download/scholaragent-companion.zip
```

The site works with its bundled ZIP by default. To point the button at GitHub instead, add this to `dashboard/.env` and rebuild:

```bash
VITE_EXTENSION_DOWNLOAD_URL=https://github.com/OWNER/REPO/releases/latest/download/scholaragent-companion.zip
```

```bash
cd dashboard
npm run build
```

Alternatively, using the GitHub CLI:

```bash
gh release create v0.1.0 \
  dashboard/public/downloads/scholaragent-companion.zip \
  dashboard/public/downloads/scholaragent-companion-store.zip \
  --title "ScholarAgent Companion v0.1.0" \
  --notes "Download, unzip, and load the folder from chrome://extensions."
```

---

## 3. How users install the downloaded extension

1. Download `scholaragent-companion.zip`.
2. Unzip it.
3. Open `chrome://extensions`.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted `scholaragent-companion` folder.
7. Pin **ScholarAgent Companion** to the toolbar.

### Important distribution note

This GitHub/ZIP route requires Developer mode. For a normal one-click install for non-technical users, publish `scholaragent-companion-store.zip` through the **Chrome Web Store** and then point the website button at the store listing.

The Chrome Web Store requires:

- A developer account
- Permission justifications
- Privacy details
- Screenshots
- Review

If the dashboard is deployed under a GitHub Pages subpath such as `https://user.github.io/repo/`, either set Vite's `base` accordingly or use the absolute GitHub Release URL in `VITE_EXTENSION_DOWNLOAD_URL`.
