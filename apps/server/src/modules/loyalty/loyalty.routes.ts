import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';

export const loyaltyRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Ensure seed demo members for realistic showcase
  const ensureSeedDemoMembers = async (projectId: string) => {
    const count = await prisma.loyaltyAccount.count({ where: { projectId } });
    if (count === 0) {
      const user1 = await prisma.loyaltyAccount.create({
        data: {
          projectId,
          phone: '09123232580',
          customerName: 'رضا کمالی',
          points: 1850,
          lifetimePoints: 2450,
          tier: 'GOLD',
          lastClaimedDaily: new Date(Date.now() - 3600 * 1000 * 20),
        },
      });

      await prisma.loyaltyTransaction.createMany({
        data: [
          {
            accountId: user1.id,
            pointsChange: 1500,
            type: 'PURCHASE',
            description: 'امتیاز خرید سفارش #10209 (ساعت هوشمند Watch S3)',
          },
          {
            accountId: user1.id,
            pointsChange: 10,
            type: 'DAILY_BONUS',
            description: 'پاداش ورود روزانه به اپلیکیشن',
          },
          {
            accountId: user1.id,
            pointsChange: -500,
            type: 'REDEEM',
            couponCode: 'LOYAL-50K-GOLD',
            description: 'تبدیل ۵۰۰ امتیاز به بن خرید ۵۰ هزار تومانی',
          },
        ],
      });

      const user2 = await prisma.loyaltyAccount.create({
        data: {
          projectId,
          phone: '09358765432',
          customerName: 'مریم حسینی',
          points: 720,
          lifetimePoints: 920,
          tier: 'SILVER',
          lastClaimedDaily: new Date(Date.now() - 3600 * 1000 * 10),
        },
      });

      await prisma.loyaltyTransaction.create({
        data: {
          accountId: user2.id,
          pointsChange: 720,
          type: 'PURCHASE',
          description: 'امتیاز خرید سفارش گوشی 14T Pro',
        },
      });
    }
  };

  // 1. Get Loyalty Program Rules & Tiers Configuration
  server.get('/api/projects/:projectId/loyalty/config', async (request, reply) => {
    return reply.send({
      success: true,
      config: {
        pointsPerPurchaseRatio: 1, // 1 point per 10,000 Tomans
        dailyBonusPoints: 10,
        pointsRedeemValueTomans: 100, // 1 point = 100 Tomans discount
        minRedeemPoints: 200, // min 200 pts (20k Tomans)
        tiers: [
          {
            id: 'BRONZE',
            name: 'باشگاه برنزی',
            minPoints: 0,
            maxPoints: 499,
            discountPercent: 3,
            color: '#CD7F32',
            perks: ['تخفیف پایه ۳٪', 'پاداش روزانه ۱۰ امتیاز'],
          },
          {
            id: 'SILVER',
            name: 'باشگاه نقره‌ای',
            minPoints: 500,
            maxPoints: 1499,
            discountPercent: 5,
            color: '#C0C0C0',
            perks: ['ارسال رایگان سفارش‌ها', 'تخفیف ۵٪ روی تمامی محصولات', 'پاداش ورود روزانه'],
          },
          {
            id: 'GOLD',
            name: 'باشگاه طلایی',
            minPoints: 1500,
            maxPoints: 2999,
            discountPercent: 8,
            color: '#FFD700',
            perks: ['ارسال اکسپرس رایگان', 'تخفیف ۸٪', 'اولویت بررسی گارانتی', 'کد تخفیف سالروز تولد'],
          },
          {
            id: 'VIP',
            name: 'عضویت الماس (VIP)',
            minPoints: 3000,
            maxPoints: 999999,
            discountPercent: 12,
            color: '#9333EA',
            perks: ['تخفیف ویژه ۱۲٪ دائمی', 'پشتیبان اختصاصی VIP', 'دسترسی زودهنگام به بلک‌فرایدی'],
          },
        ],
      },
    });
  });

  // 2. Get User Loyalty Account (Balance, Tier & Transactions)
  server.get('/api/projects/:projectId/loyalty/account', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { phone } = request.query as { phone?: string };

    await ensureSeedDemoMembers(projectId);

    const targetPhone = phone || '09123232580';

    let account = await prisma.loyaltyAccount.findUnique({
      where: {
        projectId_phone: {
          projectId,
          phone: targetPhone,
        },
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!account) {
      account = await prisma.loyaltyAccount.create({
        data: {
          projectId,
          phone: targetPhone,
          customerName: 'کاربر وفادار شیائومی',
          points: 100, // 100 welcome points!
          lifetimePoints: 100,
          tier: 'BRONZE',
        },
        include: {
          transactions: true,
        },
      });

      await prisma.loyaltyTransaction.create({
        data: {
          accountId: account.id,
          pointsChange: 100,
          type: 'DAILY_BONUS',
          description: 'پاداش ۱۰۰ امتیازی عضویت در باشگاه وفاداری',
        },
      });
    }

    // Determine tier progress
    let nextTierName = 'نقره‌ای';
    let nextTierPoints = 500;
    let progressPercent = Math.min(100, Math.round((account.points / 500) * 100));

    if (account.points >= 3000) {
      nextTierName = 'الماس VIP (بالاترین سطح)';
      nextTierPoints = 3000;
      progressPercent = 100;
    } else if (account.points >= 1500) {
      nextTierName = 'الماس VIP';
      nextTierPoints = 3000;
      progressPercent = Math.min(100, Math.round(((account.points - 1500) / 1500) * 100));
    } else if (account.points >= 500) {
      nextTierName = 'طلایی';
      nextTierPoints = 1500;
      progressPercent = Math.min(100, Math.round(((account.points - 500) / 1000) * 100));
    }

    // Check if daily bonus can be claimed today
    const canClaimDaily =
      !account.lastClaimedDaily ||
      Date.now() - new Date(account.lastClaimedDaily).getTime() > 24 * 3600 * 1000;

    return reply.send({
      success: true,
      account: {
        ...account,
        progressPercent,
        nextTierName,
        nextTierPoints,
        canClaimDaily,
      },
    });
  });

  // 3. Claim Daily Login Bonus (+10 points)
  server.post('/api/projects/:projectId/loyalty/claim-daily', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { phone } = request.body as { phone?: string };

    const targetPhone = phone || '09123232580';

    const account = await prisma.loyaltyAccount.findUnique({
      where: {
        projectId_phone: {
          projectId,
          phone: targetPhone,
        },
      },
    });

    if (!account) {
      return reply.status(404).send({ success: false, error: 'حساب کاربری یافت نشد.' });
    }

    const lastClaimed = account.lastClaimedDaily ? new Date(account.lastClaimedDaily).getTime() : 0;
    if (Date.now() - lastClaimed < 24 * 3600 * 1000) {
      return reply.status(400).send({
        success: false,
        error: 'شما پاداش روزانه امروز خود را دریافت کرده‌اید. فردا مجدداً سر بزنید!',
      });
    }

    const bonus = 10;
    const newPoints = account.points + bonus;
    const newLifetime = account.lifetimePoints + bonus;

    let newTier = account.tier;
    if (newPoints >= 3000) newTier = 'VIP';
    else if (newPoints >= 1500) newTier = 'GOLD';
    else if (newPoints >= 500) newTier = 'SILVER';

    const updated = await prisma.loyaltyAccount.update({
      where: { id: account.id },
      data: {
        points: newPoints,
        lifetimePoints: newLifetime,
        tier: newTier,
        lastClaimedDaily: new Date(),
      },
    });

    await prisma.loyaltyTransaction.create({
      data: {
        accountId: account.id,
        pointsChange: bonus,
        type: 'DAILY_BONUS',
        description: 'پاداش ۱۰ امتیازی ورود روزانه به اپلیکیشن',
      },
    });

    return reply.send({
      success: true,
      message: `🎉 تبریک! ۱۰ امتیاز هدیه ورود روزانه به حساب شما افزوده شد. موجودی جدید: ${newPoints} امتیاز`,
      newPoints,
      tier: newTier,
    });
  });

  // 4. Redeem Points to Discount Coupon
  server.post('/api/projects/:projectId/loyalty/redeem', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { phone, pointsToRedeem } = request.body as { phone?: string; pointsToRedeem: number };

    const targetPhone = phone || '09123232580';
    const points = pointsToRedeem || 500;

    const account = await prisma.loyaltyAccount.findUnique({
      where: {
        projectId_phone: {
          projectId,
          phone: targetPhone,
        },
      },
    });

    if (!account || account.points < points) {
      return reply.status(400).send({
        success: false,
        error: `موجودی امتیاز کافی نیست. شما دارای ${account?.points || 0} امتیاز هستید.`,
      });
    }

    const discountTomans = points * 100; // e.g. 500 pts = 50,000 Tomans
    const couponCode = `LOYAL-${Math.round(discountTomans / 1000)}K-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newPoints = account.points - points;

    const updated = await prisma.loyaltyAccount.update({
      where: { id: account.id },
      data: {
        points: newPoints,
      },
    });

    await prisma.loyaltyTransaction.create({
      data: {
        accountId: account.id,
        pointsChange: -points,
        type: 'REDEEM',
        couponCode,
        description: `تبدیل ${points} امتیاز به بن تخفیف ${discountTomans.toLocaleString('fa-IR')} تومانی`,
      },
    });

    return reply.send({
      success: true,
      message: `کد تخفیف «${couponCode}» با اعتبار ${discountTomans.toLocaleString('fa-IR')} تومان صادر گردید!`,
      couponCode,
      discountTomans,
      remainingPoints: newPoints,
    });
  });

  // 5. List All Members for SuperAdmin / Project Owner
  server.get('/api/projects/:projectId/loyalty/members', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    await ensureSeedDemoMembers(projectId);

    const members = await prisma.loyaltyAccount.findMany({
      where: { projectId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { points: 'desc' },
    });

    let totalPoints = 0;
    let totalRedeemedPoints = 0;

    const allTx = await prisma.loyaltyTransaction.findMany({
      where: { account: { projectId } },
    });

    allTx.forEach((tx) => {
      if (tx.pointsChange > 0) totalPoints += tx.pointsChange;
      else totalRedeemedPoints += Math.abs(tx.pointsChange);
    });

    return reply.send({
      success: true,
      stats: {
        totalMembers: members.length,
        totalPointsIssued: totalPoints,
        totalPointsRedeemed: totalRedeemedPoints,
        redeemedValueTomans: totalRedeemedPoints * 100,
      },
      members,
    });
  });

  // 6. Get Gamification Wheel Config
  server.get('/api/projects/:projectId/loyalty/wheel/config', async (request, reply) => {
    const prizes = [
      { id: 0, label: '۵۰ امتیاز باشگاه', type: 'points', value: 50, color: '#f59e0b', probability: 0.25 },
      { id: 1, label: '۱۰٪ تخفیف', type: 'discount', value: 10, color: '#ef4444', probability: 0.20 },
      { id: 2, label: 'ارسال رایگان', type: 'shipping', value: 0, color: '#10b981', probability: 0.15 },
      { id: 3, label: '۱۰۰ امتیاز طلایی', type: 'points', value: 100, color: '#8b5cf6', probability: 0.10 },
      { id: 4, label: '۲۰٪ تخفیف شگفت‌انگیز', type: 'discount', value: 20, color: '#ec4899', probability: 0.05 },
      { id: 5, label: 'شانس مجدد فردا', type: 'empty', value: 0, color: '#64748b', probability: 0.15 },
      { id: 6, label: 'کارت هدیه اختصاصی', type: 'gift', value: 50000, color: '#06b6d4', probability: 0.05 },
      { id: 7, label: '۲۰ امتیاز نقره‌ای', type: 'points', value: 20, color: '#3b82f6', probability: 0.05 },
    ];
    return reply.send({
      success: true,
      wheel: {
        title: 'گردونه شانس روزانه مشتریان',
        description: 'هر ۲۴ ساعت یکبار گردونه را بچرخانید و جوایز ویژه خرید بگیرید!',
        slicesCount: 8,
        prizes,
      },
    });
  });

  // 7. Spin Gamification Wheel
  server.post('/api/projects/:projectId/loyalty/wheel/spin', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { phone } = request.body as { phone?: string };

    const cleanPhone = phone || '09123232580';
    const prizes = [
      { id: 0, label: '۵۰ امتیاز باشگاه', type: 'points', value: 50 },
      { id: 1, label: '۱۰٪ تخفیف خرید', type: 'discount', value: 10 },
      { id: 2, label: 'ارسال رایگان سفارش', type: 'shipping', value: 0 },
      { id: 3, label: '۱۰۰ امتیاز طلایی', type: 'points', value: 100 },
      { id: 4, label: '۲۰٪ تخفیف ویژه', type: 'discount', value: 20 },
      { id: 5, label: 'فردا دوباره شانس داری!', type: 'empty', value: 0 },
      { id: 6, label: '۵۰ هزار تومان اعتبار هدیه', type: 'gift', value: 50000 },
      { id: 7, label: '۲۰ امتیاز نقره‌ای', type: 'points', value: 20 },
    ];

    // Pick weighted or random prize
    const selectedPrize = prizes[Math.floor(Math.random() * prizes.length)];
    const couponCode = selectedPrize.type !== 'empty' && selectedPrize.type !== 'points'
      ? ('WHEEL-' + Math.floor(1000 + Math.random() * 9000))
      : null;

    return reply.send({
      success: true,
      prizeIndex: selectedPrize.id,
      prize: selectedPrize,
      couponCode,
      message: 'تبریک! شما برنده ' + selectedPrize.label + ' شدید!',
    });
  });
};
