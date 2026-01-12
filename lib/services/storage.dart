import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static late SharedPreferences _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Entitlement
  static bool get isPremium => _prefs.getBool('isPremium') ?? false;
  static Future<void> setPremium(bool value) => _prefs.setBool('isPremium', value);
  
  // Progress (Placeholder)
  static int get completedSessions => _prefs.getInt('completedSessions') ?? 0;
  static Future<void> setCompletedSessions(int value) => _prefs.setInt('completedSessions', value);
}
