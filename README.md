# Sofa2Slugger

**Audio-led boxing training. 10 sessions. Sofa to Slugger.**

A premium digital boxing gym application built with Flutter. Inspired by Couch to 5K - progressive audio coaching that takes you from beginner to competent boxer.

> "This is not a workout. It's a practice."

## What It Does

- **10 Progressive Sessions** - Guided audio training from fundamentals to advanced combinations
- **Audio-First Design** - No screens required; train anywhere (sofa, gym, park)
- **Progress Tracking** - Visual "Tale of the Tape" showing your journey
- **Fight IQ Glossary** - Learn boxing terminology with clear explanations
- **Premium Model** - Manifesto + Session 1 free, Sessions 2-10 premium (£19.99)

## Installation

### Prerequisites

1. **Flutter SDK** (3.10.7 or higher)
   ```bash
   # Check if installed
   flutter --version

   # If not installed, follow: https://docs.flutter.dev/get-started/install
   ```

2. **Chrome** (for web development) or a mobile device/simulator

3. **Node.js** (optional - only for audio generation)
   ```bash
   node --version  # v18+ recommended
   ```

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sofa2slugger
   ```

2. **Install Flutter dependencies**
   ```bash
   flutter pub get
   ```

3. **Verify setup**
   ```bash
   flutter doctor
   ```

### Running the App

**Web (Recommended)**
```bash
flutter run -d chrome
```

**iOS Simulator**
```bash
flutter run -d ios
```

**Android Emulator**
```bash
flutter run -d android
```

**List available devices**
```bash
flutter devices
```

### Building for Production

**Web Build**
```bash
flutter build web --release
```
Output: `build/web/`

**Android APK**
```bash
flutter build apk --release
```

**iOS**
```bash
flutter build ios --release
```

## Audio Tools Setup (Optional)

The `audio_tools/` directory contains Node.js scripts for generating session audio using TTS.

```bash
cd audio_tools
npm install
```

**Required Environment Variables** (create `.env` file):
```
CARTESIA_API_KEY=your_api_key_here
```

**Generate Audio**
```bash
# Generate manifesto
node generate_manifesto.js

# Generate all sessions
node generate_sessions.js

# Mix with background music
node mix_sessions.js
```

## Project Structure

```
sofa2slugger/
├── lib/                    # Flutter application source
│   ├── main.dart           # Entry point
│   ├── router.dart         # Navigation (GoRouter)
│   ├── theme/              # Zen Boxing design system
│   ├── screens/            # UI screens
│   │   ├── gym.dart        # Session library
│   │   ├── tape.dart       # Progress tracking
│   │   ├── iq.dart         # Boxing glossary
│   │   ├── corner.dart     # Settings
│   │   └── splash.dart     # Intro animation
│   ├── services/           # Business logic
│   │   ├── audio_service.dart
│   │   ├── session_repository.dart
│   │   └── storage.dart
│   ├── models/             # Data models
│   └── widgets/            # Reusable components
├── assets/                 # Images & scripts
│   ├── images/             # Boxing technique photos
│   └── scripts/            # Session text scripts
├── web/audio/              # Audio files for web
├── audio_tools/            # Node.js audio generation
└── netlify.toml            # Deployment config
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Flutter 3.10+ |
| State Management | Riverpod |
| Navigation | GoRouter |
| Audio | just_audio |
| Persistence | SharedPreferences |
| Typography | Google Fonts (Inter) |
| Animations | flutter_animate |
| TTS Generation | Cartesia API |
| Audio Mixing | FFmpeg (via fluent-ffmpeg) |
| Deployment | Netlify |

## Features

- **Cinematic Splash** - Animated branding intro
- **The Gym** - Session library with premium locking
- **Audio Player** - Persistent bottom bar (play/pause/stop)
- **Tale of the Tape** - Visual progress with jagged tape aesthetic
- **Fight IQ** - Categorized boxing glossary
- **The Corner** - Settings, feedback, legal pages

## Known Issues

**Sticky Audio on Web**: Browser may cache audio files incorrectly. Restart the app if wrong session plays.

## Deployment

Deployed via Netlify. Build configured in `netlify.toml`:
```toml
[build]
  command = "flutter build web --release"
  publish = "build/web"
```

## License

Private/Proprietary

---

**Phase 3: Progress & Hardening** | v1.0.0
