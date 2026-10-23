import { AppAction } from './actions.js';

/**
 * Base properties shared by every block
 */
export interface BaseBlock {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  visible?: boolean;
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  backgroundColor?: string;
}

/**
 * Single item inside a banner slider
 */
export interface BannerSlideItem {
  id: string;
  imageUrl: string;
  title?: string;
  action: AppAction;
}

export interface BannerSliderBlock extends BaseBlock {
  type: 'banner_slider';
  items: BannerSlideItem[];
  autoPlay?: boolean;
  autoPlayIntervalMs?: number; // default: 4000
  height?: number;             // default: 180
  aspectRatio?: number;        // default: 16/9
  indicatorStyle?: 'dots' | 'line' | 'numeric';
  borderRadius?: number;
}

/**
 * Category Item
 */
export interface CategoryItem {
  id: string;
  title: string;
  iconUrl?: string;
  imageUrl?: string;
  badgeText?: string;
  action: AppAction;
}

export interface CategoryGridBlock extends BaseBlock {
  type: 'categories';
  layout: 'grid_4_col' | 'grid_3_col' | 'horizontal_scroll' | 'chips';
  items: CategoryItem[];
  source?: 'manual' | 'woocommerce_api';
  iconShape?: 'circle' | 'rounded_rect' | 'square';
}

/**
 * Product Item representation in blocks
 */
export interface ProductItem {
  id: string;
  title: string;
  slug?: string;
  price: number;
  regularPrice?: number;
  discountPercent?: number;
  imageUrl: string;
  stockStatus?: 'in_stock' | 'out_of_stock';
  rating?: number;
  reviewsCount?: number;
}

export interface ProductCarouselBlock extends BaseBlock {
  type: 'product_carousel';
  filter: 'special_offer' | 'latest' | 'best_seller' | 'featured' | 'category';
  categoryId?: string;
  limit: number;
  showSeeAllButton?: boolean;
  seeAllAction?: AppAction;
  themeColor?: string; // e.g. red background for "پیشنهاد شگفت‌انگیز"
  items?: ProductItem[]; // for manual override or cached preview
}

export interface ProductGridBlock extends BaseBlock {
  type: 'product_grid';
  columns: 2 | 3;
  filter: 'latest' | 'category' | 'featured';
  categoryId?: string;
  limit: number;
  items?: ProductItem[];
}

/**
 * Promo Banners (1, 2 or 4 grid items)
 */
export interface PromoBannerItem {
  id: string;
  imageUrl: string;
  action: AppAction;
}

export interface PromoBannerBlock extends BaseBlock {
  type: 'promo_banners';
  layout: 'single' | 'two_column' | 'four_grid';
  banners: PromoBannerItem[];
  aspectRatio?: number;
}

/**
 * Blog / Article List Block
 */
export interface ArticleItem {
  id: string;
  title: string;
  excerpt?: string;
  imageUrl: string;
  date?: string;
  author?: string;
  action: AppAction;
}

export interface BlogListBlock extends BaseBlock {
  type: 'blog_list';
  layout: 'horizontal_cards' | 'vertical_list';
  items: ArticleItem[];
  limit?: number;
}

/**
 * Information or announcement banner
 */
export interface NoticeBoxBlock extends BaseBlock {
  type: 'notice_box';
  variant: 'info' | 'warning' | 'success' | 'alert';
  message: string;
  iconName?: string;
  action?: AppAction;
}

/**
 * Spacer or line divider
 */
export interface DividerSpacerBlock extends BaseBlock {
  type: 'spacer';
  height: number;
  showLine?: boolean;
  lineColor?: string;
}

/**
 * Discriminated union of all available blocks
 */
export type AppBlock = 
  | BannerSliderBlock
  | CategoryGridBlock
  | ProductCarouselBlock
  | ProductGridBlock
  | PromoBannerBlock
  | BlogListBlock
  | NoticeBoxBlock
  | DividerSpacerBlock;
