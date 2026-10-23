import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class StoryCirclesWidget extends StatelessWidget {
  final Map<String, dynamic> data;

  const StoryCirclesWidget({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final items = data['items'] as List<dynamic>? ?? [
      {
        'id': 'st1',
        'title': 'آنباکس جدید',
        'imageUrl': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop',
        'storyImage': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=900&fit=crop',
        'desc': 'بررسی ویدیویی و آنباکسینگ اختصاصی پرچمدار جدید شیائومی',
        'badge': 'جدید',
      },
      {
        'id': 'st2',
        'title': 'حراج جاروبرقی',
        'imageUrl': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=150&h=150&fit=crop',
        'storyImage': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=900&fit=crop',
        'desc': 'جشنواره تخفیف‌های شگفت‌انگیز جاروبرقی‌های رباتیک و هوشمند',
        'badge': 'تخفیف',
      },
      {
        'id': 'st3',
        'title': 'خانه هوشمند',
        'imageUrl': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=150&h=150&fit=crop',
        'storyImage': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=900&fit=crop',
        'desc': 'راهنمای هوشمندسازی خانه و کنترل لوازم با اپلیکیشن موبایل',
        'badge': 'آموزش',
      },
      {
        'id': 'st4',
        'title': 'ساعت هوشمند',
        'imageUrl': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
        'storyImage': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=900&fit=crop',
        'desc': 'مقایسه دقت حسگرهای سلامتی و باتری ساعت‌های شیائومی',
        'badge': 'بررسی',
      },
      {
        'id': 'st5',
        'title': 'تخفیف ویژه',
        'imageUrl': 'https://images.unsplash.com/photo-1609592807664-8461f0923f13?w=150&h=150&fit=crop',
        'storyImage': 'https://images.unsplash.com/photo-1609592807664-8461f0923f13?w=600&h=900&fit=crop',
        'desc': 'کد تخفیف اختصاصی ۵۰ هزار تومانی برای خرید اول از اپلیکیشن',
        'badge': 'کوپن',
      },
    ];

    if (items.isEmpty) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 6),
      height: 94,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 14),
        scrollDirection: Axis.horizontal,
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(width: 14),
        itemBuilder: (context, index) {
          final st = items[index] as Map<String, dynamic>;
          final title = (st['title'] ?? '').toString();
          final imgUrl = (st['imageUrl'] ?? '').toString();
          final badge = (st['badge'] ?? '').toString();

          return GestureDetector(
            onTap: () => _openStoryViewer(context, st),
            child: SizedBox(
              width: 66,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Stack(
                    clipBehavior: Clip.none,
                    alignment: Alignment.center,
                    children: [
                      // Gradient Instagram-like Border Ring
                      Container(
                        width: 62,
                        height: 62,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFFEF394E), Color(0xFFF59E0B), Color(0xFFEC4899)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFEF394E).withValues(alpha: 0.25),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(2.5),
                          child: Container(
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(2),
                              child: ClipOval(
                                child: imgUrl.isNotEmpty
                                    ? CachedNetworkImage(
                                        imageUrl: imgUrl,
                                        fit: BoxFit.cover,
                                        errorWidget: (_, __, ___) => const Icon(Icons.play_circle_fill, color: Colors.grey),
                                      )
                                    : const Icon(Icons.play_circle_fill, color: Colors.grey),
                              ),
                            ),
                          ),
                        ),
                      ),
                      if (badge.isNotEmpty)
                        Positioned(
                          bottom: -2,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEF394E),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: Colors.white, width: 1),
                            ),
                            child: Text(
                              badge,
                              style: const TextStyle(fontSize: 8, color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _openStoryViewer(BuildContext context, Map<String, dynamic> st) {
    final title = (st['title'] ?? '').toString();
    final desc = (st['desc'] ?? '').toString();
    final storyImg = (st['storyImage'] ?? st['imageUrl'] ?? '').toString();

    showDialog(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.85),
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        child: Directionality(
          textDirection: TextDirection.rtl,
          child: Container(
            height: 520,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              image: storyImg.isNotEmpty
                  ? DecorationImage(
                      image: NetworkImage(storyImg),
                      fit: BoxFit.cover,
                    )
                  : null,
              color: Colors.black,
            ),
            child: Stack(
              children: [
                // Gradient Overlay
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    gradient: LinearGradient(
                      colors: [
                        Colors.black.withValues(alpha: 0.7),
                        Colors.transparent,
                        Colors.black.withValues(alpha: 0.85),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      stops: const [0.0, 0.4, 1.0],
                    ),
                  ),
                ),

                // Top Bar
                Positioned(
                  top: 14,
                  left: 14,
                  right: 14,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundImage: NetworkImage((st['imageUrl'] ?? '').toString()),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            title,
                            style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white, size: 22),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                ),

                // Bottom Content & CTA
                Positioned(
                  bottom: 20,
                  left: 16,
                  right: 16,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (desc.isNotEmpty)
                        Text(
                          desc,
                          style: const TextStyle(color: Colors.white, fontSize: 12, height: 1.5),
                        ),
                      const SizedBox(height: 14),
                      SizedBox(
                        width: double.infinity,
                        height: 44,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFEF394E),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () => Navigator.pop(context),
                          child: const Text('مشاهده پیشنهاد و خرید', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
