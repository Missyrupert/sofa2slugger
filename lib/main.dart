import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router.dart';
import 'services/storage.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.init();
  runApp(const ProviderScope(child: Sofa2SluggerApp()));
}

class Sofa2SluggerApp extends ConsumerWidget {
  const Sofa2SluggerApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      title: 'Sofa2Slugger',
      theme: AppTheme.dark,
      routerConfig: router,
    );
  }
}
