# Debugging Assistant Request: Sticky Audio in Flutter Web

**Context:**
I am building a Flutter Web application ("Sofa2Slugger") deployed on Netlify. It is a boxing training app that plays different audio sessions (`.mp3` files) using the `just_audio` package.

**The Problem:**
I have a list of sessions. When I click different sessions, the logs confirm the app is requesting the correct, distinct audio file paths. However, the browser/player seems "stuck" playing the same audio file for every single session.
- Initially, it played "Orientation" for everything.
- After a "fix" (below), it now plays "Session 1" for everything.
- The files on disk are definitely different sizes and names.

**The Stack:**
- **Framework:** Flutter (Channel stable)
- **Deployment:** Netlify (Flutter Web)
- **Audio Package:** `just_audio` ^0.9.36
- **State Management:** Riverpod

**Code Snippets:**

**1. Audio Service (`lib/services/audio_service.dart`)**
We tried to implement cache-busting by appending a timestamp query parameter, but it behaviorally shifted the stuck file rather than fixing it.
```dart
  Future<void> loadSession(String assetPath, String sessionId) async {
    print("AudioService: Attempting to load asset: $assetPath for session: $sessionId");
    try {
      _currentSessionId = sessionId;
      
      // Attempted Fix: Force URI loading with timestamp to bypass browser cache
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      // assetPath is like "assets/session01.mp3"
      final uriPath = "$assetPath?t=$timestamp";
      
      await _player.setAudioSource(AudioSource.uri(Uri.parse(uriPath)));
      
      final duration = _player.duration;
      print("AudioService: Asset loaded via URI ($uriPath). Duration: $duration");
    } catch (e) { ... }
  }
```

**2. Session Data (`lib/services/session_repository.dart`)**
```dart
    Session(
      id: 'manifesto',
      title: 'THE MANIFESTO',
      audioPath: 'assets/orientation.mp3', 
    ),
    Session(id: 'session01', title: 'Session 01', audioPath: 'assets/session01.mp3'),
    // ...
```

**3. UI Interaction (`lib/screens/gym.dart`)**
```dart
onTap: () async {
  // Logs show this prints the CORRECT path when tapped
  print("GymScreen: Tapped session $index. Path: ${session.audioPath}");
  final audioService = ref.read(audioServiceProvider);
  await audioService.loadSession(session.audioPath, session.id);
  await audioService.play();
},
```

**Observations:**
- The console logs show `AudioService: Asset loaded via URI (assets/session02.mp3?t=123...). Duration: X`.
- BUT the audio heard is clearly Session 1.
- `flutter clean` was run before deployment.
- Netlify `netlify.toml` is set to build `flutter build web --release`.

**Request:**
Please analyze why `just_audio` on Flutter Web might serve the wrong asset despite the URI being correct. Is there an issue with how Flutter Web packages assets in `release` mode? Is `setAudioSource(Uri)` incorrectly resolving relative paths in a deployed environment? Provide a robust solution to ensure the correct file plays every time.
