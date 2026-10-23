import 'package:flutter/material.dart';
import '../models/app_config_model.dart';

class AppThemeBuilder {
  static ThemeData buildTheme(AppThemeModel themeModel) {
    const String fontFamily = 'Kalameh';

    final colorScheme = ColorScheme.light(
      primary: themeModel.primaryColor,
      secondary: themeModel.secondaryColor,
      surface: themeModel.surfaceColor,
      error: const Color(0xFFEF4444),
    );

    return ThemeData(
      useMaterial3: true,
      fontFamily: fontFamily,
      scaffoldBackgroundColor: themeModel.backgroundColor,
      colorScheme: colorScheme,
      appBarTheme: AppBarTheme(
        backgroundColor: themeModel.surfaceColor,
        foregroundColor: themeModel.textPrimaryColor,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: themeModel.textPrimaryColor,
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: themeModel.surfaceColor,
        selectedItemColor: themeModel.primaryColor,
        unselectedItemColor: themeModel.textSecondaryColor,
        selectedLabelStyle: const TextStyle(
          fontFamily: fontFamily,
          fontSize: 11,
          fontWeight: FontWeight.w700,
        ),
        unselectedLabelStyle: const TextStyle(
          fontFamily: fontFamily,
          fontSize: 11,
          fontWeight: FontWeight.w500,
        ),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      cardTheme: CardThemeData(
        color: themeModel.surfaceColor,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: Color(0xFFE5E7EB), width: 0.8),
        ),
      ),
      textTheme: TextTheme(
        headlineMedium: TextStyle(
          fontFamily: fontFamily,
          fontWeight: FontWeight.w800,
          color: themeModel.textPrimaryColor,
        ),
        titleMedium: TextStyle(
          fontFamily: fontFamily,
          fontWeight: FontWeight.w700,
          color: themeModel.textPrimaryColor,
        ),
        bodyMedium: TextStyle(
          fontFamily: fontFamily,
          fontWeight: FontWeight.w400,
          color: themeModel.textPrimaryColor,
        ),
        bodySmall: TextStyle(
          fontFamily: fontFamily,
          fontWeight: FontWeight.w400,
          color: themeModel.textSecondaryColor,
        ),
      ),
    );
  }
}
