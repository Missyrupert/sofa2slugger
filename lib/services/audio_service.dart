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
    print("AudioService: Attempting to load mixed audio: $assetPath for session: $sessionId");
    try {
      _currentSessionId = sessionId;
      
      // Stop previous playback
      await stop();
      
      // Cache Busting: Append timestamp to force browser to fetch fresh file
      // This solves the "sticky audio" issue where the browser serves cached content
      // even when the URI path changes if the filename was previously cached aggressively.
      final timestamp = DateTime.now().millisecondsSinceEpoch.toString();
      final uri = Uri.parse(assetPath).replace(queryParameters: {'t': timestamp});
      
      print("AudioService: Loading URI with cache wipe: $uri");
      
      // Load Main Mixed Track
      await _player.setAudioSource(AudioSource.uri(uri));
      final duration = _player.duration;
      print("AudioService: Loaded mixed asset. Duration: $duration");
      
    } catch (e) {
      print("AudioService: Error loading audio asset: $e");
      _currentSessionId = null; 
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
      print("AudioService: Playing");
    } catch (e) {
      print("AudioService: Error playing: $e");
    }
  }

  Future<void> pause() async {
    await _player.pause();
  }

  Future<void> stop() async {
    await _player.stop();
    await _player.seek(Duration.zero);
    _currentSessionId = null; 
  }

  Future<void> seek(Duration position) => _player.seek(position);

  void dispose() {
    _player.dispose();
  }
}
