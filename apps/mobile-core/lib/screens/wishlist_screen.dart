import 'package:flutter/material.dart';
import 'package:intl/intl.dart' hide TextDirection;
import 'package:cached_network_image/cached_network_image.dart';
import '../core/state/wishlist_state.dart';
import '../core/state/cart_state.dart';
import 'product_detail_screen.dart';

class WishlistScreen extends StatefulWidget {
  const WishlistScreen({super.key});

  @override
  State<WishlistScreen> createState() => _WishlistScreenState();
}

class _WishlistScreenState extends State<WishlistScreen> {
  final wishlist = WishlistState();
  final cart = CartState();
  final currencyFormat = NumberFormat('#,###');

  @override
  void initState() {
    super.initState();
    wishlist.addListener(_onChanged);
  }

  @override
  void dispose() {
    wishlist.removeListener(_onChanged);
    super.dispose();
  }

  void _onChanged() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final items = wishlist.items;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFF9FAFB),
        appBar: AppBar(
          title: const Text('لیست علاقه‌مندی‌های من', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          centerTitle: true,
          elevation: 0.5,
          backgroundColor: Colors.white,
          actions: [
            if (items.isNotEmpty)
              IconButton(
                icon: const Icon(Icons.delete_sweep_outlined, size: 20, color: Colors.grey),
                tooltip: 'پاک کردن همه',
                onPressed: () {
                  wishlist.clear();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('لیست علاقه‌مندی‌ها خالی شد.', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                      duration: Duration(seconds: 1),
                    ),
                  );
                },
              ),
          ],
        ),
        body: items.isEmpty
            ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEF394E).withValues(alpha: 0.08),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.favorite_border_rounded, size: 48, color: Color(0xFFEF394E)),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'لیست علاقه‌مندی‌های شما خالی است',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'با کلیک روی آیکون قلب در کنار هر محصول، آن را برای خرید بعدی ذخیره کنید.',
                        style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () => Navigator.pop(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEF394E),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text('مشاهده محصولات فروشگاه', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
              )
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: items.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final item = items[index];

                  return Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE5E7EB)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Product Thumbnail
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Container(
                            width: 76,
                            height: 76,
                            color: const Color(0xFFF3F4F6),
                            child: item.imageUrl.isNotEmpty
                                ? CachedNetworkImage(
                                    imageUrl: item.imageUrl,
                                    fit: BoxFit.cover,
                                    errorWidget: (_, __, ___) => const Icon(Icons.image_not_supported, color: Colors.grey),
                                  )
                                : const Icon(Icons.devices, color: Colors.grey),
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Title & Price Info
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, height: 1.3),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Text(
                                    '${currencyFormat.format(item.price)} تومان',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFFEF394E),
                                      fontFamily: 'Kalameh',
                                    ),
                                  ),
                                  if (item.regularPrice != null && item.regularPrice! > item.price) ...[
                                    const SizedBox(width: 8),
                                    Text(
                                      currencyFormat.format(item.regularPrice),
                                      style: TextStyle(
                                        fontSize: 10,
                                        color: Colors.grey.shade400,
                                        decoration: TextDecoration.lineThrough,
                                        fontFamily: 'Kalameh',
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                              const SizedBox(height: 10),

                              // Action Buttons
                              Row(
                                children: [
                                  ElevatedButton.icon(
                                    icon: const Icon(Icons.shopping_cart_outlined, size: 14),
                                    label: const Text('افزودن به سبد', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                                    onPressed: () {
                                      cart.addItem(
                                        id: item.id,
                                        title: item.title,
                                        imageUrl: item.imageUrl,
                                        price: item.price,
                                        regularPrice: item.regularPrice,
                                      );
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text('«${item.title}» به سبد خرید اضافه شد.', style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                                          backgroundColor: const Color(0xFF10B981),
                                          duration: const Duration(seconds: 2),
                                        ),
                                      );
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFFEF394E),
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                      elevation: 0,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  OutlinedButton(
                                    onPressed: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => ProductDetailScreen(
                                            product: {
                                              'id': item.id,
                                              'title': item.title,
                                              'price': item.price,
                                              'regularPrice': item.regularPrice,
                                              'imageUrl': item.imageUrl,
                                            },
                                          ),
                                        ),
                                      );
                                    },
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: const Color(0xFF4B5563),
                                      side: const BorderSide(color: Color(0xFFD1D5DB)),
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    child: const Text('مشاهده جزییات', style: TextStyle(fontSize: 11)),
                                  ),
                                  const Spacer(),
                                  IconButton(
                                    icon: const Icon(Icons.delete_outline, size: 18, color: Colors.grey),
                                    onPressed: () => wishlist.removeItem(item.id),
                                    tooltip: 'حذف از علاقه‌مندی‌ها',
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
      ),
    );
  }
}
