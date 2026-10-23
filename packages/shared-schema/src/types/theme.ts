/**
 * Theme and styling configuration for the mobile app
 */
export interface ColorPalette {
  primary: string;         // e.g. #ef394e (Digikala red) or #008eb9
  primaryLight?: string;
  secondary: string;       // Accent color
  background: string;      // Light background #f5f5f5
  surface: string;         // Card background #ffffff
  textPrimary: string;     // Main text color #1a1a1a
  textSecondary: string;   // Subtitles #757575
  border: string;          // Dividers & borders #e0e0e0
  success: string;         // Success badges #4caf50
  error: string;           // Error badges & discounts #e53935
  warning: string;         // Warnings #fb8c00
}

export type FontFamily = 
  | 'Kalameh'
  | 'Vazirmatn' 
  | 'IRANSans' 
  | 'YekanBakh' 
  | 'Shabnam' 
  | 'Samim' 
  | 'System';

export interface AppThemeConfig {
  mode: 'light' | 'dark' | 'system';
  isRTL: boolean;                     // true for Persian/Arabic
  fontFamily: FontFamily;
  borderRadius: {
    small: number;   // e.g. 4
    medium: number;  // e.g. 8 (standard cards)
    large: number;   // e.g. 16 (modals, sheets)
    full: number;    // e.g. 999 (chips, pill buttons)
  };
  lightPalette: ColorPalette;
  darkPalette?: Partial<ColorPalette>;
}
