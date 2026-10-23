import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { prisma, checkDatabaseHealth } from './prisma.js';
import { storage } from './services/storage.service.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { projectRoutes } from './modules/projects/projects.routes.js';
import { subscriptionRoutes } from './modules/subscriptions/subscriptions.routes.js';
import { buildRoutes } from './modules/build/build.routes.js';
import { mediaRoutes } from './modules/media/media.routes.js';
import { woocommerceRoutes } from './modules/woocommerce/woocommerce.routes.js';
import { pluginsRoutes } from './modules/plugins/plugins.routes.js';
import { notificationRoutes } from './modules/notifications/notifications.routes.js';
import { adminRoutes } from './modules/admin/admin.routes.js';
import { nativeStoreRoutes } from './modules/native-store/native-store.routes.js';
import { abandonedCartRoutes } from './modules/abandoned-cart/abandoned-cart.routes.js';
import { formsRoutes } from './modules/forms/forms.routes.js';
import { loyaltyRoutes } from './modules/loyalty/loyalty.routes.js';
import { dokanRoutes } from './modules/dokan/dokan.routes.js';
import { whiteLabelRoutes } from './modules/white-label/white-label.routes.js';
import { appUpdateRoutes } from './modules/app-update/app-update.routes.js';
import { aiGeneratorRoutes } from './modules/ai-generator/ai-generator.routes.js';
import fs from 'fs';
import path from 'path';

// Declare JWT types on Fastify
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

const server = Fastify({
  logger: true,
});

// Seed Initial Demo Project if DB is empty
async function seedInitialData() {
  const existingProject = await prisma.project.findFirst({
    where: { id: 'app-demo-techmarket' },
  });

  if (!existingProject) {
    let demoConfig = '{}';
    try {
      const demoConfigPath = path.resolve(process.cwd(), '../../packages/shared-schema/src/sample/demo-store-config.json');
      if (fs.existsSync(demoConfigPath)) {
        demoConfig = fs.readFileSync(demoConfigPath, 'utf-8');
      }
    } catch (_) {}

    const admin = await prisma.user.upsert({
      where: { phone: '09121234567' },
      update: {},
      create: {
        phone: '09121234567',
        name: 'مدیر پلتفرم تک‌مارکت',
        role: 'ADMIN',
        subscriptions: {
          create: {
            plan: 'LIFETIME',
            price: 21900000,
            expiresAt: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    await prisma.project.create({
      data: {
        id: 'app-demo-techmarket',
        userId: admin.id,
        name: 'تک‌مارکت',
        packageName: 'ir.techmarket.app',
        version: '1.0.0',
        configJson: demoConfig,
      },
    });

    server.log.info('Initial Demo Project seeded into database (ID: app-demo-techmarket)');
  }
}

async function start() {
  try {
    // 1. CORS
    await server.register(cors, {
      origin: true,
      credentials: true,
    });

    // Multipart upload support (max 20MB)
    await server.register(multipart, {
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    });

    // Native static file serving route for uploads
    server.get('/uploads/:filename', async (request, reply) => {
      const { filename } = request.params as { filename: string };
      const filePath = path.resolve(process.cwd(), 'public/uploads', filename);
      if (!fs.existsSync(filePath)) {
        return reply.status(404).send({ error: 'تصویر یافت نشد.' });
      }
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif',
      };
      reply.header('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      reply.header('Cache-Control', 'public, max-age=86400');
      return reply.send(fs.createReadStream(filePath));
    });

    // Native static file download route for APKs, AAB bundles, and Keystores
    server.get('/downloads/:filename', async (request, reply) => {
      const { filename } = request.params as { filename: string };
      const filePath = path.resolve(process.cwd(), 'public/downloads', filename);
      if (!fs.existsSync(filePath)) {
        return reply.status(404).send({ error: 'فایل خروجی یافت نشد یا هنوز در حال ساخت است.' });
      }
      const stream = fs.createReadStream(filePath);
      const ext = path.extname(filename).toLowerCase();
      const contentTypes: Record<string, string> = {
        '.apk': 'application/vnd.android.package-archive',
        '.aab': 'application/octet-stream',
        '.jks': 'application/octet-stream',
        '.keystore': 'application/octet-stream',
        '.json': 'application/json',
        '.zip': 'application/zip',
      };
      reply.header('Content-Type', contentTypes[ext] || 'application/octet-stream');
      reply.header('Content-Disposition', `attachment; filename="${filename}"`);
      reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      reply.header('Pragma', 'no-cache');
      reply.header('Expires', '0');
      return reply.send(stream);
    });

    // 2. JWT Plugin
    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'app_maker_super_secret_jwt_key_2026',
    });

    server.decorate('authenticate', async (request: any, reply: any) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          error: 'احراز هویت انجام نشده است. لطفاً ابتدا وارد حساب کاربری خود شوید.',
        });
      }
    });

    // 3. Register Routes
    await server.register(authRoutes);
    await server.register(projectRoutes);
    await server.register(subscriptionRoutes);
    await server.register(buildRoutes);
    await server.register(mediaRoutes);
    await server.register(woocommerceRoutes);
    await server.register(pluginsRoutes);
    await server.register(notificationRoutes);
    await server.register(adminRoutes);
    await server.register(nativeStoreRoutes);
    await server.register(abandonedCartRoutes);
    await server.register(formsRoutes);
    await server.register(loyaltyRoutes);
    await server.register(dokanRoutes);
    await server.register(whiteLabelRoutes);
    await server.register(appUpdateRoutes);
    await server.register(aiGeneratorRoutes);

    // 4. Health Check
    server.get('/api/health', async () => {
      const usersCount = await prisma.user.count();
      const projectsCount = await prisma.project.count();
      const dbHealth = await checkDatabaseHealth();
      const storageHealth = await storage.checkHealth();
      return {
        status: dbHealth.status === 'UP' && storageHealth.status === 'UP' ? 'UP' : 'DEGRADED',
        timestamp: new Date().toISOString(),
        service: 'App Maker Core SaaS Engine',
        version: '1.0.0',
        database: {
          status: dbHealth.status,
          provider: dbHealth.provider,
          latencyMs: dbHealth.latencyMs,
          users: usersCount,
          projects: projectsCount,
        },
        storage: {
          status: storageHealth.status,
          driver: storageHealth.driver,
          bucket: storageHealth.bucket,
          latencyMs: storageHealth.latencyMs,
        },
      };
    });

    // Dedicated Database Health & Latency Probe
    server.get('/api/health/db', async () => {
      return await checkDatabaseHealth();
    });

    // Dedicated Object Storage Health & Latency Probe
    server.get('/api/health/storage', async () => {
      return await storage.checkHealth();
    });

    // 5. Seed DB
    await seedInitialData();

    // 6. Listen
    const port = Number(process.env.PORT) || 4000;
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    console.log(`\n🚀 [App Maker Server] running on http://localhost:${port}`);
    console.log(`📡 Public Config Delivery: http://localhost:${port}/api/projects/app-demo-techmarket/config`);
    console.log(`🩺 Health Check: http://localhost:${port}/api/health\n`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
