import 'package:flutter/material.dart';
import 'gen_theme.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({
    super.key,
    required this.mode,
    required this.product,
    required this.onNavigate,
  });
  final String mode;
  final String product;
  final ValueChanged<String> onNavigate;
  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final formKey = GlobalKey<FormState>();
  bool obscure = true;
  bool remember = true;
  bool complete = false;
  @override
  Widget build(BuildContext context) {
    final signup = widget.mode == 'signup';
    final recovery = widget.mode == 'recovery';
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: (constraints.maxHeight - 48).clamp(
                    0,
                    double.infinity,
                  ),
                ),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 400),
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Form(
                          key: formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Center(child: GenBrand(product: widget.product)),
                              const SizedBox(height: 24),
                              Text(
                                signup
                                    ? 'Creá tu espacio de trabajo'
                                    : recovery
                                    ? 'Recuperá tu contraseña'
                                    : 'Qué bueno verte de nuevo',
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                recovery
                                    ? 'Ingresá tu email y te ayudamos a volver.'
                                    : 'Todo lo que necesitás, en un mismo lugar.',
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 24),
                              if (signup) ...[
                                TextFormField(
                                  decoration: const InputDecoration(
                                    labelText: 'Nombre completo',
                                  ),
                                  autofillHints: const [AutofillHints.name],
                                  validator: requiredText,
                                ),
                                const SizedBox(height: 16),
                              ],
                              TextFormField(
                                decoration: const InputDecoration(
                                  labelText: 'Email',
                                  hintText: 'vos@empresa.com',
                                ),
                                keyboardType: TextInputType.emailAddress,
                                autofillHints: const [AutofillHints.email],
                                validator: validEmail,
                              ),
                              if (!recovery) ...[
                                const SizedBox(height: 16),
                                TextFormField(
                                  decoration: InputDecoration(
                                    labelText: 'Contraseña',
                                    helperText: signup
                                        ? 'Usá al menos 8 caracteres.'
                                        : null,
                                    suffixIcon: IconButton(
                                      tooltip: obscure
                                          ? 'Mostrar contraseña'
                                          : 'Ocultar contraseña',
                                      onPressed: () =>
                                          setState(() => obscure = !obscure),
                                      icon: Icon(
                                        obscure
                                            ? Icons.visibility_outlined
                                            : Icons.visibility_off_outlined,
                                      ),
                                    ),
                                  ),
                                  obscureText: obscure,
                                  autofillHints: [
                                    signup
                                        ? AutofillHints.newPassword
                                        : AutofillHints.password,
                                  ],
                                  validator: (value) =>
                                      requiredText(value) ??
                                      (signup && value!.length < 8
                                          ? 'Usá al menos 8 caracteres.'
                                          : null),
                                ),
                              ],
                              if (!signup && !recovery) ...[
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: TextButton(
                                    onPressed: () =>
                                        widget.onNavigate('recovery'),
                                    child: const Text('¿La olvidaste?'),
                                  ),
                                ),
                                CheckboxListTile(
                                  contentPadding: EdgeInsets.zero,
                                  controlAffinity:
                                      ListTileControlAffinity.leading,
                                  title: const Text(
                                    'Mantener la sesión iniciada',
                                    style: TextStyle(fontSize: 13),
                                  ),
                                  value: remember,
                                  onChanged: (value) =>
                                      setState(() => remember = value ?? false),
                                ),
                              ],
                              const SizedBox(height: 16),
                              FilledButton(
                                onPressed: () {
                                  if (formKey.currentState!.validate()) {
                                    setState(() => complete = true);
                                  }
                                },
                                child: Text(
                                  signup
                                      ? 'Crear cuenta'
                                      : recovery
                                      ? 'Enviar enlace'
                                      : 'Ingresar',
                                ),
                              ),
                              if (complete)
                                Padding(
                                  padding: const EdgeInsets.only(top: 16),
                                  child: Semantics(
                                    liveRegion: true,
                                    child: Text(
                                      recovery
                                          ? 'Solicitud simulada. No se envió ningún email.'
                                          : 'Formulario validado. El acceso es una demostración.',
                                    ),
                                  ),
                                ),
                              if (!signup && !recovery) ...[
                                const Padding(
                                  padding: EdgeInsets.symmetric(vertical: 16),
                                  child: Center(
                                    child: Text('o explorá primero'),
                                  ),
                                ),
                                OutlinedButton(
                                  onPressed: () =>
                                      widget.onNavigate('dashboard'),
                                  child: const Text('Entrar a la demo'),
                                ),
                              ],
                              const SizedBox(height: 16),
                              const Divider(),
                              Wrap(
                                alignment: WrapAlignment.center,
                                crossAxisAlignment: WrapCrossAlignment.center,
                                children: [
                                  Text(
                                    signup || recovery
                                        ? '¿Ya tenés cuenta?'
                                        : '¿Todavía no tenés cuenta?',
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                  TextButton(
                                    onPressed: () => widget.onNavigate(
                                      signup || recovery ? 'login' : 'signup',
                                    ),
                                    child: Text(
                                      signup || recovery
                                          ? 'Ingresar'
                                          : 'Crear cuenta',
                                    ),
                                  ),
                                ],
                              ),
                              const Text(
                                'Ejemplo interactivo · sin conexión a un servicio de acceso',
                                textAlign: TextAlign.center,
                                style: TextStyle(fontSize: 11),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
