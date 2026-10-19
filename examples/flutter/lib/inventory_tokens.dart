// Ejemplo de la biblioteca. Referencias: docs/catalog-sources.md.
import 'package:flutter/material.dart';

abstract final class AppTextStyles {
  static const screenEyebrow = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 10,
    fontWeight: FontWeight.w700,
    letterSpacing: 3,
    height: 1.2,
  );

  // 28 → 24: con `body` en 14, un título de 28 abría un hueco que ningún
  // nivel intermedio llenaba. A 24 la escala se cierra y el título sigue
  // mandando.
  static const screenTitle = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: FontWeight.w700,
    height: 1.2,
    letterSpacing: -0.2,
  );

  static const stateTitle = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 15,
    fontWeight: FontWeight.w600,
    height: 1.25,
  );

  static const dialogTitle = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: FontWeight.w700,
    height: 1.25,
  );

  // itemTitle/body subidos un punto (12→13 / 13→14): a densidad de
  // escritorio la escala anterior se leía en miniatura (auditoría UI/UX
  // 08-2026).
  //
  // 13/w700 → 14/w600 (auditoría 08-2026, rama de diseño): el contraste
  // contra `body` pasa a darlo el PESO y no el tamaño. Con seis roles
  // apretados entre 10 y 14 px, seguir separándolos por tamaño ya no
  // alcanzaba —a 100% en un monitor de escritorio se leían todos igual—, y
  // w700 sobre un título de fila era más peso del que un nombre de producto
  // necesita.
  static const itemTitle = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: FontWeight.w600,
    height: 1.35,
  );

  static const body = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: FontWeight.w400,
    height: 1.6,
  );

  static const supporting = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.5,
  );

  /// Rótulo de sección y encabezado de columna. **Se queda en mayúscula**:
  /// rotula, no acciona, y la caja alta es lo que lo separa del dato que
  /// encabeza. El tracking baja de 2 a 1.2 —suficiente para que la mayúscula
  /// respire, sin el aire de titular de los 2 puntos.
  static const sectionLabel = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.48,
    height: 1.2,
  );

  /// Rótulo de botón.
  ///
  /// Antes: 11px, w800, `letterSpacing: 2` y el texto en mayúscula desde cada
  /// pantalla ("CREAR PRODUCTO", "GUARDAR CAMBIOS"). Esa combinación es
  /// tipografía de botón de Material 1 (2014) y es el detalle que más
  /// envejecía la interfaz.
  ///
  /// Ahora 13/w600 sin tracking, y el texto va en **sentence case** desde el
  /// llamador ("Crear producto"). Un rótulo de acción tiene que leerse de un
  /// vistazo, no deletrearse.
  static const action = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: FontWeight.w600,
    letterSpacing: 0,
    height: 1.2,
  );

  /// Chip de estado. 10→11px: a 10 el estado de una fila era ilegible sin
  /// acercarse, y era el dato que más rápido hay que poder barrer.
  static const chip = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: FontWeight.w400,
    letterSpacing: 0,
    height: 1.5,
  );

  static const notice = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.5,
  );

  static const fieldLabel = TextStyle(
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: FontWeight.w600,
    height: 1.25,
  );

  static const technicalInput = TextStyle(
    fontFamily: 'RobotoMono',
    fontSize: 13,
    fontWeight: FontWeight.w400,
    height: 1.4,
  );

  static const technicalCode = TextStyle(
    fontFamily: 'RobotoMono',
    fontSize: 18,
    fontWeight: FontWeight.w500,
    height: 1.2,
  );

  static const technicalLabel = TextStyle(
    fontFamily: 'RobotoMono',
    fontSize: 11,
    fontWeight: FontWeight.w400,
    height: 1.35,
  );

  static const technicalCompact = TextStyle(
    fontFamily: 'RobotoMono',
    fontSize: 10,
    fontWeight: FontWeight.w400,
    height: 1.3,
  );
}

abstract final class AppSpacing {
  static const xxs = 4.0;
  static const xs = 8.0;
  static const sm = 12.0;
  static const md = 16.0;
  static const ml = 20.0;
  static const lg = 24.0;
  static const xl = 32.0;
  static const xxl = 40.0;
  static const xxxl = 48.0;
}

abstract final class AppGeometry {
  /// Checkbox. Su caja mide 18 px: con la curva de [chip] se leería casi
  /// redonda y un checkbox redondo se confunde con un radio button.
  static const checkbox = BorderRadius.all(Radius.circular(2));

  /// Chip de estado, tooltip, badge de filtro.
  static const chip = BorderRadius.all(Radius.circular(4));

  /// Botón, campo de texto, checkbox, item de navegación.
  static const control = BorderRadius.all(Radius.circular(6));

  /// Card, header de tabla, bloque de contenido, panel.
  static const card = BorderRadius.all(Radius.circular(8));

  /// Lo que flota por encima de la página: diálogo, menú, popup, drawer.
  static const overlay = BorderRadius.all(Radius.circular(12));

  /// Hoja anclada al pie: curva discreta arriba y esquinas inferiores rectas.
  static const sheet = BorderRadius.only(
    topLeft: Radius.circular(6),
    topRight: Radius.circular(6),
  );

  /// Sólo para lo que es circular por naturaleza: badge numérico, avatar,
  /// indicador de progreso. No es un estilo de botón.
  static const pill = BorderRadius.all(Radius.circular(999));

  /// Menú de la barra de ventana (escritorio): recto, sin curva, como el menú
  /// de un programa de escritorio. Queda fuera de la escala igual que [pill]:
  /// la escala prohíbe volver a 0 en las piezas de la interfaz, y ésta es la
  /// excepción deliberada — en esa franja fina de 32 px, el realce y el
  /// desplegable curvos se leían como botones sueltos y no como un menú
  /// (pedido del dueño, 1.16.0-beta.3).
  static const windowMenu = BorderRadius.zero;

  /// Sin elevación de Material. La profundidad la dan la superficie y, en lo
  /// que flota, [AppShadows] — no el `elevation` de M3, que además tiñe la
  /// superficie con el color primario.
  static const elevation = 0.0;

  /// Grosor del anillo de foco. Fuera del botón, no en lugar de su borde: no
  /// altera la métrica del control al recibir foco.
  static const focusRingWidth = 2.0;
}

// Iconografía del aviso inline original.
abstract final class AppIconSizes {
  static const notice = 16.0;
}

abstract final class AppIcons {
  static const error = Icons.error_outline;
  static const success = Icons.check_circle_outline;
  static const pending = Icons.schedule_rounded;
}
