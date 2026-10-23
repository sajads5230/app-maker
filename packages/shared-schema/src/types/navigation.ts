import { AppAction } from './actions.js';

/**
 * Bottom Navigation Bar Tab Item
 */
export interface BottomNavTab {
  id: string;
  label: string;              // e.g. "خانه", "دسته‌ها", "سبد خرید", "حساب من"
  icon: string;               // e.g. "home", "grid", "shopping-cart", "user"
  activeIcon?: string;
  targetPageId: string;       // id of the page to open
  badgeCount?: number;        // e.g. items in cart
}

/**
 * Top App Bar / Header configuration
 */
export interface AppBarConfig {
  showLogo: boolean;
  logoUrl?: string;
  title?: string;
  showSearch: boolean;
  searchPlaceholder?: string; // e.g. "جستجو در هزاران محصول..."
  showCartIcon: boolean;
  showNotificationIcon: boolean;
  showDrawerButton: boolean;
}

/**
 * Drawer Menu Item
 */
export interface DrawerItem {
  id: string;
  label: string;
  icon: string;
  action: AppAction;
  dividerAfter?: boolean;
}

export interface NavigationConfig {
  appBar: AppBarConfig;
  bottomNav: {
    enabled: boolean;
    tabs: BottomNavTab[];
  };
  drawer: {
    enabled: boolean;
    headerBannerUrl?: string;
    items: DrawerItem[];
  };
}
