import { prisma } from '../../prisma.js';

export interface PlanDetails {
  id: string;
  name: string;
  period: string;
  price: number;
  formattedPrice: string;
  days: number;
  maxBuildsPerMonth: number;
  watermark: boolean;
  features: string[];
  recommended?: boolean;
}

export class QuotaService {
  public static PLANS: Record<string, PlanDetails> = {
    plan_basic: {
      id: 'plan_basic',
      name: 'پایه',
      period: '۴ ماهه',
      price: 2200000,
      formattedPrice: '۲,۲۰۰,۰۰۰ تومان',
      days: 120,
      maxBuildsPerMonth: 5,
      watermark: true,
      features: [
        'خروجی اندروید (APK و AAB)',
        '۵ بیلد ابری در ماه',
        'همگام‌سازی مستقیم با ووکامرس',
        'پشتیبانی عمومی آنلاین',
        'اتصال درگاه‌های بانکی عضو شتاب',
      ],
      recommended: false,
    },
    plan_pro: {
      id: 'plan_pro',
      name: 'کسب‌وکار حرفه‌ای',
      period: 'سالیانه',
      price: 13500000,
      formattedPrice: '۱۳,۵۰۰,۰۰۰ تومان',
      days: 365,
      maxBuildsPerMonth: 50,
      watermark: false,
      features: [
        'خروجی رسمی اندروید (APK و AAB ساین‌شده)',
        '۵۰ بیلد ابری در ماه بدون واترمارک',
        'صدور کلید اختصاصی Keystore 2048-bit',
        'امکان اتصال تمامی ۲۹ ماژول بازارچه',
        'سیستم پوش نوتیفیکیشن اختصاصی',
        'همراهی در انتشار کافه‌بازار و مایکت',
      ],
      recommended: true,
    },
    plan_lifetime: {
      id: 'plan_lifetime',
      name: 'مادام‌العمر سازمانی',
      period: 'یک‌بار پرداخت',
      price: 21900000,
      formattedPrice: '۲۱,۹۰۰,۰۰۰ تومان',
      days: 3650, // 10 years
      maxBuildsPerMonth: 9999,
      watermark: false,
      features: [
        'دسترسی کامل و مادام‌العمر بدون نیاز به تمدید',
        'بیلد ابری نامحدود بدون سقف ماهانه',
        'دانلود دائمی کلیدهای رمزنگاری Keystore',
        'پشتیبانی VIP و خط مستقیم فنی',
        'قابلیت نصب سورس روی سرور اختصاصی',
      ],
      recommended: false,
    },
  };

  /**
   * Checks whether the user has remaining build quota in the current month
   */
  public static async checkBuildQuota(userId: string): Promise<{
    allowed: boolean;
    remainingBuilds: number;
    usedBuilds: number;
    planName: string;
    reason?: string;
  }> {
    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
      orderBy: { expiresAt: 'desc' },
    });

    const rawPlan = (activeSub?.plan || 'plan_basic').toLowerCase();
    let planKey = rawPlan;
    if (rawPlan === 'lifetime') planKey = 'plan_lifetime';
    if (rawPlan === 'pro') planKey = 'plan_pro';
    if (rawPlan === 'basic') planKey = 'plan_basic';
    const plan = this.PLANS[planKey] || this.PLANS.plan_basic;

    // Count builds in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const usedBuilds = await prisma.buildJob.count({
      where: {
        project: { userId },
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ['SUCCESS', 'BUILDING'] },
      },
    });

    const remainingBuilds = Math.max(0, plan.maxBuildsPerMonth - usedBuilds);
    if (remainingBuilds <= 0) {
      return {
        allowed: false,
        remainingBuilds: 0,
        usedBuilds,
        planName: plan.name,
        reason: `سقف بیلد ماهانه شما (${plan.maxBuildsPerMonth} بیلد) در پلن ${plan.name} به پایان رسیده است. جهت ادامه، اشتراک خود را ارتقا دهید.`,
      };
    }

    return {
      allowed: true,
      remainingBuilds,
      usedBuilds,
      planName: plan.name,
    };
  }
}
