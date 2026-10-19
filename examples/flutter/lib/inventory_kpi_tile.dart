// Ejemplo de la biblioteca. Referencias: docs/catalog-sources.md.
import 'package:flutter/material.dart';

import 'inventory_tokens.dart';
import 'inventory_colors.dart';

/// Tarjeta de un indicador numérico del dashboard (Vendido / Pendiente /
/// Recibido, y equivalentes). El valor usa RobotoMono con figuras
/// tabulares — evita que el ancho salte al actualizarse (INV: number-tabular).
class KpiTile extends StatelessWidget {
  const KpiTile({
    super.key,
    required this.label,
    required this.value,
    this.caption,
    this.shrinkValueToFit = false,
  });

  final String label;
  final String value;
  final String? caption;

  /// Si el valor se ACHICA hasta entrar en vez de recortarse con puntos
  /// suspensivos.
  ///
  /// Apagado por default a propósito: los sectores que ya usaban este tile
  /// muestran saldos cortos y no tienen por qué cambiar de aspecto. Lo
  /// prende Finanzas, donde el valor es la plata de un cierre de caja y ya no
  /// queda ancho de dónde sacar —los tiles se apilan y ocupan la pantalla
  /// entera—: en un teléfono de 390 puntos con la letra al doble
  /// `$ 154.300,00` pide 349 y tiene 324, así que se leía `$ 154.300,…`. Un
  /// importe a medias es peor que no mostrarlo: el dueño lo lee mal y cierra
  /// mal la caja.
  final bool shrinkValueToFit;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      // Es una card —bloque de contenido apoyado en la página—, así que curva
      // de card y nada de sombra: si cada tile del dashboard proyectara, la
      // grilla entera flotaría y no destacaría ninguno.
      decoration: BoxDecoration(
        border: Border.all(color: c.border),
        color: c.surfaceElevated,
        borderRadius: AppGeometry.card,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        // Altura del contenido, no del contenedor: sin esto, un grid con
        // aspect-ratio fijo estiraba el tile y el valor flotaba en el vacío.
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AppTextStyles.sectionLabel.copyWith(color: c.textSecondary),
          ),
          const SizedBox(height: AppSpacing.xs),
          _KpiValue(
            value: value,
            shrinkToFit: shrinkValueToFit,
            // Montserrat con cifras tabulares, como los contadores de
            // Genwork: el monoespaciado era de dato técnico, no de importe.
            style: AppTextStyles.screenTitle.copyWith(
              color: c.textPrimary,
              fontFeatures: const [FontFeature.tabularFigures()],
            ),
          ),
          if (caption != null) ...[
            const SizedBox(height: AppSpacing.xxs),
            Text(
              caption!,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTextStyles.supporting.copyWith(color: c.textTertiary),
            ),
          ],
        ],
      ),
    );
  }
}

/// El número grande del tile.
///
/// Sin [shrinkToFit] es el de siempre: un renglón, y puntos suspensivos si no
/// entra. Con él, el texto se ACHICA hasta entrar entero.
///
/// El alto de la caja se fija con el que tendría el texto SIN achicar —medido
/// con un [TextPainter] sobre el mismo estilo y la misma escala de letra— y no
/// se deja a merced del `FittedBox`: al escalar, el `FittedBox` encoge también
/// el alto, y un tile de una fila que achicó su número quedaba más bajo que
/// sus vecinos con los bordes de abajo desalineados.
class _KpiValue extends StatelessWidget {
  const _KpiValue({
    required this.value,
    required this.style,
    required this.shrinkToFit,
  });

  final String value;
  final TextStyle style;
  final bool shrinkToFit;

  @override
  Widget build(BuildContext context) {
    if (!shrinkToFit) {
      return Text(
        value,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: style,
      );
    }

    final medidor = TextPainter(
      text: TextSpan(text: value, style: style),
      textDirection: Directionality.of(context),
      textScaler: MediaQuery.textScalerOf(context),
      maxLines: 1,
    )..layout();
    final alto = medidor.height;
    medidor.dispose();

    return SizedBox(
      height: alto,
      child: FittedBox(
        fit: BoxFit.scaleDown,
        alignment: Alignment.centerLeft,
        // Sin `overflow`: acá adentro el texto se mide con ancho infinito, así
        // que no hay nada que recortar — lo que sobra se resuelve escalando.
        child: Text(value, maxLines: 1, style: style),
      ),
    );
  }
}
