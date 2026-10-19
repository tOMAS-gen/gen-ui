import 'package:flutter/material.dart';
import 'auth_screen.dart';
import 'workspace_screen.dart';
import 'gen_theme.dart';
import 'inventory_example.dart';

void main() {
  final params = Uri.base.queryParameters;
  runApp(
    GenExamplesApp(
      screen: params['screen'] ?? 'login',
      dark: params['theme'] == 'dark',
    ),
  );
}

class GenExamplesApp extends StatefulWidget {
  const GenExamplesApp({super.key, this.screen = 'login', this.dark = false});
  final String screen;
  final bool dark;
  @override
  State<GenExamplesApp> createState() => _GenExamplesAppState();
}

class _GenExamplesAppState extends State<GenExamplesApp> {
  late String screen = widget.screen;
  @override
  Widget build(BuildContext context) {
    void navigate(String next) => setState(() => screen = next);
    return MaterialApp(
      title: '›gen · Pantallas Flutter',
      debugShowCheckedModeBanner: false,
      theme: genTheme(dark: widget.dark),
      home: screen == 'inventory-dashboard' || screen == 'dashboard'
          ? const InventoryDashboardExample()
          : ['records', 'settings'].contains(screen)
          ? WorkspaceScreen(screen: screen, product: 'ui', onNavigate: navigate)
          : AuthScreen(
              key: ValueKey(screen),
              mode: screen,
              product: 'ui',
              onNavigate: navigate,
            ),
    );
  }
}
