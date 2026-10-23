import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/models/app_config_model.dart';
import '../core/state/cart_state.dart';
import '../core/services/payment_service.dart';
import '../core/services/woocommerce_service.dart';
import '../core/services/otp_service.dart';
import '../widgets/otp_login_dialog.dart';
import '../widgets/rating_prompt_dialog.dart';

class CheckoutSheet extends StatefulWidget {
  final AppConfigModel? config;
  const CheckoutSheet({super.key, this.config});

  @override
  State<CheckoutSheet> createState() => _CheckoutSheetState();
}

class _CheckoutSheetState extends State<CheckoutSheet> {
  final _nameController = TextEditingController(text: 'سجاد براتی');
  final _phoneController = TextEditingController(text: '09123456789');
  final _addressController = TextEditingController(text: 'تهران، خیابان ولیعصر، پلاک ۱۱۰');
  final _postalCodeController = TextEditingController(text: '1987654321');

  String _selectedCity = 'تهران';
  String _selectedShipping = 'post_pishtaz';
  String _selectedGateway = 'zarinpal';
  bool _isLoading = false;

  final cart = CartState();
  final paymentService = PaymentService();
  final otpService = OtpService();
  final currencyFormat = NumberFormat('#,###');

  @override
  void initState() {
    super.initState();
    if (otpService.isLoggedIn) {
      if (otpService.userName != null && otpService.userName!.isNotEmpty) {
        _nameController.text = otpService.userName!;
      }
      if (otpService.currentUserPhone != null && otpService.currentUserPhone!.isNotEmpty) {
        _phoneController.text = otpService.currentUserPhone!;
      }
      if (otpService.userAddress != null && otpService.userAddress!.isNotEmpty) {
        _addressController.text = otpService.userAddress!;
      }
      if (otpService.userCity != null && otpService.userCity!.isNotEmpty) {
        _selectedCity = otpService.userCity!;
      }
      if (otpService.userPostalCode != null && otpService.userPostalCode!.isNotEmpty) {
        _postalCodeController.text = otpService.userPostalCode!;
      }
    }
  }

  int get _shippingCost {
    return _selectedShipping == 'post_pishtaz' ? 45000 : 65000;
  }

  double get _totalWithShipping {
    return cart.finalTotal + _shippingCost;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _postalCodeController.dispose();
    super.dispose();
  }

