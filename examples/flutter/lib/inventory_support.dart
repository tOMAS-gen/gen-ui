import 'package:flutter/material.dart';
import 'inventory_tokens.dart';

// Adaptadores del catálogo: reemplazan sesión y shell, no el contenido del sector.
class DemoUser {
  const DemoUser({
    required this.name,
    required this.username,
    required this.isOwner,
  });
  final String name;
  final String username;
  final bool isOwner;
}

enum DeviceProfile { phone, tablet, desktop }

DeviceProfile deviceProfileFromWidth(double width) => width < 600
    ? DeviceProfile.phone
    : width < 1024
    ? DeviceProfile.tablet
    : DeviceProfile.desktop;

class DataTableSpacing {
  const DataTableSpacing({
    required this.columnSpacing,
    required this.horizontalMargin,
  });
  final double columnSpacing;
  final double horizontalMargin;
}

DataTableSpacing dataTableSpacingFor(double width) => DataTableSpacing(
  columnSpacing: width < 1024 ? 16 : 32,
  horizontalMargin: 16,
);

class SectorScaffold extends StatelessWidget {
  const SectorScaffold({
    super.key,
    required this.title,
    required this.child,
    this.showBackButton = false,
    this.wide = false,
  });
  final String title;
  final Widget child;
  final bool showBackButton;
  final bool wide;
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      Text(title, style: AppTextStyles.screenTitle),
      const SizedBox(height: AppSpacing.lg),
      child,
    ],
  );
}
