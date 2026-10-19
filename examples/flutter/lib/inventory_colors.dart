// Ejemplo de la biblioteca. Referencias: docs/catalog-sources.md.
import 'package:flutter/material.dart';

/// Tokens de color semánticos del ejemplo de inventario.
/// Acceso rápido: `context.colors.tokenName`
@immutable
class InventoryColors extends ThemeExtension<InventoryColors> {
  const InventoryColors({
    // Text
    required this.textPrimary,
    required this.textSecondary,
    required this.textTertiary,
    required this.textHint,
    // Brand
    required this.brand,
    required this.brandOnBackground,
    // Status — text/icon color
    required this.statusEnabled,
    required this.statusPending,
    required this.statusBlocked,
    required this.statusInactive,
    required this.statusLow,
    required this.statusInfo,
    // Status — chip fill (translucent background for badges)
    required this.statusEnabledFill,
    required this.statusPendingFill,
    required this.statusBlockedFill,
    required this.statusInactiveFill,
    required this.statusLowFill,
    required this.statusInfoFill,
    // Surfaces
    required this.surfaceElevated,
    required this.surfaceFloating,
    required this.surfaceDrawer,
    required this.surfaceField,
    required this.surfaceHover,
    // Borders
    required this.border,
    required this.overlayHeader,
    required this.subtleBorder,
    required this.subtleBorderFaint,
    required this.subtleFill,
    required this.gridLine,
    // Brand fill (chip activo, selección)
    required this.brandFill,
    // Glow
    required this.pulseGlow,
    required this.pulseGlowStrong,
  });

  // ── Text hierarchy ──────────────────────────────────────
  final Color textPrimary;
  final Color textSecondary;
  final Color textTertiary;
  final Color textHint;

  // ── Brand ───────────────────────────────────────────────
  final Color brand;
  final Color brandOnBackground;

  // ── Semantic status (text/icon) ─────────────────────────
  final Color statusEnabled;
  final Color statusPending;
  final Color statusBlocked;
  final Color statusInactive;
  final Color statusLow;
  final Color statusInfo;

  // ── Semantic status (chip fill) ─────────────────────────
  final Color statusEnabledFill;
  final Color statusPendingFill;
  final Color statusBlockedFill;
  final Color statusInactiveFill;
  final Color statusLowFill;
  final Color statusInfoFill;

  // ── Surfaces ────────────────────────────────────────────
  //
  // Escalera de cuatro pasos con rol propio. Antes había dos —`elevated` y
  // `hover`— y `elevated` hacía de card y de diálogo a la vez: por eso un
  // modal se veía igual que una fila.
  //
  //   field    → pozo: relleno de campo, dentro de la card que lo contiene
  //   elevated → card, header de tabla, panel: sube sobre la página
  //   floating → diálogo, menú, popup: flota, y es lo único con sombra
  //   hover    → realce sobre `elevated`

  /// Card, header de tabla, panel de contenido.
  final Color surfaceElevated;

  /// Lo que flota sobre la página. Va siempre acompañado de
  /// `AppShadows.floatingOf(context)`.
  final Color surfaceFloating;

  /// Fondo propio del drawer, separado de los sectores y sus controles.
  final Color surfaceDrawer;

  /// Relleno de campo de texto y de chip: retrocede respecto de su contenedor.
  final Color surfaceField;

  final Color surfaceHover;

  // ── Borders & overlays ──────────────────────────────────
  final Color border;
  final Color overlayHeader;
  final Color subtleBorder;
  final Color subtleBorderFaint;
  final Color subtleFill;
  final Color gridLine;

  // ── Brand fill (chip activo, selección) ──────────────────
  final Color brandFill;

  // ── Animation glow ──────────────────────────────────────
  final Color pulseGlow;
  final Color pulseGlowStrong;

  // ── Dark instance ───────────────────────────────────────

