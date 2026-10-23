export interface StoreTemplate {
  id: string;
  name: string;
  category: string;
  categoryGroup: "digital" | "fashion_beauty" | "food_retail" | "industry_b2b" | "lifestyle_culture";
  description: string;
  icon: string;
  tags: string[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    borderRadius: number;
    cardStyle: "bordered" | "elevated" | "flat";
  };
  sampleBlocksCount: number;
  config: Record<string, any>;
}

export const STORE_TEMPLATES: StoreTemplate[] = [
  // 1. DIGITAL & GADGETS
  {
    id: "tech_store",
    name: "تک‌مارکت (کالای دیجیتال و گجت)",
    category: "دیجیتال و فناوری",
    categoryGroup: "digital",
    description: "قالب استاندارد فروشگاه موبایل، لپ‌تاپ، لوازم جانبی و گجت‌های هوشمند با شمارشگر تخفیف و گارانتی اصالت.",
    icon: "💻",
    tags: ["تایمر شگفت‌انگیز", "لیست برندها", "مشخصات فنی", "ضمانت اصالت"],
    theme: {
      primaryColor: "#ef394e",
      secondaryColor: "#008eb9",
      backgroundColor: "#f8fafc",
      fontFamily: "Kalameh",
      borderRadius: 14,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 8,
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
          searchPlaceholder: "جستجو در میان ۵۰,۰۰۰ کالای دیجیتال...",
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
          id: "block_notice_tech",
          type: "notice_box",
          variant: "info",
          message: "🚚 ارسال سریع و رایگان با پیک اختصاصی برای خریدهای بالای ۶۰۰ هزار تومان",
        },
        {
          id: "block_slider_tech",
          type: "banner_slider",
          height: 160,
          items: [
            {
              id: "ts1",
              imageUrl: "http://localhost:4000/uploads/banner-special-offers.png",
              title: "جشنواره فروش ویژه پرچمداران تکنولوژی",
            },
            {
              id: "ts2",
              imageUrl: "http://localhost:4000/uploads/banner-accessories.png",
              title: "تجهیزات گیمینگ و هندزفری‌های بلوتوثی نویزکنسلینگ",
            },
          ],
        },
        {
          id: "block_cats_tech",
          type: "categories",
          title: "دسته‌بندی‌های محبوب دیجیتال",
          items: [
            { id: "tc1", title: "موبایل", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop" },
            { id: "tc2", title: "لپ‌تاپ", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop" },
            { id: "tc3", title: "هدفون و اسپیکر", imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&h=150&fit=crop" },
            { id: "tc4", title: "ساعت هوشمند", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_countdown_tech",
          type: "countdown_timer",
          title: "شگفت‌انگیز ۲۴ ساعته دیجیتال",
          subtitle: "تخفیف‌های استثنایی روی پرچمداران موبایل تا ساعت ۲۴ امشب",
          discountTag: "تا ۴۰٪ تخفیف",
          promoCode: "DIGI40",
        },
        {
          id: "block_carousel_tech",
          type: "product_carousel",
          title: "پیشنهادات شگفت‌انگیز",
          subtitle: "فرصت خرید به قیمت عمده با گارانتی ۱۸ ماهه",
          themeColor: "#ef394e",
          items: [
            {
              id: "tp1",
              title: "سامسونگ گلکسی S24 اولترا 5G حافظه ۵۱۲ گیگابایت",
              price: 68500000,
              regularPrice: 74900000,
              discount: 9,
              imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop",
            },
            {
              id: "tp2",
              title: "مک‌بوک ایر M3 اپل ۱۶ گیگابایت رم با شارژدهی ۲۰ ساعته",
              price: 79900000,
              regularPrice: 86500000,
              discount: 8,
              imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop",
            },
            {
              id: "tp3",
              title: "سونی ایرپاد بی‌سیم نویز کنسلینگ پرچمدار WF-1000XM5",
              price: 13900000,
              regularPrice: 16500000,
              discount: 16,
              imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_brands_tech",
          type: "brand_grid",
          title: "برندهای رسمی و شرکتی",
          items: [
            { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
            { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
            { name: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" },
            { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
          ],
        },
        {
          id: "block_badges_tech",
          type: "trust_badges",
          title: "مزایای خرید از تک‌مارکت",
          items: [
            { title: "ضمانت اصالت ۱۰۰٪ فیزیکی کالا", subtitle: "تضمین عودت وجه" },
            { title: "گارانتی رسمی ۱۸ ماهه معتبر", subtitle: "خدمات پس از فروش" },
            { title: "ارسال سریع و بیمه پستی", subtitle: "تحویل سالم در سراسر کشور" },
            { title: "۷ روز مهلت تست و مرجوعی", subtitle: "بدون قید و شرط" },
          ],
        },
        {
          id: "block_grid_tech",
          type: "product_grid",
          title: "گجت‌ها و اکسسوری‌های پرفروش",
          items: [
            {
              id: "tg1",
              title: "پاوربانک ۲۰,۰۰۰ میلی‌آمپر فست شارژ ۶۵ وات بیسوس",
              price: 2450000,
              imageUrl: "https://images.unsplash.com/photo-1609592424364-7754b2d5f8bf?w=300&h=300&fit=crop",
            },
            {
              id: "tg2",
              title: "هولدر مگنتی خودرو و شارژر وایرلس مگ‌سیف انکر",
              price: 1850000,
              imageUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 2. FASHION & BOUTIQUE
  {
    id: "fashion_boutique",
    name: "بوتیک شیک‌پوش (پوشاک، کیف و کفش)",
    category: "مد، فشن و پوشاک",
    categoryGroup: "fashion_beauty",
    description: "طراحی مینیمال و لوکس مخصوص بوتیک‌های مزونی، استایلینگ، ژورنال لباس، کیف، کفش و اکسسوری ترند.",
    icon: "👗",
    tags: ["استوری استایل", "کارت تخفیف", "کالکشن فصلی", "امکان پرو"],
    theme: {
      primaryColor: "#18181b",
      secondaryColor: "#be185d",
      backgroundColor: "#fafaf9",
      fontFamily: "Kalameh",
      borderRadius: 18,
      cardStyle: "elevated",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-boutique",
        name: "بوتیک شیک‌پوش",
        version: "1.0.0",
        packageName: "ir.shikpoush.boutique",
        iconUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#18181b",
        secondaryColor: "#be185d",
        cardBorderRadius: 18,
        cardStyle: "elevated",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در کالکشن جدید پاییزه و زمستانه...",
          searchBarStyle: "pill",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "ویترین", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "کالکشن‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "حساب من", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_stories_fashion",
          type: "story_circles",
          title: "استایل‌های روز و آنباکسینگ",
          items: [
            { id: "fst1", title: "استایل کژوال", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=120&fit=crop", unread: true },
            { id: "fst2", title: "کالکشن چرم", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=120&h=120&fit=crop", unread: true },
            { id: "fst3", title: "اکسسوری پاییز", imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=120&h=120&fit=crop", unread: false },
            { id: "fst4", title: "ست‌های اداری", imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=120&h=120&fit=crop", unread: false },
          ],
        },
        {
          id: "block_slider_fashion",
          type: "banner_slider",
          height: 180,
          items: [
            {
              id: "fs1",
              imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=300&fit=crop",
              title: "کالکشن جدید و منحصر‌به‌فرد مزونی ۲۰۲۶",
            },
            {
              id: "fs2",
              imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=300&fit=crop",
              title: "تخفیف ویژه آغاز فصل با کد BOUTIQUE20",
            },
          ],
        },
        {
          id: "block_coupon_fashion",
          type: "coupon_card",
          title: "کد تخفیف اختصاصی خرید اول شما",
          discount: "۱۵٪ تخفیف بدون محدودیت",
          desc: "برای سفارش اول روی تمامی کالکشن‌های مزونی شیک‌پوش",
          expiry: "اعتبار تا پایان این ماه",
          code: "SHIK15",
        },
        {
          id: "block_cats_fashion",
          type: "categories",
          title: "دسته‌بندی‌های مد و پوشاک",
          items: [
            { id: "fc1", title: "مانتو و پالتو", imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=150&h=150&fit=crop" },
            { id: "fc2", title: "شومیز و کت", imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=150&h=150&fit=crop" },
            { id: "fc3", title: "کیف چرم طبیعی", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=150&h=150&fit=crop" },
            { id: "fc4", title: "کفش و بوت", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_fashion",
          type: "product_carousel",
          title: "پرفروش‌ترین‌های این هفته",
          subtitle: "محبوب‌ترین آیتم‌ها از نگاه مخاطبان شیک‌پوش",
          themeColor: "#be185d",
          items: [
            {
              id: "fp1",
              title: "پالتو فوتر کتی دست‌دوز آستردار ترک",
              price: 3450000,
              regularPrice: 4200000,
              discount: 18,
              imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop",
            },
            {
              id: "fp2",
              title: "کیف دوشی مینیمال چرم طبیعی بز طوسی",
              price: 1890000,
              regularPrice: 2250000,
              discount: 16,
              imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_badges_fashion",
          type: "trust_badges",
          title: "تعهدات ما به شما",
          items: [
            { title: "ضمانت تعویض سایز تا ۴۸ ساعت" },
            { title: "ارسال با بسته‌بندی نفیس هدیه" },
            { title: "کیفیت تضمین‌شده پارچه‌های وارداتی" },
            { title: "امکان پرداخت در محل برای سفارش‌های تهران" },
          ],
        },
        {
          id: "block_grid_fashion",
          type: "product_grid",
          title: "جدیدترین مدل‌های ژورنالی",
          items: [
            {
              id: "fg1",
              title: "کت لینن مزونی با دکمه‌های چوبی دست‌ساز",
              price: 2150000,
              imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop",
            },
            {
              id: "fg2",
              title: "شلوار واید جین ترک زغالی سنگ‌شور",
              price: 1480000,
              imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 3. BEAUTY & COSMETICS
  {
    id: "beauty_cosmetics",
    name: "بیوتی‌لند (آرایشی و مراقبت پوست)",
    category: "آرایشی، بهداشتی و سلامت",
    categoryGroup: "fashion_beauty",
    description: "قالب جذاب و مدرن فروشگاه محصولات آرایشی، مراقبت پوست کره‌ای، عطر، ادکلن و روتین‌های روزانه زیبایی.",
    icon: "💄",
    tags: ["استوری روتین", "کارت تخفیف", "برندهای اصل", "راهنمای بلاگ"],
    theme: {
      primaryColor: "#ec4899",
      secondaryColor: "#8b5cf6",
      backgroundColor: "#fff1f2",
      fontFamily: "Kalameh",
      borderRadius: 20,
      cardStyle: "elevated",
    },
    sampleBlocksCount: 8,
    config: {
      metadata: {
        id: "app-demo-beautyland",
        name: "بیوتی‌لند",
        version: "1.0.0",
        packageName: "ir.beautyland.shop",
        iconUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#ec4899",
        secondaryColor: "#8b5cf6",
        cardBorderRadius: 20,
        cardStyle: "elevated",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان برندهای اورجینال مراقبت پوست...",
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
          id: "block_notice_beauty",
          type: "notice_box",
          variant: "discount",
          message: "🌸 جشنواره بهاره بیوتی‌لند: اشانتیون اختصاصی با هر خرید بالای ۵۰۰ هزار تومان!",
        },
        {
          id: "block_stories_beauty",
          type: "story_circles",
          title: "روتین‌های پوستی و آموزش‌ها",
          items: [
            { id: "bs1", title: "روتین ضد لک", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&h=120&fit=crop", unread: true },
            { id: "bs2", title: "ضدآفتاب فیوژن", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&h=120&fit=crop", unread: true },
            { id: "bs3", title: "مراقبت دور چشم", imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=120&h=120&fit=crop", unread: false },
            { id: "bs4", title: "عطرهای گرم", imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=120&h=120&fit=crop", unread: false },
          ],
        },
        {
          id: "block_slider_beauty",
          type: "banner_slider",
          height: 170,
          items: [
            {
              id: "bsl1",
              imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=300&fit=crop",
              title: "برندهای لوکس پوستی فرانسه و کره با ضمانت اصالت ۱۰۰٪",
            },
            {
              id: "bsl2",
              imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=300&fit=crop",
              title: "پک مراقبت از مو و کراتین احیاکننده بدون سولفات",
            },
          ],
        },
        {
          id: "block_cats_beauty",
          type: "categories",
          title: "دسته‌بندی‌های تخصصی زیبایی",
          items: [
            { id: "bc1", title: "مراقبت پوست", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop" },
            { id: "bc2", title: "لوازم آرایشی", imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=150&h=150&fit=crop" },
            { id: "bc3", title: "عطر و ادکلن", imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&h=150&fit=crop" },
            { id: "bc4", title: "مراقبت مو", imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_beauty",
          type: "product_carousel",
          title: "پرفروش‌ترین آبرسان‌ها و سرم‌ها",
          subtitle: "تضمین بارکد اصالت بچ‌کد کمپانی سازنده",
          themeColor: "#ec4899",
          items: [
            {
              id: "bp1",
              title: "سرم نیاسینامید ۱۰٪ + زینک ۱٪ اوردینری اصلی اصل کانادا",
              price: 890000,
              regularPrice: 1100000,
              discount: 19,
              imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop",
            },
            {
              id: "bp2",
              title: "ضدآفتاب فیوژن واتر بی‌رنگ ایزدین با جذب فوق‌العاده",
              price: 1350000,
              regularPrice: 1550000,
              discount: 13,
              imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_brands_beauty",
          type: "brand_grid",
          title: "برندهای پوستی محبوب جهان",
          items: [
            { name: "The Ordinary", logo: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop" },
            { name: "Clinique", logo: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=80&h=80&fit=crop" },
            { name: "La Roche-Posay", logo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&h=80&fit=crop" },
            { name: "Cerave", logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&h=80&fit=crop" },
          ],
        },
        {
          id: "block_coupon_beauty",
          type: "coupon_card",
          title: "کد تخفیف پکیج روتین شبانه",
          discount: "۱۰۰,۰۰۰ تومان تخفیف",
          desc: "برای سفارش‌های بالای ۸۰۰ هزار تومان از برند اوردینری و کلینیک",
          expiry: "اعتبار تا جمعه آینده",
          code: "GLOW100",
        },
        {
          id: "block_blog_beauty",
          type: "blog_list",
          title: "مجله زیبایی و مراقبت پوست",
          items: [
            {
              id: "bbl1",
              title: "تفاوت سرم هیالورونیک اسید با نیاسینامید چیست؟",
              date: "امروز",
              readTime: "۴ دقیقه مطالعه",
              imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=120&fit=crop",
            },
            {
              id: "bbl2",
              title: "۵ گام اصلی برای روتین پوست چرب و مستعد جوش",
              date: "۳ روز پیش",
              readTime: "۶ دقیقه مطالعه",
              imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=120&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 4. FRESH SUPERMARKET & HYPER
  {
    id: "fresh_supermarket",
    name: "هایپرمارکت یاران دریان (سوپرمارکت و کالای اساسی)",
    category: "سوپرمارکت و مواد غذایی",
    categoryGroup: "food_retail",
    description: "قالب ویژه فروشگاه‌های زنجیره‌ای مواد غذایی و سوپرمارکت آنلاین با تحویل فوری، شمارشگر حراج و تخفیف روزانه.",
    icon: "🛒",
    tags: ["تحویل فوری ۴۵ دقیقه", "تخفیف روزانه", "کالاهای اساسی", "تضمین تازگی"],
    theme: {
      primaryColor: "#16a34a",
      secondaryColor: "#f59e0b",
      backgroundColor: "#f0fdf4",
      fontFamily: "Kalameh",
      borderRadius: 12,
      cardStyle: "flat",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-freshmarket",
        name: "هایپرمارکت یاران دریان",
        version: "1.0.0",
        packageName: "ir.yarandaryan.hyper",
        iconUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#16a34a",
        secondaryColor: "#f59e0b",
        cardBorderRadius: 12,
        cardStyle: "flat",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان اقلام سوپرمارکتی و خواربار...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "هایپر", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "دسته‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "زنبیل خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_hyper",
          type: "notice_box",
          variant: "success",
          message: "⚡ تحویل سریع زیر ۴۵ دقیقه با پیک اختصاصی در منطقه شما",
        },
        {
          id: "block_slider_hyper",
          type: "banner_slider",
          height: 160,
          items: [
            {
              id: "hs1",
              imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=300&fit=crop",
              title: "جشنواره مواد پروتئینی و لبنیات تازه روز با تخفیف طلایی",
            },
            {
              id: "hs2",
              imageUrl: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=600&h=300&fit=crop",
              title: "خرید هفتگی خواربار و شوینده‌ها به قیمت عمده",
            },
          ],
        },
        {
          id: "block_countdown_hyper",
          type: "countdown_timer",
          title: "حراج شگفت‌انگیز امروز هایپر",
          subtitle: "تخفیف‌های استثنایی روی کالاهای اساسی و لبنیات روز",
          discountTag: "تا ۳۵٪ تخفیف",
          promoCode: "HYPER35",
        },
        {
          id: "block_cats_hyper",
          type: "categories",
          title: "دسته‌بندی‌های خواربار و هایپر",
          items: [
            { id: "hc1", title: "لبنیات و تخم‌مرغ", imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=150&h=150&fit=crop" },
            { id: "hc2", title: "نوشیدنی و دمنوش", imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&h=150&fit=crop" },
            { id: "hc3", title: "تنقلات و چیپس", imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=150&h=150&fit=crop" },
            { id: "hc4", title: "شوینده و بهداشتی", imageUrl: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_hyper",
          type: "product_carousel",
          title: "کالاهای اساسی و پرمصرف",
          subtitle: "تضمین تاریخ تولید امروز و ارسال خنک با یخدان",
          themeColor: "#16a34a",
          items: [
            {
              id: "hp1",
              title: "شیر پرچرب بطری یک لیتری سنتی کاله",
              price: 38000,
              regularPrice: 45000,
              discount: 15,
              imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=200&h=200&fit=crop",
            },
            {
              id: "hp2",
              title: "روغن سرخ‌کردنی شفاف بدون پالم ۱.۸ لیتری لادن",
              price: 135000,
              regularPrice: 155000,
              discount: 13,
              imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_badges_hyper",
          type: "trust_badges",
          title: "تعهدات هایپرمارکت یاران دریان",
          items: [
            { title: "ضمانت تازگی و انقضای بلندمدت" },
            { title: "ارسال محصولات خنک با باکس عایق" },
            { title: "امکان مرجوعی در زمان تحویل" },
            { title: "پرداخت آنلاین یا با کارتخوان در محل" },
          ],
        },
        {
          id: "block_grid_hyper",
          type: "product_grid",
          title: "تنقلات و نوشیدنی‌های پرطرفدار",
          items: [
            {
              id: "hg1",
              title: "چیپس کتل با طعم فلفل سیاه و پنیر دیپ",
              price: 45000,
              imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop",
            },
            {
              id: "hg2",
              title: "نوشابه گازدار زیرو بدون قند خانواده ۱.۵ لیتری",
              price: 32000,
              imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 5. RESTAURANT, CAFE & GASTRO
  {
    id: "gourmet_restaurant",
    name: "کافه رستوران نارنج (سفارش آنلاین و رزرو)",
    category: "رستوران، فست‌فود و کافه",
    categoryGroup: "food_retail",
    description: "قالب ویژه سفارش آنلاین غذا، منوی بار کافه، پیشنهاد سرآشپز با قابلیت رزرو آنلاین میز و جشن تولد.",
    icon: "🍔",
    tags: ["رزرو آنلاین میز", "پیشنهاد سرآشپز", "منوی کافه", "بسته‌بندی گرم"],
    theme: {
      primaryColor: "#ea580c",
      secondaryColor: "#7c2d12",
      backgroundColor: "#fff7ed",
      fontFamily: "Kalameh",
      borderRadius: 16,
      cardStyle: "elevated",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-narenj",
        name: "کافه رستوران نارنج",
        version: "1.0.0",
        packageName: "ir.narenj.restaurant",
        iconUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#ea580c",
        secondaryColor: "#7c2d12",
        cardBorderRadius: 16,
        cardStyle: "elevated",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان پیتزاها، برگرها و نوشیدنی‌ها...",
          searchBarStyle: "pill",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "منو", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "شاخه‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سفارش من", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_resto",
          type: "notice_box",
          variant: "warning",
          message: "🔥 ارسال گرم با باکس‌های حرارتی ویژه رستوران؛ تحویل زیر ۳۵ دقیقه!",
        },
        {
          id: "block_booking_resto",
          type: "booking_reservation",
          title: "رزرو آنلاین میز، تراس و سالن VIP",
          subtitle: "رزرو آسان برای دورهمی‌های دوستانه، جلسات کاری و جشن‌های تولد",
        },
        {
          id: "block_slider_resto",
          type: "banner_slider",
          height: 170,
          items: [
            {
              id: "rs1",
              imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=300&fit=crop",
              title: "منوی عصرانه و قهوه‌های تخصصی باریستای نارنج",
            },
            {
              id: "rs2",
              imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=300&fit=crop",
              title: "برگرهای هیزمی دست‌ساز با سیب‌زمینی ترافل مخصوص",
            },
          ],
        },
        {
          id: "block_cats_resto",
          type: "categories",
          title: "منوی آنلاین نارنج",
          items: [
            { id: "rc1", title: "برگر دست‌ساز", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop" },
            { id: "rc2", title: "پیتزا ناپولیتن", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop" },
            { id: "rc3", title: "سالاد و پاستا", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=150&fit=crop" },
            { id: "rc4", title: "بار سرد و گرم", imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_resto",
          type: "product_carousel",
          title: "پیشنهاد سرآشپز نارنج",
          subtitle: "محبوب‌ترین آیتم‌های هفته از نگاه مشتریان حضوری و آنلاین",
          themeColor: "#ea580c",
          items: [
            {
              id: "rp1",
              title: "دوبل بیکن ماشروم برگر با پنیر چدار آب‌شده",
              price: 395000,
              regularPrice: 460000,
              discount: 14,
              imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
            },
            {
              id: "rp2",
              title: "پیتزا سیر و استیک هیزمی ایتالیایی",
              price: 520000,
              regularPrice: 580000,
              discount: 10,
              imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_grid_resto",
          type: "product_grid",
          title: "نوشیدنی‌های دست‌ساز بار",
          items: [
            {
              id: "rg1",
              title: "موهیتو کوبیده تازه با نعناع ارگانیک",
              price: 145000,
              imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop",
            },
            {
              id: "rg2",
              title: "چیزکیک سن سباستین با سس بلوبری تازه",
              price: 195000,
              imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=300&fit=crop",
            },
          ],
        },
        {
          id: "block_faq_resto",
          type: "faq_accordion",
          title: "سؤالات متداول سفارش و رزرو",
          items: [
            { q: "ساعات سرویس‌دهی رستوران نارنج به چه صورت است؟", a: "هر روز از ساعت ۱۱:۳۰ ظهر تا ۲۳:۴۵ شب به صورت یکسره آماده پذیرایی از شما هستیم." },
            { q: "آیا رزرو سالن برای تولد شامل هزینه ورودی می‌شود؟", a: "خیر، با هماهنگی قبلی و سفارش کیک و شام، هیچ هزینه ورودی جداگانه‌ای دریافت نمی‌شود." },
          ],
        },
      ],
    },
  },

  // 6. GOLD & LUXURY JEWELRY
  {
    id: "gold_jewelry",
    name: "زرین گالری (طلا، سکه و جواهرات لوکس)",
    category: "طلا، جواهر و اکسسوری",
    categoryGroup: "fashion_beauty",
    description: "قالب اشرافی و شیک زرگری با محاسبه زنده نرخ طلا، عیار ۱۸، فاکتور رسمی اتحادیه و بیمه مرسوله.",
    icon: "💍",
    tags: ["نرخ زنده اتحادیه", "فاکتور رسمی", "طلای ۱۸ عیار", "بیمه مرسوله"],
    theme: {
      primaryColor: "#d97706",
      secondaryColor: "#0f172a",
      backgroundColor: "#fffbeb",
      fontFamily: "Kalameh",
      borderRadius: 10,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-zaringallery",
        name: "زرین گالری",
        version: "1.0.0",
        packageName: "ir.zaringallery.gold",
        iconUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#d97706",
        secondaryColor: "#0f172a",
        cardBorderRadius: 10,
        cardStyle: "bordered",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان دستبند، النگو و سرویس‌های طلا...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "گالری", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "ویترین", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_gold",
          type: "notice_box",
          variant: "warning",
          message: "⚖️ قیمت‌ها طبق آخرین نرخ اتحادیه طلای تهران محاسبه شده و بدون مالیات بر ارزش افزوده اصل طلا می‌باشد.",
        },
        {
          id: "block_slider_gold",
          type: "banner_slider",
          height: 170,
          items: [
            {
              id: "gs1",
              imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=300&fit=crop",
              title: "کالکشن دست‌ساز زرین با کمترین اجرت ساخت بازار",
            },
            {
              id: "gs2",
              imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=300&fit=crop",
              title: "سکه و شمش‌های کادویی بانکی با هولوگرام معتبر",
            },
          ],
        },
        {
          id: "block_cats_gold",
          type: "categories",
          title: "ویترین دسته‌بندی طلا و جواهر",
          items: [
            { id: "gc1", title: "دستبند طلا", imageUrl: "https://images.unsplash.com/photo-1611591475879-183050117849?w=150&h=150&fit=crop" },
            { id: "gc2", title: "انگشتر و حلقه", imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&h=150&fit=crop" },
            { id: "gc3", title: "گردنبند و مدال", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&h=150&fit=crop" },
            { id: "gc4", title: "گوشواره لوکس", imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_gold",
          type: "product_carousel",
          title: "پرفروش‌ترین زیورآلات ۱۸ عیار",
          subtitle: "ارائه فاکتور رسمی اتحادیه همراه با مهر برجسته گالری",
          themeColor: "#d97706",
          items: [
            {
              id: "gp1",
              title: "دستبند چرم با پلاک طلای ۱۸ عیار طرح مینیمال (وزن ۲.۱۵ گرم)",
              price: 14850000,
              regularPrice: 16200000,
              discount: 8,
              imageUrl: "https://images.unsplash.com/photo-1611591475879-183050117849?w=200&h=200&fit=crop",
            },
            {
              id: "gp2",
              title: "انگشتر ون‌کلیف طلای زرد با سنگ اونیکس سیاه (وزن ۳.۴ گرم)",
              price: 22400000,
              regularPrice: 24500000,
              discount: 9,
              imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_badges_gold",
          type: "trust_badges",
          title: "ضمانت‌نامه‌های رسمی زرین گالری",
          items: [
            { title: "صدور فاکتور رسمی معتبر اتحادیه طلا" },
            { title: "ارسال با پست ویژه هوایی و بیمه ارزش واقعی" },
            { title: "تضمین عیار ۷۵۰ (۱۸ عیار استاندارد)" },
            { title: "امکان تعویض و بازخرید به قیمت روز طلا" },
          ],
        },
        {
          id: "block_coupon_gold",
          type: "coupon_card",
          title: "تخفیف ویژه کارمزد ساخت به مناسبت اعیاد",
          discount: "۵۰٪ تخفیف روی اجرت",
          desc: "برای سفارش‌های بالای ۳۰ میلیون تومان از کالکشن کادویی",
          expiry: "مهلت محدود تا پایان هفته",
          code: "GOLD50",
        },
        {
          id: "block_grid_gold",
          type: "product_grid",
          title: "پلاک‌ها و کادوهای اقتصادی طلا",
          items: [
            {
              id: "gg1",
              title: "پلاک طلا طرح بی‌نهایت مناسب هدیه (وزن ۰.۸۵ گرم)",
              price: 5850000,
              imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop",
            },
            {
              id: "gg2",
              title: "گوشواره میخی طرح پروانه ۱۸ عیار (وزن ۱.۲ گرم)",
              price: 8300000,
              imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 7. HOME, FURNITURE & DECOR
  {
    id: "home_furniture",
    name: "خانه مدرن (مبلمان و لوازم خانگی)",
    category: "لوازم خانگی و دکوراسیون",
    categoryGroup: "lifestyle_culture",
    description: "قالب ویژه فروشگاه‌های مبل، دکوراسیون داخلی، روشنایی، لوازم خانگی و اکسسوری منزل با شرایط اقساطی.",
    icon: "🛋️",
    tags: ["فروش اقساطی", "ضمانت کلاف و پارچه", "مشاوره چیدمان", "حمل تخصصی"],
    theme: {
      primaryColor: "#0284c7",
      secondaryColor: "#334155",
      backgroundColor: "#f8fafc",
      fontFamily: "Kalameh",
      borderRadius: 14,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-modernhome",
        name: "خانه مدرن",
        version: "1.0.0",
        packageName: "ir.modernhome.furniture",
        iconUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#0284c7",
        secondaryColor: "#334155",
        cardBorderRadius: 14,
        cardStyle: "bordered",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان مبلمان، سرویس خواب و لوسترها...",
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
          id: "block_notice_home",
          type: "notice_box",
          variant: "info",
          message: "💳 طرح فروش اقساطی تا ۱۲ ماه با چک صیادی و بدون ضامن با اسنپ‌پی و دیجی‌پی",
        },
        {
          id: "block_slider_home",
          type: "banner_slider",
          height: 180,
          items: [
            {
              id: "hom1",
              imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=300&fit=crop",
              title: "کالکشن جدید مبلمان راحتی مینیمال با پارچه‌های ضدلک نانو",
            },
            {
              id: "hom2",
              imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=300&fit=crop",
              title: "طراحی مدرن اتاق خواب و میز تلویزیون با چوب راش گرجستان",
            },
          ],
        },
        {
          id: "block_cats_home",
          type: "categories",
          title: "دسته‌بندی‌های دکوراسیون و منزل",
          items: [
            { id: "hcat1", title: "مبل راحتی و ال", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop" },
            { id: "hcat2", title: "میز و صندلی", imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=150&h=150&fit=crop" },
            { id: "hcat3", title: "سرویس خواب", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=150&h=150&fit=crop" },
            { id: "hcat4", title: "آباژور و لوستر", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_home",
          type: "product_carousel",
          title: "پرفروش‌ترین ست‌های مبلمان",
          subtitle: "۳۶ ماه ضمانت کتبی کلاف چوبی و اسفنج ۳۵ کیلویی ویژه",
          themeColor: "#0284c7",
          items: [
            {
              id: "hp1",
              title: "ست ۸ نفره مبلمان راحتی مدل چسترفیلد مدرن ترک",
              price: 48500000,
              regularPrice: 56000000,
              discount: 13,
              imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
            },
            {
              id: "hp2",
              title: "میز ناهارخوری ۶ نفره روستیک چوب گردو طبیعی",
              price: 24800000,
              regularPrice: 28900000,
              discount: 14,
              imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_badges_home",
          type: "trust_badges",
          title: "خدمات ویژه خانه مدرن",
          items: [
            { title: "۳ سال ضمانت کتبی کلاف و اسفنج" },
            { title: "ارسال تخصصی با خودروهای پتوپیچ" },
            { title: "مشاوره رایگان انتخاب رنگ و چیدمان" },
            { title: "امکان انتخاب بیش از ۱۰۰ مدل کالیته پارچه" },
          ],
        },
        {
          id: "block_grid_home",
          type: "product_grid",
          title: "اکسسوری و روشنایی دکوراتیو",
          items: [
            {
              id: "hgr1",
              title: "آباژور ایستاده مدرن پایه چوبی با شید کنفی",
              price: 1850000,
              imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
            },
            {
              id: "hgr2",
              title: "ساعت دیواری مینیمال فلزی کورتن قطر ۸۰ سانتیمتر",
              price: 1450000,
              imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300&h=300&fit=crop",
            },
          ],
        },
        {
          id: "block_faq_home",
          type: "faq_accordion",
          title: "شرایط سفارش و ارسال مبل",
          items: [
            { q: "مدت زمان ساخت و تحویل مبلمان سفارشی چقدر است؟", a: "از زمان ثبت سفارش و انتخاب کالیته پارچه، بین ۱۰ الی ۱۴ روز کاری آماده و ارسال می‌گردد." },
            { q: "آیا حمل تا داخل طبقات آپارتمان انجام می‌شود؟", a: "بله، تیم حمل تخصصی ما همراه با بالابر و پتوپیچی کامل اثاثیه را در طبقه مورد نظر تحویل می‌دهند." },
          ],
        },
      ],
    },
  },

  // 8. ONLINE PHARMACY & SUPPLEMENTS
  {
    id: "pharmacy_health",
    name: "فارما‌پلاس (داروخانه آنلاین و مکمل)",
    category: "دارو، سلامت و مکمل",
    categoryGroup: "food_retail",
    description: "قالب استاندارد داروخانه‌ای و مکمل‌های بدنسازی با تاییدیه سازمان غذا و دارو و اصالت بارکد TTAC.",
    icon: "💊",
    tags: ["تاییدیه غذا و دارو", "مکمل ورزشی اصل", "بارکد TTAC", "مشاوره داروساز"],
    theme: {
      primaryColor: "#0d9488",
      secondaryColor: "#2563eb",
      backgroundColor: "#f0fdfa",
      fontFamily: "Kalameh",
      borderRadius: 12,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-pharmaplus",
        name: "فارما‌پلاس",
        version: "1.0.0",
        packageName: "ir.pharmaplus.health",
        iconUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#0d9488",
        secondaryColor: "#2563eb",
        cardBorderRadius: 12,
        cardStyle: "bordered",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان مکمل‌های ورزشی، ویتامین‌ها و اقلام بهداشتی...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "داروخانه", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "دسته‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد دارو", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_pharma",
          type: "notice_box",
          variant: "success",
          message: "🩺 تمام مکمل‌ها دارای لیبل اصالت وزارت بهداشت (TTAC) و تاریخ انقضای معتبر هستند.",
        },
        {
          id: "block_slider_pharma",
          type: "banner_slider",
          height: 165,
          items: [
            {
              id: "phs1",
              imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=300&fit=crop",
              title: "پروتئین وی و کراتین‌های اورجینال دارای برچسب اصالت کالا",
            },
            {
              id: "phs2",
              imageUrl: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=300&fit=crop",
              title: "مولتی‌ویتامین‌های تقویت سیستم ایمنی و مفاصل ویژه بانوان و آقایان",
            },
          ],
        },
        {
          id: "block_cats_pharma",
          type: "categories",
          title: "دسته‌بندی‌های سلامت و مکمل",
          items: [
            { id: "phc1", title: "مکمل ورزشی", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&h=150&fit=crop" },
            { id: "phc2", title: "ویتامین و املاح", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop" },
            { id: "phc3", title: "مادر و کودک", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=150&h=150&fit=crop" },
            { id: "phc4", title: "تجهیزات پزشکی", imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_pharma",
          type: "product_carousel",
          title: "مکمل‌های برتر و پرفروش ورزشی",
          subtitle: "پرفروش‌ترین برندهای دارای مجوز سازمان غذا و دارو",
          themeColor: "#0d9488",
          items: [
            {
              id: "php1",
              title: "پروتئین وی ۱۰۰٪ گلد استاندارد اپتیموم نوتریشن ۲.۲۷ کیلوگرم",
              price: 4950000,
              regularPrice: 5600000,
              discount: 12,
              imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
            },
            {
              id: "php2",
              title: "کراتین میکرونایزد ۳۰۰ گرمی بدون طعم پی ان سی با جذب بالا",
              price: 890000,
              regularPrice: 1050000,
              discount: 15,
              imageUrl: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_badges_pharma",
          type: "trust_badges",
          title: "تعهدات فارما‌پلاس",
          items: [
            { title: "دارای مجوز رسمی از معاونت غذا و دارو" },
            { title: "تضمین اصالت بارکد TTAC سامانه سلامت" },
            { title: "نگهداری دارو در انبار با دمای کنترل‌شده" },
            { title: "مشاوره آنلاین با دکتر داروساز" },
          ],
        },
        {
          id: "block_grid_pharma",
          type: "product_grid",
          title: "تجهیزات پزشکی و پایش سلامت خانگی",
          items: [
            {
              id: "phg1",
              title: "دستگاه فشارخون دیجیتالی بازویی سخنگو امرن ژاپن",
              price: 3450000,
              imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=300&h=300&fit=crop",
            },
            {
              id: "phg2",
              title: "دستگاه تست قند خون بیورر همراه با ۵۰ عدد نوار تست",
              price: 1150000,
              imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
            },
          ],
        },
        {
          id: "block_blog_pharma",
          type: "blog_list",
          title: "مقالات تخصصی پزشک داروخانه",
          items: [
            {
              id: "phb1",
              title: "راهنمای کامل مصرف کراتین و دوره بارگیری برای ورزشکاران",
              date: "دیروز",
              readTime: "۵ دقیقه",
              imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&h=120&fit=crop",
            },
            {
              id: "phb2",
              title: "بهترین زمان مصرف مکمل ویتامین D و زینک برای تقویت ایمنی",
              date: "۴ روز پیش",
              readTime: "۳ دقیقه",
              imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=120&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 9. INDUSTRIAL TOOLS & HARDWARE (B2B)
  {
    id: "industrial_tools",
    name: "صنعت‌ابزار (تجهیزات صنعتی و کارگاهی)",
    category: "ابزارآلات و تجهیزات صنعتی",
    categoryGroup: "industry_b2b",
    description: "قالب ویژه ابزارآلات برقی، شارژی، جوشکاری، یراق و تجهیزات کارخانه‌ای با سیستم استعلام پیش‌فاکتور رسمی B2B.",
    icon: "🔧",
    tags: ["پیش‌فاکتور رسمی B2B", "کاتالوگ فنی", "گارانتی قطعات", "تخفیف عمده"],
    theme: {
      primaryColor: "#f59e0b",
      secondaryColor: "#18181b",
      backgroundColor: "#fafaf9",
      fontFamily: "Kalameh",
      borderRadius: 8,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 8,
    config: {
      metadata: {
        id: "app-demo-sanatabzar",
        name: "صنعت‌ابزار",
        version: "1.0.0",
        packageName: "ir.sanatabzar.tools",
        iconUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#f59e0b",
        secondaryColor: "#18181b",
        cardBorderRadius: 8,
        cardStyle: "bordered",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان دریل، اینورتر، فرز و ابزارآلات صنعتی...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "فروشگاه", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "دسته‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_tools",
          type: "notice_box",
          variant: "warning",
          message: "🏭 صدور پیش‌فاکتور رسمی شرکتی با گواهی ارزش افزوده و ارسال باربری به سراسر کشور",
        },
        {
          id: "block_b2b_tools",
          type: "b2b_inquiry",
          title: "استعلام سفارش عمده و خرید سازمانی B2B",
          subtitle: "ارائه لیست اقلام پروژه به کارشناسان فنی جهت دریافت کمترین قیمت بازار و کاتالوگ PDF",
        },
        {
          id: "block_slider_tools",
          type: "banner_slider",
          height: 170,
          items: [
            {
              id: "tsl1",
              imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=300&fit=crop",
              title: "ابزارآلات برقی و شارژی رونیکس، ماکیتا و بوش با گارانتی طلایی",
            },
            {
              id: "tsl2",
              imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=300&fit=crop",
              title: "تجهیزات ایمنی کارگاهی، کفش ایمنی و کلاه‌های استاندارد صنعتی",
            },
          ],
        },
        {
          id: "block_cats_tools",
          type: "categories",
          title: "دسته‌بندی‌های تجهیزات صنعتی",
          items: [
            { id: "tc1", title: "دریل و بتن‌کن", imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=150&h=150&fit=crop" },
            { id: "tc2", title: "اینورتر جوشکاری", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&h=150&fit=crop" },
            { id: "tc3", title: "مینی‌فرز و سنگ‌فرز", imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=150&h=150&fit=crop" },
            { id: "tc4", title: "ابزار دستی و جعبه‌بکس", imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_brands_tools",
          type: "brand_grid",
          title: "برندهای مطرح ابزار ایران و جهان",
          items: [
            { name: "Ronix", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" },
            { name: "Bosch", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
            { name: "Makita", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
            { name: "Tosan", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
          ],
        },
        {
          id: "block_carousel_tools",
          type: "product_carousel",
          title: "پرفروش‌ترین ابزارآلات برقی",
          subtitle: "تضمین اصالت فیزیکی و قطعات یدکی با گارانتی تعویض شرکتی",
          themeColor: "#f59e0b",
          items: [
            {
              id: "tp1",
              title: "بتن‌کن ۳ کاره ۸۰۰ وات رونیکس مدل ۲۷۰۱ با کیف BMC و مته",
              price: 4890000,
              regularPrice: 5600000,
              discount: 13,
              imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop",
            },
            {
              id: "tp2",
              title: "اینورتر جوشکاری ۲۰۰ آمپر توربو صبا الکتریک نسل جدید IGBT",
              price: 7650000,
              regularPrice: 8400000,
              discount: 9,
              imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_badges_tools",
          type: "trust_badges",
          title: "مزایای خرید از صنعت‌ابزار",
          items: [
            { title: "صدور فاکتور رسمی ارزش افزوده مورد تایید دارایی" },
            { title: "تضمین تامین قطعات یدکی تا ۵ سال پس از خرید" },
            { title: "ارسال سریع با باربری و تحویل در محل کارگاه" },
            { title: "مشاوره فنی رایگان توسط مهندسین مکانیک و ابزار" },
          ],
        },
        {
          id: "block_grid_tools",
          type: "product_grid",
          title: "ابزارآلات دقیق اندازه‌گیری و تراز",
          items: [
            {
              id: "tg1",
              title: "تراز لیزری ۳۶۰ درجه ۳ بعدی نور سبز رونیکس همراه با پایه",
              price: 5200000,
              imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop",
            },
            {
              id: "tg2",
              title: "متر لیزری ۸۰ متری شارژی دوربین‌دار بوش با دقت میلی‌متری",
              price: 6800000,
              imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 10. ONLINE ACADEMY & LMS
  {
    id: "learning_academy",
    name: "آکادمی آموزش آنلاین دانا (دوره‌ها و تخصص)",
    category: "آموزش، دوره و محتوا",
    categoryGroup: "industry_b2b",
    description: "پلتفرم فروش دوره‌های ویدئویی، سیلابس سرفصل‌های آموزشی، ویدئوهای پیش‌نمایش و پشتیبانی منتورینگ.",
    icon: "🎓",
    tags: ["سرفصل دوره‌ها", "پیش‌نمایش ویدیو", "گواهینامه معتبر", "پشتیبانی منتور"],
    theme: {
      primaryColor: "#6366f1",
      secondaryColor: "#a855f7",
      backgroundColor: "#f5f3ff",
      fontFamily: "Kalameh",
      borderRadius: 16,
      cardStyle: "elevated",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-danaacademy",
        name: "آکادمی آموزش دانا",
        version: "1.0.0",
        packageName: "ir.dana.academy",
        iconUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#6366f1",
        secondaryColor: "#a855f7",
        cardBorderRadius: 16,
        cardStyle: "elevated",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان صدها دوره و بوت‌کمپ تخصصی...",
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
          id: "block_curriculum_dana",
          type: "course_curriculum",
          title: "سیلابس و سرفصل‌های بوت‌کمپ توسعه نرم‌افزار ۲۰۲۶",
          subtitle: "مشاهده جلسات، مدت زمان هر بخش، تمرین‌های هفتگی و ویدئوی رایگان معارفه دوره",
        },
        {
          id: "block_slider_dana",
          type: "banner_slider",
          height: 170,
          items: [
            {
              id: "ds1",
              imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=300&fit=crop",
              title: "مسیر یادگیری فول‌استک و ورود تضمینی به بازار کار بین‌المللی",
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
          title: "دپارتمان‌های آموزشی دانا",
          items: [
            { id: "dc1", title: "برنامه‌نویسی", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop" },
            { id: "dc2", title: "طراحی UI/UX", imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=150&h=150&fit=crop" },
            { id: "dc3", title: "هوش مصنوعی", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&h=150&fit=crop" },
            { id: "dc4", title: "دیجیتال مارکتینگ", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_dana",
          type: "product_carousel",
          title: "دوره‌های ویژه با پشتیبانی منتور",
          subtitle: "پرفروش‌ترین بوت‌کمپ‌ها با مدرک معتبر قابل ترجمه رسمی",
          themeColor: "#6366f1",
          items: [
            {
              id: "dp1",
              title: "بوت‌کمپ فلاتر پیشرفته و انتشار اپلیکیشن در مارکت‌ها",
              price: 3200000,
              regularPrice: 4800000,
              discount: 33,
              imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop",
            },
            {
              id: "dp2",
              title: "آموزش هوش مصنوعی کاربردی و ساخت ایجنت با پایتون",
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
          title: "وبینارهای تخصصی این هفته",
          items: [
            {
              id: "dg1",
              title: "وبینار رایگان نقشه راه مهاجرت کاری مهندسین نرم‌افزار",
              price: 0,
              imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&h=300&fit=crop",
            },
            {
              id: "dg2",
              title: "وبینار فریلنسری دلاری و ارزی در سایت‌های بین‌المللی",
              price: 0,
              imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop",
            },
          ],
        },
        {
          id: "block_faq_dana",
          type: "faq_accordion",
          title: "پرسش‌های متداول دانشجویان",
          items: [
            { q: "آیا در پایان دوره‌ها گواهینامه اعطا می‌شود؟", a: "بله، پس از ارسال موفق پروژه نهایی دوره، گواهینامه رسمی دوزبانه با کد رهگیری آنلاین صادر می‌شود." },
            { q: "دسترسی به ویدیوهای دوره تا چه زمانی فعال است؟", a: "دسترسی به تمام دوره‌ها به صورت نامحدود و همیشگی همراه با تمامی آپدیت‌های آینده در حساب شما باقی می‌ماند." },
          ],
        },
      ],
    },
  },

  // 11. AUTO PARTS & CAR ACCESSORIES
  {
    id: "auto_parts",
    name: "یدک‌پارت (لوازم یدکی خودرو و تیونینگ)",
    category: "خودرو، لوازم یدکی و موتورسیکلت",
    categoryGroup: "industry_b2b",
    description: "قالب تخصصی فروشگاه قطعات خودرو، لنت، تسمه، روغن، باتری و لوازم اسپرت با بررسی شماره شاسی VIN.",
    icon: "🚗",
    tags: ["استعلام شماره شاسی VIN", "تضمین اصالت قطعه", "ایساکو و سایپا یدک", "ارسال فوری"],
    theme: {
      primaryColor: "#dc2626",
      secondaryColor: "#1e293b",
      backgroundColor: "#f8fafc",
      fontFamily: "Kalameh",
      borderRadius: 10,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-yadakpart",
        name: "یدک‌پارت",
        version: "1.0.0",
        packageName: "ir.yadakpart.auto",
        iconUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#dc2626",
        secondaryColor: "#1e293b",
        cardBorderRadius: 10,
        cardStyle: "bordered",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو با نام خودرو، شماره فنی قطعه یا شاسی...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "خانه", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "قطعات", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_auto",
          type: "notice_box",
          variant: "warning",
          message: "🚗 امکان استعلام شماره شاسی (VIN) جهت اطمینان از تطابق ۱۰۰٪ قطعه با خودروی شما",
        },
        {
          id: "block_slider_auto",
          type: "banner_slider",
          height: 170,
          items: [
            {
              id: "as1",
              imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&h=300&fit=crop",
              title: "روغن موتورهای اصل خارجی و فیلترهای استاندارد با کد رهگیری سامانه همتا",
            },
            {
              id: "as2",
              imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=300&fit=crop",
              title: "لنت ترمزهای سرامیکی بدون بو و صدا ویژه خودروهای ایرانی و وارداتی",
            },
          ],
        },
        {
          id: "block_cats_auto",
          type: "categories",
          title: "گروه‌های قطعات یدکی خودرو",
          items: [
            { id: "ac1", title: "لنت و ترمز", imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150&h=150&fit=crop" },
            { id: "ac2", title: "روغن و فیلتر", imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&h=150&fit=crop" },
            { id: "ac3", title: "سیستم تعلیق", imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=150&h=150&fit=crop" },
            { id: "ac4", title: "لامپ و هدلایت", imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_brands_auto",
          type: "brand_grid",
          title: "سازندگان قطعات اصلی خودرو",
          items: [
            { name: "ایساکو", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" },
            { name: "سایپا یدک", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
            { name: "Bosch", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
            { name: "کاسترول", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
          ],
        },
        {
          id: "block_carousel_auto",
          type: "product_carousel",
          title: "پرفروش‌ترین قطعات مصرفی",
          subtitle: "تضمین اصالت هولوگرام شرکت سازنده با امکان عودت در صورت عدم تطابق",
          themeColor: "#dc2626",
          items: [
            {
              id: "ap1",
              title: "کیت کلاچ والئو سبز اصلی فرانسه مناسب پژو ۲۰۶ و رانا",
              price: 4650000,
              regularPrice: 5200000,
              discount: 11,
              imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=200&h=200&fit=crop",
            },
            {
              id: "ap2",
              title: "روغن موتور تمام سنتتیک ۵ لیتری توتال کوارتز 7000 SN",
              price: 1850000,
              regularPrice: 2100000,
              discount: 12,
              imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_badges_auto",
          type: "trust_badges",
          title: "تضمین‌های یدک‌پارت",
          items: [
            { title: "ضمانت اصالت هولوگرام شرکتی و ثبت سامانه جامع تجارت" },
            { title: "ارسال سریع با پیک موتوری زیر ۲ ساعت در کلان‌شهرها" },
            { title: "امکان استرداد قطعه در صورت عدم تطابق با خودرو" },
            { title: "مشاوره رایگان تلفنی با کارشناسان فنی مکانیک خودرو" },
          ],
        },
        {
          id: "block_grid_auto",
          type: "product_grid",
          title: "تجهیزات روشنایی و هدلایت‌های پرنور",
          items: [
            {
              id: "ag1",
              title: "هدلایت ۴ حالته پایه H7 فن‌دار با چیپ CSP ضدآب",
              price: 1250000,
              imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=300&h=300&fit=crop",
            },
            {
              id: "ag2",
              title: "پمپ باد فندکی دو سیلندر همراه با چراغ قوه و کیف ابزار",
              price: 1650000,
              imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 12. BOOKSTORE, PUBLISHING & STATIONERY
  {
    id: "bookstore_stationery",
    name: "کتاب‌سرای اندیشه (کتاب، نشر و نوشت‌افزار)",
    category: "کتاب، نشر و فرهنگ",
    categoryGroup: "lifestyle_culture",
    description: "قالب اصیل و نوستالژیک کتابفروشی، رمان، کتاب‌های انگیزشی، نشر روز، کتاب صوتی و نوشت‌افزار فانتزی.",
    icon: "📚",
    tags: ["برگزیده هفته", "کتاب صوتی", "نوشت‌افزار هنری", "بریده کتاب"],
    theme: {
      primaryColor: "#854d0e",
      secondaryColor: "#047857",
      backgroundColor: "#fefce8",
      fontFamily: "Kalameh",
      borderRadius: 14,
      cardStyle: "bordered",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-andishehbook",
        name: "کتاب‌سرای اندیشه",
        version: "1.0.0",
        packageName: "ir.andisheh.bookstore",
        iconUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#854d0e",
        secondaryColor: "#047857",
        cardBorderRadius: 14,
        cardStyle: "bordered",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان عنوان کتاب، نام نویسنده یا مترجم...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "کتابخانه", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "موضوعات", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_book",
          type: "notice_box",
          variant: "info",
          message: "📖 ارسال پستی رایگان کتاب‌ها به مناسبت هفته کتاب‌خوانی برای سفارش‌های بالای ۳۰۰ هزار تومان",
        },
        {
          id: "block_stories_book",
          type: "story_circles",
          title: "بریده کتاب‌ها و صدای نویسندگان",
          items: [
            { id: "bst1", title: "بریده روز", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&h=120&fit=crop", unread: true },
            { id: "bst2", title: "کتاب صوتی", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&h=120&fit=crop", unread: true },
            { id: "bst3", title: "رمان تازه", imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=120&h=120&fit=crop", unread: false },
            { id: "bst4", title: "نوشت‌افزار", imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=120&h=120&fit=crop", unread: false },
          ],
        },
        {
          id: "block_slider_book",
          type: "banner_slider",
          height: 175,
          items: [
            {
              id: "bs1",
              imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=300&fit=crop",
              title: "پرفروش‌ترین رمان‌های برنده نوبل و آثار داستانی برتر جهان",
            },
            {
              id: "bs2",
              imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=300&fit=crop",
              title: "کتاب‌های توسعه فردی و مدیریت زمان ترجمه عادل فردوسی‌پور",
            },
          ],
        },
        {
          id: "block_cats_book",
          type: "categories",
          title: "موضوعات و قفسه‌های کتاب",
          items: [
            { id: "bc1", title: "ادبیات داستانی", imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=150&h=150&fit=crop" },
            { id: "bc2", title: "توسعه فردی", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&h=150&fit=crop" },
            { id: "bc3", title: "تاریخ و فلسفه", imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=150&h=150&fit=crop" },
            { id: "bc4", title: "نوشت‌افزار و ماگ", imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_book",
          type: "product_carousel",
          title: "پرفروش‌ترین کتاب‌های فصل",
          subtitle: "چاپ اصلی و بدون سانسور با بهترین کیفیت کاغذ بالک",
          themeColor: "#854d0e",
          items: [
            {
              id: "bp1",
              title: "کتاب هنر شفاف اندیشیدن اثر رولف دوبلی (ترجمه عادل فردوسی‌پور)",
              price: 245000,
              regularPrice: 290000,
              discount: 15,
              imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop",
            },
            {
              id: "bp2",
              title: "کتاب چشم‌هایش اثر بزرگ علوی جلد سخت گالینگور نفیس",
              price: 195000,
              regularPrice: 230000,
              discount: 15,
              imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_coupon_book",
          type: "coupon_card",
          title: "کد تخفیف اختصاصی خرید اول کتاب",
          discount: "۲۰٪ تخفیف بدون سقف",
          desc: "برای سفارش اول روی تمامی کتاب‌های عمومی و نوشت‌افزار هنری",
          expiry: "مهلت تا پایان فصل پاییز",
          code: "BOOK20",
        },
        {
          id: "block_grid_book",
          type: "product_grid",
          title: "نوشت‌افزار فانتزی و ملزومات مطالعه",
          items: [
            {
              id: "bg1",
              title: "دفتر برنامه‌ریزی روزانه بولت ژورنال جلد چرمی با کاغذ بالکی",
              price: 185000,
              imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop",
            },
            {
              id: "bg2",
              title: "چراغ مطالعه شارژی گردنی قابل تنظیم مناسب مطالعه شبانه",
              price: 280000,
              imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 13. PET SHOP & VETERINARY
  {
    id: "pet_shop",
    name: "پت‌استور ملوس (غذا و ملزومات سگ و گربه)",
    category: "حیوانات خانگی و پت‌شاپ",
    categoryGroup: "food_retail",
    description: "قالب جذاب و مهربان پت‌شاپ برای فروش غذای خشک اورجینال، تشویقی، خاک گربه، باکس و اسباب‌بازی پت.",
    icon: "🐾",
    tags: ["غذای خشک اصل", "تاریخ انقضای بلند", "ارسال اکسپرس", "مشاوره دامپزشک"],
    theme: {
      primaryColor: "#f97316",
      secondaryColor: "#06b6d4",
      backgroundColor: "#fff7ed",
      fontFamily: "Kalameh",
      borderRadius: 18,
      cardStyle: "elevated",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-maloospet",
        name: "پت‌استور ملوس",
        version: "1.0.0",
        packageName: "ir.maloos.petshop",
        iconUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#f97316",
        secondaryColor: "#06b6d4",
        cardBorderRadius: 18,
        cardStyle: "elevated",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در میان غذاهای رویال کنین، رفلکس و تشویقی...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "پت‌شاپ", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "دسته‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل پت", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_pet",
          type: "notice_box",
          variant: "success",
          message: "🐾 تمام غذاها با تضمین تاریخ انقضای بالای یک سال و انبارداری استاندارد ارسال می‌شوند.",
        },
        {
          id: "block_stories_pet",
          type: "story_circles",
          title: "آموزش و نگهداری از سگ و گربه",
          items: [
            { id: "petst1", title: "تغذیه گربه", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&h=120&fit=crop", unread: true },
            { id: "petst2", title: "آموزش سگ", imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&h=120&fit=crop", unread: true },
            { id: "petst3", title: "خاک گربه", imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=120&h=120&fit=crop", unread: false },
            { id: "petst4", title: "تشویقی دنتال", imageUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=120&h=120&fit=crop", unread: false },
          ],
        },
        {
          id: "block_slider_pet",
          type: "banner_slider",
          height: 170,
          items: [
            {
              id: "pets1",
              imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=300&fit=crop",
              title: "غذای خشک سگ و گربه رویال کنین فرانسه با بچ‌کد اصالت",
            },
            {
              id: "pets2",
              imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=300&fit=crop",
              title: "حراج انواع خاک گربه کربن‌دار با جذب بوی فوق‌العاده",
            },
          ],
        },
        {
          id: "block_cats_pet",
          type: "categories",
          title: "دسته‌بندی‌های پت‌شاپ",
          items: [
            { id: "petc1", title: "غذای خشک گربه", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop" },
            { id: "petc2", title: "غذای خشک سگ", imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&h=150&fit=crop" },
            { id: "petc3", title: "کنسرو و پوچ", imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=150&h=150&fit=crop" },
            { id: "petc4", title: "جای خواب و باکس", imageUrl: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_pet",
          type: "product_carousel",
          title: "پرفروش‌ترین غذاهای سگ و گربه",
          subtitle: "تضمین اصالت بسته‌بندی شرکتی با هولوگرام",
          themeColor: "#f97316",
          items: [
            {
              id: "petp1",
              title: "غذای خشک گربه عقیم‌شده رویال کنین مدل رگولار استریلایزد ۲ کیلوگرم",
              price: 1850000,
              regularPrice: 2150000,
              discount: 14,
              imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop",
            },
            {
              id: "petp2",
              title: "تشویقی مدادی دنتال سگ پدیگری با طعم گوشت گوساله و تمیزکننده دندان",
              price: 245000,
              regularPrice: 290000,
              discount: 15,
              imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_badges_pet",
          type: "trust_badges",
          title: "مزایای خرید از پت‌استور ملوس",
          items: [
            { title: "تضمین سلامت فیزیکی و تاریخ مصرف طولانی" },
            { title: "ارسال فوری اکسپرس با بسته‌بندی ضدضربه" },
            { title: "مشاوره رایگان انتخاب رژیم غذایی پت" },
            { title: "هدیه تشویقی غافلگیرکننده با هر خرید بالای ۴۰۰ تومان" },
          ],
        },
        {
          id: "block_grid_pet",
          type: "product_grid",
          title: "اسباب‌بازی و لوازم سرگرمی پت",
          items: [
            {
              id: "petg1",
              title: "اسکرچر و درخت گربه چندطبقه با کنف طبیعی و نشیمن نرم",
              price: 1950000,
              imageUrl: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=300&h=300&fit=crop",
            },
            {
              id: "petg2",
              title: "توپ هوشمند متحرک ال‌ای‌دی مخصوص بازی خودکار گربه",
              price: 490000,
              imageUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },

  // 14. ONLINE FLORIST & GIFTS
  {
    id: "florist_gifts",
    name: "گل‌آرا (گل طبیعی، گیاهان آپارتمانی و هدیه)",
    category: "گل‌فروشی، هدیه و تشریفات",
    categoryGroup: "lifestyle_culture",
    description: "قالب رمانتیک و چشم‌نواز ارسال گل طبیعی، باکس رز، گیاهان آپارتمانی و هدایای مناسبتی با زمان‌بندی دقیق تحویل.",
    icon: "💐",
    tags: ["ارسال سر وقت معین", "گل طبیعی روز", "کارت‌پستال دست‌نویس", "رزرو تشریفات"],
    theme: {
      primaryColor: "#e11d48",
      secondaryColor: "#059669",
      backgroundColor: "#fff1f2",
      fontFamily: "Kalameh",
      borderRadius: 18,
      cardStyle: "elevated",
    },
    sampleBlocksCount: 7,
    config: {
      metadata: {
        id: "app-demo-golara",
        name: "گل‌آرا",
        version: "1.0.0",
        packageName: "ir.golara.florist",
        iconUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=120&h=120&fit=crop",
        splashUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=120&h=120&fit=crop",
      },
      theme: {
        primaryColor: "#e11d48",
        secondaryColor: "#059669",
        cardBorderRadius: 18,
        cardStyle: "elevated",
        fontFamily: "Kalameh",
      },
      navigation: {
        appBar: {
          showSearch: true,
          searchPlaceholder: "جستجو در باکس‌های گل، گیاهان آپارتمانی و سبد هدیه...",
          searchBarStyle: "capsule",
        },
        bottomNav: {
          enabled: true,
          tabs: [
            { id: "tab_home", label: "گلخانه", icon: "home", targetPage: "home" },
            { id: "tab_categories", label: "دسته‌ها", icon: "grid", targetPage: "categories" },
            { id: "tab_cart", label: "سبد هدیه", icon: "cart", targetPage: "cart" },
            { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
          ],
        },
      },
      blocks: [
        {
          id: "block_notice_flower",
          type: "notice_box",
          variant: "discount",
          message: "🌹 امکان ارسال دقیق در ساعت مشخص به همراه کارت پستال با متن دست‌نویس دلخواه شما",
        },
        {
          id: "block_booking_flower",
          type: "booking_reservation",
          title: "رزرو گل‌آرایی مجالس و ماشین عروس",
          subtitle: "رزرو وقت مشاوره حضوری و زمان‌بندی اجرای گل‌آرایی تشریفات عقد و عروسی",
        },
        {
          id: "block_slider_flower",
          type: "banner_slider",
          height: 175,
          items: [
            {
              id: "fls1",
              imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&h=300&fit=crop",
              title: "باکس‌های لوکس رز هلندی تازه چیده شده صبح بازار گل",
            },
            {
              id: "fls2",
              imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=300&fit=crop",
              title: "گیاهان آپارتمانی مقاوم، زاموفیلیا، سانسوریا و بونسای",
            },
          ],
        },
        {
          id: "block_cats_flower",
          type: "categories",
          title: "دسته‌بندی‌های گل و گیاه",
          items: [
            { id: "flc1", title: "باکس گل رز", imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=150&h=150&fit=crop" },
            { id: "flc2", title: "دسته گل سورپرایز", imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=150&h=150&fit=crop" },
            { id: "flc3", title: "گیاه آپارتمانی", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=150&h=150&fit=crop" },
            { id: "flc4", title: "تاج گل تبریک و ترحیم", imageUrl: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=150&h=150&fit=crop" },
          ],
        },
        {
          id: "block_carousel_flower",
          type: "product_carousel",
          title: "محبوب‌ترین باکس‌های گل هدیه",
          subtitle: "تضمین شادابی گل تا ۴۸ ساعت در اسفنج مرطوب خارجی",
          themeColor: "#e11d48",
          items: [
            {
              id: "flp1",
              title: "باکس استوانه‌ای پلکسی ۲۰ شاخه رز هلندی قرمز آتشین با ربان ساتن",
              price: 1650000,
              regularPrice: 1950000,
              discount: 15,
              imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&h=200&fit=crop",
            },
            {
              id: "flp2",
              title: "گلدان سرامیکی زاموفیلیا بلک با پاجوش‌های فعال و خاک پرلیت دار",
              price: 890000,
              regularPrice: 1050000,
              discount: 15,
              imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop",
            },
          ],
        },
        {
          id: "block_badges_flower",
          type: "trust_badges",
          title: "تضمین‌های گل‌آرا",
          items: [
            { title: "تضمین تازگی و چیدمان گل در همان روز ارسال" },
            { title: "ارسال با خودروی سواری مسقف و کولردار" },
            { title: "ارسال عکس گل‌آرایی شده قبل از خروج پیک" },
            { title: "ارائه کارت‌پستال رایگان با متن دست‌نویس" },
          ],
        },
        {
          id: "block_grid_flower",
          type: "product_grid",
          title: "گیاهان آپارتمانی تصفیه‌کننده هوا",
          items: [
            {
              id: "flg1",
              title: "سانسوریا ابلق پا کوتاه شمشیری در گلدان سفالی مینیمال سفید",
              price: 450000,
              imageUrl: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300&h=300&fit=crop",
            },
            {
              id: "flg2",
              title: "پتوس نئون با آویز کنفی دست‌بافت ماکرامه",
              price: 320000,
              imageUrl: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=300&h=300&fit=crop",
            },
          ],
        },
      ],
    },
  },
];
