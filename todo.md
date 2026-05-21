# Light Mode White Text Fix

## Problem
In light mode, some text remained white and became invisible against light backgrounds.

## Root Cause
A 5-line override block at the bottom of `app/globals.css` forced `.text-white` to stay white (`!important`) inside `.bg-brand-page-dark` and `.bg-brand-page-base`. Those backgrounds, however, are themselves switched to white/light gray in light mode (lines 84–86), so the override produced white text on white backgrounds. The correct global rule (`html.light .text-white { color: #111827; }`) already existed on line 71 — it was just being overridden.

## Changes Made
- [x] Removed the broken "Review slider stays dark" override block from `app/globals.css`.
- [x] Confirmed `.text-gray-400` override inside that block was redundant with line 115 — no replacement needed.
- [x] `npm run build` — clean, no errors.
- [x] Committed and pushed to `main`.

## Review
**Files touched:** 1 (`app/globals.css`)
**Lines removed:** 6
**Lines added:** 0

The fix relies on the global `html.light .text-white { color: #111827; }` rule that was already in place. With the overriding block gone, all `.text-white` elements correctly switch to dark gray (#111827) in light mode, regardless of their parent background.

**Risk:** Low. No component files changed, no new logic introduced. The removed block's stated purpose ("review slider stays dark") was already non-functional — the review slider uses `bg-brand-page-base`, which becomes light in light mode anyway, so this block wasn't actually preserving any dark-section contrast.
