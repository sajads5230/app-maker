import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../core/models/app_config_model.dart';
import '../core/services/config_sync_service.dart';
import 'search_screen.dart';

class CategoriesScreen extends StatefulWidget {
  final AppConfigModel? config;

  const CategoriesScreen({super.key, this.config});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  int _selectedCategoryIndex = 0;

  final List<Map<String, dynamic>> _defaultCategories = [
    {
      'title': 'موبایل و تبلت',
      'icon': Icons.phone_android_rounded,
      'banner': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=200&fit=crop',
      'subcategories': [
        {'title': 'گوشی سامسونگ', 'count': '۱۴۲ کالا', 'icon': Icons.smartphone},
        {'title': 'گوشی شیائومی', 'count': '۹۸ کالا', 'icon': Icons.phone_iphone},
        {'title': 'گوشی اپل (آیفون)', 'count': '۴۵ کالا', 'icon': Icons.apple},
        {'title': 'تبلت و آیپد', 'count': '۳۱ کالا', 'icon': Icons.tablet_mac},
        {'title': 'قاب و کاور', 'count': '۵۱۰ کالا', 'icon': Icons.shield_outlined},
        {'title': 'شارژر و آداپتور', 'count': '۱۲۴ کالا', 'icon': Icons.power},
      ],
    },
    {
      'title': 'لپ‌تاپ و کامپیوتر',
      'icon': Icons.laptop_mac_rounded,
      'banner': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=200&fit=crop',
      'subcategories': [
        {'title': 'لپ‌تاپ گیمینگ', 'count': '۳۴ کالا', 'icon': Icons.sports_esports},
        {'title': 'لپ‌تاپ مهندسی و اداری', 'count': '۵۶ کالا', 'icon': Icons.laptop},
        {'title': 'ماوس و کیبورد', 'count': '۸۹ کالا', 'icon': Icons.mouse},
        {'title': 'مانیتور', 'count': '۲۷ کالا', 'icon': Icons.desktop_windows},
        {'title': 'هارد و حافظه SSD', 'count': '۶۳ کالا', 'icon': Icons.storage},
      ],
    },
    {
      'title': 'صوتی و هدفون',
      'icon': Icons.headphones_rounded,
      'banner': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=200&fit=crop',
      'subcategories': [
        {'title': 'هدفون روگوشی', 'count': '۴۱ کالا', 'icon': Icons.headset},
        {'title': 'هندزفری بی‌سیم', 'count': '۷۸ کالا', 'icon': Icons.earbuds},
        {'title': 'اسپیکر بلوتوثی', 'count': '۵۲ کالا', 'icon': Icons.speaker},
        {'title': 'میکروفون استودیویی', 'count': '۱۹ کالا', 'icon': Icons.mic},
      ],
    },
    {
      'title': 'ساعت و گجت',
      'icon': Icons.watch_rounded,
      'banner': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=200&fit=crop',
      'subcategories': [
        {'title': 'ساعت هوشمند اپل', 'count': '۱۸ کالا', 'icon': Icons.watch},
        {'title': 'ساعت هوشمند سامسونگ', 'count': '۱۴ کالا', 'icon': Icons.watch_later},
        {'title': 'مچ‌بند سلامتی', 'count': '۲۹ کالا', 'icon': Icons.fitness_center},
        {'title': 'بند و اکسسوری ساعت', 'count': '۱۱۰ کالا', 'icon': Icons.style},
      ],
    },
    {
      'title': 'لوازم جانبی',
      'icon': Icons.cable_rounded,
      'banner': 'https://images.unsplash.com/photo-1609592807664-8461f0923f13?w=600&h=200&fit=crop',
      'subcategories': [
        {'title': 'پاوربانک', 'count': '۴۸ کالا', 'icon': Icons.battery_charging_full},
        {'title': 'کابل تایپ C و لایتنینگ', 'count': '۱۶۵ کالا', 'icon': Icons.cable},
        {'title': 'هولدر و پایه موبایل', 'count': '۷۲ کالا', 'icon': Icons.screen_lock_rotation},
      ],
    },
  ];

