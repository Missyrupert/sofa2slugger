import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sofa2slugger/services/audio_service.dart';
import 'package:sofa2slugger/services/session_repository.dart';
import 'package:sofa2slugger/theme/app_theme.dart';
import 'audio_player_bar.dart';

// Logic provider to link Audio Completion -> Session Progress
final _sessionCompletionManagerProvider = Provider<void>((ref) {
  final audioService = ref.watch(audioServiceProvider);
  final sessionRepo = ref.watch(sessionRepositoryProvider);

  final sub = audioService.completionStream.listen((_) {
    final currentId = audioService.currentSessionId;
    if (currentId != null) {
      print("AppShell: Session $currentId complete. Marking progress.");
      sessionRepo.markSessionComplete(currentId);
      ref.refresh(sessionsProvider);
    }
  });
  
  ref.onDispose(() => sub.cancel());
});

class AppShell extends ConsumerWidget {
  final Widget child;
  const AppShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = AppTheme.dark;
    final int selectedIndex = _calculateSelectedIndex(context);

    // Cleanest: Watch a "SessionCompletionManager" provider.
    ref.watch(_sessionCompletionManagerProvider);

    return Scaffold(
      body: Column(
        children: [
          Expanded(child: child),
          const AudioPlayerBar(), // Persistent Player
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _calculateSelectedIndex(context),
        onTap: (index) => _onItemTapped(index, context),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.sports_mma_outlined), 
            activeIcon: Icon(Icons.sports_mma),
            label: 'GYM'
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.show_chart), 
            label: 'PROGRESS'
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book_outlined), 
            activeIcon: Icon(Icons.menu_book),
            label: 'IQ'
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined), 
            activeIcon: Icon(Icons.settings),
            label: 'CORNER'
          ),
        ],
      ),
    );
  }

  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).uri.toString();
    if (location.startsWith('/gym')) return 0;
    if (location.startsWith('/tape')) return 1;
    if (location.startsWith('/iq')) return 2;
    if (location.startsWith('/corner')) return 3;
    return 0; // Default to Gym
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
    switch (index) {
      case 0: GoRouter.of(context).go('/gym'); break;
      case 1: GoRouter.of(context).go('/tape'); break;
      case 2: GoRouter.of(context).go('/iq'); break;
      case 3: GoRouter.of(context).go('/corner'); break;
    }
  }
}
