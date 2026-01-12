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
      
      // CRITICAL FIX: Use URI parsing with unique timestamp to force browser to ignore cache.
      // Flutter Web assets are served from the root. 'assets/session01.mp3' needs to be accessed 
      // as a URI.
      
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      // On web, assets are often at 'assets/assets/...' but let's try standard asset key first with query param.
      // If we use AudioSource.uri, we bypass the internal asset cache key logic of just_audio somewhat.
      
      final uriPath = "$assetPath?t=$timestamp";
      
      // We use Uri.parse. For local assets in Flutter, the scheme is usually 'asset:///' but 
      // just_audio on web handles http/relative paths. 
      // Note: 'assetPath' is "assets/session01.mp3".
      
      await _player.setAudioSource(AudioSource.uri(Uri.parse(uriPath)));
      
      final duration = _player.duration;
      print("AudioService: Asset loaded via URI ($uriPath). Duration: $duration");
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
