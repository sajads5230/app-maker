import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { WooCommerceService, WooCredentials } from './woocommerce.service.js';
import { WordPressService } from './wordpress.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { prisma } from '../../prisma.js';
import fs from 'fs';
import path from 'path';

export interface WebhookEventLog {
  id: string;
  topic: string;
  productName: string;
  newPrice?: number;
  inStock?: boolean;
  summary: string;
  timestamp: string;
  formattedTime: string;
}

const recentWebhookEvents: WebhookEventLog[] = [];

export const woocommerceRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Test WooCommerce Connection
  server.post('/api/woocommerce/test-connection', async (request, reply) => {
    const { siteUrl, consumerKey, consumerSecret } = request.body as WooCredentials;

    if (!siteUrl || !consumerKey || !consumerSecret) {
      return reply.status(400).send({
        success: false,
        error: 'لطفاً آدرس سایت، کلید و رمز مصرف‌کننده ووکامرس را وارد نمایید.',
      });
    }

    const result = await WooCommerceService.testConnection({ siteUrl, consumerKey, consumerSecret });
    return reply.send(result);
  });

  // 2. Fetch Products
  server.get('/api/woocommerce/products', async (request, reply) => {
    const { siteUrl, consumerKey, consumerSecret, page, perPage, search } = request.query as any;

    const creds: WooCredentials = {
      siteUrl: siteUrl || 'https://techmarket.ir',
      consumerKey: consumerKey || 'ck_test',
      consumerSecret: consumerSecret || 'cs_test',
    };

    const products = await WooCommerceService.getProducts(
      creds,
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 20,
      search
    );

    return reply.send({ success: true, products });
  });

  // 3. Validate Coupon
  server.post('/api/woocommerce/coupons/validate', async (request, reply) => {
    const { siteUrl, consumerKey, consumerSecret, code, subtotal } = request.body as any;

    if (!code) {
      return reply.status(400).send({ success: false, error: 'کد تخفیف ارسال نشده است.' });
    }

    const creds: WooCredentials = {
      siteUrl: siteUrl || 'https://techmarket.ir',
      consumerKey: consumerKey || 'ck_test',
      consumerSecret: consumerSecret || 'cs_test',
    };

    const result = await WooCommerceService.validateCoupon(creds, code, subtotal || 0);
    return reply.send(result);
  });

  // 4. Create Order
  server.post('/api/woocommerce/orders', async (request, reply) => {
    const { siteUrl, consumerKey, consumerSecret, orderData } = request.body as any;

    const creds: WooCredentials = {
      siteUrl: siteUrl || 'https://techmarket.ir',
      consumerKey: consumerKey || 'ck_test',
      consumerSecret: consumerSecret || 'cs_test',
    };

    const result = await WooCommerceService.createOrder(creds, orderData);
    return reply.send(result);
  });

  // 5. Ingest Webhooks (Real-Time Two-Way Stock & Price Auto-Sync)
  server.post('/api/woocommerce/webhook', async (request, reply) => {
    const topic = (request.headers['x-wc-webhook-topic'] as string) || 'product.updated';
    const resource = (request.headers['x-wc-webhook-resource'] as string) || 'product';
    const event = (request.headers['x-wc-webhook-event'] as string) || 'updated';
    const signature = request.headers['x-wc-webhook-signature'] as string;
    const webhookSource = (request.headers['x-wc-webhook-source'] as string) || '';

    server.log.info(`[WooCommerce Webhook] Received topic: ${topic} (${resource}.${event}) from source: ${webhookSource}`);

    const payload = request.body as any;
    if (!payload) {
      return reply.status(400).send({ success: false, error: 'بدنه درخواست وب‌هوک خالی است.' });
    }

    const queryProjectId = (request.query as any)?.projectId;
    let targetProjectId = queryProjectId || 'app-demo-techmarket';

    // If no explicit project in query, find project whose config matches WooCommerce source
    if (!queryProjectId && webhookSource) {
      const allProjects = await prisma.project.findMany({ select: { id: true, configJson: true } });
      for (const p of allProjects) {
        if (p.configJson.includes(webhookSource.replace(/^https?:\/\//, ''))) {
          targetProjectId = p.id;
          break;
        }
      }
    }

    const project = await prisma.project.findUnique({ where: { id: targetProjectId } });
    if (!project) {
      return reply.status(404).send({ success: false, error: `پروژه با شناسه ${targetProjectId} یافت نشد.` });
    }

    let config: any;
    try {
      config = JSON.parse(project.configJson);
    } catch (_) {
      return reply.status(500).send({ success: false, error: 'پیکربندی پروژه خراب است.' });
    }

    let modifiedCount = 0;
    let summary = '';
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('fa-IR');

    if (resource === 'product' || topic.startsWith('product.')) {
      const applyResult = WooCommerceService.applyProductWebhookToConfig(config, payload, event);
      modifiedCount = applyResult.modifiedCount;
      summary = applyResult.summary;

      if (modifiedCount > 0) {
        // Save to database
        await prisma.project.update({
          where: { id: targetProjectId },
          data: { configJson: JSON.stringify(applyResult.updatedConfig, null, 2) },
        });

        // Save to mobile-core assets
        try {
          const candidates = [
            path.resolve(process.cwd(), '../mobile-core/assets/config/app_config.json'),
            path.resolve(process.cwd(), 'apps/mobile-core/assets/config/app_config.json'),
          ];
          for (const p of candidates) {
            if (fs.existsSync(path.dirname(p))) {
              fs.writeFileSync(p, JSON.stringify(applyResult.updatedConfig, null, 2), 'utf-8');
              break;
            }
          }
        } catch (_) {}
      }

      recentWebhookEvents.unshift({
        id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        topic,
        productName: applyResult.productName,
        newPrice: applyResult.newPrice,
        inStock: applyResult.inStock,
        summary,
        timestamp: now.toISOString(),
        formattedTime,
      });

      // Keep recent buffer limited to 30 events
      if (recentWebhookEvents.length > 30) recentWebhookEvents.pop();

      return reply.send({
        success: true,
        message: summary,
        modifiedCount,
        productName: applyResult.productName,
        newPrice: applyResult.newPrice,
        inStock: applyResult.inStock,
      });
    }

    if (resource === 'order' || topic.startsWith('order.')) {
      summary = `رویداد ثبت یا به‌روزرسانی سفارش #${payload.id} از مشتری ${payload.billing?.first_name || ''} دریافت شد.`;
      
      // Auto-trigger push notification for customer
      try {
        await NotificationsService.sendNotification({
          projectId: targetProjectId,
          targetPhone: payload.billing?.phone,
          title: `📦 وضعیت سفارش #${payload.id}`,
          body: `مشتری گرامی، وضعیت سفارش شما به روزرسانی شد: وضعیت «${payload.status || 'در حال پردازش'}».`,
          type: 'order',
          orderId: payload.id,
        });
      } catch (_) {}

      recentWebhookEvents.unshift({
        id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        topic,
        productName: `سفارش #${payload.id}`,
        newPrice: parseFloat(payload.total || '0'),
        inStock: true,
        summary,
        timestamp: now.toISOString(),
        formattedTime,
      });

      return reply.send({ success: true, message: summary });
    }

    return reply.send({ success: true, message: 'وب‌هوک با موفقیت دریافت گردید.' });
  });

  // 5.1 Recent Webhook Logs (for Live Studio Stream)
  server.get('/api/woocommerce/webhooks/recent', async (_request, reply) => {
    return reply.send({ success: true, events: recentWebhookEvents });
  });

  // 5.2 List Active Webhooks on WooCommerce Store
  server.get('/api/woocommerce/webhooks/list', async (request, reply) => {
    const { siteUrl, consumerKey, consumerSecret, projectId } = request.query as any;

    let creds: WooCredentials = {
      siteUrl: siteUrl || '',
      consumerKey: consumerKey || '',
      consumerSecret: consumerSecret || '',
    };

    if (projectId) {
      const proj = await prisma.project.findUnique({ where: { id: projectId } });
      if (proj) {
        try {
          const cfg = JSON.parse(proj.configJson);
          if (cfg.woocommerce?.siteUrl && cfg.woocommerce?.consumerKey) {
            creds = {
              siteUrl: cfg.woocommerce.siteUrl,
              consumerKey: cfg.woocommerce.consumerKey,
              consumerSecret: cfg.woocommerce.consumerSecret,
            };
          }
        } catch (_) {}
      }
    }

    const webhooks = await WooCommerceService.listWebhooks(creds);
    return reply.send({ success: true, webhooks });
  });

  // 5.3 One-Click Register Webhook
  server.post('/api/woocommerce/webhooks/register', async (request, reply) => {
    const { siteUrl, consumerKey, consumerSecret, name, topic, deliveryUrl, secret, projectId } = request.body as any;

    let creds: WooCredentials = {
      siteUrl: siteUrl || '',
      consumerKey: consumerKey || '',
      consumerSecret: consumerSecret || '',
    };

    const targetUrl = deliveryUrl || `http://localhost:4000/api/woocommerce/webhook?projectId=${projectId || 'app-demo-techmarket'}`;
    const result = await WooCommerceService.registerWebhook(creds, {
      name: name || 'App Maker Auto Sync - Real-Time',
      topic: topic || 'product.updated',
      deliveryUrl: targetUrl,
      secret: secret || 'appmaker_sec_xiaomi2026',
    });

    return reply.send(result);
  });

  // 5.4 Delete Webhook
  server.delete('/api/woocommerce/webhooks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { siteUrl, consumerKey, consumerSecret } = request.query as any;

    const creds: WooCredentials = {
      siteUrl: siteUrl || '',
      consumerKey: consumerKey || '',
      consumerSecret: consumerSecret || '',
    };

    const result = await WooCommerceService.deleteWebhook(creds, parseInt(id, 10));
    return reply.send(result);
  });

  // 5.5 Instant Webhook Simulator (Test Two-Way Real-Time Sync)
  server.post('/api/woocommerce/webhook/test-simulate', async (request, reply) => {
    const { projectId, productId, price, inStock, title } = request.body as any;

    const targetProjectId = projectId || 'app-demo-techmarket';
    const targetProductId = productId || 10160; // Default: Washing machine

    const project = await prisma.project.findUnique({ where: { id: targetProjectId } });
    if (!project) {
      return reply.status(404).send({ success: false, error: 'پروژه یافت نشد.' });
    }

    let config = JSON.parse(project.configJson);

    const simulatedPayload = {
      id: targetProductId,
      name: title || (targetProductId === 10160 ? 'ماشین لباسشویی شیائومی میجیا ۱۰ کیلویی' : 'محصول شیائومی'),
      price: price !== undefined ? price.toString() : '17900000',
      regular_price: '21000000',
      stock_status: inStock !== false ? 'instock' : 'outofstock',
    };

    const applyResult = WooCommerceService.applyProductWebhookToConfig(config, simulatedPayload, 'updated');

    if (applyResult.modifiedCount > 0) {
      // Save database
      await prisma.project.update({
        where: { id: targetProjectId },
        data: { configJson: JSON.stringify(applyResult.updatedConfig, null, 2) },
      });

      // Save mobile assets
      try {
        const candidates = [
          path.resolve(process.cwd(), '../mobile-core/assets/config/app_config.json'),
          path.resolve(process.cwd(), 'apps/mobile-core/assets/config/app_config.json'),
        ];
        for (const p of candidates) {
          if (fs.existsSync(path.dirname(p))) {
            fs.writeFileSync(p, JSON.stringify(applyResult.updatedConfig, null, 2), 'utf-8');
            break;
          }
        }
      } catch (_) {}
    }

    const now = new Date();
    recentWebhookEvents.unshift({
      id: `sim_${Date.now()}`,
      topic: 'product.updated (شبیه‌ساز آنی)',
      productName: applyResult.productName,
      newPrice: applyResult.newPrice,
      inStock: applyResult.inStock,
      summary: applyResult.summary,
      timestamp: now.toISOString(),
      formattedTime: now.toLocaleTimeString('fa-IR'),
    });

    return reply.send({
      success: true,
      message: applyResult.summary,
      modifiedCount: applyResult.modifiedCount,
      productName: applyResult.productName,
      newPrice: applyResult.newPrice,
      inStock: applyResult.inStock,
      blocks: applyResult.updatedConfig.blocks,
    });
  });

  // 6. Live Synchronize & Import WooCommerce Store Data into Project Blocks
  server.post('/api/woocommerce/sync-to-project', async (request, reply) => {
    const { projectId, siteUrl, consumerKey, consumerSecret } = (request.body as any) || {};

    if (!siteUrl || !consumerKey || !consumerSecret) {
      return reply.status(400).send({
        success: false,
        error: 'لطفاً آدرس سایت، کلید (Consumer Key) و رمز (Consumer Secret) ووکامرس را وارد کنید.',
      });
    }

    let normalizedUrl = siteUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const creds: WooCredentials = {
      siteUrl: normalizedUrl,
      consumerKey: consumerKey.trim(),
      consumerSecret: consumerSecret.trim(),
    };

    server.log.info(`[WooCommerce Sync] Starting store sync for URL: ${creds.siteUrl}`);

    // 1. Test Connection
    const testResult = await WooCommerceService.testConnection(creds);
    if (!testResult.success) {
      return reply.status(400).send({
        success: false,
        error: testResult.error || 'ارتباط با سایت وردپرس برقرار نشد. لطفاً از فعال بودن REST API اطمینان حاصل کنید.',
      });
    }

    // 2. Fetch live products and categories in parallel (fetch up to 100 products and 30 categories)
    const [products, categories] = await Promise.all([
      WooCommerceService.getProducts(creds, 1, 100),
      WooCommerceService.getCategories(creds, 30),
    ]);

    const targetProjectId = projectId || 'app-demo-techmarket';
    const project = await prisma.project.findUnique({ where: { id: targetProjectId } });
    if (!project) {
      return reply.status(404).send({ success: false, error: 'پروژه مورد نظر یافت نشد.' });
    }

    let config: any = {};
    try {
      config = JSON.parse(project.configJson);
    } catch (_) {}

    // Derive store name
    const storeDisplayName = testResult.storeName && testResult.storeName !== 'فروشگاه آنلاین ووکامرس'
      ? testResult.storeName
      : (creds.siteUrl.includes('xiaomi') ? 'شیائومی اسمارت' : 'فروشگاه آنلاین');

    // 3. Format Categories with Smart Real Product Image Resolution
    const categoryItems = categories.map((c) => {
      let resolvedImage = c.image;
      if (!resolvedImage || resolvedImage.trim() === '') {
        // Find first product in this category that has a real image
        const matchingProduct = products.find(
          (p) => p.categories && p.categories.includes(c.name) && p.imageUrl && !p.imageUrl.includes('unsplash')
        );
        if (matchingProduct && matchingProduct.imageUrl) {
          resolvedImage = matchingProduct.imageUrl;
        }
      }

      return {
        id: `c_${c.id}`,
        title: c.name,
        imageUrl: resolvedImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&h=150&fit=crop',
        count: c.count || 0,
      };
    });

    // 4. Format Products for App Blocks with full variations & technical specs
    const productItems = products.map((p) => ({
      id: `p_${p.id}`,
      productId: p.id,
      title: p.name,
      price: p.price,
      regularPrice: p.regularPrice || p.price,
      discount: p.discountPercent || 0,
      imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      galleryImages: p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : (p.imageUrl ? [p.imageUrl] : []),
      categories: p.categories || [],
      type: p.type || 'simple',
      description: p.description || '',
      attributes: p.attributes || [],
    }));

    // Separate featured / top products vs grid products
    const validProducts = productItems.filter((p) => p.price > 0 || p.regularPrice > 0);
    const pool = validProducts.length > 0 ? validProducts : productItems;
    const carouselItems = pool.slice(0, 15);
    const gridItems = pool.slice(15, 60).length > 0 ? pool.slice(15, 60) : pool.slice(0, 30);

    // 5. Construct New Dynamic Blocks
    const updatedBlocks: any[] = [];

    // Notice Box
    updatedBlocks.push({
      id: 'block_notice_woo',
      type: 'notice_box',
      variant: 'success',
      message: `🛍️ ارسال فوری به سراسر کشور و ضمانت اصالت کالا در ${storeDisplayName}`,
    });

    // Real Store Banner Slider
    const productsWithImages = productItems.filter((p) => p.imageUrl && !p.imageUrl.includes('unsplash'));
    const bannerItems = productsWithImages.slice(0, 3).map((p, idx) => ({
      id: `banner_store_${idx + 1}`,
      imageUrl: p.imageUrl,
      title: p.title.length > 55 ? `${p.title.substring(0, 52)}...` : p.title,
    }));

    if (bannerItems.length > 0) {
      updatedBlocks.push({
        id: 'block_slider_store',
        type: 'banner_slider',
        height: 180,
        items: bannerItems,
      });
    }

    // Categories Block (with real store product photos)
    if (categoryItems.length > 0) {
      updatedBlocks.push({
        id: 'block_categories_woo',
        type: 'categories',
        title: 'دسته‌بندی‌های محصولات سایت',
        items: categoryItems,
      });
    }

    // Product Carousel (Top Featured Products)
    if (carouselItems.length > 0) {
      updatedBlocks.push({
        id: 'block_special_woo',
        type: 'product_carousel',
        title: 'پیشنهادهای ویژه و منتخب فروشگاه',
        subtitle: `جدیدترین تجهیزات ${storeDisplayName} با قیمت زنده و موجودی انبار`,
        themeColor: config.theme?.primaryColor || '#ef394e',
        items: carouselItems,
      });
    }

    // Secondary Category Carousel (If a major category has >= 5 products)
    const majorCat = categories.find((c) => c.count >= 8);
    if (majorCat) {
      const majorCatProds = productItems
        .filter((p) => (p as any).categories?.includes(majorCat.name))
        .slice(0, 12);
      if (majorCatProds.length >= 3) {
        updatedBlocks.push({
          id: `block_cat_${majorCat.id}`,
          type: 'product_carousel',
          title: majorCat.name,
          subtitle: `پرفروش‌ترین‌های بخش ${majorCat.name}`,
          themeColor: '#008eb9',
          items: majorCatProds,
        });
      }
    }

    // Product Grid (Main Product Showcase)
    if (gridItems.length > 0) {
      updatedBlocks.push({
        id: 'block_grid_woo',
        type: 'product_grid',
        title: 'تمامی محصولات فروشگاه',
        items: gridItems,
      });
    }

    // 6. Update Project Metadata & Configuration
    config.blocks = updatedBlocks;
    config.categoriesList = categoryItems;
    if (!config.metadata) config.metadata = {};
    config.metadata.name = storeDisplayName;
    if (creds.siteUrl.includes('xiaomi')) {
      config.metadata.packageName = 'ir.xiaomismart.store';
    }
    if (!config.navigation) config.navigation = {};
    if (!config.navigation.appBar) config.navigation.appBar = {};
    config.navigation.appBar.searchPlaceholder = `جستجو در بین ${products.length} محصول ${storeDisplayName}...`;

    config.woocommerce = {
      enabled: true,
      siteUrl: creds.siteUrl,
      consumerKey: creds.consumerKey,
      consumerSecret: creds.consumerSecret,
    };

    if (!config.plugins) config.plugins = {};
    config.plugins.woocommerce = {
      enabled: true,
      settings: {
        siteUrl: creds.siteUrl,
        consumerKey: creds.consumerKey,
        consumerSecret: creds.consumerSecret,
        syncInterval: 15,
        lastSyncedAt: new Date().toISOString(),
        productsCount: products.length,
        categoriesCount: categories.length,
        storeName: storeDisplayName,
      },
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.project.update({
      where: { id: targetProjectId },
      data: {
        name: storeDisplayName,
        packageName: creds.siteUrl.includes('xiaomi') ? 'ir.xiaomismart.store' : project.packageName,
        configJson: JSON.stringify(config, null, 2),
      },
    });

    // Synchronize to mobile-core assets template
    try {
      const candidates = [
        path.resolve(process.cwd(), '../mobile-core/assets/config/app_config.json'),
        path.resolve(process.cwd(), 'apps/mobile-core/assets/config/app_config.json'),
      ];
      for (const p of candidates) {
        if (fs.existsSync(path.dirname(p))) {
          fs.writeFileSync(p, updated.configJson, 'utf-8');
          break;
        }
      }
    } catch (_) {}

    return reply.send({
      success: true,
      message: `همگام‌سازی با موفقیت انجام شد! ${products.length} محصول و ${categories.length} دسته‌بندی از سایت دریافت و روی ویترین اپلیکیشن قرار گرفت.`,
      storeName: testResult.storeName,
      productsCount: products.length,
      categoriesCount: categories.length,
      blocks: updatedBlocks,
      project: updated,
    });
  });

  // 7. Customer Synchronize & Profile
  server.post('/api/woocommerce/customer/sync', async (request, reply) => {
    const { siteUrl, consumerKey, consumerSecret, phone, name, email, address, city, postcode, projectId } = request.body as any;

    if (!phone) {
      return reply.status(400).send({ success: false, error: 'شماره موبایل الزامی است.' });
    }

    let creds: WooCredentials = {
      siteUrl: siteUrl || 'https://xiaomismart.ir',
      consumerKey: consumerKey || 'ck_dbddac7f3b85c3203bfd79ef0d829cb523899110',
      consumerSecret: consumerSecret || 'cs_12300c6b1e73129145873e5579c628e7a59f92fe',
    };

    if (projectId) {
      const proj = await prisma.project.findUnique({ where: { id: projectId } });
      if (proj) {
        try {
          const cfg = JSON.parse(proj.configJson);
          if (cfg.woocommerce?.siteUrl && cfg.woocommerce?.consumerKey) {
            creds = {
              siteUrl: cfg.woocommerce.siteUrl,
              consumerKey: cfg.woocommerce.consumerKey,
              consumerSecret: cfg.woocommerce.consumerSecret,
            };
          }
        } catch (_) {}
      }
    }

    const result = await WooCommerceService.syncCustomer(creds, {
      phone,
      name,
      email,
      address,
      city,
      postcode,
    });

    return reply.send(result);
  });

  // 8. Customer Order History
  server.get('/api/woocommerce/customer/orders', async (request, reply) => {
    const { siteUrl, consumerKey, consumerSecret, phone, customerId, projectId } = request.query as any;

    let creds: WooCredentials = {
      siteUrl: siteUrl || 'https://xiaomismart.ir',
      consumerKey: consumerKey || 'ck_dbddac7f3b85c3203bfd79ef0d829cb523899110',
      consumerSecret: consumerSecret || 'cs_12300c6b1e73129145873e5579c628e7a59f92fe',
    };

    if (projectId) {
      const proj = await prisma.project.findUnique({ where: { id: projectId } });
      if (proj) {
        try {
          const cfg = JSON.parse(proj.configJson);
          if (cfg.woocommerce?.siteUrl && cfg.woocommerce?.consumerKey) {
            creds = {
              siteUrl: cfg.woocommerce.siteUrl,
              consumerKey: cfg.woocommerce.consumerKey,
              consumerSecret: cfg.woocommerce.consumerSecret,
            };
          }
        } catch (_) {}
      }
    }

    const result = await WooCommerceService.getCustomerOrders(creds, {
      phone,
      customerId: customerId ? parseInt(customerId, 10) : undefined,
    });

    return reply.send(result);
  });

  // 9. Update Customer Profile
  server.put('/api/woocommerce/customer/profile', async (request, reply) => {
    const { siteUrl, consumerKey, consumerSecret, customerId, name, phone, address, city, postcode, projectId } = request.body as any;

    if (!customerId) {
      return reply.status(400).send({ success: false, error: 'شناسه مشتری الزامی است.' });
    }

    let creds: WooCredentials = {
      siteUrl: siteUrl || 'https://xiaomismart.ir',
      consumerKey: consumerKey || 'ck_dbddac7f3b85c3203bfd79ef0d829cb523899110',
      consumerSecret: consumerSecret || 'cs_12300c6b1e73129145873e5579c628e7a59f92fe',
    };

    if (projectId) {
      const proj = await prisma.project.findUnique({ where: { id: projectId } });
      if (proj) {
        try {
          const cfg = JSON.parse(proj.configJson);
          if (cfg.woocommerce?.siteUrl && cfg.woocommerce?.consumerKey) {
            creds = {
              siteUrl: cfg.woocommerce.siteUrl,
              consumerKey: cfg.woocommerce.consumerKey,
              consumerSecret: cfg.woocommerce.consumerSecret,
            };
          }
        } catch (_) {}
      }
    }

    const result = await WooCommerceService.updateCustomerProfile(creds, parseInt(customerId, 10), {
      name,
      phone,
      address,
      city,
      postcode,
    });

    return reply.send(result);
  });

  // 10. Fetch Live WordPress Blog Posts
  server.get('/api/wordpress/posts', async (request, reply) => {
    const { siteUrl, projectId, limit } = request.query as any;

    let targetSiteUrl = siteUrl;

    if (!targetSiteUrl && projectId) {
      try {
        const proj = await prisma.project.findUnique({ where: { id: projectId } });
        if (proj) {
          const cfg = JSON.parse(proj.configJson);
          targetSiteUrl = cfg.woocommerce?.siteUrl || cfg.wordpress?.siteUrl;
        }
      } catch (_) {}
    }

    if (!targetSiteUrl) {
      targetSiteUrl = 'https://xiaomismart.ir';
    }

    const maxPosts = limit ? parseInt(limit, 10) : 6;
    const posts = await WordPressService.fetchPosts(targetSiteUrl, maxPosts);

    return reply.send({
      success: true,
      siteUrl: targetSiteUrl,
      count: posts.length,
      posts,
    });
  });

  // 11. Hydrate Block Directly From WordPress / WooCommerce Live APIs
  server.post('/api/projects/:projectId/hydrate-block', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { blockType, siteUrl, consumerKey, consumerSecret, limit } = (request.body as any) || {};

    if (!blockType) {
      return reply.status(400).send({ success: false, error: 'پارامتر blockType ارسال نشده است.' });
    }

    let creds: WooCredentials = {
      siteUrl: siteUrl || '',
      consumerKey: consumerKey || '',
      consumerSecret: consumerSecret || '',
    };

    if ((!creds.siteUrl || !creds.consumerKey) && projectId) {
      try {
        const proj = await prisma.project.findUnique({ where: { id: projectId } });
        if (proj) {
          const cfg = JSON.parse(proj.configJson);
          if (cfg.woocommerce) {
            creds.siteUrl = creds.siteUrl || cfg.woocommerce.siteUrl || '';
            creds.consumerKey = creds.consumerKey || cfg.woocommerce.consumerKey || '';
            creds.consumerSecret = creds.consumerSecret || cfg.woocommerce.consumerSecret || '';
          }
          if (!creds.siteUrl && cfg.wordpress?.siteUrl) {
            creds.siteUrl = cfg.wordpress.siteUrl;
          }
        }
      } catch (_) {}
    }

    if (!creds.siteUrl || creds.siteUrl.trim() === '') {
      return reply.status(400).send({
        success: false,
        error: 'آدرس وب‌سایت وردپرس / ووکامرس برای این فروشگاه تنظیم نشده است. لطفاً ابتدا در تنظیمات فروشگاه، آدرس سایت را وارد کنید.',
      });
    }

    if (blockType !== 'blog_list' && (!creds.consumerKey || !creds.consumerSecret)) {
      return reply.status(400).send({
        success: false,
        error: 'کلیدهای اتصال به ووکامرس (Consumer Key و Consumer Secret) برای این فروشگاه تنظیم نشده است. لطفاً ابتدا در تب پلاگین‌ها کلیدهای API را مشخص کنید.',
      });
    }

    const sanitizedLimit = limit ? parseInt(limit, 10) : undefined;

    switch (blockType) {
      case 'blog_list': {
        const fetchResult = await WordPressService.fetchPostsWithMeta(creds.siteUrl, sanitizedLimit || 6);
        return reply.send({
          success: true,
          blockType: 'blog_list',
          title: 'آخرین مقالات و بررسی‌ها',
          items: fetchResult.posts,
          meta: {
            siteUrl: fetchResult.sourceUrl,
            source: fetchResult.isLive ? 'wordpress_rest_api' : 'fallback',
            isLive: fetchResult.isLive,
            error: fetchResult.isLive ? undefined : fetchResult.error,
            itemCount: fetchResult.posts.length,
          },
        });
      }

      case 'categories': {
        const categories = await WooCommerceService.getCategories(creds, sanitizedLimit || 8);
        const items = categories.map((c) => ({
          id: `c_${c.id}`,
          title: c.name,
          slug: c.slug,
          count: c.count,
          imageUrl: c.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop',
        }));

        return reply.send({
          success: true,
          blockType: 'categories',
          title: 'دسته‌بندی‌های سایت',
          items,
          meta: {
            siteUrl: creds.siteUrl,
            source: 'woocommerce_rest_api',
            itemCount: items.length,
          },
        });
      }

      case 'product_carousel':
      case 'product_grid': {
        const products = await WooCommerceService.getProducts(creds, 1, sanitizedLimit || 8);
        const items = products.map((p) => ({
          id: `p_${p.id}`,
          title: p.name,
          slug: p.slug,
          price: p.price,
          regularPrice: p.regularPrice,
          discountPercent: p.discountPercent,
          imageUrl: p.imageUrl,
          galleryImages: p.galleryImages,
          inStock: p.inStock,
          badge: p.discountPercent ? `${p.discountPercent}٪ تخفیف` : p.inStock ? 'موجود' : 'ناموجود',
        }));

        return reply.send({
          success: true,
          blockType,
          title: blockType === 'product_carousel' ? 'فروش ویژه سایت' : 'محصولات منتخب سایت',
          items,
          meta: {
            siteUrl: creds.siteUrl,
            source: 'woocommerce_rest_api',
            itemCount: items.length,
          },
        });
      }

      case 'coupon_card': {
        return reply.send({
          success: true,
          blockType: 'coupon_card',
          title: 'کد تخفیف اختصاصی اپلیکیشن',
          code: 'APP20',
          discount: '۲۰٪ تخفیف',
          desc: 'اعمال مستقیم روی سبد خرید برای کاربران اپلیکیشن',
          expiry: 'مهلت استفاده: تا پایان ماه جاری',
          meta: {
            siteUrl: creds.siteUrl,
            source: 'woocommerce_rest_api',
          },
        });
      }

      default:
        return reply.status(400).send({
          success: false,
          error: `نوع بلوک '${blockType}' قابلیت همگام‌سازی زنده با وردپرس ندارد.`,
        });
    }
  });
};
