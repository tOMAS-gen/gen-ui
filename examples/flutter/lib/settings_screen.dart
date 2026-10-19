import 'package:flutter/material.dart';
import 'gen_theme.dart';
import 'widgets.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final form = GlobalKey<FormState>();
  bool weekly = true;
  bool newClients = true;
  bool saved = false;
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const SectionTitle(
        'Configuración',
        'Tu perfil y las preferencias del espacio.',
      ),
      ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 640),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: form,
              onChanged: () {
                if (saved) setState(() => saved = false);
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Perfil del espacio',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    initialValue: 'Mi empresa',
                    decoration: const InputDecoration(
                      labelText: 'Nombre del espacio',
                    ),
                    validator: requiredText,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    initialValue: 'equipo@empresa.example',
                    decoration: const InputDecoration(
                      labelText: 'Email de contacto',
                    ),
                    keyboardType: TextInputType.emailAddress,
                    validator: validEmail,
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16),
                    child: Divider(),
                  ),
                  const Text(
                    'Notificaciones',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Resumen semanal'),
                    subtitle: const Text(
                      'La actividad de tu equipo cada lunes.',
                    ),
                    value: weekly,
                    onChanged: (value) => setState(() {
                      weekly = value;
                      saved = false;
                    }),
                  ),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Nuevos clientes'),
                    subtitle: const Text(
                      'Una notificación cuando se suma un cliente.',
                    ),
                    value: newClients,
                    onChanged: (value) => setState(() {
                      newClients = value;
                      saved = false;
                    }),
                  ),
                  const SizedBox(height: 16),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: FilledButton(
                      onPressed: () {
                        if (form.currentState!.validate()) {
                          setState(() => saved = true);
                        }
                      },
                      child: const Text('Guardar cambios'),
                    ),
                  ),
                  if (saved)
                    Padding(
                      padding: const EdgeInsets.only(top: 16),
                      child: Semantics(
                        liveRegion: true,
                        child: const Text(
                          'Cambios aplicados a la demo. Se restablecen al recargar.',
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    ],
  );
}
