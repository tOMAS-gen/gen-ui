import 'package:flutter/material.dart';
import 'inventory_dashboard.dart';

/// Ejemplo de inventario y ventas con datos de demostración.
class InventoryDashboardExample extends StatelessWidget {
  const InventoryDashboardExample({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: SafeArea(
      child: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: InventoryDashboardBody(),
      ),
    ),
  );
}
