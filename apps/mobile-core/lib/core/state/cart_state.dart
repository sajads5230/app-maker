import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CartItem {
  final String id;
  final String title;
  final String imageUrl;
  final double price;
  final double? regularPrice;
  int quantity;

  CartItem({
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.price,
    this.regularPrice,
    this.quantity = 1,
  });

  double get totalPrice => price * quantity;

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'imageUrl': imageUrl,
        'price': price,
        'regularPrice': regularPrice,
        'quantity': quantity,
      };

  factory CartItem.fromJson(Map<String, dynamic> json) => CartItem(
        id: json['id'] as String,
        title: json['title'] as String,
        imageUrl: json['imageUrl'] as String,
        price: (json['price'] as num).toDouble(),
        regularPrice: (json['regularPrice'] as num?)?.toDouble(),
        quantity: json['quantity'] as int? ?? 1,
      );
}

class CartState extends ChangeNotifier {
  static final CartState _instance = CartState._internal();
  factory CartState() => _instance;
  CartState._internal() {
    loadPersistedCart();
  }

  static const String _storageKey = 'offline_cart_items_cache';

  final Map<String, CartItem> _items = {
    'prod_1': CartItem(
      id: 'prod_1',
      title: 'هدفون بی‌سیم سونی مدل WH-1000XM5',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      price: 18450000,
      regularPrice: 21500000,
      quantity: 1,
    ),
    'prod_3': CartItem(
      id: 'prod_3',
      title: 'ماوس بی‌سیم لاجیتک مدل MX Master 3S',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      price: 6200000,
      regularPrice: 7200000,
      quantity: 1,
    ),
  };

  double _discountAmount = 0.0;
  String? _appliedCouponCode;
  double _shippingCost = 45000.0;

  List<CartItem> get items => _items.values.toList();
  int get totalItemCount => _items.values.fold(0, (sum, i) => sum + i.quantity);

  double get subtotal => _items.values.fold(0.0, (sum, i) => sum + i.totalPrice);
  double get discountAmount => _discountAmount;
  String? get appliedCouponCode => _appliedCouponCode;
  double get shippingCost => subtotal >= 600000 ? 0.0 : _shippingCost;
  double get finalTotal => (subtotal - _discountAmount + shippingCost).clamp(0.0, double.infinity);

  /// Loads cart items from offline local storage
  Future<void> loadPersistedCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedJson = prefs.getString(_storageKey);
      if (savedJson != null && savedJson.trim().isNotEmpty) {
        final List<dynamic> list = jsonDecode(savedJson);
        _items.clear();
        for (final item in list) {
          final cartItem = CartItem.fromJson(item as Map<String, dynamic>);
          _items[cartItem.id] = cartItem;
        }
        notifyListeners();
        debugPrint('[CartState] Loaded ${_items.length} item(s) from persistent local storage.');
      }
    } catch (e) {
      debugPrint('[CartState] Could not load persisted cart: $e');
    }
  }

  Future<void> _persistCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = _items.values.map((i) => i.toJson()).toList();
      await prefs.setString(_storageKey, jsonEncode(list));
    } catch (_) {}
  }

  void addItem({
    required String id,
    required String title,
    required String imageUrl,
    required double price,
    double? regularPrice,
  }) {
    if (_items.containsKey(id)) {
      _items[id]!.quantity += 1;
    } else {
      _items[id] = CartItem(
        id: id,
        title: title,
        imageUrl: imageUrl,
        price: price,
        regularPrice: regularPrice,
        quantity: 1,
      );
    }
    notifyListeners();
    _persistCart();
  }

  void incrementQuantity(String id) {
    if (_items.containsKey(id)) {
      _items[id]!.quantity += 1;
      notifyListeners();
      _persistCart();
    }
  }

  void decrementQuantity(String id) {
    if (_items.containsKey(id)) {
      if (_items[id]!.quantity > 1) {
        _items[id]!.quantity -= 1;
      } else {
        _items.remove(id);
      }
      notifyListeners();
      _persistCart();
    }
  }

  void removeItem(String id) {
    _items.remove(id);
    notifyListeners();
    _persistCart();
  }

  void clear() {
    _items.clear();
    _discountAmount = 0.0;
    _appliedCouponCode = null;
    notifyListeners();
    _persistCart();
  }

  bool applyCoupon(String code) {
    if (code.trim().toUpperCase() == 'OFF20') {
      _appliedCouponCode = 'OFF20';
      _discountAmount = subtotal * 0.20;
      notifyListeners();
      return true;
    } else if (code.trim().toUpperCase() == 'YALDA') {
      _appliedCouponCode = 'YALDA';
      _discountAmount = 100000.0;
      notifyListeners();
      return true;
    }
    return false;
  }

  void removeCoupon() {
    _appliedCouponCode = null;
    _discountAmount = 0.0;
    notifyListeners();
  }

  void setShippingCost(double cost) {
    _shippingCost = cost;
    notifyListeners();
  }
}
