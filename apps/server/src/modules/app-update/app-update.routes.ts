import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';

function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map((p) => parseInt(p, 10) || 0);
  const parts2 = v2.split('.').map((p) => parseInt(p, 10) || 0);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

export const appUpdateRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Check for App Update (Called by Mobile Clients & Admin)
  server.get('/api/projects/:projectId/app-update', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const query = request.query as { version?: string; platform?: string };
    const clientVersion = query.version || '1.0.0';

    let config = await prisma.appUpdateConfig.findUnique({
      where: { projectId },
    });

    if (!config) {
      config = await prisma.appUpdateConfig.create({
        data: {
          projectId,
          latestVersion: '1.2.0',
          minVersion: '1.0.0',
          forceUpdate: false,
          apkDownloadUrl: `http://localhost:4000/downloads/${projectId}-v1.2.0.apk`,
          marketUrl: 'bazar://details?id=ir.xiaomismart.store',
          changelog:
            '• اضافه شدن مارکت‌پلیس چندفروشندگی دکان\n• سیستم کارت وفاداری و پاداش امتیازی مشتریان\n• فرم‌ساز اختصاصی با صدور شماره پیگیری آنلاین\n• رفع باگ‌های جزئی و سازگاری کامل با اندروید ۱۴ و ۱۵',
        },
      });
    }

    const hasUpdate = compareVersions(config.latestVersion, clientVersion) > 0;
    const forceUpdate =
      Boolean(config.forceUpdate) || compareVersions(config.minVersion, clientVersion) > 0;

    return reply.send({
      success: true,
      hasUpdate,
      forceUpdate,
      clientVersion,
      latestVersion: config.latestVersion,
      minVersion: config.minVersion,
      apkDownloadUrl: config.apkDownloadUrl,
      marketUrl: config.marketUrl,
      changelog: config.changelog,
      updatedAt: config.updatedAt,
    });
  });

  // 2. Save App Update Configuration (Called by Builder Studio & SuperAdmin)
  server.post('/api/projects/:projectId/app-update', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const {
      latestVersion,
      minVersion,
      forceUpdate,
      apkDownloadUrl,
      marketUrl,
      changelog,
    } = request.body as {
      latestVersion?: string;
      minVersion?: string;
      forceUpdate?: boolean;
      apkDownloadUrl?: string;
      marketUrl?: string;
      changelog?: string;
    };

    const config = await prisma.appUpdateConfig.upsert({
      where: { projectId },
      update: {
        latestVersion: latestVersion ?? undefined,
        minVersion: minVersion ?? undefined,
        forceUpdate: forceUpdate ?? undefined,
        apkDownloadUrl: apkDownloadUrl ?? undefined,
        marketUrl: marketUrl ?? undefined,
        changelog: changelog ?? undefined,
      },
      create: {
        projectId,
        latestVersion: latestVersion || '1.1.0',
        minVersion: minVersion || '1.0.0',
        forceUpdate: forceUpdate || false,
        apkDownloadUrl: apkDownloadUrl || null,
        marketUrl: marketUrl || null,
        changelog: changelog || '• بهبود عملکرد و تجربه کاربری',
      },
    });

    return reply.send({
      success: true,
      message: 'تنظیمات نسخه و آپدیت درون‌برنامه‌ای با موفقیت ذخیره شد.',
      config,
    });
  });
};
