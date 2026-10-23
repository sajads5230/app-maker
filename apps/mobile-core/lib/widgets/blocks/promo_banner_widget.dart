import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class PromoBannerWidget extends StatelessWidget {
  final Map<String, dynamic> data;

  const PromoBannerWidget({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final banners = data['banners'] as List<dynamic>? ?? [];
    if (banners.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: Row(
        children: banners.map((b) {
          final imageUrl = b['imageUrl'] ?? '';
          return Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              height: 95,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: CachedNetworkImage(
                  imageUrl: imageUrl,
                  fit: BoxFit.cover,
                  errorWidget: (_, __, ___) => Container(color: Colors.grey.shade200),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
