import 'dart:convert';
import 'package:http/http.dart' as http;

class WooCommerceProduct {
  final String id;
  final String name;
  final String slug;
  final String description;
  final double price;
  final double? regularPrice;
  final int? discountPercent;
  final String imageUrl;
  final List<String> galleryImages;
  final bool inStock;
  final double rating;
  final int reviewsCount;
  final List<String> categories;

  WooCommerceProduct({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    required this.price,
    this.regularPrice,
    this.discountPercent,
    required this.imageUrl,
    required this.galleryImages,
    required this.inStock,
    required this.rating,
    required this.reviewsCount,
    required this.categories,
  });

  factory WooCommerceProduct.fromJson(Map<String, dynamic> json) {
    final imagesList = (json['images'] as List<dynamic>? ?? []);
    final primaryImg = imagesList.isNotEmpty ? imagesList.first['src'] ?? '' : '';
    final allImages = imagesList.map((img) => img['src'] as String? ?? '').where((s) => s.isNotEmpty).toList();

    final priceNum = double.tryParse(json['price']?.toString() ?? '0') ?? 0.0;
    final regularPriceNum = double.tryParse(json['regular_price']?.toString() ?? '');

    int? discount;
    if (regularPriceNum != null && regularPriceNum > priceNum && priceNum > 0) {
      discount = (((regularPriceNum - priceNum) / regularPriceNum) * 100).round();
    }

    final catList = (json['categories'] as List<dynamic>? ?? [])
        .map((c) => c['name'] as String? ?? '')
        .toList();

    return WooCommerceProduct(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      description: (json['description'] ?? '').replaceAll(RegExp(r'<[^>]*>'), ''),
      price: priceNum,
      regularPrice: regularPriceNum,
      discountPercent: discount,
      imageUrl: primaryImg,
      galleryImages: allImages,
      inStock: json['stock_status'] == 'instock',
      rating: double.tryParse(json['average_rating']?.toString() ?? '5.0') ?? 5.0,
      reviewsCount: int.tryParse(json['rating_count']?.toString() ?? '0') ?? 0,
      categories: catList,
    );
  }
}

class WooCommerceService {
  final String siteUrl;
  final String? consumerKey;
  final String? consumerSecret;

  WooCommerceService({
    required this.siteUrl,
    this.consumerKey,
    this.consumerSecret,
  });

  String get _authHeader {
    if (consumerKey != null && consumerSecret != null) {
      final credentials = '$consumerKey:$consumerSecret';
      return 'Basic ${base64Encode(utf8.encode(credentials))}';
    }
    return '';
  }

  /// Fetches products from WooCommerce REST API v3
  Future<List<WooCommerceProduct>> getProducts({
    int page = 1,
    int perPage = 20,
    String? categoryId,
    String? search,
    bool? onSale,
    bool? featured,
    String orderBy = 'date',
    String order = 'desc',
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'per_page': perPage.toString(),
      'orderby': orderBy,
      'order': order,
    };

    if (categoryId != null && categoryId.isNotEmpty) {
      queryParams['category'] = categoryId;
    }
    if (search != null && search.isNotEmpty) {
      queryParams['search'] = search;
    }
    if (onSale == true) {
      queryParams['on_sale'] = 'true';
    }
    if (featured == true) {
      queryParams['featured'] = 'true';
    }

    final uri = Uri.parse('$siteUrl/wp-json/wc/v3/products').replace(queryParameters: queryParams);

    try {
      final headers = <String, String>{'Content-Type': 'application/json'};
      if (_authHeader.isNotEmpty) {
        headers['Authorization'] = _authHeader;
      }

      final response = await http.get(uri, headers: headers).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = jsonDecode(response.body);
        return jsonList.map((item) => WooCommerceProduct.fromJson(item)).toList();
      } else {
        return [];
      }
    } catch (_) {
      // In case of timeout or offline, return empty list gracefully
      return [];
    }
  }

  /// Validates a coupon code with WooCommerce API
  Future<Map<String, dynamic>?> validateCoupon(String code) async {
    final uri = Uri.parse('$siteUrl/wp-json/wc/v3/coupons').replace(queryParameters: {'code': code});
    try {
      final response = await http.get(uri, headers: {
        'Content-Type': 'application/json',
        if (_authHeader.isNotEmpty) 'Authorization': _authHeader,
      }).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final List<dynamic> list = jsonDecode(response.body);
        if (list.isNotEmpty) {
          final coupon = list.first;
          return {
            'code': coupon['code'],
            'amount': double.tryParse(coupon['amount']?.toString() ?? '0') ?? 0.0,
            'discountType': coupon['discount_type'], // percent or fixed_cart
          };
        }
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  /// Creates an order in WooCommerce
  Future<Map<String, dynamic>> createOrder({
    required Map<String, dynamic> billingInfo,
    required List<Map<String, dynamic>> lineItems,
    required String paymentMethod,
    String? couponCode,
    int? customerId,
  }) async {
    final uri = Uri.parse('$siteUrl/wp-json/wc/v3/orders');
    final body = {
      if (customerId != null && customerId > 0) 'customer_id': customerId,
      'payment_method': paymentMethod,
      'payment_method_title': paymentMethod == 'zarinpal' ? 'درگاه زرین‌پال' : 'پرداخت آنلاین',
      'set_paid': false,
      'billing': billingInfo,
      'shipping': billingInfo,
      'line_items': lineItems,
      if (couponCode != null) 'coupon_lines': [{'code': couponCode}],
    };

    try {
      final response = await http.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          if (_authHeader.isNotEmpty) 'Authorization': _authHeader,
        },
        body: jsonEncode(body),
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to create order: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error during order creation: $e');
    }
  }
}
