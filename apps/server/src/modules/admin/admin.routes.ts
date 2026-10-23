import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma, checkDatabaseHealth } from '../../prisma.js';
import { storage } from '../../services/storage.service.js';
import { QuotaService } from '../subscriptions/quota.service.js';
import fs from 'fs';
import path from 'path';

// Persistent Settings File
const SETTINGS_FILE = path.resolve(process.cwd(), 'data/system-settings.json');

interface SystemSettings {
  maintenanceMode: boolean;
  announcementText: string;
  smsProvider: 'kavenegar' | 'farazsms' | 'ghasedak' | 'simulated';
  smsApiKey: string;
  smsSenderLine: string;
  paymentGateway: 'zarinpal' | 'saman' | 'nextpay' | 'simulated';
  zarinpalMerchantId: string;
  defaultFreeQuota: number;
  supportPhone: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  maintenanceMode: false,
  announcementText: 'به نسخه ۲.۰ پلتفرم اپ‌ساز خوش آمدید! ویژگی گردونه شانس و خرید اقساطی اسنپ‌پی فعال گردید.',
  smsProvider: 'kavenegar',
  smsApiKey: '7968541230abcdef7418529630abcdef',
  smsSenderLine: '10008585',
  paymentGateway: 'zarinpal',
  zarinpalMerchantId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  defaultFreeQuota: 5,
  supportPhone: '۰۲۱-۹۱۰۰۰۰۰۰',
};

function getSettings(): SystemSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (_) {}
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: Partial<SystemSettings>): SystemSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving system settings:', e);
  }
  return updated;
}

