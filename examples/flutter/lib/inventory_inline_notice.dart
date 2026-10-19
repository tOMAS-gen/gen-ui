// Ejemplo de la biblioteca. Referencias: docs/catalog-sources.md.
import 'package:flutter/material.dart';

import 'inventory_tokens.dart';
import 'inventory_colors.dart';
import 'inventory_color_contrast.dart';

/// Tonos semánticos del aviso inline compartido.
enum AppInlineNoticeTone { info, success, warning, error }

/// Aviso compartido para mensajes de varias líneas.
///
/// Es un bloque INLINE: se inserta en el flujo de la pantalla, así que lleva
/// la curva de bloque de contenido ([AppGeometry.card]) y **no** lleva sombra
/// —no flota sobre nada, está apoyado donde lo pusieron—.
///
/// Los errores de operación lo usan en escritorio; los estados informativos
/// de espera/bloqueo reutilizan la misma geometría. La clasificación campo vs.
/// operación sigue perteneciendo a cada pantalla (C-7): este widget sólo
/// unifica tipografía, espaciado, radio, borde e iconografía (FR-009).
class AppInlineNotice extends StatelessWidget {
  const AppInlineNotice({
    super.key,
    required this.message,
    this.tone = AppInlineNoticeTone.info,
    this.icon,
  });

  const AppInlineNotice.error({super.key, required this.message})
    : tone = AppInlineNoticeTone.error,
      icon = null;

  const AppInlineNotice.warning({super.key, required this.message})
    : tone = AppInlineNoticeTone.warning,
      icon = null;

  final String message;
  final AppInlineNoticeTone tone;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final palette = _palette(colors, tone);
    final effectiveBackground = appColorOver(
      palette.fill,
      colors.surfaceElevated,
    );
    final textColor = appForegroundWithContrast(
      preferred: palette.accent,
      background: effectiveBackground,
      fallback: colors.textPrimary,
      minimumRatio: 4.5,
    );

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: palette.fill,
        border: Border.all(color: palette.accent),
        borderRadius: AppGeometry.card,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon ?? palette.icon,
            size: AppIconSizes.notice,
            color: palette.accent,
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              message,
              softWrap: true,
              style: AppTextStyles.notice.copyWith(color: textColor),
            ),
          ),
        ],
      ),
    );
  }
}

class _NoticePalette {
  const _NoticePalette({
    required this.accent,
    required this.fill,
    required this.icon,
  });

  final Color accent;
  final Color fill;
  final IconData icon;
}

_NoticePalette _palette(InventoryColors colors, AppInlineNoticeTone tone) {
  return switch (tone) {
    AppInlineNoticeTone.info => _NoticePalette(
      accent: colors.statusInfo,
      fill: colors.statusInfoFill,
      icon: Icons.info_outline,
    ),
    AppInlineNoticeTone.success => _NoticePalette(
      accent: colors.statusEnabled,
      fill: colors.statusEnabledFill,
      icon: AppIcons.success,
    ),
    AppInlineNoticeTone.warning => _NoticePalette(
      accent: colors.statusPending,
      fill: colors.statusPendingFill,
      icon: AppIcons.pending,
    ),
    AppInlineNoticeTone.error => _NoticePalette(
      accent: colors.statusBlocked,
      fill: colors.statusBlockedFill,
      icon: AppIcons.error,
    ),
  };
}
