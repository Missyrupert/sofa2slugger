SESSION 1 Locked Execution Mode
================================

This repository is running in a locked execution mode where only Session 1 is used
as the authoritative, reference audio experience. The rules below must be followed
and preserved in the repository.

- Use the existing Session 1 audio file in `public/audio/` exactly as-is.
- Do NOT regenerate, remix, normalize, re-encode, or process audio in code.
- Ignore all audio-generation scripts and pipelines under `02_dev/assets/`.
- The site must load and play Session 1 only; other sessions must remain inaccessible.
- Treat Session 1 as the reference experience for layout, copy, and flow.

If you need to change this mode, coordinate with the product owner. Any changes
to audio assets under `public/audio/` must be handled offline and replaced
manually — do not attempt to programmatically alter files in `public/audio/`.
