import 'package:flutter/material.dart';

class BookingReservationWidget extends StatefulWidget {
  final Map<String, dynamic> data;

  const BookingReservationWidget({super.key, required this.data});

  @override
  State<BookingReservationWidget> createState() => _BookingReservationWidgetState();
}

class _BookingReservationWidgetState extends State<BookingReservationWidget> {
  int _selectedServiceIndex = 0;
  int _selectedSpecialistIndex = 0;
  int _selectedDayIndex = 0;
  String _selectedTimeSlot = '۱۰:۰۰ صبح';

  final List<Map<String, dynamic>> _services = [
    {'title': 'ویزیت و مشاوره تخصصی', 'fee': 250000, 'duration': '۳۰ دقیقه'},
    {'title': 'خدمات VIP و بررسی جامع', 'fee': 480000, 'duration': '۶۰ دقیقه'},
    {'title': 'نوبت فوری / اورژانسی', 'fee': 350000, 'duration': '۲۰ دقیقه'},
  ];

  final List<Map<String, dynamic>> _specialists = [
    {
      'name': 'دکتر سارا علوی',
      'role': 'متخصص ارشد و مشاور سلامت',
      'rating': '۴.۹',
      'avatar': 'https://images.unsplash.com/photo-1594824813627-c1d02c462060?w=150&h=150&fit=crop',
    },
    {
      'name': 'دکتر کیان رادمهر',
      'role': 'کارشناس خبره و مدرس دوره‌ها',
      'rating': '۴.۸',
      'avatar': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop',
    },
    {
      'name': 'مهندس الناز کریمی',
      'role': 'مشاور پشتیبانی فنی و راه‌اندازی',
      'rating': '۴.۹',
      'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
    },
  ];

  final List<Map<String, String>> _days = [
    {'day': 'شنبه', 'date': '۲ آبان'},
    {'day': 'یکشنبه', 'date': '۳ آبان'},
    {'day': 'دوشنبه', 'date': '۴ آبان'},
    {'day': 'سه‌شنبه', 'date': '۵ آبان'},
    {'day': 'چهارشنبه', 'date': '۶ آبان'},
  ];

  final List<String> _timeSlots = [
    '۰۹:۳۰ صبح',
    '۱۰:۰۰ صبح',
    '۱۱:۳۰ صبح',
    '۱۶:۰۰ عصر',
    '۱۷:۳۰ عصر',
    '۱۹:۰۰ عصر',
  ];

