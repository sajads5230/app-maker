export interface SupportMessage {
  id: string;
  sender: 'USER' | 'SUPPORT' | 'AI_BOT';
  senderName: string;
  content: string;
  createdAt: string;
  attachmentUrl?: string;
  isInternalNote?: boolean;
}

export interface InternalNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  userPlan: string;
  appPackageName: string;
  subject: string;
  department: 'TECHNICAL' | 'BILLING' | 'BUILD_ENGINE' | 'WOOCOMMERCE' | 'STORE_PUBLISHING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'ANSWERED' | 'RESOLVED' | 'CLOSED';
  assignedAgent?: string;
  rating?: number; // 1 to 5
  ratingFeedback?: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
  internalNotes: InternalNote[];
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface CannedResponse {
  id: string;
  title: string;
  department: string;
  content: string;
}

export class SupportService {
  private static cannedResponses: CannedResponse[] = [
    {
      id: 'canned-1',
      title: 'تنظیم پیوندهای یکتا در وردپرس',
      department: 'WOOCOMMERCE',
      content: 'سلام و وقت‌بخیر؛ جهت برقراری همگام‌سازی کامل با ووکامرس، لطفاً در پیشخوان وردپرس به مسیر «تنظیمات ← پیوندهای یکتا» مراجعه کرده و آن را روی گزینه «نام نوشته» ذخیره فرمایید.',
    },
    {
      id: 'canned-2',
      title: 'تاییدیه انتشار کافه‌بازار و مایکت',
      department: 'STORE_PUBLISHING',
      content: 'درود بر شما؛ بسته خروجی AAB اپلیکیشن شما به طور کامل با استاندارد Target SDK 34 و امضای اختصاصی RSA Keystore تطابق دارد. برنامه شما حداکثر ظرف ۱۲ ساعت کاری در استور تایید و منتشر خواهد شد.',
    },
    {
      id: 'canned-3',
      title: 'دریافت فاکتور رسمی با ارزش افزوده',
      department: 'BILLING',
      content: 'با سلام؛ فاکتور رسمی مالیاتی با شناسه ملی و کد اقتصادی و محاسبه ۹٪ مالیات ارزش افزوده در بخش «فاکتورهای رسمی» استودیو صادر شده و با کلیک روی دکمه چاپ قابل پرینت یا ذخیره به صورت PDF است.',
    },
    {
      id: 'canned-4',
      title: 'اسکن مستقیم فایل APK',
      department: 'BUILD_ENGINE',
      content: 'کاربر گرامی؛ فایل باینری APK نسخه جدید با موفقیت بیلد شد. با استفاده از دوربین گوشی خود می‌توانید کد QR موجود در پنجره خروجی را اسکن نمایید تا فایل مستقیماً روی گوشی همراه شما دانلود گردد.',
    },
  ];

