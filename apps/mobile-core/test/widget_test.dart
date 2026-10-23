import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_core/core/models/app_config_model.dart';
import 'package:mobile_core/core/state/cart_state.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('Parses AppConfigModel correctly', () {
    const rawJson = '''
    {
      "schemaVersion": "1.0.0",
      "metadata": { "id": "test_1", "name": "تک‌مارکت", "version": "1.0.0", "packageName": "ir.test.app" },
      "theme": { "mode": "light", "isRTL": true, "fontFamily": "Kalameh" },
      "navigation": { "appBar": { "showLogo": true, "title": "تک‌مارکت", "showSearch": true }, "bottomNav": { "enabled": true, "tabs": [] } },
      "pages": [
        { "id": "p1", "title": "خانه", "slug": "home", "isHome": true, "blocks": [] }
      ],
      "store": { "currency": "تومان", "currencySymbol": "تومان" }
    }
    ''';

    final model = AppConfigModel.fromJson(jsonDecode(rawJson));
    expect(model.metadata.name, 'تک‌مارکت');
    expect(model.theme.fontFamily, 'Kalameh');
    expect(model.homePage?.title, 'خانه');
  });

  test('CartState handles product variants and free shipping threshold', () {
    final cart = CartState();
    cart.clear();
    expect(cart.totalItemCount, 0);

    // Add variant 1 (Black 128GB)
    cart.addItem(
      id: 'p1_black_128',
      title: 'هدفون سونی (مشکی مات - ۱۲۸ گیگابایت)',
      imageUrl: 'https://example.com/p1.png',
      price: 18450000,
    );
    expect(cart.totalItemCount, 1);
    expect(cart.subtotal, 18450000);
    // Over 600,000 Tomans free shipping rule
    expect(cart.shippingCost, 0.0);

    // Apply Coupon OFF20
    final applied = cart.applyCoupon('OFF20');
    expect(applied, true);
    expect(cart.discountAmount, 18450000 * 0.20);
    expect(cart.finalTotal, 18450000 * 0.80);
  });
}
