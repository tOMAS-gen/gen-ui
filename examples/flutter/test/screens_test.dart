import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:gen_ui_examples/main.dart';

void main() {
  for (final width in [320.0, 1280.0]) {
    for (final screen in [
      'login',
      'signup',
      'recovery',
      'inventory-dashboard',
      'records',
      'settings',
    ]) {
      testWidgets('$screen se adapta a $width sin desbordes', (tester) async {
        tester.view.physicalSize = Size(width, 900);
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);
        await tester.pumpWidget(
          GenExamplesApp(screen: screen, dark: width == 320),
        );
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull);
        expect(find.byType(Scaffold), findsOneWidget);
        if (screen == 'inventory-dashboard') {
          expect(find.text('VENDIDO'), findsOneWidget);
          expect(find.text(r'$482.300'), findsOneWidget);
          expect(find.text('STOCK BAJO'), findsOneWidget);
          expect(find.text('ÚLTIMAS VENTAS'), findsOneWidget);
          expect(
            find.byType(DataTable),
            width == 320 ? findsNothing : findsNWidgets(2),
          );
        }
      });
    }
  }

  testWidgets('el acceso valida datos antes de confirmar la demo', (
    tester,
  ) async {
    await tester.pumpWidget(const GenExamplesApp());
    await tester.tap(find.widgetWithText(FilledButton, 'Ingresar'));
    await tester.pumpAndSettle();
    expect(find.text('Ingresá un email válido.'), findsOneWidget);
    expect(find.text('Completá este campo.'), findsOneWidget);
    await tester.enterText(
      find.byType(TextFormField).at(0),
      'demo@example.com',
    );
    await tester.enterText(find.byType(TextFormField).at(1), 'demostracion');
    await tester.ensureVisible(find.widgetWithText(FilledButton, 'Ingresar'));
    await tester.tap(find.widgetWithText(FilledButton, 'Ingresar'));
    await tester.pumpAndSettle();
    expect(
      find.text('Formulario validado. El acceso es una demostración.'),
      findsOneWidget,
    );
  });

  testWidgets('buscar, limpiar y agregar un cliente en la demo', (
    tester,
  ) async {
    await tester.pumpWidget(const GenExamplesApp(screen: 'records'));
    await tester.enterText(find.byType(TextField).first, 'inexistente');
    await tester.pumpAndSettle();
    expect(find.text('No encontramos clientes'), findsOneWidget);
    await tester.tap(find.text('Limpiar filtros'));
    await tester.pumpAndSettle();
    expect(find.text('4 clientes'), findsOneWidget);
    await tester.tap(find.text('Nuevo cliente'));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byType(TextFormField).at(0),
      'Cliente de prueba',
    );
    await tester.enterText(
      find.byType(TextFormField).at(1),
      'cliente@example.com',
    );
    await tester.tap(find.text('Agregar cliente'));
    await tester.pumpAndSettle();
    expect(find.text('5 clientes'), findsOneWidget);
    expect(find.text('Cliente de prueba'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
