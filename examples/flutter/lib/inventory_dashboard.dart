// Ejemplo de la biblioteca. Referencias: docs/catalog-sources.md.
import 'package:flutter/material.dart';
import 'inventory_tokens.dart';
import 'inventory_colors.dart';
import 'inventory_mock_content.dart';
import 'inventory_kpi_tile.dart';
import 'inventory_status_chip.dart';
import 'inventory_inline_notice.dart';
import 'inventory_support.dart';

/// Sector de demostración; deshabilitado en la navegación del producto.
///
/// Sólo saludo + contenido de demostración: KPIs, stock bajo y últimas
/// ventas alimentados por `core/mock/mock_content.dart`. Qué muestra el
/// dashboard con datos reales sigue siendo una decisión postergada — esto
/// existe para ajustar el diseño, no para reflejar el negocio.
class InventoryDashboardBody extends StatelessWidget {
  const InventoryDashboardBody({super.key, this.showBackButton = false});

  final bool showBackButton;

  @override
  Widget build(BuildContext context) {
    const user = DemoUser(
      name: 'Usuario demo',
      username: 'demo',
      isOwner: true,
    );

    return SectorScaffold(
      title: 'Dashboard',
      showBackButton: showBackButton,
      wide: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Greeting(user: user),
          const SizedBox(height: AppSpacing.lg),
          const AppInlineNotice(
            message:
                'Datos de demostración — todavía no hay negocio conectado '
                'al servidor.',
          ),
          const SizedBox(height: AppSpacing.xl),
          const _KpiRow(),
          const SizedBox(height: AppSpacing.xl),
          // Los dos paneles comparten el ancho en desktop: apilados dejaban
          // vacía la mitad derecha de la pantalla.
          LayoutBuilder(
            builder: (context, constraints) {
              final profile = deviceProfileFromWidth(constraints.maxWidth);
              final useCards = profile == DeviceProfile.phone;

              final lowStock = _PanelSection(
                title: 'STOCK BAJO',
                child: _LowStockPanel(useCards: useCards),
              );
              final sales = _PanelSection(
                title: 'ÚLTIMAS VENTAS',
                child: _RecentSalesPanel(useCards: useCards),
              );

              if (profile != DeviceProfile.desktop) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    lowStock,
                    const SizedBox(height: AppSpacing.xl),
                    sales,
                  ],
                );
              }

              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: lowStock),
                  const SizedBox(width: AppSpacing.lg),
                  Expanded(child: sales),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _Greeting extends StatelessWidget {
  const _Greeting({required this.user});

  final DemoUser user;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Sólo el saludo: usuario/email ya viven en la tarjeta de usuario
        // del sidebar — repetirlos acá era ruido.
        Text(
          'Hola, ${user.name.isNotEmpty ? user.name : user.username}',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: AppTextStyles.stateTitle.copyWith(color: c.textPrimary),
        ),
        if (user.isOwner) ...[
          const SizedBox(height: AppSpacing.sm),
          StatusChip(
            label: 'OWNER',
            color: c.brandOnBackground,
            fill: c.brandFill,
          ),
        ],
      ],
    );
  }
}

/// Título de sección + su contenido, como una unidad reubicable (columna
/// propia en desktop, apilada en tablet/phone).
class _PanelSection extends StatelessWidget {
  const _PanelSection({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: AppTextStyles.sectionLabel.copyWith(
            color: context.colors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        child,
      ],
    );
  }
}

/// Fila de KPIs: 3 columnas en tablet/desktop, apilados en phone.
///
/// Altura intrínseca (la del contenido del [KpiTile]): un aspect-ratio fijo
/// producía tiles gigantes con el valor flotando en el vacío, y a ancho de
/// ventana mínimo arriesgaba overflow.
class _KpiRow extends StatelessWidget {
  const _KpiRow();

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final profile = deviceProfileFromWidth(constraints.maxWidth);

