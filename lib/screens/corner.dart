import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sofa2slugger/services/session_repository.dart';
import 'package:sofa2slugger/screens/admin/legal_screens.dart';

class CornerScreen extends ConsumerWidget {
  const CornerScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('CORNER', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.5)),
        centerTitle: true,
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          // --- PROFILE / SETTINGS ---
          _buildSectionHeader(theme, "SETTINGS"),
          
          // Premium Toggle
          Consumer(
            builder: (context, ref, _) {
              // This is a mock toggle since we don't have real IAP yet.
              // We'll read the current state from repo if possible, or just default to on.
              return SwitchListTile(
                title: const Text('Premium Mode (Mock)', style: TextStyle(color: Colors.white)),
                subtitle: const Text('Unlock all sessions', style: TextStyle(color: Colors.white54)),
                value: true, // Mocked as true for display, logic is handled in Repo
                onChanged: (val) async {
                   final repo = ref.read(sessionRepositoryProvider);
                   repo.setPremium(val);
                   ref.refresh(sessionsProvider);
                   
                   if (context.mounted) {
                     ScaffoldMessenger.of(context).showSnackBar(
                       SnackBar(content: Text(val ? "Premium features unlocked." : "Premium features locked.")),
                     );
                   }
                },
                activeColor: theme.colorScheme.primary,
                contentPadding: EdgeInsets.zero,
              );
            },
          ),

          const SizedBox(height: 32),
          _buildSectionHeader(theme, "ADMINISTRATION"),
          
          _buildAdminTile(context, "About Sofa2Slugger", const AboutScreen()),
          _buildAdminTile(context, "Contact Support", const ContactScreen()),
          _buildAdminTile(context, "Safety Information", const SafetyScreen()),
          const Divider(color: Colors.white10, height: 32),
          _buildAdminTile(context, "Privacy Policy", const PrivacyScreen()),
          _buildAdminTile(context, "Terms of Service", const TermsScreen()),
          _buildAdminTile(context, "Refund Policy", const RefundScreen()),

          const SizedBox(height: 48),
          
          // --- DANGER ZONE ---
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.red.withOpacity(0.3)),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                const Text(
                  "DANGER ZONE",
                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.withOpacity(0.1),
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                    ),
                    onPressed: () => _showResetConfirmDialog(context, ref),
                    child: const Text("RESET ALL PROGRESS"),
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 24),
          Center(
            child: Text(
              "v0.3.0",
              style: TextStyle(color: Colors.white24, fontSize: 12),
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
        style: TextStyle(
          color: theme.colorScheme.secondary, // Or primary if secondary not defined
          fontSize: 12,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.5,
        ),
      ),
    );
  }

  Widget _buildAdminTile(BuildContext context, String title, Widget destination) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(title, style: const TextStyle(color: Colors.white70)),
      trailing: const Icon(Icons.chevron_right, color: Colors.white24, size: 20),
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (context) => destination));
      },
    );
  }

  Future<void> _showResetConfirmDialog(BuildContext context, WidgetRef ref) async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF111111),
        title: const Text("Reset App?", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: const Text(
          "This will wipe all your progress, unlocks, and history.\n\nThis action cannot be undone.",
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("CANCEL", style: TextStyle(color: Colors.white54)),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context); // Close dialog
              final repo = ref.read(sessionRepositoryProvider);
              await repo.clearProgress();
              ref.refresh(sessionsProvider);
              
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("App has been reset to factory settings.")),
                );
              }
            },
            child: const Text("RESET", style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
