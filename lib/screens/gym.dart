import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/session_repository.dart';
import '../services/audio_service.dart';
import '../models/session.dart';

class GymScreen extends ConsumerWidget {
  const GymScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sessionRepo = ref.watch(sessionRepositoryProvider);
    final theme = Theme.of(context);

    final sessionsValue = ref.watch(sessionsProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          "THE GYM",
          style: theme.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
            letterSpacing: 2.0,
          ),
        ),
      ),
      body: sessionsValue.when(
        data: (sessions) {
          return ListView.separated(
            padding: const EdgeInsets.all(24),
            itemCount: sessions.length,
            separatorBuilder: (context, index) => const Divider(color: Colors.white10),
            itemBuilder: (context, index) {
              final session = sessions[index];
              final isLocked = session.isLocked;

              return Opacity(
                opacity: isLocked ? 0.3 : 1.0,
                child: InkWell(
                  onTap: isLocked ? null : () async {
                    // Play Session
                    print("GymScreen: Tapped session $index (${session.title}). Path: ${session.audioPath}");
                    final audioService = ref.read(audioServiceProvider);
                    await audioService.loadSession(session.audioPath, session.id);
                    await audioService.play();
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 24.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Index
                        Text(
                          index == 0 ? "M" : "$index", // M for Manifesto
                          style: theme.textTheme.displaySmall?.copyWith(
                            color: isLocked ? Colors.grey : theme.colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 24),
                        // Content
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                session.title.toUpperCase(),
                                style: theme.textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                session.description.toUpperCase(),
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  color: Colors.grey,
                                  letterSpacing: 1.0,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Lock/Play Icon
                         Icon(
                            isLocked ? Icons.lock_outline : Icons.play_arrow,
                            size: 32,
                            color: isLocked ? Colors.grey : Colors.white,
                          ),
                      ],
                    ),
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              "Error loading gym: $err",
              style: theme.textTheme.bodyLarge?.copyWith(color: Colors.red),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ),
    );
  }
}
