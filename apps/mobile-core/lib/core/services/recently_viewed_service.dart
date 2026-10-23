import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class RecentlyViewedService extends ChangeNotifier {
  static final RecentlyViewedService _instance = RecentlyViewedService._internal();
  factory RecentlyViewedService() => _instance;
  RecentlyViewedService._internal() {
    _loadFromPrefs();
  }

  static const String _storageKey = 'recently_viewed_products';
  final List<Map<String, dynamic>> _items = [];

  List<Map<String, dynamic>> get items => List.unmodifiable(_items);
  int get count => _items.length;

  Future<void> _loadFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_storageKey);
      if (raw != null && raw.isNotEmpty) {
        final List<dynamic> decoded = jsonDecode(raw);
        _items.clear();
        for (final item in decoded) {
          if (item is Map<String, dynamic>) {
            _items.add(Map<String, dynamic>.from(item));
          }
        }
        notifyListeners();
      }
    } catch (e) {
      debugPrint('RecentlyViewedService: Error loading items: $e');
    }
  }

  Future<void> addProduct(Map<String, dynamic> product) async {
    try {
      final prodId = (product['id'] ?? product['productId'] ?? '').toString();
      if (prodId.isEmpty) return;

      // Clean item snapshot to store
      final itemToStore = {
        'id': prodId,
        'title': (product['title'] ?? product['name'] ?? '').toString(),
        'imageUrl': (product['imageUrl'] ?? '').toString(),
        'price': (product['price'] as num?)?.toDouble() ?? 0.0,
        'regularPrice': (product['regularPrice'] as num?)?.toDouble(),
        'discountPercent': product['discountPercent'] ?? product['discount'],
        'inStock': product['inStock'] ?? true,
        'category': (product['category'] ?? '').toString(),
      };

      // Remove existing occurrence if any
      _items.removeWhere((i) => i['id']?.toString() == prodId);

      // Insert at the front (most recent)
      _items.insert(0, itemToStore);

      // Keep maximum 20 items
      if (_items.length > 20) {
        _items.removeRange(20, _items.length);
      }

      notifyListeners();

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_storageKey, jsonEncode(_items));
    } catch (e) {
      debugPrint('RecentlyViewedService: Error adding product: $e');
    }
  }

  Future<void> clear() async {
    _items.clear();
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_storageKey);
    } catch (_) {}
  }
}