  static const dark = InventoryColors(
    // Text — levemente cálido, evita white 100% para reducir fatiga
    textPrimary: Color(0xF0F0F0F5),
    textSecondary: Color(0xFF9595A0),
    // Valores mínimos que conservan el matiz y alcanzan AA sobre sus fondos.
    textTertiary: Color(0xFF83838F),
    textHint: Color(0xFF81818C),

    // Brand — identidad UI
    brand: Color(0xFFF97316),
    brandOnBackground: Color(0xFFF97316),

    // Status text/icon
    statusEnabled: Color(0xFF22C55E),
    statusPending: Color(0xFFF59E0B),
    statusBlocked: Color(0xFFEF4444),
    statusInactive: Color(0xFF83838C),
    statusLow: Color(0xFFF59E0B),
    statusInfo: Color(0xFF3B82F6),

    // Status chip fill (alpha sobre el fondo dark)
    statusEnabledFill: Color(0x1A22C55E),
    statusPendingFill: Color(0x1AF59E0B),
    statusBlockedFill: Color(0x1AEF4444),
    statusInactiveFill: Color(0x1452525B),
    statusLowFill: Color(0x1AF59E0B),
    statusInfoFill: Color(0x1A3B82F6),

    // Surfaces — near-black con profundidad. Los pasos se ensancharon: los
    // viejos #1A1A1F/#1C1C21 estaban a 2 puntos y eran indistinguibles.
    surfaceElevated: Color(0xFF1C1C22),
    surfaceFloating: Color(0xFF26262E),
    surfaceDrawer: Color(0xFF24242A),
    surfaceField: Color(0xFF141419),
    surfaceHover: Color(0xFF2C2C35),

    // Borders — hairline de apoyo, ya no la definición de la pieza
    border: Color(0xFF272730),
    overlayHeader: Color(0xCC0C0C0F),
    subtleBorder: Color(0x1AFFFFFF),
    // SÓLIDO y no una tinta translúcida. Como translúcido, este borde se
    // comportaba al revés en cada tema: blanco al 6% sobre el fondo casi
    // negro se fundía con el suelo y el bloque perdía canto; el mismo 6% en
    // negro sobre claro dibujaba una línea gris bien visible. Dos temas con
    // el mismo token y resultados opuestos. Ahora cada uno declara su color y
    // los dos marcan parecido contra el pozo del bloque (1,29 acá).
    subtleBorderFaint: Color(0xFF2A2A33),
    subtleFill: Color(0x0AFFFFFF),
    gridLine: Color(0x08FFFFFF),

    // Brand fill
    brandFill: Color(0x1EF97316),

    // Glow brand
    pulseGlow: Color(0x2613E28E),
    pulseGlowStrong: Color(0x4D13E28E),
  );

  // ── Light instance ───────────────────────────────────────

