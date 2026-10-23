import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart' hide TextDirection;
import 'product_detail_screen.dart';

class VendorProfileScreen extends StatefulWidget {
  final String vendorId;
  final String storeName;
  final String? logoUrl;
  final String? bannerUrl;
  final double rating;
  final bool isVerified;
  final String? address;
  final String? phone;

  const VendorProfileScreen({
    super.key,
    required this.vendorId,
    required this.storeName,
    this.logoUrl,
    this.bannerUrl,
    this.rating = 4.8,
    this.isVerified = true,
    this.address,
    this.phone,
  });

  @override
  State<VendorProfileScreen> createState() => _VendorProfileScreenState();
}

class _VendorProfileScreenState extends State<VendorProfileScreen> {
  final currencyFormat = NumberFormat('#,###');
  bool _isLoading = true;
  List<Map<String, dynamic>> _products = [];
  Map<String, dynamic>? _vendorData;

  @override
  void initState() {
    super.initState();
    _fetchVendorDetails();
  }

  Future<void> _fetchVendorDetails() async {
    try {
      final res = await http.get(
        Uri.parse('http://localhost:4000/api/projects/app-demo-techmarket/vendors/${widget.vendorId}'),
      );
      if (res.statusCode == 200 && mounted) {
        final data = jsonDecode(res.body);
        if (data['success'] == true) {
          final vendor = data['vendor'];
          final prods = (vendor['products'] as List<dynamic>? ?? []).cast<Map<String, dynamic>>();
          setState(() {
            _vendorData = vendor;
            _products = prods;
            _isLoading = false;
          });
          return;
        }
      }
    } catch (_) {}

    // Fallback default mock items
    if (mounted) {
      setState(() {
        _isLoading = false;
        _products = [
          {
            'id': 101,
            'title': 'گوشی موبایل شیائومی 14T Pro ظرفیت ۵۱۲ گیگابایت',
            'price': 32900000,
            'imageUrl': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
            'rating': 4.9,
            'inStock': true,
          },
          {
            'id': 102,
            'title': 'ساعت هوشمند شیائومی Watch S3 با فریم قابل تعویض',
            'price': 7850000,
            'imageUrl': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
            'rating': 4.8,
            'inStock': true,
          },
        ];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final banner = widget.bannerUrl ??
        _vendorData?['bannerUrl'] ??
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=300&fit=crop';
    final logo = widget.logoUrl ??
        _vendorData?['logoUrl'] ??
        'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&h=150&fit=crop';
    final storeName = widget.storeName;
    final rating = widget.rating;
    final phone = widget.phone ?? _vendorData?['phone'] ?? '02188997766';
    final address = widget.address ??
        _vendorData?['address'] ??
        'تهران، خیابان جمهوری، تقاطع حافظ، مجتمع تجاری علاءالدین';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFF9FAFB),
        body: CustomScrollView(
          slivers: [
            // Sliver App Bar with Banner
            SliverAppBar(
              expandedHeight: 180,
              pinned: true,
              backgroundColor: const Color(0xFF1F2937),
              leading: IconButton(
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.4),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.arrow_back_ios_new, size: 16, color: Colors.white),
                ),
                onPressed: () => Navigator.pop(context),
              ),
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.network(banner, fit: BoxFit.cover),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.black.withValues(alpha: 0.7),
                            Colors.transparent,
                          ],
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Vendor Info Card
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                            logo,
                            width: 60,
                            height: 60,
                            fit: BoxFit.cover,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Flexible(
                                    child: Text(
                                      storeName,
                                      style: const TextStyle(
                                        fontFamily: 'Kalameh',
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF111827),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  const Icon(Icons.verified_rounded, color: Color(0xFF2563EB), size: 18),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(Icons.star_rounded, color: Color(0xFFFBBF24), size: 16),
                                  const SizedBox(width: 3),
                                  Text(
                                    '$rating ★ (رضایت ۹۸٪ خریداران)',
                                    style: const TextStyle(
                                      fontFamily: 'Kalameh',
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF374151),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, color: Color(0xFF9CA3AF), size: 14),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            address,
                            style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF6B7280)),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    // Action Buttons (Call / Chat)
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              final uri = Uri.parse('tel:$phone');
                              if (await canLaunchUrl(uri)) launchUrl(uri);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF2563EB),
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                            icon: const Icon(Icons.phone_in_talk_rounded, size: 14),
                            label: const Text('تماس با غرفه‌دار', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('سامانه چت مستقیم با غرفه‌دار آنلاین است.', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                                  backgroundColor: Color(0xFF10B981),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            },
                            style: OutlinedButton.styleFrom(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                            icon: const Icon(Icons.chat_outlined, size: 14),
                            label: const Text('گفتگوی آنلاین', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Products Section Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'کالاهای ارائه‌شده توسط $storeName',
                      style: const TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF111827)),
                    ),
                    Text(
                      '${_products.length} کالا',
                      style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF6B7280)),
                    ),
                  ],
                ),
              ),
            ),

            // Products Grid
            _isLoading
                ? const SliverToBoxAdapter(
                    child: Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator())),
                  )
                : SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.72,
                        crossAxisSpacing: 10,
                        mainAxisSpacing: 10,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (ctx, idx) {
                          final prod = _products[idx];
                          final pTitle = prod['title'] ?? 'کالای شیائومی';
                          final pPrice = (prod['price'] as num?)?.toInt() ?? 0;
                          final pImg = prod['imageUrl'] ?? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop';

                          return GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => ProductDetailScreen(product: prod)),
                              );
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: const Color(0xFFE5E7EB)),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  ClipRRect(
                                    borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                                    child: Image.network(
                                      pImg,
                                      height: 130,
                                      width: double.infinity,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(10),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          pTitle,
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: const TextStyle(
                                            fontFamily: 'Kalameh',
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF111827),
                                            height: 1.3,
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        Text(
                                          '${currencyFormat.format(pPrice)} تومان',
                                          style: const TextStyle(
                                            fontFamily: 'Kalameh',
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFFEF394E),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                        childCount: _products.length,
                      ),
                    ),
                  ),
            const SliverToBoxAdapter(child: SizedBox(height: 32)),
          ],
        ),
      ),
    );
  }
}
