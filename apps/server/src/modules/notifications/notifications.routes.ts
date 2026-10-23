import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { NotificationsService } from './notifications.service.js';

export const notificationRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Get Notification Inbox
  server.get('/api/notifications/inbox', async (request, reply) => {
    const { projectId, phone } = request.query as { projectId?: string; phone?: string };
    const items = NotificationsService.getInbox(projectId || 'app-demo-techmarket', phone);
    const unreadCount = items.filter((n) => !n.isRead).length;

    return reply.send({
      success: true,
      notifications: items,
      unreadCount,
    });
  });

  // 2. Send / Broadcast Push Notification
  server.post('/api/notifications/send', async (request, reply) => {
    const body = request.body as any;

    if (!body || !body.title || !body.body) {
      return reply.status(400).send({
        success: false,
        error: 'عنوان (title) و متن اعلان (body) الزامی است.',
      });
    }

    const result = await NotificationsService.sendNotification({
      projectId: body.projectId || 'app-demo-techmarket',
      title: body.title,
      body: body.body,
      type: body.type || 'news',
      targetPhone: body.targetPhone,
      orderId: body.orderId,
      productId: body.productId,
      imageUrl: body.imageUrl,
      actionUrl: body.actionUrl,
      najvaApiKey: body.najvaApiKey,
      pushpoleAppId: body.pushpoleAppId,
    });

    return reply.send(result);
  });

  // 3. Mark Single Notification as Read
  server.post('/api/notifications/mark-read', async (request, reply) => {
    const { id } = request.body as { id: string };
    if (!id) {
      return reply.status(400).send({ success: false, error: 'شناسه اعلان الزامی است.' });
    }

    const ok = NotificationsService.markAsRead(id);
    return reply.send({ success: ok });
  });

  // 4. Mark All Notifications as Read
  server.post('/api/notifications/mark-all-read', async (request, reply) => {
    const { projectId, phone } = request.body as { projectId?: string; phone?: string };
    const updatedCount = NotificationsService.markAllAsRead(projectId || 'app-demo-techmarket', phone);
    return reply.send({ success: true, updatedCount });
  });

  // 5. Test Trigger for Order Tracking Alert
  server.post('/api/notifications/test-order-alert', async (request, reply) => {
    const { orderId, phone, statusText, trackingCode } = request.body as any;

    const ordId = orderId || 10209;
    const cleanPhone = phone || '09123232580';
    const status = statusText || 'بسته‌بندی و تحویل شرکت پست گردید';
    const track = trackingCode || 'POST-IR-984217894';

    const result = await NotificationsService.sendNotification({
      projectId: 'app-demo-techmarket',
      targetPhone: cleanPhone,
      title: `📦 سفارش #${ordId} ارسال شد!`,
      body: `مشتری گرامی، مرسوله شما ${status}. کد رهگیری پست: ${track}`,
      type: 'order',
      orderId: ordId,
    });

    return reply.send(result);
  });
};
