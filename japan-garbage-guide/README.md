# Japan Garbage Guide

Mobile-first multilingual garbage-sorting website, installable PWA and Capacitor Android wrapper.

## Implemented

- Option 7 AI-inspired purple/blue visual theme, accessible glass navigation and More menu.
- Six interface languages: English, Bangla, Japanese, Hindi, Vietnamese, Nepali.
- Local advisory item lookup (keyword-based; **not** a connected AI model), including batteries, PET bottles, paper, metals, appliances and more.
- A real month view using Japan local time. **Collection days are not highlighted without verified address-specific municipal data.**
- Kobe, Osaka and Kyoto official source lookup shortcuts.
- Locally saved area and notification preferences.
- Basic notification permission/test (not an automated background reminder).
- Offline PWA static assets. The build script now bundles `smart-guide.js` for Android/PWA too.

## Build and verify

```bash
npm install
npm run build
```

Output goes to `www/`. For Android, use Capacitor on an Android-capable environment:

```bash
npx cap sync android
```

## Still required for production completeness

1. Address-specific collection calendar ingestion from authorized official municipal datasets, including collection exceptions and source/last-reviewed metadata.
2. A scheduled server-side push delivery pipeline (verified calendar + subscription storage + push notifications); requesting browser notification permission by itself does not schedule reminders.
3. Model-backed AI assistance, if desired. Do not present keyword guidance as verified municipal law.
4. Full device QA, Android APK build/install and production deployment verification.

## UI attribution

Original HTML/CSS/JavaScript inspired by general interaction patterns from Skiper UI, shadcn/ui, HyperUI, daisyUI and Animate UI. No paid theme source files copied.

## Safety

Never infer or invent garbage collection dates. Official municipal schedules for the exact location always take precedence over generated advice.
