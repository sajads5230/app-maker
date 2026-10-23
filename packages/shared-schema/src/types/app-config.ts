import { AppThemeConfig } from './theme.js';
import { NavigationConfig } from './navigation.js';
import { AppPage } from './page.js';

export interface AppMetadata {
  id: string;
  name: string;                // e.g. "دیجی‌استور"
  version: string;             // e.g. "1.0.0"
  buildNumber: number;         // e.g. 1
  packageName: string;         // e.g. "ir.appmaker.digistore"
  iconUrl?: string;
  splashUrl?: string;
  description?: string;
  supportPhone?: string;
  supportEmail?: string;
  socialLinks?: {
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
  };
}

export interface StoreConfig {
  currency: string;            // e.g. "تومان"
  currencySymbol: string;      // e.g. "تومان"
  currencyPosition: 'left' | 'right';
  enableGuestCheckout: boolean;
  minOrderAmount?: number;
  deliveryMethods?: {
    id: string;
    title: string;
    price: number;
  }[];
}

export interface WooCommerceConfig {
  enabled: boolean;
  siteUrl: string;             // e.g. "https://example-shop.com"
  consumerKey?: string;
  consumerSecret?: string;
  isWordpressAppConnected?: boolean;
}

/**
 * Root Application Configuration Schema
 * This JSON is delivered to the Flutter client upon startup to dynamically build the entire app.
 */
export interface AppConfig {
  schemaVersion: string;       // e.g. "1.0.0"
  metadata: AppMetadata;
  theme: AppThemeConfig;
  navigation: NavigationConfig;
  pages: AppPage[];
  store: StoreConfig;
  woocommerce?: WooCommerceConfig;
}
