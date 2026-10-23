import 'package:flutter/material.dart';
import '../core/services/localization_service.dart';

class LanguageCurrencySheet extends StatelessWidget {
  const LanguageCurrencySheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const LanguageCurrencySheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = LocalizationService();

    return ListenableBuilder(
      listenable: loc,
      builder: (context, _) => Directionality(
        textDirection: loc.isRTL ? TextDirection.rtl : TextDirection.ltr,
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
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
                  decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                ),
              ),

              // Title
              Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.language_rounded, color: Color(0xFF6366F1), size: 22),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        loc.t('language_switcher'),
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                      ),
                      const Text(
                        'زبان نمایش و واحد ارزی قیمت‌ها',
                        style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF6B7280)),
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 18),

              // 1. Language Options
              const Text(
                'زبان اپلیکیشن (Language):',
                style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF374151)),
              ),
              const SizedBox(height: 8),

              Row(
                children: [
                  _buildLangOption(
                    context,
                    loc,
                    flag: '🇮🇷',
                    title: 'فارسی',
                    subtitle: 'Persian (RTL)',
                    code: 'fa',
                  ),
                  const SizedBox(width: 8),
                  _buildLangOption(
                    context,
                    loc,
                    flag: '🇬🇧',
                    title: 'English',
                    subtitle: 'English (LTR)',
                    code: 'en',
                  ),
                  const SizedBox(width: 8),
                  _buildLangOption(
                    context,
                    loc,
                    flag: '🇦🇪',
                    title: 'العربية',
                    subtitle: 'Arabic (RTL)',
                    code: 'ar',
                  ),
                ],
              ),

              const SizedBox(height: 18),

              // 2. Currency Options
              const Text(
                'واحد پول (Currency):',
                style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF374151)),
              ),
              const SizedBox(height: 8),

              Row(
                children: [
                  _buildCurrencyOption(
                    context,
                    loc,
                    symbol: 'تومان',
                    name: 'تومان ایران',
                    code: 'IRT',
                  ),
                  const SizedBox(width: 8),
                  _buildCurrencyOption(
                    context,
                    loc,
                    symbol: '\$',
                    name: 'USD Dollar',
                    code: 'USD',
                  ),
                  const SizedBox(width: 8),
                  _buildCurrencyOption(
                    context,
                    loc,
                    symbol: 'د.إ',
                    name: 'درهم امارات',
                    code: 'AED',
                  ),
                ],
              ),

              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                height: 42,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1F2937),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: const Text('تأیید و ذخیره تنظیمات', style: TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLangOption(
    BuildContext context,
    LocalizationService loc, {
    required String flag,
    required String title,
    required String subtitle,
    required String code,
  }) {
    final isSelected = loc.currentLocale == code;
    return Expanded(
      child: GestureDetector(
        onTap: () => loc.setLocale(code),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFEEF2FF) : const Color(0xFFF9FAFB),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSelected ? const Color(0xFF6366F1) : const Color(0xFFE5E7EB)),
          ),
          child: Column(
            children: [
              Text(flag, style: const TextStyle(fontSize: 20)),
              const SizedBox(height: 4),
              Text(
                title,
                style: TextStyle(
                  fontFamily: 'Kalameh',
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  color: isSelected ? const Color(0xFF4338CA) : const Color(0xFF1F2937),
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(fontFamily: 'Kalameh', fontSize: 8, color: Color(0xFF6B7280)),
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCurrencyOption(
    BuildContext context,
    LocalizationService loc, {
    required String symbol,
    required String name,
    required String code,
  }) {
    final isSelected = loc.currentCurrency == code;
    return Expanded(
      child: GestureDetector(
        onTap: () => loc.setCurrency(code),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFECFDF5) : const Color(0xFFF9FAFB),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSelected ? const Color(0xFF10B981) : const Color(0xFFE5E7EB)),
          ),
          child: Column(
            children: [
              Text(
                symbol,
                style: TextStyle(
                  fontFamily: 'Kalameh',
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? const Color(0xFF047857) : const Color(0xFF374151),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                name,
                style: const TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Color(0xFF6B7280)),
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
