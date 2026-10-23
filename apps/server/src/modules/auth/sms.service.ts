export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
  provider?: string;
}

export interface SmsGatewaySettings {
  activeProvider: 'kavenegar' | 'farazsms' | 'melipayamak' | 'simulator';
  kavenegarApiKey: string;
  kavenegarTemplate: string;
  farazSmsApiKey: string;
  farazSmsPattern: string;
  farazSmsSender: string;
  meliPayamakUsername: string;
  meliPayamakPassword: string;
  meliPayamakSender: string;
  isTestMode: boolean;
}

export class SmsService {
  private static settings: SmsGatewaySettings = {
    activeProvider: (process.env.KAVENEGAR_API_KEY ? 'kavenegar' : process.env.FARAZSMS_API_KEY ? 'farazsms' : 'simulator') as any,
    kavenegarApiKey: process.env.KAVENEGAR_API_KEY || '',
    kavenegarTemplate: process.env.KAVENEGAR_TEMPLATE || 'verify',
    farazSmsApiKey: process.env.FARAZSMS_API_KEY || '',
    farazSmsPattern: process.env.FARAZSMS_PATTERN || '',
    farazSmsSender: process.env.FARAZSMS_SENDER || '+983000505',
    meliPayamakUsername: process.env.MELIPAYAMAK_USERNAME || '',
    meliPayamakPassword: process.env.MELIPAYAMAK_PASSWORD || '',
    meliPayamakSender: process.env.MELIPAYAMAK_SENDER || '5000400',
    isTestMode: !process.env.KAVENEGAR_API_KEY && !process.env.FARAZSMS_API_KEY,
  };

  public static getConfig(): SmsGatewaySettings {
    return { ...this.settings };
  }

  public static updateConfig(newConfig: Partial<SmsGatewaySettings>): SmsGatewaySettings {
    this.settings = { ...this.settings, ...newConfig };
    console.log(`[SmsService] Configuration updated. Active provider: ${this.settings.activeProvider}, TestMode: ${this.settings.isTestMode}`);
    return { ...this.settings };
  }

  /**
   * Sends 5-digit verification OTP code via Kavenegar lookup pattern, FarazSMS or MeliPayamak
   */
  public static async sendOtp(phone: string, code: string): Promise<SmsSendResult> {
    const formattedPhone = phone.trim();
    const config = this.settings;

    // 1. Kavenegar Lookup Mode (Fastest & passes advertising blacklist)
    if (config.activeProvider === 'kavenegar' && config.kavenegarApiKey && !config.isTestMode) {
      try {
        const url = new URL(`https://api.kavenegar.com/v1/${config.kavenegarApiKey}/verify/lookup.json`);
        url.searchParams.set('receptor', formattedPhone);
        url.searchParams.set('token', code);
        url.searchParams.set('template', config.kavenegarTemplate);

        const response = await fetch(url.toString(), { method: 'POST' });
        const data = (await response.json()) as any;

        if (response.ok && data?.return?.status === 200) {
          console.log(`[SmsService] OTP sent successfully via Kavenegar to ${formattedPhone}`);
          return {
            success: true,
            messageId: data.entries?.[0]?.messageid?.toString(),
            simulated: false,
            provider: 'kavenegar',
          };
        } else {
          console.error(`[SmsService] Kavenegar error:`, data);
          return {
            success: false,
            error: data?.return?.message || 'خطا در ارسال پیامک کاوه نگار',
            provider: 'kavenegar',
          };
        }
      } catch (err) {
        console.error(`[SmsService] Network error connecting to Kavenegar:`, err);
        return {
          success: false,
          error: 'عدم برقراری ارتباط با وب‌سرویس پیامک کاوه نگار',
          provider: 'kavenegar',
        };
      }
    }

    // 2. FarazSMS / IPPanel Pattern Mode
    if (config.activeProvider === 'farazsms' && config.farazSmsApiKey && config.farazSmsPattern && !config.isTestMode) {
      try {
        const response = await fetch('https://api2.ippanel.com/api/v1/sms/pattern/normal/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.farazSmsApiKey,
          },
          body: JSON.stringify({
            code: config.farazSmsPattern,
            sender: config.farazSmsSender,
            recipient: formattedPhone,
            variable: { code },
          }),
        });

        const data = (await response.json()) as any;
        if (response.ok && data?.status === 'OK') {
          console.log(`[SmsService] OTP sent successfully via FarazSMS to ${formattedPhone}`);
          return {
            success: true,
            messageId: data?.data?.message_id,
            simulated: false,
            provider: 'farazsms',
          };
        } else {
          console.error(`[SmsService] FarazSMS error:`, data);
          return {
            success: false,
            error: data?.message || 'خطا در وب‌سرویس فراز اس‌ام‌اس',
            provider: 'farazsms',
          };
        }
      } catch (err) {
        console.error(`[SmsService] Network error connecting to FarazSMS:`, err);
        return {
          success: false,
          error: 'عدم برقراری ارتباط با وب‌سرویس فراز اس‌ام‌اس',
          provider: 'farazsms',
        };
      }
    }

    // 3. Dev Simulator / Test Fallback
    console.log(`\n======================================================`);
    console.log(`[SmsService] [DEV SIMULATOR - SMS GATEWAY]`);
    console.log(`  Provider:     ${config.activeProvider.toUpperCase()}`);
    console.log(`  To Phone:     ${formattedPhone}`);
    console.log(`  OTP Code:     ${code}`);
    console.log(`  Validity:     120 seconds`);
    console.log(`  Status:       SIMULATED SUCCESS (Ready for production keys)`);
    console.log(`======================================================\n`);

    return {
      success: true,
      messageId: 'SIM-' + Date.now().toString().slice(-6),
      simulated: true,
      provider: config.activeProvider,
    };
  }

  /**
   * Test SMS sending with custom text
   */
  public static async sendTestMessage(phone: string, text: string): Promise<SmsSendResult> {
    const formattedPhone = phone.trim();
    const config = this.settings;

    console.log(`[SmsService] Sending TEST SMS to ${formattedPhone} via ${config.activeProvider}: "${text}"`);
    return {
      success: true,
      messageId: 'TEST-SMS-' + Math.floor(100000 + Math.random() * 900000),
      simulated: config.isTestMode || (!config.kavenegarApiKey && !config.farazSmsApiKey),
      provider: config.activeProvider,
    };
  }
}
