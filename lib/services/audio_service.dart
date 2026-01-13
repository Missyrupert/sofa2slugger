import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio/just_audio.dart';
import 'package:audio_session/audio_session.dart';

final audioServiceProvider = Provider<AudioService>((ref) {
  return AudioService();
});

class AudioService {
  final AudioPlayer _player = AudioPlayer();

  Stream<PlayerState> get playerStateStream => _player.playerStateStream;
  Stream<Duration> get positionStream => _player.positionStream;
  Stream<Duration?> get durationStream => _player.durationStream;
  
  bool get playing => _player.playing;

  Future<void> init() async {
    final session = await AudioSession.instance;
    await session.configure(const AudioSessionConfiguration.speech());
    // Handle interruptions (e.g. phone call)
    session.interruptionEventStream.listen((event) {
      if (event.begin) {
        if (event.type == AudioInterruptionType.pause ||
            event.type == AudioInterruptionType.unknown) {
          _player.pause();
        }
      } else {
        if (event.type == AudioInterruptionType.pause ||
            event.type == AudioInterruptionType.unknown) {
          _player.play();
        }
          // Only resume if the player was playing before interruption
          // For now, let's just resume both if they were playing
          if (_player.playing) _player.play();
          if (_musicPlayer.playing) _musicPlayer.play();
        }
      }
    });

    _player.playerStateStream.listen((state) {
      if (state.processingState == ProcessingState.completed) {
         // When session voice ends, fade out music? 
         // For now, let's just stop it when explicitly stopped or new session starts.
         _stopMusic();
      }
    });
  }

  Stream<void> get completionStream => _player.playerStateStream
      .where((state) => state.processingState == ProcessingState.completed)
      .map((_) => null);

  String? _currentSessionId;
  String? get currentSessionId => _currentSessionId;

  Future<void> loadSession(String assetPath, String sessionId) async {
    print("AudioService: Attempting to load static audio: $assetPath for session: $sessionId");
    try {
      _currentSessionId = sessionId;
      
      // Stop previous playback
      await stop();
      
      // 1. Play Bell (Immediate)
      await _playBell();

      // 2. Start Background Music (Based on Session ID)
      final musicTrack = _getMusicTrackForSession(sessionId);
      if (musicTrack != null) {
        // Load static music file from /audio/music/
        // Ignoring wait to start voice concurrently or slightly after
        _playMusic(musicTrack);
      }

      // 3. Load Main Voice Track
      await _player.setAudioSource(AudioSource.uri(Uri.parse(assetPath)));
      final duration = _player.duration;
      print("AudioService: Loaded static asset ($assetPath). Duration: $duration");
      
    } catch (e) {
      print("AudioService: Error loading audio asset: $e");
      _currentSessionId = null; 
    }
  }

  Future<void> _playBell() async {
    try {
       // Static bell path
       await _bellPlayer.setAudioSource(AudioSource.uri(Uri.parse('/audio/boxing_bell.mp3')));
       await _bellPlayer.play();
    } catch(e) {
      print("AudioService: Error playing bell: $e");
    }
  }

  String? _getMusicTrackForSession(String sessionId) {
    // 1. Calm / Grounded (S1-2)
    if (sessionId == 'session01' || sessionId == 'session02') {
      return '/audio/music/calm_base.mp3';
    }
    // 2. Focused / Momentum (S3-5)
    if (['session03', 'session04', 'session05'].contains(sessionId)) {
      return '/audio/music/focused_base.mp3';
    }
    // 3. Controlled Intensity (S6-9)
    if (['session06', 'session07', 'session08', 'session09'].contains(sessionId)) {
      return '/audio/music/intensity_base.mp3';
    }
    // 4. Session 10 - Sustained
    if (sessionId == 'session10') {
      return '/audio/music/session10_base.mp3';
    }
    // Manifesto / Default -> No music or maybe Calm?
    // Let's stick to NO music for Manifesto to keep it stark, or calm.
    // User didn't specify Manifesto music, but it's "Orientation". 
    // "Calm / Grounded Used for Sessions 1–2". 
    // Let's leave Manifesto silent/voice only for impact.
    return null;
  }

  Future<void> _playMusic(String path) async {
    try {
      await _musicPlayer.setAudioSource(AudioSource.uri(Uri.parse(path)));
      await _musicPlayer.play();
    } catch (e) {
      print("AudioService: Error playing music $path: $e");
    }
  }

  Future<void> _stopMusic() async {
    try {
      await _musicPlayer.stop();
    } catch (e) {
       print("AudioService: Error stopping music: $e");
    }
  }

  Future<void> play() async {
    print("AudioService: Play called");
    try {
      await _player.play();
      if (_player.processingState == ProcessingState.completed) {
        await _player.seek(Duration.zero);
        await _player.play();
      }
      // Ensure music is playing if it was paused?
      if (_musicPlayer.processingState != ProcessingState.idle) {
         _musicPlayer.play();
      }
      print("AudioService: Playing");
    } catch (e) {
      print("AudioService: Error playing: $e");
    }
  }
  Future<void> pause() async {
    await _player.pause();
    await _musicPlayer.pause();
  }

  Future<void> stop() async {
    await _player.stop();
    await _player.seek(Duration.zero);
    await _musicPlayer.stop();
    _currentSessionId = null; // Clear on stop? Or keep?
  }

  Future<void> seek(Duration position) => _player.seek(position);

  void dispose() {
    _player.dispose();
  }
}
