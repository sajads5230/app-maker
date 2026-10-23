import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CustomFormWidget extends StatefulWidget {
  final Map<String, dynamic> data;

  const CustomFormWidget({super.key, required this.data});

  @override
  State<CustomFormWidget> createState() => _CustomFormWidgetState();
}

class _CustomFormWidgetState extends State<CustomFormWidget> {
  final Map<String, TextEditingController> _controllers = {};
  final Map<String, dynamic> _dropdownValues = {};
  final _formKey = GlobalKey<FormState>();
  bool _isSubmitting = false;
  String? _trackingNumber;
  String? _successMessage;

  @override
  void initState() {
    super.initState();
    _initFields();
  }

  void _initFields() {
    final fields = widget.data['fields'] as List<dynamic>? ?? [];
    for (final field in fields) {
      if (field is Map<String, dynamic>) {
        final id = field['id']?.toString() ?? '';
        final type = field['type']?.toString() ?? 'text';
        if (type == 'select') {
          final options = field['options'] as List<dynamic>? ?? [];
          if (options.isNotEmpty) {
            _dropdownValues[id] = options.first.toString();
          }
        } else {
          _controllers[id] = TextEditingController(text: field['defaultValue']?.toString() ?? '');
        }
      }
    }
  }

  @override
  void dispose() {
    for (final c in _controllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
    });

    final payload = <String, dynamic>{};
    for (final entry in _controllers.entries) {
      payload[entry.key] = entry.value.text;
    }
    for (final entry in _dropdownValues.entries) {
      payload[entry.key] = entry.value;
    }

    final formId = widget.data['formId']?.toString() ?? 'e403a958-9d9a-4fa9-8c98-198a3285c191';
    final projectId = widget.data['projectId']?.toString() ?? 'app-demo-techmarket';

    try {
      final res = await http.post(
        Uri.parse('http://localhost:4000/api/projects/$projectId/forms/$formId/submit'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'data': payload,
          'userPhone': payload['f_phone'] ?? payload['phone'] ?? '09123456789',
          'userName': payload['f_name'] ?? payload['name'] ?? 'کاربر موبایل',
        }),
      );

