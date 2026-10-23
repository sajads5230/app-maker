import { z } from 'zod';

export const AppActionSchema = z.object({
  type: z.enum([
    'open_product',
    'open_category',
    'open_page',
    'open_url',
    'open_cart',
    'open_search',
    'contact_call',
    'share_app'
  ]),
  targetId: z.string().optional(),
  url: z.string().optional(),
  external: z.boolean().optional(),
  payload: z.record(z.unknown()).optional(),
});

export const ColorPaletteSchema = z.object({
  primary: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
  primaryLight: z.string().optional(),
  secondary: z.string(),
  background: z.string(),
  surface: z.string(),
  textPrimary: z.string(),
  textSecondary: z.string(),
  border: z.string(),
  success: z.string(),
  error: z.string(),
  warning: z.string(),
});

export const AppThemeConfigSchema = z.object({
  mode: z.enum(['light', 'dark', 'system']),
  isRTL: z.boolean().default(true),
  fontFamily: z.enum(['Kalameh', 'Vazirmatn', 'IRANSans', 'YekanBakh', 'Shabnam', 'Samim', 'System']),
  borderRadius: z.object({
    small: z.number().nonnegative(),
    medium: z.number().nonnegative(),
    large: z.number().nonnegative(),
    full: z.number().nonnegative(),
  }),
  lightPalette: ColorPaletteSchema,
  darkPalette: ColorPaletteSchema.partial().optional(),
});

export const BannerSlideItemSchema = z.object({
  id: z.string(),
  imageUrl: z.string().url().or(z.string().startsWith('/')),
  title: z.string().optional(),
  action: AppActionSchema,
});

export const CategoryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  iconUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  badgeText: z.string().optional(),
  action: AppActionSchema,
});

export const ProductItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string().optional(),
  price: z.number().nonnegative(),
  regularPrice: z.number().nonnegative().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  imageUrl: z.string(),
  stockStatus: z.enum(['in_stock', 'out_of_stock']).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().nonnegative().optional(),
});

export const BaseBlockSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  visible: z.boolean().default(true).optional(),
  padding: z.object({
    top: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional(),
    right: z.number().optional(),
  }).optional(),
  backgroundColor: z.string().optional(),
});

export const BannerSliderBlockSchema = BaseBlockSchema.extend({
  type: z.literal('banner_slider'),
  items: z.array(BannerSlideItemSchema),
  autoPlay: z.boolean().optional(),
  autoPlayIntervalMs: z.number().optional(),
  height: z.number().optional(),
  aspectRatio: z.number().optional(),
  indicatorStyle: z.enum(['dots', 'line', 'numeric']).optional(),
  borderRadius: z.number().optional(),
});

export const CategoryGridBlockSchema = BaseBlockSchema.extend({
  type: z.literal('categories'),
  layout: z.enum(['grid_4_col', 'grid_3_col', 'horizontal_scroll', 'chips']),
  items: z.array(CategoryItemSchema),
  source: z.enum(['manual', 'woocommerce_api']).optional(),
  iconShape: z.enum(['circle', 'rounded_rect', 'square']).optional(),
});

export const ProductCarouselBlockSchema = BaseBlockSchema.extend({
  type: z.literal('product_carousel'),
  filter: z.enum(['special_offer', 'latest', 'best_seller', 'featured', 'category']),
  categoryId: z.string().optional(),
  limit: z.number().int().positive(),
  showSeeAllButton: z.boolean().optional(),
  seeAllAction: AppActionSchema.optional(),
  themeColor: z.string().optional(),
  items: z.array(ProductItemSchema).optional(),
});

export const ProductGridBlockSchema = BaseBlockSchema.extend({
  type: z.literal('product_grid'),
  columns: z.union([z.literal(2), z.literal(3)]),
  filter: z.enum(['latest', 'category', 'featured']),
  categoryId: z.string().optional(),
  limit: z.number().int().positive(),
  items: z.array(ProductItemSchema).optional(),
});

