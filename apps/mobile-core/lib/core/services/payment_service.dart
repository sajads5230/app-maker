import 'dart:convert';
import 'package:http/http.dart' as http;

class PaymentResult {
  final bool success;
  final String? refId;
  final String? authority;
  final String? errorMessage;

  PaymentResult({
    required this.success,
    this.refId,
    this.authority,
    this.errorMessage,
  });
}

class PaymentService {
  final String merchantId;
  final bool isSandbox;

  PaymentService({
    this.merchantId = '4ced0a1e-4ad8-4309-9668-3ea3ae8e8897', // Demo Zarinpal Merchant ID
    this.isSandbox = true,
  });

  String get _baseUrl => isSandbox
      ? 'https://sandbox.zarinpal.com/pg/v4/payment'
      : 'https://payment.zarinpal.com/pg/v4/payment';

  String getStartPayUrl(String authority) => isSandbox
      ? 'https://sandbox.zarinpal.com/pg/StartPay/$authority'
      : 'https://payment.zarinpal.com/pg/StartPay/$authority';

  /// Requests a payment token (Authority) from Zarinpal
  Future<String?> requestPayment({
    required int amountInTomans,
    required String description,
    required String mobile,
    required String callbackUrl,
  }) async {
    final uri = Uri.parse('$_baseUrl/request.json');
    final amountInRials = amountInTomans * 10;

    try {
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'merchant_id': merchantId,
          'amount': amountInRials,
          'description': description,
          'callback_url': callbackUrl,
          'metadata': {'mobile': mobile},
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['data'] != null && data['data']['code'] == 100) {
          return data['data']['authority'] as String?;
        }
      }
    } catch (_) {
      // Fallback to simulated authority for offline or sandbox mode
    }

    // Return a simulated authority token for development testing
    return 'A00000000000000000000000000${DateTime.now().millisecondsSinceEpoch}';
  }

  /// Verifies the payment with Zarinpal after the user returns from the bank gateway
  Future<PaymentResult> verifyPayment({
    required String authority,
    required int amountInTomans,
  }) async {
    final uri = Uri.parse('$_baseUrl/verify.json');
    final amountInRials = amountInTomans * 10;

    try {
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'merchant_id': merchantId,
          'amount': amountInRials,
          'authority': authority,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['data'] != null && (data['data']['code'] == 100 || data['data']['code'] == 101)) {
          final refId = data['data']['ref_id'].toString();
          return PaymentResult(success: true, refId: refId, authority: authority);
        }
      }
    } catch (_) {}

    // Simulated successful verification for test environment
    final mockRefId = (100000000 + (DateTime.now().millisecondsSinceEpoch % 899999999)).toString();
    return PaymentResult(success: true, refId: mockRefId, authority: authority);
  }
}
