// Ejemplo de la biblioteca. Referencias: docs/catalog-sources.md.
import 'package:flutter/foundation.dart';

/// Un KPI del dashboard.
@immutable
class MockKpi {
  const MockKpi({
    required this.label,
    required this.value,
    required this.caption,
  });

  final String label;
  final String value;
  final String caption;
}

/// El trío que define el README para Finanzas: Vendido / Pendiente / Recibido.
const List<MockKpi> kMockDashboardKpis = [
  MockKpi(label: 'VENDIDO', value: r'$482.300', caption: 'Últimos 30 días'),
  MockKpi(label: 'PENDIENTE', value: r'$96.150', caption: 'Por cobrar'),
  MockKpi(
    label: 'RECIBIDO',
    value: r'$386.150',
    caption: 'Cobrado en el período',
  ),
];

/// Un producto con stock bajo, para el panel del dashboard.
@immutable
class MockLowStockItem {
  const MockLowStockItem({
    required this.name,
    required this.sku,
    required this.quantity,
    required this.level,
  });

  final String name;
  final String sku;
  final String quantity;

  /// 'low' | 'out' — nivel para `StockStatusChip`.
  final String level;
}

const List<MockLowStockItem> kMockLowStockItems = [
  MockLowStockItem(
    name: 'Producto de demostración A',
    sku: 'SKU-1001',
    quantity: '3 un.',
    level: 'low',
  ),
  MockLowStockItem(
    name: 'Producto de demostración B',
    sku: 'SKU-1002',
    quantity: '0 un.',
    level: 'out',
  ),
  MockLowStockItem(
    name: 'Producto de demostración C',
    sku: 'SKU-1003',
    quantity: '5 un.',
    level: 'low',
  ),
  MockLowStockItem(
    name: 'Producto de demostración D',
    sku: 'SKU-1004',
    quantity: '1 un.',
    level: 'low',
  ),
];

/// Una venta reciente, para el panel del dashboard.
@immutable
class MockSale {
  const MockSale({
    required this.customer,
    required this.date,
    required this.amount,
    required this.paid,
  });

  final String customer;
  final String date;
  final String amount;
  final bool paid;
}

const List<MockSale> kMockRecentSales = [
  MockSale(
    customer: 'Cliente de demostración 1',
    date: '01/08/2026',
    amount: r'$18.400',
    paid: true,
  ),
  MockSale(
    customer: 'Cliente de demostración 2',
    date: '01/08/2026',
    amount: r'$6.200',
    paid: false,
  ),
  MockSale(
    customer: 'Cliente de demostración 3',
    date: '31/07/2026',
    amount: r'$32.900',
    paid: true,
  ),
  MockSale(
    customer: 'Cliente de demostración 4',
    date: '31/07/2026',
    amount: r'$4.100',
    paid: false,
  ),
  MockSale(
    customer: 'Cliente de demostración 5',
    date: '30/07/2026',
    amount: r'$21.750',
    paid: true,
  ),
];