  void _showBookingConfirmation() {
    final service = _services[_selectedServiceIndex];
    final specialist = _specialists[_selectedSpecialistIndex];
    final day = _days[_selectedDayIndex];

    final nameController = TextEditingController(text: 'سجاد براتی');
    final phoneController = TextEditingController(text: '09121234567');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: EdgeInsets.fromLTRB(20, 12, 20, MediaQuery.of(ctx).viewInsets.bottom + 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.check_circle_outline_rounded, color: Color(0xFF10B981), size: 24),
                  ),
                  const SizedBox(width: 12),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'تأیید نهایی و رزرو وقت مراجعه',
                        style: TextStyle(fontFamily: 'Kalameh', fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'پیامک یادآوری و کد رهگیری ارسال خواهد شد',
                        style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF6B7280)),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9FAFB),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Column(
                  children: [
                    _buildRow('خدمت انتخابی:', service['title']),
                    const SizedBox(height: 6),
                    _buildRow('متخصص:', specialist['name']),
                    const SizedBox(height: 6),
                    _buildRow('تاریخ و ساعت:', '${day['day']} ${day['date']} - ساعت $_selectedTimeSlot'),
                    const SizedBox(height: 6),
                    _buildRow('هزینه ودیعه:', '${(service['fee'] as int).toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')} تومان'),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: 'نام و نام خانوادگی مراجع:',
                  labelStyle: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                ),
                style: const TextStyle(fontFamily: 'Kalameh', fontSize: 12),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: phoneController,
                decoration: InputDecoration(
                  labelText: 'شماره موبایل جهت پیامک:',
                  labelStyle: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                ),
                style: const TextStyle(fontFamily: 'Kalameh', fontSize: 12),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'نوبت شما با موفقیت ثبت شد! کد پیگیری رزرو: RES-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
                          style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11),
                        ),
                        backgroundColor: const Color(0xFF10B981),
                        duration: const Duration(seconds: 4),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: const Text('تأیید و صدور نوبت آنلاین', style: TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, color: Color(0xFF6B7280))),
        Text(value, style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.data['title'] ?? 'سامانه نوبت‌دهی و رزرو آنلاین';
    final subtitle = widget.data['subtitle'] ?? 'تعیین وقت مشاوره و خدمات تخصصی در چند ثانیه';

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
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: const Color(0xFF3B82F6).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.event_available_rounded, color: Color(0xFF3B82F6), size: 22),
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
                          color: Color(0xFF1F2937),
                        ),
                      ),
                      Text(
                        subtitle,
                        style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Color(0xFF6B7280)),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // 1. Service Selection
            const Text(
              '۱. انتخاب نوع خدمت:',
              style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF374151)),
            ),
            const SizedBox(height: 6),
            Wrap(
              spacing: 8,
              runSpacing: 6,
              children: List.generate(_services.length, (index) {
                final isSelected = _selectedServiceIndex == index;
                final s = _services[index];
                return ChoiceChip(
                  label: Text(s['title'], style: TextStyle(fontFamily: 'Kalameh', fontSize: 10, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                  selected: isSelected,
                  selectedColor: const Color(0xFF3B82F6).withValues(alpha: 0.18),
                  backgroundColor: const Color(0xFFF3F4F6),
                  side: BorderSide(color: isSelected ? const Color(0xFF3B82F6) : Colors.transparent),
                  onSelected: (val) {
                    if (val) setState(() => _selectedServiceIndex = index);
                  },
                );
              }),
            ),

            const SizedBox(height: 12),

            // 2. Specialist Selection
            const Text(
              '۲. انتخاب متخصص / پزشک:',
              style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF374151)),
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 72,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _specialists.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final spec = _specialists[index];
                  final isSelected = _selectedSpecialistIndex == index;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedSpecialistIndex = index),
                    child: Container(
                      width: 170,
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFEFF6FF) : const Color(0xFFF9FAFB),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isSelected ? const Color(0xFF3B82F6) : const Color(0xFFE5E7EB)),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 18,
                            backgroundImage: NetworkImage(spec['avatar']),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  spec['name'],
                                  style: const TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  spec['role'],
                                  style: const TextStyle(fontFamily: 'Kalameh', fontSize: 9, color: Color(0xFF6B7280)),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 12),

            // 3. Day Selection
            const Text(
              '۳. انتخاب روز مراجعه:',
              style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF374151)),
            ),
            const SizedBox(height: 6),
            SizedBox(
              height: 52,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _days.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final day = _days[index];
                  final isSelected = _selectedDayIndex == index;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedDayIndex = index),
                    child: Container(
                      width: 68,
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF3B82F6) : const Color(0xFFF3F4F6),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            day['day']!,
                            style: TextStyle(
                              fontFamily: 'Kalameh',
                              fontSize: 10,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              color: isSelected ? Colors.white : const Color(0xFF4B5563),
                            ),
                          ),
                          Text(
                            day['date']!,
                            style: TextStyle(
                              fontFamily: 'Kalameh',
                              fontSize: 9,
                              color: isSelected ? Colors.white70 : const Color(0xFF9CA3AF),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 12),

            // 4. Time Slots
            const Text(
              '۴. ساعت نوبت:',
              style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF374151)),
            ),
            const SizedBox(height: 6),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: _timeSlots.map((slot) {
                final isSelected = _selectedTimeSlot == slot;
                return GestureDetector(
                  onTap: () => setState(() => _selectedTimeSlot = slot),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF10B981) : const Color(0xFFF9FAFB),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: isSelected ? const Color(0xFF10B981) : const Color(0xFFE5E7EB)),
                    ),
                    child: Text(
                      slot,
                      style: TextStyle(
                        fontFamily: 'Kalameh',
                        fontSize: 10,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        color: isSelected ? Colors.white : const Color(0xFF374151),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 16),

            // Booking Button
            SizedBox(
              width: double.infinity,
              height: 42,
              child: ElevatedButton.icon(
                onPressed: _showBookingConfirmation,
                icon: const Icon(Icons.check_rounded, size: 18),
                label: const Text(
                  'ثبت و رزرو نوبت در این ساعت',
                  style: TextStyle(fontFamily: 'Kalameh', fontSize: 12, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3B82F6),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 0,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
