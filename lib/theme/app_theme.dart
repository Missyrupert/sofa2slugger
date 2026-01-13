import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color _black = Color(0xFF0a0a0a);
  static const Color _surface = Color(0xFF1a1a1a);
  static const Color _sluggerRed = Color(0xFFB71C1C); // Blood Red
  static const Color _white = Color(0xFFFFFFFF);
  static const Color _grey = Color(0xFF888888);

  static ThemeData get light => dark; // Force dark mode

  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: _black,
      colorScheme: const ColorScheme.dark(
        primary: _sluggerRed,
        secondary: _white,
        surface: _surface,
        background: _black,
        onBackground: _white,
        onSurface: _white,
      ),
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme,
      ).apply(
        bodyColor: _white,
        displayColor: _white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: _black,
        elevation: 0,
        centerTitle: true,
      ),
      /* cardTheme removed due to type error */
      iconTheme: const IconThemeData(
        color: _white,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: _black,
        selectedItemColor: _sluggerRed,
        unselectedItemColor: _grey,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
    );
  }
}
