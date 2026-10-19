import 'package:flutter/material.dart';
import 'gen_theme.dart';
import 'widgets.dart';

class ClientsScreen extends StatefulWidget {
  const ClientsScreen({super.key});
  @override
  State<ClientsScreen> createState() => _ClientsScreenState();
}

class _ClientsScreenState extends State<ClientsScreen> {
  final search = TextEditingController();
  String status = '';
  final clients = <({String name, String email, String status})>[
    (name: 'Estudio Norte', email: 'hola@norte.example', status: 'Activo'),
    (
      name: 'Almacén Central',
      email: 'equipo@central.example',
      status: 'Activo',
    ),
    (name: 'Taller Sur', email: 'contacto@sur.example', status: 'Pendiente'),
    (name: 'Casa Oliva', email: 'hola@oliva.example', status: 'Activo'),
  ];
  @override
  void dispose() {
    search.dispose();
    super.dispose();
  }

  Future<void> addClient() async {
    final client = await showDialog<({String name, String email})>(
      context: context,
      builder: (_) => const NewClientDialog(),
    );
    if (client == null || !mounted) return;
    setState(() {
      clients.add((name: client.name, email: client.email, status: 'Activo'));
      search.clear();
      status = '';
    });
  }

  @override
  Widget build(BuildContext context) {
    final visible = clients
        .where(
          (client) =>
              '${client.name} ${client.email}'.toLowerCase().contains(
                search.text.toLowerCase(),
              ) &&
              (status.isEmpty || client.status == status),
        )
        .toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SectionTitle(
          'Clientes',
          'Las personas y empresas con las que trabajás.',
        ),
        TextField(
          controller: search,
          onChanged: (_) => setState(() {}),
          decoration: const InputDecoration(
            labelText: 'Buscar clientes',
            prefixIcon: Icon(Icons.search),
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            DropdownMenu<String>(
              label: const Text('Estado'),
              initialSelection: status,
              key: ValueKey(status),
              onSelected: (value) => setState(() => status = value ?? ''),
              dropdownMenuEntries: const [
                DropdownMenuEntry(value: '', label: 'Todos los estados'),
                DropdownMenuEntry(value: 'Activo', label: 'Activos'),
                DropdownMenuEntry(value: 'Pendiente', label: 'Pendientes'),
              ],
            ),
            FilledButton(
              onPressed: addClient,
              child: const Text('Nuevo cliente'),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Semantics(liveRegion: true, child: Text('${visible.length} clientes')),
        const SizedBox(height: 12),
        Card(
          child: visible.isEmpty
              ? Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      const Text('No encontramos clientes'),
                      TextButton(
                        onPressed: () => setState(() {
                          search.clear();
                          status = '';
                        }),
                        child: const Text('Limpiar filtros'),
                      ),
                    ],
                  ),
                )
              : Column(
                  children: [
                    for (final client in visible)
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Wrap(
                            spacing: 24,
                            runSpacing: 8,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    client.name,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  Text(
                                    client.email,
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ],
                              ),
                              StatusLabel(client.status),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
        ),
      ],
    );
  }
}

class NewClientDialog extends StatefulWidget {
  const NewClientDialog({super.key});
  @override
  State<NewClientDialog> createState() => _NewClientDialogState();
}

class _NewClientDialogState extends State<NewClientDialog> {
  final form = GlobalKey<FormState>();
  String name = '';
  String email = '';
  @override
  Widget build(BuildContext context) => AlertDialog(
    title: const Text('Nuevo cliente'),
    content: SingleChildScrollView(
      child: Form(
        key: form,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Se agregará sólo a esta demostración.'),
            const SizedBox(height: 16),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Nombre'),
              validator: requiredText,
              onSaved: (value) => name = value!.trim(),
            ),
            const SizedBox(height: 16),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
              validator: validEmail,
              onSaved: (value) => email = value!.trim(),
            ),
          ],
        ),
      ),
    ),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: const Text('Cancelar'),
      ),
      FilledButton(
        onPressed: () {
          if (form.currentState!.validate()) {
            form.currentState!.save();
            Navigator.pop(context, (name: name, email: email));
          }
        },
        child: const Text('Agregar cliente'),
      ),
    ],
  );
}
