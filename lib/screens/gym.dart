import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/session_repository.dart';
import '../services/audio_service.dart';

class GymScreen extends ConsumerWidget {
  const GymScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
            separatorBuilder: (context, index) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final session = sessions[index];
              final isLocked = session.isLocked;
              final isCompleted = session.isCompleted;

              // Card Container
              return Opacity(
                opacity: isLocked ? 0.5 : 1.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF0A0A0A), // Obsidian Black
                    border: Border.all(
                      color: isLocked ? Colors.white10 : theme.colorScheme.primary,
                      width: isLocked ? 1 : 1.5,
                    ),
                    borderRadius: BorderRadius.circular(4), // Sharp/Brutalist
                    boxShadow: isLocked ? [] : [
                      BoxShadow(
                        color: theme.colorScheme.primary.withOpacity(0.15),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      )
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: isLocked ? null : () async {
                        print("GymScreen: Tapped session $index (${session.title}). Path: ${session.audioPath}");
                        final audioService = ref.read(audioServiceProvider);
                        await audioService.loadSession(session.audioPath, session.id);
                        await audioService.play();
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Row(
                          children: [
                            // 1. Status Indicator (Left)
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isLocked ? Colors.white24 : theme.colorScheme.primary,
                                  width: 1.5,
                                ),
                                color: isCompleted ? theme.colorScheme.primary : Colors.transparent,
                              ),
                              child: Center(
                                child: isLocked 
                                  ? const Icon(Icons.lock, size: 16, color: Colors.white24)
                                  : isCompleted 
                                    ? const Icon(Icons.check, size: 24, color: Colors.black)
                                    : Text(
                                        "${index}", // Session Number
                                        style: TextStyle(
                                          color: theme.colorScheme.primary,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                              ),
                            ),
                            
                            const SizedBox(width: 20),
                            
                            // 2. Content (Center)
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    session.title.toUpperCase(),
                                    style: theme.textTheme.titleMedium?.copyWith(
                                      color: isLocked ? Colors.white54 : Colors.white,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 1.2,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    session.description.toUpperCase(),
                                    style: theme.textTheme.bodySmall?.copyWith(
                                      color: isLocked ? Colors.white24 : Colors.white70,
                                      letterSpacing: 0.5,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            
                            // 3. Action (Right)
                            if (!isLocked)
                              Icon(
                                Icons.play_circle_fill,
                                color: theme.colorScheme.primary,
                                size: 32,
                              ),
                          ],
                        ),
                      ),
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
              style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onSurface),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ),
    );
  }
}
