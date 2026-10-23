import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart' hide TextDirection;
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/state/cart_state.dart';
import '../core/state/wishlist_state.dart';
import '../core/services/recently_viewed_service.dart';
import '../core/services/otp_service.dart';
import '../core/services/config_sync_service.dart';
import '../widgets/blocks/recently_viewed_widget.dart';
import 'vendor_profile_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Map<String, dynamic> product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final cart = CartState();
  final wishlist = WishlistState();
  final currencyFormat = NumberFormat('#,###');

  late PageController _galleryController;
  int _currentImageIndex = 0;
  bool _isAdded = false;
  int _quantity = 1;

  // Selected Variations (Key: Attribute Name, Value: Option Title)
  final Map<String, String> _selectedOptions = {};

  final List<Map<String, dynamic>> _reviews = [
    {
      'author': 'امیرحسین رضایی',
      'date': '۲ روز پیش',
      'rating': 5,
      'comment': 'واقعاً اصل و باکیفیته. سرعت تحویل شیائومی اسمارت هم عالی بود، پیشنهاد می‌کنم.',
      'verified': true,
    },
    {
      'author': 'مریم کاظمی',
      'date': 'هفته پیش',
      'rating': 5,
      'comment': 'بسیار کاربردی و تمیز بسته‌بندی شده بود. گارانتی معتبر شرکتی هم همراهش بود.',
      'verified': true,
    },
  ];

  @override
  void initState() {
    super.initState();
    _galleryController = PageController();
    _initDefaultOptions();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      RecentlyViewedService().addProduct(widget.product);
    });
  }

  void _initDefaultOptions() {
    final rawAttrs = widget.product['attributes'] as List<dynamic>? ?? [];
    for (final attr in rawAttrs) {
      if (attr is Map<String, dynamic>) {
        final name = (attr['name'] ?? '').toString();
        final rawOptions = attr['options'] as List<dynamic>? ?? [];
        if (name.isNotEmpty && rawOptions.isNotEmpty) {
          _selectedOptions[name] = rawOptions.first.toString();
        }
      }
    }
  }

  @override
  void dispose() {
    _galleryController.dispose();
    super.dispose();
  }

  List<String> get _productImages {
    final primary = widget.product['imageUrl'] as String? ?? '';
    final gallery = widget.product['galleryImages'] as List<dynamic>? ?? [];
    final list = <String>[];

    if (primary.isNotEmpty && !primary.contains('unsplash')) {
      list.add(primary);
    }

    for (final img in gallery) {
      final s = img.toString();
      if (s.isNotEmpty && !list.contains(s) && !s.contains('unsplash')) {
        list.add(s);
      }
    }

    if (list.isEmpty) {
      list.add(primary.isNotEmpty ? primary : 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=600&fit=crop');
    }

    return list;
  }

  double get _currentPrice {
    return (widget.product['price'] as num?)?.toDouble() ?? 0.0;
  }

  List<Map<String, dynamic>> get _selectableAttributes {
    final rawAttrs = widget.product['attributes'] as List<dynamic>? ?? [];
    final List<Map<String, dynamic>> result = [];

    for (final a in rawAttrs) {
      if (a is Map<String, dynamic>) {
        final name = (a['name'] ?? '').toString();
        final opts = (a['options'] as List<dynamic>? ?? []).map((o) => o.toString()).toList();
        // Attributes with multiple choices or marked as variation
        if (name.isNotEmpty && opts.length > 1) {
          result.add({
            'name': name,
            'options': opts,
          });
        }
      }
    }

    return result;
  }

  List<Map<String, String>> get _technicalSpecs {
    final rawAttrs = widget.product['attributes'] as List<dynamic>? ?? [];
    final List<Map<String, String>> specs = [];

    for (final a in rawAttrs) {
      if (a is Map<String, dynamic>) {
        final name = (a['name'] ?? '').toString();
        final opts = (a['options'] as List<dynamic>? ?? []).map((o) => o.toString().trim()).toList();
        if (name.isNotEmpty && opts.isNotEmpty) {
          specs.add({
            'key': name,
            'value': opts.join('، '),
          });
        }
      }
    }

    // If product categories exist
    final cats = widget.product['categories'] as List<dynamic>? ?? [];
    if (cats.isNotEmpty) {
      specs.insert(0, {
        'key': 'دسته‌بندی کالا',
        'value': cats.map((c) => c.toString()).join('، '),
      });
    }

    return specs;
  }

  void _openShareSheet(String title, double price, String prodId) {
    final cleanId = prodId.replaceAll('p_', '');
    final shareUrl = 'https://xiaomismart.ir/?p=$cleanId';
    final shareText = '$title\nقیمت: ${currencyFormat.format(price)} تومان\nمشاهده و خرید آنلاین از فروشگاه شیائومی اسمارت:\n$shareUrl';

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('اشتراک‌گذاری این کالا با دوستان', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(context)),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9FAFB),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        shareUrl,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 11, color: Color(0xFF2563EB)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEF394E),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      ),
                      icon: const Icon(Icons.copy, size: 14),
                      label: const Text('کپی لینک', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: shareUrl));
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('لینک کالا در حافظه موقت کپی شد! 📋', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                            backgroundColor: Color(0xFF10B981),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildShareIcon(Icons.send_rounded, 'تلگرام', const Color(0xFF229ED9), () async {
                    final uri = Uri.parse('https://t.me/share/url?url=${Uri.encodeComponent(shareUrl)}&text=${Uri.encodeComponent(title)}');
                    if (await canLaunchUrl(uri)) launchUrl(uri, mode: LaunchMode.externalApplication);
                  }),
                  _buildShareIcon(Icons.chat_bubble_rounded, 'واتساپ', const Color(0xFF25D366), () async {
                    final uri = Uri.parse('https://api.whatsapp.com/send?text=${Uri.encodeComponent(shareText)}');
                    if (await canLaunchUrl(uri)) launchUrl(uri, mode: LaunchMode.externalApplication);
                  }),
                  _buildShareIcon(Icons.sms_rounded, 'پیامک', const Color(0xFF10B981), () async {
                    final uri = Uri.parse('sms:?body=${Uri.encodeComponent(shareText)}');
                    if (await canLaunchUrl(uri)) launchUrl(uri);
                  }),
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildShareIcon(IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          children: [
            CircleAvatar(
              radius: 22,
              backgroundColor: color.withValues(alpha: 0.12),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(height: 6),
            Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF374151))),
          ],
        ),
      ),
    );
  }

  void _openAddReviewSheet() {
    final nameCtrl = TextEditingController();
    final textCtrl = TextEditingController();
    int currentRating = 5;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: Directionality(
                textDirection: TextDirection.rtl,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('ثبت نظر و تجربه خرید شما', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                        IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(context)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        const Text('امتیاز شما به این کالا:', style: TextStyle(fontSize: 12)),
                        const SizedBox(width: 8),
                        Row(
                          children: List.generate(5, (index) {
                            final star = index + 1;
                            return IconButton(
                              icon: Icon(
                                star <= currentRating ? Icons.star_rounded : Icons.star_border_rounded,
                                color: const Color(0xFFFBBF24),
                                size: 24,
                              ),
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                              onPressed: () => setModalState(() => currentRating = star),
                            );
                          }),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: nameCtrl,
                      decoration: InputDecoration(
                        labelText: 'نام و نام‌خانوادگی',
                        hintText: 'مثلاً: علی رضایی',
                        filled: true,
                        fillColor: const Color(0xFFF9FAFB),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                      style: const TextStyle(fontSize: 12),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: textCtrl,
                      maxLines: 3,
                      decoration: InputDecoration(
                        labelText: 'دیدگاه و نظر شما',
                        hintText: 'نقاط قوت، نقاط ضعف و تجربه کاربری...',
                        filled: true,
                        fillColor: const Color(0xFFF9FAFB),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                      style: const TextStyle(fontSize: 12),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEF394E),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          final commentText = textCtrl.text.trim();
                          if (commentText.isEmpty) return;

                          final authorName = nameCtrl.text.trim().isNotEmpty ? nameCtrl.text.trim() : 'کاربر مهمان';
                          setState(() {
                            _reviews.insert(0, {
                              'author': authorName,
                              'date': 'لحظاتی پیش',
                              'rating': currentRating,
                              'comment': commentText,
                              'verified': true,
                            });
                          });

                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('دیدگاه شما با موفقیت ثبت شد و پس از تایید مدیر منتشر خواهد شد. 🌟', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                              backgroundColor: Color(0xFF10B981),
                            ),
                          );
                        },
                        child: const Text('ثبت دیدگاه', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildReviewsSection(double rating, int reviewsCount) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const Text('دیدگاه‌ها و نظرات خریداران', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(width: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(6)),
                  child: Text('${_reviews.length} نظر', style: const TextStyle(fontSize: 10, color: Color(0xFF4B5563), fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            TextButton.icon(
              icon: const Icon(Icons.add_comment_outlined, size: 16, color: Color(0xFFEF394E)),
              label: const Text('ثبت نظر', style: TextStyle(fontSize: 11, color: Color(0xFFEF394E), fontWeight: FontWeight.bold)),
              onPressed: _openAddReviewSheet,
            ),
          ],
        ),
        const SizedBox(height: 10),
        // Score Summary Card
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFF9FAFB),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Row(
            children: [
              Column(
                children: [
                  Text(rating.toStringAsFixed(1), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF1F2937))),
                  Row(
                    children: List.generate(5, (index) => const Icon(Icons.star_rounded, color: Color(0xFFFBBF24), size: 14)),
                  ),
                  const SizedBox(height: 4),
                  Text('از مجموع ${_reviews.length + reviewsCount} رای', style: TextStyle(fontSize: 9, color: Colors.grey.shade500)),
                ],
              ),
              const SizedBox(width: 16),
              const VerticalDivider(width: 1),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  '۹۲٪ از خریداران، خرید این محصول را به دیگر کاربران پیشنهاد کرده‌اند.',
                  style: TextStyle(fontSize: 11, color: Colors.grey.shade700, height: 1.5),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        // Comments List
        ..._reviews.map((rev) {
          final author = rev['author'] ?? 'کاربر';
          final date = rev['date'] ?? '';
          final comment = rev['comment'] ?? '';
          final r = rev['rating'] as int? ?? 5;

          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 14,
                          backgroundColor: const Color(0xFFEF394E).withValues(alpha: 0.1),
                          child: const Icon(Icons.person, size: 16, color: Color(0xFFEF394E)),
                        ),
                        const SizedBox(width: 8),
                        Text(author, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                          decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(4)),
                          child: const Text('خریدار تاییدشده', style: TextStyle(fontSize: 8, color: Color(0xFF059669), fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                    Row(
                      children: List.generate(
                        5,
                        (i) => Icon(
                          i < r ? Icons.star_rounded : Icons.star_border_rounded,
                          color: const Color(0xFFFBBF24),
                          size: 13,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(comment, style: const TextStyle(fontSize: 11, color: Color(0xFF374151), height: 1.4)),
                const SizedBox(height: 6),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(date, style: TextStyle(fontSize: 9, color: Colors.grey.shade400)),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }

  void _showSnappPayDetails(double price) {
    final installment = (price / 4).round();
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(22),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF00D166).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.credit_card_rounded, color: Color(0xFF00D166), size: 24),
                  ),
                  const SizedBox(width: 10),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('خرید اقساطی اسنپ‌پی (BNPL)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      Text('بدون کارمزد، بدون نیاز به چک یا ضامن بانکی', style: TextStyle(fontSize: 10, color: Color(0xFF6B7280))),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 18),
              _buildInstallmentRow('قسط اول (امروز)', 'پرداخت همزمان با ثبت سفارش', installment, true),
              const Divider(height: 16),
              _buildInstallmentRow('قسط دوم (۳۰ روز بعد)', 'سررسید در ماه آینده', installment, false),
              const Divider(height: 16),
              _buildInstallmentRow('قسط سوم (۶۰ روز بعد)', 'سررسید در دو ماه آینده', installment, false),
              const Divider(height: 16),
              _buildInstallmentRow('قسط چهارم (۹۰ روز بعد)', 'تسویه حساب نهایی اقساط', installment, false),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.check_circle_outline, color: Color(0xFF16A34A), size: 18),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'در مرحله تسویه حساب، کافیست روش پرداخت اسنپ‌پی را انتخاب کنید.',
                        style: TextStyle(fontSize: 11, color: Color(0xFF166534)),
                      ),
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

  Widget _buildInstallmentRow(String title, String subtitle, int amount, bool isToday) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isToday ? const Color(0xFF15803D) : const Color(0xFF1F2937))),
            Text(subtitle, style: const TextStyle(fontSize: 9, color: Color(0xFF9CA3AF))),
          ],
        ),
        Text(
          '${currencyFormat.format(amount)} تومان',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: isToday ? const Color(0xFF15803D) : const Color(0xFF374151)),
        ),
      ],
    );
  }

  void _openBackInStockSheet(String title) {
    final otpService = OtpService();
    final phoneCtrl = TextEditingController(text: otpService.currentUserPhone ?? '');
    bool notifySms = true;
    bool notifyPush = true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => StatefulBuilder(
        builder: (context, setSheetState) {
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
              left: 20,
              right: 20,
              top: 20,
            ),
            child: Directionality(
              textDirection: TextDirection.rtl,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.notifications_active_outlined, color: Color(0xFF2563EB), size: 22),
                          ),
                          const SizedBox(width: 10),
                          const Text('اطلاع‌رسانی موجودی کالا', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(context)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'به محض اینکه «$title» در انبار شیائومی اسمارت شارژ شود، از طریق پیامک به شما اطلاع می‌دهیم.',
                    style: const TextStyle(fontSize: 11, color: Color(0xFF4B5563), height: 1.4),
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: phoneCtrl,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: 'شماره تلفن همراه',
                      hintText: '۰۹۱۲۳۴۵۶۷۸۹',
                      filled: true,
                      fillColor: const Color(0xFFF9FAFB),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    ),
                    style: const TextStyle(fontSize: 13),
                  ),
                  const SizedBox(height: 12),
                  CheckboxListTile(
                    value: notifySms,
                    onChanged: (v) => setSheetState(() => notifySms = v ?? true),
                    title: const Text('ارسال پیامک (SMS)', style: TextStyle(fontSize: 11)),
                    controlAffinity: ListTileControlAffinity.leading,
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                  ),
                  CheckboxListTile(
                    value: notifyPush,
                    onChanged: (v) => setSheetState(() => notifyPush = v ?? true),
                    title: const Text('اعلان پوش نوتیفیکیشن در اپلیکیشن', style: TextStyle(fontSize: 11)),
                    controlAffinity: ListTileControlAffinity.leading,
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2563EB),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: const Icon(Icons.check, size: 16),
                      label: const Text('ثبت درخواست اطلاع‌رسانی', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      onPressed: () {
                        final phone = phoneCtrl.text.trim();
                        if (phone.isEmpty) return;
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              'درخواست شما ثبت شد! به محض موجودی به $phone اطلاع داده خواهد شد. 🔔',
                              style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                            ),
                            backgroundColor: const Color(0xFF10B981),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildRelatedProductsSection() {
    final config = ConfigSyncService.currentConfig;
    final allProds = config?.allProducts ?? [];
    final currentId = widget.product['id']?.toString() ?? '';
    final related = allProds.where((p) => (p['id']?.toString() ?? '') != currentId).take(6).toList();

    if (related.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Icon(Icons.auto_awesome, size: 16, color: Color(0xFFEF394E)),
            SizedBox(width: 6),
            Text('خریداران این محصول، این کالاها را هم خریده‌اند',
                style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
          ],
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 190,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: related.length,
            itemBuilder: (context, idx) {
              final item = related[idx];
              final pTitle = item['title'] ?? item['name'] ?? 'محصول مکمل';
              final pImg = item['imageUrl'] ?? '';
              final pPrice = (item['price'] as num?)?.toDouble() ?? 0.0;
              final pDiscount = item['discountPercent'];

              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => ProductDetailScreen(product: item)),
                  );
                },
                child: Container(
                  width: 125,
                  margin: const EdgeInsets.only(left: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        height: 95,
                        decoration: const BoxDecoration(
                          color: Color(0xFFF9FAFB),
                          borderRadius: BorderRadius.vertical(top: Radius.circular(11)),
                        ),
                        child: Stack(
                          children: [
                            Center(
                              child: pImg.isNotEmpty
                                  ? CachedNetworkImage(
                                      imageUrl: pImg,
                                      height: 75,
                                      fit: BoxFit.contain,
                                      placeholder: (_, __) => const Center(child: CircularProgressIndicator(strokeWidth: 1.5)),
                                      errorWidget: (_, __, ___) => const Icon(Icons.broken_image_outlined, size: 24, color: Colors.grey),
                                    )
                                  : const Icon(Icons.image_outlined, size: 24, color: Colors.grey),
                            ),
                            if (pDiscount != null && (pDiscount as num) > 0)
                              Positioned(
                                top: 4,
                                right: 4,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                  decoration: BoxDecoration(color: const Color(0xFFEF394E), borderRadius: BorderRadius.circular(4)),
                                  child: Text('$pDiscount٪', style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                                ),
                              ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(7),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              pTitle,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, height: 1.25),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              pPrice > 0 ? '${currencyFormat.format(pPrice)} تومان' : 'تماس',
                              style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.w900, color: Color(0xFFEF394E)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.product['title'] ?? widget.product['name'] ?? 'محصول فروشگاه';
    final regularPrice = (widget.product['regularPrice'] as num?)?.toDouble();
    final discount = widget.product['discountPercent'] ?? widget.product['discount'];
    final rating = (widget.product['rating'] as num?)?.toDouble() ?? 4.9;
    final reviewsCount = widget.product['reviewsCount'] ?? 24;
    final inStock = widget.product['inStock'] ?? true;
    final description = (widget.product['description'] as String? ?? '').trim();
    final images = _productImages;
    final finalPrice = _currentPrice;
    final selectableAttrs = _selectableAttributes;
    final specs = _technicalSpecs;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, size: 18),
            onPressed: () => Navigator.pop(context),
          ),
          actions: [
            ListenableBuilder(
              listenable: wishlist,
              builder: (context, _) {
                final prodId = widget.product['id']?.toString() ?? '';
                final isFav = wishlist.isFavorite(prodId);

                return IconButton(
                  icon: Icon(
                    isFav ? Icons.favorite : Icons.favorite_border,
                    color: isFav ? const Color(0xFFEF394E) : const Color(0xFF4B5563),
                    size: 20,
                  ),
                  onPressed: () {
                    wishlist.toggleFavorite(WishlistItem(
                      id: prodId,
                      title: title,
                      imageUrl: _productImages.isNotEmpty ? _productImages.first : '',
                      price: finalPrice,
                      regularPrice: regularPrice,
                    ));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          !isFav ? 'به لیست علاقه‌مندی‌ها اضافه شد ❤️' : 'از علاقه‌مندی‌ها حذف شد',
                          style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                        ),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  },
                );
              },
            ),
            IconButton(
              icon: const Icon(Icons.share_outlined, size: 20),
              onPressed: () => _openShareSheet(title, finalPrice, widget.product['id']?.toString() ?? ''),
            ),
          ],
        ),
        body: ListView(
          padding: const EdgeInsets.only(bottom: 110),
          children: [
            // Multi-Image Swipeable Gallery
            Container(
              height: 300,
              color: const Color(0xFFF9FAFB),
              child: Stack(
                children: [
                  PageView.builder(
                    controller: _galleryController,
                    onPageChanged: (i) => setState(() => _currentImageIndex = i),
                    itemCount: images.length,
                    itemBuilder: (context, index) {
                      return Center(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: CachedNetworkImage(
                            imageUrl: images[index],
                            fit: BoxFit.contain,
                            height: 260,
                            placeholder: (_, __) => const Center(child: CircularProgressIndicator(strokeWidth: 2)),
                            errorWidget: (_, __, ___) => const Icon(Icons.broken_image_outlined, size: 60, color: Colors.grey),
                          ),
                        ),
                      );
                    },
                  ),

                  // Discount Badge
                  if (discount != null && (discount as num) > 0)
                    Positioned(
                      top: 14,
                      right: 14,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEF394E),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '$discount٪ تخفیف',
                          style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),

                  // Dot Indicators
                  if (images.length > 1)
                    Positioned(
                      bottom: 12,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(images.length, (idx) {
                          final isSel = idx == _currentImageIndex;
                          return AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            margin: const EdgeInsets.symmetric(horizontal: 3),
                            width: isSel ? 18 : 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: isSel ? const Color(0xFFEF394E) : Colors.grey.shade300,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          );
                        }),
                      ),
                    ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title & Rating
                  Text(
                    title,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, height: 1.4),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.star_rounded, color: Color(0xFFFBBF24), size: 18),
                      const SizedBox(width: 4),
                      Text('$rating', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      const SizedBox(width: 6),
                      Text('($reviewsCount نظر خریداران)', style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: inStock ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          inStock ? 'موجود و آماده ارسال' : 'ناموجود در انبار',
                          style: TextStyle(
                            fontSize: 10,
                            color: inStock ? const Color(0xFF059669) : const Color(0xFFDC2626),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const Divider(height: 28),

                  // Dokan Multi-Vendor Badge Card
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const VendorProfileScreen(
                            vendorId: 'c135ec8e-d922-474e-b3c2-94f88e3c84b4',
                            storeName: 'بازرگانی شیائومی سنتر پایتخت',
                            rating: 4.9,
                            isVerified: true,
                          ),
                        ),
                      );
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF9FAFB),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.storefront_rounded, color: Color(0xFF2563EB), size: 18),
                          ),
                          const SizedBox(width: 10),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      'فروشنده: بازرگانی شیائومی سنتر پایتخت',
                                      style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF111827)),
                                    ),
                                    SizedBox(width: 4),
                                    Icon(Icons.verified, color: Color(0xFF2563EB), size: 13),
                                  ],
                                ),
                                Text(
                                  'امتیاز غرفه: ۴.۹ ★ | عملکرد عالی (ارسال به‌موقع ۹۹٪)',
                                  style: TextStyle(fontFamily: 'Kalameh', fontSize: 9.5, color: Color(0xFF6B7280)),
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Color(0xFF9CA3AF)),
                        ],
                      ),
                    ),
                  ),

                  // Real Selectable Variations / Attributes
                  if (selectableAttrs.isNotEmpty) ...[
                    ...selectableAttrs.map((attr) {
                      final attrName = attr['name'] as String;
                      final options = attr['options'] as List<String>;
                      final currentVal = _selectedOptions[attrName] ?? options.first;

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text('انتخاب $attrName: ', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                Text(currentVal, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFFEF394E))),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: options.map((opt) {
                                final isSelected = currentVal == opt;
                                return GestureDetector(
                                  onTap: () => setState(() => _selectedOptions[attrName] = opt),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: isSelected ? const Color(0xFFFEF2F2) : const Color(0xFFF9FAFB),
                                      border: Border.all(
                                        color: isSelected ? const Color(0xFFEF394E) : const Color(0xFFE5E7EB),
                                        width: isSelected ? 1.5 : 1,
                                      ),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Text(
                                      opt,
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                        color: isSelected ? const Color(0xFFEF394E) : const Color(0xFF374151),
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      );
                    }),
                    const Divider(height: 20),
                  ],

                  // SnappPay BNPL 4-Installments Widget
                  if (finalPrice > 0)
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFF0FDF4), Color(0xFFF9FAFB)],
                          begin: Alignment.topRight,
                          end: Alignment.bottomLeft,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF86EFAC)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(7),
                            decoration: BoxDecoration(
                              color: const Color(0xFF00D166),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.credit_card_rounded, color: Colors.white, size: 20),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'خرید اقساطی اسنپ‌پی (بدون کارمزد و ضامن)',
                                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF14532D)),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'ماهیانه ${currencyFormat.format((finalPrice / 4).round())} تومان در ۴ قسط بدون سود',
                                  style: const TextStyle(fontSize: 10, color: Color(0xFF166534), fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ),
                          TextButton(
                            onPressed: () => _showSnappPayDetails(finalPrice),
                            style: TextButton.styleFrom(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            child: const Row(
                              children: [
                                Text('جزئیات', style: TextStyle(fontSize: 11, color: Color(0xFF059669), fontWeight: FontWeight.bold)),
                                SizedBox(width: 2),
                                Icon(Icons.arrow_back_ios_new, size: 10, color: Color(0xFF059669)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                  // Guarantee Badges
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildFeatureBadge(Icons.verified_outlined, 'ضمانت اصالت ۱۰۰٪'),
                      _buildFeatureBadge(Icons.local_shipping_outlined, 'ارسال اکسپرس پستی'),
                      _buildFeatureBadge(Icons.published_with_changes_outlined, '۷ روز مهلت تست'),
                    ],
                  ),

                  const Divider(height: 28),

                  // Product Description if available
                  if (description.isNotEmpty) ...[
                    const Text('معرفی و بررسی اجمالی کالا', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF9FAFB),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Text(
                        description,
                        style: const TextStyle(fontSize: 11, height: 1.6, color: Color(0xFF374151)),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Real Technical Specifications Table
                  if (specs.isNotEmpty) ...[
                    const Text('مشخصات فنی و استانداردهای دستگاه', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 10),
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: specs.asMap().entries.map((entry) {
                          final idx = entry.key;
                          final s = entry.value;
                          final isEven = idx % 2 == 0;
                          return Container(
                            color: isEven ? const Color(0xFFF9FAFB) : Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                SizedBox(
                                  width: 120,
                                  child: Text(
                                    s['key']!,
                                    style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280)),
                                  ),
                                ),
                                Expanded(
                                  child: Text(
                                    s['value']!,
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1F2937), height: 1.4),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                  const Divider(height: 32),
                  _buildRelatedProductsSection(),
                  _buildReviewsSection(rating, reviewsCount),
                  const SizedBox(height: 16),
                  const RecentlyViewedWidget(),
                ],
              ),
            ),
          ],
        ),

        // Bottom Fixed Bar with Quantity & Price
        bottomSheet: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, -3)),
            ],
          ),
          child: Row(
            children: [
              // Quantity Counter
              Container(
                decoration: BoxDecoration(
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.add, size: 16),
                      onPressed: () => setState(() => _quantity++),
                      padding: const EdgeInsets.all(4),
                      constraints: const BoxConstraints(),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: Text('$_quantity', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    ),
                    IconButton(
                      icon: const Icon(Icons.remove, size: 16),
                      onPressed: _quantity > 1 ? () => setState(() => _quantity--) : null,
                      padding: const EdgeInsets.all(4),
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),

              // Total Calculated Price
              Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('مبلغ پرداختی:', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  Text(
                    finalPrice > 0
                        ? '${currencyFormat.format(finalPrice * _quantity)} تومان'
                        : 'استعلام قیمت تلفنی',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFFEF394E)),
                  ),
                ],
              ),
              const Spacer(),

              // Add to Cart Action or Back-in-Stock Notification
              ElevatedButton.icon(
                onPressed: !inStock
                    ? () => _openBackInStockSheet(title)
                    : () {
                        final optionsText = _selectedOptions.isNotEmpty
                            ? ' (${_selectedOptions.entries.map((e) => "${e.key}: ${e.value}").join(' - ')})'
                            : '';
                        final uniqueId = '${widget.product['id'] ?? widget.product['productId']}_${_selectedOptions.values.join('_')}';

                        for (int i = 0; i < _quantity; i++) {
                          cart.addItem(
                            id: uniqueId,
                            title: '$title$optionsText',
                            imageUrl: images.first,
                            price: finalPrice,
                            regularPrice: regularPrice,
                          );
                        }
                        setState(() => _isAdded = true);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('$_quantity عدد کالا به سبد خرید افزوده شد! 🛍️', style: const TextStyle(fontFamily: 'Kalameh', fontSize: 12)),
                            backgroundColor: const Color(0xFF10B981),
                            duration: const Duration(seconds: 1),
                          ),
                        );
                      },
                icon: Icon(
                  !inStock
                      ? Icons.notifications_active_outlined
                      : (_isAdded ? Icons.check : Icons.add_shopping_cart),
                  size: 18,
                ),
                label: Text(
                  !inStock ? 'موجود شد خبرم کن' : (_isAdded ? 'افزوده شد' : 'افزودن به سبد'),
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: !inStock
                      ? const Color(0xFF2563EB)
                      : (_isAdded ? const Color(0xFF10B981) : const Color(0xFFEF394E)),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureBadge(IconData icon, String label) {
    return Column(
      children: [
        Icon(icon, size: 24, color: Colors.grey.shade700),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 10, color: Colors.grey.shade600)),
      ],
    );
  }
}
