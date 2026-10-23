import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/app_config_model.dart';

class ConfigSyncService {
  static const String _cacheKey = 'cached_app_config_json';
  static const String _cacheHashKey = 'cached_app_config_hash';
  static const String _defaultProjectId = 'app-demo-techmarket';
  static const String _defaultServerUrl = 'http://10.0.2.2:4000'; // Android emulator fallback

  /// Global synchronous reference to current active app configuration
  static AppConfigModel? currentConfig;

  /// Loads the local configuration from bundled asset or cache with smart cache invalidation
  static Future<AppConfigModel> loadInitialConfig() async {
    String? assetString;
    Map<String, dynamic>? bundledJson;

    // 1. Always load bundled asset as baseline for current APK binary
    try {
      assetString = await rootBundle.loadString('assets/config/app_config.json');
      bundledJson = jsonDecode(assetString) as Map<String, dynamic>;
      debugPrint('[ConfigSyncService] Bundled asset loaded successfully from APK.');
    } catch (e) {
      debugPrint('[ConfigSyncService] Error reading bundled asset: $e');
    }

    // 2. Validate against local persistent cache
    try {
      final prefs = await SharedPreferences.getInstance();
      final cachedJson = prefs.getString(_cacheKey);
      final cachedHash = prefs.getString(_cacheHashKey);

      if (assetString != null && bundledJson != null) {
        final currentAssetHash = assetString.hashCode.toString();

        // Invalidate stale cache if:
        // - No cache exists yet
        // - Or the newly installed APK has updated bundled assets (different hash)
        if (cachedJson == null || cachedHash != currentAssetHash) {
          debugPrint('[ConfigSyncService] Fresh APK install or newly compiled asset detected! Invalidate stale cache.');
          await prefs.setString(_cacheKey, assetString);
          await prefs.setString(_cacheHashKey, currentAssetHash);
          return AppConfigModel.fromJson(bundledJson);
        }

        // Cache is valid for this APK binary
        final decoded = jsonDecode(cachedJson) as Map<String, dynamic>;
        debugPrint('[ConfigSyncService] Loaded configuration from persistent offline cache.');
        final cfg = AppConfigModel.fromJson(decoded);
        currentConfig = cfg;
        return cfg;
      }
    } catch (e) {
      debugPrint('[ConfigSyncService] Error validating cache: $e');
    }

    if (bundledJson != null) {
      final cfg = AppConfigModel.fromJson(bundledJson);
      currentConfig = cfg;
      return cfg;
    }

    throw Exception('Failed to load any app configuration.');
  }

  /// Fetches latest Server-Driven UI configuration from remote API and updates local cache
  static Future<AppConfigModel?> syncRemoteConfig({
    String? projectId,
    String? serverUrl,
  }) async {
    final targetProject = (projectId != null && projectId.isNotEmpty) ? projectId : _defaultProjectId;
    final targetHost = serverUrl ?? (kIsWeb ? 'http://localhost:4000' : _defaultServerUrl);
    final endpoint = Uri.parse('$targetHost/api/projects/$targetProject/config');

    try {
      debugPrint('[ConfigSyncService] Fetching live config from: $endpoint');
      final response = await http.get(endpoint).timeout(const Duration(seconds: 3));

      if (response.statusCode == 200) {
        final body = response.body;
        final decoded = jsonDecode(body) as Map<String, dynamic>;
        final newConfig = AppConfigModel.fromJson(decoded);

        // Cache response locally for offline operation
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_cacheKey, body);
        await prefs.setString(_cacheHashKey, body.hashCode.toString());
        currentConfig = newConfig;
        debugPrint('[ConfigSyncService] Remote configuration synced and cached successfully.');
        return newConfig;
      }
    } catch (e) {
      debugPrint('[ConfigSyncService] Remote sync skipped or offline: $e');
    }

    return null;
  }
}
