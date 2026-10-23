import 'package:flutter/material.dart';
import '../core/services/notification_service.dart';

class NotificationsSheet extends StatefulWidget {
  const NotificationsSheet({super.key});

  @override
  State<NotificationsSheet> createState() => _NotificationsSheetState();
}

class _NotificationsSheetState extends State<NotificationsSheet> {
  final notifService = NotificationService();
  String _selectedFilter = 'all';

  @override
  void initState() {
    super.initState();
    notifService.addListener(_onChanged);
    notifService.fetchInbox();
  }

  @override
  void dispose() {
    notifService.removeListener(_onChanged);
    super.dispose();
  }

  void _onChanged() {
    if (mounted) setState(() {});
  }

  List<Map<String, dynamic>> get _filteredNotifications {
    final list = notifService.notifications;
    if (_selectedFilter == 'all') return list;
    return list.where((n) => n['type'] == _selectedFilter).toList();
  }

  IconData _getIconForType(String? type) {
    switch (type) {
      case 'order':
        return Icons.local_shipping_outlined;
      case 'discount':
        return Icons.local_offer_outlined;
      case 'news':
        return Icons.campaign_outlined;
      case 'system':
        return Icons.verified_user_outlined;
      default:
        return Icons.notifications_none_outlined;
    }
  }

  Color _getColorForType(String? type) {
    switch (type) {
      case 'order':
        return const Color(0xFF3B82F6);
      case 'discount':
        return const Color(0xFFEF394E);
      case 'news':
        return const Color(0xFF8B5CF6);
      case 'system':
        return const Color(0xFF10B981);
      default:
        return const Color(0xFF6B7280);
    }
  }

  @override
  Widget build(BuildContext context) {
    final notifications = _filteredNotifications;
    final unread = notifService.unreadCount;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Handle bar
            Container(
              margin: const EdgeInsets.only(top: 10, bottom: 6),
              width: 36,
              height: 4,
              decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
            ),

            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF8B5CF6).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.notifications_active_outlined, size: 20, color: Color(0xFF8B5CF6)),
                  ),
                  const SizedBox(width: 10),
                  const Text('صندوق پیام‌ها و اعلان‌ها', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  if (unread > 0) ...[
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEF394E),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '$unread جدید',
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                  const Spacer(),
                  if (unread > 0)
                    TextButton(
                      onPressed: () => notifService.markAllAsRead(),
                      child: const Text('خواندن همه', style: TextStyle(fontSize: 11, color: Color(0xFF3B82F6), fontWeight: FontWeight.bold)),
                    ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            // Filter Tabs
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  _buildFilterChip('all', 'همه اعلان‌ها (${notifService.notifications.length})'),
                  const SizedBox(width: 6),
                  _buildFilterChip('order', 'سفارشات'),
                  const SizedBox(width: 6),
                  _buildFilterChip('discount', 'تخفیف‌ها'),
                  const SizedBox(width: 6),
                  _buildFilterChip('news', 'اخبار کالاها'),
                ],
              ),
            ),

            const SizedBox(height: 8),
            const Divider(height: 1),

            // Notifications List
            Expanded(
              child: notifService.isLoading && notifService.notifications.isEmpty
                  ? const Center(child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF8B5CF6)))
                  : notifications.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.notifications_off_outlined, size: 48, color: Colors.grey.shade300),
                              const SizedBox(height: 10),
                              const Text('پیام جدیدی یافت نشد', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF4B5563))),
                              const SizedBox(height: 4),
                              Text('اعلان‌های تخفیف و وضعیت سفارش‌ها در اینجا نمایش داده می‌شوند.', style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
                            ],
                          ),
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: notifications.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 10),
                          itemBuilder: (context, index) {
                            final n = notifications[index];
                            final isRead = n['isRead'] == true;
                            final type = n['type'] as String?;
                            final icon = _getIconForType(type);
                            final color = _getColorForType(type);

                            return InkWell(
                              onTap: () {
                                if (n['id'] != null) {
                                  notifService.markAsRead(n['id']);
                                }
                              },
                              borderRadius: BorderRadius.circular(14),
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: isRead ? Colors.white : color.withValues(alpha: 0.04),
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: isRead ? const Color(0xFFE5E7EB) : color.withValues(alpha: 0.3)),
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: color.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Icon(icon, size: 20, color: color),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Expanded(
                                                child: Text(
                                                  n['title'] ?? '',
                                                  style: TextStyle(
                                                    fontSize: 12,
                                                    fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                                                    color: const Color(0xFF1F2937),
                                                  ),
                                                ),
                                              ),
                                              Text(
                                                n['formattedDate'] ?? '',
                                                style: TextStyle(fontSize: 10, color: Colors.grey.shade500),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            n['body'] ?? '',
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: isRead ? Colors.grey.shade600 : Colors.grey.shade800,
                                              height: 1.4,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (!isRead) ...[
                                      const SizedBox(width: 8),
                                      Container(
                                        width: 8,
                                        height: 8,
                                        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String key, String label) {
    final isSelected = _selectedFilter == key;
    return GestureDetector(
      onTap: () => setState(() => _selectedFilter = key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF1F2937) : const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 10,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            color: isSelected ? Colors.white : const Color(0xFF4B5563),
          ),
        ),
      ),
    );
  }
}
