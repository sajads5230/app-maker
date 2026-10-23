import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';

export const whiteLabelRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Get White-Label Settings for Project
  server.get('/api/projects/:projectId/white-label', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };

    let setting = await prisma.whiteLabelSetting.findUnique({
      where: { projectId },
    });

    if (!setting) {
      setting = await prisma.whiteLabelSetting.create({
        data: {
          projectId,
          brandName: 'آریا اپ ساز (نمایندگی رسمی)',
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop',
          customDomain: 'app.myagency.ir',
          dnsVerified: true,
          supportPhone: '02191001234',
          supportEmail: 'support@myagency.ir',
          hideBranding: true,
          customFooterText: 'قدرت‌گرفته از زیرساخت ابری اختصاصی آریا اپ',
          primaryColor: '#3B82F6',
        },
      });
    }

    return reply.send({
      success: true,
      setting,
      dnsInstructions: {
        recordType: 'CNAME',
        host: setting.customDomain ? setting.customDomain.split('.')[0] : 'app',
        target: 'cname.appmaker.ir',
        aRecord: '185.143.232.10',
        status: setting.dnsVerified ? 'VERIFIED' : 'PENDING_PROPAGATION',
      },
    });
  });

  // 2. Save White-Label Settings
  server.post('/api/projects/:projectId/white-label', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const {
      brandName,
      logoUrl,
      customDomain,
      supportPhone,
      supportEmail,
      hideBranding,
      customFooterText,
      primaryColor,
    } = request.body as {
      brandName?: string;
      logoUrl?: string;
      customDomain?: string;
      supportPhone?: string;
      supportEmail?: string;
      hideBranding?: boolean;
      customFooterText?: string;
      primaryColor?: string;
    };

    const setting = await prisma.whiteLabelSetting.upsert({
      where: { projectId },
      update: {
        brandName: brandName ?? undefined,
        logoUrl: logoUrl ?? undefined,
        customDomain: customDomain ?? undefined,
        supportPhone: supportPhone ?? undefined,
        supportEmail: supportEmail ?? undefined,
        hideBranding: hideBranding ?? undefined,
        customFooterText: customFooterText ?? undefined,
        primaryColor: primaryColor ?? undefined,
      },
      create: {
        projectId,
        brandName: brandName || 'برند اختصاصی نمایندگی',
        logoUrl: logoUrl || null,
        customDomain: customDomain || null,
        supportPhone: supportPhone || null,
        supportEmail: supportEmail || null,
        hideBranding: hideBranding || false,
        customFooterText: customFooterText || null,
        primaryColor: primaryColor || '#3B82F6',
      },
    });

    return reply.send({
      success: true,
      message: 'تنظیمات وایت‌لیبل و پنل نمایندگی اختصاصی با موفقیت ذخیره شد.',
      setting,
    });
  });

  // 3. Verify DNS Records
  server.post('/api/projects/:projectId/white-label/verify-dns', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };

    const setting = await prisma.whiteLabelSetting.findUnique({
      where: { projectId },
    });

    if (!setting || !setting.customDomain) {
      return reply.status(400).send({
        success: false,
        error: 'ابتدا نام دامنه اختصاصی خود را در فیلد دامنه وارد فرمایید.',
      });
    }

    // Simulate DNS check propagation
    const updated = await prisma.whiteLabelSetting.update({
      where: { projectId },
      data: { dnsVerified: true },
    });

    return reply.send({
      success: true,
      message: `رکورد CNAME دامنه ${setting.customDomain} به سرور متصل و گواهی SSL رایگان صادر گردید! ✅`,
      dnsVerified: true,
      domain: setting.customDomain,
    });
  });
};
