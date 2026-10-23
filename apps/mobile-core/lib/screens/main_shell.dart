import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/models/app_config_model.dart';
import '../core/renderers/block_renderer.dart';
import '../core/state/cart_state.dart';
import '../core/services/otp_service.dart';
import '../core/services/config_sync_service.dart';
import '../core/services/notification_service.dart';
import 'cart_screen.dart';
import 'categories_screen.dart';
import 'search_screen.dart';
import 'profile_screen.dart';
import 'notifications_sheet.dart';
import '../widgets/otp_login_dialog.dart';
import '../widgets/lucky_wheel_dialog.dart';
import '../widgets/support_sheet.dart';
import '../widgets/rating_prompt_dialog.dart';
import '../widgets/language_currency_sheet.dart';
import '../core/services/offline_cache_service.dart';
import '../core/services/localization_service.dart';
import '../core/services/app_update_service.dart';

class MainShellScreen extends StatefulWidget {
  final AppConfigModel config;

  const MainShellScreen({super.key, required this.config});

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  int _currentTabIndex = 0;
  late AppConfigModel _activeConfig;
  final cart = CartState();
  final otpService = OtpService();
  final notifService = NotificationService();

  @override
  void initState() {
    super.initState();
    _activeConfig = widget.config;
    _checkRemoteSync();
    _checkWelcomePromo();
    _checkForAppUpdate();
  }

  void _checkForAppUpdate() async {
    await Future.delayed(const Duration(milliseconds: 2500));
    if (!mounted) return;
    AppUpdateService.promptIfUpdateAvailable(
      context,
      projectId: _activeConfig.metadata.id.isNotEmpty ? _activeConfig.metadata.id : 'app-demo-techmarket',
    );
  }

  void _checkWelcomePromo() async {
    final prefs = await SharedPreferences.getInstance();
    final hasShown = prefs.getBool('welcome_promo_shown') ?? false;
    if (!hasShown && mounted) {
      await Future.delayed(const Duration(milliseconds: 1400));
      if (!mounted) return;
      await prefs.setBool('welcome_promo_shown', true);
      _showWelcomePromoDialog();
    }
  }

