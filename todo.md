# Logo + "AI Search Radar" Header Update

## Context
- Current app uses inconsistent logos across pages:
  - Home page: `logo-tagline-white.png` (has "A BUSINESS GROWTH COMPANY" tagline)
  - Assess page: `logo-orange.png` / `logo-dark.png`
  - Results page: `logo-white.svg` / `logo-dark.png`
- Goal: use the **Abstrakt primary horizontal logo** (wing + wordmark, no tagline) consistently across all page headers, with **"AI Search Radar"** in Barlow Condensed to the right of the logo.
- SectionHeader (inside results tabs) currently says "AI Search Radar" — change to **"AI Search Assessment Results"**.

## File note
- Uploaded `White_Logo.png` / `Gray_Logo.png` are RGB (not transparent).
- The repo already has transparent RGBA versions of the same logos at `/public/brand/logo-white.png` (same 2193×699 dimensions as upload) and `/public/brand/logo-gray.png`.
- Decision: re-point the code at the existing transparent files. No new files needed.

## Todo items
- [x] 1. Update `app/page.js` (homepage header) — swap `/brand/logo-tagline-white.png` for `/brand/logo-white.png` (dark) + `/brand/logo-gray.png` (light) using existing `dark-logo` / `light-logo` classes; add "AI Search Radar" in Barlow Condensed next to logo
- [x] 2. Update `app/assess/page.js` (assess header) — swap orange/dark logos for white/gray; remove the existing "AI Visibility Assessment" label on the right; add "AI Search Radar" next to the logo
- [x] 3. Update `app/results/ResultsClient.jsx` (results header) — swap `logo-white.svg` + `logo-dark.png` for `logo-white.png` + `logo-gray.png`; add "AI Search Radar" next to the logo
- [x] 4. Update `components/SectionHeader.jsx` — change text from "AI Search Radar" to "AI Search Assessment Results"
- [x] 5. Run `npm run build` to verify zero errors
- [x] 6. Output final files for push

## Notes
- Uploaded RGB files will not be used. Existing `/brand/` files already have correct transparency.
- `font-heading` class maps to Barlow Condensed in `tailwind.config.js`.
- Changes are scoped to the header JSX on 3 pages + one text-string change in SectionHeader.

## Review
**Summary of changes:**
- Four files edited — every change was minimal and scoped to header/label JSX only. No new files added, no component architecture touched.
- **Consistent header across home, assess, and results pages:** Abstrakt horizontal logo (wing + wordmark, no tagline) swapping between `/brand/logo-white.png` (dark mode) and `/brand/logo-gray.png` (light mode) via existing `dark-logo` / `light-logo` CSS classes, followed by a `·` separator and "AI Search Radar" in Barlow Condensed uppercase tracking-widest.
- **Assess page:** the right-side "AI Visibility Assessment" label was dropped in favor of the consistent "AI Search Radar" pattern next to the logo.
- **SectionHeader (inside results tabs):** text changed from "AI Search Radar" to "AI Search Assessment Results" — the rest of its layout (logomark + wordmark + separator) was left untouched.
- **Uploaded RGB files not used:** The White_Logo.png and Gray_Logo.png uploads had opaque black backgrounds (RGB mode). The repo already had transparent RGBA versions of the exact same logos at `/public/brand/logo-white.png` (same 2193×699 dimensions) and `/public/brand/logo-gray.png`, so we re-pointed the code at those instead of re-uploading.

**Build:** `npm run build` passes clean — compiled successfully, all 13 static pages generated, no errors or warnings related to changes.

**Deployment:** Pushed to `main` on GitHub. Vercel will auto-deploy.

