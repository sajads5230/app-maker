import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';

interface AiGenerateRequest {
  businessName: string;
  niche?: string;
  description?: string;
  style?: 'modern_dark' | 'luxury_gold' | 'clean_minimal' | 'vibrant_warm';
  features?: string[];
  userId?: string;
  targetProjectId?: string;
  applyMode?: 'update_current' | 'create_new';
}

interface NicheTemplateData {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  isDarkMode: boolean;
  stories: Array<{
    id: string;
    title: string;
    badge: string;
    imageUrl: string;
    slides: Array<{
      id: string;
      imageUrl: string;
      title: string;
      caption: string;
      duration: number;
      buttonText: string;
      buttonLink: string;
    }>;
  }>;
  banners: Array<{
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    linkType: string;
    target: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    imageUrl: string;
    rating: number;
    inStock: boolean;
  }>;
}

const NICHE_DATA: Record<string, NicheTemplateData> = {
  perfume: {
    logoUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop',
    primaryColor: '#8B5CF6',
    secondaryColor: '#6D28D9',
    isDarkMode: true,
    stories: [
      {
        id: 'st_perfume_1',
        title: 'دکانت نیش',
        badge: 'داغ',
        imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=150&h=150&fit=crop',
        slides: [
          {
            id: 'sl_p1',
            imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&h=900&fit=crop',
            title: 'دکانت‌های اورجینال ۵ و ۱۰ میل',
            caption: 'تست رایحه ادوپرفیوم‌های گران‌قیمت نیش قبل از خرید باتل کامل با ضمانت اصالت ۱۰۰٪',
            duration: 5,
            buttonText: 'مشاهده دکانت‌ها',
            buttonLink: '/category/decant',
          },
        ],
      },
      {
        id: 'st_perfume_2',
        title: 'رایحه‌های گرم',
        badge: 'پاییزه',
        imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=150&h=150&fit=crop',
        slides: [
          {
            id: 'sl_p2',
            imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=900&fit=crop',
            title: 'کالکشن عطرهای شرقی و چوبی',
            caption: 'ماندگاری فوق‌العاده بالا و پخش بوی استثنایی برای فصول خنک سال',
            duration: 5,
            buttonText: 'خرید کالکشن گرم',
            buttonLink: '/product/warm',
          },
        ],
      },
      {
        id: 'st_perfume_3',
        title: 'آنباکس لوکس',
        badge: 'ویدیو',
        imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=150&h=150&fit=crop',
        slides: [
          {
            id: 'sl_p3',
            imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=900&fit=crop',
            title: 'جعبه‌گشایی ادوپرفیوم‌های فرانسوی',
            caption: 'بررسی بچ‌کد اصالت و جزئیات بسته‌بندی هولوگرام‌دار',
            duration: 5,
            buttonText: 'مشاهده بررسی',
            buttonLink: '/blog',
          },
        ],
      },
    ],
    banners: [
      {
        id: 'b1',
        title: 'جشنواره ادوپرفیوم‌های نیش و خاص',
        subtitle: 'تضمین مادام‌العمر اصالت عطرها با ارسال رایگان سراسر کشور',
        imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1000&h=450&fit=crop',
        linkType: 'category',
        target: 'all',
      },
      {
        id: 'b2',
        title: 'مشاوره آنلاین انتخاب عطر و تیپ بویایی',
        subtitle: 'تست آنلاین رایگان جهت یافتن امضای بویایی منطبق با شخصیت شما',
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1000&h=450&fit=crop',
        linkType: 'page',
        target: 'quiz',
      },
    ],
    categories: [
      { id: 'c1', name: 'عطر زنانه', imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop' },
      { id: 'c2', name: 'عطر مردانه', imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=200&h=200&fit=crop' },
      { id: 'c3', name: 'دکانت دستریز', imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=200&h=200&fit=crop' },
      { id: 'c4', name: 'عطر نیش و خاص', imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=200&fit=crop' },
    ],
    products: [
      {
        id: 'p1',
        name: 'ادوپرفیوم نیش توباکو وانیل ۱۰۰ میل',
        price: 2450000,
        originalPrice: 2900000,
        discountPercent: 15,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        rating: 4.9,
        inStock: true,
      },
      {
        id: 'p2',
        name: 'دکانت دستریز باکارات رژ ۱۰ میل اورجینال',
        price: 980000,
        originalPrice: 1200000,
        discountPercent: 18,
        imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&h=400&fit=crop',
        rating: 4.8,
        inStock: true,
      },
      {
        id: 'p3',
        name: 'ادوکلن زنانه کریستال نویر ۹۰ میل',
        price: 1850000,
        originalPrice: 2100000,
        discountPercent: 12,
        imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
        rating: 4.7,
        inStock: true,
      },
      {
        id: 'p4',
        name: 'پرفیوم اکستریت بلک افغان ۵۰ میل',
        price: 3650000,
        originalPrice: 4200000,
        discountPercent: 13,
        imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop',
        rating: 5.0,
        inStock: true,
      },
    ],
  },
  food: {
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop',
    primaryColor: '#EA580C',
    secondaryColor: '#C2410C',
    isDarkMode: false,
    stories: [
      {
        id: 'st_food_1',
        title: 'منوی روز',
        badge: 'تازه',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop',
        slides: [
          {
            id: 'sl_f1',
            imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=900&fit=crop',
            title: 'پیتزا ناپلی ایتالیایی با تنور هیزمی',
            caption: 'خمیر تخمیر ۴۸ ساعته با پنیر موزارلا تازه بوفالو و سس دست‌ساز ریحان',
            duration: 5,
            buttonText: 'سفارش آنلاین',
            buttonLink: '/category/pizza',
          },
        ],
      },
      {
        id: 'st_food_2',
        title: 'برگر گریل',
        badge: 'داغ',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop',
        slides: [
          {
            id: 'sl_f2',
            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=900&fit=crop',
            title: 'دوبل برگر گوشت خالص با نان بریوش',
            caption: 'گوشت تازه گوساله گریل شده به همراه پنیر چدار مذاب و سس مخصوص ترنج',
            duration: 5,
            buttonText: 'سفارش برگر',
            buttonLink: '/product/burger',
          },
        ],
      },
    ],
    banners: [
      {
        id: 'b1',
        title: 'سفارش آنلاین با تحویل گرم و اکسپرس',
        subtitle: '۳۰٪ تخفیف روی سفارش اول با کد هدیه: DELICIOUS',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&h=450&fit=crop',
        linkType: 'coupon',
        target: 'DELICIOUS',
      },
    ],
    categories: [
      { id: 'c1', name: 'پیتزا ایتالیایی', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
      { id: 'c2', name: 'برگر دست‌ساز', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
      { id: 'c3', name: 'نوشیدنی و بار سرد', imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&h=200&fit=crop' },
      { id: 'c4', name: 'پیش‌غذا و سالاد', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop' },
    ],
    products: [
      {
        id: 'p1',
        name: 'پیتزا پپرونی با پنیر گودا و سس سیر',
        price: 245000,
        originalPrice: 290000,
        discountPercent: 15,
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
        rating: 4.9,
        inStock: true,
      },
      {
        id: 'p2',
        name: 'دوبل چیزبرگر کلاسیک با سیب‌زمینی',
        price: 280000,
        originalPrice: 320000,
        discountPercent: 12,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
        rating: 4.8,
        inStock: true,
      },
    ],
  },
  fashion: {
    logoUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop',
    primaryColor: '#D97706',
    secondaryColor: '#B45309',
    isDarkMode: true,
    stories: [
      {
        id: 'st_fsh_1',
        title: 'کالکشن جدید',
        badge: '۲۰۲۶',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&h=150&fit=crop',
        slides: [
          {
            id: 'sl_fs1',
            imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=900&fit=crop',
            title: 'استایل لوکس پاییزی با پارچه‌های کتان و پشم',
            caption: 'طراحی مینیمال و دوخت مزونی با برش‌های اختصاصی',
            duration: 5,
            buttonText: 'مشاهده کالکشن',
            buttonLink: '/category/autumn',
          },
        ],
      },
    ],
    banners: [
      {
        id: 'b1',
        title: 'کالکشن پاییزه با ارسال رایگان و تعویض سایز',
        subtitle: 'تا ۴۰٪ تخفیف روی تمامی اقلام مزونی و رسمی',
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&h=450&fit=crop',
        linkType: 'category',
        target: 'all',
      },
    ],
    categories: [
      { id: 'c1', name: 'مانتو و پالتو', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop' },
      { id: 'c2', name: 'کت و بلیزر', imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop' },
      { id: 'c3', name: 'کیف چرم طبیعی', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop' },
      { id: 'c4', name: 'کفش و اکسسوری', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop' },
    ],
    products: [
      {
        id: 'p1',
        name: 'پالتو فوتر پشمی آستردار مزونی',
        price: 1980000,
        originalPrice: 2400000,
        discountPercent: 17,
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
        rating: 4.9,
        inStock: true,
      },
      {
        id: 'p2',
        name: 'کت بلیزر اورسایز پاییزه ترک',
        price: 1450000,
        originalPrice: 1700000,
        discountPercent: 14,
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop',
        rating: 4.8,
        inStock: true,
      },
    ],
  },
  clinic: {
    logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop',
    primaryColor: '#0284C7',
    secondaryColor: '#0369A1',
    isDarkMode: false,
    stories: [
      {
        id: 'st_cl_1',
        title: 'نوبت‌دهی',
        badge: 'آنلاین',
        imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&h=150&fit=crop',
        slides: [
          {
            id: 'sl_c1',
            imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=900&fit=crop',
            title: 'ویزیت تخصصی و مشاوره پوست و مو',
            caption: 'تعیین وقت مشاوره با پزشکان متخصص و مجرب بدون معطلی',
            duration: 5,
            buttonText: 'رزرو نوبت پزشک',
            buttonLink: '/booking',
          },
        ],
      },
    ],
    banners: [
      {
        id: 'b1',
        title: 'کلینیک تخصصی پوست، مو و زیبایی',
        subtitle: 'ارائه پیشرفته‌ترین خدمات جوانسازی و محصولات مراقبتی اورجینال',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&h=450&fit=crop',
        linkType: 'page',
        target: 'services',
      },
    ],
    categories: [
      { id: 'c1', name: 'سرم و آبرسان', imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop' },
      { id: 'c2', name: 'ضدآفتاب مدیکال', imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop' },
      { id: 'c3', name: 'ترمیم‌کننده پوست', imageUrl: 'https://images.unsplash.com/photo-1608248597359-bb4792c73eb2?w=200&h=200&fit=crop' },
      { id: 'c4', name: 'محصولات ضدریزش', imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&h=200&fit=crop' },
    ],
    products: [
      {
        id: 'p1',
        name: 'سرم آبرسان هیالورونیک اسید بیودرما ۳۰ میل',
        price: 850000,
        originalPrice: 980000,
        discountPercent: 13,
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        rating: 4.9,
        inStock: true,
      },
      {
        id: 'p2',
        name: 'کرم ضدآفتاب فیوژن واتر رنگی SPF50',
        price: 920000,
        originalPrice: 1050000,
        discountPercent: 12,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        rating: 4.8,
        inStock: true,
      },
    ],
  },
};

// Fallback for custom or unlisted niche
const DEFAULT_NICHE: NicheTemplateData = NICHE_DATA.perfume;

export const aiGeneratorRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post('/api/projects/ai-generate', async (request, reply) => {
    const body = request.body as AiGenerateRequest;
    const businessName = body.businessName?.trim() || 'فروشگاه هوشمند من';
    const nicheKey = body.niche && NICHE_DATA[body.niche] ? body.niche : 'perfume';
    const nicheData = NICHE_DATA[nicheKey] || DEFAULT_NICHE;
    const style = body.style || 'clean_minimal';
    const features = body.features || ['loyalty_rewards', 'booking_form', 'story_circles'];
    const applyMode = body.applyMode || (body.targetProjectId ? 'update_current' : 'create_new');
    const targetProjectId = body.targetProjectId;

    // Resolve user from JWT or fallback to first user
    let targetUserId = body.userId;
    if (!targetUserId) {
      try {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const decoded = (await request.jwtVerify()) as { id: string };
          targetUserId = decoded.id;
        }
      } catch (_) {}
    }

    if (!targetUserId) {
      let defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            phone: '09121234567',
            name: 'کاربر سیستم',
            role: 'USER',
          },
        });
      }
      targetUserId = defaultUser.id;
    }

    // 1. Color Palette Generation
    let primaryColor = nicheData.primaryColor;
    let secondaryColor = nicheData.secondaryColor;
    let isDarkMode = nicheData.isDarkMode;

    if (style === 'modern_dark') {
      primaryColor = '#8B5CF6';
      secondaryColor = '#6D28D9';
      isDarkMode = true;
    } else if (style === 'luxury_gold') {
      primaryColor = '#D97706';
      secondaryColor = '#B45309';
      isDarkMode = true;
    } else if (style === 'vibrant_warm') {
      primaryColor = '#EA580C';
      secondaryColor = '#C2410C';
      isDarkMode = false;
    } else if (style === 'clean_minimal') {
      if (nicheKey === 'clinic') primaryColor = '#0284C7';
      else if (nicheKey === 'fashion') primaryColor = '#BE123C';
      else primaryColor = '#2563EB';
      isDarkMode = false;
    }

    // 2. Package Name Generator
    const cleanLatinName = businessName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '') || 'app';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const packageName = `ir.${cleanLatinName || 'store'}.app${randomSuffix}`;

    // 3. Build Standard Server-Driven UI Blocks
    const homeBlocks: any[] = [];

    // Block 1: Story Circles
    homeBlocks.push({
      id: 'block_ai_stories',
      type: 'story_circles',
      title: 'استوری‌های برگزیده',
      items: nicheData.stories,
    });

    // Block 2: Hero Banner Slider
    homeBlocks.push({
      id: 'block_ai_banner_slider',
      type: 'banner_slider',
      height: 190,
      autoPlay: true,
      items: nicheData.banners,
    });

    // Block 3: Categories
    homeBlocks.push({
      id: 'block_ai_categories',
      type: 'categories',
      title: 'دسته‌بندی‌های کالا',
      layout: 'grid',
      columns: 4,
      items: nicheData.categories,
    });

    // Block 4: Countdown Timer
    homeBlocks.push({
      id: 'block_ai_countdown',
      type: 'countdown_timer',
      title: `حراج شگفت‌انگیز ۲۴ ساعته ${businessName}`,
      subtitle: 'تخفیف‌های استثنایی با زمان بسیار محدود',
      discountTag: 'تا ۵۰٪ تخفیف',
      promoCode: 'AI_OFF',
      durationSeconds: 86400,
    });

    // Block 5: Product Carousel
    homeBlocks.push({
      id: 'block_ai_products',
      type: 'product_carousel',
      title: `محبوب‌ترین‌های ${businessName}`,
      items: nicheData.products,
    });

    // Block 6: Booking Reservation (if clinic or booking selected)
    if (features.includes('booking_form') || nicheKey === 'clinic') {
      homeBlocks.push({
        id: 'block_ai_booking',
        type: 'booking_reservation',
        title: `سامانه نوبت‌دهی آنلاین ${businessName}`,
        subtitle: 'تعیین وقت مشاوره و خدمات تخصصی در چند ثانیه',
        phone: '۰۲۱-۸۸۸۸۹۹۹۹',
        hours: 'شنبه تا پنج‌شنبه ۹ تا ۲۱',
        services: [
          { id: 's1', name: 'مشاوره آنلاین تخصصی', price: '۲۵۰,۰۰۰ تومان', duration: '۳۰ دقیقه' },
          { id: 's2', name: 'ویزیت و بررسی حضوری', price: '۴۵۰,۰۰۰ تومان', duration: '۴۵ دقیقه' },
        ],
      });
    }

    // Block 7: B2B Wholesale Inquiry (if marketplace or b2b selected)
    if (features.includes('marketplace')) {
      homeBlocks.push({
        id: 'block_ai_b2b',
        type: 'b2b_inquiry',
        title: 'استعلام قیمت عمده و پیش‌فاکتور B2B',
        subtitle: `صدور پیش‌فاکتور رسمی با کد اقتصادی برای همکاران ${businessName}`,
        phone: '۰۲۱-۸۸۷۷۶۶۵۵',
        email: 'b2b@company.ir',
        inquiryButtonText: 'درخواست پیش‌فاکتور رسمی',
        catalogButtonText: 'کاتالوگ PDF',
      });
    }

    // Block 8: Trust Badges
    homeBlocks.push({
      id: 'block_ai_trust',
      type: 'trust_badges',
      title: 'چرا خرید از ما؟',
      items: [
        { icon: 'shield', title: 'ضمانت اصالت ۱۰۰٪', desc: 'تضمین سلامت و کیفیت کالا' },
        { icon: 'shipping', title: 'ارسال اکسپرس', desc: 'تحویل سریع سراسر کشور' },
        { icon: 'return', title: '۷ روز مهلت تست', desc: 'بازگشت وجه بی قید و شرط' },
        { icon: 'payment', title: 'پرداخت امن بانکی', desc: 'درگاه رسمی شبکه شاپرک' },
      ],
    });

    // 4. Full SDUI Project Config
    const config = {
      appName: businessName,
      packageName,
      version: '1.0.0',
      theme: {
        primaryColor,
        secondaryColor,
        accentColor: primaryColor,
        cardBorderRadius: 14,
        cardStyle: 'bordered',
        isDarkMode,
      },
      metadata: {
        iconUrl: nicheData.logoUrl,
        splashUrl: nicheData.logoUrl,
      },
      navigation: {
        appBar: {
          searchPlaceholder: `جستجو در محصولات ${businessName}...`,
          searchBarStyle: 'capsule',
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: 'tab_home', label: 'خانه', icon: 'home', targetPage: 'home' },
            { id: 'tab_categories', label: 'دسته‌ها', icon: 'grid', targetPage: 'categories' },
            { id: 'tab_cart', label: 'سبد خرید', icon: 'cart', targetPage: 'cart' },
            { id: 'tab_profile', label: 'پروفایل', icon: 'user', targetPage: 'profile' },
          ],
        },
      },
      pageBlocks: {
        home: homeBlocks,
        categories: [],
        search: [],
        product: [],
        cart: [],
        profile: [],
      },
      blocks: homeBlocks,
    };

    // 5. Update Existing Project OR Create New Project
    let finalProject: any = null;

    if (applyMode === 'update_current' && targetProjectId) {
      const existing = await prisma.project.findUnique({
        where: { id: targetProjectId },
      });

      if (existing) {
        finalProject = await prisma.project.update({
          where: { id: targetProjectId },
          data: {
            name: businessName,
            configJson: JSON.stringify(config),
          },
        });
      }
    }

    if (!finalProject) {
      finalProject = await prisma.project.create({
        data: {
          userId: targetUserId,
          name: businessName,
          packageName,
          version: '1.0.0',
          configJson: JSON.stringify(config),
        },
      });

      await prisma.appUpdateConfig.create({
        data: {
          projectId: finalProject.id,
          latestVersion: '1.0.0',
          minVersion: '1.0.0',
          forceUpdate: false,
          changelog: `• رونمایی و انتشار نسخه ۱.۰.۰ اپلیکیشن رسمی ${businessName}`,
        },
      });
    }

    return reply.status(201).send({
      success: true,
      message: `🎉 اپلیکیشن اختصاصی «${businessName}» توسط هوش مصنوعی با موفقیت ساخته و اعمال شد!`,
      project: {
        id: finalProject.id,
        name: finalProject.name,
        packageName: finalProject.packageName,
        version: finalProject.version,
        config,
      },
    });
  });
};
