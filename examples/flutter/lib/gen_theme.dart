import 'package:flutter/material.dart';
import 'inventory_colors.dart';

ThemeData genTheme({bool dark = false}) {
  const accent = Color(0xfff97316);
  final background = Color(dark ? 0xff0c0c0c : 0xfff4f5f8);
  final surface = Color(dark ? 0xff1c1c1c : 0xffffffff);
  final border = Color(dark ? 0xff272727 : 0xffd2d6de);
  final text = Color(dark ? 0xfff0f0f0 : 0xff111118);
  final scheme =
      ColorScheme.fromSeed(
        seedColor: accent,
        brightness: dark ? Brightness.dark : Brightness.light,
      ).copyWith(
        primary: accent,
        onPrimary: const Color(0xff171717),
        surface: surface,
        onSurface: text,
        surfaceContainerHighest: Color(dark ? 0xff151515 : 0xfff1f3f6),
        outline: border,
        error: Color(dark ? 0xfffb7185 : 0xffb4123c),
      );
  final controlShape = RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(6),
  );
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    extensions: [
      (dark ? InventoryColors.dark : InventoryColors.light).copyWith(
        brand: accent,
        brandOnBackground: Color(dark ? 0xfffb923c : 0xffc2410c),
        brandFill: accent.withValues(alpha: 0.12),
      ),
    ],
    fontFamily: 'Montserrat',
    scaffoldBackgroundColor: background,
    dividerColor: border,
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: surface,
      indicatorColor: accent.withValues(alpha: dark ? 0.18 : 0.10),
      surfaceTintColor: Colors.transparent,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: surface,
      foregroundColor: text,
      elevation: 0,
      scrolledUnderElevation: 0,
    ),
    cardTheme: CardThemeData(
      color: surface,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(color: border),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: scheme.surfaceContainerHighest,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(6),
        borderSide: BorderSide(color: border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(6),
        borderSide: BorderSide(color: border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(6),
        borderSide: BorderSide(color: accent, width: 2),
      ),
      contentPadding: const EdgeInsets.all(16),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(44, 48),
        shape: controlShape,
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: text,
        minimumSize: const Size(44, 48),
        shape: controlShape,
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: Color(dark ? 0xfffb923c : 0xffc2410c),
        shape: controlShape,
      ),
    ),
  );
}

class GenBrand extends StatelessWidget {
  const GenBrand({super.key, required this.product});
  final String product;
  @override
  Widget build(BuildContext context) => Text.rich(
    TextSpan(
      children: [
        TextSpan(
          text: '›gen',
          style: TextStyle(
            color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.w700,
          ),
        ),
        TextSpan(text: ' $product'),
      ],
    ),
    style: const TextStyle(fontSize: 24),
  );
}

String? requiredText(String? value) =>
    value == null || value.trim().isEmpty ? 'Completá este campo.' : null;
String? validEmail(String? value) =>
    RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(value?.trim() ?? '')
    ? null
    : 'Ingresá un email válido.';
