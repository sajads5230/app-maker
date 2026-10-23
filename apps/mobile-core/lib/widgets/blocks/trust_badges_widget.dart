import 'package:flutter/material.dart';

class TrustBadgesWidget extends StatelessWidget {
  final Map<String, dynamic> data;

  const TrustBadgesWidget({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final title = data['title'] as String?;
    final items = data['items'] as List<dynamic>? ?? [
      {'title': 'ضمانت ۱۰۰٪ اصالت', 'desc': 'تضمین اصالت برند شیائومی', 'icon': 'shield'},
      {'title': 'ارسال سریع سراسری', 'desc': 'تحویل اکسپرس با پست پیشتاز', 'icon': 'shipping'},
      {'title': '۷ روز مهلت تست', 'desc': 'ضمانت بازگشت بی قید و شرط', 'icon': 'return'},
      {'title': 'پرداخت امن شاپرک', 'desc': 'درگاه مستقیم بانکی شتاب', 'icon': 'payment'},
      {'title': 'پشتیبانی ۲۴ ساعته', 'desc': 'پاسخگویی آنلاین و تلفنی', 'icon': 'support'},
    ];

    if (items.isEmpty) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
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
          if (title != null && title.isNotEmpty) ...[
            Padding(
              padding: const EdgeInsets.only(bottom: 10, right: 4),
              child: Text(
                title,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
              ),
            ),
          ],
          SizedBox(
            height: 72,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemBuilder: (context, index) {
                final item = items[index] as Map<String, dynamic>;
                final itemTitle = item['title'] ?? '';
                final itemDesc = item['desc'] ?? '';
                final iconType = item['icon'] ?? 'shield';

                return Container(
                  width: 130,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9FAFB),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFF3F4F6)),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: const Color(0xFFEF394E).withValues(alpha: 0.1),
                        child: Icon(_getIcon(iconType), size: 16, color: const Color(0xFFEF394E)),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              itemTitle,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              itemDesc,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(fontSize: 8.5, color: Colors.grey.shade500),
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
        ],
      ),
    );
  }

  IconData _getIcon(String type) {
    switch (type) {
      case 'shipping':
        return Icons.local_shipping_outlined;
      case 'return':
        return Icons.assignment_return_outlined;
      case 'payment':
        return Icons.credit_card_outlined;
      case 'support':
        return Icons.headset_mic_outlined;
      case 'shield':
      default:
        return Icons.verified_user_outlined;
    }
  }
}
