# Astryx + Matcha comparison

One isolated partner dashboard: `/affiliate/dashboard?variant=astryx`.
Baseline remains `/affiliate/dashboard`. No site-wide migration decided.

Uses React 19, Astryx 0.7.16 and Matcha 0.7.16: real Card, Button, Badge, TextInput, Selector and Table components. Custom responsive layout; compiled theme CSS. Uses existing `createStore` and `commissionStatus`, including eligible/pending rules. No duplicate commission model.

Build: `npm ci --prefix prototype/astryx` then root `npm run build`.
QA: `.scratch/che-thinh-an/qa/astryx.js` via Playwright, served by `serve-astryx.py` on 4191. Root state tests remain required.

Sample data only; reads the same browser-local saved snapshot as the main demo. No login, payouts or backend integration. Comparison link performs full navigation to keep both styles isolated. Public Vercel query rewrite must precede the affiliate fallback. No customer contact details rendered.

Assess readability, mobile tasks and brand fit before expanding. Current compiled JS ~944 KB and CSS ~304 KB uncompressed; browser caching/compression helps but a broader migration needs bundle review. Safari/Firefox and real partner accounts not checked. Fonts use the package's Google Fonts stylesheet with local fallbacks.

## Site rollout — 2026-11-14
Approved Matcha visual system now covers the main application through `site.css`, importing the actual theme package tokens. Native semantic controls and existing state/event handling remain in place; this is not a full React component rewrite. The isolated React dashboard is still available at its comparison URL. Main site adds ~32 KB uncompressed CSS, no new runtime JS. User-facing form semantics and state continuity are retained.
