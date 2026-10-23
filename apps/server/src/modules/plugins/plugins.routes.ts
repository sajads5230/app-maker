import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { PluginsService } from './plugins.service.js';

export const pluginsRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Get Master Appeto Plugin Catalog (All 32 plugins)
  server.get('/api/plugins', async () => {
    const catalog = PluginsService.getCatalog();
    return {
      success: true,
      total: catalog.length,
      catalog,
    };
  });

  // 2. Get Active Plugins for Project
  server.get('/api/projects/:projectId/plugins', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    try {
      const plugins = await PluginsService.getProjectPlugins(projectId);
      return reply.send({ success: true, plugins });
    } catch (err: any) {
      return reply.status(404).send({ success: false, error: err.message });
    }
  });

  // 3. Toggle Plugin Status (Enable / Disable)
  server.post('/api/projects/:projectId/plugins/:pluginId/toggle', async (request, reply) => {
    const { projectId, pluginId } = request.params as { projectId: string; pluginId: string };
    const { enabled } = (request.body as { enabled?: boolean }) || {};

    try {
      const updated = await PluginsService.togglePlugin(projectId, pluginId, enabled);
      return reply.send({
        success: true,
        pluginId,
        plugin: updated,
        message: updated.enabled ? 'ماژول با موفقیت فعال شد.' : 'ماژول غیرفعال شد.',
      });
    } catch (err: any) {
      return reply.status(400).send({ success: false, error: err.message });
    }
  });

  // 4. Update Plugin Settings
  server.post('/api/projects/:projectId/plugins/:pluginId/config', async (request, reply) => {
    const { projectId, pluginId } = request.params as { projectId: string; pluginId: string };
    const settings = (request.body as Record<string, any>) || {};

    try {
      const updated = await PluginsService.updatePluginSettings(projectId, pluginId, settings);
      return reply.send({
        success: true,
        pluginId,
        plugin: updated,
        message: 'تنظیمات ماژول با موفقیت ذخیره شد.',
      });
    } catch (err: any) {
      return reply.status(400).send({ success: false, error: err.message });
    }
  });

  // --- SPECIAL INTERACTIVE PLUGIN SIMULATION ENDPOINTS ---

  // 5. AI Assistant Chat Endpoint
  server.post('/api/plugins/ai/chat', async (request, reply) => {
    const { message } = request.body as { message: string };

    const lower = (message || '').toLowerCase();
    let replyText = 'سلام! من دستیار هوشمند تک‌مارکت هستم. چطور می‌تونم در خرید یا پیگیری سفارشتون کمکتون کنم؟';

    if (lower.includes('هدفون') || lower.includes('سونی') || lower.includes('xm5')) {
      replyText = 'هدفون سونی مدل WH-1000XM5 یکی از محبوب‌ترین هدفون‌های نویز کنسلینگ بازاره! باتری ۳۰ ساعته داره و در حال حاضر با تخفیف ویژه به قیمت ۱۸,۴۵۰,۰۰۰ تومان و ارسال رایگان در تک‌مارکت موجوده.';
    } else if (lower.includes('ارسال') || lower.includes('پست') || lower.includes('تحویل')) {
      replyText = 'تمام سفارش‌های بالای ۱ میلیون تومان در تک‌مارکت به صورت کاملاً رایگان ارسال می‌شن! در تهران تحویل با پیک اکسپرس همان روز و برای شهرستان‌ها ۲ الی ۳ روز کاری با پست پیشتاز زمان می‌بره.';
    } else if (lower.includes('گارانتی') || lower.includes('ضمانت')) {
      replyText = 'تمامی محصولات فروشگاه تک‌مارکت دارای ۱۸ ماه گارانتی معتبر شرکتی و ۷ روز ضمانت بازگشت بی‌قید و شرط وجه هستند.';
    } else if (lower.includes('کد تخفیف') || lower.includes('کوپن')) {
      replyText = 'می‌تونید از کد تخفیف ویژه کاربران جدید یعنی «TECH1405» استفاده کنید تا ۲۰٪ تخفیف روی اولین سفارشتون اعمال بشه!';
    } else if (message && message.trim().length > 0) {
      replyText = `در رابطه با «${message}» تیم کارشناسی تک‌مارکت در خدمت شماست. پیشنهاد می‌کنم بخش جستجوی پیشرفته اپ رو بررسی کنید یا مستقیماً از سبد خرید سفارش خودتون رو ثبت بفرمایید!`;
    }

    return reply.send({
      success: true,
      sender: 'AI_ASSISTANT',
      response: replyText,
      timestamp: new Date().toISOString(),
    });
  });

  // 6. Wallet Balance & Mock Recharge
  let mockWalletBalance = 250000;
  const mockTransactions = [
    { id: 'tx_1', title: 'شارژ کیف پول با کارت شتاب', amount: '+۲۰۰,۰۰۰ ت', date: '۱۴۰۵/۰۸/۰۱', type: 'credit' },
    { id: 'tx_2', title: 'کش‌بک خرید هدفون سونی', amount: '+۵۰,۰۰۰ ت', date: '۱۴۰۵/۰۸/۰۲', type: 'credit' },
  ];

  server.get('/api/plugins/wallet/balance', async () => {
    return {
      success: true,
      balance: mockWalletBalance,
      currency: 'تومان',
      formattedBalance: `${mockWalletBalance.toLocaleString('fa-IR')} تومان`,
      transactions: mockTransactions,
    };
  });

  server.post('/api/plugins/wallet/recharge', async (request, reply) => {
    const { amount } = request.body as { amount: number };
    if (!amount || amount < 10000) {
      return reply.status(400).send({ success: false, error: 'حداقل مبلغ شارژ ۱۰,۰۰۰ تومان است.' });
    }

    mockWalletBalance += amount;
    mockTransactions.unshift({
      id: `tx_${Date.now()}`,
      title: 'شارژ اینترنتی از درگاه زرین‌پال',
      amount: `+${amount.toLocaleString('fa-IR')} ت`,
      date: new Date().toLocaleDateString('fa-IR'),
      type: 'credit',
    });

    return reply.send({
      success: true,
      message: 'کیف پول با موفقیت شارژ شد.',
      newBalance: mockWalletBalance,
      formattedBalance: `${mockWalletBalance.toLocaleString('fa-IR')} تومان`,
    });
  });

  // 7. Support Tickets Endpoint
  const mockTickets: any[] = [
    {
      id: 'TCK-8921',
      subject: 'استعلام زمان تحویل سفارش با پست پیشتاز',
      department: 'واحد فروش',
      status: 'پاسخ داده شده',
      priority: 'معمولی',
      createdAt: '۱۴۰۵/۰۸/۰۱',
      messages: [
        { sender: 'user', text: 'سلام، سفارش من کی تحویل اداره پست داده میشه؟' },
        { sender: 'support', text: 'با سلام، سفارش شما تحویل مامور پست شده و کد رهگیری مرسوله پیامک گردید.' },
      ],
    },
  ];

  server.get('/api/plugins/support/tickets', async () => {
    return { success: true, tickets: mockTickets };
  });

  server.post('/api/plugins/support/ticket', async (request, reply) => {
    const { subject, department, message } = request.body as { subject: string; department?: string; message: string };

    if (!subject || !message) {
      return reply.status(400).send({ success: false, error: 'عنوان و متن پیام الزامی است.' });
    }

    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      department: department || 'پشتیبانی فنی',
      status: 'در حال بررسی',
      priority: 'معمولی',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      messages: [
        { sender: 'user', text: message },
      ],
    };

    mockTickets.unshift(newTicket);

    return reply.send({
      success: true,
      message: 'تیکت شما با موفقیت ثبت شد و کارشناسان ما به زودی پاسخ خواهند داد.',
      ticket: newTicket,
    });
  });
};
