import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocalizationService extends ChangeNotifier {
  static final LocalizationService _instance = LocalizationService._internal();
  factory LocalizationService() => _instance;
  LocalizationService._internal();

  String _currentLocale = 'fa'; // 'fa', 'en', 'ar'
  String get currentLocale => _currentLocale;

  String _currentCurrency = 'IRT'; // 'IRT' (Toman), 'USD' ($), 'AED' (د.إ)
  String get currentCurrency => _currentCurrency;

  bool get isRTL => _currentLocale == 'fa' || _currentLocale == 'ar';

  // Currency Exchange Rates (Base: Tomans)
  static const double rateUSD = 65000.0;
  static const double rateAED = 17700.0;

  final Map<String, Map<String, String>> _translations = {
    'fa': {
      'home': 'ویترین',
      'categories': 'ژورنال',
      'cart': 'سبد خرید',
      'profile': 'حساب من',
      'search_placeholder': 'جستجو در بین محصولات...',
      'add_to_cart': 'افزودن به سبد خرید',
      'checkout': 'تکمیل سفارش و تسویه',
      'total': 'مبلغ کل:',
      'offline_banner': 'حالت مرور آفلاین فعال است (داده‌های ذخیره شده در حافظه گوشی)',
      'online_restored': 'اتصال به اینترنت برقرار شد',
      'currency_name': 'تومان',
      'language_switcher': 'تغییر زبان برنامه',
      'currency_switcher': 'انتخاب واحد پول',
      'empty_cart': 'سبد خرید شما خالی است',
      'orders': 'سفارش‌های من',
      'support': 'پشتیبانی و تماس سریع',
      'bazaar_rating': 'ثبت امتیاز در کافه‌بازار و مایکت',
    },
    'en': {
      'home': 'Storefront',
      'categories': 'Catalog',
      'cart': 'Cart',
      'profile': 'Account',
      'search_placeholder': 'Search products...',
      'add_to_cart': 'Add to Cart',
      'checkout': 'Proceed to Checkout',
      'total': 'Total Amount:',
      'offline_banner': 'Offline browsing active (Viewing local cached data)',
      'online_restored': 'Internet connection restored',
      'currency_name': 'USD',
      'language_switcher': 'Change Language',
      'currency_switcher': 'Select Currency',
      'empty_cart': 'Your shopping cart is empty',
      'orders': 'My Orders',
      'support': 'Support & Live Chat',
      'bazaar_rating': 'Rate our App on App Store',
    },
    'ar': {
      'home': 'الرئيسية',
      'categories': 'الأقسام',
      'cart': 'سلة المشتريات',
      'profile': 'حسابي',
      'search_placeholder': 'البحث عن المنتجات...',
      'add_to_cart': 'إضافة إلى السلة',
      'checkout': 'إتمام الشراء والدفع',
      'total': 'المجموع الكلي:',
      'offline_banner': 'وضع التصفح بدون إنترنت (عرض البيانات المحفوظة محلياً)',
      'online_restored': 'تمت استعادة الاتصال بالإنترنت',
      'currency_name': 'درهم',
      'language_switcher': 'تغيير لغة التطبيق',
      'currency_switcher': 'اختيار العملة',
      'empty_cart': 'سلة المشتريات فارغة',
      'orders': 'طلباتي السابقة',
      'support': 'الدعم والمساعدة المباشرة',
      'bazaar_rating': 'تقييم التطبيق ۵ نجوم',
    },
  };

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _currentLocale = prefs.getString('pref_locale') ?? 'fa';
    _currentCurrency = prefs.getString('pref_currency') ?? 'IRT';
    notifyListeners();
  }

  Future<void> setLocale(String locale) async {
    if (_currentLocale == locale) return;
    _currentLocale = locale;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('pref_locale', locale);
    notifyListeners();
  }

  Future<void> setCurrency(String currency) async {
    if (_currentCurrency == currency) return;
    _currentCurrency = currency;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('pref_currency', currency);
    notifyListeners();
  }

  String t(String key) {
    return _translations[_currentLocale]?[key] ?? _translations['fa']?[key] ?? key;
  }

  /// Converts Tomans price into selected currency and formats with sign
  String formatPrice(double priceInTomans) {
    final formatter = NumberFormat("#,##0", "en_US");

    if (_currentCurrency == 'USD') {
      final usd = priceInTomans / rateUSD;
      return '\$${usd.toStringAsFixed(usd >= 10 ? 0 : 2)}';
    } else if (_currentCurrency == 'AED') {
      final aed = priceInTomans / rateAED;
      return '${formatter.format(aed.round())} د.إ';
    } else {
      // Default: Tomans (Persian format)
      final iranFormatter = NumberFormat("#,###", "fa_IR");
      return '${iranFormatter.format(priceInTomans.round())} تومان';
    }
  }
}
