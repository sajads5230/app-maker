export interface StoreTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    borderRadius: number;
    cardStyle?: "bordered" | "elevated" | "flat";
  };
  sampleBlocksCount: number;
  config: Record<string, any>;
}

export const STORE_TEMPLATES: StoreTemplate[] = [
  {
    id: "tech_store",
    name: "تک‌مارکت (کالای دیجیتال و گجت)",
    category: "دیجیتال و فناوری",
    description: "قالب اختصاصی فروشگاه موبایل، لپ‌تاپ، لوازم جانبی و گجت‌های هوشمند با تب‌های مشخصات فنی و فیلتر قیمت.",
    icon: "💻",
    theme: {
      primaryColor: "#ef394e",
      secondaryColor: "#008eb9",
      backgroundColor: "#f8fafc",
      fontFamily: "Kalameh",
      borderRadius: 14,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-techmarket",
        name: "تک‌مارکت",
        version: "1.0.0",
        packageName: "ir.techmarket.app",
        iconUrl: "http://localhost:4000/uploads/app-icon-techmarket.png",
        splashUrl: "http://localhost:4000/uploads/app-icon-techmarket.png",
      },
      theme: {
        primaryColor: "#ef394e",
        secondaryColor: "#008eb9",
        cardBorderRadius: 14,
        cardStyle: "bordered",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در بین ۵۰,۰۰۰ کالا...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "خانه", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "دسته‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_1",
          type: "notice_box",
          variant: "info",
          message: "🚚 ارسال رایگان برای خریدهای بالای ۶۰۰ هزار تومان در سراسر کشور",
        },
        {
          id: "block_slider_1",
          type: "banner_slider",
          height: 160,
          items: [
            {
              id: "s1",
              imageUrl: "http://localhost:4000/uploads/banner-special-offers.png",
              title: "جشنواره فروش ویژه تک‌مارکت",
            },
            {
              id: "s2",
              imageUrl: "http://localhost:4000/uploads/banner-accessories.png",
              title: "تجهیزات هوشمند و جانبی موبایل",
            },
          ],
        },
        {
          id: "block_categories_1",
          type: "categories",
          title: "دسته‌بندی‌های محبوب دیجیتال",
          items: [
            { id: "c1", title: "موبایل", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop" },
            { id: "c2", title: "لپ‌تاپ", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop" },
            { id: "c3", title: "هدفون", imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&h=150&fit=crop" },
            { id: "c4", title: "ساعت هوشمند", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_special_offers",
          type: "product_carousel",
          title: "پیشنهاد شگفت‌انگیز",
          subtitle: "تخفیف‌های محدود با زمان باقی‌مانده",
          themeColor: "#ef394e",
          items: [
            {
              id: "p1",
              title: "هدفون بی‌سیم سونی WH-1000XM5",
              price: 18450000,
              regularPrice: 21500000,
              discount: 14,
              imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
            },
            {
              id: "p2",
              title: "اپل واچ سری ۹ آلومینیوم",
              price: 24900000,
              regularPrice: 27000000,
              discount: 8,
              imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
            },
            {
              id: "p3",
              title: "ماوس بی‌سیم لاجیتک Master 3S",
              price: 6200000,
              regularPrice: 7200000,
              discount: 14,
              imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_promo_1",
          type: "promo_banners",
          banners: [
            { id: "b1", imageUrl: "http://localhost:4000/uploads/promo-smartwatch.png", title: "اکسسوری هوشمند" },
            { id: "b2", imageUrl: "http://localhost:4000/uploads/promo-gaming.png", title: "تجهیزات گیمینگ" },
          ],
        },
        {
          id: "block_grid_1",
          type: "product_grid",
          title: "جدیدترین محصولات فروشگاه",
          items: [
            { id: "p4", title: "کیبورد مکانیکال ردراگون K552", price: 2850000, imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop" },
            { id: "p5", title: "پاوربانک ۲۰۰۰۰ میلی‌آمپر باسئوس", price: 3400000, imageUrl: "https://images.unsplash.com/photo-1609592807664-8461f0923f13?w=300&h=300&fit=crop" },
          ],
        },
        {
          id: "block_blog_1",
          type: "blog_list",
          title: "مجله فناوری و راهنمای خرید",
          items: [
            {
              id: "bl1",
              title: "راهنمای جامع خرید هدفون در سال ۲۰۲۶",
              excerpt: "بررسی بهترین گزینه‌های بازار ایران به همراه کیفیت صدا",
              date: "۱۴ آبان ۱۴۰۵",
              imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&h=150&fit=crop",
            },
          ],
        },
      ],
    },
  },
  {
    id: "fashion_boutique",
    name: "بوتیک مد و پوشاک لیمو",
    category: "مد، لباس و استایل",
    description: "طراحی مینیمال و لوکس برای برندهای لباس، کیف و کفش، و اکسسوری همراه با گالری ژورنال و سایزبندی کالا.",
    icon: "👗",
    theme: {
      primaryColor: "#8b5cf6",
      secondaryColor: "#ec4899",
      backgroundColor: "#faf5ff",
      fontFamily: "Kalameh",
      borderRadius: 18,
      cardStyle: "elevated",
    },
    sampleBlocksCount: 6,
    config: {
      metadata: {
        id: "app-demo-techmarket",
        name: "بوتیک مد و پوشاک لیمو",
        version: "1.0.0",
        packageName: "ir.limoo.fashion",
        iconUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#8b5cf6",
        secondaryColor: "#ec4899",
        cardBorderRadius: 18,
        cardStyle: "elevated",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان جدیدترین استایل‌های فصل...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "ویترین", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "ژورنال", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "حساب من", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_fashion",
          type: "notice_box",
          variant: "warning",
          message: "✨ تخفیف ویژه ۲۰٪ کالکشن پاییزی با کد تخفیف LIMOO2026",
        },
        {
          id: "block_slider_fashion",
          type: "banner_slider",
          height: 180,
          items: [
            {
              id: "fs1",
              imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=300&fit=crop",
              title: "کالکشن جدید پاییزه و زمستانه لیمو",
            },
            {
              id: "fs2",
              imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=300&fit=crop",
              title: "حراج پایان فصل اکسسوری و کیف‌های چرم",
            },
          ],
        },
        {
          id: "block_cats_fashion",
          type: "categories",
          title: "دسته‌بندی‌های مد و پوشاک",
          items: [
            { id: "fc1", title: "زنانه", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop" },
            { id: "fc2", title: "مردانه", imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&h=150&fit=crop" },
            { id: "fc3", title: "کیف و کفش", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=150&h=150&fit=crop" },
            { id: "fc4", title: "اکسسوری", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_special_fashion",
          type: "product_carousel",
          title: "پیشنهادهای شگفت‌انگیز لیمو",
          subtitle: "تخفیف‌های استثنایی و محدود این هفته",
          themeColor: "#8b5cf6",
          items: [
            {
              id: "fp1",
              title: "پالتو فوتر کلاسیک زنانه کژوال",
              price: 4200000,
              regularPrice: 5600000,
              discount: 25,
              imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop",
            },
            {
              id: "fp2",
              title: "کت بلیزر اسپرت مردانه ترک",
              price: 3800000,
              regularPrice: 4500000,
              discount: 15,
              imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop",
            },
            {
              id: "fp3",
              title: "کیف دوشی چرم طبیعی ایتالیایی",
              price: 2450000,
              regularPrice: 3100000,
              discount: 20,
              imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_grid_fashion",
          type: "product_grid",
          title: "جدیدترین ورودی‌های بوتیک",
          items: [
            {
              id: "fg1",
              title: "هودی اوورسایز کتان ضخیم",
              price: 1850000,
              imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=300&fit=crop",
            },
            {
              id: "fg2",
              title: "کفش اسنیکرز روزمره لیمو",
              price: 2900000,
              imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
            },
          ],
        },
        {
          id: "block_blog_fashion",
          type: "blog_list",
          title: "مجله استایل و راهنمای ست کردن",
          items: [
            {
              id: "fb1",
              title: "ترندهای رنگ لباس پاییز و زمستان ۲۰۲۶",
              excerpt: "چگونه رنگ‌های نود و گرم را با هم ست کنیم؟",
              date: "۲ آبان ۱۴۰۵",
              imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&h=150&fit=crop",
            },
          ],
        },
      ],
    },
  },
  {
    id: "fresh_supermarket",
    name: "سوپرمارکت آنلاین فِرِش",
    category: "مواد غذایی و تندمصرف (FMCG)",
    description: "قالب پرسرعت برای هایپرمارکت و میوه‌فروشی آنلاین با برچسب ارسال فوری زیر ۲ ساعت و تفکیک تخفیف روزانه.",
    icon: "🥦",
    theme: {
      primaryColor: "#10b981",
      secondaryColor: "#f59e0b",
      backgroundColor: "#f0fdf4",
      fontFamily: "Kalameh",
      borderRadius: 14,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 6,
    config: {
      metadata: {
        id: "app-demo-techmarket",
        name: "سوپرمارکت آنلاین فِرِش",
        version: "1.0.0",
        packageName: "ir.fresh.supermarket",
        iconUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#10b981",
        secondaryColor: "#f59e0b",
        cardBorderRadius: 14,
        cardStyle: "bordered",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در سوپرمارکت، میوه و پروتئینی...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "هایپر", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "راسته‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "زنبیل خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_fresh",
          type: "notice_box",
          variant: "success",
          message: "⚡ تحویل سریع زیر ۱ ساعت در سراسر منطقه برای تمام سفارش‌ها",
        },
        {
          id: "block_slider_fresh",
          type: "banner_slider",
          height: 160,
          items: [
            {
              id: "fs1",
              imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=300&fit=crop",
              title: "تخفیف‌های شگفت‌انگیز پروتئینی و لبنیات",
            },
            {
              id: "fs2",
              imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=300&fit=crop",
              title: "میوه و سبزیجات دست‌چین روز",
            },
          ],
        },
        {
          id: "block_cats_fresh",
          type: "categories",
          title: "راسته‌های پرطرفدار هایپر",
          items: [
            { id: "fc1", title: "لبنیات", imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=150&h=150&fit=crop" },
            { id: "fc2", title: "میوه و سبزی", imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=150&h=150&fit=crop" },
            { id: "fc3", title: "نوشیدنی", imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&h=150&fit=crop" },
            { id: "fc4", title: "تنقلات", imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_special_fresh",
          type: "product_carousel",
          title: "حراج‌های روزانه صبحگاهی",
          subtitle: "تا ۴۰٪ تخفیف روی اقلام اساسی سبد خانواده",
          themeColor: "#10b981",
          items: [
            {
              id: "fr1",
              title: "شیر کم‌چرب کاله ۱ لیتری",
              price: 38000,
              regularPrice: 48000,
              discount: 20,
              imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=200&h=200&fit=crop",
            },
            {
              id: "fr2",
              title: "قهوه اسپرسو بن مانو ۲۵۰ گرمی",
              price: 260000,
              regularPrice: 320000,
              discount: 18,
              imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_grid_fresh",
          type: "product_grid",
          title: "جدیدترین کالاهای هایپر",
          items: [
            {
              id: "fg1",
              title: "روغن زیتون فرابکر اکسیر ۱ لیتری",
              price: 490000,
              imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop",
            },
            {
              id: "fg2",
              title: "عسل طبیعی سبلان ۹۰۰ گرمی",
              price: 385000,
              imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },
  {
    id: "gourmet_restaurant",
    name: "رستوران و کافه گسترو",
    category: "رستوران، فست‌فود و کافی‌شاپ",
    description: "منوی دیجیتال جذاب همراه با تصاویر باکیفیت غذاها، تفکیک پیش‌غذا، غذای اصلی و نوشیدنی، و امکان رزرو میز.",
    icon: "🍔",
    theme: {
      primaryColor: "#f97316",
      secondaryColor: "#b45309",
      backgroundColor: "#fff7ed",
      fontFamily: "Kalameh",
      borderRadius: 16,
      cardStyle: "elevated",
    },
    sampleBlocksCount: 5,
    config: {
      metadata: {
        id: "app-demo-techmarket",
        name: "رستوران و کافه گسترو",
        version: "1.0.0",
        packageName: "ir.gourmet.cafe",
        iconUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#f97316",
        secondaryColor: "#b45309",
        cardBorderRadius: 16,
        cardStyle: "elevated",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در منوی رستوران و کافی‌شاپ...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "منو", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "بخش‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سفارش", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "باشگاه مشتریان", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_gastro",
          type: "notice_box",
          variant: "warning",
          message: "🔥 تخفیف ۱۵٪ سفارش‌های آنلاین شام بین ساعت ۲۰ الی ۲۳",
        },
        {
          id: "block_slider_gastro",
          type: "banner_slider",
          height: 180,
          items: [
            {
              id: "gs1",
              imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=300&fit=crop",
              title: "طعم اصیل برگر دست‌ساز با سس مخصوص گسترو",
            },
            {
              id: "gs2",
              imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=300&fit=crop",
              title: "پیتزاهای هیزمی با پنیر موزارلا تازه",
            },
          ],
        },
        {
          id: "block_cats_gastro",
          type: "categories",
          title: "منوی غذا و نوشیدنی",
          items: [
            { id: "gc1", title: "برگر", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop" },
            { id: "gc2", title: "پیتزا", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop" },
            { id: "gc3", title: "سالاد و پیش‌غذا", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=150&fit=crop" },
            { id: "gc4", title: "کافه و دسر", imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_special_gastro",
          type: "product_carousel",
          title: "پیشنهاد سرآشپز گسترو",
          subtitle: "محبوب‌ترین آیتم‌های هفته از دیدگاه مشتریان",
          themeColor: "#f97316",
          items: [
            {
              id: "gp1",
              title: "ماشروم برگر دوبل با سیب‌زمینی",
              price: 395000,
              regularPrice: 460000,
              discount: 14,
              imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
            },
            {
              id: "gp2",
              title: "پیتزا استیک و سیر هیزمی",
              price: 520000,
              regularPrice: 580000,
              discount: 10,
              imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_grid_gastro",
          type: "product_grid",
          title: "نوشیدنی‌های بار سرد و گرم",
          items: [
            {
              id: "gg1",
              title: "موهیتو دست‌ساز تازه کوبیده",
              price: 145000,
              imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop",
            },
            {
              id: "gg2",
              title: "چیزکیک سن سباستین با سس بلوبری",
              price: 195000,
              imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },
  {
    id: "learning_academy",
    name: "آکادمی آموزش آنلاین دانا",
    category: "آموزش، دوره و محتوا",
    description: "پلتفرم فروش دوره‌های ویدئویی، اشتراک آموزشی، پادکست‌های صوتی و مقالات آموزشی تخصصی.",
    icon: "🎓",
    theme: {
      primaryColor: "#2563eb",
      secondaryColor: "#0ea5e9",
      backgroundColor: "#f8fafc",
      fontFamily: "Kalameh",
      borderRadius: 14,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 5,
    config: {
      metadata: {
        id: "app-demo-techmarket",
        name: "آکادمی آموزش آنلاین دانا",
        version: "1.0.0",
        packageName: "ir.dana.academy",
        iconUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#2563eb",
        secondaryColor: "#0ea5e9",
        cardBorderRadius: 14,
        cardStyle: "bordered",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان صدها دوره و وبینار تخصصی...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "دوره‌ها", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "شاخه‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "کلاس‌های من", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل دانشجو", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_dana",
          type: "notice_box",
          variant: "info",
          message: "🎓 شروع جشنواره بورسیه مهارت‌آموزی دانا با تخفیف ۵۰٪ روی تمام دوره‌ها",
        },
        {
          id: "block_slider_dana",
          type: "banner_slider",
          height: 170,
          items: [
            {
              id: "ds1",
              imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=300&fit=crop",
              title: "مسیر یادگیری فول‌استک و ورود به بازار کار بین‌المللی",
            },
            {
              id: "ds2",
              imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=300&fit=crop",
              title: "دوره جامع طراحی محصول و رابط کاربری UI/UX در فیگما",
            },
          ],
        },
        {
          id: "block_cats_dana",
          type: "categories",
          title: "دپارتمان‌های آموزشی",
          items: [
            { id: "dc1", title: "برنامه‌نویسی", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop" },
            { id: "dc2", title: "طراحی UI/UX", imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=150&h=150&fit=crop" },
            { id: "dc3", title: "هوش مصنوعی", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&h=150&fit=crop" },
            { id: "dc4", title: "مارکتینگ", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_special_dana",
          type: "product_carousel",
          title: "دوره‌های ویژه و پرطرفدار",
          subtitle: "پرفروش‌ترین بوت‌کمپ‌ها با پشتیبانی منتور",
          themeColor: "#2563eb",
          items: [
            {
              id: "dp1",
              title: "بوت‌کمپ فلاتر پیشرفته ۲۰۲۶",
              price: 3200000,
              regularPrice: 4800000,
              discount: 33,
              imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop",
            },
            {
              id: "dp2",
              title: "آموزش هوش مصنوعی و مدل‌های زبانی LLM",
              price: 2900000,
              regularPrice: 3900000,
              discount: 25,
              imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_grid_dana",
          type: "product_grid",
          title: "وبینارهای رایگان این هفته",
          items: [
            {
              id: "dg1",
              title: "وبینار نقشه راه یادگیری امنیت سایبری",
              price: 0,
              imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&h=300&fit=crop",
            },
            {
              id: "dg2",
              title: "وبینار فریلنسری بین‌المللی با Upwork",
              price: 0,
              imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },
];
