import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/session.dart';

final sessionRepositoryProvider = Provider<SessionRepository>((ref) {
  return SessionRepository();
});

final sessionsProvider = FutureProvider<List<Session>>((ref) async {
  final repo = ref.watch(sessionRepositoryProvider);
  return repo.getSessions();
});

class SessionRepository {
  static const String _progressKey = 'completed_session_index';
  late SharedPreferences _prefs;

  // Hardcoded Session Data
  final List<Session> _allSessions = [
    Session(
      id: 'manifesto', // Changed from orientation
      title: 'THE MANIFESTO', // Changed from Orientation
      description: 'Context & Safety. Required.',
      audioPath: 'assets/orientation.mp3', 
    ),
    Session(id: 'session01', title: 'Session 01', description: 'Foundations', audioPath: 'assets/session01.mp3'),
    Session(id: 'session02', title: 'Session 02', description: 'Movement', audioPath: 'assets/session02.mp3'),
    Session(id: 'session03', title: 'Session 03', description: 'Lead Side', audioPath: 'assets/session03.mp3'),
    Session(id: 'session04', title: 'Session 04', description: 'Rear Side', audioPath: 'assets/session04.mp3'),
    Session(id: 'session05', title: 'Session 05', description: 'Rhythm', audioPath: 'assets/session05.mp3'),
    Session(id: 'session06', title: 'Session 06', description: 'Consistency', audioPath: 'assets/session06.mp3'),
    Session(id: 'session07', title: 'Session 07', description: 'Targets', audioPath: 'assets/session07.mp3'),
    Session(id: 'session08', title: 'Session 08', description: 'Distance', audioPath: 'assets/session08.mp3'),
    Session(id: 'session09', title: 'Session 09', description: 'Defence', audioPath: 'assets/session09.mp3'),
    Session(id: 'session10', title: 'Session 10', description: 'The Round', audioPath: 'assets/session10.mp3'),
  ];

  /* init handled lazily */

  // Mock Premium Status (Default to true for dev/testing)
  bool _isPremium = true;
  bool get isPremium => _isPremium;

  void setPremium(bool value) {
    _isPremium = value;
    // In a real app, we might notify listeners here if this was a ChangeNotifier
  }

  /// Returns the list of sessions with correct locked/unlocked state
  Future<List<Session>> getSessions() async {
    // Lazy initialization
    _prefs = await SharedPreferences.getInstance();
    
    // Determine highest completed index
    final completedIndex = _prefs.getInt(_progressKey) ?? -1;

    return _allSessions.asMap().entries.map((entry) {
      final index = entry.key;
      final session = entry.value;

      // Unlock Logic:
      // 1. Manifesto (0) and Session 1 (1) are ALWAYS unlocked (Free Tier).
      // 2. If Premium: ALL sessions are unlocked.
      // 3. If NOT Premium: Only 0 and 1 are unlocked.
      
      bool isUnlocked;
      if (_isPremium) {
        // Premium: All unlocked
        isUnlocked = true; 
      } else {
        // Free: Only Orientation and Session 1
        isUnlocked = index <= 1;
      }
      
      final isCompleted = index <= completedIndex;

      return session.copyWith(
        isLocked: !isUnlocked,
        isCompleted: isCompleted,
      );
    }).toList();
  }

  Future<void> markSessionComplete(String sessionId) async {
    final index = _allSessions.indexWhere((s) => s.id == sessionId);
    if (index == -1) return;

    final currentCompleted = _prefs.getInt(_progressKey) ?? -1;
    if (index > currentCompleted) {
      await _prefs.setInt(_progressKey, index);
    }
  }

  Future<void> clearProgress() async {
    await _prefs.remove(_progressKey);
  }
}
