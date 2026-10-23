import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../screens/chat_sheet.dart';

class SupportSheet extends StatelessWidget {
  final String phone;
  final String eitaaUsername;
  final String telegramUsername;
  final String whatsappNumber;

  const SupportSheet({
    super.key,
    this.phone = '02191000000',
    this.eitaaUsername = 'xiaomi_smart',
    this.telegramUsername = 'xiaomismart_support',
    this.whatsappNumber = '+989120000000',
  });

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const SupportSheet(),
    );
  }

  Future<void> _launch(String urlString) async {
    final uri = Uri.parse(urlString);
    try {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {
      // Fallback
    }
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),

            // Header with badge
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.support_agent_rounded, color: Color(0xFF10B981), size: 26),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Text(
                            'پشتیبانی و ارتباط سریع',
                            style: TextStyle(
                              fontFamily: 'Kalameh',
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF1F2937),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircleAvatar(radius: 3, backgroundColor: Color(0xFF10B981)),
                                SizedBox(width: 4),
                                Text(
                                  'پاسخگویی آنلاین',
                                  style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF10B981), fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'همه‌روزه از ۹ صبح تا ۹ شب پاسخگوی شما هستیم',
                        style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Color(0xFF6B7280)),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // 1. Direct Phone Call
            _buildOptionTile(
              icon: Icons.phone_in_talk_rounded,
              iconColor: const Color(0xFF3B82F6),
              title: 'تماس تلفنی مستقیم با واحد پشتیبانی',
              subtitle: 'شماره تلفن مستقیم: $phone',
              onTap: () {
                Navigator.pop(context);
                _launch('tel:$phone');
              },
            ),

            const SizedBox(height: 10),

            // 2. In-App Live Chat
            _buildOptionTile(
              icon: Icons.chat_bubble_outline_rounded,
              iconColor: const Color(0xFFEF394E),
              title: 'گفتگوی آنلاین درون‌برنامه‌ای',
              subtitle: 'ارسال پیام متنی و پیگیری سفارش با کارشناس',
              badge: 'پیشنهادی',
              onTap: () {
                Navigator.pop(context);
                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  backgroundColor: Colors.transparent,
                  builder: (context) => const ChatSheet(),
                );
              },
            ),

            const SizedBox(height: 10),

            // 3. Eitaa Messenger
            _buildOptionTile(
              icon: Icons.send_rounded,
              iconColor: const Color(0xFFF97316),
              title: 'ارسال پیام در پیام‌رسان ایتا (Eitaa)',
              subtitle: 'کانال و پشتیبانی رسمی ایتا: @$eitaaUsername',
              onTap: () {
                Navigator.pop(context);
                _launch('https://eitaa.com/$eitaaUsername');
              },
            ),

            const SizedBox(height: 10),

            // 4. Telegram & WhatsApp Grid
            Row(
              children: [
                Expanded(
                  child: _buildCompactTile(
                    title: 'تلگرام',
                    subtitle: '@$telegramUsername',
                    icon: Icons.near_me_rounded,
                    iconColor: const Color(0xFF0284C7),
                    onTap: () {
                      Navigator.pop(context);
                      _launch('https://t.me/$telegramUsername');
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildCompactTile(
                    title: 'واتس‌اپ',
                    subtitle: 'پیام مستقیم',
                    icon: Icons.message_rounded,
                    iconColor: const Color(0xFF16A34A),
                    onTap: () {
                      Navigator.pop(context);
                      final clean = whatsappNumber.replaceAll(RegExp(r'[^0-9]'), '');
                      _launch('https://wa.me/$clean');
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOptionTile({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    String? badge,
    required VoidCallback onTap,
  }) {
    return Material(
      color: const Color(0xFFF9FAFB),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontFamily: 'Kalameh',
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                          ),
                        ),
                        if (badge != null) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEF394E),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              badge,
                              style: const TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF6B7280)),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_back_ios_new_rounded, size: 14, color: Color(0xFF9CA3AF)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCompactTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return Material(
      color: const Color(0xFFF9FAFB),
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: iconColor, size: 18),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontFamily: 'Kalameh',
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1F2937),
                      ),
                    ),
                    Text(
                      subtitle,
                      style: const TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Color(0xFF6B7280)),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
