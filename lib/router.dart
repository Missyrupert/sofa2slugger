import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'services/storage.dart';
import 'screens/landing.dart';
import 'screens/start.dart';
import 'widgets/app_shell.dart';
import 'screens/gym.dart';
import 'screens/tape.dart';
import 'screens/corner.dart';
import 'screens/iq.dart';
import 'screens/splash.dart';
import 'screens/landing.dart';
import 'screens/start.dart';
import 'screens/start.dart';
import 'screens/landing.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const LandingScreen(),
      ),
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/start',
        builder: (context, state) => const StartScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(path: '/corner', builder: (context, state) => const CornerScreen()),
          GoRoute(path: '/tape', builder: (context, state) => const TapeScreen()),
          GoRoute(path: '/gym', builder: (context, state) => const GymScreen()),
          GoRoute(path: '/iq', builder: (context, state) => const IQScreen()),
        ],
      ),
    ],
  );
});
