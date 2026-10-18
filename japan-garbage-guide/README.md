# Japan Garbage Guide

Mobile-first multilingual website/PWA prototype.

## UI sources and attribution
- Visual inspiration: Skiper UI, shadcn/ui, HyperUI, daisyUI, and Animate UI.
- The UI is implemented in lightweight custom HTML/CSS so it works as a static website and inside the Capacitor Android wrapper; no paid components or external framework dependencies are copied.
- Includes responsive panels, polished card states, keyboard focus styles, reduced-motion support, and mobile safe-area-aware navigation.
- Uses a custom implementation of bottom navigation and a 3-dot More menu.

## Important status
This is a frontend prototype. Official municipal calendar ingestion, persistent accounts, scheduled push notifications, and Android packaging are not yet configured. Never treat a date as verified without official municipal source evidence.

## Run
Open `index.html` in a browser or publish this folder as a static site. Browser notifications require HTTPS and permission; background push reminders need a push service and scheduled backend.