  static const light = InventoryColors(
    // Text — near-black, no true black
    textPrimary: Color(0xFF111118),
    textSecondary: Color(0xFF5C5C70),
    // Valores mínimos que conservan el matiz y alcanzan AA sobre sus fondos.
    textTertiary: Color(0xFF6C6C80),
    textHint: Color(0xFF6D6D7D),

    // Brand
    brand: Color(0xFFF97316),
    brandOnBackground: Color(
      0xFF08794B,
    ), // WCAG AA: 5.46:1 sobre blanco, 4.52:1 sobre el relleno de marca
    // Status text/icon
    statusEnabled: Color(0xFF157F3C),
    statusPending: Color(0xFFB25209),
    statusBlocked: Color(0xFFB91C1C),
    statusInactive: Color(0xFF52525B),
    statusLow: Color(0xFFB25209),
    statusInfo: Color(0xFF1D4ED8),

    // Status chip fill
    statusEnabledFill: Color(0x1A15803D),
    statusPendingFill: Color(0x1AB45309),
    statusBlockedFill: Color(0x1AB91C1C),
    statusInactiveFill: Color(0x1452525B),
    statusLowFill: Color(0x1AB45309),
    statusInfoFill: Color(0x1A1D4ED8),

    // Surfaces — el tema claro se invirtió: el suelo de la página es gris
    // (#F4F5F8) y las superficies de trabajo son blancas. Antes era al revés
    // y una card blanca sobre página blanca sólo se veía por su marco.
    surfaceElevated: Color(0xFFFFFFFF),
    surfaceFloating: Color(0xFFFFFFFF),
    surfaceDrawer: Color(0xFFE4E6EC),
    surfaceField: Color(0xFFF1F3F6),
    surfaceHover: Color(0xFFECEEF2),

    // Borders — hairline de apoyo, ya no la definición de la pieza.
    //
    // En claro el borde tira al BLANCO del bloque, no al gris del fondo: casi
    // no se distingue de la superficie que rodea (1,06 de contraste contra
    // ella) y apenas insinúa el canto contra el fondo. Lo que separa una
    // pieza de la otra es el cambio de superficie; la línea alrededor sólo
    // acompaña. Un borde marcado encerraba cada bloque en un recuadro y hacía
    // leer la pantalla como una grilla de cajas en vez de zonas de trabajo.
    // El canto que separa piezas grandes: el lateral del contenido, una
    // tarjeta de su fondo. En blanco puro no definía nada —el borde derecho
    // del drawer directamente no se veía— porque quedaba más claro que las
    // dos superficies que tenía que separar. Este valor reproduce en claro lo
    // que el borde hace en oscuro: 1,23 contra el lateral y 1,34 contra el
    // fondo, frente a 1,23 y 1,32 de aquel.
    border: Color(0xFFD2D6DE),
    overlayHeader: Color(0xF0FFFFFF),
    subtleBorder: Color(0x1A000000),
    // SÓLIDO, igual que en oscuro y por el mismo motivo (ver allá). Contra el
    // pozo del bloque marca 1,19: apenas por debajo del oscuro, que es lo que
    // hace que la MISMA separación se lea igual de ancha en los dos temas.
    subtleBorderFaint: Color(0xFFDDE0E6),
    subtleFill: Color(0x0A000000),
    gridLine: Color(0x0F000000),

    // Brand fill
    brandFill: Color(0x1EF97316),

    // Glow brand
    pulseGlow: Color(0x4013E28E),
    pulseGlowStrong: Color(0x6613E28E),
  );

  // ── ThemeExtension overrides ────────────────────────────

  @override
  InventoryColors copyWith({
    Color? textPrimary,
    Color? textSecondary,
    Color? textTertiary,
    Color? textHint,
    Color? brand,
    Color? brandOnBackground,
    Color? statusEnabled,
    Color? statusPending,
    Color? statusBlocked,
    Color? statusInactive,
    Color? statusLow,
    Color? statusInfo,
    Color? statusEnabledFill,
    Color? statusPendingFill,
    Color? statusBlockedFill,
    Color? statusInactiveFill,
    Color? statusLowFill,
    Color? statusInfoFill,
    Color? surfaceElevated,
    Color? surfaceFloating,
    Color? surfaceDrawer,
    Color? surfaceField,
    Color? surfaceHover,
    Color? border,
    Color? overlayHeader,
    Color? subtleBorder,
    Color? subtleBorderFaint,
    Color? subtleFill,
    Color? gridLine,
    Color? brandFill,
    Color? pulseGlow,
    Color? pulseGlowStrong,
  }) {
    return InventoryColors(
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      textTertiary: textTertiary ?? this.textTertiary,
      textHint: textHint ?? this.textHint,
      brand: brand ?? this.brand,
      brandOnBackground: brandOnBackground ?? this.brandOnBackground,
      statusEnabled: statusEnabled ?? this.statusEnabled,
      statusPending: statusPending ?? this.statusPending,
      statusBlocked: statusBlocked ?? this.statusBlocked,
      statusInactive: statusInactive ?? this.statusInactive,
      statusLow: statusLow ?? this.statusLow,
      statusInfo: statusInfo ?? this.statusInfo,
      statusEnabledFill: statusEnabledFill ?? this.statusEnabledFill,
      statusPendingFill: statusPendingFill ?? this.statusPendingFill,
      statusBlockedFill: statusBlockedFill ?? this.statusBlockedFill,
      statusInactiveFill: statusInactiveFill ?? this.statusInactiveFill,
      statusLowFill: statusLowFill ?? this.statusLowFill,
      statusInfoFill: statusInfoFill ?? this.statusInfoFill,
      surfaceElevated: surfaceElevated ?? this.surfaceElevated,
      surfaceFloating: surfaceFloating ?? this.surfaceFloating,
      surfaceDrawer: surfaceDrawer ?? this.surfaceDrawer,
      surfaceField: surfaceField ?? this.surfaceField,
      surfaceHover: surfaceHover ?? this.surfaceHover,
      border: border ?? this.border,
      overlayHeader: overlayHeader ?? this.overlayHeader,
      subtleBorder: subtleBorder ?? this.subtleBorder,
      subtleBorderFaint: subtleBorderFaint ?? this.subtleBorderFaint,
      subtleFill: subtleFill ?? this.subtleFill,
      gridLine: gridLine ?? this.gridLine,
      brandFill: brandFill ?? this.brandFill,
      pulseGlow: pulseGlow ?? this.pulseGlow,
      pulseGlowStrong: pulseGlowStrong ?? this.pulseGlowStrong,
    );
  }

