import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/session_repository.dart';
import '../models/session.dart';

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
          final estimatedMinutes = completedCount * 15; // Approx 15 mins per session

          return ListView(
            padding: const EdgeInsets.all(24),
            children: [
              // premium Header Status
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFF111111),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white10),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text("TOTAL PROGRESS", style: theme.textTheme.labelSmall?.copyWith(color: Colors.grey, letterSpacing: 1.5)),
                            const SizedBox(height: 4),
                            Text(
                              "${(progress * 100).toInt()}%",
                              style: theme.textTheme.displayMedium?.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text("TIME IN RING", style: theme.textTheme.labelSmall?.copyWith(color: Colors.grey, letterSpacing: 1.5)),
                            const SizedBox(height: 4),
                            Text(
                              "$estimatedMinutes MINS",
                              style: theme.textTheme.headlineSmall?.copyWith(
                                color: theme.colorScheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    LinearProgressIndicator(
                      value: progress,
                      backgroundColor: Colors.grey[900],
                      color: theme.colorScheme.primary,
                      minHeight: 8,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              
              // Timeline List
              ...sessions.asMap().entries.map((entry) {
                final index = entry.key;
                final session = entry.value;
                final isLast = index == sessions.length - 1;

                return _buildTimelineItem(context, session, index, isLast);
              }),
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
