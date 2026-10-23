import 'package:flutter/material.dart';

class AppConfigModel {
  final String schemaVersion;
  final AppMetadataModel metadata;
  final AppThemeModel theme;
  final NavigationModel navigation;
  final List<AppPageModel> pages;
  final StoreConfigModel store;
  final WooCommerceConfigModel? woocommerce;

  AppConfigModel({
    required this.schemaVersion,
    required this.metadata,
    required this.theme,
    required this.navigation,
    required this.pages,
    required this.store,
    this.woocommerce,
  });

  factory AppConfigModel.fromJson(Map<String, dynamic> json) {
    List<AppPageModel> pagesList = (json['pages'] as List<dynamic>? ?? [])
        .map((p) => AppPageModel.fromJson(p))
        .toList();

    // If 'pages' is empty, check if 'blocks' is provided at root (Server-Driven UI baseline)
    final rootBlocks = (json['blocks'] as List<dynamic>? ?? []);
    if (pagesList.isEmpty && rootBlocks.isNotEmpty) {
      pagesList = [
        AppPageModel(
          id: 'page_home',
          title: 'صفحه اصلی',
          slug: '/',
          isHome: true,
          blocksJson: rootBlocks,
        )
      ];
    }

    WooCommerceConfigModel? wooConfig;
    if (json['woocommerce'] != null) {
      wooConfig = WooCommerceConfigModel.fromJson(json['woocommerce']);
    } else if (json['plugins']?['woocommerce']?['settings'] != null) {
      final s = json['plugins']['woocommerce']['settings'];
      wooConfig = WooCommerceConfigModel.fromJson({
        'enabled': json['plugins']['woocommerce']['enabled'] ?? true,
        'siteUrl': s['siteUrl'],
        'consumerKey': s['consumerKey'],
        'consumerSecret': s['consumerSecret'],
      });
    }

    return AppConfigModel(
      schemaVersion: json['schemaVersion'] ?? '1.0.0',
      metadata: AppMetadataModel.fromJson(json['metadata'] ?? {}),
      theme: AppThemeModel.fromJson(json['theme'] ?? {}),
      navigation: NavigationModel.fromJson(json['navigation'] ?? {}),
      pages: pagesList,
      store: StoreConfigModel.fromJson(json['store'] ?? {}),
      woocommerce: wooConfig,
    );
  }

  AppPageModel? get homePage {
    try {
      return pages.firstWhere((p) => p.isHome == true);
    } catch (_) {
      return pages.isNotEmpty ? pages.first : null;
    }
  }

  /// Aggregates all unique products from all product blocks across the app
  List<Map<String, dynamic>> get allProducts {
    final Map<String, Map<String, dynamic>> map = {};
    final home = homePage;
    if (home != null) {
      for (final b in home.blocksJson) {
        if (b is Map<String, dynamic> &&
            (b['type'] == 'product_grid' ||
                b['type'] == 'product_carousel' ||
                b['type'] == 'slider')) {
          final items = b['items'] as List<dynamic>? ?? [];
          for (final it in items) {
            if (it is Map<String, dynamic>) {
              final id = it['id']?.toString() ?? it['title']?.toString() ?? '';
              if (id.isNotEmpty && !map.containsKey(id)) {
                map[id] = it;
              }
            }
          }
        }
      }
    }
    return map.values.toList();
  }

  /// Returns all store categories extracted from the categories block
  List<Map<String, dynamic>> get allCategories {
    final home = homePage;
    if (home != null) {
      for (final b in home.blocksJson) {
        if (b is Map<String, dynamic> &&
            (b['type'] == 'categories' || b['type'] == 'category_grid')) {
          final items = b['items'] as List<dynamic>? ?? [];
          return items.whereType<Map<String, dynamic>>().toList();
        }
      }
    }
    return [];
  }

  AppPageModel? findPageById(String id) {
    try {
      return pages.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }
}

class AppMetadataModel {
  final String id;
  final String name;
  final String version;
  final String packageName;
  final String? iconUrl;
  final String? splashUrl;

  AppMetadataModel({
    required this.id,
    required this.name,
    required this.version,
    required this.packageName,
    this.iconUrl,
    this.splashUrl,
  });

  factory AppMetadataModel.fromJson(Map<String, dynamic> json) {
    return AppMetadataModel(
      id: json['id'] ?? '',
      name: json['name'] ?? 'فروشگاه',
      version: json['version'] ?? '1.0.0',
      packageName: json['packageName'] ?? 'ir.appmaker.app',
      iconUrl: json['iconUrl'],
      splashUrl: json['splashUrl'],
    );
  }
}

class AppThemeModel {
  final String mode;
  final bool isRTL;
  final String fontFamily;
  final Color primaryColor;
  final Color secondaryColor;
  final Color backgroundColor;
  final Color surfaceColor;
  final Color textPrimaryColor;
  final Color textSecondaryColor;

  AppThemeModel({
    required this.mode,
    required this.isRTL,
    required this.fontFamily,
    required this.primaryColor,
    required this.secondaryColor,
    required this.backgroundColor,
    required this.surfaceColor,
    required this.textPrimaryColor,
    required this.textSecondaryColor,
  });

