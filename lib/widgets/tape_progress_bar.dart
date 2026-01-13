import 'dart:math';
import 'package:flutter/material.dart';

class TapeProgressBar extends StatelessWidget {
  final double progress; // 0.0 to 1.0
  final double height;
  final Color baseColor;
  final Color progressColor;

  const TapeProgressBar({
    super.key,
    required this.progress,
    this.height = 48.0,
    this.baseColor = const Color(0xFFE0E0E0), // White/creamy tape
    this.progressColor = const Color(0xFFFFD700), // Gold
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      width: double.infinity,
      child: CustomPaint(
        painter: _TapePainter(
          progress: progress.clamp(0.0, 1.0),
          baseColor: baseColor,
          progressColor: progressColor,
        ),
      ),
    );
  }
}

class _TapePainter extends CustomPainter {
  final double progress;
  final Color baseColor;
  final Color progressColor;
  final Random _random = Random(42); // Fixed seed for consistent jaggedness

  _TapePainter({
    required this.progress,
    required this.baseColor,
    required this.progressColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Define the jagged path for the tape
    final path = _createJaggedPath(size);

    // 2. Draw Base Tape (Background)
    final basePaint = Paint()
      ..color = baseColor.withOpacity(0.2)
      ..style = PaintingStyle.fill;
    
    // Add shadow
    canvas.drawShadow(path, Colors.black, 4.0, true);
    canvas.drawPath(path, basePaint);

    // 3. Draw Progress Tape (Foreground)
    if (progress > 0) {
      // Clip purely horizontally based on progress
      canvas.save();
      canvas.clipRect(Rect.fromLTWH(0, 0, size.width * progress, size.height));
      
      final progressPaint = Paint()
        ..color = progressColor
        ..style = PaintingStyle.fill;
        
      canvas.drawPath(path, progressPaint);
      
      // Add "Texture" (wrinkles/dirt)
      _drawTexture(canvas, size);
      
      canvas.restore();
    }
    
    // 4. Draw Border/Outline for definition
    final borderPaint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;
    canvas.drawPath(path, borderPaint);
  }

  Path _createJaggedPath(Size size) {
    final path = Path();
    const segmentWidth = 10.0;
    
    // Top Edge
    path.moveTo(0, 5);
    for (double x = 0; x < size.width; x += segmentWidth) {
      path.lineTo(x + segmentWidth, 5 + _random.nextDouble() * 4 - 2);
    }
    
    // Right Edge (Jagged vertical)
    path.lineTo(size.width, size.height - 5);
    
    // Bottom Edge
    for (double x = size.width; x > 0; x -= segmentWidth) {
      path.lineTo(x - segmentWidth, size.height - 5 + _random.nextDouble() * 4 - 2);
    }
    
    // Left Edge
    path.close();
    return path;
  }

  void _drawTexture(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    // Draw random "wrinkle" lines
    for (int i = 0; i < 20; i++) {
        final x = _random.nextDouble() * size.width;
        final y = _random.nextDouble() * size.height;
        final len = 5 + _random.nextDouble() * 15;
        final angle = _random.nextDouble() * pi;
        
        canvas.drawLine(
          Offset(x, y),
          Offset(x + cos(angle) * len, y + sin(angle) * len),
          paint
        );
    }
  }

  @override
  bool shouldRepaint(covariant _TapePainter oldDelegate) {
    return oldDelegate.progress != progress ||
           oldDelegate.baseColor != baseColor ||
           oldDelegate.progressColor != progressColor;
  }
}
