import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/services/otp_service.dart';
import '../core/state/wishlist_state.dart';
import '../widgets/otp_login_dialog.dart';
import '../widgets/lucky_wheel_dialog.dart';
import '../widgets/rating_prompt_dialog.dart';
import '../widgets/language_currency_sheet.dart';
import 'wishlist_screen.dart';
import 'chat_sheet.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final otpService = OtpService();
  final wishlist = WishlistState();

  @override
  void initState() {
    super.initState();
    otpService.addListener(_onAuthChanged);
    wishlist.addListener(_onAuthChanged);
  }

  @override
  void dispose() {
    otpService.removeListener(_onAuthChanged);
    wishlist.removeListener(_onAuthChanged);
    super.dispose();
  }

  void _onAuthChanged() {
    if (mounted) setState(() {});
  }

  void _openChatSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const ChatSheet(),
    );
  }

  void _showPostTrackingDialog() {
    final postCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: Container(
          padding: const EdgeInsets.all(22),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
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
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: const Color(0xFF2563EB).withValues(alpha: 0.1),
                    child: const Icon(Icons.local_shipping_outlined, color: Color(0xFF2563EB), size: 20),
                  ),
                  const SizedBox(width: 10),
                  const Text('رهگیری مستقیم مرسوله پستی', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'شماره بارنامه یا کد پیگیری ۲۴ رقمی پستی خود را وارد نمایید تا مستقیماً وضعیت بسته در سامانه شرکت ملی پست ایران نمایش داده شود.',
                style: TextStyle(fontSize: 11, color: Color(0xFF6B7280), height: 1.4),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: postCtrl,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'کد رهگیری پیشتاز (۲۴ رقم)',
                  hintText: 'مثلاً: 198765432109876543210001',
                  filled: true,
                  fillColor: const Color(0xFFF9FAFB),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
                style: const TextStyle(fontSize: 13, letterSpacing: 1),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.search, size: 18),
                  label: const Text('استعلام در سامانه پست', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2563EB),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () async {
                    final code = postCtrl.text.trim();
                    if (code.isEmpty) return;
                    Navigator.pop(context);
                    final uri = Uri.parse('https://tracking.post.ir/?id=$code');
                    if (await canLaunchUrl(uri)) {
                      await launchUrl(uri, mode: LaunchMode.externalApplication);
                    }
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _openLoginSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => OtpLoginSheet(
        onLoginSuccess: () {
          if (mounted) setState(() {});
        },
      ),
    );
  }

  void _showAddressDialog() {
    final addressCtrl = TextEditingController(text: otpService.userAddress ?? '');
    final cityCtrl = TextEditingController(text: otpService.userCity ?? 'تهران');
    final postalCtrl = TextEditingController(text: otpService.userPostalCode ?? '');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: Container(
          padding: const EdgeInsets.all(22),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
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
              const Text('ویرایش و ثبت آدرس تحویل', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              const SizedBox(height: 14),
              TextField(
                controller: cityCtrl,
                style: const TextStyle(fontSize: 13),
                decoration: InputDecoration(
                  labelText: 'استان و شهر',
                  hintText: 'مثلاً: تهران',
                  filled: true,
                  fillColor: const Color(0xFFF9FAFB),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: addressCtrl,
                maxLines: 2,
                style: const TextStyle(fontSize: 13),
                decoration: InputDecoration(
                  labelText: 'نشانی دقیق پستی',
                  hintText: 'خیابان، کوچه، پلاک، زنگ یا واحد',
                  filled: true,
                  fillColor: const Color(0xFFF9FAFB),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: postalCtrl,
                keyboardType: TextInputType.number,
                style: const TextStyle(fontSize: 13),
                decoration: InputDecoration(
                  labelText: 'کد پستی ۱۰ رقمی',
                  hintText: '۱۹۸۷۶۵۴۳۲۱',
                  filled: true,
                  fillColor: const Color(0xFFF9FAFB),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton(
                  onPressed: () {
                    otpService.updateAddress(
                      address: addressCtrl.text.trim(),
                      city: cityCtrl.text.trim(),
                      postalCode: postalCtrl.text.trim(),
                    );
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('آدرس تحویل با موفقیت در ووکامرس به‌روزرسانی شد.', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                        backgroundColor: Color(0xFF10B981),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEF394E),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('ذخیره آدرس', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _confirmLogout() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('خروج از حساب کاربری', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        content: const Text('آیا می‌خواهید از حساب خود خارج شوید؟ سوابق خرید شما در سایت محفوظ خواهد ماند.', style: TextStyle(fontSize: 12)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('انصراف', style: TextStyle(fontSize: 12, color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF394E),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              otpService.logout();
              Navigator.pop(context);
            },
            child: const Text('خروج', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  int _getOrderStepIndex(Map<String, dynamic> ord) {
    final status = (ord['status'] ?? '').toString().toLowerCase();
    final tracking = (ord['trackingCode'] ?? '').toString();

    if (status == 'completed') return 5;
    if (status == 'shipped' || (tracking.isNotEmpty && tracking != 'در انتظار تخصیص بارنامه')) return 4;
    if (status == 'processing') return 3;
    if (status == 'on-hold') return 2;
    return 1;
  }

  Widget _buildOrderStepper(int currentStep) {
    final steps = [
      {'title': 'ثبت', 'icon': Icons.assignment_turned_in_outlined},
      {'title': 'تایید مالی', 'icon': Icons.account_balance_wallet_outlined},
      {'title': 'بسته‌بندی', 'icon': Icons.inventory_2_outlined},
      {'title': 'تحویل به پست', 'icon': Icons.local_shipping_outlined},
      {'title': 'تحویل شد', 'icon': Icons.task_alt_outlined},
    ];

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFF3F4F6)),
      ),
      child: Row(
        children: List.generate(steps.length, (idx) {
          final stepNum = idx + 1;
          final isDone = stepNum < currentStep;
          final isCurrent = stepNum == currentStep;
          final isLast = idx == steps.length - 1;

          final Color nodeColor = isDone
              ? const Color(0xFF10B981)
              : (isCurrent ? const Color(0xFF2563EB) : const Color(0xFFD1D5DB));

          return Expanded(
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 22,
                        height: 22,
                        decoration: BoxDecoration(
                          color: isDone
                              ? const Color(0xFF10B981)
                              : (isCurrent ? const Color(0xFF2563EB) : Colors.white),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: nodeColor,
                            width: isCurrent ? 2 : 1.5,
                          ),
                          boxShadow: isCurrent
                              ? [
                                  BoxShadow(
                                    color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                                    blurRadius: 4,
                                    offset: const Offset(0, 1),
                                  )
                                ]
                              : null,
                        ),
                        child: Center(
                          child: Icon(
                            isDone
                                ? Icons.check
                                : (isCurrent ? Icons.circle : (steps[idx]['icon'] as IconData)),
                            size: isDone ? 12 : (isCurrent ? 6 : 10),
                            color: isDone || isCurrent ? Colors.white : Colors.grey.shade500,
                          ),
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        steps[idx]['title'] as String,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 8,
                          fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                          color: isDone
                              ? const Color(0xFF059669)
                              : (isCurrent ? const Color(0xFF1D4ED8) : const Color(0xFF9CA3AF)),
                        ),
                      ),
                    ],
                  ),
                ),
                if (!isLast)
                  Container(
                    width: 10,
                    height: 2,
                    color: isDone ? const Color(0xFF10B981) : const Color(0xFFE5E7EB),
                  ),
              ],
            ),
          );
        }),
      ),
    );
  }

  void _showOrderTimelineSheet(Map<String, dynamic> ord) {
    final orderId = ord['number'] ?? ord['id']?.toString() ?? '---';
    final currentStep = _getOrderStepIndex(ord);
    final tracking = ord['trackingCode'] ?? 'در انتظار تخصیص بارنامه';
    final date = ord['dateFa'] ?? ord['date']?.toString() ?? 'امروز';
    final total = ord['totalFormatted'] ?? '${ord['total']} تومان';

    final stepDetails = [
      {
        'title': 'ثبت اولیه سفارش و صدور پیش‌فاکتور',
        'desc': 'سفارش شما در سیستم ثبت شد و اطلاعات خریدار تایید گردید.',
        'time': date,
      },
      {
        'title': 'تایید پرداخت مالی و صورتحساب',
        'desc': 'تراکنش بانکی موفقیت‌آمیز بوده و فاکتور رسمی صادر شد.',
        'time': currentStep >= 2 ? date : 'در انتظار تایید',
      },
      {
        'title': 'آماده‌سازی و کنترل کیفیت در انبار مرکزی',
        'desc': 'کالاها از قفسه‌های انبار واکشی شده و بسته‌بندی ایمن ضدضربه انجام شد.',
        'time': currentStep >= 3 ? 'همان روز' : 'در نوبت بسته‌بندی',
      },
      {
        'title': 'تحویل به متصدی شرکت ملی پست ایران / تیپاکس',
        'desc': tracking != 'در انتظار تخصیص بارنامه'
            ? 'بسته به مامور پست تحویل داده شد. کد رهگیری: $tracking'
            : 'مرسوله در نوبت تحویل به اداره پست قرار دارد.',
        'time': currentStep >= 4 ? 'ارسال شد' : 'در انتظار بارنامه',
      },
      {
        'title': 'تحویل نهایی به خریدار در مقصد',
        'desc': 'مرسوله توسط نامه‌رسان پست در محل آدرس گیرنده تحویل داده شد.',
        'time': currentStep == 5 ? 'تحویل گردید' : 'در مسیر تحویل',
      },
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Directionality(
        textDirection: TextDirection.rtl,
        child: Padding(
          padding: const EdgeInsets.all(22),
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
                        padding: const EdgeInsets.all(7),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEF394E).withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.route_outlined, color: Color(0xFFEF394E), size: 20),
                      ),
                      const SizedBox(width: 8),
                      Text('تایم‌لاین وضعیت سفارش #$orderId', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  IconButton(icon: const Icon(Icons.close, size: 20), onPressed: () => Navigator.pop(context)),
                ],
              ),
              const SizedBox(height: 6),
              Text('مبلغ فاکتور: $total', style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280))),
              const SizedBox(height: 14),
              _buildOrderStepper(currentStep),
              const SizedBox(height: 14),
              ...List.generate(stepDetails.length, (i) {
                final s = stepDetails[i];
                final stepNum = i + 1;
                final isPassed = stepNum <= currentStep;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        margin: const EdgeInsets.only(top: 2),
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(
                          color: isPassed ? const Color(0xFF10B981) : const Color(0xFFE5E7EB),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Icon(
                            isPassed ? Icons.check : Icons.circle,
                            size: isPassed ? 11 : 5,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  s['title']!,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: isPassed ? const Color(0xFF1F2937) : const Color(0xFF9CA3AF),
                                  ),
                                ),
                                Text(s['time']!, style: const TextStyle(fontSize: 9, color: Color(0xFF9CA3AF))),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              s['desc']!,
                              style: TextStyle(
                                fontSize: 10,
                                color: isPassed ? const Color(0xFF4B5563) : const Color(0xFFD1D5DB),
                                height: 1.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              }),
              if (tracking != 'در انتظار تخصیص بارنامه') ...[
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563EB),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    icon: const Icon(Icons.local_shipping_outlined, size: 16),
                    label: Text('رهگیری در سامانه شرکت پست ($tracking)', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    onPressed: () async {
                      Navigator.pop(context);
                      final postUrl = Uri.parse('https://tracking.post.ir/?id=$tracking');
                      if (await canLaunchUrl(postUrl)) {
                        await launchUrl(postUrl, mode: LaunchMode.externalApplication);
                      }
                    },
                  ),
                ),
              ],
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  Color _parseColor(dynamic colorValue, Color fallback) {
    if (colorValue is Color) return colorValue;
    if (colorValue is String && colorValue.startsWith('#')) {
      final hex = colorValue.replaceFirst('#', '');
      return Color(int.parse('FF$hex', radix: 16));
    }
    return fallback;
  }

  @override
  Widget build(BuildContext context) {
    final isLoggedIn = otpService.isLoggedIn;
    final userName = otpService.userName ?? 'مشتری گرامی';
    final userPhone = otpService.currentUserPhone ?? '---';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFF9FAFB),
        appBar: AppBar(
          title: const Text('حساب کاربری من', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          centerTitle: true,
          elevation: 0.5,
          backgroundColor: Colors.white,
          actions: [
            if (isLoggedIn)
              IconButton(
                icon: const Icon(Icons.refresh_rounded, size: 20, color: Color(0xFF4B5563)),
                tooltip: 'به‌روزرسانی سفارش‌ها',
                onPressed: () => otpService.fetchOrders(),
              ),
          ],
        ),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // User Header Profile Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE5E7EB)),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 8, offset: const Offset(0, 2)),
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: isLoggedIn
                        ? const Color(0xFF10B981).withValues(alpha: 0.1)
                        : const Color(0xFFEF394E).withValues(alpha: 0.1),
                    child: Icon(
                      isLoggedIn ? Icons.verified_user_rounded : Icons.person_outline_rounded,
                      size: 30,
                      color: isLoggedIn ? const Color(0xFF10B981) : const Color(0xFFEF394E),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              isLoggedIn ? userName : 'کاربر مهمان',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                            ),
                            if (isLoggedIn) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF10B981).withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text(
                                  'تایید شده با پیامک',
                                  style: TextStyle(fontSize: 9, color: Color(0xFF10B981), fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          isLoggedIn
                              ? userPhone
                              : 'برای دسترسی به سوابق خرید و پیگیری مرسولات وارد شوید',
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.grey.shade600,
                            fontFamily: isLoggedIn ? 'Kalameh' : null,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (!isLoggedIn)
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEF394E),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        elevation: 0,
                      ),
                      onPressed: _openLoginSheet,
                      child: const Text('ورود با پیامک', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    )
                  else
                    IconButton(
                      icon: const Icon(Icons.logout_rounded, size: 20, color: Colors.grey),
                      tooltip: 'خروج از حساب',
                      onPressed: _confirmLogout,
                    ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Order Status Summary (Real live counts from WooCommerce)
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatusItem(
                    Icons.pending_actions_rounded,
                    'در انتظار',
                    isLoggedIn ? (otpService.orderStats['pending']?.toString() ?? '۰') : '۰',
                  ),
                  _buildStatusItem(
                    Icons.inventory_2_outlined,
                    'آماده‌سازی',
                    isLoggedIn ? (otpService.orderStats['processing']?.toString() ?? '۰') : '۰',
                  ),
                  _buildStatusItem(
                    Icons.task_alt_rounded,
                    'تحویل شده',
                    isLoggedIn ? (otpService.orderStats['completed']?.toString() ?? '۰') : '۰',
                  ),
                  _buildStatusItem(
                    Icons.assignment_return_outlined,
                    'مرجوعی',
                    isLoggedIn ? (otpService.orderStats['refunded']?.toString() ?? '۰') : '۰',
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Orders Section Title
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('سفارش‌های ثبت شده در شیائومی اسمارت', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                if (isLoggedIn && otpService.orders.isNotEmpty)
                  Text('${otpService.orders.length} سفارش', style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
              ],
            ),
            const SizedBox(height: 10),

            // Orders List
            if (!isLoggedIn)
              Container(
                padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Column(
                  children: [
                    Icon(Icons.shopping_bag_outlined, size: 40, color: Colors.grey.shade300),
                    const SizedBox(height: 10),
                    const Text('هنوز وارد حساب خود نشده‌اید', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(
                      'برای مشاهده سوابق سفارشات و کد رهگیری مرسولات، وارد شوید.',
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    TextButton.icon(
                      icon: const Icon(Icons.login_rounded, size: 16, color: Color(0xFFEF394E)),
                      label: const Text('ورود با کد تایید پیامکی', style: TextStyle(fontSize: 11, color: Color(0xFFEF394E), fontWeight: FontWeight.bold)),
                      onPressed: _openLoginSheet,
                    ),
                  ],
                ),
              )
            else if (otpService.isLoadingOrders)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFFEF394E)),
                ),
              )
            else if (otpService.orders.isEmpty)
              Container(
                padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Center(
                  child: Text(
                    'تاکنون سفارشی با شماره $userPhone ثبت نشده است.',
                    style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                  ),
                ),
              )
            else
              ...otpService.orders.map((ord) {
                final statusColor = _parseColor(ord['statusColor'], const Color(0xFF3B82F6));
                final orderId = ord['number'] ?? ord['id']?.toString() ?? '---';
                final date = ord['dateFa'] ?? ord['date']?.toString() ?? 'امروز';
                final statusFa = ord['statusFa'] ?? 'در حال پردازش';
                final total = ord['totalFormatted'] ?? '${ord['total']} تومان';
                final tracking = ord['trackingCode'] ?? 'در انتظار تخصیص بارنامه';

                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('شماره سفارش: #$orderId', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: statusColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              statusFa,
                              style: TextStyle(fontSize: 10, color: statusColor, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text('تاریخ ثبت: $date  |  ${ord['itemsCount'] ?? 1} قلم کالا', style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('مبلغ کل: $total', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFEF394E))),
                          if (tracking != 'در انتظار تخصیص بارنامه')
                            InkWell(
                              onTap: () async {
                                final postUrl = Uri.parse('https://tracking.post.ir/?id=$tracking');
                                if (await canLaunchUrl(postUrl)) {
                                  await launchUrl(postUrl, mode: LaunchMode.externalApplication);
                                }
                              },
                              borderRadius: BorderRadius.circular(6),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEFF6FF),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: const Color(0xFFBFDBFE)),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.local_shipping_outlined, size: 13, color: Color(0xFF2563EB)),
                                    const SizedBox(width: 4),
                                    Text('رهگیری پست: $tracking', style: const TextStyle(fontSize: 10, color: Color(0xFF2563EB), fontWeight: FontWeight.bold)),
                                    const SizedBox(width: 2),
                                    const Icon(Icons.open_in_new, size: 11, color: Color(0xFF2563EB)),
                                  ],
                                ),
                              ),
                            )
                          else
                            Row(
                              children: [
                                const Icon(Icons.local_shipping_outlined, size: 14, color: Colors.grey),
                                const SizedBox(width: 4),
                                Text('کد رهگیری: $tracking', style: TextStyle(fontSize: 10, color: Colors.grey.shade600)),
                              ],
                            ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      // 5-Step Order Status Stepper
                      _buildOrderStepper(_getOrderStepIndex(ord)),
                      const SizedBox(height: 4),
                      Center(
                        child: InkWell(
                          onTap: () => _showOrderTimelineSheet(ord),
                          borderRadius: BorderRadius.circular(6),
                          child: const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.timeline_rounded, size: 14, color: Color(0xFF2563EB)),
                                SizedBox(width: 4),
                                Text('مشاهده تایم‌لاین و جزئیات پیشرفت مرسوله',
                                    style: TextStyle(fontSize: 10, color: Color(0xFF2563EB), fontWeight: FontWeight.bold)),
                                SizedBox(width: 2),
                                Icon(Icons.arrow_back_ios_new, size: 9, color: Color(0xFF2563EB)),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),

            const SizedBox(height: 12),

            // Account Actions Menu
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Column(
                children: [
                  _buildMenuTile(
                    Icons.stars_rounded,
                    'گردونه جوایز و شانس روزانه',
                    'هر روز یک چرخش رایگان برای کدهای تخفیف طلایی و ارسال رایگان',
                    onTap: () => LuckyWheelDialog.show(context),
                  ),
                  const Divider(height: 1, indent: 16, endIndent: 16),
                  _buildMenuTile(
                    Icons.favorite_border_rounded,
                    'لیست علاقه‌مندی‌های من',
                    wishlist.count > 0 ? '${wishlist.count} محصول ذخیره شده' : 'هنوز کالایی به علاقه‌مندی‌ها اضافه نشده',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const WishlistScreen()),
                      );
                    },
                  ),
                  const Divider(height: 1, indent: 16, endIndent: 16),
                  _buildMenuTile(
                    Icons.chat_bubble_outline_rounded,
                    'پشتیبانی آنلاین و چت زنده',
                    'گفتگو مستقیم با کارشناسان شیائومی اسمارت',
                    onTap: _openChatSheet,
                  ),
                  const Divider(height: 1, indent: 16, endIndent: 16),
                  _buildMenuTile(
                    Icons.local_shipping_outlined,
                    'رهگیری مرسولات پست ایران',
                    'استعلام آنلاین بارنامه در سامانه شرکت ملی پست',
                    onTap: _showPostTrackingDialog,
                  ),
                  const Divider(height: 1, indent: 16, endIndent: 16),
                  _buildMenuTile(
                    Icons.location_on_outlined,
                    'آدرس تحویل من',
                    otpService.userAddress != null && otpService.userAddress!.isNotEmpty
                        ? otpService.userAddress!
                        : 'مشاهده و ویرایش نشانی',
                    onTap: _showAddressDialog,
                  ),
                  const Divider(height: 1, indent: 16, endIndent: 16),
                  _buildMenuTile(
                    Icons.local_offer_outlined,
                    'کدهای تخفیف فعال',
                    'کد OFF20 (۲۰٪ تخفیف) و YALDA (۱۰۰ هزار تومان)',
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('کدهای تخفیف در مرحله تسویه حساب به طور خودکار قابل اعمال هستند.', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                          backgroundColor: Color(0xFF3B82F6),
                        ),
                      );
                    },
                  ),
                  const Divider(height: 1, indent: 16, endIndent: 16),
                  _buildMenuTile(
                    Icons.headset_mic_outlined,
                    'پشتیبانی تلفنی و واتساپ',
                    '۰۲۱-۹۱۰۰۰۰۰۰',
                    onTap: () async {
                      final uri = Uri.parse('tel:02191000000');
                      if (await canLaunchUrl(uri)) launchUrl(uri);
                    },
                  ),
                  const Divider(height: 1, indent: 16, endIndent: 16),
                  _buildMenuTile(
                    Icons.star_rate_rounded,
                    'ثبت امتیاز در کافه‌بازار و مایکت',
                    'با ثبت نظر ۵ ستاره از ما حمایت کنید ⭐',
                    onTap: () => RatingPromptDialog.showForce(context),
                  ),
                  const Divider(height: 1, indent: 16, endIndent: 16),
                  _buildMenuTile(
                    Icons.language_rounded,
                    'زبان برنامه و واحد پول (Language & Currency)',
                    'فارسی / English / العربية • تومان / USD / AED',
                    onTap: () => LanguageCurrencySheet.show(context),
                  ),
                  const Divider(height: 1, indent: 16, endIndent: 16),
                  _buildMenuTile(
                    Icons.info_outline,
                    'درباره فروشگاه شیائومی اسمارت',
                    'نسخه ۱.۰.۰ رسمی متصل به ووکامرس',
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusItem(IconData icon, String title, String count) {
    return Column(
      children: [
        Stack(
          clipBehavior: Clip.none,
          children: [
            Icon(icon, size: 24, color: const Color(0xFF4B5563)),
            if (count != '۰' && count != '0')
              Positioned(
                top: -6,
                right: -6,
                child: Container(
                  padding: const EdgeInsets.all(3),
                  decoration: const BoxDecoration(
                    color: Color(0xFFEF394E),
                    shape: BoxShape.circle,
                  ),
                  constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                  child: Text(
                    count,
                    style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 6),
        Text(title, style: const TextStyle(fontSize: 10, color: Color(0xFF4B5563))),
      ],
    );
  }

  Widget _buildMenuTile(IconData icon, String title, String subtitle, {VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF4B5563), size: 22),
      title: Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
      subtitle: Text(
        subtitle,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(fontSize: 10, color: Color(0xFF9CA3AF)),
      ),
      trailing: const Icon(Icons.arrow_back_ios_new, size: 14, color: Color(0xFF9CA3AF)),
      onTap: onTap,
    );
  }
}
