import 'package:flutter/material.dart';
import 'gen_theme.dart';
import 'inventory_dashboard.dart';
import 'clients_screen.dart';
import 'settings_screen.dart';

class WorkspaceScreen extends StatelessWidget {
  const WorkspaceScreen({
    super.key,
    required this.screen,
    required this.product,
    required this.onNavigate,
  });
  final String screen;
  final String product;
  final ValueChanged<String> onNavigate;
  static const destinations = [
    ('dashboard', 'Resumen', Icons.dashboard_outlined),
    ('records', 'Clientes', Icons.people_outline),
    ('settings', 'Configuración', Icons.settings_outlined),
  ];
  @override
  Widget build(BuildContext context) {
    final selected = destinations.indexWhere((item) => item.$1 == screen);
    final content = switch (screen) {
      'records' => const ClientsScreen(),
      'settings' => const SettingsScreen(),
      _ => const InventoryDashboardBody(),
    };
    return LayoutBuilder(
      builder: (context, constraints) {
        final wide = constraints.maxWidth >= 720;
        return Scaffold(
          appBar: AppBar(
            title: GenBrand(product: product),
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(1),
              child: Divider(height: 1, color: Theme.of(context).dividerColor),
            ),
          ),
          body: SafeArea(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (wide)
                  SizedBox(
                    width: 192,
                    child: Material(
                      color: Theme.of(context).colorScheme.surface,
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            const Padding(
                              padding: EdgeInsets.symmetric(
                                vertical: 16,
                                horizontal: 12,
                              ),
                              child: Text(
                                'MI ESPACIO',
                                style: TextStyle(
                                  fontSize: 11,
                                  letterSpacing: 1.2,
                                ),
                              ),
                            ),
                            for (final item in destinations)
                              ListTile(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                selected: item.$1 == screen,
                                title: Text(
                                  item.$2,
                                  style: const TextStyle(fontSize: 13),
                                ),
                                onTap: () => onNavigate(item.$1),
                              ),
                            const Spacer(),
                            const Padding(
                              padding: EdgeInsets.all(12),
                              child: Text(
                                'Datos de demostración',
                                style: TextStyle(fontSize: 11),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                Expanded(
                  child: SingleChildScrollView(
                    padding: EdgeInsets.all(wide ? 24 : 16),
                    child: content,
                  ),
                ),
              ],
            ),
          ),
          bottomNavigationBar: wide
              ? null
              : NavigationBar(
                  selectedIndex: selected < 0 ? 0 : selected,
                  onDestinationSelected: (index) =>
                      onNavigate(destinations[index].$1),
                  destinations: [
                    for (final item in destinations)
                      NavigationDestination(
                        icon: Icon(item.$3),
                        label: item.$2,
                      ),
                  ],
                ),
        );
      },
    );
  }
}
