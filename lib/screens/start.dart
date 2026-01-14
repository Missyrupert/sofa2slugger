import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:sofa2slugger/services/storage.dart';

class StartScreen extends StatefulWidget {
  const StartScreen({super.key});

  @override
  State<StartScreen> createState() => _StartScreenState();
}

class _StartScreenState extends State<StartScreen> {
  @override
  void initState() {
    super.initState();
    _unlockContent();
  }

  Future<void> _unlockContent() async {
    // 1. Grant Access
    await StorageService.setPremium(true);
    
    // 2. Wait for user to read success message
    await Future.delayed(const Duration(seconds: 3));

    if (mounted) {
      // 3. Go to standard app entry (Splash -> Gym)
      context.go('/splash');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.check_circle_outline,
                size: 80,
                color: theme.colorScheme.primary,
              ),
              const SizedBox(height: 32),
              Text(
                'PAYMENT SUCCESSFUL',
                style: theme.textTheme.headlineSmall?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2.0,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'All sessions unlocked.',
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: Colors.white70,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              const CircularProgressIndicator(
                strokeWidth: 2,
              ),
              const SizedBox(height: 16),
              Text(
                'Entering the gym...',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: Colors.white54,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
