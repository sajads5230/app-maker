import 'package:flutter/material.dart';

class FaqAccordionWidget extends StatefulWidget {
  final Map<String, dynamic> data;

  const FaqAccordionWidget({super.key, required this.data});

  @override
  State<FaqAccordionWidget> createState() => _FaqAccordionWidgetState();
}

class _FaqAccordionWidgetState extends State<FaqAccordionWidget> {
  final Set<int> _expandedIndices = {};

  @override
  Widget build(BuildContext context) {
    final title = (widget.data['title'] ?? 'پرسش‌های متداول خریداران').toString();
    final items = widget.data['items'] as List<dynamic>? ?? [
      {
        'q': 'چگونه از اصل بودن کالاهای شیائومی مطمئن شوم؟',
        'a': 'تمامی محصولات فروشگاه شیائومی اسمارت دارای هولوگرام رسمی اصالت و گارانتی معتبر شرکتی بوده و امکان استعلام سریال در وبسایت رسمی وجود دارد.',
      },
      {
        'q': 'ارسال سفارش‌ها چقدر زمان می‌برد؟',
        'a': 'سفارش‌های تهران همان روز با پیک فوری و سفارش‌های سراسر کشور ظرف ۲۴ تا ۴۸ ساعت کاری با پست پیشتاز یا تیپاکس تحویل داده می‌شوند.',
      },
      {
        'q': 'شرایط ضمانت بازگشت ۷ روزه کالا چیست؟',
        'a': 'در صورت وجود هرگونه مغایرت، خرابی یا عدم رضایت، می‌توانید تا ۷ روز پس از دریافت با پشتیبانی تماس گرفته و کالا را بدون قید و شرط مرجوع نمایید.',
      },
    ];

    if (items.isEmpty) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.help_outline_rounded, size: 18, color: Color(0xFFEF394E)),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...items.asMap().entries.map((entry) {
            final idx = entry.key;
            final item = entry.value as Map<String, dynamic>;
            final question = (item['q'] ?? item['question'] ?? '').toString();
            final answer = (item['a'] ?? item['answer'] ?? '').toString();
            final isExpanded = _expandedIndices.contains(idx);

            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(
                color: isExpanded ? const Color(0xFFF9FAFB) : Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: isExpanded ? const Color(0xFFE5E7EB) : const Color(0xFFF3F4F6)),
              ),
              child: Theme(
                data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                child: ExpansionTile(
                  key: PageStorageKey('faq_$idx'),
                  initiallyExpanded: isExpanded,
                  onExpansionChanged: (expanded) {
                    setState(() {
                      if (expanded) {
                        _expandedIndices.add(idx);
                      } else {
                        _expandedIndices.remove(idx);
                      }
                    });
                  },
                  tilePadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
                  childrenPadding: const EdgeInsets.fromLTRB(14, 0, 14, 12),
                  leading: CircleAvatar(
                    radius: 12,
                    backgroundColor: const Color(0xFFEF394E).withValues(alpha: 0.1),
                    child: Text('${idx + 1}', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFEF394E))),
                  ),
                  title: Text(
                    question,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: isExpanded ? FontWeight.bold : FontWeight.w600,
                      color: isExpanded ? const Color(0xFFEF394E) : const Color(0xFF1F2937),
                    ),
                  ),
                  children: [
                    Text(
                      answer,
                      style: const TextStyle(fontSize: 10.5, color: Color(0xFF4B5563), height: 1.5),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
