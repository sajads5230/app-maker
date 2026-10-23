import 'package:flutter/material.dart';

class B2BInquiryWidget extends StatelessWidget {
  final Map<String, dynamic> data;

  const B2BInquiryWidget({super.key, required this.data});

  void _showInquiryDialog(BuildContext context) {
    final companyController = TextEditingController();
    final personController = TextEditingController(text: 'سجاد براتی');
    final phoneController = TextEditingController(text: '09121234567');
    final quantityController = TextEditingController(text: '۵۰ عدد');
    final cityController = TextEditingController(text: 'تهران');
    final notesController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          titlePadding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
          contentPadding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
          title: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFFF97316).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.receipt_long_rounded, color: Color(0xFFF97316), size: 20),
              ),
              const SizedBox(width: 10),
              const Text(
                'درخواست پیش‌فاکتور رسمی B2B',
                style: TextStyle(fontFamily: 'Kalameh', fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'اطلاعات سازمان یا فروشگاه خود را جهت استعلام قیمت همکار و صدور پیش‌فاکتور با کد اقتصادی وارد فرمایید:',
                  style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF6B7280), height: 1.4),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: companyController,
                  decoration: InputDecoration(
                    labelText: 'نام شرکت / فروشگاه:',
                    labelStyle: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: personController,
                        decoration: InputDecoration(
                          labelText: 'نام رابط خرید:',
                          labelStyle: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: phoneController,
                        decoration: InputDecoration(
                          labelText: 'شماره تماس مستقیم:',
                          labelStyle: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: quantityController,
                        decoration: InputDecoration(
                          labelText: 'تیراژ تقریبی سفارش:',
                          labelStyle: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: cityController,
                        decoration: InputDecoration(
                          labelText: 'شهر مقصد باربری:',
                          labelStyle: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: notesController,
                  maxLines: 2,
                  decoration: InputDecoration(
                    labelText: 'اقلام مدنظر یا توضیحات تکمیلی:',
                    labelStyle: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'درخواست پیش‌فاکتور شما ثبت گردید! کارشناس فروش ظرف ۱ ساعت با شما تماس خواهد گرفت. کد پیگیری: RFQ-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
                            style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                          ),
                          backgroundColor: const Color(0xFF10B981),
                          duration: const Duration(seconds: 4),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF97316),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      elevation: 0,
                    ),
                    child: const Text('ثبت درخواست استعلام قیمت', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = data['title'] ?? 'استعلام قیمت عمده و پیش‌فاکتور شرکتی (B2B)';
    final subtitle = data['subtitle'] ?? 'صدور پیش‌فاکتور رسمی با کد اقتصادی ویژه سازمان‌ها و فروشگاه‌ها';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF0F172A).withValues(alpha: 0.2),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF97316).withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.precision_manufacturing_rounded, color: Color(0xFFFB923C), size: 22),
                ),
                const SizedBox(width: 12),
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
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        subtitle,
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF94A3B8)),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // Badges
            Row(
              children: [
                _buildBadge('🧾 صدور فاکتور رسمی'),
                const SizedBox(width: 6),
                _buildBadge('📦 تخفیف پله‌ای تیراژ'),
                const SizedBox(width: 6),
                _buildBadge('🚚 ارسال باربری سریع'),
              ],
            ),

            const SizedBox(height: 16),

            // Buttons
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: SizedBox(
                    height: 40,
                    child: ElevatedButton.icon(
                      onPressed: () => _showInquiryDialog(context),
                      icon: const Icon(Icons.request_quote_rounded, size: 16),
                      label: const Text(
                        'درخواست پیش‌فاکتور و استعلام قیمت',
                        style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF97316),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 2,
                  child: SizedBox(
                    height: 40,
                    child: OutlinedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('کاتالوگ جامع صنعتی ۲۰۲۶ (فایل PDF) دانلود شد 📑', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                            backgroundColor: Color(0xFF3B82F6),
                          ),
                        );
                      },
                      icon: const Icon(Icons.picture_as_pdf_rounded, size: 16, color: Color(0xFF60A5FA)),
                      label: const Text(
                        'کاتالوگ PDF',
                        style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Colors.white),
                      ),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF334155)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
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

  Widget _buildBadge(String text) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
        decoration: BoxDecoration(
          color: const Color(0xFF334155).withValues(alpha: 0.6),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFF475569).withValues(alpha: 0.4)),
        ),
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: const TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Color(0xFFE2E8F0), fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
