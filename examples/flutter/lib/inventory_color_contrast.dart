// Ejemplo de la biblioteca. Referencias: docs/catalog-sources.md.
import 'package:flutter/material.dart';

/// Relación de contraste WCAG entre dos colores opacos.
double appContrastRatio(Color foreground, Color background) {
  final foregroundLuminance = foreground.computeLuminance();
  final backgroundLuminance = background.computeLuminance();
  final lighter = foregroundLuminance > backgroundLuminance
      ? foregroundLuminance
      : backgroundLuminance;
  final darker = foregroundLuminance > backgroundLuminance
      ? backgroundLuminance
      : foregroundLuminance;
  return (lighter + 0.05) / (darker + 0.05);
}

/// Resuelve un color translúcido contra la superficie que lo contiene.
Color appColorOver(Color foreground, Color background) =>
    Color.alphaBlend(foreground, background);

/// Conserva el acento cuando alcanza el contraste pedido y usa el fallback
/// semántico del tema cuando no llega.
Color appForegroundWithContrast({
  required Color preferred,
  required Color background,
  required Color fallback,
  required double minimumRatio,
}) => appContrastRatio(preferred, background) >= minimumRatio
    ? preferred
    : fallback;
