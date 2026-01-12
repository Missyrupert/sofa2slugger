import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/session_repository.dart';

class CornerScreen extends ConsumerStatefulWidget {
  const CornerScreen({super.key});

  @override
  ConsumerState<CornerScreen> createState() => _CornerScreenState();
}

class _CornerScreenState extends ConsumerState<CornerScreen> {
  @override
  Widget build(BuildContext context) {
    final sessionRepo = ref.watch(sessionRepositoryProvider);
    // Note: In a real app we'd watch the state, but since isPremium is a raw getter/setter without notification,
    // we use setState to rebuild the UI after toggling.
    final isPremium = sessionRepo.isPremium;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'CORNER',
          style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5),
        ),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _buildSectionHeader(theme, "MEMBERSHIP"),
          SwitchListTile(
            title: Text("Premium Mode (Simulated)", style: theme.textTheme.bodyLarge),
            subtitle: Text(
              isPremium ? "Access All Sessions" : "Free Tier (Orientation + S1)",
              style: theme.textTheme.bodyMedium?.copyWith(color: Colors.grey),
            ),
            value: isPremium,
            activeColor: theme.colorScheme.primary,
            onChanged: (val) {
              setState(() {
                sessionRepo.setPremium(val);
                ref.refresh(sessionsProvider); // Refresh the gym list to reflect changes
              });
            },
          ),
          const Divider(height: 48, color: Colors.white10),
          _buildSectionHeader(theme, "DATA MANAGEMENT"),
          ListTile(
            leading: const Icon(Icons.delete_outline, color: Colors.red),
            title: Text("Reset Progress", style: theme.textTheme.bodyLarge?.copyWith(color: Colors.red)),
            onTap: () async {
              await sessionRepo.clearProgress();
              ref.refresh(sessionsProvider); // Refresh gym list
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Progress Reset to Start")),
                );
              }
            },
          ),
          const Divider(height: 48, color: Colors.white10),
          Center(
            child: Text(
              "Sofa2Slugger v0.2.0 (Phase 3)",
              style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey[800]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(ThemeData theme, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Text(
        title,
        style: theme.textTheme.labelSmall?.copyWith(
          color: theme.colorScheme.secondary,
          letterSpacing: 2.0,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
