import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../core/models/app_config_model.dart';
import '../core/services/config_sync_service.dart';
import 'search_screen.dart';

class CategoriesScreen extends StatefulWidget {
  final AppConfigModel? config;
  final int initialCategoryIndex;
  final String? initialCategoryTitle;

  const CategoriesScreen({
    super.key,
    this.config,
    this.initialCategoryIndex = 0,
    this.initialCategoryTitle,
  });

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  int _selectedCategoryIndex = 0;

  @override
  void initState() {
    super.initState();
    _selectedCategoryIndex = widget.initialCategoryIndex;
    if (widget.initialCategoryTitle != null && widget.initialCategoryTitle!.isNotEmpty) {
      final cats = _getCategories();
      final targetTitle = widget.initialCategoryTitle!.trim().toLowerCase();
      final foundIdx = cats.indexWhere((c) {
        final t = (c['title'] ?? '').toString().trim().toLowerCase();
        return t == targetTitle || t.contains(targetTitle) || targetTitle.contains(t);
      });
      if (foundIdx != -1) {
        _selectedCategoryIndex = foundIdx;
      }
    }
  }

  final List<Map<String, dynamic>> _defaultCategories = [
    {
      'title': 'خانه و آشپزخانه هوشمند',
      'icon': Icons.kitchen_rounded,
      'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/12/1-2.jpg',
      'banner': 'https://xiaomismart.ir/wp-content/uploads/2025/12/1-2.jpg',
      'subcategories': [
        {'title': 'جارو رباتیک هوشمند', 'count': '۱۴ کالا', 'icon': Icons.cleaning_services_rounded},
        {'title': 'ماشین لباسشویی هوشمند', 'count': '۵ کالا', 'icon': Icons.local_laundry_service_rounded},
        {'title': 'تصفیه هوا و آب هوشمند', 'count': '۸ کالا', 'icon': Icons.air_rounded},
        {'title': 'مشاهده همه محصولات خانه هوشمند', 'count': '۲۱ کالا', 'icon': Icons.grid_view_rounded},
      ],
    },
    {
      'title': 'دوربین های نظارتی هوشمند',
      'icon': Icons.videocam_rounded,
      'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/09/18.jpg',
      'banner': 'https://xiaomismart.ir/wp-content/uploads/2025/09/18.jpg',
      'subcategories': [
        {'title': 'دوربین مداربسته ۳۶۰ درجه', 'count': '۶ کالا', 'icon': Icons.videocam_rounded},
        {'title': 'دوربین فضای باز و ضدآب', 'count': '۴ کالا', 'icon': Icons.camera_indoor_rounded},
        {'title': 'مشاهده همه دوربین‌های نظارتی', 'count': '۱۲ کالا', 'icon': Icons.grid_view_rounded},
      ],
    },
    {
      'title': 'سیستم سرمایش و گرمایش هوشمند',
      'icon': Icons.ac_unit_rounded,
      'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/11/8-11.jpg',
      'banner': 'https://xiaomismart.ir/wp-content/uploads/2025/11/8-11.jpg',
      'subcategories': [
        {'title': 'کولر گازی مرکزی هوشمند', 'count': '۱۱ کالا', 'icon': Icons.ac_unit_rounded},
        {'title': 'هیتر و بخاری هوشمند', 'count': '۹ کالا', 'icon': Icons.heat_pump_rounded},
        {'title': 'پنکه برجی هوشمند', 'count': '۹ کالا', 'icon': Icons.mode_fan_off_rounded},
        {'title': 'مشاهده همه محصولات سرمایش و گرمایش', 'count': '۲۹ کالا', 'icon': Icons.grid_view_rounded},
      ],
    },
    {
      'title': 'سیستم صوتی و تصویری هوشمند',
      'icon': Icons.speaker_rounded,
      'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/11/12-3.jpg',
      'banner': 'https://xiaomismart.ir/wp-content/uploads/2025/11/12-3.jpg',
      'subcategories': [
        {'title': 'اسپیکر هوشمند شیائومی', 'count': '۱۰ کالا', 'icon': Icons.speaker_rounded},
        {'title': 'ویدیو پروژکتور خانگی', 'count': '۶ کالا', 'icon': Icons.tv_rounded},
        {'title': 'مشاهده همه صوتی و تصویری', 'count': '۱۶ کالا', 'icon': Icons.grid_view_rounded},
      ],
    },
    {
      'title': 'قفل، دستگیره و زنگ هوشمند',
      'icon': Icons.lock_rounded,
      'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/10/20.jpg',
      'banner': 'https://xiaomismart.ir/wp-content/uploads/2025/10/20.jpg',
      'subcategories': [
        {'title': 'دستگیره دیجیتال تشخیص چهره', 'count': '۷ کالا', 'icon': Icons.door_front_door_rounded},
        {'title': 'زنگ درب تصویری هوشمند', 'count': '۵ کالا', 'icon': Icons.doorbell_rounded},
        {'title': 'مشاهده همه قفل‌ها و زنگ‌ها', 'count': '۱۲ کالا', 'icon': Icons.grid_view_rounded},
      ],
    },
    {
      'title': 'کلید و پریز هوشمند',
      'icon': Icons.toggle_on_rounded,
      'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/11/12-5.jpg',
      'banner': 'https://xiaomismart.ir/wp-content/uploads/2025/11/12-5.jpg',
      'subcategories': [
        {'title': 'کلید لمسی تک و دو پل', 'count': '۱۸ کالا', 'icon': Icons.toggle_on_rounded},
        {'title': 'پریز وای‌فای هوشمند', 'count': '۱۵ کالا', 'icon': Icons.power_rounded},
        {'title': 'مشاهده همه کلید و پریزها', 'count': '۳۳ کالا', 'icon': Icons.grid_view_rounded},
      ],
    },
    {
      'title': 'نور و روشنایی هوشمند',
      'icon': Icons.lightbulb_rounded,
      'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/11/Untitled-1.jpg',
      'banner': 'https://xiaomismart.ir/wp-content/uploads/2025/11/Untitled-1.jpg',
      'subcategories': [
        {'title': 'لامپ هوشمند رنگی RGB', 'count': '۱۲ کالا', 'icon': Icons.lightbulb_rounded},
        {'title': 'ریسه و چراغ خواب هوشمند', 'count': '۶ کالا', 'icon': Icons.nightlight_rounded},
        {'title': 'مشاهده همه روشنایی هوشمند', 'count': '۱۸ کالا', 'icon': Icons.grid_view_rounded},
      ],
    },
    {
      'title': 'هاب و سنسور های هوشمند',
      'icon': Icons.hub_rounded,
      'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/10/12-7.jpg',
      'banner': 'https://xiaomismart.ir/wp-content/uploads/2025/10/12-7.jpg',
      'subcategories': [
        {'title': 'گیت‌وی و هاب مرکزی Zigbee', 'count': '۶ کالا', 'icon': Icons.hub_rounded},
        {'title': 'سنسور دما، رطوبت و حضور', 'count': '۸ کالا', 'icon': Icons.sensors_rounded},
        {'title': 'مشاهده همه سنسورها', 'count': '۱۴ کالا', 'icon': Icons.grid_view_rounded},
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

          List<Map<String, dynamic>> subs = [];
          if (title.contains('آشپزخانه') || title.contains('خانه')) {
            subs = [
              {'title': 'جارو رباتیک هوشمند', 'count': '۱۴ کالا', 'icon': Icons.cleaning_services_rounded},
              {'title': 'ماشین لباسشویی هوشمند', 'count': '۵ کالا', 'icon': Icons.local_laundry_service_rounded},
              {'title': 'تصفیه هوا و آب هوشمند', 'count': '۸ کالا', 'icon': Icons.air_rounded},
              {'title': 'مشاهده همه کالاهای $title', 'count': countVal, 'icon': Icons.grid_view_rounded},
            ];
          } else if (title.contains('سرمایش') || title.contains('گرمایش')) {
            subs = [
              {'title': 'کولر گازی هوشمند', 'count': '۱۱ کالا', 'icon': Icons.ac_unit_rounded},
              {'title': 'بخاری و هیتر هوشمند', 'count': '۹ کالا', 'icon': Icons.heat_pump_rounded},
              {'title': 'پنکه و فن هوشمند', 'count': '۹ کالا', 'icon': Icons.mode_fan_off_rounded},
              {'title': 'مشاهده همه کالاهای $title', 'count': countVal, 'icon': Icons.grid_view_rounded},
            ];
          } else if (title.contains('دوربین') || title.contains('نظارتی')) {
            subs = [
              {'title': 'دوربین نظارتی ۳۶۰ درجه', 'count': '۶ کالا', 'icon': Icons.videocam_rounded},
              {'title': 'دوربین فضای باز ضدآب', 'count': '۴ کالا', 'icon': Icons.camera_indoor_rounded},
              {'title': 'مشاهده همه کالاهای $title', 'count': countVal, 'icon': Icons.grid_view_rounded},
            ];
          } else if (title.contains('قفل') || title.contains('دستگیره') || title.contains('زنگ')) {
            subs = [
              {'title': 'دستگیره دیجیتال هوشمند', 'count': '۷ کالا', 'icon': Icons.door_front_door_rounded},
              {'title': 'زنگ درب تصویری هوشمند', 'count': '۵ کالا', 'icon': Icons.doorbell_rounded},
              {'title': 'مشاهده همه کالاهای $title', 'count': countVal, 'icon': Icons.grid_view_rounded},
            ];
          } else if (title.contains('کلید') || title.contains('پریز')) {
            subs = [
              {'title': 'کلید لمسی تک و دو پل', 'count': '۱۸ کالا', 'icon': Icons.toggle_on_rounded},
              {'title': 'پریز هوشمند وای‌فای', 'count': '۱۵ کالا', 'icon': Icons.power_rounded},
              {'title': 'مشاهده همه کالاهای $title', 'count': countVal, 'icon': Icons.grid_view_rounded},
            ];
          } else if (title.contains('صوتی') || title.contains('تصویری')) {
            subs = [
              {'title': 'اسپیکر هوشمند شیائومی', 'count': '۱۰ کالا', 'icon': Icons.speaker_rounded},
              {'title': 'پروژکتور هوشمند', 'count': '۶ کالا', 'icon': Icons.tv_rounded},
              {'title': 'مشاهده همه کالاهای $title', 'count': countVal, 'icon': Icons.grid_view_rounded},
            ];
          } else if (title.contains('نور') || title.contains('روشنایی')) {
            subs = [
              {'title': 'لامپ هوشمند رنگی RGB', 'count': '۱۲ کالا', 'icon': Icons.lightbulb_rounded},
              {'title': 'ریسه و چراغ خواب هوشمند', 'count': '۶ کالا', 'icon': Icons.nightlight_rounded},
              {'title': 'مشاهده همه کالاهای $title', 'count': countVal, 'icon': Icons.grid_view_rounded},
            ];
          } else {
            subs = [
              {'title': 'سنسور و هاب مرکزی', 'count': countVal, 'icon': Icons.hub_rounded},
              {'title': 'مشاهده همه کالاهای $title', 'count': countVal, 'icon': Icons.grid_view_rounded},
            ];
          }

          return {
            'title': title,
            'banner': img.isNotEmpty ? img : 'https://xiaomismart.ir/wp-content/uploads/2025/12/1-2.jpg',
            'imageUrl': img,
            'icon': Icons.category_rounded,
            'subcategories': subs,
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
