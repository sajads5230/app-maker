import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';
import { NotificationsService } from '../notifications/notifications.service.js';

export const abandonedCartRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Helper to ensure initial mock demo abandoned carts exist for realistic showcase
  const ensureSeedDemoCarts = async (projectId: string) => {
    const count = await prisma.abandonedCart.count({ where: { projectId } });
    if (count === 0) {
      await prisma.abandonedCart.createMany({
        data: [
          {
            projectId,
            customerPhone: '09123232580',
            customerName: 'رضا کمالی',
            totalAmount: 18450000,
            status: 'ABANDONED',
            recoveryDiscountCode: 'CART10-REZA',
            notificationSent: false,
            itemsJson: JSON.stringify([
              {
                id: 10160,
                name: 'ساعت هوشمند شیائومی Watch S3 با فریم قابل تعویض',
                price: 7850000,
                quantity: 1,
                image: 'https://xiaomismart.ir/wp-content/uploads/2026/09/watch-s3.jpg',
              },
              {
                id: 10161,
                name: 'هدفون بی‌سیم شیائومی Redmi Buds 5 Pro نویزکنسلینگ',
                price: 10600000,
                quantity: 1,
                image: 'https://xiaomismart.ir/wp-content/uploads/2026/09/buds-5-pro.jpg',
              },
            ]),
            createdAt: new Date(Date.now() - 3600 * 1000 * 3), // 3 hours ago
          },
          {
            projectId,
            customerPhone: '09358765432',
            customerName: 'مریم حسینی',
            totalAmount: 32900000,
            status: 'ABANDONED',
            recoveryDiscountCode: 'CART10-MARYAM',
            notificationSent: false,
            itemsJson: JSON.stringify([
              {
                id: 10158,
                name: 'گوشی موبایل شیائومی 14T Pro ظرفیت ۵۱۲ گیگابایت',
                price: 32900000,
                quantity: 1,
                image: 'https://xiaomismart.ir/wp-content/uploads/2026/09/14t-pro.jpg',
              },
            ]),
            createdAt: new Date(Date.now() - 3600 * 1000 * 7), // 7 hours ago
          },
          {
            projectId,
            customerPhone: '09194567890',
            customerName: 'علی رضایی',
            totalAmount: 4200000,
            status: 'RECOVERED',
            recoveryDiscountCode: 'CART10-ALI',
            notificationSent: true,
            notifiedAt: new Date(Date.now() - 3600 * 1000 * 20),
            itemsJson: JSON.stringify([
              {
                id: 10162,
                name: 'پاوربانک ۲۰۰۰۰ میلی‌آمپر شیائومی ۵۰ وات فست‌شارژ',
                price: 4200000,
                quantity: 1,
                image: 'https://xiaomismart.ir/wp-content/uploads/2026/09/powerbank-50w.jpg',
              },
            ]),
            createdAt: new Date(Date.now() - 3600 * 1000 * 24),
          },
        ],
      });
    }
  };

  // 1. Sync / Save Cart from mobile app
  server.post('/api/projects/:projectId/cart/sync', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { customerPhone, customerName, items, totalAmount } = request.body as {
      customerPhone?: string;
      customerName?: string;
      items: any[];
      totalAmount: number;
    };

    if (!items || items.length === 0) {
      return reply.send({ success: true, message: 'سبد خالی نادیده گرفته شد.' });
    }

    // Check if an abandoned cart exists for this customer in last 24h
    let cart = null;
    if (customerPhone) {
      cart = await prisma.abandonedCart.findFirst({
        where: {
          projectId,
          customerPhone,
          status: 'ABANDONED',
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (cart) {
      // Update existing cart
      cart = await prisma.abandonedCart.update({
        where: { id: cart.id },
        data: {
          customerName: customerName || cart.customerName,
          itemsJson: JSON.stringify(items),
          totalAmount: totalAmount || 0,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new abandoned cart entry
      const discountCode = `CART10-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      cart = await prisma.abandonedCart.create({
        data: {
          projectId,
          customerPhone: customerPhone || null,
          customerName: customerName || 'کاربر موبایل',
          itemsJson: JSON.stringify(items),
          totalAmount: totalAmount || 0,
          status: 'ABANDONED',
          recoveryDiscountCode: discountCode,
          notificationSent: false,
        },
      });
    }

    return reply.send({
      success: true,
      cartId: cart.id,
      recoveryDiscountCode: cart.recoveryDiscountCode,
    });
  });

  // 2. Get Abandoned Carts with Aggregated Stats
  server.get('/api/projects/:projectId/abandoned-carts', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };

    await ensureSeedDemoCarts(projectId);

    const carts = await prisma.abandonedCart.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    let totalAbandonedAmount = 0;
    let totalRecoveredAmount = 0;
    let abandonedCount = 0;
    let recoveredCount = 0;

    const parsedCarts = carts.map((c) => {
      let items = [];
      try {
        items = JSON.parse(c.itemsJson);
      } catch (_) {}

      if (c.status === 'ABANDONED') {
        abandonedCount++;
        totalAbandonedAmount += c.totalAmount;
      } else if (c.status === 'RECOVERED') {
        recoveredCount++;
        totalRecoveredAmount += c.totalAmount;
      }

      return {
        ...c,
        items,
        itemCount: items.length,
      };
    });

    const totalCarts = carts.length;
    const recoveryRate = totalCarts > 0 ? Math.round((recoveredCount / totalCarts) * 100) : 0;

    return reply.send({
      success: true,
      stats: {
        totalCarts,
        abandonedCount,
        recoveredCount,
        totalAbandonedAmount,
        totalRecoveredAmount,
        recoveryRate,
      },
      carts: parsedCarts,
    });
  });

  // 3. Trigger Automated Recovery Push Notification
  server.post('/api/projects/:projectId/abandoned-carts/trigger-recovery', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { cartId, customMessage } = (request.body as { cartId?: string; customMessage?: string }) || {};

    let targetCarts = [];
    if (cartId) {
      const cart = await prisma.abandonedCart.findUnique({ where: { id: cartId } });
      if (cart) targetCarts.push(cart);
    } else {
      targetCarts = await prisma.abandonedCart.findMany({
        where: {
          projectId,
          status: 'ABANDONED',
          notificationSent: false,
        },
      });
    }

    if (targetCarts.length === 0) {
      return reply.send({
        success: true,
        message: 'هیچ سبد رها شده ارسال نشده‌ای برای بازیابی یافت نشد.',
        sentCount: 0,
      });
    }

    const dispatched = [];
    for (const cart of targetCarts) {
      const discount = cart.recoveryDiscountCode || 'CART10';
      const customer = cart.customerName || 'کاربر گرامی';
      const title = `🛍️ سبد خرید شما در انتظار تکمیل است! (تخفیف ویژه: ${discount})`;
      const body = customMessage || `${customer} عزیز، اقلام انتخابی شما رزرو شده‌اند. با کد تخفیف «${discount}» تا ۲ ساعت آینده خرید خود را با تخفیف ویژه قطعی کنید!`;

      // Dispatch via notification system
      await NotificationsService.sendNotification({
        projectId,
        title,
        body,
        type: 'discount',
        targetPhone: cart.customerPhone || undefined,
        actionUrl: '/cart',
      });

      // Update cart notification status
      const updated = await prisma.abandonedCart.update({
        where: { id: cart.id },
        data: {
          notificationSent: true,
          notifiedAt: new Date(),
        },
      });

      dispatched.push({
        cartId: cart.id,
        phone: cart.customerPhone,
        discountCode: discount,
      });
    }

    return reply.send({
      success: true,
      message: `اطلاع‌رسانی خودکار بازیابی سبد خرید برای ${dispatched.length} مشتری با موفقیت ارسال گردید.`,
      sentCount: dispatched.length,
      dispatched,
    });
  });

  // 4. Mark Cart as Recovered
  server.post('/api/projects/:projectId/abandoned-carts/:cartId/mark-recovered', async (request, reply) => {
    const { cartId } = request.params as { cartId: string };

    const cart = await prisma.abandonedCart.update({
      where: { id: cartId },
      data: {
        status: 'RECOVERED',
        updatedAt: new Date(),
      },
    });

    return reply.send({
      success: true,
      message: 'وضعیت سبد خرید با موفقیت به «بازیابی شده» تغییر یافت.',
      cart,
    });
  });
};
