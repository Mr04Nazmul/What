# Japan Life unified mobile web app

Two existing functional tools are integrated in a mobile PWA shell, **without deleting or moving** the original site files:

- Student Baito at `../student-baito/`: work shifts, hourly rates, 22:00–05:00 night rate, breaks, private localStorage, weekly reminder, CSV and Japanese manager messages.
- Letter AI at `../letter-ai/`: free Tesseract.js Japanese OCR, editable text, rule-based detection of dates/yen/action keywords, localStorage, calendar exports.

The app shell at `../life-app/` embeds each same-origin tool for single-app navigation; the user can open its full-screen view. Both tools preserve their **existing browser localStorage keys**, not migrated or copied. A service worker caches only the shell, not OCR's CDN model or the embedded tools; internet may be required. On iOS Safari use Share → Add to Home Screen.

**AI honesty:** Local Tesseract OCR is machine-learning based. No remote OpenAI text generation is deployed. Never expose an OpenAI API secret in static HTML. To add optional OpenAI later, configure a rate-limited authenticated Supabase Edge Function with securely stored API key and billing; do not ship secret keys in GitHub Pages.

**Database:** a new `japan_life` schema was set up in an existing Supabase project with private owner-scoped tables for accounts, work shifts and extracted text. RLS is enabled; the current GitHub Pages app remains local-only until a proper sign-in/cloud-sync UI is added and security-tested. Old NAZORIX and Japan Halal Checker data was not modified.

**Source/license:** Tesseract.js JavaScript/wasm via jsDelivr already loaded by the letter app; third-party library resources require network. No proprietary replica assets were copied.
