import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../screens/chat_sheet.dart';

class RatingPromptDialog extends StatefulWidget {
  final String packageName;

  const RatingPromptDialog({
    super.key,
    this.packageName = 'ir.xiaomismart.store',
  });

  static Future<void> showIfNeeded(BuildContext context, {String packageName = 'ir.xiaomismart.store'}) async {
    final prefs = await SharedPreferences.getInstance();
    final alreadyRated = prefs.getBool('app_rated') ?? false;
    if (alreadyRated) return;

    if (!context.mounted) return;

    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => RatingPromptDialog(packageName: packageName),
    );
  }

  static void showForce(BuildContext context, {String packageName = 'ir.xiaomismart.store'}) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => RatingPromptDialog(packageName: packageName),
    );
  }

  @override
  State<RatingPromptDialog> createState() => _RatingPromptDialogState();
}

class _RatingPromptDialogState extends State<RatingPromptDialog> {
  int _selectedStars = 5;

  Future<void> _openStore(String storeType) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('app_rated', true);

    String url = '';
    String fallbackWeb = '';

    if (storeType == 'bazaar') {
      url = 'bazaar://details?id=${widget.packageName}';
      fallbackWeb = 'https://cafebazaar.ir/app/${widget.packageName}';
    } else {
      url = 'myket://details?id=${widget.packageName}';
      fallbackWeb = 'https://myket.ir/app/${widget.packageName}';
    }

    try {
      final uri = Uri.parse(url);
      final canLaunch = await canLaunchUrl(uri);
      if (canLaunch) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        await launchUrl(Uri.parse(fallbackWeb), mode: LaunchMode.externalApplication);
      }
    } catch (_) {
      await launchUrl(Uri.parse(fallbackWeb), mode: LaunchMode.externalApplication);
    }

    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    String reactionText = 'عالی بود! خیلی راضی هستم 😍';
    if (_selectedStars == 4) {
      reactionText = 'خوب و رضایت‌بخش بود 👍';
    } else if (_selectedStars == 3) {
      reactionText = 'متوسط بود، جای بهتر شدن دارد 🙂';
    } else if (_selectedStars <= 2) {
      reactionText = 'راضی نبودم و انتقاد دارم 😔';
    }

    final isHighRating = _selectedStars >= 4;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        backgroundColor: Colors.white,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Badge Icon
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFF59E0B).withValues(alpha: 0.35),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Icon(Icons.star_rounded, color: Colors.white, size: 36),
              ),

              const SizedBox(height: 14),

              const Text(
                'نظر شما درباره اپلیکیشن ما چیست؟',
                style: TextStyle(
                  fontFamily: 'Kalameh',
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1F2937),
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 6),

              const Text(
                'با ثبت امتیاز و نظر، ما را در ارائه خدمات و تخفیف‌های بهتر یاری فرمایید:',
                style: TextStyle(
                  fontFamily: 'Kalameh',
                  fontSize: 11,
                  color: Color(0xFF6B7280),
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 14),

              // Interactive Stars
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (index) {
                  final starIndex = index + 1;
                  final isFilled = starIndex <= _selectedStars;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedStars = starIndex),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Icon(
                        isFilled ? Icons.star_rounded : Icons.star_outline_rounded,
                        color: isFilled ? const Color(0xFFF59E0B) : const Color(0xFFD1D5DB),
                        size: 34,
                      ),
                    ),
                  );
                }),
              ),

              const SizedBox(height: 8),

              Text(
                reactionText,
                style: const TextStyle(
                  fontFamily: 'Kalameh',
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF4B5563),
                ),
              ),

              const SizedBox(height: 18),

              if (isHighRating) ...[
                // Bazaar button
                SizedBox(
                  width: double.infinity,
                  height: 42,
                  child: ElevatedButton.icon(
                    onPressed: () => _openStore('bazaar'),
                    icon: const Icon(Icons.star_rounded, size: 18, color: Colors.white),
                    label: const Text(
                      'ثبت نظر ۵ ستاره در کافه‌بازار',
                      style: TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF16A34A),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                  ),
                ),

                const SizedBox(height: 8),

                // Myket button
                SizedBox(
                  width: double.infinity,
                  height: 40,
                  child: OutlinedButton(
                    onPressed: () => _openStore('myket'),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFE5E7EB)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text(
                      'ثبت نظر در مایکت',
                      style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF374151)),
                    ),
                  ),
                ),
              ] else ...[
                // Low rating -> Direct chat with support
                SizedBox(
                  width: double.infinity,
                  height: 42,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (context) => const ChatSheet(),
                      );
                    },
                    icon: const Icon(Icons.chat_bubble_outline_rounded, size: 18, color: Colors.white),
                    label: const Text(
                      'ارسال انتقاد و پیشنهاد به پشتیبانی',
                      style: TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEF394E),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                  ),
                ),
              ],

              const SizedBox(height: 6),

              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text(
                  'شاید بعداً',
                  style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Color(0xFF9CA3AF)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
