export interface WordPressPostItem {
  id: string | number;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  url: string;
  author?: string;
  categories?: string[];
}

export class WordPressService {
  /**
   * Helper to strip HTML tags and decode basic HTML entities
   */
  private static cleanHtml(html: string): string {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#8211;/g, '-')
      .replace(/&#8212;/g, '—')
      .replace(/&#8230;/g, '...')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();
  }

  /**
   * Helper to format ISO date into Persian date string
   */
  private static formatPersianDate(isoDate: string): string {
    try {
      const d = new Date(isoDate);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(d);
    } catch (_) {
      return 'اخیراً';
    }
  }

  /**
   * Fetches live blog posts from WordPress REST API (/wp-json/wp/v2/posts?_embed=1)
   */
  static async fetchPosts(siteUrl: string, limit: number = 6): Promise<WordPressPostItem[]> {
    const sanitizedUrl = siteUrl.trim().replace(/\/+$/, '');
    const apiUrl = `${sanitizedUrl}/wp-json/wp/v2/posts?per_page=${limit}&_embed=1`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(apiUrl, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const postsData = (await res.json()) as any[];
        if (Array.isArray(postsData) && postsData.length > 0) {
          return postsData.map((p) => {
            // 1. Resolve featured image
            let imageUrl = '';
            try {
              const media = p._embedded?.['wp:featuredmedia'];
              if (Array.isArray(media) && media.length > 0) {
                imageUrl =
                  media[0].source_url ||
                  media[0].media_details?.sizes?.medium?.source_url ||
                  media[0].media_details?.sizes?.full?.source_url ||
                  '';
              }
            } catch (_) {}

            if (!imageUrl) {
              imageUrl =
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=400&fit=crop';
            }

            // 2. Resolve author
            let author = '';
            try {
              const authors = p._embedded?.['author'];
              if (Array.isArray(authors) && authors.length > 0) {
                author = authors[0].name || '';
              }
            } catch (_) {}

            // 3. Clean Title & Excerpt
            const title = this.cleanHtml(p.title?.rendered || 'مقاله جدید');
            let excerpt = this.cleanHtml(p.excerpt?.rendered || p.content?.rendered || '');
            if (excerpt.length > 120) {
              excerpt = `${excerpt.substring(0, 117)}...`;
            }

            return {
              id: p.id || `wp_${Date.now()}_${Math.random()}`,
              title,
              excerpt: excerpt || 'برای مطالعه متن کامل مقاله در وب‌سایت کلیک کنید.',
              imageUrl,
              date: this.formatPersianDate(p.date || new Date().toISOString()),
              url: p.link || `${sanitizedUrl}/?p=${p.id}`,
              author: author || 'تیم تحریریه',
            };
          });
        }
      }
    } catch (err: any) {
      console.warn(`[WordPressService] Could not fetch live posts from ${apiUrl}:`, err.message);
    }

    // High quality Persian fallback articles tailored for tech/e-commerce
    return [
      {
        id: 'wp_fallback_1',
        title: 'راهنمای جامع خرید محصولات هوشمند و نکات مهم قبل از خرید',
        excerpt: 'در این مقاله به بررسی فاکتورهای کلیدی انتخاب تجهیزات هوشمند و مقایسه اکوسیستم‌ها می‌پردازیم.',
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop',
        date: '۲ آبان ۱۴۰۳',
        url: `${sanitizedUrl}/smart-home-guide`,
        author: 'کارشناس فناوری',
      },
      {
        id: 'wp_fallback_2',
        title: 'مقایسه جدیدترین گجت‌ها و اکسسوری‌های کاربردی سال',
        excerpt: 'بررسی نقاط قوت و ضعف پرفروش‌ترین تجهیزات بازار و ارزش خرید هر مدل نسبت به قیمت.',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
        date: '۲۸ مهر ۱۴۰۳',
        url: `${sanitizedUrl}/gadgets-comparison`,
        author: 'تحریریه نقد و بررسی',
      },
      {
        id: 'wp_fallback_3',
        title: 'چگونه از باتری و عملکرد دستگاه‌های هوشمند مراقبت کنیم؟',
        excerpt: 'روش‌های علمی و موثر برای افزایش طول عمر باتری‌ها و حفظ سرعت و کارایی در درازمدت.',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
        date: '۱۵ مهر ۱۴۰۳',
        url: `${sanitizedUrl}/battery-maintenance-tips`,
        author: 'پشتیبانی فنی',
      },
      {
        id: 'wp_fallback_4',
        title: 'تخفیف‌ها و پیشنهادات شگفت‌انگیز فصل جدید',
        excerpt: 'جزئیات کدهای تخفیف اختصاصی، نحوه استفاده از بن‌های خرید و شرایط ارسال رایگان سفارش‌ها.',
        imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
        date: '۱۰ مهر ۱۴۰۳',
        url: `${sanitizedUrl}/seasonal-discounts`,
        author: 'واحد روابط عمومی',
      },
    ];
  }
}