  List<Map<String, dynamic>> _getCategories() {
    final cfg = widget.config ?? ConfigSyncService.currentConfig;
    if (cfg != null) {
      final cats = cfg.allCategories;
      if (cats.isNotEmpty) {
        return cats.map((it) {
          final title = (it['title'] ?? it['name'] ?? '').toString();
          final img = (it['imageUrl'] ?? '').toString();
          final countVal = it['count'] != null ? '${it['count']} کالا' : 'موجود در انبار';
          return {
            'title': title,
            'banner': img.isNotEmpty ? img : 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=200&fit=crop',
            'imageUrl': img,
            'icon': Icons.category_rounded,
            'subcategories': [
              {
                'title': 'مشاهده همه کالاهای $title',
                'count': countVal,
                'icon': Icons.grid_view_rounded,
              },
            ],
          };
        }).toList();
      }
    }
    return _defaultCategories;
  }

  @override
  Widget build(BuildContext context) {
    final categories = _getCategories();
    final safeIndex = _selectedCategoryIndex < categories.length ? _selectedCategoryIndex : 0;
    final currentCat = categories[safeIndex];
    final subcategories = currentCat['subcategories'] as List<dynamic>? ?? [];

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFF9FAFB),
        appBar: AppBar(
          title: const Text('دسته‌بندی‌های کالا', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          centerTitle: true,
          elevation: 0.5,
          backgroundColor: Colors.white,
          actions: [
            IconButton(
              icon: const Icon(Icons.search, size: 22),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => SearchScreen(config: widget.config)),
                );
              },
            ),
          ],
        ),
        body: Row(
          children: [
            // Right Vertical Category Menu (Width: 105)
            Container(
              width: 105,
              color: Colors.white,
              child: ListView.builder(
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  final cat = categories[index];
                  final isSelected = index == safeIndex;
                  final imgUrl = cat['imageUrl'] as String?;

                  return GestureDetector(
                    onTap: () => setState(() => _selectedCategoryIndex = index),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFF9FAFB) : Colors.white,
                        border: Border(
                          right: BorderSide(
                            color: isSelected ? const Color(0xFFEF394E) : Colors.transparent,
                            width: 3.5,
                          ),
                        ),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (imgUrl != null && imgUrl.isNotEmpty) ...[
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: CachedNetworkImage(
                                imageUrl: imgUrl,
                                width: 28,
                                height: 28,
                                fit: BoxFit.cover,
                                errorWidget: (_, __, ___) => const Icon(Icons.category_rounded, size: 22),
                              ),
                            ),
                          ] else ...[
                            Icon(
                              cat['icon'] as IconData? ?? Icons.category_rounded,
                              size: 24,
                              color: isSelected ? const Color(0xFFEF394E) : const Color(0xFF6B7280),
                            ),
                          ],
                          const SizedBox(height: 6),
                          Text(
                            cat['title'] as String,
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              color: isSelected ? const Color(0xFFEF394E) : const Color(0xFF374151),
                              height: 1.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const VerticalDivider(width: 1, color: Color(0xFFE5E7EB)),

            // Left Subcategories Grid Area
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(12),
                children: [
                  // Promotional Category Header Banner
                  Container(
                    height: 90,
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: DecorationImage(
                        image: NetworkImage(currentCat['banner'] as String),
                        fit: BoxFit.cover,
                      ),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        gradient: LinearGradient(
                          colors: [Colors.black.withValues(alpha: 0.65), Colors.transparent],
                          begin: Alignment.bottomRight,
                          end: Alignment.topLeft,
                        ),
                      ),
                      padding: const EdgeInsets.all(12),
                      alignment: Alignment.bottomRight,
                      child: Text(
                        currentCat['title'] as String,
                        style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),

                  // Subcategories Grid
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      childAspectRatio: 1.15,
                    ),
                    itemCount: subcategories.length,
                    itemBuilder: (context, index) {
                      final sub = subcategories[index];
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => SearchScreen(
                                initialCategory: currentCat['title'] as String,
                                config: widget.config,
                              ),
                            ),
                          );
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFE5E7EB)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.02),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          padding: const EdgeInsets.all(10),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor: const Color(0xFFEF394E).withValues(alpha: 0.08),
                                child: Icon(sub['icon'] as IconData, size: 20, color: const Color(0xFFEF394E)),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                sub['title'] as String,
                                textAlign: TextAlign.center,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                sub['count'] as String,
                                style: const TextStyle(fontSize: 9, color: Color(0xFF9CA3AF)),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
