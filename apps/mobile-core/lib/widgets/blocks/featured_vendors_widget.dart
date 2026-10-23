import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../screens/vendor_profile_screen.dart';

class FeaturedVendorsWidget extends StatefulWidget {
  final Map<String, dynamic> data;

  const FeaturedVendorsWidget({super.key, required this.data});

  @override
  State<FeaturedVendorsWidget> createState() => _FeaturedVendorsWidgetState();
}

class _FeaturedVendorsWidgetState extends State<FeaturedVendorsWidget> {
  bool _isLoading = true;
  List<Map<String, dynamic>> _vendors = [];

  @override
  void initState() {
    super.initState();
    _fetchVendors();
  }

  Future<void> _fetchVendors() async {
    final projectId = widget.data['projectId']?.toString() ?? 'app-demo-techmarket';
    try {
      final res = await http.get(Uri.parse('http://localhost:4000/api/projects/$projectId/vendors'));
      if (res.statusCode == 200 && mounted) {
        final data = jsonDecode(res.body);
        if (data['success'] == true) {
          final list = (data['vendors'] as List<dynamic>? ?? []).cast<Map<String, dynamic>>();
          setState(() {
            _vendors = list;
            _isLoading = false;
          });
          return;
        }
      }
    } catch (_) {}

    if (mounted) {
      setState(() {
        _isLoading = false;
        _vendors = [
          {
            'id': 'v1',
            'storeName': 'بازرگانی شیائومی سنتر پایتخت',
            'rating': 4.9,
            'productsCount': 54,
            'isVerified': true,
            'logoUrl': 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&h=150&fit=crop',
          },
          {
            'id': 'v2',
            'storeName': 'می استور اصفهان (اسمارت هوم)',
            'rating': 4.8,
            'productsCount': 42,
            'isVerified': true,
            'logoUrl': 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&h=150&fit=crop',
          },
          {
            'id': 'v3',
            'storeName': 'دیجی‌می نمایندگی رسمی تبریز',
            'rating': 4.7,
            'productsCount': 31,
            'isVerified': true,
            'logoUrl': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop',
          },
        ];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.data['title']?.toString() ?? 'فروشندگان و غرفه‌های برگزیده (دکان)';
    final subtitle = widget.data['subtitle']?.toString() ?? 'خرید مستقیم از واردکنندگان تاییدشده';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF97316).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.storefront_rounded, color: Color(0xFFEA580C), size: 16),
                      ),
                      const SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              fontFamily: 'Kalameh',
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF111827),
                            ),
                          ),
                          Text(
                            subtitle,
                            style: const TextStyle(
                              fontFamily: 'Kalameh',
                              fontSize: 9,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const Text(
                    'مشاهده همه ←',
                    style: TextStyle(
                      fontFamily: 'Kalameh',
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2563EB),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Horizontal Carousel
            SizedBox(
              height: 120,
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
                  : ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      itemCount: _vendors.length,
                      itemBuilder: (ctx, idx) {
                        final v = _vendors[idx];
                        final storeName = v['storeName'] ?? 'فروشگاه';
                        final logo = v['logoUrl'] ?? 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&h=150&fit=crop';
                        final rating = (v['rating'] as num?)?.toDouble() ?? 4.8;
                        final count = v['productsCount'] ?? 20;

                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => VendorProfileScreen(
                                  vendorId: v['id']?.toString() ?? 'v1',
                                  storeName: storeName,
                                  logoUrl: logo,
                                  rating: rating,
                                  isVerified: v['isVerified'] == true,
                                ),
                              ),
                            );
                          },
                          child: Container(
                            width: 175,
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFFE5E7EB)),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.03),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(10),
                                      child: Image.network(
                                        logo,
                                        width: 38,
                                        height: 38,
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Expanded(
                                                child: Text(
                                                  storeName,
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: const TextStyle(
                                                    fontFamily: 'Kalameh',
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.bold,
                                                    color: Color(0xFF111827),
                                                  ),
                                                ),
                                              ),
                                              const Icon(Icons.verified, color: Color(0xFF2563EB), size: 12),
                                            ],
                                          ),
                                          const SizedBox(height: 2),
                                          Row(
                                            children: [
                                              const Icon(Icons.star_rounded, color: Color(0xFFFBBF24), size: 12),
                                              const SizedBox(width: 2),
                                              Text(
                                                '$rating ★',
                                                style: const TextStyle(fontFamily: 'Kalameh', fontSize: 9, fontWeight: FontWeight.bold),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.symmetric(vertical: 3),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF3F4F6),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    '$count کالا آماده ارسال',
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(
                                      fontFamily: 'Kalameh',
                                      fontSize: 8.5,
                                      color: Color(0xFF4B5563),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
