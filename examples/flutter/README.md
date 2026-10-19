# ›gen · Pantallas Flutter

Ejemplos ejecutables de login, registro, recuperación de contraseña, dashboard, clientes y configuración.
Requiere Flutter 3.44+ / Dart 3.12.2+. No depende de paquetes de interfaz externos.

```bash
flutter pub get
flutter run -d chrome
flutter analyze
flutter test
```

El tema `gen_theme.dart` usa el naranja `#F97316` de UI y comparte radios y tipografía con `@gen/ui`.
Montserrat y Roboto Mono se incluyen en `assets/fonts/` bajo la licencia OFL que acompaña al archivo.

La URL permite elegir `screen=login|signup|recovery|inventory-dashboard|records|settings`,
`theme=light|dark`.

Desde la raíz del repositorio, `npm run build:flutter` compila esta aplicación y copia el resultado al
catálogo. Volvé a ejecutar ese comando tras editar Dart para actualizar la vista previa.

Para reutilizar los ejemplos, copiá `lib/` y `assets/fonts/` en tu proyecto, junto con la declaración de
fuentes de `pubspec.yaml`. `GenExamplesApp` sirve como punto de entrada de demostración; también podés
integrar cada pantalla y `genTheme()` en tu navegación existente.

El proyecto incluye el destino web. Los widgets usan Flutter Material y pueden integrarse en proyectos
Android/iOS existentes; no se ha configurado ni probado un build nativo en este repositorio.

Las acciones son simuladas, con estado efímero. Conectá validación de servidor, autenticación,
persistencia y permisos en la aplicación que consuma estas pantallas.

El ejemplo Inventario y ventas adapta widgets existentes a la identidad general de UI.
La sesión y los datos son de demostración. Ver [procedencia técnica](../../docs/catalog-sources.md).
