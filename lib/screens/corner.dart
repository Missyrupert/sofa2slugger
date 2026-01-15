import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sofa2slugger/services/session_repository.dart';
import 'package:sofa2slugger/services/storage.dart';
import 'package:sofa2slugger/screens/admin/legal_screens.dart';
import 'package:url_launcher/url_launcher.dart';

class CornerScreen extends ConsumerWidget {
  const CornerScreen({super.key});

  Future<void> _launchFeedback() async {
    final Uri url = Uri.parse('https://docs.google.com/forms/d/e/1FAIpQLSfjbJAGE9qvyEf3E29TlhAHuF_S9uiB2yHKVpsiZIJemkteQA/viewform');
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      debugPrint('Could not launch $url');
    }
  }

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
              return Container(
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  color: const Color(0xFF0A0A0A),
                  border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.3)),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: SwitchListTile(
                  title: const Text('PREMIUM MODE', 
                    style: TextStyle(
                      color: Color(0xFFD4AF37), // Elite Gold
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0
                    )
                  ),
                  subtitle: const Text('Unlock all sessions', style: TextStyle(color: Colors.white54, fontSize: 12)),
                  value: true, 
                  onChanged: (val) async {
                     await StorageService.setPremium(val);
                     ref.refresh(sessionsProvider);
                     
                     if (context.mounted) {
                       ScaffoldMessenger.of(context).showSnackBar(
                         SnackBar(content: Text(val ? "Premium features unlocked." : "Premium features locked.")),
                       );
                     }
                  },
                  activeColor: const Color(0xFFD4AF37), // Elite Gold
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                ),
              );
            },
          ),

          const SizedBox(height: 32),
          _buildSectionHeader(theme, "FEEDBACK"),
          _buildActionTile(context, "BETA FEEDBACK", Icons.feedback_outlined, _launchFeedback),

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
            decoration: BoxDecoration(
              border: Border.all(color: Colors.white10),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                const Text(
                  "DANGER ZONE",
                  style: TextStyle(color: Colors.white38, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white.withOpacity(0.05),
                      foregroundColor: Colors.white70,
                      side: const BorderSide(color: Colors.white10),
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
              style: const TextStyle(color: Colors.white24, fontSize: 12),
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
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF0A0A0A),
        border: Border.all(color: Colors.white10),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Material(
        color: Colors.transparent,
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          title: Text(
            title.toUpperCase(), 
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.0,
            )
          ),
          trailing: const Icon(Icons.arrow_forward, color: Colors.white24, size: 16),
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => destination));
          },
        ),
      ),
    );
  }

  Widget _buildActionTile(BuildContext context, String title, IconData icon, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF0A0A0A),
        border: Border.all(color: Colors.white10),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Material(
        color: Colors.transparent,
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          title: Text(
            title.toUpperCase(), 
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.0,
            )
          ),
          trailing: Icon(icon, color: Colors.white24, size: 16),
          onTap: onTap,
        ),
      ),
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
            child: const Text("RESET", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
