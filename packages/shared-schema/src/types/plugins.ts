export type PluginCategory =
  | 'commerce'
  | 'communication'
  | 'media'
  | 'utility'
  | 'growth';

export interface PluginSettingField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color';
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
  defaultValue?: any;
}

export interface AppetoPluginDef {
  id: string;
  name: string;
  category: PluginCategory;
  categoryName: string;
  description: string;
  icon: string;
  badge?: string;
  color: string;
  fields: PluginSettingField[];
  defaultSettings: Record<string, any>;
}

export interface ActiveProjectPlugin {
  enabled: boolean;
  settings: Record<string, any>;
  updatedAt?: string;
}

export const APPETO_PLUGIN_CATALOG: AppetoPluginDef[] = [
  // --- 1. COMMERCE & PAYMENTS ---
  {
    id: 'woocommerce',
    name: 'فروشگاه ووکامرس',
    category: 'commerce',
    categoryName: 'فروشگاهی و مالی',
    description: 'همگام‌سازی کامل با محصولات، سفارشات، سبد خرید و کدهای تخفیف ووکامرس وردپرس.',
    icon: 'ShoppingCart',
    badge: 'هسته فعال',
    color: '#8b5cf6',
    fields: [
      { key: 'siteUrl', label: 'آدرس وب‌سایت وردپرس', type: 'text', placeholder: 'https://myshop.com' },
      { key: 'consumerKey', label: 'کلید مصرف‌کننده (Consumer Key)', type: 'text', placeholder: 'ck_...' },
      { key: 'consumerSecret', label: 'رمز مصرف‌کننده (Consumer Secret)', type: 'text', placeholder: 'cs_...' },
      { key: 'syncInterval', label: 'فاصله همگام‌سازی (دقیقه)', type: 'number', defaultValue: 15 },
    ],
    defaultSettings: {
      siteUrl: 'https://example-shop.com',
      consumerKey: '',
      consumerSecret: '',
      syncInterval: 15,
    },
  },
  {
    id: 'wallet',
    name: 'کیف پول و امتیاز وفاداری',
    category: 'commerce',
    categoryName: 'فروشگاهی و مالی',
    description: 'شارژ آنلاین کیف پول با زرین‌پال، بازگشت وجه (Cashback) و پرداخت سریع سفارشات.',
    icon: 'Wallet',
    badge: 'محبوب',
    color: '#10b981',
    fields: [
      { key: 'enableCashback', label: 'فعال‌سازی کش‌بک خرید', type: 'boolean', defaultValue: true },
      { key: 'cashbackPercent', label: 'درصد هدیه کش‌بک هر خرید', type: 'number', defaultValue: 5 },
      { key: 'minRechargeAmount', label: 'حداقل مبلغ شارژ کیف پول (تومان)', type: 'number', defaultValue: 50000 },
      { key: 'allowTransfer', label: 'امکان انتقال موجودی بین کاربران', type: 'boolean', defaultValue: false },
    ],
    defaultSettings: {
      enableCashback: true,
      cashbackPercent: 5,
      minRechargeAmount: 50000,
      allowTransfer: false,
    },
  },
  {
    id: 'bazaar_billing',
    name: 'پرداخت درون‌برنامه‌ای بازار',
    category: 'commerce',
    categoryName: 'فروشگاهی و مالی',
    description: 'اتصال به سیستم خرید درون‌برنامه‌ای (In-App Billing) کافه‌بازار جهت فروش سکه و اشتراک.',
    icon: 'CreditCard',
    color: '#059669',
    fields: [
      { key: 'rsaKey', label: 'کلید عمومی RSA کافه‌بازار', type: 'textarea', placeholder: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...' },
      { key: 'enableSubscriptions', label: 'پشتیبانی از اشتراک ماهانه/سالیانه', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      rsaKey: '',
      enableSubscriptions: true,
    },
  },
  {
    id: 'myket_billing',
    name: 'پرداخت درون‌برنامه‌ای مایکت',
    category: 'commerce',
    categoryName: 'فروشگاهی و مالی',
    description: 'اتصال به درگاه خرید درون‌برنامه‌ای استور مایکت برای محصولات مصرفی و اشتراکی.',
    icon: 'ShieldCheck',
    color: '#0284c7',
    fields: [
      { key: 'rsaKey', label: 'کلید عمومی RSA مایکت', type: 'textarea', placeholder: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...' },
    ],
    defaultSettings: {
      rsaKey: '',
    },
  },
  {
    id: 'digital_downloads',
    name: 'فروشگاه فایل و دانلودی',
    category: 'commerce',
    categoryName: 'فروشگاهی و مالی',
    description: 'فروش انواع فایل، جزوات آموزشی، نرم‌افزار و کتاب‌های الکترونیک با لینک امن پس از پرداخت.',
    icon: 'DownloadCloud',
    color: '#d97706',
    fields: [
      { key: 'linkExpiryHours', label: 'مدت اعتبار لینک دانلود (ساعت)', type: 'number', defaultValue: 48 },
      { key: 'maxDownloadAttempts', label: 'تعداد دفعات مجاز دانلود', type: 'number', defaultValue: 5 },
    ],
    defaultSettings: {
      linkExpiryHours: 48,
      maxDownloadAttempts: 5,
    },
  },

  // --- 2. COMMUNICATION & SUPPORT ---
  {
    id: 'goftino_chat',
    name: 'چت آنلاین گفتینو',
    category: 'communication',
    categoryName: 'ارتباط و پشتیبانی',
    description: 'اتصال ویجت گفتگوی زنده با مشتریان به سامانه پشتیبانی ایرانی گفتینو (Goftino).',
    icon: 'MessageSquare',
    badge: 'ایرانی',
    color: '#f43f5e',
    fields: [
      { key: 'widgetKey', label: 'کلید وب‌سایت در گفتینو (Goftino Key)', type: 'text', placeholder: 'مثال: abc123xyz' },
      { key: 'floatingButton', label: 'نمایش آیکون چت شناور در پایین اپ', type: 'boolean', defaultValue: true },
      { key: 'accentColor', label: 'رنگ آیکون چت', type: 'color', defaultValue: '#f43f5e' },
    ],
    defaultSettings: {
      widgetKey: 'demo-goftino-key',
      floatingButton: true,
      accentColor: '#f43f5e',
    },
  },
  {
    id: 'raychat_chat',
    name: 'چت آنلاین رایچت',
    category: 'communication',
    categoryName: 'ارتباط و پشتیبانی',
    description: 'پشتیبانی آنلاین مشتریان از طریق پلتفرم رایچت با پاسخگویی آنی اپراتورها.',
    icon: 'MessagesSquare',
    color: '#06b6d4',
    fields: [
      { key: 'widgetToken', label: 'توکن ویجت در رایچت', type: 'text', placeholder: 'مثال: 98a7sd...' },
    ],
    defaultSettings: {
      widgetToken: '',
    },
  },
  {
    id: 'ticket_support',
    name: 'سیستم تیکت پشتیبانی',
    category: 'communication',
    categoryName: 'ارتباط و پشتیبانی',
    description: 'ثبت و پیگیری تیکت‌های پشتیبانی کاربران با امکان دسته‌بندی دپارتمانی و ضمیمه تصویر.',
    icon: 'LifeBuoy',
    badge: 'کاربردی',
    color: '#ec4899',
    fields: [
      { key: 'departments', label: 'دپارتمان‌ها (جدا شده با ویرگول)', type: 'text', defaultValue: 'پشتیبانی فنی, واحد فروش, حسابداری' },
      { key: 'allowAttachments', label: 'امکان ارسال اسکرین‌شات و تصویر', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      departments: 'پشتیبانی فنی, واحد فروش, حسابداری',
      allowAttachments: true,
    },
  },
  {
    id: 'contact_us',
    name: 'ماژول تماس با ما',
    category: 'communication',
    categoryName: 'ارتباط و پشتیبانی',
    description: 'صفحه اختصاصی تماس شامل شماره‌های تلفن، ایمیل، آدرس دفتر و شبکه‌های اجتماعی ایرانی و بین‌المللی.',
    icon: 'PhoneCall',
    color: '#3b82f6',
    fields: [
      { key: 'phone', label: 'تلفن تماس مستقیم', type: 'text', defaultValue: '۰۲۱۹۱۰۰۰۰۰۰' },
      { key: 'email', label: 'ایمیل رسمی', type: 'text', defaultValue: 'info@techmarket.ir' },
      { key: 'instagram', label: 'پیج اینستاگرام (آیدی)', type: 'text', placeholder: 'techmarket_ir' },
      { key: 'telegram', label: 'کانال تلگرام', type: 'text', placeholder: 'techmarket_channel' },
      { key: 'eitaa', label: 'کانال پیام‌رسان ایتا', type: 'text', placeholder: 'techmarket_eitaa' },
      { key: 'bale', label: 'کانال پیام‌رسان بله', type: 'text', placeholder: 'techmarket_bale' },
    ],
    defaultSettings: {
      phone: '۰۲۱۹۱۰۰۰۰۰۰',
      email: 'info@techmarket.ir',
      instagram: 'techmarket_ir',
      telegram: 'techmarket_channel',
      eitaa: 'techmarket_eitaa',
      bale: 'techmarket_bale',
    },
  },
  {
    id: 'about_us',
    name: 'ماژول درباره ما و مجوزها',
    category: 'communication',
    categoryName: 'ارتباط و پشتیبانی',
    description: 'معرفی اهداف، چشم‌انداز، اعضای تیم، نماد اعتماد الکترونیکی (اینماد) و نشان ساماندهی.',
    icon: 'Info',
    color: '#6366f1',
    fields: [
      { key: 'companyTitle', label: 'نام کامل مجموعه / برند', type: 'text', defaultValue: 'فروشگاه فناوری تک‌مارکت' },
      { key: 'bio', label: 'متن معرفی درباره ما', type: 'textarea', defaultValue: 'ما در تک‌مارکت با بیش از ۱۰ سال سابقه در تامین کالای دیجیتال، خریدی امن و سریع را برای شما فراهم می‌آوریم.' },
      { key: 'hasEnamad', label: 'نمایش نشان اینماد', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      companyTitle: 'فروشگاه فناوری تک‌مارکت',
      bio: 'ما در تک‌مارکت با بیش از ۱۰ سال سابقه در تامین کالای دیجیتال، خریدی امن و سریع را برای شما فراهم می‌آوریم.',
      hasEnamad: true,
    },
  },

  // --- 3. MEDIA & CONTENT ---
  {
    id: 'aparat_video',
    name: 'ماژول آپارات و ویدیو',
    category: 'media',
    categoryName: 'رسانه و محتوا',
    description: 'نمایش و پخش ویدیوهای کانال آپارات مستقیم درون اپلیکیشن با کیفیت متغیر و اینترنت نیم‌بها.',
    icon: 'Tv',
    badge: 'نیم‌بها',
    color: '#ea580c',
    fields: [
      { key: 'channelName', label: 'نام کانال آپارات', type: 'text', placeholder: 'مثال: digikala' },
      { key: 'autoPlay', label: 'پخش خودکار ویدیوها', type: 'boolean', defaultValue: false },
    ],
    defaultSettings: {
      channelName: 'techmarket',
      autoPlay: false,
    },
  },
  {
    id: 'audio_podcast',
    name: 'پلیر صوت و پادکست',
    category: 'media',
    categoryName: 'رسانه و محتوا',
    description: 'پخش‌کننده صوتی حرفه‌ای با لیست پخش (Playlist)، کاور آلبوم، کنترل‌های پس‌زمینه و حالت شناور.',
    icon: 'Headphones',
    color: '#a855f7',
    fields: [
      { key: 'showFloatingMiniPlayer', label: 'نمایش مینی‌پلیر شناور در پایین صفحات', type: 'boolean', defaultValue: true },
      { key: 'enableBackgroundAudio', label: 'ادامه پخش در هنگام قفل بودن گوشی', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      showFloatingMiniPlayer: true,
      enableBackgroundAudio: true,
    },
  },
  {
    id: 'pdf_viewer',
    name: 'کاتالوگ‌خوان و کتابخوان PDF',
    category: 'media',
    categoryName: 'رسانه و محتوا',
    description: 'مشاهده کاتالوگ، بروشورهای محصولات، دفترچه راهنما و نشریات الکترونیک با ابزار زوم و جستجو.',
    icon: 'FileText',
    color: '#e11d48',
    fields: [
      { key: 'enableNightMode', label: 'پشتیبانی از حالت مطالعه در شب', type: 'boolean', defaultValue: true },
      { key: 'allowDownload', label: 'امکان ذخیره فایل PDF روی گوشی کاربر', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      enableNightMode: true,
      allowDownload: true,
    },
  },
  {
    id: 'image_gallery',
    name: 'گالری آنلاین و نمونه‌کارها',
    category: 'media',
    categoryName: 'رسانه و محتوا',
    description: 'نمایش شبکه‌ای آلبوم‌های عکس، تصاویر قبل و بعد و نمونه‌کارها با امکان لایک و اشتراک‌گذاری.',
    icon: 'Image',
    color: '#0ea5e9',
    fields: [
      { key: 'columns', label: 'تعداد ستون‌ها در موبایل', type: 'number', defaultValue: 2 },
      { key: 'enableZoom', label: 'قابلیت زوم چندلمسی روی تصاویر', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      columns: 2,
      enableZoom: true,
    },
  },
  {
    id: 'wordpress_blog',
    name: 'وبلاگ و مقالات وردپرس',
    category: 'media',
    categoryName: 'رسانه و محتوا',
    description: 'نمایش آخرین مقالات، نقد و بررسی‌ها و دسته‌بندی‌های وبلاگ وردپرسی با زمان مطالعه و کامنت‌ها.',
    icon: 'Newspaper',
    color: '#2563eb',
    fields: [
      { key: 'postsPerPage', label: 'تعداد مقالات در هر بارگذاری', type: 'number', defaultValue: 10 },
      { key: 'showCommentSection', label: 'امکان ارسال و مشاهده نظرات کاربران', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      postsPerPage: 10,
      showCommentSection: true,
    },
  },
  {
    id: 'custom_webview',
    name: 'صفحه وب‌ویو سفارشی',
    category: 'media',
    categoryName: 'رسانه و محتوا',
    description: 'باز کردن هر لندینگ پیج، داشبورد تحت وب یا ابزار آنلاین اختصاصی به صورت تمام‌صفحه داخل اپلیکیشن.',
    icon: 'Globe',
    color: '#14b8a6',
    fields: [
      { key: 'url', label: 'آدرس اینترنتی (URL)', type: 'text', placeholder: 'https://mysite.com/landing' },
      { key: 'showToolbar', label: 'نمایش نوار ابزار و دکمه بازگشت', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      url: 'https://example.com',
      showToolbar: true,
    },
  },

  // --- 4. UTILITIES & INTERACTIVITY ---
  {
    id: 'barcode_scanner',
    name: 'بارکدخوان و اسکنر QR',
    category: 'utility',
    categoryName: 'ابزارها و تعامل',
    description: 'اسکن سریع بارکد کالا یا QR کد با دوربین گوشی و هدایت مستقیم کاربر به صفحه اختصاصی محصول.',
    icon: 'QrCode',
    badge: 'سریع',
    color: '#f59e0b',
    fields: [
      { key: 'playBeepSound', label: 'پخش صدای تایید (Beep) هنگام اسکن موفق', type: 'boolean', defaultValue: true },
      { key: 'enableFlashToggle', label: 'کلید روشن کردن فلش دوربین', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      playBeepSound: true,
      enableFlashToggle: true,
    },
  },
  {
    id: 'map_branches',
    name: 'نقشه و شعب با مسیریابی',
    category: 'utility',
    categoryName: 'ابزارها و تعامل',
    description: 'نمایش موقعیت دفتر مرکزی و شعب روی نقشه نشان و بلد همراه با مسیریابی سریع با یک کلیک.',
    icon: 'MapPin',
    color: '#10b981',
    fields: [
      { key: 'defaultLat', label: 'عرض جغرافیایی مرکز نقشه (Latitude)', type: 'number', defaultValue: 35.7219 },
      { key: 'defaultLng', label: 'طول جغرافیایی مرکز نقشه (Longitude)', type: 'number', defaultValue: 51.3347 },
      { key: 'preferNeshan', label: 'اولویت باز کردن نقشه نشان', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      defaultLat: 35.7219,
      defaultLng: 51.3347,
      preferNeshan: true,
    },
  },
  {
    id: 'appointment_booking',
    name: 'سیستم نوبت‌دهی و رزرواسیون',
    category: 'utility',
    categoryName: 'ابزارها و تعامل',
    description: 'انتخاب خدمات، پزشک یا کارشناس، تقویم جلالی، ساعات آزاد و پرداخت بیعانه جهت نوبت‌دهی.',
    icon: 'Calendar',
    badge: 'حرفه‌ای',
    color: '#8b5cf6',
    fields: [
      { key: 'serviceTitle', label: 'عنوان خدمت نوبت‌دهی', type: 'text', defaultValue: 'مشاوره حضوری و تخصصی' },
      { key: 'slotDurationMinutes', label: 'مدت زمان هر نوبت (دقیقه)', type: 'number', defaultValue: 30 },
      { key: 'depositAmount', label: 'مبلغ بیعانه رزرو (تومان - ۰ برای رایگان)', type: 'number', defaultValue: 100000 },
    ],
    defaultSettings: {
      serviceTitle: 'مشاوره حضوری و تخصصی',
      slotDurationMinutes: 30,
      depositAmount: 100000,
    },
  },
  {
    id: 'form_builder',
    name: 'ماژول فرم‌ساز و پرسشنامه',
    category: 'utility',
    categoryName: 'ابزارها و تعامل',
    description: 'طراحی انواع فرم استخدام، نظرسنجی، پیگیری گارانتی و فرم‌های سفارشی با دریافت فایل.',
    icon: 'CheckSquare',
    color: '#3b82f6',
    fields: [
      { key: 'notifyAdminBySms', label: 'ارسال پیامک به مدیر با ثبت هر فرم', type: 'boolean', defaultValue: true },
      { key: 'adminPhone', label: 'شماره موبایل مدیر دریافت‌کننده', type: 'text', defaultValue: '۰۹۱۲۱۲۳۴۵۶۷' },
    ],
    defaultSettings: {
      notifyAdminBySms: true,
      adminPhone: '۰۹۱۲۱۲۳۴۵۶۷',
    },
  },
  {
    id: 'quiz_maker',
    name: 'ماژول آزمون‌ساز آنلاین',
    category: 'utility',
    categoryName: 'ابزارها و تعامل',
    description: 'برگزاری آزمون‌های چندگزینه‌ای با تایمر معکوس، تصحیح خودکار و صدور کارنامه آنی.',
    icon: 'GraduationCap',
    color: '#ec4899',
    fields: [
      { key: 'timerMinutes', label: 'زمان کل آزمون (دقیقه)', type: 'number', defaultValue: 20 },
      { key: 'passingGrade', label: 'نمره قبولی (درصد)', type: 'number', defaultValue: 60 },
    ],
    defaultSettings: {
      timerMinutes: 20,
      passingGrade: 60,
    },
  },
  {
    id: 'polls_voting',
    name: 'رای‌گیری و نظرسنجی زنده',
    category: 'utility',
    categoryName: 'ابزارها و تعامل',
    description: 'ایجاد سوالات نظرسنجی و نمایش زنده درصدهای آرا در میان کاربران به صورت نموداری.',
    icon: 'BarChart2',
    color: '#06b6d4',
    fields: [
      { key: 'showLivePercentages', label: 'نمایش درصد آرا بلافاصله پس از ثبت رای', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      showLivePercentages: true,
    },
  },
  {
    id: 'classified_ads',
    name: 'ماژول ارسال آگهی و نیازمندی‌ها',
    category: 'utility',
    categoryName: 'ابزارها و تعامل',
    description: 'ثبت آگهی خرید و فروش کالا توسط کاربران با عکس، قیمت، استان/شهر و تایید مدیر.',
    icon: 'Tag',
    color: '#f97316',
    fields: [
      { key: 'requireAdminApproval', label: 'نیاز به تایید مدیر قبل از انتشار آگهی', type: 'boolean', defaultValue: true },
    ],
    defaultSettings: {
      requireAdminApproval: true,
    },
  },

  // --- 5. AI & GROWTH ---
  {
    id: 'ai_assistant',
    name: 'دستیار هوش مصنوعی (AI Chatbot)',
    category: 'growth',
    categoryName: 'هوش مصنوعی و رشد',
    description: 'چت‌بات هوشمند مبتنی بر LLM برای مشاوره خرید محصولات، پاسخ به سوالات متداول و پشتیبانی ۲۴ ساعته.',
    icon: 'Sparkles',
    badge: 'پیشرفته',
    color: '#6366f1',
    fields: [
      { key: 'assistantName', label: 'نام دستیار هوشمند', type: 'text', defaultValue: 'دستیار هوشمند تک‌مارکت' },
      { key: 'welcomeMessage', label: 'پیام خوش‌آمدگویی', type: 'textarea', defaultValue: 'سلام! چطور می‌تونم در انتخاب بهترین کالای دیجیتال یا پیگیری سفارش به شما کمک کنم؟' },
      { key: 'systemPrompt', label: 'دستورالعمل هوش مصنوعی (Prompt)', type: 'textarea', defaultValue: 'تو دستیار فروشگاه تک‌مارکت هستی. مودب، با لحن دوستانه و فارسی پاسخ بده.' },
    ],
    defaultSettings: {
      assistantName: 'دستیار هوشمند تک‌مارکت',
      welcomeMessage: 'سلام! چطور می‌تونم در انتخاب بهترین کالای دیجیتال یا پیگیری سفارش به شما کمک کنم؟',
      systemPrompt: 'تو دستیار فروشگاه تک‌مارکت هستی. مودب، با لحن دوستانه و فارسی پاسخ بده.',
    },
  },
  {
    id: 'force_update',
    name: 'ماژول آپدیت اجباری',
    category: 'growth',
    categoryName: 'هوش مصنوعی و رشد',
    description: 'کنترل نسخه اپلیکیشن، بررسی حداقل نسخه مجاز و نمایش پنجره آپدیت با لینک مستقیم بازار و مایکت.',
    icon: 'RefreshCw',
    badge: 'الزامی',
    color: '#ef4444',
    fields: [
      { key: 'minRequiredVersion', label: 'حداقل نسخه اجباری (Version Code)', type: 'number', defaultValue: 1 },
      { key: 'updateTitle', label: 'عنوان اعلان آپدیت', type: 'text', defaultValue: 'نسخه جدید تک‌مارکت منتشر شد!' },
      { key: 'updateDescription', label: 'متن توضیحات تغییرات جدید', type: 'textarea', defaultValue: 'برای تجربه امکانات جدید، سرعت بالاتر و امنیت بیشتر، لطفا اپلیکیشن خود را به‌روزرسانی کنید.' },
      { key: 'bazaarUrl', label: 'لینک صفحه اپ در کافه‌بازار', type: 'text', defaultValue: 'bazaar://details?id=ir.techmarket.app' },
      { key: 'myketUrl', label: 'لینک صفحه اپ در مایکت', type: 'text', defaultValue: 'myket://details?id=ir.techmarket.app' },
    ],
    defaultSettings: {
      minRequiredVersion: 1,
      updateTitle: 'نسخه جدید تک‌مارکت منتشر شد!',
      updateDescription: 'برای تجربه امکانات جدید، سرعت بالاتر و امنیت بیشتر، لطفا اپلیکیشن خود را به‌روزرسانی کنید.',
      bazaarUrl: 'bazaar://details?id=ir.techmarket.app',
      myketUrl: 'myket://details?id=ir.techmarket.app',
    },
  },
  {
    id: 'push_notifications',
    name: 'نوتیفیکیشن پوش (پوش‌پل / نجوا)',
    category: 'growth',
    categoryName: 'هوش مصنوعی و رشد',
    description: 'ارسال اعلان‌های جذاب، تخفیف‌های ویژه و سبد خریدهای رهاشده به کاربران با کلید PushPole یا Najva.',
    icon: 'Bell',
    color: '#8b5cf6',
    fields: [
      { key: 'provider', label: 'سرویس‌دهنده پوش', type: 'select', defaultValue: 'pushpole', options: [{ label: 'پوش‌پل (PushPole)', value: 'pushpole' }, { label: 'نجوا (Najva)', value: 'najva' }] },
      { key: 'appId', label: 'شناسه اپلیکیشن در پنل پوش', type: 'text', placeholder: 'مثال: pushpole_app_id' },
    ],
    defaultSettings: {
      provider: 'pushpole',
      appId: '',
    },
  },
  {
    id: 'adivery_ads',
    name: 'تبلیغات درون‌برنامه‌ای ادیوری',
    category: 'growth',
    categoryName: 'هوش مصنوعی و رشد',
    description: 'کسب درآمد تضمینی از طریق نمایش بنرهای همسان، پاپ‌آپ و ویدیوهای جایزه‌ای شبکه تبلیغات Adivery.',
    icon: 'DollarSign',
    color: '#10b981',
    fields: [
      { key: 'appId', label: 'شناسه اپلیکیشن در پنل ادیوری (App ID)', type: 'text', placeholder: 'مثال: 94a123...' },
      { key: 'enableBanner', label: 'فعال‌سازی بنر انتهای صفحات', type: 'boolean', defaultValue: true },
      { key: 'enableRewarded', label: 'فعال‌سازی ویدیوی جایزه‌ای (امتیاز برای کاربر)', type: 'boolean', defaultValue: false },
    ],
    defaultSettings: {
      appId: '',
      enableBanner: true,
      enableRewarded: false,
    },
  },
  {
    id: 'splash_onboarding',
    name: 'صفحات معرفی اولیه (Onboarding)',
    category: 'growth',
    categoryName: 'هوش مصنوعی و رشد',
    description: 'اسلایدر چندمرحله‌ای راهنما و معرفی مزایای اپلیکیشن در اولین اجرای کاربر با دکمه شروع.',
    icon: 'Sparkle',
    color: '#f59e0b',
    fields: [
      { key: 'slide1Title', label: 'عنوان اسلاید ۱', type: 'text', defaultValue: 'تنوع بی‌نظیر کالاهای دیجیتال' },
      { key: 'slide1Desc', label: 'توضیح اسلاید ۱', type: 'textarea', defaultValue: 'بیش از ۱۰ هزار قلم محصول با گارانتی اصالت و سلامت فیزیکی' },
      { key: 'slide2Title', label: 'عنوان اسلاید ۲', type: 'text', defaultValue: 'ارسال فوق‌سریع به سراسر ایران' },
      { key: 'slide2Desc', label: 'توضیح اسلاید ۲', type: 'textarea', defaultValue: 'تحویل اکسپرس در کمتر از ۲۴ ساعت در تهران و کلان‌شهرها' },
    ],
    defaultSettings: {
      slide1Title: 'تنوع بی‌نظیر کالاهای دیجیتال',
      slide1Desc: 'بیش از ۱۰ هزار قلم محصول با گارانتی اصالت و سلامت فیزیکی',
      slide2Title: 'ارسال فوق‌سریع به سراسر ایران',
      slide2Desc: 'تحویل اکسپرس در کمتر از ۲۴ ساعت در تهران و کلان‌شهرها',
    },
  },
  {
    id: 'auth_otp',
    name: 'ورود پیامکی با کد یکبارمصرف (OTP)',
    category: 'growth',
    categoryName: 'هوش مصنوعی و رشد',
    description: 'احراز هویت شماره همراه با ارسال پیامک کد تایید سریع از طریق وب‌سرویس‌های کاوه‌نگار یا فراز اس‌ام‌اس.',
    icon: 'Key',
    badge: 'امنیت',
    color: '#059669',
    fields: [
      { key: 'provider', label: 'سامانه پیامکی', type: 'select', defaultValue: 'kavenegar', options: [{ label: 'کاوه‌نگار (Kavenegar)', value: 'kavenegar' }, { label: 'فراز اس‌ام‌اس (FarazSMS)', value: 'faraz' }] },
      { key: 'apiKey', label: 'کلید وب‌سرویس پیامک (API Key)', type: 'text', placeholder: 'مثال: 54a7c...' },
      { key: 'patternCode', label: 'کد پترن اعتبارسنجی سریع', type: 'text', placeholder: 'مثال: otp_verify' },
    ],
    defaultSettings: {
      provider: 'kavenegar',
      apiKey: '',
      patternCode: 'otp_verify',
    },
  },
];
