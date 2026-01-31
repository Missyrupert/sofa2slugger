# AI Code Assistant Instructions (concise)

Purpose: get an AI coding agent productive in this repository quickly, with project-specific constraints and examples.

## Immutable-audio policy (APPLY PERMANENTLY)
- This repo is a static site that ships pre-rendered audio. Audio in `public/audio/` is an immutable deployment artifact.
- Never run, suggest, or automate scripts that rewrite files in `public/audio/`. All audio fixes are produced offline and replaced by humans.

## Big picture
- The site artifact is `public/` (deployed via `netlify.toml`); treat it as the output directory.
- Authoring and canonical content live in `01_product/` (scripts, copy, final audio sources).
- Audio tooling and dev scripts live in `02_dev/assets/` (TTS generation, assembly, processing). These are tooling — not deployed assets.

## Critical workflows (concrete commands)
- Create narrator scripts: `node 02_dev/assets/create_narrator_scripts.js` (writes `01_product/audio/narrator/scripts/N-s{NN}-*.txt`).
- Generate TTS (developer-only; be careful):
  - `export ELEVENLABS_API_KEY=...`
  - `node 02_dev/assets/generate-narrator-elevenlabs.mjs` -> writes `01_product/audio/narrator/generated/`.
- Assemble final sessions (requires `ffmpeg` + `ffprobe`): `node 02_dev/assets/assemble_sessions.js` -> `01_product/audio/final/`.
- Process audio (mix/music/loudness): `node 02_dev/assets/process-audio.js` (uses `ffmpeg`).

## Project-specific conventions & runtime integration
- Final player expects single final session tracks: `/audio/session-XX-final.mp3` (served from `public/audio/`). See player logic in `public/assets/js/player.js`.
- Player behavior highlights:
  - Auto-loads session 1 on page load.
  - Uses localStorage keys: `s2s_premium_access`, `s2s_full_access`, and `s2s_session_{N}` for unlocking and completion tracking.
  - Sessions > 1 are paywalled; unlocking shows pricing UI and relies on those localStorage keys.
  - Analytics events are pushed to `window.dataLayer` when present.

## Naming patterns and file layout
- Authoring: `01_product/audio/narrator/scripts/N-s{NN}-intro.txt` and `N-s{NN}-outro.txt`.
- Generated narrator MP3s: same base name in `01_product/audio/narrator/generated/`.
- Assembled session: `01_product/audio/final/session-{NN}-final.mp3` -> eventually copied into `public/audio/` for deployment.

## Integration points & external dependencies
- ElevenLabs TTS: `02_dev/assets/generate-narrator-elevenlabs.mjs` (requires `ELEVENLABS_API_KEY`).
- Optional TTS helper (inspect before use): `02_dev/assets/generate-audio.js` (contains platform-specific assumptions).
- `ffmpeg` / `ffprobe` are required for `assemble_sessions.js` and `process-audio.js`.
- `netlify.toml` publishes `public/` and sets a cache header for audio (`Cache-Control: public, max-age=31536000, immutable`) — this makes `public/audio/` effectively immutable in production.

## Editing automation scripts — rules of the road
- Preserve directory constants at the top of the scripts; they convey source-of-truth locations.
- Do not modify `public/audio/` directly in automation. Write outputs to `01_product/audio/*` instead, and coordinate manual replacement of deployed audio.
- Avoid using `02_dev/assets/generate-audio.js` without fixing its `OUTPUT_DIR` and API placeholders.

## Quick copyable examples
- Export ElevenLabs key:

  export ELEVENLABS_API_KEY="your_key_here"

- Generate narrator MP3s (dev machine):

  node 02_dev/assets/generate-narrator-elevenlabs.mjs

- Assemble sessions (requires ffmpeg/ffprobe):

  node 02_dev/assets/assemble_sessions.js


## Files to inspect for context
- [README.md](README.md) — repo-level rules, branching, and the public audio policy
- [02_dev/assets/generate-narrator-elevenlabs.mjs](02_dev/assets/generate-narrator-elevenlabs.mjs)
- [02_dev/assets/create_narrator_scripts.js](02_dev/assets/create_narrator_scripts.js)
- [02_dev/assets/assemble_sessions.js](02_dev/assets/assemble_sessions.js)
- [02_dev/assets/process-audio.js](02_dev/assets/process-audio.js)
- [public/assets/js/player.js](public/assets/js/player.js) — runtime audio loading + localStorage/paywall logic
- [netlify.toml](netlify.toml) — publish target and audio cache rules

If anything above is unclear or you want more detail (for example, exact localStorage keys used by the UI or where session metadata is sourced), tell me which area to expand and I will iterate.