export const PromoBannerBlockSchema = BaseBlockSchema.extend({
  type: z.literal('promo_banners'),
  layout: z.enum(['single', 'two_column', 'four_grid']),
  banners: z.array(z.object({
    id: z.string(),
    imageUrl: z.string(),
    action: AppActionSchema,
  })),
  aspectRatio: z.number().optional(),
});

export const BlogListBlockSchema = BaseBlockSchema.extend({
  type: z.literal('blog_list'),
  layout: z.enum(['horizontal_cards', 'vertical_list']),
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    excerpt: z.string().optional(),
    imageUrl: z.string(),
    date: z.string().optional(),
    author: z.string().optional(),
    action: AppActionSchema,
  })),
  limit: z.number().int().positive().optional(),
});

export const NoticeBoxBlockSchema = BaseBlockSchema.extend({
  type: z.literal('notice_box'),
  variant: z.enum(['info', 'warning', 'success', 'alert']),
  message: z.string(),
  iconName: z.string().optional(),
  action: AppActionSchema.optional(),
});

export const DividerSpacerBlockSchema = BaseBlockSchema.extend({
  type: z.literal('spacer'),
  height: z.number().nonnegative(),
  showLine: z.boolean().optional(),
  lineColor: z.string().optional(),
});

export const AppBlockSchema = z.discriminatedUnion('type', [
  BannerSliderBlockSchema,
  CategoryGridBlockSchema,
  ProductCarouselBlockSchema,
  ProductGridBlockSchema,
  PromoBannerBlockSchema,
  BlogListBlockSchema,
  NoticeBoxBlockSchema,
  DividerSpacerBlockSchema,
]);

export const AppPageSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  isHome: z.boolean().optional(),
  blocks: z.array(AppBlockSchema),
});

export const BottomNavTabSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string(),
  activeIcon: z.string().optional(),
  targetPageId: z.string(),
  badgeCount: z.number().int().nonnegative().optional(),
});

export const NavigationConfigSchema = z.object({
  appBar: z.object({
    showLogo: z.boolean(),
    logoUrl: z.string().optional(),
    title: z.string().optional(),
    showSearch: z.boolean(),
    searchPlaceholder: z.string().optional(),
    showCartIcon: z.boolean(),
    showNotificationIcon: z.boolean(),
    showDrawerButton: z.boolean(),
  }),
  bottomNav: z.object({
    enabled: z.boolean(),
    tabs: z.array(BottomNavTabSchema),
  }),
  drawer: z.object({
    enabled: z.boolean(),
    headerBannerUrl: z.string().optional(),
    items: z.array(z.object({
      id: z.string(),
      label: z.string(),
      icon: z.string(),
      action: AppActionSchema,
      dividerAfter: z.boolean().optional(),
    })),
  }),
});

export const AppConfigSchema = z.object({
  schemaVersion: z.string().default('1.0.0'),
  metadata: z.object({
    id: z.string(),
    name: z.string().min(2),
    version: z.string(),
    buildNumber: z.number().int().positive(),
    packageName: z.string().regex(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/),
    iconUrl: z.string().optional(),
    splashUrl: z.string().optional(),
    description: z.string().optional(),
    supportPhone: z.string().optional(),
    supportEmail: z.string().email().optional(),
  }),
  theme: AppThemeConfigSchema,
  navigation: NavigationConfigSchema,
  pages: z.array(AppPageSchema),
  store: z.object({
    currency: z.string().default('تومان'),
    currencySymbol: z.string().default('تومان'),
    currencyPosition: z.enum(['left', 'right']).default('left'),
    enableGuestCheckout: z.boolean().default(false),
    minOrderAmount: z.number().nonnegative().optional(),
  }),
  woocommerce: z.object({
    enabled: z.boolean(),
    siteUrl: z.string(),
    consumerKey: z.string().optional(),
    consumerSecret: z.string().optional(),
  }).optional(),
});
