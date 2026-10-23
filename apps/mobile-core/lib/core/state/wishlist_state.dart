import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class WishlistItem {
  final String id;
  final String title;
  final String imageUrl;
  final double price;
  final double? regularPrice;
  final bool inStock;

  WishlistItem({
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.price,
    this.regularPrice,
    this.inStock = true,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'imageUrl': imageUrl,
        'price': price,
        'regularPrice': regularPrice,
        'inStock': inStock,
      };

  factory WishlistItem.fromJson(Map<String, dynamic> json) => WishlistItem(
        id: json['id'] as String,
        title: json['title'] as String,
        imageUrl: json['imageUrl'] as String,
        price: (json['price'] as num).toDouble(),
        regularPrice: (json['regularPrice'] as num?)?.toDouble(),
        inStock: json['inStock'] as bool? ?? true,
      );
}

class WishlistState extends ChangeNotifier {
  static final WishlistState _instance = WishlistState._internal();
  factory WishlistState() => _instance;

  WishlistState._internal() {
    loadPersistedWishlist();
  }

  static const String _storageKey = 'app_wishlist_items_cache';

  final Map<String, WishlistItem> _items = {
    'p_10160': WishlistItem(
      id: 'p_10160',
      title: 'ماشین لباسشویی 14 کیلوگرمی، سه مخزن PRO شیائومی MIJIA مدل XHQG140MJ202',
      imageUrl: 'https://xiaomismart.ir/wp-content/uploads/2026/08/mijia-washing.jpg',
      price: 18450000,
      regularPrice: 21000000,
    ),
    'p_10051': WishlistItem(
      id: 'p_10051',
      title: 'جارو رباتیک 5 شیائومی MI مدل PV31CN',
      imageUrl: 'https://xiaomismart.ir/wp-content/uploads/2026/08/robot-vacuum.jpg',
      price: 24500000,
      regularPrice: 28000000,
    ),
  };

  List<WishlistItem> get items => _items.values.toList();
  int get count => _items.length;

  bool isFavorite(String id) {
    return _items.containsKey(id) || _items.containsKey('p_$id');
  }

  void toggleFavorite(WishlistItem item) {
    if (isFavorite(item.id)) {
      removeItem(item.id);
      removeItem('p_${item.id}');
    } else {
      addItem(item);
    }
  }

  void addItem(WishlistItem item) {
    _items[item.id] = item;
    _persistWishlist();
    notifyListeners();
  }

  void removeItem(String id) {
    _items.remove(id);
    _items.remove('p_$id');
    _persistWishlist();
    notifyListeners();
  }

  void clear() {
    _items.clear();
    _persistWishlist();
    notifyListeners();
  }

  Future<void> _persistWishlist() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = _items.values.map((i) => i.toJson()).toList();
      await prefs.setString(_storageKey, jsonEncode(list));
    } catch (e) {
      debugPrint('[WishlistState] Error persisting wishlist: $e');
    }
  }

  Future<void> loadPersistedWishlist() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_storageKey);
      if (saved != null) {
        final decoded = jsonDecode(saved) as List<dynamic>;
        _items.clear();
        for (var itemJson in decoded) {
          final item = WishlistItem.fromJson(itemJson as Map<String, dynamic>);
          _items[item.id] = item;
        }
        notifyListeners();
      }
    } catch (e) {
      debugPrint('[WishlistState] Error loading wishlist: $e');
    }
  }
}
