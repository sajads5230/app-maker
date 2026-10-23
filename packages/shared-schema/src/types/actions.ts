/**
 * Action triggered when an interactive element (banner, button, card) is tapped.
 */
export type ActionType = 
  | 'open_product'
  | 'open_category'
  | 'open_page'
  | 'open_url'
  | 'open_cart'
  | 'open_search'
  | 'contact_call'
  | 'share_app';

export interface AppAction {
  type: ActionType;
  targetId?: string; // e.g. productId, categoryId, pageId
  url?: string;
  external?: boolean; // open in external browser vs in-app
  payload?: Record<string, unknown>;
}
