import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black, // Hard black for splash
      body: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Stage 1: Image
            Image.asset(
              'assets/splash.jpeg',
              width: MediaQuery.of(context).size.width * 0.8,
              fit: BoxFit.contain,
            )
            .animate()
            .fadeIn(duration: 1500.ms, curve: Curves.easeIn)
            .fadeOut(delay: 2000.ms, duration: 1000.ms),

            // Stage 2: Text (Starts after image fades)
            Text(
              'SOFA2SLUGGER',
              style: Theme.of(context).textTheme.displayLarge?.copyWith(
                fontWeight: FontWeight.bold,
                letterSpacing: 4.0,
                color: Colors.white,
              ),
            )
            .animate(onPlay: (controller) => controller.repeat()) // Trick to allow sequential logic, but strictly we just delay
            .fadeIn(delay: 3500.ms, duration: 1000.ms)
            .scale(delay: 3500.ms, begin: const Offset(0.9, 0.9), end: const Offset(1.1, 1.1), duration: 2000.ms)
            .fadeOut(delay: 5500.ms, duration: 500.ms)
            .callback(callback: (_) {
               context.go('/gym');
            }),
          ],
        ),
      ),
    );
  }
}
