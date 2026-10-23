import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';
import { QuotaService } from '../subscriptions/quota.service.js';

export const buildRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Trigger Cloud Build Job
  server.post('/api/build/trigger', async (request, reply) => {
    const { projectId, platform } = request.body as { projectId: string; platform?: string };

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return reply.status(404).send({ success: false, error: 'پروژه یافت نشد.' });
    }

    // Commercial Quota Check: verify user hasn't exceeded plan build limits
    const quota = await QuotaService.checkBuildQuota(project.userId);
    if (!quota.allowed) {
      return reply.status(403).send({
        success: false,
        error: quota.reason,
        remainingBuilds: quota.remainingBuilds,
        planName: quota.planName,
      });
    }

    const targetPlatform = platform || 'ALL';

    // Create queued build job for Cloud Worker
    const job = await prisma.buildJob.create({
      data: {
        projectId,
        platform: targetPlatform,
        status: 'QUEUED',
        logs: `[${new Date().toLocaleTimeString('fa-IR')}] درخواست خروجی تجاری (${targetPlatform}) با امضای دیجیتال Release در صف پردازش قرار گرفت...`,
      },
    });

    return reply.status(202).send({
      success: true,
      message: 'فرآیند خروجی‌گیری آغاز شد و در صف ساخت قرار گرفت.',
      jobId: job.id,
      status: job.status,
    });
  });

  // 2. Check Build Job Status
  server.get('/api/build/status/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const job = await prisma.buildJob.findUnique({
      where: { id },
      include: {
        project: {
          select: { name: true, packageName: true, version: true, keystoreSha256: true },
        },
      },
    });

    if (!job) {
      return reply.status(404).send({ success: false, error: 'شناسه بیلد یافت نشد.' });
    }

    return reply.send({
      success: true,
      job: {
        id: job.id,
        platform: job.platform,
        status: job.status,
        downloadUrl: job.downloadUrl,
        aabUrl: job.aabUrl,
        keystoreUrl: job.keystoreUrl,
        logs: job.logs,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        project: job.project,
      },
    });
  });

  // 3. List Build History for Project
  server.get('/api/build/project/:projectId', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };

    const jobs = await prisma.buildJob.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { keystoreSha256: true },
    });

    return reply.send({
      success: true,
      jobs,
      keystoreSha256: project?.keystoreSha256,
    });
  });
};
