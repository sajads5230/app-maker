import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class AdBannerWidget extends StatefulWidget {
  final Map<String, dynamic> data;

  const AdBannerWidget({super.key, required this.data});

  @override
  State<AdBannerWidget> createState() => _AdBannerWidgetState();
}

class _AdBannerWidgetState extends State<AdBannerWidget> {
  bool _isDismissed = false;

  @override
  Widget build(BuildContext context) {
    if (_isDismissed) return const SizedBox.shrink();

    final title = widget.data['title'] ?? 'سامانه سرمایه‌گذاری هوشمند و افتتاح حساب آنلاین';
    final sponsor = widget.data['sponsor'] ?? 'اسپانسر ویژه • شبکه تبلیغات تپسل';
    final actionText = widget.data['buttonText'] ?? 'نصب و دریافت هدیه';
    final actionUrl = widget.data['actionUrl'] ?? 'https://tapsell.ir';
    final imageUrl = widget.data['imageUrl'] ?? 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&h=120&fit=crop';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Ad Badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: const Color(0xFFFDE68A)),
                      ),
                      child: const Text(
                        'آگهی',
                        style: TextStyle(fontFamily: 'Kalameh', fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFFB45309)),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      sponsor,
                      style: const TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Color(0xFF94A3B8)),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () => setState(() => _isDismissed = true),
                  child: const Icon(Icons.close_rounded, size: 16, color: Color(0xFF94A3B8)),
                ),
              ],
            ),

            const SizedBox(height: 8),

            Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.network(
                    imageUrl,
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                  ),
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
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1E293B),
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'دارای مجوز رسمی از بانک مرکزی و سازمان بورس',
                        style: TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                SizedBox(
                  height: 34,
                  child: ElevatedButton(
                    onPressed: () async {
                      try {
                        await launchUrl(Uri.parse(actionUrl), mode: LaunchMode.externalApplication);
                      } catch (_) {}
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0284C7),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      elevation: 0,
                    ),
                    child: Text(
                      actionText,
                      style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