export const adminRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Overview KPIs & Stats
  server.get('/api/admin/overview', async (_, reply) => {
    try {
      const [
        totalUsers,
        totalProjects,
        totalBuilds,
        successfulBuilds,
        activeSubscriptionsCount,
        recentUsers,
        recentBuilds,
        allActiveSubs,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.buildJob.count(),
        prisma.buildJob.count({ where: { status: 'SUCCESS' } }),
        prisma.subscription.count({
          where: {
            status: 'ACTIVE',
            expiresAt: { gt: new Date() },
          },
        }),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            projects: { select: { id: true, name: true } },
            subscriptions: {
              where: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
              take: 1,
              orderBy: { expiresAt: 'desc' },
            },
          },
        }),
        prisma.buildJob.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            project: { select: { name: true, packageName: true } },
          },
        }),
        prisma.subscription.findMany({
          where: {
            status: 'ACTIVE',
            expiresAt: { gt: new Date() },
          },
        }),
      ]);

      // Calculate MRR (Monthly Recurring Revenue in Tomans)
      const mrr = allActiveSubs.reduce((acc, sub) => acc + (sub.price || 0), 0);

      const dbHealth = await checkDatabaseHealth();
      const storageHealth = await storage.checkHealth();
      const settings = getSettings();

      return reply.send({
        success: true,
        metrics: {
          totalUsers,
          totalProjects,
          totalBuilds,
          successfulBuilds,
          activeSubscriptions: activeSubscriptionsCount,
          mrr,
          totalRevenue: mrr * 1.8, // historical revenue estimation
        },
        health: {
          database: dbHealth.status,
          storage: storageHealth.status,
          worker: 'ACTIVE',
          maintenanceMode: settings.maintenanceMode,
        },
        recentUsers: recentUsers.map((u) => ({
          id: u.id,
          name: u.name || 'کاربر بدون نام',
          phone: u.phone,
          role: u.role,
          projectsCount: u.projects.length,
          activePlan: u.subscriptions[0]?.plan || 'FREE',
          createdAt: u.createdAt,
        })),
        recentBuilds: recentBuilds.map((b) => ({
          id: b.id,
          projectName: b.project?.name || 'پروژه ناشناس',
          packageName: b.project?.packageName || '---',
          platform: b.platform,
          status: b.status,
          createdAt: b.createdAt,
          completedAt: b.completedAt,
        })),
      });
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 2. Users Management - List & Search
  server.get('/api/admin/users', async (request, reply) => {
    try {
      const { search, role, page = '1', limit = '20' } = request.query as {
        search?: string;
        role?: string;
        page?: string;
        limit?: string;
      };

      const pageNum = Math.max(1, parseInt(page));
      const take = Math.min(100, Math.max(1, parseInt(limit)));
      const skip = (pageNum - 1) * take;

      const where: any = {};
      if (search && search.trim().length > 0) {
        where.OR = [
          { phone: { contains: search.trim() } },
          { name: { contains: search.trim() } },
        ];
      }
      if (role && role !== 'ALL') {
        where.role = role;
      }

      const [total, users] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            projects: {
              select: {
                id: true,
                name: true,
                packageName: true,
                updatedAt: true,
                _count: { select: { buildJobs: true } },
              },
            },
            subscriptions: {
              where: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
              orderBy: { expiresAt: 'desc' },
              take: 1,
            },
          },
        }),
      ]);

      const formatted = users.map((u) => {
        const activeSub = u.subscriptions[0];
        const daysRemaining = activeSub
          ? Math.max(0, Math.ceil((new Date(activeSub.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
          : 0;
        const totalBuilds = u.projects.reduce((acc, p) => acc + (p._count?.buildJobs || 0), 0);

        return {
          id: u.id,
          name: u.name || 'کاربر بدون نام',
          phone: u.phone,
          role: u.role,
          createdAt: u.createdAt,
          projectsCount: u.projects.length,
          totalBuilds,
          activePlan: activeSub?.plan || 'FREE',
          planPrice: activeSub?.price || 0,
          daysRemaining,
          expiresAt: activeSub?.expiresAt || null,
        };
      });

      return reply.send({
        success: true,
        users: formatted,
        pagination: {
          total,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(total / take),
        },
      });
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 3. Create User Manually
  server.post('/api/admin/users', async (request, reply) => {
    try {
      const { phone, name, role = 'USER', initialPlan = 'FREE' } = request.body as {
        phone: string;
        name?: string;
        role?: string;
        initialPlan?: string;
      };

      if (!phone || phone.trim().length < 10) {
        return reply.status(400).send({ success: false, error: 'شماره همراه معتبر الزامی است.' });
      }

      const existing = await prisma.user.findUnique({ where: { phone: phone.trim() } });
      if (existing) {
        return reply.status(400).send({ success: false, error: 'کاربری با این شماره تلفن قبلاً در سیستم ثبت شده است.' });
      }

      const newUser = await prisma.user.create({
        data: {
          phone: phone.trim(),
          name: name?.trim() || 'کاربر جدید',
          role: role === 'ADMIN' ? 'ADMIN' : 'USER',
        },
      });

      // Assign initial subscription if requested
      if (initialPlan && initialPlan !== 'FREE') {
        const planConfig = QuotaService.PLANS[initialPlan] || QuotaService.PLANS.plan_starter;
        await prisma.subscription.create({
          data: {
            userId: newUser.id,
            plan: planConfig.id,
            price: planConfig.price,
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + planConfig.days * 24 * 60 * 60 * 1000),
          },
        });
      }

      return reply.send({ success: true, user: newUser, message: 'کاربر جدید با موفقیت ایجاد شد.' });
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 4. Update User Details
  server.put('/api/admin/users/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { name, phone, role } = request.body as { name?: string; phone?: string; role?: string };

      const updated = await prisma.user.update({
        where: { id },
        data: {
          name: name !== undefined ? name.trim() : undefined,
          phone: phone !== undefined ? phone.trim() : undefined,
          role: role !== undefined ? role : undefined,
        },
      });

      return reply.send({ success: true, user: updated, message: 'مشخصات کاربر به‌روزرسانی شد.' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 5. Delete User
  server.delete('/api/admin/users/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.user.delete({ where: { id } });
      return reply.send({ success: true, message: 'کاربر و تمامی پروژه‌های مربوطه با موفقیت حذف شدند.' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 5.1 Impersonate User / Login As Client (ورود به عنوان مشتری)
  server.post('/api/admin/impersonate/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string };

      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
            orderBy: { expiresAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!targetUser) {
        return reply.status(404).send({ success: false, error: 'کاربر مورد نظر یافت نشد.' });
      }

      // Generate a valid JWT token for this user
      const token = server.jwt.sign({
        id: targetUser.id,
        phone: targetUser.phone,
        role: targetUser.role,
        isImpersonated: true,
      });

      return reply.send({
        success: true,
        message: `ورود موقت به پنل کاربری «${targetUser.name || targetUser.phone}» با موفقیت انجام شد.`,
        token,
        user: {
          id: targetUser.id,
          name: targetUser.name,
          phone: targetUser.phone,
          role: targetUser.role,
          activePlan: targetUser.subscriptions[0]?.plan || 'FREE',
        },
      });
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 6. Subscriptions Management - List All
  server.get('/api/admin/subscriptions', async (request, reply) => {
    try {
      const { status } = request.query as { status?: string };
      const where: any = {};
      if (status && status !== 'ALL') {
        where.status = status;
      }

      const subscriptions = await prisma.subscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, phone: true },
          },
        },
      });

      const formatted = subscriptions.map((s) => {
        const isExpired = new Date(s.expiresAt).getTime() < Date.now();
        const daysRemaining = Math.max(0, Math.ceil((new Date(s.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        const planMeta = QuotaService.PLANS[s.plan] || { name: s.plan, price: s.price };

        return {
          id: s.id,
          userId: s.userId,
          userName: s.user?.name || '---',
          userPhone: s.user?.phone || '---',
          planId: s.plan,
          planName: planMeta.name || s.plan,
          price: s.price,
          status: isExpired ? 'EXPIRED' : s.status,
          createdAt: s.createdAt,
          expiresAt: s.expiresAt,
          daysRemaining: isExpired ? 0 : daysRemaining,
        };
      });

      return reply.send({ success: true, subscriptions: formatted });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 7. Manually Grant / Extend Subscription
  server.post('/api/admin/subscriptions/grant', async (request, reply) => {
    try {
      const { userId, planId, durationDays = 30, price = 0 } = request.body as {
        userId: string;
        planId: string;
        durationDays?: number;
        price?: number;
      };

      if (!userId || !planId) {
        return reply.status(400).send({ success: false, error: 'انتخاب کاربر و پلن الزامی است.' });
      }

      const planConfig = QuotaService.PLANS[planId] || QuotaService.PLANS.plan_pro;
      const days = durationDays > 0 ? durationDays : planConfig.days;
      const calculatedPrice = price > 0 ? price : planConfig.price;

      // Create new subscription record
      const newSub = await prisma.subscription.create({
        data: {
          userId,
          plan: planConfig.id,
          price: calculatedPrice,
          status: 'ACTIVE',
          expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        },
      });

      return reply.send({
        success: true,
        subscription: newSub,
        message: `اشتراک "${planConfig.name}" به مدت ${days} روز برای کاربر فعال شد.`,
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 8. Cancel Subscription
  server.post('/api/admin/subscriptions/:id/cancel', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const updated = await prisma.subscription.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
      return reply.send({ success: true, subscription: updated, message: 'اشتراک با موفقیت لغو شد.' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 9. Projects Management - List All Across Platform
  server.get('/api/admin/projects', async (_, reply) => {
    try {
      const projects = await prisma.project.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, phone: true } },
          _count: { select: { buildJobs: true } },
        },
      });

      const formatted = projects.map((p) => {
        let blockCount = 0;
        let isWooConnected = false;
        try {
          const cfg = JSON.parse(p.configJson || '{}');
          blockCount = cfg.homePage?.blocks?.length || 0;
          isWooConnected = Boolean(cfg.woocommerce?.siteUrl && cfg.woocommerce?.enabled);
        } catch (_) {}

        return {
          id: p.id,
          name: p.name,
          packageName: p.packageName,
          version: p.version,
          userName: p.user?.name || 'کاربر',
          userPhone: p.user?.phone || '---',
          userId: p.userId,
          totalBuilds: p._count.buildJobs,
          blockCount,
          isWooConnected,
          updatedAt: p.updatedAt,
        };
      });

      return reply.send({ success: true, projects: formatted });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 10. Build Queue & History
  server.get('/api/admin/builds', async (request, reply) => {
    try {
      const { status } = request.query as { status?: string };
      const where: any = {};
      if (status && status !== 'ALL') {
        where.status = status;
      }

      const builds = await prisma.buildJob.findMany({
        where,
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              name: true,
              packageName: true,
              user: { select: { name: true, phone: true } },
            },
          },
        },
      });

      const formatted = builds.map((b) => ({
        id: b.id,
        projectId: b.projectId,
        projectName: b.project?.name || 'پروژه',
        packageName: b.project?.packageName || '---',
        userName: b.project?.user?.name || 'کاربر',
        userPhone: b.project?.user?.phone || '---',
        platform: b.platform,
        status: b.status,
        downloadUrl: b.downloadUrl,
        aabUrl: b.aabUrl,
        keystoreUrl: b.keystoreUrl,
        logs: b.logs,
        createdAt: b.createdAt,
        completedAt: b.completedAt,
      }));

      return reply.send({ success: true, builds: formatted });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 11. System Settings - Get & Update
  server.get('/api/admin/settings', async (_, reply) => {
    return reply.send({ success: true, settings: getSettings() });
  });

  server.post('/api/admin/settings', async (request, reply) => {
    try {
      const body = request.body as Partial<SystemSettings>;
      const updated = saveSettings(body);
      return reply.send({ success: true, settings: updated, message: 'تنظیمات کلان سامانه با موفقیت ذخیره گردید.' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
};
