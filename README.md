# Sofa2Slugger (Flutter Rebuild)

**Phase 3: Progress & Hardening**

A premium, disciplined digital boxing gym application built with Flutter.

## How to Run (Failsafe)

### Prerequisites
1.  **Flutter SDK** installed and in your PATH.
2.  **Chrome** (or a connected mobile device/simulator).

### Running the App
The most reliable way to run the app in development mode on this machine:

1.  Open a terminal in this directory.
2.  Run the following command:
    ```powershell
    flutter run -d chrome
    ```

**Note on Audio:**
If you experience "sticky" audio (old sessions playing instead of new ones), restarting the app usually fixes it. We have implemented cache-busting to mitigate this on the web.

## Project Structure

*   `lib/` - Main application code.
    *   `main.dart` - Entry point.
    *   `router.dart` - Navigation logic (GoRouter).
    *   `theme/` - "Zen Boxing" design system.
    *   `screens/` - UI Screens (Gym, Tape, Corner, IQ, Splash).
    *   `services/` - Audio, Session Management, Persistence.
    *   `models/` - Data models.
    *   `widgets/` - Reusable UI widgets (AudioPlayerBar, AppShell).
*   `assets/` - Audio files (`.mp3`) and images.

## Features (Implemented)
*   **Cinematic Splash:** "Sofa2Slugger" branding flow.
*   **The Gym:** List of sessions (Manifesto + 1-10). Locking logic based on Premium status.
*   **Audio Player:** Persistent bottom bar with Play/Pause/Stop.
*   **Progress:** Visual "Tale of the Tape" showing completed sessions.
*   **Fight IQ:** Glossary of terms (What, Why, How).
*   **The Corner (Settings):** Premium toggle simulation and Progress Reset.