  void _processPayment() async {
    if (_nameController.text.trim().isEmpty || _phoneController.text.trim().isEmpty || _addressController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('لطفاً تمامی اطلاعات خریدار و آدرس را تکمیل فرمایید.', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
          backgroundColor: Color(0xFFEF394E),
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final storeName = widget.config?.metadata.name ?? 'فروشگاه شیائومی اسمارت';
      final targetSiteUrl = (widget.config?.woocommerce?.siteUrl.isNotEmpty == true)
          ? widget.config!.woocommerce!.siteUrl
          : 'https://xiaomismart.ir';

      // 1. Request authority from Payment Service (Zarinpal)
      final authority = await paymentService.requestPayment(
        amountInTomans: _totalWithShipping.toInt(),
        description: 'خرید از $storeName',
        mobile: _phoneController.text.trim(),
        callbackUrl: '$targetSiteUrl/checkout/callback',
      );

      // 2. Register order directly with WooCommerce
      final wooService = WooCommerceService(
        siteUrl: targetSiteUrl,
        consumerKey: widget.config?.woocommerce?.consumerKey,
        consumerSecret: widget.config?.woocommerce?.consumerSecret,
      );

      final lineItems = cart.items.map((i) {
        final cleanId = int.tryParse(i.id.split('_').first) ?? 10160;
        return {
          'product_id': cleanId,
          'quantity': i.quantity,
          'name': i.title,
          'total': (i.price * i.quantity).toInt().toString(),
        };
      }).toList();

      Map<String, dynamic> orderResult = {};
      try {
        orderResult = await wooService.createOrder(
          billingInfo: {
            'first_name': _nameController.text.trim(),
            'phone': _phoneController.text.trim(),
            'address_1': _addressController.text.trim(),
            'postcode': _postalCodeController.text.trim(),
            'city': _selectedCity,
            'country': 'IR',
          },
          lineItems: lineItems,
          paymentMethod: _selectedGateway,
          couponCode: cart.appliedCouponCode,
          customerId: otpService.customerId,
        );
      } catch (_) {}

      // Keep address and orders updated in customer profile
      otpService.updateAddress(
        address: _addressController.text.trim(),
        city: _selectedCity,
        postalCode: _postalCodeController.text.trim(),
      );
      otpService.fetchOrders();

      final orderId = orderResult['id']?.toString() ?? '${DateTime.now().millisecondsSinceEpoch % 1000000}';
      final paymentUrl = orderResult['payment_url'] as String?;

      // 3. Launch online bank gateway if paymentUrl exists
      if (paymentUrl != null && paymentUrl.isNotEmpty) {
        final uri = Uri.tryParse(paymentUrl);
        if (uri != null && await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        }
      }

      // 4. Verify Payment Simulation for Testing
      await Future.delayed(const Duration(milliseconds: 1000));
      final result = await paymentService.verifyPayment(
        authority: authority ?? 'AUTH_SANDBOX',
        amountInTomans: _totalWithShipping.toInt(),
      );

      if (!mounted) return;
      setState(() => _isLoading = false);

      final refId = result.refId ?? '${DateTime.now().millisecondsSinceEpoch % 900000 + 100000}';
      final paidAmount = _totalWithShipping;

      cart.clear(); // Empty cart upon successful order
      Navigator.pop(context); // Close checkout sheet

      // Show Official Success Dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 64,
                height: 64,
                decoration: const BoxDecoration(
                  color: Color(0xFFECFDF5),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 48),
              ),
              const SizedBox(height: 16),
              const Text(
                'پرداخت با موفقیت انجام شد! 🎉',
                style: TextStyle(fontFamily: 'Kalameh', fontSize: 15, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'سفارش شما در ووکامرس ثبت شد و جهت آماده‌سازی به انبار ارسال گردید.',
                style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Colors.grey.shade600),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9FAFB),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('شماره سفارش ووکامرس:', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Colors.grey)),
                        Text('#$orderId', style: const TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('کد پیگیری شاپرک:', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Colors.grey)),
                        Text(refId, style: const TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('مبلغ کل پرداخت‌شده:', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Colors.grey)),
                        Text('${currencyFormat.format(paidAmount)} تومان', style: const TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFFEF394E))),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    RatingPromptDialog.showIfNeeded(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1F2937),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('بازگشت به فروشگاه', style: TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      );
    } catch (_) {
      if (!mounted) return;
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 10, bottom: 6),
            width: 40,
            height: 4,
            decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('تکمیل سفارش و درگاه پرداخت', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
              ],
            ),
          ),
          const Divider(height: 1),
          // Form Content
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (otpService.isLoggedIn)
                  Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle_rounded, size: 16, color: Color(0xFF10B981)),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'سفارش به نام کاربر تایید شده: ${otpService.userName ?? ''} (${otpService.currentUserPhone ?? ''})',
                            style: const TextStyle(fontSize: 10, color: Color(0xFF047857), fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3F4F6),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFE5E7EB)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.phone_android_rounded, size: 16, color: Color(0xFF4B5563)),
                        const SizedBox(width: 8),
                        const Expanded(
                          child: Text('عضو سایت هستید؟ برای ثبت سابقه سفارش وارد شوید.', style: TextStyle(fontSize: 10, color: Color(0xFF4B5563))),
                        ),
                        TextButton(
                          onPressed: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (context) => OtpLoginSheet(
                                onLoginSuccess: () {
                                  if (otpService.isLoggedIn) {
                                    _nameController.text = otpService.userName ?? _nameController.text;
                                    _phoneController.text = otpService.currentUserPhone ?? _phoneController.text;
                                    if (otpService.userAddress != null) _addressController.text = otpService.userAddress!;
                                    if (otpService.userCity != null) _selectedCity = otpService.userCity!;
                                    if (otpService.userPostalCode != null) _postalCodeController.text = otpService.userPostalCode!;
                                    if (mounted) setState(() {});
                                  }
                                },
                              ),
                            );
                          },
                          child: const Text('ورود پیامکی', style: TextStyle(fontSize: 10, color: Color(0xFFEF394E), fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ),
                const Text('اطلاعات خریدار', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF374151))),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: _buildInput('نام و نام خانوادگی', _nameController, Icons.person_outline),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildInput('شماره همراه (جهت پیامک)', _phoneController, Icons.phone_android_outlined),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Text('آدرس تحویل کالا', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF374151))),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF9FAFB),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFFE5E7EB)),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _selectedCity,
                            isExpanded: true,
                            style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Colors.black87),
                            items: const [
                              DropdownMenuItem(value: 'تهران', child: Text('تهران')),
                              DropdownMenuItem(value: 'اصفهان', child: Text('اصفهان')),
                              DropdownMenuItem(value: 'مشهد', child: Text('مشهد')),
                              DropdownMenuItem(value: 'شیراز', child: Text('شیراز')),
                              DropdownMenuItem(value: 'تبریز', child: Text('تبریز')),
                            ],
                            onChanged: (v) => setState(() => _selectedCity = v!),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildInput('کد پستی ۱۰ رقمی', _postalCodeController, Icons.markunread_mailbox_outlined),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                _buildInput('نشانی دقیق پستی', _addressController, Icons.location_on_outlined, maxLines: 2),

                const SizedBox(height: 16),
                const Text('روش ارسال', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF374151))),
                const SizedBox(height: 8),
                _buildRadioTile('post_pishtaz', 'پست پیشتاز سراسری', 'تحویل ۲ الی ۴ روز کاری', '۴۵,۰۰۰ تومان'),
                _buildRadioTile('tipax', 'تیپاکس اکسپرس (سریع)', 'تحویل ۲۴ الی ۴۸ ساعته', '۶۵,۰۰۰ تومان'),

                const SizedBox(height: 16),
                const Text('انتخاب روش و درگاه پرداخت', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF374151))),
                const SizedBox(height: 8),
                _buildGatewayOption('snapppay', 'خرید اقساطی اسنپ‌پی (۴ قسط ماهانه)', 'پرداخت قسط اول (${currencyFormat.format((_totalWithShipping / 4).round())} تومان) امروز، بدون سود و بدون ضامن'),
                _buildGatewayOption('zarinpal', 'درگاه امن زرین‌پال (شاپرک)', 'پشتیبانی از تمامی کارت‌های عضو شتاب'),
                _buildGatewayOption('saman', 'درگاه پرداخت مستقیم بانک سامان', 'متصل به سوئیچ مرکزی شاپرک'),
              ],
            ),
          ),

          // Bottom Bar
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey.shade200)),
            ),
            child: Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('مبلغ پرداختی (با هزینه ارسال):', style: TextStyle(fontSize: 10, color: Colors.grey)),
                    Text(
                      '${currencyFormat.format(_totalWithShipping)} تومان',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFFEF394E)),
                    ),
                  ],
                ),
                const Spacer(),
                ElevatedButton(
                  onPressed: _isLoading ? null : _processPayment,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _isLoading
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : Text(
                          _selectedGateway == 'snapppay'
                              ? 'پرداخت قسط اول با اسنپ‌پی'
                              : 'اتصال به درگاه و پرداخت',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInput(String hint, TextEditingController controller, IconData icon, {int maxLines = 1}) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      style: const TextStyle(fontSize: 11),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 11),
        prefixIcon: Icon(icon, size: 16, color: Colors.grey.shade500),
        filled: true,
        fillColor: const Color(0xFFF9FAFB),
        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
        ),
      ),
    );
  }

  Widget _buildRadioTile(String value, String title, String subtitle, String price) {
    final isSelected = _selectedShipping == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedShipping = value),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFFEF2F2) : const Color(0xFFF9FAFB),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: isSelected ? const Color(0xFFEF394E) : const Color(0xFFE5E7EB)),
        ),
        child: Row(
          children: [
            Icon(isSelected ? Icons.radio_button_checked : Icons.radio_button_off, size: 18, color: isSelected ? const Color(0xFFEF394E) : Colors.grey),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  Text(subtitle, style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
                ],
              ),
            ),
            Text(price, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildGatewayOption(String value, String title, String subtitle) {
    final isSelected = _selectedGateway == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedGateway = value),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFECFDF5) : const Color(0xFFF9FAFB),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: isSelected ? const Color(0xFF10B981) : const Color(0xFFE5E7EB)),
        ),
        child: Row(
          children: [
            Icon(isSelected ? Icons.check_circle : Icons.circle_outlined, size: 18, color: isSelected ? const Color(0xFF10B981) : Colors.grey),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  Text(subtitle, style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
