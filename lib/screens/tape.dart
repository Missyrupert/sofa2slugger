import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/session_repository.dart';
import '../models/session.dart';
import '../widgets/tape_progress_bar.dart';

class TapeScreen extends ConsumerWidget {
  const TapeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sessionsValue = ref.watch(sessionsProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'TALE OF THE TAPE',
          style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5),
        ),
        centerTitle: true,
      ),
      body: sessionsValue.when(
        data: (sessions) {
          final completedCount = sessions.where((s) => s.isCompleted).length;
          final totalCount = sessions.length;
          final progress = totalCount > 0 ? completedCount / totalCount : 0.0;
          final estimatedMinutes = completedCount * 15;

          return Column(
            children: [
              // THE TAPE (Progress Bar)
              Container(
                color: const Color(0xFF111111),
                padding: const EdgeInsets.symmetric(vertical: 24.0, horizontal: 0),
                child: Column(
                  children: [
                    // Tape Widget
                    TapeProgressBar(
                      progress: progress,
                      height: 60,
                      baseColor: const Color(0xFF222222), // Darker base for contrast
                      progressColor: theme.colorScheme.primary, // Gold
                    ),
                    const SizedBox(height: 16),
                    // Stats Row
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("PROGRESS", style: theme.textTheme.labelSmall?.copyWith(color: Colors.grey, letterSpacing: 1.5)),
                                FittedBox(
                                  fit: BoxFit.scaleDown,
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    "${(progress * 100).toInt()}%",
                                    style: theme.textTheme.headlineLarge?.copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w900,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text("TOTAL TIME", style: theme.textTheme.labelSmall?.copyWith(color: Colors.grey, letterSpacing: 1.5)),
                                FittedBox(
                                  fit: BoxFit.scaleDown,
                                  alignment: Alignment.centerRight,
                                  child: Text(
                                    "$estimatedMinutes MIN",
                                    style: theme.textTheme.headlineSmall?.copyWith(
                                      color: theme.colorScheme.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Timeline List
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
                  children: [
                    const Divider(color: Colors.white10),
                    const SizedBox(height: 16),
                    ...sessions.asMap().entries.map((entry) {
                      final index = entry.key;
                      final session = entry.value;
                      final isLast = index == sessions.length - 1;
                      return _buildTimelineItem(context, session, index, isLast);
                    }),
                    const SizedBox(height: 48),
                  ],
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text("Error: $err")),
      ),
    );
  }

  Widget _buildTimelineItem(BuildContext context, Session session, int index, bool isLast) {
    final theme = Theme.of(context);
    final isCompleted = session.isCompleted;

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline Line
          Column(
            children: [
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isCompleted ? theme.colorScheme.primary : Colors.grey[800],
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: isCompleted ? theme.colorScheme.primary.withOpacity(0.5) : Colors.grey[900],
                  ),
                ),
            ],
          ),
          const SizedBox(width: 24),
          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    session.title.toUpperCase(),
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: isCompleted ? Colors.white : Colors.grey,
                      fontWeight: FontWeight.bold,
                      decoration: isCompleted ? null : null,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      if (isCompleted) ...[
                        const Icon(Icons.check, size: 14, color: Colors.green),
                        const SizedBox(width: 4),
                        Text(
                          "COMPLETE",
                          style: theme.textTheme.labelSmall?.copyWith(color: Colors.green),
                        ),
                      ] else ...[
                         Text(
                          "PENDING",
                          style: theme.textTheme.labelSmall?.copyWith(color: Colors.grey[800]),
                        ),
                      ]
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
