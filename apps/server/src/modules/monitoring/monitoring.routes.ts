import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { MonitoringService } from './monitoring.service.js';

export const monitoringRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Get Live Infrastructure Telemetry & Metrics
  server.get('/api/monitoring/metrics', async (_, reply) => {
    try {
      const metrics = await MonitoringService.getMetrics();
      return reply.send({ success: true, metrics });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message || 'خطا در واکشی آمار سرور' });
    }
  });

  // 2. Stream Recent Filterable System Logs
  server.get('/api/monitoring/logs', async (request, reply) => {
    const { level, search, limit } = request.query as { level?: string; search?: string; limit?: string };
    const logs = MonitoringService.getLogs(level, search, limit ? parseInt(limit, 10) : 50);
    return reply.send({ success: true, logs });
  });

  // 3. Post a Client Log / Heartbeat
  server.post('/api/monitoring/logs', async (request, reply) => {
    const { level, service, message, details } = request.body as any;
    MonitoringService.addLog(level || 'INFO', service || 'ClientApp', message || '', details);
    return reply.send({ success: true });
  });
};