  @override
  InventoryColors lerp(covariant InventoryColors? other, double t) {
    if (other is! InventoryColors) return this;
    return InventoryColors(
      textPrimary: Color.lerp(textPrimary, other.textPrimary, t)!,
      textSecondary: Color.lerp(textSecondary, other.textSecondary, t)!,
      textTertiary: Color.lerp(textTertiary, other.textTertiary, t)!,
      textHint: Color.lerp(textHint, other.textHint, t)!,
      brand: Color.lerp(brand, other.brand, t)!,
      brandOnBackground: Color.lerp(
        brandOnBackground,
        other.brandOnBackground,
        t,
      )!,
      statusEnabled: Color.lerp(statusEnabled, other.statusEnabled, t)!,
      statusPending: Color.lerp(statusPending, other.statusPending, t)!,
      statusBlocked: Color.lerp(statusBlocked, other.statusBlocked, t)!,
      statusInactive: Color.lerp(statusInactive, other.statusInactive, t)!,
      statusLow: Color.lerp(statusLow, other.statusLow, t)!,
      statusInfo: Color.lerp(statusInfo, other.statusInfo, t)!,
      statusEnabledFill: Color.lerp(
        statusEnabledFill,
        other.statusEnabledFill,
        t,
      )!,
      statusPendingFill: Color.lerp(
        statusPendingFill,
        other.statusPendingFill,
        t,
      )!,
      statusBlockedFill: Color.lerp(
        statusBlockedFill,
        other.statusBlockedFill,
        t,
      )!,
      statusInactiveFill: Color.lerp(
        statusInactiveFill,
        other.statusInactiveFill,
        t,
      )!,
      statusLowFill: Color.lerp(statusLowFill, other.statusLowFill, t)!,
      statusInfoFill: Color.lerp(statusInfoFill, other.statusInfoFill, t)!,
      surfaceElevated: Color.lerp(surfaceElevated, other.surfaceElevated, t)!,
      surfaceFloating: Color.lerp(surfaceFloating, other.surfaceFloating, t)!,
      surfaceDrawer: Color.lerp(surfaceDrawer, other.surfaceDrawer, t)!,
      surfaceField: Color.lerp(surfaceField, other.surfaceField, t)!,
      surfaceHover: Color.lerp(surfaceHover, other.surfaceHover, t)!,
      border: Color.lerp(border, other.border, t)!,
      overlayHeader: Color.lerp(overlayHeader, other.overlayHeader, t)!,
      subtleBorder: Color.lerp(subtleBorder, other.subtleBorder, t)!,
      subtleBorderFaint: Color.lerp(
        subtleBorderFaint,
        other.subtleBorderFaint,
        t,
      )!,
      subtleFill: Color.lerp(subtleFill, other.subtleFill, t)!,
      gridLine: Color.lerp(gridLine, other.gridLine, t)!,
      brandFill: Color.lerp(brandFill, other.brandFill, t)!,
      pulseGlow: Color.lerp(pulseGlow, other.pulseGlow, t)!,
      pulseGlowStrong: Color.lerp(pulseGlowStrong, other.pulseGlowStrong, t)!,
    );
  }
}

/// Acceso rápido: `context.colors.textPrimary`
extension InventoryColorsX on BuildContext {
  InventoryColors get colors => Theme.of(this).extension<InventoryColors>()!;
}
