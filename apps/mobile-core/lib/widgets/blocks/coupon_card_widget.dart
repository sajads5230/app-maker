import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class CouponCardWidget extends StatelessWidget {
  final Map<String, dynamic> data;

  const CouponCardWidget({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final title = (data['title'] ?? 'کد تخفیف اختصاصی کاربران اپلیکیشن').toString();
    final code = (data['code'] ?? 'APP20').toString();
    final discount = (data['discount'] ?? '۲۰٪ تخفیف').toString();
    final desc = (data['desc'] ?? 'قابل استفاده روی تمامی سبدهای خرید بدون محدودیت').toString();
    final expiry = (data['expiry'] ?? 'مهلت استفاده: تا پایان این ماه').toString();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7ED),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDBA74), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF97316).withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF97316),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.confirmation_num_outlined, size: 16, color: Colors.white),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF9A3412)),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFF97316).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  discount,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFFC2410C)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            style: const TextStyle(fontSize: 11, color: Color(0xFF7C2D12), height: 1.4),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                expiry,
                style: const TextStyle(fontSize: 9.5, color: Color(0xFF9A3412)),
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEA580C),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  elevation: 0,
                ),
                icon: const Icon(Icons.copy, size: 14),
                label: Text(
                  'کپی: $code',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                ),
                onPressed: () {
                  Clipboard.setData(ClipboardData(text: code));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('کد تخفیف $code با موفقیت کپی شد! در سبد خرید اعمال کنید. 🎟️', style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                      backgroundColor: const Color(0xFF10B981),
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}
