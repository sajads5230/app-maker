import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';
import { PaymentService } from './payment.service.js';
import { QuotaService } from './quota.service.js';

export const subscriptionRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
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

  // 1. Get SaaS Pricing Plans
  server.get('/api/subscriptions/plans', async (_, reply) => {
    const plans = Object.values(QuotaService.PLANS);
    return reply.send({ success: true, plans });
  });

  // 2. Checkout & Initiate Payment (ZarinPal / Shetab Gateway)
  server.post('/api/subscriptions/checkout', async (request, reply) => {
    const user = await resolveUser(request);
    const { planId, returnUrl } = request.body as { planId?: string; returnUrl?: string };

    const selectedPlanId = planId || 'plan_pro';
    const plan = QuotaService.PLANS[selectedPlanId];

    if (!plan) {
      return reply.status(400).send({ success: false, error: 'پلن انتخابی معتبر نیست.' });
    }

    let targetUserId = user?.id;
    let targetPhone = user?.phone || '09121234567';

    if (!targetUserId) {
      // Find or create default user if checking out in demo mode
      const defaultUser = await prisma.user.findFirst();
      if (defaultUser) {
        targetUserId = defaultUser.id;
        targetPhone = defaultUser.phone;
      } else {
        return reply.status(401).send({
          success: false,
          error: 'جهت خرید اشتراک ابتدا باید وارد حساب کاربری خود شوید.',
        });
      }
    }

    const callbackUrl = `http://localhost:4000/api/subscriptions/callback`;

    const paymentRequest = await PaymentService.requestPayment({
      userId: targetUserId,
      phone: targetPhone,
      planId: plan.id,
      planName: plan.name,
      amountTomans: plan.price,
      callbackUrl,
    });

    return reply.send({
      success: true,
      message: 'درگاه پرداخت آماده شد. به صفحه پرداخت هدایت می‌شوید...',
      paymentUrl: paymentRequest.paymentUrl,
      authority: paymentRequest.authority,
      amount: plan.price,
      planName: plan.name,
      simulated: paymentRequest.simulated,
    });
  });

  // 3. Simulated Shaparak Gateway Page (Local Dev / Offline Testing)
  server.get('/api/subscriptions/simulated-gateway', async (request, reply) => {
    const { authority } = request.query as { authority?: string };
    if (!authority) {
      return reply.status(400).send('شناسه تراکنش نامعتبر است.');
    }

    const tx = PaymentService.getTransaction(authority);
    const amountTomans = tx?.amount ? tx.amount.toLocaleString('fa-IR') : '۱۳,۵۰۰,۰۰۰';
    const planName = tx?.planName || 'کسب‌وکار حرفه‌ای (سالیانه)';

    const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>درگاه پرداخت الکترونیک شاپرک (شبیه‌ساز زرین‌پال)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Tahoma, 'Segoe UI', sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #1f2937; display: flex; justify-content: center; align-items: center; min-height: 90vh; }
    .card { background: white; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); width: 100%; max-width: 480px; overflow: hidden; border-top: 6px solid #ef394e; }
    .header { background: #fafafa; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; }
    .header h2 { margin: 0; font-size: 17px; font-weight: bold; color: #111827; }
    .badge { background: #fee2e2; color: #ef394e; font-size: 11px; padding: 4px 10px; border-radius: 9999px; font-weight: bold; }
    .content { padding: 24px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px; }
    .row .label { color: #6b7280; }
    .row .val { font-weight: bold; color: #111827; }
    .amount-box { background: #f0fdf4; border: 1px dashed #86efac; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0; }
    .amount-val { font-size: 24px; font-weight: 900; color: #15803d; }
    .actions { display: flex; gap: 12px; margin-top: 24px; }
    .btn { flex: 1; padding: 14px 16px; border-radius: 10px; font-weight: bold; font-size: 14px; cursor: pointer; text-align: center; text-decoration: none; border: none; }
    .btn-pay { background: #10b981; color: white; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); }
    .btn-pay:hover { background: #059669; }
    .btn-cancel { background: #f3f4f6; color: #4b5563; }
    .btn-cancel:hover { background: #e5e7eb; }
    .security-note { font-size: 11px; color: #9ca3af; text-align: center; margin-top: 20px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>درگاه پرداخت امن شاپرک</h2>
      <span class="badge">زرین‌پال شتاب</span>
    </div>
    <div class="content">
      <div class="row">
        <span class="label">پذیرنده:</span>
        <span class="val">پلتفرم اپ‌ساز App Maker</span>
      </div>
      <div class="row">
        <span class="label">محصول انتخابی:</span>
        <span class="val">${planName}</span>
      </div>
      <div class="row">
        <span class="label">شناسه مرجع تراکنش:</span>
        <span class="val" style="font-family: monospace; direction: ltr;">${authority}</span>
      </div>

      <div class="amount-box">
        <div style="font-size: 12px; color: #166534; margin-bottom: 4px;">مبلغ قابل پرداخت</div>
        <div class="amount-val">${amountTomans} <span style="font-size: 14px; font-weight: normal;">تومان</span></div>
      </div>

      <div class="actions">
        <a href="/api/subscriptions/callback?Authority=${authority}&Status=OK" class="btn btn-pay">✓ پرداخت موفق (تایید بانکی)</a>
        <a href="/api/subscriptions/callback?Authority=${authority}&Status=NOK" class="btn btn-cancel">انصراف از پرداخت</a>
      </div>

      <div class="security-note">
        این صفحه شبیه‌ساز رسمی پروتکل پرداخت شتاب جهت تست روان فرآیند مالی در محیط توسعه است.
      </div>
    </div>
  </div>
</body>
</html>`;

    reply.header('Content-Type', 'text/html; charset=utf-8');
    return reply.send(html);
  });

  // 4. Payment Return Callback (Verifies transaction & activates subscription)
  server.get('/api/subscriptions/callback', async (request, reply) => {
    const { Authority, Status } = request.query as { Authority?: string; Status?: string };

    if (!Authority) {
      return reply.status(400).send('پارامترهای بازگشت از بانک ناقص است.');
    }

    const verification = await PaymentService.verifyPayment(Authority, Status || 'NOK');
    const tx = PaymentService.getTransaction(Authority);

    if (verification.success && tx) {
      // Find plan details
      const plan = QuotaService.PLANS[tx.planId] || QuotaService.PLANS.plan_pro;

      // Activate or update subscription in database
      const subscription = await prisma.subscription.create({
        data: {
          userId: tx.userId,
          plan: plan.id,
          status: 'ACTIVE',
          price: plan.price,
          expiresAt: new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000),
        },
      });

      const refId = verification.refId || '12345678';
      const formattedPrice = tx.amount.toLocaleString('fa-IR');

      const successHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>رسید پرداخت موفق - اپ‌ساز</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Tahoma, sans-serif; background: #f3f4f6; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 90vh; }
    .receipt { background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); width: 100%; max-width: 480px; text-align: center; padding: 32px 24px; border-top: 6px solid #10b981; }
    .icon { width: 64px; height: 64px; background: #d1fae5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px; }
    h1 { font-size: 20px; color: #065f46; margin-bottom: 8px; }
    p { font-size: 13px; color: #6b7280; margin-bottom: 24px; }
    .details { background: #f9fafb; border-radius: 12px; padding: 16px; text-align: right; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; }
    .row:last-child { margin-bottom: 0; }
    .label { color: #6b7280; }
    .val { font-weight: bold; color: #111827; }
    .btn { display: inline-block; background: #ef394e; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; width: 85%; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="icon">✓</div>
    <h1>تراکنش با موفقیت انجام شد</h1>
    <p>اشتراک ویژه شما بلافاصله فعال گردید و آماده استفاده است.</p>

    <div class="details">
      <div class="row">
        <span class="label">شماره پیگیری شاپرک:</span>
        <span class="val" style="direction: ltr; font-family: monospace;">${refId}</span>
      </div>
      <div class="row">
        <span class="label">پلن خریداری‌شده:</span>
        <span class="val">${plan.name}</span>
      </div>
      <div class="row">
        <span class="label">مبلغ پرداختی:</span>
        <span class="val">${formattedPrice} تومان</span>
      </div>
      <div class="row">
        <span class="label">وضعیت حساب:</span>
        <span class="val" style="color: #10b981;">فعال (پریمیوم)</span>
      </div>
    </div>

    <a href="http://localhost:3000" class="btn">بازگشت به استودیو اپ‌ساز</a>
  </div>
</body>
</html>`;

      reply.header('Content-Type', 'text/html; charset=utf-8');
      return reply.send(successHtml);
    }

    // Failure HTML
    const failHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تراکنش ناموفق - اپ‌ساز</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Tahoma, sans-serif; background: #f3f4f6; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 90vh; }
    .receipt { background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); width: 100%; max-width: 480px; text-align: center; padding: 32px 24px; border-top: 6px solid #ef4444; }
    .icon { width: 64px; height: 64px; background: #fee2e2; color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px; }
    h1 { font-size: 20px; color: #991b1b; margin-bottom: 8px; }
    p { font-size: 13px; color: #6b7280; margin-bottom: 24px; }
    .btn { display: inline-block; background: #374151; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; width: 85%; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="icon">✕</div>
    <h1>پرداخت انجام نشد</h1>
    <p>${verification.error || 'تراکنش توسط کاربر لغو گردید یا در ارتباط با شاپرک مشکلی پیش آمد.'}</p>
    <a href="http://localhost:3000" class="btn">تلاش مجدد و بازگشت به استودیو</a>
  </div>
</body>
</html>`;

    reply.header('Content-Type', 'text/html; charset=utf-8');
    return reply.status(400).send(failHtml);
  });

  // 5. Get User's Active Subscription & Quota Usage
  server.get('/api/subscriptions/my-subscription', async (request, reply) => {
    const user = await resolveUser(request);

    let userId = user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser?.id;
    }

    if (!userId) {
      return reply.status(401).send({ success: false, error: 'کاربر احراز هویت نشده است.' });
    }

    const quotaInfo = await QuotaService.checkBuildQuota(userId);
    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
      orderBy: { expiresAt: 'desc' },
    });

    const daysRemaining = activeSub
      ? Math.ceil((new Date(activeSub.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;

    return reply.send({
      success: true,
      subscription: activeSub,
      daysRemaining,
      quota: quotaInfo,
    });
  });
};
