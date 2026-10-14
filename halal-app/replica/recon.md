# Clean-room recon: Japan food information app
Reference: https://play.google.com/store/apps/details?id=com.conceptuale.productivity.halaljapan
Research basis: public store listing plus user-submitted image showing listing identity. Not a capture of the app's actual screens. Screen visuals are original design.

## Scope
User-facing Android-oriented food product lookup, barcode scan, ingredient display; Japanese product coverage. Current implementation is a responsive web prototype to be wrapped into Android only after live testing.

## Screen inventory
S01 Home — quick scan/manual search, loading/empty/error
S02 Scan — camera permission, scanning, unsupported browser, stopped
S03 Product results — title, brand, code, ingredients, source and unknown/needs verification
S04 About — provenance and limitations

## Flows
F01 Type JAN on S01 -> fetch public record -> S03.
F02 Scan on S02 -> recognize JAN -> public lookup -> S03.
F03 Search name -> list public records -> inspect source.

## Data model
Product: code, product_name, brand, ingredients, language, source URL, provenance, confidence.
A public OFF result is not proof of availability in Japanese stores, nor proof of Halal certification.
Reference app's own private records, logo, proprietary UI assets and backend are out of scope.

## Known uncertainty and next steps
App's actual screens, navigation and feature names not independently observed. No public bulk database license was established for reference app.
Verify real camera on Android, API CORS/availability, EAN deduplication, offline states, accessibility and performance before release.
