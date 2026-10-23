export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

export class SmsService {
  private static kavenegarApiKey = process.env.KAVENEGAR_API_KEY;
  private static kavenegarTemplate = process.env.KAVENEGAR_TEMPLATE || 'verify';

  private static farazSmsApiKey = process.env.FARAZSMS_API_KEY;
  private static farazSmsPattern = process.env.FARAZSMS_PATTERN;
  private static farazSmsSender = process.env.FARAZSMS_SENDER || '+983000505';

  /**
   * Sends 5-digit verification OTP code via Kavenegar lookup pattern or FarazSMS
   */
  public static async sendOtp(phone: string, code: string): Promise<SmsSendResult> {
    const formattedPhone = phone.trim();

    // 1. Kavenegar Lookup Mode (Fastest & passes advertising blacklist)
    if (this.kavenegarApiKey) {
      try {
        const url = new URL(`https://api.kavenegar.com/v1/${this.kavenegarApiKey}/verify/lookup.json`);
        url.searchParams.set('receptor', formattedPhone);
        url.searchParams.set('token', code);
        url.searchParams.set('template', this.kavenegarTemplate);

        const response = await fetch(url.toString(), { method: 'POST' });
        const data = (await response.json()) as any;

        if (response.ok && data?.return?.status === 200) {
          console.log(`[SmsService] OTP sent successfully via Kavenegar to ${formattedPhone}`);
          return {
            success: true,
            messageId: data.entries?.[0]?.messageid?.toString(),
            simulated: false,
          };
        } else {
          console.error(`[SmsService] Kavenegar error:`, data);
          return {
            success: false,
            error: data?.return?.message || 'خطا در ارسال پیامک کاوه نگار',
          };
        }
      } catch (err) {
        console.error(`[SmsService] Network error connecting to Kavenegar:`, err);
        return {
          success: false,
          error: 'عدم برقراری ارتباط با وب‌سرویس پیامک کاوه نگار',
        };
      }
    }

    // 2. FarazSMS / IPPanel Pattern Mode
    if (this.farazSmsApiKey && this.farazSmsPattern) {
      try {
        const response = await fetch('https://api2.ippanel.com/api/v1/sms/pattern/normal/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.farazSmsApiKey,
          },
          body: JSON.stringify({
            code: this.farazSmsPattern,
            sender: this.farazSmsSender,
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
          };
        } else {
          console.error(`[SmsService] FarazSMS error:`, data);
        }
      } catch (err) {
        console.error(`[SmsService] Network error connecting to FarazSMS:`, err);
      }
    }

    // 3. Fallback / Dev Simulator (Safe and transparent for local development)
    console.log(`\n======================================================`);
    console.log(`[SmsService] [DEV SIMULATOR - SMS GATEWAY]`);
    console.log(`  To Phone:     ${formattedPhone}`);
    console.log(`  OTP Code:     ${code}`);
    console.log(`  Validity:     120 seconds`);
    console.log(`  Set KAVENEGAR_API_KEY in .env to activate live cellular delivery.`);
    console.log(`======================================================\n`);

    return {
      success: true,
      simulated: true,
    };
  }
}
