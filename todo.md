# Fix: Light Mode Not Applying to Home Page

## Root Cause
Tailwind escapes `#` as `\#` in generated CSS. Our globals.css overrides use
`.bg-\[#1a1a1a\]` (unescaped #) so they never match. The results page works
because it uses named Tailwind colors (no special chars). Fix: add named
color aliases to tailwind.config.js and use them in page.js.

## Todo
- [ ] tailwind.config.js — add page-dark/page-mid/page-card/page-panel to brand colors
- [ ] app/page.js — replace raw hex bg classes with the new named classes
- [ ] app/globals.css — replace broken escaped selectors with clean named-class overrides
- [ ] Build + push

## Review
