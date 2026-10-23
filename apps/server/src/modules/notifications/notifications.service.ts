export interface AppNotification {
  id: string;
  projectId: string;
  title: string;
  body: string;
  type: 'order' | 'discount' | 'news' | 'system';
  targetPhone?: string;
  orderId?: number;
  productId?: number;
  imageUrl?: string;
  actionUrl?: string;
  isRead?: boolean;
  createdAt: string;
  formattedDate: string;
}

export class NotificationsService {
  private static notifications: AppNotification[] = [
    {
      id: 'notif_1',
      projectId: 'app-demo-techmarket',
      title: '📦 به‌روزرسانی سفارش #10209',
      body: 'سفارش شما در سیستم ثبت و در وضعیت «در انتظار تایید و بسته‌بندی» قرار گرفت. کد رهگیری به زودی ارسال می‌شود.',
      type: 'order',
      targetPhone: '09123232580',
      orderId: 10209,
      isRead: false,
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      formattedDate: '۴ ساعت پیش',
    },
    {
      id: 'notif_2',
      projectId: 'app-demo-techmarket',
      title: '🎁 کد تخفیف ویژه ۱۰۰ هزار تومانی یلدا',
      body: 'کد تخفیف YALDA روی تمامی سفارش‌های بالای ۱ میلیون تومان در شیائومی اسمارت فعال شد!',
      type: 'discount',
      isRead: false,
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      formattedDate: 'دیروز',
    },
    {
      id: 'notif_3',
      projectId: 'app-demo-techmarket',
      title: '🚀 موجودی جدید: ماشین لباسشویی میجیا ۱۰ کیلویی',
      body: 'پرفروش‌ترین ماشین لباسشویی هوشمند شیائومی با قابلیت کنترل از راه دور با Mi Home هم‌اکنون موجود شد.',
      type: 'news',
      productId: 10160,
      imageUrl: 'https://xiaomismart.ir/wp-content/uploads/2026/08/mijia-washing.jpg',
      isRead: true,
      createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      formattedDate: '۲ روز پیش',
    },
    {
      id: 'notif_4',
      projectId: 'app-demo-techmarket',
      title: '🔐 ورود به حساب کاربری',
      body: 'ورود موفقیت‌آمیز به حساب کاربری با شماره موبایل ثبت گردید.',
      type: 'system',
      isRead: true,
      createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
      formattedDate: '۳ روز پیش',
    },
  ];

  /**
   * Retrieves inbox notifications for a project and optional user phone
   */
  public static getInbox(projectId: string = 'app-demo-techmarket', phone?: string): AppNotification[] {
    return this.notifications.filter((n) => {
      const matchProject = n.projectId === projectId || n.projectId === 'all';
      if (!matchProject) return false;
      if (n.targetPhone && phone && n.targetPhone !== phone.trim()) {
        return false;
      }
      return true;
    });
  }

  /**
   * Sends or broadcasts a new notification
   */
  public static async sendNotification(data: {
    projectId?: string;
    title: string;
    body: string;
    type?: 'order' | 'discount' | 'news' | 'system';
    targetPhone?: string;
    orderId?: number;
    productId?: number;
    imageUrl?: string;
    actionUrl?: string;
    najvaApiKey?: string;
    pushpoleAppId?: string;
  }): Promise<{ success: boolean; notification: AppNotification }> {
    const now = new Date();
    const formattedDate = 'چند لحظه پیش';

    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId: data.projectId || 'app-demo-techmarket',
      title: data.title,
      body: data.body,
      type: data.type || 'news',
      targetPhone: data.targetPhone,
      orderId: data.orderId,
      productId: data.productId,
      imageUrl: data.imageUrl,
      actionUrl: data.actionUrl,
      isRead: false,
      createdAt: now.toISOString(),
      formattedDate,
    };

    // Prepend to notifications store
    this.notifications.unshift(newNotif);

    // Najva / PushPole external push dispatch
    if (data.najvaApiKey) {
      try {
        console.log(`[NotificationsService] Dispatching push via Najva API for: ${data.title}`);
        await fetch('https://app.najva.com/api/v2/notification/campaign/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${data.najvaApiKey}`,
          },
          body: JSON.stringify({
            title: data.title,
            body: data.body,
            url: data.actionUrl || 'https://xiaomismart.ir',
          }),
        });
      } catch (err: any) {
        console.warn('[NotificationsService] Najva push network notice:', err.message);
      }
    }

    console.log(`\n======================================================`);
    console.log(`[NotificationsService] [SMART PUSH NOTIFICATION DISPATCHED]`);
    console.log(`  Title:     ${newNotif.title}`);
    console.log(`  Body:      ${newNotif.body}`);
    console.log(`  Type:      ${newNotif.type}`);
    console.log(`  Target:    ${newNotif.targetPhone || 'تمام کاربران (Broadcast)'}`);
    console.log(`======================================================\n`);

    return { success: true, notification: newNotif };
  }

  /**
   * Marks a notification as read
   */
  public static markAsRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      return true;
    }
    return false;
  }

  /**
   * Marks all notifications as read for a given project/phone
   */
  public static markAllAsRead(projectId: string = 'app-demo-techmarket', phone?: string): number {
    let count = 0;
    this.notifications.forEach((n) => {
      if (n.projectId === projectId || n.projectId === 'all') {
        if (!n.targetPhone || !phone || n.targetPhone === phone) {
          if (!n.isRead) {
            n.isRead = true;
            count++;
          }
        }
      }
    });
    return count;
  }
}
