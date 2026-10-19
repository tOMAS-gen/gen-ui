// Ejemplo de la biblioteca. Referencias: docs/catalog-sources.md.
import 'package:flutter/material.dart';

import 'inventory_tokens.dart';
import 'inventory_colors.dart';
import 'inventory_color_contrast.dart';

/// Chip de estado con color semántico.
/// Usa los tokens `fill` del design system para el fondo translúcido.
class StatusChip extends StatelessWidget {
  const StatusChip({
    super.key,
    required this.label,
    required this.color,
    required this.fill,
    this.uppercase = false,
  });

  final String label;
  final Color color;
  final Color fill;
  final bool uppercase;

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final effectiveBackground = appColorOver(fill, colors.surfaceElevated);
    final effectiveAccent = appForegroundWithContrast(
      preferred: color,
      background: effectiveBackground,
      fallback: colors.textSecondary,
      minimumRatio: 3,
    );
    final textColor = appForegroundWithContrast(
      preferred: effectiveAccent,
      background: effectiveBackground,
      fallback: colors.textPrimary,
      minimumRatio: 4.5,
    );

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: effectiveBackground,
        borderRadius: AppGeometry.chip,
      ),
      child: Text(
        uppercase ? label.toUpperCase() : label,
        maxLines: 1,
        softWrap: false,
        overflow: TextOverflow.ellipsis,
        style: AppTextStyles.chip.copyWith(color: textColor),
      ),
    );
  }
}

/// Chip para estado de dispositivo.
class DeviceStatusChip extends StatelessWidget {
  const DeviceStatusChip({super.key, required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final (label, color, fill) = switch (status) {
      'enabled' => ('Habilitado', c.statusEnabled, c.statusEnabledFill),
      'pending' => ('Pendiente', c.statusPending, c.statusPendingFill),
      'blocked' => ('Bloqueado', c.statusBlocked, c.statusBlockedFill),
      _ => (status, c.statusInactive, c.statusInactiveFill),
    };
    return StatusChip(label: label, color: color, fill: fill);
  }
}

/// Chip para estado de usuario activo/inactivo.
class UserStatusChip extends StatelessWidget {
  const UserStatusChip({super.key, required this.isActive});

  final bool isActive;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return StatusChip(
      label: isActive ? 'Activo' : 'Inactivo',
      color: isActive ? c.statusEnabled : c.statusInactive,
      fill: isActive ? c.statusEnabledFill : c.statusInactiveFill,
    );
  }
}

/// Chip para nivel de stock.
class StockStatusChip extends StatelessWidget {
  const StockStatusChip({super.key, required this.level});

  /// 'ok' | 'low' | 'out'
  final String level;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final (label, color, fill) = switch (level) {
      'ok' => ('En stock', c.statusEnabled, c.statusEnabledFill),
      'low' => ('Stock bajo', c.statusLow, c.statusLowFill),
      'out' => ('Sin stock', c.statusBlocked, c.statusBlockedFill),
      _ => (level, c.statusInactive, c.statusInactiveFill),
    };
    return StatusChip(label: label, color: color, fill: fill);
  }
}

/// Chip para estado de un pedido a proveedor (docs/funcionamiento/
/// proveedores/pedidos.md): borrador → enviado → parcial → recibido, con
/// cancelado alcanzable desde borrador y enviado.
class SupplierOrderStatusChip extends StatelessWidget {
  const SupplierOrderStatusChip({super.key, required this.status});

  /// 'borrador' | 'enviado' | 'parcial' | 'recibido' | 'cancelado'
  ///
  /// Llega como texto y no como enum porque el chip vive en shared y no
  /// conoce el dominio de Proveedores — por eso el fallback del final: un
  /// estado que no se entienda se muestra crudo en vez de romper.
  final String status;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final (label, color, fill) = switch (status) {
      'borrador' => ('Borrador', c.statusInactive, c.statusInactiveFill),
      'enviado' => ('Enviado', c.statusInfo, c.statusInfoFill),
      // Parcial es un estado de espera, no de logro: llegó algo pero el
      // pedido sigue abierto.
      'parcial' => ('Recibido parcial', c.statusPending, c.statusPendingFill),
      'recibido' => ('Recibido', c.statusEnabled, c.statusEnabledFill),
      'cancelado' => ('Cancelado', c.statusBlocked, c.statusBlockedFill),
      _ => (status, c.statusInactive, c.statusInactiveFill),
    };
    return StatusChip(label: label, color: color, fill: fill);
  }
}

/// Chip informativo genérico (sync, carga, info).
class InfoChip extends StatelessWidget {
  const InfoChip({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return StatusChip(
      label: label,
      color: c.statusInfo,
      fill: c.statusInfoFill,
    );
  }
}
