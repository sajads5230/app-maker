import 'package:flutter/material.dart';

class NoticeBoxWidget extends StatelessWidget {
  final Map<String, dynamic> data;

  const NoticeBoxWidget({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final message = data['message'] as String? ?? '';
    final variant = data['variant'] as String? ?? 'info';

    Color bgColor = const Color(0xFFEFF6FF);
    Color borderColor = const Color(0xFFBFDBFE);
    Color textColor = const Color(0xFF1E3A8A);

    if (variant == 'warning') {
      bgColor = const Color(0xFFFFFBEB);
      borderColor = const Color(0xFFFDE68A);
      textColor = const Color(0xFF78350F);
    } else if (variant == 'success') {
      bgColor = const Color(0xFFECFDF5);
      borderColor = const Color(0xFFA7F3D0);
      textColor = const Color(0xFF065F46);
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: borderColor, width: 0.8),
      ),
      child: Row(
        children: [
          const Text('📢 ', style: TextStyle(fontSize: 14)),
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: textColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