        if (profile == DeviceProfile.phone) {
          return Column(
            children: [
              for (final kpi in kMockDashboardKpis)
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.md),
                  child: SizedBox(
                    width: double.infinity,
                    child: KpiTile(
                      label: kpi.label,
                      value: kpi.value,
                      caption: kpi.caption,
                    ),
                  ),
                ),
            ],
          );
        }

        return IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              for (final (i, kpi) in kMockDashboardKpis.indexed) ...[
                if (i > 0) const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: KpiTile(
                    label: kpi.label,
                    value: kpi.value,
                    caption: kpi.caption,
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}

/// Panel de productos con stock bajo: tabla que llena su columna, cards en
/// phone. La decisión tabla/cards la toma el `LayoutBuilder` de arriba —
/// dentro de media pantalla este panel no puede auto-medirse.
class _LowStockPanel extends StatelessWidget {
  const _LowStockPanel({required this.useCards});

  final bool useCards;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;

    if (useCards) {
      return Column(
        children: kMockLowStockItems.map((item) {
          return Container(
            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
            padding: const EdgeInsets.all(AppSpacing.md),
            // La card se lee por superficie —`surfaceElevated` sube sobre el
            // suelo de la página—; el borde queda como hairline de apoyo.
            decoration: BoxDecoration(
              border: Border.all(color: c.border),
              color: c.surfaceElevated,
              borderRadius: AppGeometry.card,
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyles.itemTitle.copyWith(
                          color: c.textPrimary,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xxs),
                      Text(
                        '${item.sku} · ${item.quantity}',
                        style: AppTextStyles.technicalLabel.copyWith(
                          color: c.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                StockStatusChip(level: item.level),
              ],
            ),
          );
        }).toList(),
      );
    }

    return LayoutBuilder(
      builder: (context, box) {
        final spacing = dataTableSpacingFor(box.maxWidth);

        return Container(
          // Bloque de contenido: curva de card y recorte, para que el relleno
          // del encabezado no asome en escuadra por las esquinas.
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            border: Border.all(color: c.border),
            borderRadius: AppGeometry.card,
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: ConstrainedBox(
              constraints: BoxConstraints(minWidth: box.maxWidth),
              child: DataTable(
                border: TableBorder(
                  horizontalInside: BorderSide(color: c.border),
                  verticalInside: BorderSide(color: c.border),
                ),
                headingRowColor: WidgetStateProperty.all(c.surfaceElevated),
                dataRowMinHeight: 48,
                columnSpacing: spacing.columnSpacing,
                horizontalMargin: spacing.horizontalMargin,
                columns: const [
                  DataColumn(
                    label: Text('PRODUCTO'),
                    columnWidth: FlexColumnWidth(),
                  ),
                  DataColumn(
                    label: Text('SKU'),
                    columnWidth: IntrinsicColumnWidth(),
                  ),
                  DataColumn(
                    label: Text('CANTIDAD'),
                    columnWidth: IntrinsicColumnWidth(),
                  ),
                  DataColumn(
                    label: Text('ESTADO'),
                    columnWidth: IntrinsicColumnWidth(),
                  ),
                ],
                rows: kMockLowStockItems.map((item) {
                  return DataRow(
                    cells: [
                      DataCell(
                        Text(
                          item.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyles.itemTitle.copyWith(
                            color: c.textPrimary,
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          item.sku,
                          style: AppTextStyles.technicalLabel.copyWith(
                            color: c.textSecondary,
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          item.quantity,
                          style: AppTextStyles.body.copyWith(
                            color: c.textPrimary,
                          ),
                        ),
                      ),
                      DataCell(StockStatusChip(level: item.level)),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
        );
      },
    );
  }
}

/// Panel de últimas ventas: tabla que llena su columna, cards en phone.
class _RecentSalesPanel extends StatelessWidget {
  const _RecentSalesPanel({required this.useCards});

  final bool useCards;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;

    if (useCards) {
      return Column(
        children: kMockRecentSales.map((sale) {
          return Container(
            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
            padding: const EdgeInsets.all(AppSpacing.md),
            // La card se lee por superficie —`surfaceElevated` sube sobre el
            // suelo de la página—; el borde queda como hairline de apoyo.
            decoration: BoxDecoration(
              border: Border.all(color: c.border),
              color: c.surfaceElevated,
              borderRadius: AppGeometry.card,
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        sale.customer,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyles.itemTitle.copyWith(
                          color: c.textPrimary,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xxs),
                      Text(
                        sale.date,
                        style: AppTextStyles.technicalLabel.copyWith(
                          color: c.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      sale.amount,
                      style: AppTextStyles.body.copyWith(color: c.textPrimary),
                    ),
                    const SizedBox(height: AppSpacing.xxs),
                    StatusChip(
                      label: sale.paid ? 'Pagado' : 'Pendiente',
                      color: sale.paid ? c.statusEnabled : c.statusPending,
                      fill: sale.paid
                          ? c.statusEnabledFill
                          : c.statusPendingFill,
                    ),
                  ],
                ),
              ],
            ),
          );
        }).toList(),
      );
    }

    return LayoutBuilder(
      builder: (context, box) {
        final spacing = dataTableSpacingFor(box.maxWidth);

        return Container(
          // Bloque de contenido: curva de card y recorte, para que el relleno
          // del encabezado no asome en escuadra por las esquinas.
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            border: Border.all(color: c.border),
            borderRadius: AppGeometry.card,
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: ConstrainedBox(
              constraints: BoxConstraints(minWidth: box.maxWidth),
              child: DataTable(
                border: TableBorder(
                  horizontalInside: BorderSide(color: c.border),
                  verticalInside: BorderSide(color: c.border),
                ),
                headingRowColor: WidgetStateProperty.all(c.surfaceElevated),
                dataRowMinHeight: 48,
                columnSpacing: spacing.columnSpacing,
                horizontalMargin: spacing.horizontalMargin,
                columns: const [
                  DataColumn(
                    label: Text('CLIENTE'),
                    columnWidth: FlexColumnWidth(),
                  ),
                  DataColumn(
                    label: Text('FECHA'),
                    columnWidth: IntrinsicColumnWidth(),
                  ),
                  DataColumn(
                    label: Text('IMPORTE'),
                    columnWidth: IntrinsicColumnWidth(),
                  ),
                  DataColumn(
                    label: Text('ESTADO'),
                    columnWidth: IntrinsicColumnWidth(),
                  ),
                ],
                rows: kMockRecentSales.map((sale) {
                  return DataRow(
                    cells: [
                      DataCell(
                        Text(
                          sale.customer,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyles.itemTitle.copyWith(
                            color: c.textPrimary,
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          sale.date,
                          style: AppTextStyles.technicalLabel.copyWith(
                            color: c.textSecondary,
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          sale.amount,
                          style: AppTextStyles.body.copyWith(
                            color: c.textPrimary,
                          ),
                        ),
                      ),
                      DataCell(
                        StatusChip(
                          label: sale.paid ? 'Pagado' : 'Pendiente',
                          color: sale.paid ? c.statusEnabled : c.statusPending,
                          fill: sale.paid
                              ? c.statusEnabledFill
                              : c.statusPendingFill,
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
        );
      },
    );
  }
}
