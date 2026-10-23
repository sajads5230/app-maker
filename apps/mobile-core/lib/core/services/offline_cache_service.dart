import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OfflineCacheService extends ChangeNotifier {
  static final OfflineCacheService _instance = OfflineCacheService._internal();
  factory OfflineCacheService() => _instance;
  OfflineCacheService._internal();

  bool _isOfflineMode = false;
  bool get isOfflineMode => _isOfflineMode;

  DateTime? _lastSyncTime;
  DateTime? get lastSyncTime => _lastSyncTime;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final syncMillis = prefs.getInt('cache_last_sync_time');
    if (syncMillis != null) {
      _lastSyncTime = DateTime.fromMillisecondsSinceEpoch(syncMillis);
    }
  }

  void setOfflineMode(bool offline) {
    _isOfflineMode = offline;
    notifyListeners();
  }

  /// Saves products list in local cache for offline browsing
  Future<void> cacheProducts(String key, List<dynamic> productsJson) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('offline_cache_products_$key', jsonEncode(productsJson));
      _lastSyncTime = DateTime.now();
      await prefs.setInt('cache_last_sync_time', _lastSyncTime!.millisecondsSinceEpoch);
      notifyListeners();
    } catch (_) {}
  }

  /// Reads cached products when offline
  Future<List<dynamic>?> getCachedProducts(String key) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getString('offline_cache_products_$key');
      if (data != null && data.isNotEmpty) {
        return jsonDecode(data) as List<dynamic>;
      }
    } catch (_) {}
    return null;
  }

  /// Saves full server-driven UI config locally
  Future<void> cacheConfig(String configJson) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('offline_cache_app_config', configJson);
      _lastSyncTime = DateTime.now();
      await prefs.setInt('cache_last_sync_time', _lastSyncTime!.millisecondsSinceEpoch);
      notifyListeners();
    } catch (_) {}
  }

  /// Retrieves cached app config
  Future<String?> getCachedConfig() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('offline_cache_app_config');
  }
}
