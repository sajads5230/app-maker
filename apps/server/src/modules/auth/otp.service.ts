interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

interface RateLimitEntry {
  requestsInWindow: number[];
  cooldownUntil: number;
}

export class OtpService {
  private static otpStore: Map<string, OtpEntry> = new Map();
  private static rateLimitStore: Map<string, RateLimitEntry> = new Map();

  private static TTL_MS = 120 * 1000; // 2 minutes
  private static COOLDOWN_MS = 60 * 1000; // 60 seconds
  private static WINDOW_MS = 10 * 60 * 1000; // 10 minutes
  private static MAX_REQUESTS_PER_WINDOW = 4;
  private static MAX_ATTEMPTS = 5;

  /**
   * Checks rate limiting for a phone number before issuing an OTP
   */
  public static checkRateLimit(phone: string): { allowed: boolean; remainingCooldown?: number; error?: string } {
    const now = Date.now();
    const entry = this.rateLimitStore.get(phone);

    if (!entry) {
      return { allowed: true };
    }

    // 1. Check cooldown (60 seconds between consecutive requests)
    if (now < entry.cooldownUntil) {
      const waitSeconds = Math.ceil((entry.cooldownUntil - now) / 1000);
      return {
        allowed: false,
        remainingCooldown: waitSeconds,
        error: `لطفاً ${waitSeconds} ثانیه دیگر جهت درخواست مجدد کد تایید شکیبا باشید.`,
      };
    }

    // 2. Check 10-minute sliding window (max 4 SMS in 10 minutes)
    const validWindowRequests = entry.requestsInWindow.filter((t) => now - t < this.WINDOW_MS);
    if (validWindowRequests.length >= this.MAX_REQUESTS_PER_WINDOW) {
      const oldest = validWindowRequests[0];
      const waitMinutes = Math.ceil((this.WINDOW_MS - (now - oldest)) / 60000);
      return {
        allowed: false,
        error: `تعداد درخواست‌های پیامک برای این شماره بیش از حد مجاز است. لطفاً ${waitMinutes} دقیقه دیگر تلاش فرمایید.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Generates and stores a new 5-digit OTP code for a phone number
   */
  public static generateOtp(phone: string): string {
    const now = Date.now();

    // Generate random 5-digit number: 10000 - 99999
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // Store OTP
    this.otpStore.set(phone, {
      code,
      expiresAt: now + this.TTL_MS,
      attempts: 0,
    });

    // Update Rate Limiting Entry
    const rateLimit = this.rateLimitStore.get(phone) || { requestsInWindow: [], cooldownUntil: 0 };
    rateLimit.requestsInWindow = rateLimit.requestsInWindow.filter((t) => now - t < this.WINDOW_MS);
    rateLimit.requestsInWindow.push(now);
    rateLimit.cooldownUntil = now + this.COOLDOWN_MS;
    this.rateLimitStore.set(phone, rateLimit);

    return code;
  }

  /**
   * Validates an OTP code with brute-force protection
   */
  public static verifyOtp(phone: string, inputCode: string): { valid: boolean; error?: string } {
    const now = Date.now();
    const entry = this.otpStore.get(phone);

    // Development bypass for easy demo testing if not in production
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev && inputCode === '12345') {
      this.otpStore.delete(phone);
      return { valid: true };
    }

    if (!entry) {
      return {
        valid: false,
        error: 'کد تایید منقضی شده یا درخواست نشده است. لطفاً مجدداً کد دریافت کنید.',
      };
    }

    if (now > entry.expiresAt) {
      this.otpStore.delete(phone);
      return {
        valid: false,
        error: 'کد تایید منقضی شده است. لطفاً کد جدید درخواست دهید.',
      };
    }

    entry.attempts++;
    if (entry.attempts > this.MAX_ATTEMPTS) {
      this.otpStore.delete(phone);
      return {
        valid: false,
        error: 'تعداد تلاش‌های ناموفق بیش از حد مجاز بود. لطفاً کد جدید دریافت کنید.',
      };
    }

    if (entry.code !== inputCode.trim()) {
      const remainingAttempts = this.MAX_ATTEMPTS - entry.attempts;
      return {
        valid: false,
        error: `کد وارد شده اشتباه است. (${remainingAttempts} تلاش باقی مانده)`,
      };
    }

    // Success! Consume and delete the OTP code
    this.otpStore.delete(phone);
    return { valid: true };
  }
}
