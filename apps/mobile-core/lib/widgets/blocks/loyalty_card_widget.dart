import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LoyaltyCardWidget extends StatefulWidget {
  final Map<String, dynamic> data;

  const LoyaltyCardWidget({super.key, required this.data});

  @override
  State<LoyaltyCardWidget> createState() => _LoyaltyCardWidgetState();
}

class _LoyaltyCardWidgetState extends State<LoyaltyCardWidget> {
  int _points = 1850;
  String _tier = 'GOLD';
  String _customerName = 'رضا کمالی';
  final String _phone = '09123232580';
  int _progressPercent = 65;
  String _nextTierName = 'الماس VIP';
  bool _canClaimDaily = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchAccount();
  }

  Future<void> _fetchAccount() async {
    final projectId = widget.data['projectId']?.toString() ?? 'app-demo-techmarket';
    try {
      final res = await http.get(Uri.parse('http://localhost:4000/api/projects/$projectId/loyalty/account?phone=$_phone'));
      if (res.statusCode == 200 && mounted) {
        final data = jsonDecode(res.body);
        if (data['success'] == true) {
          final acc = data['account'];
          setState(() {
            _points = (acc['points'] as num?)?.toInt() ?? _points;
            _tier = acc['tier']?.toString() ?? _tier;
            _customerName = acc['customerName']?.toString() ?? _customerName;
            _progressPercent = (acc['progressPercent'] as num?)?.toInt() ?? _progressPercent;
            _nextTierName = acc['nextTierName']?.toString() ?? _nextTierName;
            _canClaimDaily = acc['canClaimDaily'] == true;
          });
        }
      }
    } catch (_) {}
  }

  Future<void> _claimDailyBonus() async {
    setState(() => _isLoading = true);
    final projectId = widget.data['projectId']?.toString() ?? 'app-demo-techmarket';
    try {
      final res = await http.post(
        Uri.parse('http://localhost:4000/api/projects/$projectId/loyalty/claim-daily'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': _phone}),
      );
      if (mounted && res.statusCode == 200) {
        final data = jsonDecode(res.body);
        setState(() {
          _isLoading = false;
          _points = (data['newPoints'] as num?)?.toInt() ?? (_points + 10);
          _canClaimDaily = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              data['message']?.toString() ?? '۱۰ امتیاز پاداش ورود روزانه اضافه شد!',
              style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
            ),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _points += 10;
          _canClaimDaily = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('۱۰ امتیاز پاداش روزانه به حسابتان منظور شد! 🎉', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
            backgroundColor: Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  void _showRedeemSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.all(20),
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
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.stars_rounded, color: Color(0xFFD97706), size: 20),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'تبدیل امتیاز به کوپن تخفیف',
                        style: TextStyle(fontFamily: 'Kalameh', fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  IconButton(onPressed: () => Navigator.pop(ctx), icon: const Icon(Icons.close_rounded, size: 20)),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                'موجودی شما: $_points امتیاز (معادل ${(_points * 100).toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')} تومان تخفیف)',
                style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Color(0xFF4B5563)),
              ),
              const SizedBox(height: 16),
              _buildRedeemOption(ctx, 200, 20000, 'کوپن ۲۰ هزار تومانی'),
              const SizedBox(height: 8),
              _buildRedeemOption(ctx, 500, 50000, 'کوپن ۵۰ هزار تومانی (پیشنهاد ویژه)'),
              const SizedBox(height: 8),
              _buildRedeemOption(ctx, 1000, 100000, 'کوپن ۱۰۰ هزار تومانی طلایی'),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRedeemOption(BuildContext ctx, int pts, int tomans, String title) {
    final canAfford = _points >= pts;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: canAfford ? const Color(0xFFF9FAFB) : const Color(0xFFF3F4F6),
        border: Border.all(color: canAfford ? const Color(0xFFE5E7EB) : const Color(0xFFD1D5DB)),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: canAfford ? const Color(0xFF111827) : const Color(0xFF9CA3AF))),
              Text('$pts امتیاز لازم است', style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF6B7280))),
            ],
          ),
          ElevatedButton(
            onPressed: canAfford
                ? () async {
                    Navigator.pop(ctx);
                    setState(() {
                      _points -= pts;
                    });
                    final code = 'LOYAL-${pts ~/ 10}K-${DateTime.now().millisecondsSinceEpoch.toString().substring(9)}';
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('کد تخفیف $code با اعتبار $tomans تومان صادر شد!', style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                        backgroundColor: const Color(0xFF2563EB),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFD97706),
              foregroundColor: Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('دریافت', style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    List<Color> gradientColors;
    String tierTitle;
    IconData tierIcon;

    switch (_tier) {
      case 'VIP':
        gradientColors = const [Color(0xFF7C3AED), Color(0xFF4C1D95)];
        tierTitle = 'عضویت الماس VIP';
        tierIcon = Icons.diamond_rounded;
        break;
      case 'GOLD':
        gradientColors = const [Color(0xFFD97706), Color(0xFF78350F)];
        tierTitle = 'باشگاه مشتریان طلایی';
        tierIcon = Icons.stars_rounded;
        break;
      case 'SILVER':
        gradientColors = const [Color(0xFF6B7280), Color(0xFF374151)];
        tierTitle = 'باشگاه مشتریان نقره‌ای';
        tierIcon = Icons.verified_rounded;
        break;
      default:
        gradientColors = const [Color(0xFF92400E), Color(0xFF451A03)];
        tierTitle = 'باشگاه مشتریان برنزی';
        tierIcon = Icons.shield_rounded;
    }

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: gradientColors,
            begin: Alignment.topRight,
            end: Alignment.bottomLeft,
          ),
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: gradientColors.first.withValues(alpha: 0.35),
              blurRadius: 16,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Icon(tierIcon, color: Colors.white, size: 14),
                          const SizedBox(width: 4),
                          Text(
                            tierTitle,
                            style: const TextStyle(
                              fontFamily: 'Kalameh',
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                Text(
                  _phone,
                  style: TextStyle(
                    fontFamily: 'Kalameh',
                    fontSize: 10,
                    color: Colors.white.withValues(alpha: 0.8),
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Points Counter
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _customerName,
                      style: const TextStyle(
                        fontFamily: 'Kalameh',
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'امتیاز وفاداری فعال',
                      style: TextStyle(
                        fontFamily: 'Kalameh',
                        fontSize: 9,
                        color: Colors.white.withValues(alpha: 0.7),
                      ),
                    ),
                  ],
                ),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      _points.toString(),
                      style: const TextStyle(
                        fontFamily: 'Kalameh',
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'امتیاز',
                      style: TextStyle(
                        fontFamily: 'Kalameh',
                        fontSize: 10,
                        color: Colors.white.withValues(alpha: 0.9),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Progress Bar to next Tier
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: _progressPercent / 100.0,
                minHeight: 6,
                backgroundColor: Colors.white.withValues(alpha: 0.2),
                valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '$_progressPercent٪ تا ارتقا به $_nextTierName',
                  style: TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Colors.white.withValues(alpha: 0.8)),
                ),
                Text(
                  'هر ۱۰ هزار تومن = ۱ امتیاز',
                  style: TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Colors.white.withValues(alpha: 0.6)),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: _showRedeemSheet,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: gradientColors.last,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.redeem_rounded, size: 14),
                        SizedBox(width: 6),
                        Text(
                          'تبدیل به کد تخفیف',
                          style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton(
                    onPressed: _canClaimDaily && !_isLoading ? _claimDailyBonus : null,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: BorderSide(color: Colors.white.withValues(alpha: 0.5)),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.card_giftcard_rounded, size: 14),
                        const SizedBox(width: 6),
                        Text(
                          _canClaimDaily ? 'هدیه ورود روزانه (+۱۰)' : 'دریافت شد ✓',
                          style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ],
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
}
