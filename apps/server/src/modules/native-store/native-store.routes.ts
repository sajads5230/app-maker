import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';

export const nativeStoreRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {

  // Helper to format a NativeProduct into a standard format compatible with both Web and Mobile apps
  const formatProduct = (p: any) => {
    let galleryUrls: string[] = [];
    try {
      if (p.gallery) {
        galleryUrls = typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery;
      }
    } catch {
      galleryUrls = [];
    }

    const images = [];
    if (p.featuredImage) {
      images.push({ id: 1, src: p.featuredImage });
    }
    galleryUrls.forEach((url, idx) => {
      if (url && url !== p.featuredImage) {
        images.push({ id: idx + 2, src: url });
      }
    });

    let attributesObj = {};
    try {
      if (p.attributes) {
        attributesObj = typeof p.attributes === 'string' ? JSON.parse(p.attributes) : p.attributes;
      }
    } catch {
      attributesObj = {};
    }

    const regular = p.regularPrice || p.price;
    const current = p.price;
    let discountPercent = 0;
    if (regular > current && regular > 0) {
      discountPercent = Math.round(((regular - current) / regular) * 100);
    }

    return {
      id: p.id,
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
      price: current.toString(),
      regular_price: regular.toString(),
      sale_price: p.salePrice ? p.salePrice.toString() : (discountPercent > 0 ? current.toString() : ''),
      discount_percent: discountPercent,
      on_sale: discountPercent > 0 || p.isSpecialOffer,
      featured: p.isFeatured,
      is_special_offer: p.isSpecialOffer,
      stock_status: (p.stockStatus || 'INSTOCK').toLowerCase(),
      stock_quantity: p.stockQuantity ?? 10,
      description: p.description || '',
      short_description: p.shortDesc || '',
      average_rating: (p.rating || 5.0).toFixed(1),
      rating_count: p.ratingCount || 1,
      total_sales: p.totalSales || 0,
      images: images.length > 0 ? images : [{ id: 1, src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' }],
      categories: p.category ? [{ id: p.category.id, name: p.category.name, slug: p.category.slug }] : [],
      attributes: attributesObj,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  };

  // ==========================================
  // 1. STORE OVERVIEW & KPIS
  // ==========================================
  server.get('/api/projects/:projectId/store/overview', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };

    try {
      const [productsCount, categoriesCount, ordersCount, outOfStockCount, orders] = await Promise.all([
        prisma.nativeProduct.count({ where: { projectId } }),
        prisma.nativeCategory.count({ where: { projectId } }),
        prisma.nativeOrder.count({ where: { projectId } }),
        prisma.nativeProduct.count({ where: { projectId, stockStatus: 'OUTOFSTOCK' } }),
        prisma.nativeOrder.findMany({
          where: { projectId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { items: true },
        }),
      ]);

      // Calculate total revenue from completed/processing orders
      const revenueAggr = await prisma.nativeOrder.aggregate({
        where: { projectId, status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { totalAmount: true },
      });

      return reply.send({
        success: true,
        overview: {
          totalProducts: productsCount,
          totalCategories: categoriesCount,
          totalOrders: ordersCount,
          outOfStockCount,
          totalRevenue: revenueAggr._sum.totalAmount || 0,
          recentOrders: orders,
        },
      });
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 2. CATEGORIES (CRUD)
  // ==========================================
  server.get('/api/projects/:projectId/store/categories', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };

    try {
      const categories = await prisma.nativeCategory.findMany({
        where: { projectId },
        orderBy: { order: 'asc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });

      const formatted = categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon || 'tag',
        image: c.image || '',
        order: c.order,
        count: c._count.products,
      }));

      return reply.send({ success: true, categories: formatted });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  server.post('/api/projects/:projectId/store/categories', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { name, slug, icon, image, order } = request.body as any;

    if (!name) {
      return reply.status(400).send({ success: false, error: 'نام دسته‌بندی الزامی است.' });
    }

    try {
      const category = await prisma.nativeCategory.create({
        data: {
          projectId,
          name,
          slug: slug || name.trim().toLowerCase().replace(/\s+/g, '-'),
          icon: icon || 'tag',
          image: image || null,
          order: typeof order === 'number' ? order : 0,
        },
      });

      return reply.send({ success: true, category });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  server.put('/api/projects/:projectId/store/categories/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, slug, icon, image, order } = request.body as any;

    try {
      const category = await prisma.nativeCategory.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
          ...(icon !== undefined && { icon }),
          ...(image !== undefined && { image }),
          ...(order !== undefined && { order }),
        },
      });

      return reply.send({ success: true, category });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  server.delete('/api/projects/:projectId/store/categories/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.nativeCategory.delete({ where: { id } });
      return reply.send({ success: true, message: 'دسته‌بندی با موفقیت حذف شد.' });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 3. PRODUCTS (CRUD & LISTING)
  // ==========================================
  server.get('/api/projects/:projectId/store/products', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const query = request.query as any;

    const page = parseInt(query.page || '1', 10);
    const perPage = parseInt(query.perPage || query.per_page || '20', 10);
    const categoryId = query.categoryId || query.category;
    const search = query.search?.toString().trim();
    const onSale = query.onSale === 'true' || query.on_sale === 'true';
    const featured = query.featured === 'true';
    const specialOffer = query.specialOffer === 'true' || query.is_special_offer === 'true';

    try {
      const where: any = { projectId };

      if (categoryId) {
        where.categoryId = categoryId;
      }
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { shortDesc: { contains: search } },
        ];
      }
      if (onSale) {
        where.OR = [{ isSpecialOffer: true }, { salePrice: { not: null } }];
      }
      if (featured) {
        where.isFeatured = true;
      }
      if (specialOffer) {
        where.isSpecialOffer = true;
      }

      let orderBy: any = { createdAt: 'desc' };
      if (query.orderby === 'price' || query.orderBy === 'price') {
        orderBy = { price: query.order === 'asc' ? 'asc' : 'desc' };
      } else if (query.orderby === 'popularity' || query.orderBy === 'popularity') {
        orderBy = { totalSales: 'desc' };
      } else if (query.orderby === 'rating' || query.orderBy === 'rating') {
        orderBy = { rating: 'desc' };
      }

      const [total, products] = await Promise.all([
        prisma.nativeProduct.count({ where }),
        prisma.nativeProduct.findMany({
          where,
          include: { category: true },
          orderBy,
          skip: (page - 1) * perPage,
          take: perPage,
        }),
      ]);

      const formatted = products.map(formatProduct);

      // Return both array format (for WooCommerceService compatibility) and structured object
      return reply.send(formatted);
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  server.get('/api/projects/:projectId/store/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const product = await prisma.nativeProduct.findUnique({
        where: { id },
        include: { category: true },
      });

      if (!product) {
        return reply.status(404).send({ success: false, error: 'محصول یافت نشد.' });
      }

      return reply.send(formatProduct(product));
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  server.post('/api/projects/:projectId/store/products', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const body = request.body as any;

    if (!body.name || body.price === undefined) {
      return reply.status(400).send({ success: false, error: 'نام و قیمت محصول الزامی است.' });
    }

    try {
      const price = parseInt(body.price, 10);
      const regularPrice = body.regularPrice ? parseInt(body.regularPrice, 10) : price;
      const salePrice = body.salePrice ? parseInt(body.salePrice, 10) : null;
      const stockQuantity = body.stockQuantity !== undefined ? parseInt(body.stockQuantity, 10) : 10;
      const stockStatus = stockQuantity > 0 ? (body.stockStatus || 'INSTOCK') : 'OUTOFSTOCK';

      let galleryJson = null;
      if (Array.isArray(body.gallery)) {
        galleryJson = JSON.stringify(body.gallery);
      } else if (typeof body.gallery === 'string') {
        galleryJson = body.gallery;
      }

      let attributesJson = null;
      if (body.attributes && typeof body.attributes === 'object') {
        attributesJson = JSON.stringify(body.attributes);
      } else if (typeof body.attributes === 'string') {
        attributesJson = body.attributes;
      }

      const product = await prisma.nativeProduct.create({
        data: {
          projectId,
          name: body.name.trim(),
          slug: (body.slug || body.name).trim().toLowerCase().replace(/\s+/g, '-'),
          price,
          regularPrice,
          salePrice,
          stockQuantity,
          stockStatus,
          featuredImage: body.featuredImage || body.imageUrl || null,
          gallery: galleryJson,
          description: body.description || '',
          shortDesc: body.shortDesc || body.shortDescription || '',
          categoryId: body.categoryId || null,
          isFeatured: Boolean(body.isFeatured),
          isSpecialOffer: Boolean(body.isSpecialOffer),
          attributes: attributesJson,
          rating: body.rating ? parseFloat(body.rating) : 5.0,
        },
        include: { category: true },
      });

      return reply.send({ success: true, product: formatProduct(product) });
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  server.put('/api/projects/:projectId/store/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    try {
      const updateData: any = {};
      if (body.name) updateData.name = body.name.trim();
      if (body.slug) updateData.slug = body.slug.trim().toLowerCase().replace(/\s+/g, '-');
      if (body.price !== undefined) updateData.price = parseInt(body.price, 10);
      if (body.regularPrice !== undefined) updateData.regularPrice = parseInt(body.regularPrice, 10);
      if (body.salePrice !== undefined) updateData.salePrice = body.salePrice ? parseInt(body.salePrice, 10) : null;
      if (body.stockQuantity !== undefined) {
        updateData.stockQuantity = parseInt(body.stockQuantity, 10);
        updateData.stockStatus = updateData.stockQuantity > 0 ? 'INSTOCK' : 'OUTOFSTOCK';
      }
      if (body.stockStatus) updateData.stockStatus = body.stockStatus;
      if (body.featuredImage !== undefined) updateData.featuredImage = body.featuredImage;
      if (body.imageUrl !== undefined) updateData.featuredImage = body.imageUrl;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.shortDesc !== undefined) updateData.shortDesc = body.shortDesc;
      if (body.categoryId !== undefined) updateData.categoryId = body.categoryId || null;
      if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
      if (body.isSpecialOffer !== undefined) updateData.isSpecialOffer = Boolean(body.isSpecialOffer);
      if (body.gallery !== undefined) {
        updateData.gallery = Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : body.gallery;
      }
      if (body.attributes !== undefined) {
        updateData.attributes = typeof body.attributes === 'object' ? JSON.stringify(body.attributes) : body.attributes;
      }

      const product = await prisma.nativeProduct.update({
        where: { id },
        data: updateData,
        include: { category: true },
      });

      return reply.send({ success: true, product: formatProduct(product) });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  server.delete('/api/projects/:projectId/store/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.nativeProduct.delete({ where: { id } });
      return reply.send({ success: true, message: 'محصول با موفقیت حذف شد.' });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 4. BULK SEED DEMO STORE (ONE-CLICK POPULATE)
  // ==========================================
  server.post('/api/projects/:projectId/store/seed-demo', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };

    try {
      // 1. Create Default Categories
      const categoriesData = [
        { name: 'گوشی موبایل', slug: 'smartphones', icon: 'smartphone', order: 1 },
        { name: 'ساعت و مچ‌بند هوشمند', slug: 'smartwatches', icon: 'watch', order: 2 },
        { name: 'هدفون و هندزفری', slug: 'headphones', icon: 'headphones', order: 3 },
        { name: 'لوازم جانبی و پاوربانک', slug: 'accessories', icon: 'battery-charging', order: 4 },
      ];

      const createdCats = [];
      for (const cat of categoriesData) {
        const existing = await prisma.nativeCategory.findFirst({
          where: { projectId, slug: cat.slug },
        });
        if (existing) {
          createdCats.push(existing);
        } else {
          const c = await prisma.nativeCategory.create({
            data: { projectId, ...cat },
          });
          createdCats.push(c);
        }
      }

      const [catPhone, catWatch, catAudio, catAcc] = createdCats;

      // 2. Sample Products with Iranian market pricing (in Tomans)
      const demoProducts = [
        {
          name: 'گوشی شیائومی Redmi Note 13 Pro 5G',
          slug: 'redmi-note-13-pro-5g',
          price: 18500000,
          regularPrice: 20000000,
          salePrice: 18500000,
          stockQuantity: 15,
          featuredImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
          description: 'دوربین ۲۰۰ مگاپیکسلی با لرزشگیر اپتیکال، صفحه‌نمایش AMOLED با رفرش‌ریت ۱۲۰ هرتز و شارژ سریع ۶۷ واتی با گارانتی ۱۸ ماهه رسمی.',
          shortDesc: 'حافظه ۵۱۲ گیگابایت، رم ۱۲، دوربین ۲۰۰ مگاپیکسل',
          categoryId: catPhone?.id,
          isFeatured: true,
          isSpecialOffer: true,
          rating: 4.9,
          ratingCount: 42,
          totalSales: 130,
        },
        {
          name: 'ساعت هوشمند شیائومی Watch S3',
          slug: 'xiaomi-watch-s3',
          price: 6450000,
          regularPrice: 7200000,
          salePrice: 6450000,
          stockQuantity: 25,
          featuredImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
          description: 'بزل قابل تعویض با سیستم‌عامل HyperOS، شارژدهی فوق‌العاده ۱۵ روزه و سنسورهای پایش سلامت و ضربان قلب پیشرفته.',
          shortDesc: 'نمایشگر AMOLED، باتری ۱۵ روز، ضدآب ۵۰ متر',
          categoryId: catWatch?.id,
          isFeatured: true,
          isSpecialOffer: true,
          rating: 4.8,
          ratingCount: 29,
          totalSales: 85,
        },
        {
          name: 'هدفون بی‌سیم شیائومی Redmi Buds 5 Pro',
          slug: 'redmi-buds-5-pro',
          price: 3250000,
          regularPrice: 3800000,
          salePrice: 3250000,
          stockQuantity: 40,
          featuredImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
          description: 'حذف نویز فعال تا ۵۲ دسی‌بل با کدک صوتی Hi-Res LDAC و شارژدهی ۳۸ ساعته با کیس شارژ.',
          shortDesc: 'حذف نویز ۵۲dB، تفکیک صدای استودیویی، بلوتوث ۵.۳',
          categoryId: catAudio?.id,
          isFeatured: true,
          isSpecialOffer: false,
          rating: 4.7,
          ratingCount: 56,
          totalSales: 210,
        },
        {
          name: 'پاوربانک ۲۰۰۰۰ میلی‌آمپر شیائومی ۵۰ وات',
          slug: 'xiaomi-powerbank-20000-50w',
          price: 2150000,
          regularPrice: 2450000,
          salePrice: 2150000,
          stockQuantity: 30,
          featuredImage: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&q=80',
          description: 'شارژ سریع ۵۰ واتی با قابلیت شارژ لپ‌تاپ‌های Type-C و شارژ همزمان ۳ دستگاه با بالاترین استانداردهای ایمنی.',
          shortDesc: 'توان خروجی ۵۰W، ظرفیت ۲۰۰۰۰mAh، درگاه تایپ‌سی پرسرعت',
          categoryId: catAcc?.id,
          isFeatured: false,
          isSpecialOffer: true,
          rating: 4.8,
          ratingCount: 38,
          totalSales: 160,
        },
        {
          name: 'گوشی پرچمدار شیائومی ۱۴ اولترا (Xiaomi 14 Ultra)',
          slug: 'xiaomi-14-ultra',
          price: 74900000,
          regularPrice: 79000000,
          salePrice: 74900000,
          stockQuantity: 8,
          featuredImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
          description: 'دوربین ۴ گانه ۵۰ مگاپیکسلی با لنز لایکا و حسگر ۱ اینچی سونی LYT-900، تراشه Snapdragon 8 Gen 3 و نمایشگر 2K AMOLED.',
          shortDesc: 'دوربین شاهکار لایکا ۱ اینچی، اسنپدراگون نسل ۳، شارژ ۹۰W',
          categoryId: catPhone?.id,
          isFeatured: true,
          isSpecialOffer: false,
          rating: 5.0,
          ratingCount: 18,
          totalSales: 45,
        },
      ];

      const inserted = [];
      for (const p of demoProducts) {
        const existing = await prisma.nativeProduct.findFirst({
          where: { projectId, slug: p.slug },
        });
        if (!existing) {
          const item = await prisma.nativeProduct.create({
            data: { projectId, ...p },
            include: { category: true },
          });
          inserted.push(formatProduct(item));
        } else {
          inserted.push(formatProduct(existing));
        }
      }

      return reply.send({
        success: true,
        message: 'محصولات و دسته‌بندی‌های نمونه با موفقیت در فروشگاه مستقل ثبت شدند.',
        count: inserted.length,
        products: inserted,
      });
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 5. ORDERS (SUBMIT & TRACKING)
  // ==========================================
  server.get('/api/projects/:projectId/store/orders', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { status, phone, page = '1', perPage = '20' } = request.query as any;

    try {
      const where: any = { projectId };
      if (status) where.status = status;
      if (phone) where.customerPhone = { contains: phone };

      const skip = (parseInt(page, 10) - 1) * parseInt(perPage, 10);
      const [total, orders] = await Promise.all([
        prisma.nativeOrder.count({ where }),
        prisma.nativeOrder.findMany({
          where,
          include: { items: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(perPage, 10),
        }),
      ]);

      return reply.send({
        success: true,
        total,
        orders,
      });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  server.post('/api/projects/:projectId/store/orders', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const body = request.body as any;

    const { customerName, customerPhone, customerAddress, postalCode, items, paymentMethod = 'ZARINPAL', notes } = body;

    if (!customerPhone || !customerAddress || !Array.isArray(items) || items.length === 0) {
      return reply.status(400).send({
        success: false,
        error: 'شماره تلفن، آدرس تحویل و حداقل یک قلم کالا الزامی است.',
      });
    }

    try {
      // 1. Calculate total and verify items
      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of items) {
        let product: any = null;
        if (item.productId) {
          product = await prisma.nativeProduct.findUnique({ where: { id: item.productId } });
        }

        const unitPrice = product ? product.price : (item.unitPrice || 0);
        const qty = item.quantity || 1;
        const lineTotal = unitPrice * qty;
        totalAmount += lineTotal;

        orderItemsData.push({
          productId: product ? product.id : null,
          productName: product ? product.name : (item.productName || 'کالای سفارشی'),
          productImage: product ? product.featuredImage : null,
          quantity: qty,
          unitPrice,
          totalPrice: lineTotal,
        });

        // Deduct inventory if product exists
        if (product && product.stockQuantity > 0) {
          const newQty = Math.max(0, product.stockQuantity - qty);
          await prisma.nativeProduct.update({
            where: { id: product.id },
            data: {
              stockQuantity: newQty,
              stockStatus: newQty > 0 ? 'INSTOCK' : 'OUTOFSTOCK',
              totalSales: (product.totalSales || 0) + qty,
            },
          });
        }
      }

      // Generate Persian Order Number (e.g. ORD-1403-94821)
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `ORD-1403-${randomSuffix}`;

      const order = await prisma.nativeOrder.create({
        data: {
          projectId,
          orderNumber,
          customerName: customerName || 'مشتری فروشگاه',
          customerPhone,
          customerAddress,
          postalCode: postalCode || null,
          totalAmount,
          status: 'PROCESSING',
          paymentMethod,
          paymentStatus: 'PAID',
          trackingCode: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
          notes: notes || null,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      return reply.send({
        success: true,
        message: 'سفارش شما با موفقیت ثبت شد و در حال پردازش است.',
        orderNumber: order.orderNumber,
        trackingCode: order.trackingCode,
        order,
      });
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  server.put('/api/projects/:projectId/store/orders/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status, trackingCode, paymentStatus } = request.body as any;

    try {
      const order = await prisma.nativeOrder.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(trackingCode !== undefined && { trackingCode }),
          ...(paymentStatus && { paymentStatus }),
        },
        include: { items: true },
      });

      return reply.send({ success: true, order });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 6. WOOCOMMERCE REST API v3 COMPATIBILITY ADAPTER
  // Allows any Flutter / Mobile client to consume the Standalone Store
  // seamlessly using standard /wp-json/wc/v3 endpoints!
  // ==========================================
  server.get('/wp-json/wc/v3/products', async (request, reply) => {
    const query = request.query as any;
    const projectId = query.projectId || 'app-demo-techmarket';

    const page = parseInt(query.page || '1', 10);
    const perPage = parseInt(query.per_page || query.perPage || '20', 10);
    const categoryId = query.category || query.categoryId;
    const search = query.search?.toString().trim();
    const onSale = query.on_sale === 'true' || query.onSale === 'true';
    const featured = query.featured === 'true';

    try {
      const where: any = { projectId };
      if (categoryId) where.categoryId = categoryId;
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
        ];
      }
      if (onSale) {
        where.OR = [{ isSpecialOffer: true }, { salePrice: { not: null } }];
      }
      if (featured) where.isFeatured = true;

      const products = await prisma.nativeProduct.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      });

      return reply.send(products.map(formatProduct));
    } catch (err: any) {
      server.log.error(err);
      return reply.send([]);
    }
  });

  server.get('/wp-json/wc/v3/products/categories', async (request, reply) => {
    const query = request.query as any;
    const projectId = query.projectId || 'app-demo-techmarket';

    try {
      const categories = await prisma.nativeCategory.findMany({
        where: { projectId },
        orderBy: { order: 'asc' },
        include: { _count: { select: { products: true } } },
      });

      const formatted = categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c._count.products,
        image: c.image ? { src: c.image } : null,
      }));

      return reply.send(formatted);
    } catch (err: any) {
      return reply.send([]);
    }
  });

  server.get('/wp-json/wc/v3/coupons', async (request, reply) => {
    const query = request.query as any;
    const code = (query.code || '').toUpperCase().trim();

    if (code === 'WELCOME50') {
      return reply.send([
        {
          id: 101,
          code: 'WELCOME50',
          amount: '50000',
          discount_type: 'fixed_cart',
          description: 'کد تخفیف ۵۰ هزار تومانی خوش‌آمدگویی',
        },
      ]);
    } else if (code === 'WHEEL10') {
      return reply.send([
        {
          id: 102,
          code: 'WHEEL10',
          amount: '10',
          discount_type: 'percent',
          description: 'تخفیف ۱۰ درصدی گردونه شانس',
        },
      ]);
    }

    return reply.send([]);
  });

  server.post('/wp-json/wc/v3/orders', async (request, reply) => {
    const query = request.query as any;
    const projectId = query.projectId || 'app-demo-techmarket';
    const body = request.body as any;

    const billing = body.billing || {};
    const lineItems = body.line_items || [];

    const customerName = `${billing.first_name || ''} ${billing.last_name || ''}`.trim() || 'مشتری اپلیکیشن';
    const customerPhone = billing.phone || '09120000000';
    const customerAddress = `${billing.city || ''} ${billing.address_1 || ''}`.trim() || 'ثبت شده در اپلیکیشن';

    let total = 0;
    const orderItemsData: any[] = [];
    for (const item of lineItems) {
      const qty = item.quantity || 1;
      const unit = parseFloat(item.price || item.total || '0') / qty;
      const sub = unit * qty;
      total += sub;
      orderItemsData.push({
        productName: item.name || 'کالای سفارشی',
        quantity: qty,
        unitPrice: Math.round(unit),
        totalPrice: Math.round(sub),
      });
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORD-1403-${randomSuffix}`;

    try {
      const order = await prisma.nativeOrder.create({
        data: {
          projectId,
          orderNumber,
          customerName,
          customerPhone,
          customerAddress,
          totalAmount: total,
          status: 'PROCESSING',
          paymentMethod: body.payment_method || 'ZARINPAL',
          paymentStatus: 'PAID',
          trackingCode: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
          items: {
            create: orderItemsData,
          },
        },
      });

      return reply.send({
        id: order.id,
        number: order.orderNumber,
        status: 'processing',
        total: order.totalAmount.toString(),
        currency: 'IRT',
      });
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ error: err.message });
    }
  });
};
