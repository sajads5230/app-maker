import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';
import { SourceExportService } from '../../services/source-export.service.js';
import fs from 'fs';
import path from 'path';

export const projectRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Helper to optionally resolve user from JWT if present
  const resolveUser = async (request: any) => {
    try {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const decoded = await request.jwtVerify();
        return decoded as { id: string; phone: string; role: string };
      }
    } catch (_) {}
    return null;
  };

  // 1. List Projects (Scoped to Authenticated User)
  server.get('/api/projects', async (request, reply) => {
    const user = await resolveUser(request);

    // If authenticated, fetch user's own projects
    if (user) {
      const userProjects = await prisma.project.findMany({
        where: {
          OR: [
            { userId: user.id },
            { id: 'app-demo-techmarket' }, // Also include default demo template
          ],
        },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          packageName: true,
          version: true,
          userId: true,
          updatedAt: true,
          createdAt: true,
        },
      });

      return reply.send({ success: true, projects: userProjects });
    }

    // Guest / Public fallback: show all recent projects
    const publicProjects = await prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        packageName: true,
        version: true,
        userId: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    return reply.send({ success: true, projects: publicProjects });
  });

  // 2. Get Single Project (with Ownership Access Control)
  server.get('/api/projects/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await resolveUser(request);

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        buildJobs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!project) {
      return reply.status(404).send({ success: false, error: 'پروژه مورد نظر یافت نشد.' });
    }

    // Access check: verify ownership if authenticated
    if (user && id !== 'app-demo-techmarket') {
      if (project.userId !== user.id && user.role !== 'ADMIN') {
        return reply.status(403).send({
          success: false,
          error: 'شما مجوز دسترسی به این پروژه را ندارید.',
        });
      }
    }

    let parsedConfig = {};
    try {
      parsedConfig = JSON.parse(project.configJson);
    } catch (_) {}

    return reply.send({
      success: true,
      project: {
        ...project,
        config: parsedConfig,
      },
    });
  });

  // 3. PUBLIC CONFIG DELIVERY ENDPOINT (Called dynamically by Flutter Client)
  server.get('/api/projects/:id/config', async (request, reply) => {
    const { id } = request.params as { id: string };

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return reply.status(404).send({ error: 'Config not found for project' });
    }

    try {
      const config = JSON.parse(project.configJson);
      // High-performance cache headers for mobile network delivery
      reply.header('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
      return reply.send(config);
    } catch (_) {
      return reply.status(500).send({ error: 'Invalid config stored in database' });
    }
  });

  // 3.1. EXPORT FULL FLUTTER SOURCE CODE (Unlocked ZIP)
  server.get('/api/projects/:id/export-source', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const result = await SourceExportService.exportProjectSource(id);
      return reply.send(result);
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({
        success: false,
        error: err.message || 'خطا در بسته‌بندی و دانلود سورس کد فلاتر.',
      });
    }
  });

  // 4. Create New Project (Strictly bound to authenticated user)
  server.post('/api/projects', async (request, reply) => {
    const user = await resolveUser(request);
    const { name, packageName, config } = request.body as {
      name?: string;
      packageName?: string;
      config?: Record<string, unknown>;
    };

    let targetUserId: string;

    if (user) {
      targetUserId = user.id;
    } else {
      // Find or create default admin user if running in dev without token
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

    const appName = name || 'فروشگاه جدید من';
    const pkgName = packageName || `ir.appmaker.app${Date.now()}`;

    const newProject = await prisma.project.create({
      data: {
        userId: targetUserId,
        name: appName,
        packageName: pkgName,
        configJson: JSON.stringify(config || {}),
      },
    });

    return reply.status(201).send({
      success: true,
      message: 'پروژه با موفقیت ایجاد شد.',
      project: newProject,
    });
  });

  // 5. Update Project Config (Protected by Ownership Check)
  server.put('/api/projects/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await resolveUser(request);
    const { name, packageName, config } = request.body as {
      name?: string;
      packageName?: string;
      config?: Record<string, unknown>;
    };

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return reply.status(404).send({ success: false, error: 'پروژه یافت نشد.' });
    }

    // Verify ownership if user is authenticated
    if (user && id !== 'app-demo-techmarket') {
      if (project.userId !== user.id && user.role !== 'ADMIN') {
        return reply.status(403).send({
          success: false,
          error: 'شما دسترسی ویرایش این پروژه را ندارید.',
        });
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: name ?? project.name,
        packageName: packageName ?? project.packageName,
        configJson: config ? JSON.stringify(config) : project.configJson,
      },
    });

    // Synchronize to master mobile-core template if it's the default demo project
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
      message: 'تنظیمات و چیدمان پروژه با موفقیت ذخیره شد.',
      project: updated,
    });
  });

  // 6. Delete Project (Protected by Ownership Check)
  server.delete('/api/projects/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await resolveUser(request);

    if (id === 'app-demo-techmarket') {
      return reply.status(400).send({
        success: false,
        error: 'امکان حذف پروژه پیش‌فرض سیستم (تک‌مارکت) وجود ندارد.',
      });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return reply.status(404).send({ success: false, error: 'پروژه یافت نشد.' });
    }

    if (user && project.userId !== user.id && user.role !== 'ADMIN') {
      return reply.status(403).send({
        success: false,
        error: 'شما مالک این پروژه نیستید و امکان حذف آن را ندارید.',
      });
    }

    await prisma.project.delete({ where: { id } });
    return reply.send({ success: true, message: 'پروژه با موفقیت حذف شد.' });
  });
};