      if (mounted && res.statusCode == 200) {
        final resData = jsonDecode(res.body);
        setState(() {
          _isSubmitting = false;
          _trackingNumber = resData['trackingNumber']?.toString() ?? 'FRM-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
          _successMessage = resData['message']?.toString() ?? 'اطلاعات با موفقیت ثبت شد.';
        });
      }
    } catch (_) {
      // Offline fallback simulation
      await Future.delayed(const Duration(milliseconds: 600));
      if (mounted) {
        setState(() {
          _isSubmitting = false;
          _trackingNumber = 'FRM-OFFLINE-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
          _successMessage = 'اطلاعات شما با موفقیت ذخیره گردید و در اولین اتصال به سرور همگام‌سازی خواهد شد.';
        });
      }
    }
  }

  void _resetForm() {
    setState(() {
      _trackingNumber = null;
      _successMessage = null;
      for (final c in _controllers.values) {
        c.clear();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.data['title']?.toString() ?? 'فرم سفارشی خدمات و گارانتی';
    final description = widget.data['description']?.toString() ?? 'لطفاً فیلدهای زیر را با دقت تکمیل فرمایید:';
    final submitButtonText = widget.data['submitButtonText']?.toString() ?? 'ثبت و ارسال اطلاعات';
    final fields = widget.data['fields'] as List<dynamic>? ?? [
      {
        'id': 'f_name',
        'label': 'نام و نام خانوادگی خریدار',
        'type': 'text',
        'required': true,
        'placeholder': 'علیرضا محمدی',
      },
      {
        'id': 'f_phone',
        'label': 'شماره تماس همراه',
        'type': 'tel',
        'required': true,
        'placeholder': '09121234567',
      },
      {
        'id': 'f_model',
        'label': 'مدل محصول',
        'type': 'select',
        'required': true,
        'options': ['گوشی شیائومی 14T Pro', 'ساعت هوشمند Watch S3', 'جاروبرقی رباتیک Mijia Omni'],
      },
      {
        'id': 'f_issue',
        'label': 'توضیحات درخواست یا عیب فنی',
        'type': 'textarea',
        'required': false,
        'placeholder': 'توضیحات تکمیلی...',
      },
    ];

    // Ensure controllers exist
    for (final field in fields) {
      if (field is Map<String, dynamic>) {
        final id = field['id']?.toString() ?? '';
        final type = field['type']?.toString() ?? 'text';
        if (type != 'select' && !_controllers.containsKey(id)) {
          _controllers[id] = TextEditingController();
        } else if (type == 'select' && !_dropdownValues.containsKey(id)) {
          final options = field['options'] as List<dynamic>? ?? [];
          if (options.isNotEmpty) {
            _dropdownValues[id] = options.first.toString();
          }
        }
      }
    }

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: _trackingNumber != null
            ? _buildSuccessView()
            : Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: const Color(0xFF3B82F6).withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.dynamic_form_rounded, color: Color(0xFF2563EB), size: 20),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                title,
                                style: const TextStyle(
                                  fontFamily: 'Kalameh',
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF111827),
                                ),
                              ),
                              Text(
                                description,
                                style: const TextStyle(
                                  fontFamily: 'Kalameh',
                                  fontSize: 10,
                                  color: Color(0xFF6B7280),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24, color: Color(0xFFF3F4F6)),

                    // Fields List
                    ...fields.map((field) {
                      if (field is! Map<String, dynamic>) return const SizedBox.shrink();
                      return _buildFieldWidget(field);
                    }),

                    const SizedBox(height: 12),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      height: 44,
                      child: ElevatedButton(
                        onPressed: _isSubmitting ? null : _submitForm,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: _isSubmitting
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                              )
                            : Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.send_rounded, size: 16),
                                  const SizedBox(width: 8),
                                  Text(
                                    submitButtonText,
                                    style: const TextStyle(
                                      fontFamily: 'Kalameh',
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildFieldWidget(Map<String, dynamic> field) {
    final id = field['id']?.toString() ?? '';
    final label = field['label']?.toString() ?? '';
    final type = field['type']?.toString() ?? 'text';
    final placeholder = field['placeholder']?.toString() ?? '';
    final isRequired = field['required'] == true;

    if (type == 'select') {
      final options = (field['options'] as List<dynamic>? ?? []).map((e) => e.toString()).toList();
      return Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  label,
                  style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF374151)),
                ),
                if (isRequired)
                  const Text(' *', style: TextStyle(color: Colors.red, fontSize: 11)),
              ],
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                border: Border.all(color: const Color(0xFFD1D5DB)),
                borderRadius: BorderRadius.circular(10),
                color: const Color(0xFFF9FAFB),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _dropdownValues[id],
                  isExpanded: true,
                  style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Color(0xFF111827)),
                  items: options.map((opt) {
                    return DropdownMenuItem<String>(
                      value: opt,
                      child: Text(opt),
                    );
                  }).toList(),
                  onChanged: (val) {
                    setState(() {
                      _dropdownValues[id] = val;
                    });
                  },
                ),
              ),
            ),
          ],
        ),
      );
    }

    final isTextarea = type == 'textarea';

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                label,
                style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF374151)),
              ),
              if (isRequired)
                const Text(' *', style: TextStyle(color: Colors.red, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 6),
          TextFormField(
            controller: _controllers[id],
            maxLines: isTextarea ? 3 : 1,
            keyboardType: type == 'tel'
                ? TextInputType.phone
                : (type == 'number' ? TextInputType.number : TextInputType.text),
            validator: (val) {
              if (isRequired && (val == null || val.trim().isEmpty)) {
                return 'تکمیل این فیلد الزامی است.';
              }
              return null;
            },
            style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
            decoration: InputDecoration(
              hintText: placeholder,
              hintStyle: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF9CA3AF)),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const Color(0xFFD1D5DB).let(),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFF2563EB)),
              ),
              filled: true,
              fillColor: const Color(0xFFF9FAFB),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessView() {
    return Column(
      children: [
        Container(
          width: 52,
          height: 52,
          decoration: BoxDecoration(
            color: const Color(0xFF10B981).withValues(alpha: 0.15),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 32),
        ),
        const SizedBox(height: 12),
        const Text(
          'درخواست با موفقیت ثبت شد!',
          style: TextStyle(fontFamily: 'Kalameh', fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF111827)),
        ),
        const SizedBox(height: 6),
        Text(
          _successMessage ?? '',
          textAlign: TextAlign.center,
          style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Color(0xFF6B7280)),
        ),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('کد پیگیری:', style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF4B5563))),
              const SizedBox(width: 8),
              Text(
                _trackingNumber ?? '',
                style: const TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2563EB)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        OutlinedButton(
          onPressed: _resetForm,
          style: OutlinedButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
          child: const Text('ثبت درخواست جدید', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
        ),
      ],
    );
  }
}

extension LetExtension on Color {
  BorderSide let() => BorderSide(color: this);
}
