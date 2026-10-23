import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../widgets/app_update_dialog.dart';

class AppUpdateInfo {
  final bool hasUpdate;
  final bool forceUpdate;
  final String latestVersion;
  final String? apkDownloadUrl;
  final String? marketUrl;
  final String changelog;

  AppUpdateInfo({
    required this.hasUpdate,
    required this.forceUpdate,
    required this.latestVersion,
    this.apkDownloadUrl,
    this.marketUrl,
    required this.changelog,
  });

  factory AppUpdateInfo.fromJson(Map<String, dynamic> json) {
    return AppUpdateInfo(
      hasUpdate: json['hasUpdate'] == true,
      forceUpdate: json['forceUpdate'] == true,
      latestVersion: json['latestVersion']?.toString() ?? '1.1.0',
      apkDownloadUrl: json['apkDownloadUrl']?.toString(),
      marketUrl: json['marketUrl']?.toString(),
      changelog: json['changelog']?.toString() ?? '• بهبود عملکرد کلی برنامه',
    );
  }
}

class AppUpdateService {
  static const String currentVersion = '1.0.0';

  static Future<AppUpdateInfo?> checkUpdate({
    required String projectId,
    String baseUrl = 'http://localhost:4000',
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/api/projects/$projectId/app-update?version=$currentVersion');
      final res = await http.get(uri).timeout(const Duration(seconds: 4));
      if (res.statusCode == 200) {
        final data = jsonDecode(utf8.decode(res.bodyBytes));
        if (data['success'] == true) {
          return AppUpdateInfo.fromJson(data);
        }
      }
    } catch (e) {
      debugPrint('[AppUpdateService] Check update error: $e');
    }
    return null;
  }

  static void promptIfUpdateAvailable(
    BuildContext context, {
    required String projectId,
    String baseUrl = 'http://localhost:4000',
  }) async {
    final info = await checkUpdate(projectId: projectId, baseUrl: baseUrl);
    if (info != null && info.hasUpdate && context.mounted) {
      showDialog(
        context: context,
        barrierDismissible: !info.forceUpdate,
        builder: (ctx) => AppUpdateDialog(
          updateInfo: info,
          currentVersion: currentVersion,
        ),
      );
    }
  }
}
