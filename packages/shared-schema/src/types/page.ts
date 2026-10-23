import { AppBlock } from './blocks.js';

export interface AppPage {
  id: string;               // e.g. "home_page", "catalog_page"
  title: string;            // e.g. "صفحه اصلی"
  slug: string;             // e.g. "home"
  isHome?: boolean;
  blocks: AppBlock[];
}
