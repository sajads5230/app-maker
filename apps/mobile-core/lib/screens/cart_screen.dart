import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../core/state/cart_state.dart';
import 'checkout_sheet.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _couponController = TextEditingController();
  final cart = CartState();
  final currencyFormat = NumberFormat('#,###');

  @override
  void dispose() {
    _couponController.dispose();
    super.dispose();
  }

  void _applyCoupon() {
    final code = _couponController.text.trim();
    if (code.isEmpty) return;

    final success = cart.applyCoupon(code);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          success ? 'کد تخفیف با موفقیت اعمال شد! 🎉' : 'کد تخفیف نامعتبر یا منقضی شده است.',
          style: const TextStyle(fontFamily: 'Kalameh', fontSize: 12),
        ),
        backgroundColor: success ? const Color(0xFF10B981) : const Color(0xFFEF4444),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: cart,
      builder: (context, _) {
        if (cart.items.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.shopping_basket_outlined, size: 72, color: Colors.grey.shade300),
                const SizedBox(height: 12),
                const Text(
                  'سبد خرید شما خالی است!',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'می‌توانید از صفحه اصلی محصولات مورد نظر خود را اضافه کنید.',
                  style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                ),
              ],
            ),
          );
        }

        return Column(
          children: [
            // Items List
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(14),
                itemCount: cart.items.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final item = cart.items[index];
                  return Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE5E7EB), width: 0.8),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: SizedBox(
                            width: 72,
                            height: 72,
                            child: CachedNetworkImage(
                              imageUrl: item.imageUrl,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, height: 1.3),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                '${currencyFormat.format(item.price)} تومان',
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFFEF394E),
                                ),
                              ),
                              const SizedBox(height: 8),
                              // Counter Controls
                              Row(
                                children: [
                                  Container(
                                    decoration: BoxDecoration(
                                      border: Border.all(color: const Color(0xFFD1D5DB)),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      children: [
                                        IconButton(
                                          icon: const Icon(Icons.add, size: 16),
                                          onPressed: () => cart.incrementQuantity(item.id),
                                          constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
                                          padding: EdgeInsets.zero,
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.symmetric(horizontal: 8),
                                          child: Text(
                                            '${item.quantity}',
                                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                        IconButton(
                                          icon: Icon(
                                            item.quantity > 1 ? Icons.remove : Icons.delete_outline,
                                            size: 16,
                                            color: item.quantity == 1 ? Colors.red : null,
                                          ),
                                          onPressed: () => cart.decrementQuantity(item.id),
                                          constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
                                          padding: EdgeInsets.zero,
                                        ),
                                      ],
                                    ),
                                  ),
                                  const Spacer(),
                                  Text(
                                    'مجموع: ${currencyFormat.format(item.totalPrice)} ت',
                                    style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Coupon & Summary Footer
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -3)),
                ],
              ),
              child: Column(
                children: [
                  // Coupon Code Row
                  Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: 38,
                          child: TextField(
                            controller: _couponController,
                            style: const TextStyle(fontSize: 11),
                            decoration: InputDecoration(
                              hintText: 'کد تخفیف (مثال: OFF20)',
                              hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 11),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                              filled: true,
                              fillColor: const Color(0xFFF9FAFB),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      SizedBox(
                        height: 38,
                        child: ElevatedButton(
                          onPressed: _applyCoupon,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF1F2937),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            padding: const EdgeInsets.symmetric(horizontal: 14),
                          ),
                          child: const Text('اعمال', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                  if (cart.appliedCouponCode != null) ...[
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('کد تخفیف فعال: ${cart.appliedCouponCode}', style: const TextStyle(fontSize: 11, color: Color(0xFF10B981))),
                        GestureDetector(
                          onTap: cart.removeCoupon,
                          child: const Text('حذف', style: TextStyle(fontSize: 10, color: Colors.red)),
                        ),
                      ],
                    ),
                  ],
                  const Divider(height: 20),
                  // Breakdown
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('مجموع اقلام (${cart.totalItemCount}):', style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
                      Text('${currencyFormat.format(cart.subtotal)} تومان', style: const TextStyle(fontSize: 11)),
                    ],
                  ),
                  if (cart.discountAmount > 0) ...[
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('تخفیف:', style: TextStyle(fontSize: 11, color: Color(0xFFEF4444))),
                        Text('- ${currencyFormat.format(cart.discountAmount)} تومان', style: const TextStyle(fontSize: 11, color: Color(0xFFEF4444), fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('هزینه ارسال:', style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
                      Text(
                        cart.shippingCost == 0 ? 'رایگان 🎉' : '${currencyFormat.format(cart.shippingCost)} تومان',
                        style: TextStyle(
                          fontSize: 11,
                          color: cart.shippingCost == 0 ? const Color(0xFF10B981) : Colors.black87,
                          fontWeight: cart.shippingCost == 0 ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Checkout Action Button
                  Row(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('مبلغ نهایی:', style: TextStyle(fontSize: 10, color: Colors.grey)),
                          Text(
                            '${currencyFormat.format(cart.finalTotal)} تومان',
                            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFFEF394E)),
                          ),
                        ],
                      ),
                      const Spacer(),
                      ElevatedButton(
                        onPressed: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (context) => const CheckoutSheet(),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEF394E),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('ثبت و پرداخت نهایی', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
