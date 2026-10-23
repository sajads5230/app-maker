import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class NotificationService extends ChangeNotifier {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;

  NotificationService._internal() {
    _loadLocalCache();
  }

  static const String _defaultServerUrl = 'http://10.0.2.2:4000';
  String get _serverBaseUrl => kIsWeb ? 'http://localhost:4000' : _defaultServerUrl;

  List<Map<String, dynamic>> _notifications = [];
  int _unreadCount = 0;
  bool _isLoading = false;

  List<Map<String, dynamic>> get notifications => _notifications;
  int get unreadCount => _unreadCount;
  bool get isLoading => _isLoading;

  Future<void> _loadLocalCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cachedJson = prefs.getString('cached_app_notifications');
      if (cachedJson != null) {
        final decoded = jsonDecode(cachedJson) as List<dynamic>;
        _notifications = decoded.cast<Map<String, dynamic>>();
        _updateUnreadCount();
        notifyListeners();
      }
    } catch (_) {}
    fetchInbox();
  }

  void _updateUnreadCount() {
    _unreadCount = _notifications.where((n) => n['isRead'] != true).length;
  }

  /// Fetches latest notifications from server
  Future<void> fetchInbox({String? phone}) async {
    _isLoading = true;
    notifyListeners();

    try {
      final query = phone != null ? '?phone=$phone' : '';
      final url = Uri.parse('$_serverBaseUrl/api/notifications/inbox$query');
      final res = await http.get(url).timeout(const Duration(seconds: 4));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        if (data['notifications'] is List) {
          _notifications = (data['notifications'] as List).cast<Map<String, dynamic>>();
          _unreadCount = data['unreadCount'] ?? _notifications.where((n) => n['isRead'] != true).length;

          // Save to local cache
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('cached_app_notifications', jsonEncode(_notifications));
          notifyListeners();
          return;
        }
      }
    } catch (e) {
      debugPrint('[NotificationService] Network inbox fetch fallback: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    // Default fallback notifications if server is unreachable
    if (_notifications.isEmpty) {
      _notifications = [
        {
          'id': 'notif_default_1',
          'title': '📦 به‌روزرسانی سفارش #10209',
          'body': 'سفارش شما در سیستم ثبت و در وضعیت «در انتظار تایید و بسته‌بندی» قرار گرفت.',
          'type': 'order',
          'isRead': false,
          'formattedDate': 'امروز',
        },
        {
          'id': 'notif_default_2',
          'title': '🎁 کد تخفیف ویژه ۱۰۰ هزار تومانی یلدا',
          'body': 'کد تخفیف YALDA روی تمامی سفارش‌های بالای ۱ میلیون تومان فعال شد!',
          'type': 'discount',
          'isRead': false,
          'formattedDate': 'دیروز',
        },
      ];
      _updateUnreadCount();
      notifyListeners();
    }
  }

  /// Marks a notification as read
  Future<void> markAsRead(String id) async {
    final idx = _notifications.indexWhere((n) => n['id'] == id);
    if (idx != -1) {
      _notifications[idx]['isRead'] = true;
      _updateUnreadCount();
      notifyListeners();

      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('cached_app_notifications', jsonEncode(_notifications));

        final url = Uri.parse('$_serverBaseUrl/api/notifications/mark-read');
        await http.post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'id': id}),
        ).timeout(const Duration(seconds: 3));
      } catch (_) {}
    }
  }

  /// Marks all notifications as read
  Future<void> markAllAsRead() async {
    for (var n in _notifications) {
      n['isRead'] = true;
    }
    _unreadCount = 0;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('cached_app_notifications', jsonEncode(_notifications));

      final url = Uri.parse('$_serverBaseUrl/api/notifications/mark-all-read');
      await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'projectId': 'app-demo-techmarket'}),
      ).timeout(const Duration(seconds: 3));
    } catch (_) {}
  }
}
