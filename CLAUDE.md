# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm test           # Run all tests

# Run a specific test file
npm test -- useGame.test.js
npm test -- GameOver.test.jsx

# Run a specific test by name
npm test -- -t "test name here"
```

There is no lint script configured.

## What This App Does

"Gissa noter" is a Swedish music note-reading practice game. The player is shown sheet music with 8 random notes (4 treble clef, 4 bass clef), types in their guesses, and gets scored over multiple rounds.

## Architecture

All game state lives in the `useGame` hook ([src/hooks/useGame.js](src/hooks/useGame.js)). `App.js` renders one of three screens based on hook state: `Settings` → game screen → `GameOver`. Components receive state and actions as props — there is no context or external state library.

**Key data flow:**
1. `useGame` generates notes from `constants.js` (treble: C4–C5, bass: F2–C4), each with a `.key`, `.clef`, and `.alternatives` array
2. `NoteDisplay` receives the notes array, communicates with an embedded WebView via `postMessage` to render VexFlow notation and play audio through the Web Audio API
3. `GuessInput` collects 8 text inputs and compares them against `note.name` + `note.alternatives` (case-insensitive, Swedish note names supported — e.g. H for B, CISS for C#)
4. `GameOver` maps the percentage score to one of 10 feedback tiers with Swedish humor messages and images

**Why WebView for notation:** VexFlow requires DOM access and the Web Audio API, so the entire music rendering and audio playback runs inside an embedded browser context in `NoteDisplay.jsx`. The parent communicates with it via `postMessage` / `onMessage`.

## Publishing

Use the `/eas-publish` skill to build and submit to the App Store via EAS.

- iOS bundle ID: `se.otterbjork.ojvind.gissanoter`
- EAS project ID is in `app.json`
