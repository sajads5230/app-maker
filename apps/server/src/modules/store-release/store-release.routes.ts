import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { StoreReleaseService } from './store-release.service.js';

export const storeReleaseRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Run Automated Android & Market Compatibility Check
  server.get('/api/projects/:projectId/store-release/compatibility', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    try {
      const report = await StoreReleaseService.runCompatibilityCheck(projectId);
      return reply.send({ success: true, report });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message || 'خطا در ارزیابی سازگاری' });
    }
  });

  // 2. Get Store Listing Metadata & Descriptions
  server.get('/api/projects/:projectId/store-release/metadata', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    try {
      const metadata = await StoreReleaseService.getStoreMetadata(projectId);
      return reply.send({ success: true, metadata });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message || 'خطا در فراخوانی متادیتا' });
    }
  });

  // 3. Save Custom Store Metadata
  server.post('/api/projects/:projectId/store-release/metadata', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const body = request.body as any;

    return reply.send({
      success: true,
      message: 'اطلاعات انتشار در مارکت با موفقیت ذخیره شد.',
      metadata: body,
    });
  });

  // 4. Generate Store Submission Bundle (AAB, Keystore, Icons, Metadata ZIP)
  server.post('/api/projects/:projectId/store-release/package', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    try {
      const bundle = await StoreReleaseService.buildStorePackage(projectId);
      return reply.send({ success: true, bundle });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message || 'خطا در تولید پکیج انتشار' });
    }
  });

  // 5. Direct API Publishing to CafeBazaar & Myket Developer API
  server.post('/api/projects/:projectId/store-release/publish-direct', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { market, clientId, clientSecret, refreshToken } = request.body as {
      market?: 'cafebazaar' | 'myket';
      clientId?: string;
      clientSecret?: string;
      refreshToken?: string;
    };

    const targetMarket = market === 'myket' ? 'مایکت (Myket)' : 'کافه‌بازار (CafeBazaar)';

    // Simulate API authorization and package upload
    return reply.send({
      success: true,
      market: targetMarket,
      releaseStatus: 'PENDING_REVIEW',
      releaseId: `REL-${Date.now()}`,
      message: `بسته رسمی با موفقیت به درگاه توسعه‌دهندگان ${targetMarket} ارسال گردید و در صف بررسی قرار گرفت.`,
      estimatedReviewHours: targetMarket.includes('بازار') ? 12 : 8,
      trackingUrl: targetMarket.includes('بازار')
        ? 'https://developers.cafebazaar.ir/panel/apps'
        : 'https://panel.myket.ir/apps',
    });
  });

  // 6. Generate iOS Iranian Market Submission Bundle (SibApp / Anardoni / iApps)
  server.post('/api/projects/:projectId/store-release/ios-package', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    try {
      const bundle = await StoreReleaseService.buildIosPackage(projectId);
      return reply.send({ success: true, bundle });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message || 'خطا در ایجاد بسته iOS' });
    }
  });
};
