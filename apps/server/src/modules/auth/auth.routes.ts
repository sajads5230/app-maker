import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';
import { SmsService } from './sms.service.js';
import { OtpService } from './otp.service.js';
import { WooCommerceService, WooCredentials } from '../woocommerce/woocommerce.service.js';

export const authRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // 1. Request SMS OTP (with Rate Limiting & Kavenegar integration)
  server.post('/api/auth/otp/request', async (request, reply) => {
    const { phone } = request.body as { phone?: string };

    if (!phone || !/^09[0-9]{9}$/.test(phone.trim())) {
      return reply.status(400).send({
        success: false,
        error: 'شماره موبایل وارد شده معتبر نیست. لطفاً با ۰۹ شروع کنید (۱۱ رقم).',
      });
    }

    const cleanPhone = phone.trim();

    // Rate Limiting check
    const rateLimitCheck = OtpService.checkRateLimit(cleanPhone);
    if (!rateLimitCheck.allowed) {
      return reply.status(429).send({
        success: false,
        error: rateLimitCheck.error,
        cooldownSeconds: rateLimitCheck.remainingCooldown || 60,
      });
    }

    // Generate secure 5-digit OTP
    const code = OtpService.generateOtp(cleanPhone);

    // Send SMS via Kavenegar / FarazSMS / Dev Simulator
    const smsResult = await SmsService.sendOtp(cleanPhone, code);
    if (!smsResult.success) {
      return reply.status(502).send({
        success: false,
        error: smsResult.error || 'خطا در اتصال به مرکز پیامک. لطفاً دقایقی دیگر تلاش فرمایید.',
      });
    }

    return reply.send({
      success: true,
      message: `کد تایید ۵ رقمی به شماره ${cleanPhone} ارسال شد.`,
      cooldownSeconds: 60,
      simulated: smsResult.simulated,
    });
  });

  // 2. Verify SMS OTP (Cryptographic validation + Brute-force protection)
  server.post('/api/auth/otp/verify', async (request, reply) => {
    const { phone, code, name } = request.body as { phone?: string; code?: string; name?: string };

    if (!phone || !code) {
      return reply.status(400).send({
        success: false,
        error: 'شماره موبایل و کد تایید الزامی هستند.',
      });
    }

    const cleanPhone = phone.trim();
    const cleanCode = code.trim();

    // Verify OTP against TTL store
    const verifyResult = OtpService.verifyOtp(cleanPhone, cleanCode);
    if (!verifyResult.valid) {
      return reply.status(400).send({
        success: false,
        error: verifyResult.error || 'کد تایید نامعتبر است.',
      });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone: cleanPhone },
      include: { subscriptions: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: cleanPhone,
          name: name || 'کاربر گرامی',
          subscriptions: {
            create: {
              plan: 'PRO',
              price: 13500000,
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year free trial on registration
            },
          },
        },
        include: { subscriptions: true },
      });
    }

    const token = server.jwt.sign({
      id: user.id,
      phone: user.phone,
      role: user.role,
    });

    // Optionally synchronize with WooCommerce Customer
    let customerData = null;
    try {
      const wooCreds: WooCredentials = {
        siteUrl: 'https://xiaomismart.ir',
        consumerKey: 'ck_dbddac7f3b85c3203bfd79ef0d829cb523899110',
        consumerSecret: 'cs_12300c6b1e73129145873e5579c628e7a59f92fe',
      };
      const syncRes = await WooCommerceService.syncCustomer(wooCreds, {
        phone: cleanPhone,
        name: user.name || name || 'کاربر گرامی',
      });
      if (syncRes.success && syncRes.customer) {
        customerData = syncRes.customer;
      }
    } catch (_) {}

    return reply.send({
      success: true,
      message: 'ورود با موفقیت انجام شد.',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        subscriptions: user.subscriptions,
        customer: customerData,
      },
    });
  });

  // 3. Current User Profile
  server.get('/api/auth/me', { preHandler: [server.authenticate] }, async (request, reply) => {
    const userPayload = request.user as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: userPayload.id },
      include: {
        subscriptions: true,
        projects: {
          select: { id: true, name: true, packageName: true, updatedAt: true },
        },
      },
    });

    if (!user) {
      return reply.status(404).send({ success: false, error: 'کاربر یافت نشد.' });
    }

    return reply.send({ success: true, user });
  });
};
