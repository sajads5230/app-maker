import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';

interface AiGenerateRequest {
  businessName: string;
  niche?: string;
  description?: string;
  style?: 'modern_dark' | 'luxury_gold' | 'clean_minimal' | 'vibrant_warm';
  features?: string[];
  userId?: string;
}

export const aiGeneratorRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post('/api/projects/ai-generate', async (request, reply) => {
    const body = request.body as AiGenerateRequest;
    const businessName = body.businessName?.trim() || 'فروشگاه هوشمند من';
    const niche = body.niche || 'custom';
    const style = body.style || 'clean_minimal';
    const features = body.features || ['loyalty_rewards', 'booking_form', 'story_circles'];

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
    let primaryColor = '#E11D48';
    let secondaryColor = '#BE123C';
    let accentColor = '#FDA4AF';
    let isDarkMode = false;

    if (style === 'modern_dark') {
      primaryColor = '#8B5CF6'; // Purple
      secondaryColor = '#6D28D9';
      accentColor = '#C4B5FD';
      isDarkMode = true;
    } else if (style === 'luxury_gold') {
      primaryColor = '#D97706'; // Gold/Amber
      secondaryColor = '#B45309';
      accentColor = '#FDE68A';
      isDarkMode = true;
    } else if (style === 'vibrant_warm') {
      primaryColor = '#EA580C'; // Warm Orange
      secondaryColor = '#C2410C';
      accentColor = '#FDBA74';
      isDarkMode = false;
    } else {
      // Clean minimal
      if (niche === 'clinic') primaryColor = '#0284C7';
      else if (niche === 'petshop') primaryColor = '#059669';
      else if (niche === 'food') primaryColor = '#E11D48';
      else primaryColor = '#2563EB';
    }

    // 2. Package Name Generator
    const cleanLatinName = businessName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '') || 'app';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const packageName = `ir.${cleanLatinName || 'store'}.app${randomSuffix}`;

    // 3. Blocks Synthesis based on Niche
    const blocks: any[] = [];

    // Block 1: Story Circles
    if (features.includes('story_circles') || true) {
      blocks.push({
        id: 'block_ai_stories',
        type: 'story_circles',
        title: 'استوری‌های برگزیده',
        items: [
          {
            id: 's1',
            title: 'جدیدترین‌ها',
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
            seen: false,
          },
          {
            id: 's2',
            title: 'حراج ویژه',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
            seen: false,
          },
          {
            id: 's3',
            title: 'رضایت مشتریان',
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
            seen: true,
          },
          {
            id: 's4',
            title: 'راهنمای خرید',
            imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
            seen: true,
          },
        ],
      });
    }

    // Block 2: Hero Banner Slider
    blocks.push({
      id: 'block_ai_hero_slider',
      type: 'banner_slider',
      height: 190,
      autoPlay: true,
      items: [
        {
          id: 'b1',
          title: `جشنواره افتتاحیه ${businessName}`,
          subtitle: 'تا ۴۰٪ تخفیف ویژه سفارش اول با کد هدیه: WELCOME',
          imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&h=450&fit=crop',
          linkType: 'category',
          target: 'cat_all',
        },
        {
          id: 'b2',
          title: 'ارسال اکسپرس و ضمانت اصالت ۱۰۰٪',
          subtitle: 'تحویل سریع درب منزل با بسته‌بندی ویژه و بیمه کامل کالا',
          imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1000&h=450&fit=crop',
          linkType: 'coupon',
          target: 'FAST_DELIVERY',
        },
      ],
    });

    // Block 3: Category Grid
    blocks.push({
      id: 'block_ai_categories',
      type: 'category_grid',
      title: 'دسته‌بندی‌های محبوب',
      columns: 4,
      items: [
        {
          id: 'c1',
          name: 'پرفروش‌ترین‌ها',
          iconUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=120&h=120&fit=crop',
        },
        {
          id: 'c2',
          name: 'کالای سفارشی',
          iconUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=120&h=120&fit=crop',
        },
        {
          id: 'c3',
          name: 'پیشنهاد شگفت‌انگیز',
          iconUrl: 'https://images.unsplash.com/photo-1507764923504-cd90bf7da772?w=120&h=120&fit=crop',
        },
        {
          id: 'c4',
          name: 'تخفیف‌دارها',
          iconUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=120&h=120&fit=crop',
        },
      ],
    });

    // Block 4: Flash Sale Countdown Banner
    blocks.push({
      id: 'block_ai_countdown',
      type: 'countdown_banner',
      title: '⚡ فروش ویژه ۲۴ ساعته',
      subtitle: 'فرصت محدود برای خرید محصولات منتخب با بیشترین تخفیف',
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      backgroundColor: primaryColor,
    });

    // Block 5: Featured Products Carousel
    blocks.push({
      id: 'block_ai_products',
      type: 'product_carousel',
      title: `محبوب‌ترین‌های ${businessName}`,
      items: [
        {
          id: 'p1',
          name: `محصول پریمیوم کالکشن ${businessName}`,
          price: 1850000,
          originalPrice: 2200000,
          discountPercent: 16,
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          rating: 4.9,
          inStock: true,
        },
        {
          id: 'p2',
          name: 'پکیج هدیه و بسته‌بندی تشریفاتی',
          price: 950000,
          originalPrice: 1200000,
          discountPercent: 20,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          rating: 4.8,
          inStock: true,
        },
        {
          id: 'p3',
          name: 'نسخه ارتقایافته با گارانتی طلایی',
          price: 3400000,
          originalPrice: 3800000,
          discountPercent: 10,
          imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
          rating: 4.7,
          inStock: true,
        },
      ],
    });

    // Block 6: Dokan Multi-Vendor Carousel (if enabled)
    if (features.includes('marketplace')) {
      blocks.push({
        id: 'block_ai_vendors',
        type: 'featured_vendors',
        title: 'غرفه‌ها و فروشندگان برگزیده',
      });
    }

    // Block 7: Loyalty Rewards Card (if enabled)
    if (features.includes('loyalty_rewards')) {
      blocks.push({
        id: 'block_ai_loyalty',
        type: 'loyalty_card',
        title: 'باشگاه مشتریان و کیف پول هدیه',
      });
    }

    // Block 8: Interactive Custom Form (Inquiry / Booking / Warranty)
    if (features.includes('booking_form') || true) {
      blocks.push({
        id: 'block_ai_form',
        type: 'custom_form',
        title: `ثبت درخواست مشاوره و خدمات ${businessName}`,
        description: 'کارشناسان ما ظرف کمتر از ۲ ساعت با شما تماس خواهند گرفت.',
        fields: [
          {
            id: 'f_name',
            type: 'text',
            label: 'نام و نام خانوادگی:',
            placeholder: 'مثال: علی احمدی',
            required: true,
          },
          {
            id: 'f_phone',
            type: 'tel',
            label: 'شماره موبایل جهت هماهنگی:',
            placeholder: '۰۹۱۲۳۴۵۶۷۸۹',
            required: true,
          },
          {
            id: 'f_topic',
            type: 'select',
            label: 'موضوع درخواست:',
            options: ['مشاوره قبل از خرید', 'سفارش عمده / سازمانی', 'پشتیبانی و گارانتی'],
            required: true,
          },
          {
            id: 'f_notes',
            type: 'textarea',
            label: 'توضیحات تکمیلی:',
            placeholder: 'هرگونه نکته یا سوالی دارید اینجا بنویسید...',
            required: false,
          },
        ],
        submitButtonText: 'ارسال درخواست آنلاین',
        successMessage: 'درخواست شما با موفقیت ثبت شد. کد پیگیری برای شما پیامک خواهد شد.',
      });
    }

    // Block 9: Trust Badges
    blocks.push({
      id: 'block_ai_trust',
      type: 'trust_badges',
      badges: [
        { icon: 'shield', title: 'ضمانت بازگشت وجه', subtitle: 'تا ۷ روز بی‌قید و شرط' },
        { icon: 'truck', title: 'ارسال اکسپرس', subtitle: 'تحویل سریع سراسر کشور' },
        { icon: 'credit-card', title: 'پرداخت امن شتاب', subtitle: 'درگاه رسمی شاپرک' },
        { icon: 'headphones', title: 'پشتیبانی ۲۴/۷', subtitle: 'پاسخگویی آنلاین در اپ' },
      ],
    });

    // 4. Server-Driven UI Full Config JSON
    const config = {
      appName: businessName,
      packageName,
      version: '1.0.0',
      theme: {
        primaryColor,
        secondaryColor,
        accentColor,
        isDarkMode,
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
      blocks,
    };

    // 5. Create Project Record in Database
    const project = await prisma.project.create({
      data: {
        userId: targetUserId,
        name: businessName,
        packageName,
        version: '1.0.0',
        configJson: JSON.stringify(config),
      },
    });

    // 6. Seed Default App Update Config
    await prisma.appUpdateConfig.create({
      data: {
        projectId: project.id,
        latestVersion: '1.0.0',
        minVersion: '1.0.0',
        forceUpdate: false,
        changelog: `• رونمایی و انتشار نسخه ۱.۰.۰ اپلیکیشن رسمی ${businessName}`,
      },
    });

    // 7. Seed Default Dokan Vendor
    await prisma.dokanVendor.create({
      data: {
        projectId: project.id,
        storeName: `مرکز اصلی ${businessName}`,
        ownerName: 'مدیریت مجموعه',
        phone: '09121234567',
        isVerified: true,
        commissionRate: 5,
        rating: 5.0,
      },
    });

    return reply.status(201).send({
      success: true,
      message: `🎉 اپلیکیشن اختصاصی «${businessName}» توسط هوش مصنوعی با موفقیت ساخته و پیکربندی شد!`,
      project: {
        id: project.id,
        name: project.name,
        packageName: project.packageName,
        version: project.version,
        config,
      },
    });
  });
};
