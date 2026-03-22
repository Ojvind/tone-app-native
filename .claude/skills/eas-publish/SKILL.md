---
name: eas-publish
description: Builds and submits the app to App Store via EAS. Use when asked to publish, release, or submit the app to App Store.
---

# EAS Publish Skill

## Förutsättningar
- `eas-cli` installerat: `npm install -g eas-cli`
- Inloggad på Expo: `eas login`
- Apple Developer-konto kopplat i App Store Connect

## Steg för att publicera

### 1. Bumpa versionen
Uppdatera `version` i `app.json` (t.ex. `1.0.1` → `1.0.2`).

### 2. Committa alla ändringar
```bash
git add -A
git commit -m "Release X.X.X"
git push
```

### 3. Bygg
```bash
eas build --platform ios --profile production
```
Tar 10-20 minuter. Vänta tills status är `finished`.

### 4. Skicka in till App Store
```bash
eas submit --platform ios
```
Välj "Select a build from EAS" och det senaste bygget.

### 5. Krypteringsfrågan
Välj **"None of the algorithms mentioned above"** – appen använder ingen kryptering.

### 6. App Store Connect
- Gå till appstoreconnect.apple.com
- Välj rätt bygge under din version
- Klicka **Submit for Review**

## Vanliga fel

| Fel | Lösning |
|-----|---------|
| Node version incompatible | Lägg till `"node": "20.x"` i `package.json` under `engines` |
| Build concurrency limit | Avbryt gamla byggen med `eas build:cancel <id>` |
| Missing Compliance | Svara "None" på krypteringsfrågan |
| Placeholder icon | Kör `npx expo prebuild --clean` och bygg om |