  factory AppThemeModel.fromJson(Map<String, dynamic> json) {
    final light = json['lightPalette'] as Map<String, dynamic>? ?? {};
    return AppThemeModel(
      mode: json['mode'] ?? 'light',
      isRTL: json['isRTL'] ?? true,
      fontFamily: json['fontFamily'] ?? 'Kalameh',
      primaryColor: _parseColor(light['primary'], const Color(0xFFEF394E)),
      secondaryColor: _parseColor(light['secondary'], const Color(0xFF008EB9)),
      backgroundColor: _parseColor(light['background'], const Color(0xFFF8F9FA)),
      surfaceColor: _parseColor(light['surface'], Colors.white),
      textPrimaryColor: _parseColor(light['textPrimary'], const Color(0xFF1F2937)),
      textSecondaryColor: _parseColor(light['textSecondary'], const Color(0xFF6B7280)),
    );
  }

  static Color _parseColor(dynamic val, Color fallback) {
    if (val is String && val.startsWith('#')) {
      final hex = val.replaceAll('#', '');
      if (hex.length == 6) {
        return Color(int.parse('FF$hex', radix: 16));
      } else if (hex.length == 8) {
        return Color(int.parse(hex, radix: 16));
      }
    }
    return fallback;
  }
}

class NavigationModel {
  final AppBarModel appBar;
  final BottomNavModel bottomNav;

  NavigationModel({required this.appBar, required this.bottomNav});

  factory NavigationModel.fromJson(Map<String, dynamic> json) {
    return NavigationModel(
      appBar: AppBarModel.fromJson(json['appBar'] ?? {}),
      bottomNav: BottomNavModel.fromJson(json['bottomNav'] ?? {}),
    );
  }
}

class AppBarModel {
  final bool showLogo;
  final String title;
  final bool showSearch;
  final String searchPlaceholder;
  final bool showCartIcon;

  AppBarModel({
    required this.showLogo,
    required this.title,
    required this.showSearch,
    required this.searchPlaceholder,
    required this.showCartIcon,
  });

  factory AppBarModel.fromJson(Map<String, dynamic> json) {
    return AppBarModel(
      showLogo: json['showLogo'] ?? true,
      title: json['title'] ?? '',
      showSearch: json['showSearch'] ?? true,
      searchPlaceholder: json['searchPlaceholder'] ?? 'جستجو در محصولات...',
      showCartIcon: json['showCartIcon'] ?? true,
    );
  }
}

class BottomNavModel {
  final bool enabled;
  final List<BottomNavTabModel> tabs;

  BottomNavModel({required this.enabled, required this.tabs});

  factory BottomNavModel.fromJson(Map<String, dynamic> json) {
    return BottomNavModel(
      enabled: json['enabled'] ?? true,
      tabs: (json['tabs'] as List<dynamic>? ?? [])
          .map((t) => BottomNavTabModel.fromJson(t))
          .toList(),
    );
  }
}

class BottomNavTabModel {
  final String id;
  final String label;
  final String icon;
  final String targetPageId;
  final int? badgeCount;

  BottomNavTabModel({
    required this.id,
    required this.label,
    required this.icon,
    required this.targetPageId,
    this.badgeCount,
  });

  factory BottomNavTabModel.fromJson(Map<String, dynamic> json) {
    return BottomNavTabModel(
      id: json['id'] ?? '',
      label: json['label'] ?? '',
      icon: json['icon'] ?? 'home',
      targetPageId: json['targetPageId'] ?? json['targetPage'] ?? '',
      badgeCount: json['badgeCount'],
    );
  }
}

class AppPageModel {
  final String id;
  final String title;
  final String slug;
  final bool isHome;
  final List<dynamic> blocksJson;

  AppPageModel({
    required this.id,
    required this.title,
    required this.slug,
    this.isHome = false,
    required this.blocksJson,
  });

  factory AppPageModel.fromJson(Map<String, dynamic> json) {
    return AppPageModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      isHome: json['isHome'] ?? false,
      blocksJson: json['blocks'] as List<dynamic>? ?? [],
    );
  }
}

class StoreConfigModel {
  final String currency;
  final String currencySymbol;

  StoreConfigModel({required this.currency, required this.currencySymbol});

  factory StoreConfigModel.fromJson(Map<String, dynamic> json) {
    return StoreConfigModel(
      currency: json['currency'] ?? 'تومان',
      currencySymbol: json['currencySymbol'] ?? 'تومان',
    );
  }
}

class WooCommerceConfigModel {
  final bool enabled;
  final String siteUrl;
  final String? consumerKey;
  final String? consumerSecret;

  WooCommerceConfigModel({
    required this.enabled,
    required this.siteUrl,
    this.consumerKey,
    this.consumerSecret,
  });

  factory WooCommerceConfigModel.fromJson(Map<String, dynamic> json) {
    return WooCommerceConfigModel(
      enabled: json['enabled'] ?? false,
      siteUrl: json['siteUrl'] ?? '',
      consumerKey: json['consumerKey'],
      consumerSecret: json['consumerSecret'],
    );
  }
}
