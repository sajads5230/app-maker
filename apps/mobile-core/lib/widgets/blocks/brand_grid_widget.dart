import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../screens/search_screen.dart';

class BrandGridWidget extends StatelessWidget {
  final Map<String, dynamic> data;

  const BrandGridWidget({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final title = (data['title'] ?? 'محبوب‌ترین برندها و شرکای تجاری').toString();
    final items = data['items'] as List<dynamic>? ?? [
      {
        'id': 'b1',
        'name': 'شیائومی',
        'englishName': 'Xiaomi',
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/200px-Xiaomi_logo_%282021-%29.svg.png',
      },
      {
        'id': 'b2',
        'name': 'دریم',
        'englishName': 'Dreame',
        'logo': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=100&h=100&fit=crop',
      },
      {
        'id': 'b3',
        'name': 'روبوراک',
        'englishName': 'Roborock',
        'logo': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop',
      },
      {
        'id': 'b4',
        'name': 'میجیا',
        'englishName': 'Mijia',
        'logo': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&h=100&fit=crop',
      },
      {
        'id': 'b5',
        'name': 'امیزفیت',
        'englishName': 'Amazfit',
        'logo': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
      },
      {
        'id': 'b6',
        'name': 'هایلو',
        'englishName': 'Haylou',
        'logo': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
      },
    ];

    if (items.isEmpty) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.symmetric(vertical: 12),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SearchScreen()),
                    );
                  },
                  child: const Text('مشاهده همه', style: TextStyle(fontSize: 11, color: Color(0xFFEF394E), fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 4),
          SizedBox(
            height: 80,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              scrollDirection: Axis.horizontal,
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final b = items[index] as Map<String, dynamic>;
                final name = (b['name'] ?? '').toString();
                final enName = (b['englishName'] ?? '').toString();
                final logo = (b['logo'] ?? '').toString();

                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => SearchScreen(initialQuery: name),
                      ),
                    );
                  },
                  child: Container(
                    width: 100,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF9FAFB),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE5E7EB)),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (logo.isNotEmpty)
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: CachedNetworkImage(
                              imageUrl: logo,
                              width: 32,
                              height: 32,
                              fit: BoxFit.cover,
                              errorWidget: (_, __, ___) => const Icon(Icons.business_outlined, size: 24, color: Colors.grey),
                            ),
                          )
                        else
                          const Icon(Icons.business_outlined, size: 24, color: Colors.grey),
                        const SizedBox(height: 6),
                        Text(
                          name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                        ),
                        if (enName.isNotEmpty)
                          Text(
                            enName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 8, color: Colors.grey),
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
  }
}
