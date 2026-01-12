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
      }
    });
  }

  Stream<void> get completionStream => _player.playerStateStream
      .where((state) => state.processingState == ProcessingState.completed)
      .map((_) => null);

  String? _currentSessionId;
  String? get currentSessionId => _currentSessionId;

  Future<void> loadSession(String assetPath, String sessionId) async {
    print("AudioService: Attempting to load asset: $assetPath for session: $sessionId");
    try {
      _currentSessionId = sessionId;
      
      // Cache busting for Web: Append timestamp query param
      // Note: On native, this might fail if strictly file path, but assets usually handled via AssetSource
      // For just_audio with setAsset, it expects a key.
      // If we are on web, we might need setUrl if we want params, OR we presume setAsset handles keys.
      // Actually, setAsset uses the key from pubspec.
      
      // If just_audio caches based on key, we might need a workaround.
      // Let's try to verify if we are on web.
        
      await _player.setAsset(assetPath);
      final duration = _player.duration;
      print("AudioService: Asset loaded. Duration: $duration");
    } catch (e) {
      print("AudioService: Error loading audio asset: $e");
      _currentSessionId = null; 
    }
  }

  Future<void> play() async {
    print("AudioService: Play called");
    try {
      await _player.play();
      print("AudioService: Playing");
    } catch (e) {
      print("AudioService: Error playing: $e");
    }
  }
  Future<void> pause() => _player.pause();
  Future<void> stop() async {
    await _player.stop();
    await _player.seek(Duration.zero);
    _currentSessionId = null; // Clear on stop? Or keep?
  }

  Future<void> seek(Duration position) => _player.seek(position);

  void dispose() {
    _player.dispose();
  }
}
