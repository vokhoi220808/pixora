# Changelog — Pixora Studio

All notable changes to Pixora are documented here.

---

## [5.1.0] — 2026-07-03 — Public Beta

### 🆕 New Features
- **Autosave compression:** Pixel arrays are now run-length encoded before saving to `localStorage` — ~90% smaller storage footprint
- **Autosave debounce:** Now waits 1.5 seconds after the last change before saving (was: on every single state change)
- **Smart RestoreModal:** Shows canvas size, frame count, and "X minutes ago" timestamp when a session is recovered
- **Page Visibility API:** Animation playback pauses automatically when you switch browser tabs
- **Rich status bar:** Header now displays canvas size, frame count, zoom level, and live X/Y pixel coordinates while hovering the canvas
- **Per-tool cursor:** Canvas cursor changes based on the active tool (crosshair for brushes, cell for fill, copy for picker, grab for move, etc.)
- **`migrateProject()`:** Safe migration function that loads any older version project JSON and upgrades it to the current schema
- **Improved `loadJSON`:** Now runs migration on all loaded files; shows a rich status message with canvas info

### 🔧 Improvements
- **Branding unified:** `createProject()` now sets `app: "Pixora"` and `version: "5.1"` — previously was "PixelForge Studio Ultra" v3.0
- **Schema `savedAt` field:** Projects saved by autosave include an ISO timestamp
- **Tags normalized:** `migrateProject()` ensures `tags` is always `[]` instead of `undefined`
- **Removed duplicate code:** Local `hueOf`, `luminance`, `hslToHex`, `hexToHSL` functions removed from `PixelStudio.tsx` — now using shared implementations from `pixel.ts`
- **Command Palette label:** Button now shows `Ctrl + K / ⌘K` to indicate Mac support
- **Color Picker hotkey clarified:** Consistently `I` everywhere (like Eyedropper in industry tools)
- **RestoreModal UI overhaul:** Dark amber styling, project info card, "Restore" button in gold, "Discard" in neutral

### 🐛 Bug Fixes
- Fixed `ImagePlus` icon not imported → caused `ReferenceError` on SSR render
- Fixed duplicate `</TooltipProvider>` tag that caused JSX parse failure after previous edit
- Fixed canvas cursor style being lost during some tool switches

### 📁 New Files
- `README.md` — developer setup, tech stack, architecture overview
- `docs/USER_GUIDE.md` — full user-facing feature documentation
- `TESTING.md` — QA checklist with 50+ test cases across all feature areas
- `CHANGELOG.md` — this file

---

## [5.0.0] — 2026-07-02

### 🆕 New Features
- **Autosave & Recovery:** Auto-saves to localStorage; prompt on page reload
- **Frame Thumbnails:** Real canvas previews in the timeline (auto-updates while drawing)
- **Import Image as Layer:** Upload PNG/JPG, auto-resize with Nearest Neighbor, add as new layer
- **Transparent Background:** Checkerboard background to visualize transparent pixels
- **Command Palette (`Ctrl+K`):** Search and run any feature from keyboard
- **Animation Tags:** Named frame ranges that scope playback and exports
- **Custom Modals:** All browser `prompt()` and `confirm()` dialogs replaced with styled in-app modals

---

## [4.0.0] — Prior

- Initial Studio build with core drawing tools, layers, animation timeline, and export