  private static tickets: SupportTicket[] = [
    {
      id: 'tck-101',
      ticketNumber: 'TCK-1041',
      userId: 'default-user',
      userName: 'مدیر فروشگاه هوشمند',
      userPhone: '09121234567',
      userPlan: 'ENTERPRISE',
      appPackageName: 'ir.xiaomismart.store',
      subject: 'راهنمایی در خصوص انتشار نسخه AAB در مایکت',
      department: 'STORE_PUBLISHING',
      priority: 'MEDIUM',
      status: 'ANSWERED',
      assignedAgent: 'مهندس حسینی (پشتیبانی ارشد فلاتر)',
      rating: 5,
      ratingFeedback: 'پاسخگویی سریع و راهنمای دقیق، بسیار سپاسگزارم.',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        {
          id: 'msg-1',
          sender: 'USER',
          senderName: 'مدیر فروشگاه هوشمند',
          content: 'سلام و وقت‌بخیر، فایل AAB را از مرکز انتشار دانلود کردم. آیا برای مایکت نیازی به تنظیم مجدد کلید Keystore دارم؟',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'msg-2',
          sender: 'SUPPORT',
          senderName: 'مهندس حسینی (پشتیبانی ارشد فلاتر)',
          content: 'درود بر شما؛ خیر، فایل AAB تولیدشده توسط پلتفرم با کلید رسمی RSA 2048-bit اختصاصی شما امضا شده است و بلافاصله در پیشخوان مایکت و کافه‌بازار مورد تایید قرار می‌گیرد.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
      internalNotes: [
        {
          id: 'note-1',
          author: 'مهندس حسینی',
          content: 'کلید Keystore کاربر بررسی شد و فینگرپرینت SHA-256 کاملاً تایید است.',
          createdAt: new Date(Date.now() - 3700000).toISOString(),
        },
      ],
    },
    {
      id: 'tck-102',
      ticketNumber: 'TCK-1042',
      userId: 'default-user',
      userName: 'مدیر فروشگاه هوشمند',
      userPhone: '09121234567',
      userPlan: 'PRO',
      appPackageName: 'ir.xiaomismart.store',
      subject: 'نحوه دریافت فاکتور رسمی مالیاتی برای حسابداری شرکت',
      department: 'BILLING',
      priority: 'LOW',
      status: 'RESOLVED',
      assignedAgent: 'خانم رضایی (امور مالی و فاکتورها)',
      rating: 5,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 43200000).toISOString(),
      messages: [
        {
          id: 'msg-3',
          sender: 'USER',
          senderName: 'مدیر فروشگاه هوشمند',
          content: 'سلام، ما اشتراک یکساله خریداری کردیم. آیا فاکتور رسمی با شناسه ملی و کد اقتصادی صادر می‌شود؟',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'msg-4',
          sender: 'AI_BOT',
          senderName: 'دستیار هوشمند مالی اپ‌ساز',
          content: 'سلام وقت‌بخیر؛ بله، تمامی فاکتورهای صادره در سامانه اپ‌ساز دارای شناسه ملی، کد اقتصادی، شماره پیگیری شاپرک و محاسبه مالیات ارزش افزوده (۹٪) هستند و از منوی «فاکتورهای رسمی» در بالای استودیو قابل مشاهده و پرینت استاندارد A4 می‌باشند.',
          createdAt: new Date(Date.now() - 86390000).toISOString(),
        },
      ],
      internalNotes: [],
    },
    {
      id: 'tck-103',
      ticketNumber: 'TCK-1043',
      userId: 'user-tehran-digital',
      userName: 'امید سعادتی (تهران دیجیتال)',
      userPhone: '09359876543',
      userPlan: 'STARTUP',
      appPackageName: 'com.tehrandigital.app',
      subject: 'خطای Timeout هنگام فراخوانی دسته‌بندی‌های ووکامرس',
      department: 'WOOCOMMERCE',
      priority: 'URGENT',
      status: 'OPEN',
      createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      messages: [
        {
          id: 'msg-5',
          sender: 'USER',
          senderName: 'امید سعادتی',
          content: 'سلام، هاست ما روی کلودفلر است و وقتی سینک دسته‌ها را می‌زنیم خطای ۵۲۴ رخ می‌دهد. راهکار چیست؟',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
      internalNotes: [],
    },
    {
      id: 'tck-104',
      ticketNumber: 'TCK-1044',
      userId: 'user-pars-hyper',
      userName: 'سارا نامدار (پارس هایپر)',
      userPhone: '09191112233',
      userPlan: 'ENTERPRISE',
      appPackageName: 'ir.parshyper.shop',
      subject: 'درخواست فعال‌سازی ماژول چندفروشندگی دکان برای غرفه‌داران',
      department: 'TECHNICAL',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedAgent: 'مهندس اکبری (سرپرست زیرساخت)',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      messages: [
        {
          id: 'msg-6',
          sender: 'USER',
          senderName: 'سارا نامدار',
          content: 'سلام، ما نسخه اینترپرایز را فعال کردیم. آیا امکان شخصی‌سازی صفحه ثبت‌نام فروشندگان در اپ موبایل وجود دارد؟',
          createdAt: new Date(Date.now() - 14400000).toISOString(),
        },
        {
          id: 'msg-7',
          sender: 'SUPPORT',
          senderName: 'مهندس اکبری',
          content: 'سلام وقت‌بخیر خانم نامدار، بله این ویژگی در ماژول دکان پلتفرم وجود دارد. در حال حاضر تنظیمات اختصاصی غرفه‌داران روی اپ شما ست شده و نمونه تستی برایتان ارسال گردید.',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
      internalNotes: [
        {
          id: 'note-2',
          author: 'مهندس اکبری',
          content: 'پلاگین دکان پرو روی سایت مشتری ست آپ شده و API keys تایید شد.',
          createdAt: new Date(Date.now() - 7000000).toISOString(),
        },
      ],
    },
  ];

  public static readonly FAQS: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'خروجی و بیلد فلاتر',
      question: 'تفاوت فایل نصبی APK با بسته انتشار AAB چیست؟',
      answer: 'فایل APK مستقیماً روی گوشی‌های اندروید نصب می‌شود و می‌توانید آن را در تلگرام، ایتا یا وب‌سایت خود برای دانلود قرار دهید. فایل AAB فرمت رسمی جهت انتشار در کافه‌بازار، مایکت و گوگل‌پلی است که حجم نهایی دانلود توسط کاربر را تا ۶۰٪ کاهش می‌دهد.',
    },
    {
      id: 'faq-2',
      category: 'همگام‌سازی ووکامرس',
      question: 'کلیدهای REST API ووکامرس را از کجا تهیه کنم؟',
      answer: 'در پیشخوان وردپرس وارد مسیر «ووکامرس ← پیکربندی ← پیشرفته ← REST API» شوید. گزینه «افزودن کلید» را بزنید و سطح دسترسی را روی «خواندن/نوشتن (Read/Write)» قرار دهید. سپس Consumer Key و Consumer Secret تولیدشده را در پلاگین وارد کنید.',
    },
    {
      id: 'faq-3',
      category: 'انتشار در مارکت‌ها',
      question: 'چقدر طول می‌کشد تا اپلیکیشن من در کافه‌بازار و مایکت تایید شود؟',
      answer: 'به دلیل منطبق بودن کامل بسته‌های ما با Target SDK 34، داشتن کلید امضای معتبر و عدم درخواست دسترسی‌های پرخطر، اپلیکیشن شما معمولاً ظرف ۸ الی ۱۲ ساعت کاری در هر دو مارکت تایید و منتشر می‌شود.',
    },
    {
      id: 'faq-4',
      category: 'اشتراک و پلن‌ها',
      question: 'اگر سهمیه بیلد ماهانه من تمام شود چه اتفاقی می‌افتد؟',
      answer: 'اپلیکیشن‌های منتشرشده روی گوشی کاربران بدون هیچ مشکلی به کار خود ادامه می‌دهند و همگام‌سازی کالاها فعال خواهد بود. جهت اعمال تغییرات اساسی در استایل و دریافت خروجی باینری جدید، می‌توانید اشتراک خود را ارتقا دهید.',
    },
    {
      id: 'faq-5',
      category: 'کاربران آیفون و iOS',
      question: 'آیا کاربران آیفون هم می‌توانند از فروشگاه من استفاده کنند؟',
      answer: 'بله! پلتفرم بسته رسمی Ad-Hoc / Enterprise ویژه استورهای ایرانی آیفون (سیب‌اپ و اناردونی) را تولید می‌کند که بدون پرداخت هزینه دلاری اپل مستقیماً توسط کاربران iOS قابل نصب است.',
    },
  ];

  public static generateAiResponse(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('ووکامرس') || q.includes('وردپرس') || q.includes('همگام') || q.includes('کلودفلر')) {
      return 'در رابطه با ووکامرس: لطفا دقت فرمایید که آدرس سایت با https وارد شود، پیوندهای یکتا روی «نام نوشته» تنظیم باشد و اگر از کلودفلر استفاده می‌کنید، قانون Page Rule برای مسیر wp-json تنظیم فرمایید تا کش نشود.';
    }

    if (q.includes('بازار') || q.includes('مایکت') || q.includes('مارکت') || q.includes('aab')) {
      return 'جهت انتشار در کافه‌بازار و مایکت: بسته رسمی AAB تولیدشده دارای Target SDK 34 و امضای معتبر Keystore است. از بخش «انتشار در بازار و مایکت» می‌توانید فایل‌های آماده را دریافت کنید.';
    }

    if (q.includes('فاکتور') || q.includes('مالیات') || q.includes('ارزش افزوده')) {
      return 'تمامی صورتحساب‌های صادره در پلتفرم اپ‌ساز رسمی و دارای کد اقتصادی، شناسه ملی و محاسبه ۹٪ ارزش افزوده هستند و از منوی فاکتورها قابل پرینت می‌باشند.';
    }

    if (q.includes('دکان') || q.includes('چندفروشندگی') || q.includes('غرفه')) {
      return 'ماژول چندفروشندگی دکان امکان مشاهده اختصاصی غرفه‌ها، محصولات هر فروشنده و مدیریت مجزای موجودی و تسویه‌حساب را در اپلیکیشن موبایل فراهم می‌کند.';
    }

    return 'پیام شما دریافت شد و به کارشناسان دپارتمان مربوطه ارجاع گردید. میانگین زمان پاسخگویی همکاران ما کمتر از ۱۵ دقیقه است. هم‌چنین خط تلفنی ۰۲۱-۹۱۰۰۸۸۷۷ آماده راهنمایی فوری شماست.';
  }

  // --- USER SIDE METHODS ---

  public static getTickets(userId: string): SupportTicket[] {
    return this.tickets.filter((t) => t.userId === userId || userId === 'default-user');
  }

  public static getTicketById(id: string): SupportTicket | undefined {
    return this.tickets.find((t) => t.id === id);
  }

  public static createTicket(params: {
    userId: string;
    userName: string;
    userPhone: string;
    userPlan?: string;
    appPackageName?: string;
    subject: string;
    department: 'TECHNICAL' | 'BILLING' | 'BUILD_ENGINE' | 'WOOCOMMERCE' | 'STORE_PUBLISHING';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    content: string;
    attachmentUrl?: string;
  }): SupportTicket {
    const ticketId = `tck-${Date.now()}`;
    const ticketNumber = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    const userMsg: SupportMessage = {
      id: `msg-${Date.now()}-1`,
      sender: 'USER',
      senderName: params.userName,
      content: params.content,
      createdAt: new Date().toISOString(),
      attachmentUrl: params.attachmentUrl,
    };

    const newTicket: SupportTicket = {
      id: ticketId,
      ticketNumber,
      userId: params.userId,
      userName: params.userName,
      userPhone: params.userPhone,
      userPlan: params.userPlan || 'PRO',
      appPackageName: params.appPackageName || 'ir.xiaomismart.store',
      subject: params.subject,
      department: params.department,
      priority: params.priority,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [userMsg],
      internalNotes: [],
    };

    // Auto-respond with AI Assistant if helpful
    const aiAnswer = this.generateAiResponse(params.subject + ' ' + params.content);
    if (aiAnswer) {
      newTicket.status = 'ANSWERED';
      newTicket.messages.push({
        id: `msg-${Date.now()}-2`,
        sender: 'AI_BOT',
        senderName: 'دستیار هوشمند پشتیبانی ۲۴ ساعته',
        content: aiAnswer,
        createdAt: new Date(Date.now() + 500).toISOString(),
      });
    }

    this.tickets.unshift(newTicket);
    return newTicket;
  }

  public static addMessage(
    ticketId: string,
    params: {
      sender: 'USER' | 'SUPPORT' | 'AI_BOT';
      senderName: string;
      content: string;
      attachmentUrl?: string;
    }
  ): SupportTicket | undefined {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return undefined;

    ticket.messages.push({
      id: `msg-${Date.now()}`,
      sender: params.sender,
      senderName: params.senderName,
      content: params.content,
      createdAt: new Date().toISOString(),
      attachmentUrl: params.attachmentUrl,
    });

    ticket.updatedAt = new Date().toISOString();
    if (params.sender === 'USER') {
      ticket.status = 'OPEN';
    } else {
      ticket.status = 'ANSWERED';
    }

    return ticket;
  }

  public static rateTicket(ticketId: string, rating: number, feedback?: string): boolean {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return false;
    ticket.rating = rating;
    if (feedback) ticket.ratingFeedback = feedback;
    ticket.updatedAt = new Date().toISOString();
    return true;
  }

  public static closeTicket(ticketId: string): boolean {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return false;
    ticket.status = 'CLOSED';
    ticket.updatedAt = new Date().toISOString();
    return true;
  }

  // --- SUPERADMIN SIDE METHODS ---

  public static getAllTicketsAdmin(filters?: {
    status?: string;
    department?: string;
    priority?: string;
    search?: string;
  }): SupportTicket[] {
    let result = [...this.tickets];

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters?.department && filters.department !== 'ALL') {
      result = result.filter((t) => t.department === filters.department);
    }
    if (filters?.priority && filters.priority !== 'ALL') {
      result = result.filter((t) => t.priority === filters.priority);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.userName.toLowerCase().includes(q) ||
          t.userPhone.includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public static getAdminStats() {
    const total = this.tickets.length;
    const open = this.tickets.filter((t) => t.status === 'OPEN').length;
    const inProgress = this.tickets.filter((t) => t.status === 'IN_PROGRESS').length;
    const answered = this.tickets.filter((t) => t.status === 'ANSWERED').length;
    const resolved = this.tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
    const urgent = this.tickets.filter((t) => t.priority === 'URGENT').length;

    const ratedTickets = this.tickets.filter((t) => typeof t.rating === 'number');
    const avgRating =
      ratedTickets.length > 0
        ? Number((ratedTickets.reduce((acc, t) => acc + (t.rating || 0), 0) / ratedTickets.length).toFixed(1))
        : 4.9;

    return {
      total,
      open,
      inProgress,
      answered,
      resolved,
      urgent,
      avgResponseTimeMinutes: 12,
      satisfactionRatePercent: Math.round((avgRating / 5) * 100),
      avgRating,
    };
  }

  public static replyAsAdmin(
    ticketId: string,
    params: {
      agentName: string;
      content: string;
      newStatus?: 'ANSWERED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
      attachmentUrl?: string;
    }
  ): SupportTicket | undefined {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return undefined;

    ticket.messages.push({
      id: `msg-${Date.now()}-admin`,
      sender: 'SUPPORT',
      senderName: params.agentName || 'کارشناس ارشد پشتیبانی',
      content: params.content,
      createdAt: new Date().toISOString(),
      attachmentUrl: params.attachmentUrl,
    });

    ticket.status = params.newStatus || 'ANSWERED';
    ticket.assignedAgent = params.agentName || ticket.assignedAgent;
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }

  public static updateTicketMeta(
    ticketId: string,
    params: {
      status?: 'OPEN' | 'IN_PROGRESS' | 'ANSWERED' | 'RESOLVED' | 'CLOSED';
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      assignedAgent?: string;
    }
  ): SupportTicket | undefined {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return undefined;

    if (params.status) ticket.status = params.status;
    if (params.priority) ticket.priority = params.priority;
    if (params.assignedAgent) ticket.assignedAgent = params.assignedAgent;
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }

  public static addInternalNote(
    ticketId: string,
    params: { author: string; content: string }
  ): SupportTicket | undefined {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return undefined;

    ticket.internalNotes.push({
      id: `note-${Date.now()}`,
      author: params.author,
      content: params.content,
      createdAt: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }

  public static getCannedResponses(): CannedResponse[] {
    return this.cannedResponses;
  }
}
