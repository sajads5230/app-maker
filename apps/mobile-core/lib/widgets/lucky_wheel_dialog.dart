import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LuckyWheelPrize {
  final String title;
  final String? couponCode;
  final String description;
  final Color color;
  final Color textColor;
  final IconData icon;
  final bool isRetry;
  final bool isLoss;

  const LuckyWheelPrize({
    required this.title,
    this.couponCode,
    required this.description,
    required this.color,
    this.textColor = Colors.white,
    required this.icon,
    this.isRetry = false,
    this.isLoss = false,
  });
}

class LuckyWheelDialog extends StatefulWidget {
  const LuckyWheelDialog({super.key});

  static Future<void> show(BuildContext context) {
    return showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => const LuckyWheelDialog(),
    );
  }

  @override
  State<LuckyWheelDialog> createState() => _LuckyWheelDialogState();
}

class _LuckyWheelDialogState extends State<LuckyWheelDialog>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _animation;

  static const List<LuckyWheelPrize> _prizes = [
    LuckyWheelPrize(
      title: '۱۰٪ تخفیف',
      couponCode: 'LUCKY10',
      description: '۱۰ درصد تخفیف روی کل سبد خرید بدون محدودیت!',
      color: Color(0xFFEF394E),
      icon: Icons.local_offer_rounded,
    ),
    LuckyWheelPrize(
      title: 'ارسال رایگان',
      couponCode: 'FREESHIP',
      description: 'هزینه ارسال پستی برای سفارش شما کاملاً رایگان شد!',
      color: Color(0xFF2563EB),
      icon: Icons.local_shipping_rounded,
    ),
    LuckyWheelPrize(
      title: '۵۰ هزار تومان',
      couponCode: 'GIFT50',
      description: '۵۰,۰۰۰ تومان هدیه نقدی برای خریدهای بالای ۳۰۰ هزار تومان!',
      color: Color(0xFF10B981),
      icon: Icons.card_giftcard_rounded,
    ),
    LuckyWheelPrize(
      title: 'شانس مجدد',
      description: 'یک شانس چرخش دیگر به شما هدیه داده شد!',
      color: Color(0xFFF59E0B),
      icon: Icons.replay_rounded,
      isRetry: true,
    ),
    LuckyWheelPrize(
      title: '۵٪ تخفیف',
      couponCode: 'LUCKY5',
      description: '۵ درصد تخفیف ویژه روی تمامی محصولات موجود!',
      color: Color(0xFF8B5CF6),
      icon: Icons.percent_rounded,
    ),
    LuckyWheelPrize(
      title: '۱۰۰ هزار تومان',
      couponCode: 'VIP100',
      description: '۱۰۰,۰۰۰ تومان تخفیف استثنایی برای خریدهای بالای ۱ میلیون تومان!',
      color: Color(0xFFEC4899),
      icon: Icons.stars_rounded,
    ),
    LuckyWheelPrize(
      title: 'متاسفانه پوچ!',
      description: 'این بار شانس با شما یار نبود، فردا دوباره امتحان کنید!',
      color: Color(0xFF6B7280),
      icon: Icons.sentiment_dissatisfied_rounded,
      isLoss: true,
    ),
    LuckyWheelPrize(
      title: '۱۵٪ تخفیف طلایی',
      couponCode: 'GOLD15',
      description: '۱۵ درصد تخفیف طلایی بزرگ‌ترین جایزه گردونه شانس!',
      color: Color(0xFFD97706),
      icon: Icons.emoji_events_rounded,
    ),
  ];

  double _currentAngle = 0.0;
  bool _isSpinning = false;
  bool _canSpin = true;
  Duration _remainingCooldown = Duration.zero;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 4500),
    );
    _checkCooldown();
  }

  Future<void> _checkCooldown() async {
    final prefs = await SharedPreferences.getInstance();
    final lastSpinMs = prefs.getInt('lucky_wheel_last_spin') ?? 0;
    if (lastSpinMs > 0) {
      final lastSpinTime = DateTime.fromMillisecondsSinceEpoch(lastSpinMs);
      final diff = DateTime.now().difference(lastSpinTime);
      const cooldown = Duration(hours: 24);
      if (diff < cooldown) {
        setState(() {
          _canSpin = false;
          _remainingCooldown = cooldown - diff;
        });
        return;
      }
    }
    setState(() {
      _canSpin = true;
    });
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _spin() {
    if (_isSpinning || !_canSpin) return;

    setState(() => _isSpinning = true);

    // Pick a winning index
    final random = math.Random();
    // Weighted selection: index 6 (loss) or prizes
    final targetIndex = random.nextInt(_prizes.length);

    // Calculate rotation:
    // Sector size in radians:
    final sectorAngle = 2 * math.pi / _prizes.length;
    // The pointer is at the TOP (angle -pi/2 or 3*pi/2).
    // Each index i is at angle: i * sectorAngle to (i+1) * sectorAngle.
    // Center of sector i: (i + 0.5) * sectorAngle.
    // We want the wheel rotation R such that when rotated by R,
    // sector i aligns with top pointer (3*pi/2):
    // (R + (i + 0.5) * sectorAngle) % (2*pi) == 3*pi/2
    // R = 3*pi/2 - (i + 0.5) * sectorAngle + N * 2*pi
    const fullSpins = 6; // 6 full circles
    final targetRotation = (fullSpins * 2 * math.pi) +
        (1.5 * math.pi) -
        ((targetIndex + 0.5) * sectorAngle);

    final startAngle = _currentAngle % (2 * math.pi);
    final endAngle = startAngle + targetRotation;

    _animation = Tween<double>(begin: startAngle, end: endAngle).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic),
    )..addListener(() {
        setState(() {
          _currentAngle = _animation.value;
        });
      });

    _animController.reset();
    _animController.forward().then((_) async {
      setState(() => _isSpinning = false);

      final wonPrize = _prizes[targetIndex];

      if (!wonPrize.isRetry) {
        // Save cooldown timestamp
        final prefs = await SharedPreferences.getInstance();
        await prefs.setInt('lucky_wheel_last_spin', DateTime.now().millisecondsSinceEpoch);
        _checkCooldown();
      }

      if (mounted) {
        _showWinnerDialog(wonPrize);
      }
    });
  }

  void _showWinnerDialog(LuckyWheelPrize prize) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: prize.color.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(prize.icon, color: prize.color, size: 38),
              ),
              const SizedBox(height: 14),
              Text(
                prize.isLoss ? 'متاسفانه برنده نشدید!' : 'تبریک! جایزه شما مشخص شد 🎉',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                prize.title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: prize.color,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                prize.description,
                style: TextStyle(fontSize: 11, color: Colors.grey.shade600, height: 1.4),
                textAlign: TextAlign.center,
              ),
              if (prize.couponCode != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9FAFB),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('کد تخفیف شما:', style: TextStyle(fontSize: 9, color: Colors.grey)),
                          Text(
                            prize.couponCode!,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 2,
                              color: Color(0xFFEF394E),
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.copy, size: 14),
                        label: const Text('کپی کد', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEF394E),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: prize.couponCode!));
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('کد تخفیف ${prize.couponCode} با موفقیت کپی شد! 🎁',
                                  style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                              backgroundColor: const Color(0xFF10B981),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: prize.isRetry ? const Color(0xFFF59E0B) : const Color(0xFF1F2937),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                  onPressed: () {
                    Navigator.pop(ctx);
                    if (prize.isRetry) {
                      _spin();
                    }
                  },
                  child: Text(
                    prize.isRetry ? 'چرخش دوباره گردونه!' : 'بستن و ادامه خرید',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF1E1B4B), Color(0xFF312E81)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF4338CA).withValues(alpha: 0.4),
                blurRadius: 25,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF59E0B).withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.stars_rounded, color: Color(0xFFF59E0B), size: 22),
                      ),
                      const SizedBox(width: 8),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('گردونه جوایز شیائومی اسمارت',
                              style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                          Text('شانس خود را برای دریافت تخفیف‌های طلایی امتحان کنید!',
                              style: TextStyle(color: Color(0xFFC7D2FE), fontSize: 9)),
                        ],
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white70, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Wheel & Pointer Container
              SizedBox(
                width: 280,
                height: 280,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Outer Glow Ring
                    Container(
                      width: 276,
                      height: 276,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFFFBBF24), width: 3),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
                            blurRadius: 16,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                    ),

                    // Rotating Canvas Wheel
                    Transform.rotate(
                      angle: _currentAngle,
                      child: CustomPaint(
                        size: const Size(260, 260),
                        painter: _WheelPainter(prizes: _prizes),
                      ),
                    ),

                    // Center Hub Button
                    GestureDetector(
                      onTap: _canSpin && !_isSpinning ? _spin : null,
                      child: Container(
                        width: 62,
                        height: 62,
                        decoration: BoxDecoration(
                          gradient: const RadialGradient(
                            colors: [Color(0xFFFBBF24), Color(0xFFD97706)],
                          ),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                          border: Border.all(color: Colors.white, width: 2.5),
                        ),
                        child: Center(
                          child: Text(
                            _isSpinning
                                ? '...'
                                : (_canSpin ? 'بچرخان!' : 'فردا'),
                            style: const TextStyle(
                              color: Color(0xFF1E1B4B),
                              fontSize: 11,
                              fontWeight: FontWeight.w900,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                    ),

                    // Top Pointer
                    Positioned(
                      top: 0,
                      child: CustomPaint(
                        size: const Size(24, 28),
                        painter: _PointerPainter(),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Action / Cooldown Status
              if (!_canSpin) ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.timer_outlined, color: Color(0xFFFBBF24), size: 16),
                      const SizedBox(width: 6),
                      Text(
                        'زمان تا چرخش بعدی: ${_remainingCooldown.inHours} ساعت و ${_remainingCooldown.inMinutes % 60} دقیقه',
                        style: const TextStyle(color: Colors.white, fontSize: 11),
                      ),
                    ],
                  ),
                ),
              ] else ...[
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton.icon(
                    icon: Icon(_isSpinning ? Icons.hourglass_top : Icons.touch_app, size: 18),
                    label: Text(
                      _isSpinning ? 'در حال چرخش گردونه...' : 'چرخش گردونه شانس (رایگان)',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEF394E),
                      foregroundColor: Colors.white,
                      elevation: 4,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: _isSpinning ? null : _spin,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _WheelPainter extends CustomPainter {
  final List<LuckyWheelPrize> prizes;

  _WheelPainter({required this.prizes});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    final sweepAngle = (2 * math.pi) / prizes.length;

    for (int i = 0; i < prizes.length; i++) {
      final startAngle = i * sweepAngle;
      final prize = prizes[i];

      // Sector slice fill
      final paint = Paint()
        ..color = prize.color
        ..style = PaintingStyle.fill;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        true,
        paint,
      );

      // Slice border
      final borderPaint = Paint()
        ..color = Colors.white.withValues(alpha: 0.35)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.2;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        true,
        borderPaint,
      );

      // Label inside slice
      canvas.save();
      final textAngle = startAngle + (sweepAngle / 2);
      canvas.translate(center.dx, center.dy);
      canvas.rotate(textAngle);

      final textSpan = TextSpan(
        text: prize.title,
        style: TextStyle(
          color: prize.textColor,
          fontSize: 9.5,
          fontWeight: FontWeight.bold,
          fontFamily: 'Kalameh',
        ),
      );
      final textPainter = TextPainter(
        text: textSpan,
        textDirection: TextDirection.rtl,
        textAlign: TextAlign.center,
      );
      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(radius * 0.45, -textPainter.height / 2),
      );

      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _PointerPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final path = Path()
      ..moveTo(size.width / 2, size.height) // tip pointing down into the wheel
      ..lineTo(0, 0)
      ..lineTo(size.width, 0)
      ..close();

    final paint = Paint()
      ..color = const Color(0xFFFBBF24)
      ..style = PaintingStyle.fill;

    final shadowPaint = Paint()
      ..color = Colors.black.withValues(alpha: 0.4)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);

    canvas.drawPath(path.shift(const Offset(0, 2)), shadowPaint);
    canvas.drawPath(path, paint);

    final borderPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    canvas.drawPath(path, borderPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