  void _showWelcomePromoDialog() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFEF394E), Color(0xFFDC2626)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFEF394E).withValues(alpha: 0.35),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Icon(Icons.card_giftcard_rounded, color: Colors.white, size: 32),
              ),
              const SizedBox(height: 16),
              const Text(
                'به اپلیکیشن شیائومی اسمارت خوش آمدید! 🎉',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'به پاس انتخاب شما، کد تخفیف ۵۰ هزار تومانی ویژه اولین خرید تقدیم حضورتان می‌گردد:',
                style: TextStyle(fontSize: 11, color: Color(0xFF6B7280), height: 1.4),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFFECACA)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('کد تخفیف اختصاصی:', style: TextStyle(fontSize: 9, color: Color(0xFF991B1B))),
                        Text(
                          'WELCOME50',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2,
                            color: Color(0xFFEF394E),
                          ),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      icon: const Icon(Icons.copy, size: 14),
                      label: const Text('کپی کد', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEF394E),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () {
                        Clipboard.setData(const ClipboardData(text: 'WELCOME50'));
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('کد تخفیف WELCOME50 با موفقیت کپی شد! 🎁', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
                            backgroundColor: Color(0xFF10B981),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1F2937),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('شروع گشت‌وگذار و خرید', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _checkRemoteSync() async {
    final updated = await ConfigSyncService.syncRemoteConfig(
      projectId: _activeConfig.metadata.id.isNotEmpty ? _activeConfig.metadata.id : 'app-demo-techmarket',
    );
    if (updated != null && mounted) {
      setState(() => _activeConfig = updated);
    }
  }

  @override
  void didUpdateWidget(MainShellScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.config != oldWidget.config) {
      setState(() => _activeConfig = widget.config);
    }
  }

  @override
  Widget build(BuildContext context) {
    final nav = _activeConfig.navigation;
    final tabs = nav.bottomNav.tabs;
    final loc = LocalizationService();
    final cacheService = OfflineCacheService();

    return ListenableBuilder(
      listenable: loc,
      builder: (context, _) => Directionality(
        textDirection: loc.isRTL ? TextDirection.rtl : TextDirection.ltr,
        child: Scaffold(
          drawer: _buildDrawer(),
          appBar: _buildAppBar(nav.appBar),
          body: ListenableBuilder(
            listenable: cacheService,
            builder: (context, _) => Column(
              children: [
                if (cacheService.isOfflineMode)
                  Container(
                    width: double.infinity,
                    color: const Color(0xFFF59E0B),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.wifi_off_rounded, color: Colors.white, size: 16),
                        const SizedBox(width: 8),
                        Text(
                          loc.t('offline_banner'),
                          style: const TextStyle(fontFamily: 'Kalameh', fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                Expanded(child: _buildCurrentTabBody(tabs)),
              ],
            ),
          ),
          floatingActionButton: _buildFloatingSupportButton(),
          bottomNavigationBar: nav.bottomNav.enabled && tabs.isNotEmpty
              ? _buildBottomNav(tabs)
              : null,
        ),
      ),
    );
  }

  Widget _buildCurrentTabBody(List<BottomNavTabModel> tabs) {
    if (tabs.isNotEmpty && _currentTabIndex < tabs.length) {
      final targetPageId = tabs[_currentTabIndex].targetPageId;

      if (targetPageId == 'page_categories' || targetPageId == 'categories' || _currentTabIndex == 1) {
        return CategoriesScreen(config: widget.config);
      }
      if (targetPageId == 'page_cart' || targetPageId == 'cart' || _currentTabIndex == 2) {
        return const CartScreen();
      }
      if (targetPageId == 'page_profile' || targetPageId == 'profile' || _currentTabIndex == 3) {
        return const ProfileScreen();
      }
    }

    // Default Home Blocks
    final homePage = widget.config.homePage;
    if (homePage != null && homePage.blocksJson.isNotEmpty) {
      return _buildPageBlocks(homePage);
    }

    return _buildDefaultFallbackHome();
  }

  PreferredSizeWidget _buildAppBar(AppBarModel appBarConfig) {
    return PreferredSize(
      preferredSize: const Size.fromHeight(100),
      child: Container(
        color: Colors.white,
        padding: const EdgeInsets.only(top: 36, left: 12, right: 12, bottom: 8),
        child: Column(
          children: [
            Row(
              children: [
                Builder(
                  builder: (context) => IconButton(
                    icon: const Icon(Icons.menu, color: Color(0xFF1F2937)),
                    onPressed: () => Scaffold.of(context).openDrawer(),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: widget.config.theme.primaryColor,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'تک',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  widget.config.metadata.name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.language_rounded, size: 21, color: Color(0xFF4B5563)),
                  tooltip: 'تغییر زبان و واحد پول',
                  onPressed: () => LanguageCurrencySheet.show(context),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.stars_rounded, size: 24, color: Color(0xFFF59E0B)),
                  tooltip: 'گردونه جوایز و شانس روزانه',
                  onPressed: () => LuckyWheelDialog.show(context),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
                const SizedBox(width: 8),
                ListenableBuilder(
                  listenable: notifService,
                  builder: (context, _) => Stack(
                    clipBehavior: Clip.none,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.notifications_none, size: 22, color: Color(0xFF4B5563)),
                        onPressed: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (_) => const NotificationsSheet(),
                          );
                        },
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                      if (notifService.unreadCount > 0)
                        Positioned(
                          top: -3,
                          right: -3,
                          child: Container(
                            padding: const EdgeInsets.all(3),
                            decoration: const BoxDecoration(
                              color: Color(0xFFEF394E),
                              shape: BoxShape.circle,
                            ),
                            constraints: const BoxConstraints(minWidth: 15, minHeight: 15),
                            child: Text(
                              '${notifService.unreadCount}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                ListenableBuilder(
                  listenable: cart,
                  builder: (context, _) => Stack(
                    clipBehavior: Clip.none,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.shopping_bag_outlined, size: 22, color: Color(0xFF4B5563)),
                        onPressed: () {
                          // Switch to cart tab (usually index 2)
                          final cartIndex = widget.config.navigation.bottomNav.tabs
                              .indexWhere((t) => t.targetPageId == 'page_cart');
                          if (cartIndex != -1) {
                            setState(() => _currentTabIndex = cartIndex);
                          } else {
                            setState(() => _currentTabIndex = 2);
                          }
                        },
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                      if (cart.totalItemCount > 0)
                        Positioned(
                          top: -4,
                          right: -4,
                          child: Container(
                            padding: const EdgeInsets.all(3),
                            decoration: BoxDecoration(
                              color: widget.config.theme.primaryColor,
                              shape: BoxShape.circle,
                            ),
                            constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                            child: Text(
                              '${cart.totalItemCount}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Interactive Search Input - Tapping opens SearchScreen
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => SearchScreen(config: widget.config)),
                );
              },
              child: Container(
                height: 38,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE5E7EB), width: 0.8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.search, size: 18, color: Color(0xFF9CA3AF)),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        appBarConfig.searchPlaceholder,
                        style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF)),
                      ),
                    ),
                    const Icon(Icons.tune_rounded, size: 16, color: Color(0xFF9CA3AF)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPageBlocks(AppPageModel page) {
    return RefreshIndicator(
      color: _activeConfig.theme.primaryColor,
      onRefresh: () async {
        final updated = await ConfigSyncService.syncRemoteConfig(
          projectId: _activeConfig.metadata.id.isNotEmpty ? _activeConfig.metadata.id : 'app-demo-techmarket',
        );
        if (updated != null && mounted) {
          setState(() => _activeConfig = updated);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('ویترین فروشگاه با وب‌هوک ووکامرس همگام‌سازی شد 🔄', style: TextStyle(fontFamily: 'Kalameh', fontSize: 11)),
              duration: Duration(seconds: 2),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      },
      child: ListView.builder(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 24),
        itemCount: page.blocksJson.length,
        itemBuilder: (context, index) {
          final block = page.blocksJson[index];
          return BlockRenderer.render(block);
        },
      ),
    );
  }

  Widget _buildBottomNav(List<BottomNavTabModel> tabs) {
    return ListenableBuilder(
      listenable: cart,
      builder: (context, _) => BottomNavigationBar(
        currentIndex: _currentTabIndex,
        onTap: (index) => setState(() => _currentTabIndex = index),
        selectedItemColor: widget.config.theme.primaryColor,
        unselectedItemColor: const Color(0xFF9CA3AF),
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        items: tabs.map((tab) {
          final isCart = tab.targetPageId == 'page_cart';
          return BottomNavigationBarItem(
            icon: isCart && cart.totalItemCount > 0
                ? Badge(
                    label: Text('${cart.totalItemCount}', style: const TextStyle(fontSize: 9)),
                    child: _resolveIcon(tab.icon),
                  )
                : _resolveIcon(tab.icon),
            label: tab.label,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildFloatingSupportButton() {
    return FloatingActionButton.extended(
      onPressed: () => SupportSheet.show(context),
      backgroundColor: const Color(0xFF10B981),
      foregroundColor: Colors.white,
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      icon: const Stack(
        clipBehavior: Clip.none,
        children: [
          Icon(Icons.support_agent_rounded, size: 22),
          Positioned(
            top: -2,
            right: -2,
            child: CircleAvatar(
              radius: 4,
              backgroundColor: Color(0xFF34D399),
            ),
          ),
        ],
      ),
      label: const Text(
        'پشتیبانی آنلاین',
        style: TextStyle(fontFamily: 'Kalameh', fontSize: 11, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      child: ListenableBuilder(
        listenable: otpService,
        builder: (context, _) => Column(
          children: [
            Container(
              height: 140,
              width: double.infinity,
              color: const Color(0xFF1F2937),
              padding: const EdgeInsets.all(16),
              alignment: Alignment.bottomRight,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    widget.config.metadata.name,
                    style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  GestureDetector(
                    onTap: () {
                      Navigator.pop(context);
                      if (!otpService.isLoggedIn) {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (context) => const OtpLoginSheet(),
                        );
                      }
                    },
                    child: Text(
                      otpService.isLoggedIn
                          ? '👤 ${otpService.currentUserPhone} (خروج)'
                          : '🔑 ورود / ثبت‌نام شماره همراه',
                      style: TextStyle(
                        color: otpService.isLoggedIn ? const Color(0xFF10B981) : const Color(0xFF9CA3AF),
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.grid_view_outlined),
              title: const Text('دسته‌بندی‌های کالا', style: TextStyle(fontSize: 12)),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentTabIndex = 1);
              },
            ),
            ListTile(
              leading: const Icon(Icons.inventory_2_outlined),
              title: const Text('سفارش‌های من', style: TextStyle(fontSize: 12)),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentTabIndex = 3);
              },
            ),
            ListTile(
              leading: const Icon(Icons.favorite_border),
              title: const Text('علاقه‌مندی‌ها', style: TextStyle(fontSize: 12)),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentTabIndex = 3);
              },
            ),
            ListTile(
              leading: const Icon(Icons.support_agent_rounded, color: Color(0xFF10B981)),
              title: const Text('پشتیبانی سریع (ایتا، تلفن، چت)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              onTap: () {
                Navigator.pop(context);
                SupportSheet.show(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.star_rate_rounded, color: Color(0xFFF59E0B)),
              title: const Text('امتیاز به اپلیکیشن در کافه‌بازار و مایکت', style: TextStyle(fontSize: 12)),
              onTap: () {
                Navigator.pop(context);
                RatingPromptDialog.showForce(context, packageName: widget.config.metadata.packageName);
              },
            ),
            ListTile(
              leading: const Icon(Icons.language_rounded, color: Color(0xFF6366F1)),
              title: const Text('زبان و واحد پول (فارسی / USD / AED)', style: TextStyle(fontSize: 12)),
              onTap: () {
                Navigator.pop(context);
                LanguageCurrencySheet.show(context);
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.rule_outlined),
              title: const Text('قوانین و مقررات خرید', style: TextStyle(fontSize: 12)),
              onTap: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDefaultFallbackHome() {
    return ListView(
      padding: const EdgeInsets.only(bottom: 24),
      children: [
        BlockRenderer.render({
          'type': 'notice_box',
          'variant': 'info',
          'message': '🚚 ارسال رایگان برای خریدهای بالای ۶۰۰ هزار تومان در سراسر کشور',
        }),
        BlockRenderer.render({
          'type': 'banner_slider',
          'height': 160,
          'items': [
            {'id': 's1', 'imageUrl': 'http://localhost:4000/uploads/banner-special-offers.png', 'title': 'جشنواره فروش ویژه تک‌مارکت'},
            {'id': 's2', 'imageUrl': 'http://localhost:4000/uploads/banner-accessories.png', 'title': 'تجهیزات هوشمند و جانبی موبایل'},
          ],
        }),
        BlockRenderer.render({
          'type': 'categories',
          'title': 'دسته‌بندی‌های محبوب',
          'items': [
            {'id': 'c_1575', 'title': 'خانه و آشپزخانه هوشمند', 'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/12/1-2.jpg'},
            {'id': 'c_1579', 'title': 'دوربین های نظارتی هوشمند', 'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/09/18.jpg'},
            {'id': 'c_1577', 'title': 'سیستم سرمایش و گرمایش هوشمند', 'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/11/8-11.jpg'},
            {'id': 'c_1578', 'title': 'کلید و پریز هوشمند', 'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/11/12-5.jpg'},
          ],
        }),
        BlockRenderer.render({
          'type': 'product_carousel',
          'title': 'پیشنهاد شگفت‌انگیز',
          'subtitle': 'تخفیف‌های محدود با زمان باقی‌مانده',
          'themeColor': '#ef394e',
          'items': [
            {
              'id': 'p_fb1',
              'title': 'ماشین لباسشویی 14 کیلوگرمی، سه مخزن PRO شیائومی MIJIA مدل XHQG140MJ202',
              'price': 114995000,
              'regularPrice': 125000000,
              'discountPercent': 8,
              'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/12/1-2.jpg',
            },
            {
              'id': 'p_fb2',
              'title': 'جارو رباتیک 5 شیائومی MI مدل PV31CN',
              'price': 129000000,
              'regularPrice': 138000000,
              'discountPercent': 7,
              'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/12/1-1.jpg',
            },
            {
              'id': 'p_fb3',
              'title': 'کولر گازی ایستاده هوشمند شیائومی MIJIA مدل 72LW',
              'price': 481750000,
              'regularPrice': 510000000,
              'discountPercent': 6,
              'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/11/8-11.jpg',
            },
          ],
        }),
        BlockRenderer.render({
          'type': 'product_grid',
          'title': 'جدیدترین محصولات فروشگاه',
          'items': [
            {
              'id': 'p_fb5',
              'title': 'دوربین مداربسته هوشمند 4PRO شیائومی مدل MJSXJ11HL',
              'price': 27025000,
              'regularPrice': 29500000,
              'discountPercent': 8,
              'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/09/18.jpg',
            },
            {
              'id': 'p_fb7',
              'title': 'کلید لمسی هوشمند شیائومی MI مدل XMZHP02LM',
              'price': 25850000,
              'regularPrice': 28000000,
              'discountPercent': 8,
              'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/11/12-5.jpg',
            },
            {
              'id': 'p_fb9',
              'title': 'قفل درب هوشمند E30 شیائومی Mi مدل XMZNMST11LK',
              'price': 58750000,
              'regularPrice': 64000000,
              'discountPercent': 8,
              'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/10/20.jpg',
            },
            {
              'id': 'p_fb11',
              'title': 'لامپ سقفی هوشمند شیائومی Philips مدل 9290029660',
              'price': 199750000,
              'regularPrice': 218000000,
              'discountPercent': 8,
              'imageUrl': 'https://xiaomismart.ir/wp-content/uploads/2025/11/Untitled-1.jpg',
            },
          ],
        }),
      ],
    );
  }

  Widget _resolveIcon(String iconName) {
    switch (iconName.toLowerCase()) {
      case 'home':
        return const Icon(Icons.home_outlined);
      case 'grid':
      case 'categories':
      case 'category':
        return const Icon(Icons.grid_view_outlined);
      case 'cart':
      case 'shopping-cart':
      case 'shopping_bag':
        return const Icon(Icons.shopping_bag_outlined);
      case 'user':
      case 'profile':
      case 'person':
        return const Icon(Icons.person_outline);
      default:
        return const Icon(Icons.circle_outlined);
    }
  }
}
