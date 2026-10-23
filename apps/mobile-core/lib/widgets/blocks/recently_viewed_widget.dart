import 'package:flutter/material.dart';
import 'package:intl/intl.dart' hide TextDirection;
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/services/recently_viewed_service.dart';
import '../../screens/product_detail_screen.dart';

class RecentlyViewedWidget extends StatelessWidget {
  final Map<String, dynamic>? data;

  const RecentlyViewedWidget({super.key, this.data});

  @override
  Widget build(BuildContext context) {
    final title = data?['title'] as String? ?? 'محصولات اخیراً مشاهده شده';
    final service = RecentlyViewedService();
    final currencyFormat = NumberFormat('#,###');

    return ListenableBuilder(
      listenable: service,
      builder: (context, _) {
        final items = service.items;
        if (items.isEmpty) return const SizedBox.shrink();

        return Container(
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.history_rounded, size: 18, color: Color(0xFFEF394E)),
                        const SizedBox(width: 6),
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                          ),
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: () => service.clear(),
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: const Size(40, 24),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: const Text(
                        'پاک کردن تاریخچه',
                        style: TextStyle(fontSize: 10, color: Color(0xFF9CA3AF)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 6),
              SizedBox(
                height: 195,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: items.length,
                  itemBuilder: (context, index) {
                    final item = items[index];
                    final prodTitle = item['title'] ?? 'محصول';
                    final img = item['imageUrl'] ?? '';
                    final price = (item['price'] as num?)?.toDouble() ?? 0.0;
                    final regularPrice = (item['regularPrice'] as num?)?.toDouble();
                    final discount = item['discountPercent'];

                    return GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => ProductDetailScreen(product: item),
                          ),
                        );
                      },
                      child: Container(
                        width: 130,
                        margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE5E7EB)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.02),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Product Image
                            ClipRRect(
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(11)),
                              child: Container(
                                height: 105,
                                color: const Color(0xFFF9FAFB),
                                child: Stack(
                                  children: [
                                    Center(
                                      child: img.isNotEmpty
                                          ? CachedNetworkImage(
                                              imageUrl: img,
                                              fit: BoxFit.contain,
                                              height: 90,
                                              placeholder: (_, __) => const Center(
                                                child: CircularProgressIndicator(strokeWidth: 1.5),
                                              ),
                                              errorWidget: (_, __, ___) => const Icon(
                                                Icons.broken_image_outlined,
                                                color: Colors.grey,
                                                size: 32,
                                              ),
                                            )
                                          : const Icon(Icons.image_outlined, color: Colors.grey, size: 32),
                                    ),
                                    if (discount != null && (discount as num) > 0)
                                      Positioned(
                                        top: 6,
                                        right: 6,
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFEF394E),
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            '$discount٪',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 9,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            ),
                            // Title & Price
                            Padding(
                              padding: const EdgeInsets.all(8),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    prodTitle,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF1F2937),
                                      height: 1.25,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  if (regularPrice != null && regularPrice > price)
                                    Text(
                                      currencyFormat.format(regularPrice),
                                      style: TextStyle(
                                        fontSize: 9,
                                        color: Colors.grey.shade400,
                                        decoration: TextDecoration.lineThrough,
                                      ),
                                    ),
                                  Text(
                                    price > 0 ? '${currencyFormat.format(price)} تومان' : 'تماس بگیرید',
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w900,
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
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
