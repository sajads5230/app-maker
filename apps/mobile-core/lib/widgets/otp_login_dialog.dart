import 'package:flutter/material.dart';
import '../core/services/otp_service.dart';

class OtpLoginSheet extends StatefulWidget {
  final VoidCallback? onLoginSuccess;
  const OtpLoginSheet({super.key, this.onLoginSuccess});

  @override
  State<OtpLoginSheet> createState() => _OtpLoginSheetState();
}

class _OtpLoginSheetState extends State<OtpLoginSheet> {
  final _phoneController = TextEditingController(text: '0912');
  final _codeController = TextEditingController();
  final _nameController = TextEditingController();
  final otpService = OtpService();

  bool _codeSent = false;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _phoneController.dispose();
    _codeController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  void _requestCode() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await otpService.requestOtp(_phoneController.text.trim());
      if (!mounted) return;
      setState(() {
        _codeSent = true;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
        _isLoading = false;
      });
    }
  }

  void _verifyCode() async {
    if (_codeController.text.trim().isEmpty) {
      setState(() => _errorMessage = 'لطفاً کد تایید ۵ رقمی را وارد فرمایید.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final success = await otpService.verifyOtp(
      _phoneController.text.trim(),
      _codeController.text.trim(),
      name: _nameController.text.trim().isNotEmpty ? _nameController.text.trim() : null,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (success) {
      Navigator.pop(context);
      widget.onLoginSuccess?.call();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'ورود با موفقیت انجام شد! حساب کاربری شما متصل شد. 👏',
            style: TextStyle(fontFamily: 'Kalameh', fontSize: 12),
          ),
          backgroundColor: Color(0xFF10B981),
        ),
      );
    } else {
      setState(() => _errorMessage = 'کد تایید اشتباه یا منقضی شده است. (کد تستی: ۱۲۳۴۵)');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
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
                width: 40,
                height: 4,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEF394E).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.phonelink_lock_rounded, size: 20, color: Color(0xFFEF394E)),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      _codeSent ? 'تایید پیامکی شماره موبایل' : 'ورود / ثبت‌نام سریع',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close, size: 20),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              _codeSent
                  ? 'کد تایید ۵ رقمی ارسال شده به شماره ${_phoneController.text} را وارد کنید:'
                  : 'شماره موبایل خود را وارد کنید تا کد تایید یکبار مصرف (OTP) پیامک شود.',
              style: TextStyle(fontSize: 11, color: Colors.grey.shade600, height: 1.5),
            ),
            const SizedBox(height: 18),
            if (!_codeSent) ...[
              TextField(
                controller: _nameController,
                style: const TextStyle(fontSize: 13),
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.person_outline, size: 20),
                  labelText: 'نام و نام خانوادگی (اختیاری)',
                  hintText: 'مثلاً: علی رضایی',
                  filled: true,
                  fillColor: const Color(0xFFF9FAFB),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                autofocus: true,
                style: const TextStyle(fontSize: 15, letterSpacing: 1.5, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.phone_android_outlined, size: 20),
                  labelText: 'شماره موبایل',
                  hintText: '۰۹xxxxxxxxx',
                  filled: true,
                  fillColor: const Color(0xFFF9FAFB),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
            ] else ...[
              TextField(
                controller: _codeController,
                keyboardType: TextInputType.number,
                autofocus: true,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 22, letterSpacing: 8, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  hintText: '-----',
                  filled: true,
                  fillColor: const Color(0xFFF9FAFB),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
              const SizedBox(height: 10),
              ListenableBuilder(
                listenable: otpService,
                builder: (context, _) => Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton.icon(
                      icon: const Icon(Icons.edit_outlined, size: 14),
                      label: const Text('ویرایش شماره', style: TextStyle(fontSize: 11)),
                      onPressed: () => setState(() => _codeSent = false),
                    ),
                    if (otpService.canResendOtp)
                      TextButton.icon(
                        icon: const Icon(Icons.refresh, size: 14),
                        label: const Text('ارسال مجدد پیامک', style: TextStyle(fontSize: 11, color: Color(0xFFEF394E), fontWeight: FontWeight.bold)),
                        onPressed: _requestCode,
                      )
                    else
                      Text(
                        'ارسال مجدد تا (${otpService.resendCooldownSeconds}) ثانیه',
                        style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                      ),
                  ],
                ),
              ),
            ],
            if (_errorMessage != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, size: 16, color: Colors.red),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(_errorMessage!, style: const TextStyle(fontSize: 11, color: Colors.red)),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              height: 46,
              child: ElevatedButton(
                onPressed: _isLoading ? null : (_codeSent ? _verifyCode : _requestCode),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEF394E),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isLoading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : Text(
                        _codeSent ? 'تایید و ورود به حساب' : 'دریافت کد تایید پیامکی',
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                      ),
              ),
            ),
            const SizedBox(height: 6),
          ],
        ),
      ),
    );
  }
}
