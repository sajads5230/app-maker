import 'package:flutter/material.dart';

class CourseCurriculumWidget extends StatefulWidget {
  final Map<String, dynamic> data;

  const CourseCurriculumWidget({super.key, required this.data});

  @override
  State<CourseCurriculumWidget> createState() => _CourseCurriculumWidgetState();
}

class _CourseCurriculumWidgetState extends State<CourseCurriculumWidget> {
  final List<Map<String, dynamic>> _lessons = [
    {
      'number': '۱',
      'title': 'جلسه اول: آشنایی با مبانی و مسیر یادگیری',
      'duration': '۱۵ دقیقه',
      'isFree': true,
      'description': 'بررسی سرفصل‌های دوره، ابزارهای موردنیاز و نقشه راه تسلط کامل',
    },
    {
      'number': '۲',
      'title': 'جلسه دوم: اصول راه‌اندازی و معماری اولیه',
      'duration': '۳۲ دقیقه',
      'isFree': true,
      'description': 'نحوه پیکربندی محیط کاری و اجرای اولین پروژه عملی',
    },
    {
      'number': '۳',
      'title': 'جلسه سوم: کارگاه عملی پیاده‌سازی و کدنویسی',
      'duration': '۴۸ دقیقه',
      'isFree': false,
      'description': 'توسعه ماژول‌های اصلی پروژه به همراه نکات حرفه‌ای و ترفندهای بازار کار',
    },
    {
      'number': '۴',
      'title': 'جلسه چهارم: بهینه‌سازی، امنیت و خروجی نهایی',
      'duration': '۴۰ دقیقه',
      'isFree': false,
      'description': 'روش‌های افزایش کارایی، ایمن‌سازی دیتابیس و آماده‌سازی برای انتشار',
    },
  ];

  void _openLessonPlayer(Map<String, dynamic> lesson) {
    if (!lesson['isFree']) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('این جلسه قفل است 🔒 لطفاً برای دسترسی به تمام ویدیوها در دوره ثبت‌نام فرمایید.', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
          backgroundColor: Color(0xFFEF394E),
          duration: Duration(seconds: 3),
        ),
      );
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Container(
          height: MediaQuery.of(ctx).size.height * 0.78,
          decoration: const BoxDecoration(
            color: Color(0xFF0F172A),
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            children: [
              // Drag handle
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(top: 10, bottom: 12),
                decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
              ),

              // Video Screen Mock
              Container(
                height: 200,
                width: double.infinity,
                color: Colors.black,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Image.network(
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity,
                    ),
                    Container(color: Colors.black.withValues(alpha: 0.45)),
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: const Color(0xFF8B5CF6).withValues(alpha: 0.85),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF8B5CF6).withValues(alpha: 0.4),
                            blurRadius: 16,
                          ),
                        ],
                      ),
                      child: const Icon(Icons.play_arrow_rounded, color: Colors.white, size: 36),
                    ),
                    Positioned(
                      bottom: 12,
                      right: 16,
                      left: 16,
                      child: Row(
                        children: [
                          const Text('۰۴:۲۵', style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Colors.white70)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(2),
                              child: const LinearProgressIndicator(
                                value: 0.35,
                                backgroundColor: Colors.white24,
                                valueColor: AlwaysStoppedAnimation(Color(0xFF8B5CF6)),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(lesson['duration'], style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Colors.white70)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Content Details
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981).withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text('ویدیو پیش‌نمایش رایگان', style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF34D399), fontWeight: FontWeight.bold)),
                          ),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(Icons.close, color: Colors.white70),
                            onPressed: () => Navigator.pop(ctx),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        lesson['title'],
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        lesson['description'],
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Color(0xFF94A3B8), height: 1.5),
                      ),
                      const Spacer(),
                      // Attachment download button
                      SizedBox(
                        width: double.infinity,
                        height: 42,
                        child: OutlinedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('جزوه خلاصه درس و کدهای تمرینی (فایل ضمیمه) دانلود شد 💾', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                                backgroundColor: Color(0xFF10B981),
                              ),
                            );
                          },
                          icon: const Icon(Icons.download_rounded, size: 18, color: Color(0xFFA78BFA)),
                          label: const Text('دانلود فایل‌های ضمیمه و اسلایدهای این جلسه', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Colors.white)),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color(0xFF334155)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.data['title'] ?? 'سرفصل‌ها و جلسات آموزشی دوره (LMS)';
    final subtitle = widget.data['subtitle'] ?? 'مشاهده جلسات، ویدیوی پیش‌نمایش و دانلود جزوات ضمیمه';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: const Color(0xFF8B5CF6).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.school_rounded, color: Color(0xFF8B5CF6), size: 22),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontFamily: 'Kalameh',
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1F2937),
                        ),
                      ),
                      Text(
                        subtitle,
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF6B7280)),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Pills stats
            Row(
              children: [
                _buildStatPill('🎥 ۴ جلسه آموزشی'),
                const SizedBox(width: 6),
                _buildStatPill('⏱ ۲ ساعت و ۱۵ دقیقه'),
                const SizedBox(width: 6),
                _buildStatPill('🎓 گواهی پایان دوره'),
              ],
            ),

            const SizedBox(height: 14),

            // Lessons
            ..._lessons.map((lesson) {
              final isFree = lesson['isFree'] as bool;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  color: isFree ? const Color(0xFFF9FAFB) : const Color(0xFFFAFAFA),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: isFree ? const Color(0xFFE5E7EB) : const Color(0xFFF3F4F6)),
                ),
                child: ListTile(
                  onTap: () => _openLessonPlayer(lesson),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                  leading: Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: isFree ? const Color(0xFF8B5CF6).withValues(alpha: 0.15) : Colors.grey.shade200,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        lesson['number'],
                        style: TextStyle(
                          fontFamily: 'Kalameh',
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isFree ? const Color(0xFF8B5CF6) : Colors.grey.shade600,
                        ),
                      ),
                    ),
                  ),
                  title: Text(
                    lesson['title'],
                    style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                  ),
                  subtitle: Text(
                    lesson['duration'],
                    style: const TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Color(0xFF6B7280)),
                  ),
                  trailing: isFree
                      ? Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.play_circle_fill_rounded, size: 14, color: Color(0xFF10B981)),
                              SizedBox(width: 4),
                              Text('مشاهده', style: TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                            ],
                          ),
                        )
                      : Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade200,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.lock_rounded, size: 14, color: Color(0xFF9CA3AF)),
                        ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildStatPill(String text) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 2),
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: const TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Color(0xFF4B5563), fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
