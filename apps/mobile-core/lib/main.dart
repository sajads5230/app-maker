import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'core/models/app_config_model.dart';
import 'core/services/config_sync_service.dart';
import 'core/theme/app_theme.dart';
import 'screens/main_shell.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Load initial configuration (Offline cache -> Bundled asset)
  final AppConfigModel initialConfig = await ConfigSyncService.loadInitialConfig();

  runApp(AppMakerClient(initialConfig: initialConfig));
}

class AppMakerClient extends StatefulWidget {
  final AppConfigModel initialConfig;

  const AppMakerClient({super.key, required this.initialConfig});

  @override
  State<AppMakerClient> createState() => _AppMakerClientState();
}

class _AppMakerClientState extends State<AppMakerClient> {
  late AppConfigModel _config;

  @override
  void initState() {
    super.initState();
    _config = widget.initialConfig;

    // 2. Fetch live remote updates in background
    _syncLiveConfig();
  }

  Future<void> _syncLiveConfig() async {
    final targetProjectId = _config.metadata.id.isNotEmpty
        ? _config.metadata.id
        : (_config.metadata.packageName.isNotEmpty ? _config.metadata.packageName : 'app-demo-techmarket');

    final updatedConfig = await ConfigSyncService.syncRemoteConfig(
      projectId: targetProjectId,
    );
    if (updatedConfig != null && mounted) {
      setState(() {
        _config = updatedConfig;
      });
      debugPrint('[AppMakerClient] UI updated with fresh live Server-Driven config.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: _config.metadata.name,
      debugShowCheckedModeBanner: false,
      theme: AppThemeBuilder.buildTheme(_config.theme),
      locale: const Locale('fa', 'IR'),
      supportedLocales: const [
        Locale('fa', 'IR'),
        Locale('en', 'US'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: MainShellScreen(config: _config),
    );
  }
}
