import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';

export const dokanRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Ensure seed demo Dokan vendors exist
  const ensureSeedDemoVendors = async (projectId: string) => {
    const count = await prisma.dokanVendor.count({ where: { projectId } });
    if (count === 0) {
      await prisma.dokanVendor.createMany({
        data: [
          {
            projectId,
            storeName: 'بازرگانی شیائومی سنتر پایتخت',
            ownerName: 'حاج رضا کریمی',
            phone: '02188997766',
            email: 'karimi@xiaomicenter.ir',
            logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&h=150&fit=crop',
            bannerUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=300&fit=crop',
            rating: 4.9,
            isVerified: true,
            commissionRate: 8,
            totalSales: 485000000,
            address: 'تهران، خیابان جمهوری، تقاطع حافظ، مجتمع تجاری علاءالدین، طبقه همکف، پلاک ۴۲',
          },
          {
            projectId,
            storeName: 'دیجی‌می نمایندگی رسمی شمال‌غرب',
            ownerName: 'مهندس سعید صادقی',
            phone: '04133445566',
            email: 'sadeghi@digimi.ir',
            logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop',
            bannerUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=300&fit=crop',
            rating: 4.7,
            isVerified: true,
            commissionRate: 10,
            totalSales: 198000000,
            address: 'تبریز، میدان ساعت، برج بلور، طبقه ۳، واحد ۲',
          },
          {
            projectId,
            storeName: 'می استور اصفهان (اسمارت هوم)',
            ownerName: 'آریا رحیمی',
            phone: '03132211445',
            email: 'rahimi@mistore-isf.ir',
            logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&h=150&fit=crop',
            bannerUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=300&fit=crop',
            rating: 4.8,
            isVerified: true,
            commissionRate: 9,
            totalSales: 312000000,
            address: 'اصفهان، خیابان فردوسی، مجتمع تجاری کیش، واحد ۱۸',
          },
        ],
      });
    }
  };

  // 1. List All Vendors for Project
  server.get('/api/projects/:projectId/vendors', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    await ensureSeedDemoVendors(projectId);

    const vendors = await prisma.dokanVendor.findMany({
      where: { projectId },
      orderBy: { totalSales: 'desc' },
    });

    // Mock products count for each vendor
    const formatted = vendors.map((v, idx) => ({
      ...v,
      productsCount: idx === 0 ? 54 : (idx === 1 ? 31 : 42),
      formattedSales: `${(v.totalSales / 1000000).toLocaleString('fa-IR')} میلیون تومان`,
    }));

    return reply.send({ success: true, vendors: formatted });
  });

  // 2. Get Single Vendor Details with Catalog
  server.get('/api/projects/:projectId/vendors/:vendorId', async (request, reply) => {
    const { vendorId } = request.params as { vendorId: string };
    const vendor = await prisma.dokanVendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return reply.status(404).send({ success: false, error: 'غرفه فروشنده یافت نشد.' });
    }

    // Return vendor + sample products
    const sampleProducts = [
      {
        id: 101,
        title: 'گوشی موبایل شیائومی 14T Pro ظرفیت ۵۱۲ گیگابایت',
        price: 32900000,
        originalPrice: 35000000,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
        rating: 4.9,
        reviewsCount: 38,
        inStock: true,
        warranty: '۱۸ ماهه شرکتی هما تلکام',
      },
      {
        id: 102,
        title: 'ساعت هوشمند شیائومی Watch S3 با فریم قابل تعویض',
        price: 7850000,
        originalPrice: 8400000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        rating: 4.8,
        reviewsCount: 24,
        inStock: true,
        warranty: '۱۲ ماهه رایانه همراه',
      },
      {
        id: 103,
        title: 'هدفون بی‌سیم شیائومی Redmi Buds 5 Pro نویزکنسلینگ',
        price: 10600000,
        originalPrice: 11500000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        rating: 4.7,
        reviewsCount: 19,
        inStock: true,
        warranty: '۶ ماهه گارانتی طلایی',
      },
      {
        id: 104,
        title: 'جاروبرقی رباتیک شیائومی Mijia Omni با قابلیت شستشو',
        price: 38500000,
        originalPrice: 42000000,
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&h=300&fit=crop',
        rating: 4.9,
        reviewsCount: 45,
        inStock: true,
        warranty: '۱۸ ماهه رسمی میجیا',
      },
    ];

    return reply.send({
      success: true,
      vendor: {
        ...vendor,
        productsCount: sampleProducts.length,
        products: sampleProducts,
      },
    });
  });

  // 3. Create or Update Vendor
  server.post('/api/projects/:projectId/vendors', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { id, storeName, ownerName, phone, email, logoUrl, bannerUrl, address, commissionRate } =
      request.body as {
        id?: string;
        storeName: string;
        ownerName: string;
        phone: string;
        email?: string;
        logoUrl?: string;
        bannerUrl?: string;
        address?: string;
        commissionRate?: number;
      };

    if (!storeName || !phone) {
      return reply.status(400).send({ success: false, error: 'نام فروشگاه و تلفن الزامی است.' });
    }

    let vendor;
    if (id) {
      vendor = await prisma.dokanVendor.update({
        where: { id },
        data: {
          storeName,
          ownerName,
          phone,
          email: email || null,
          logoUrl: logoUrl || null,
          bannerUrl: bannerUrl || null,
          address: address || null,
          commissionRate: commissionRate || 10,
        },
      });
    } else {
      vendor = await prisma.dokanVendor.create({
        data: {
          projectId,
          storeName,
          ownerName,
          phone,
          email: email || null,
          logoUrl: logoUrl || null,
          bannerUrl: bannerUrl || null,
          address: address || null,
          commissionRate: commissionRate || 10,
        },
      });
    }

    return reply.send({
      success: true,
      message: 'مشخصات غرفه‌دار دکان با موفقیت ثبت گردید.',
      vendor,
    });
  });

  // 4. Toggle Vendor Verification Badge
  server.put('/api/projects/:projectId/vendors/:vendorId/toggle-verified', async (request, reply) => {
    const { vendorId } = request.params as { vendorId: string };
    const current = await prisma.dokanVendor.findUnique({ where: { id: vendorId } });
    if (!current) {
      return reply.status(404).send({ success: false, error: 'فروشنده یافت نشد.' });
    }

    const updated = await prisma.dokanVendor.update({
      where: { id: vendorId },
      data: { isVerified: !current.isVerified },
    });

    return reply.send({
      success: true,
      message: updated.isVerified
        ? 'نشان اصالت و غرفه‌دار برگزیده فعال گردید.'
        : 'نشان اصالت غیرفعال شد.',
      isVerified: updated.isVerified,
    });
  });
};
