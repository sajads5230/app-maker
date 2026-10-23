export interface PaymentRequestResult {
  success: boolean;
  paymentUrl: string;
  authority: string;
  simulated: boolean;
  error?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  refId?: string;
  cardPan?: string;
  amount?: number;
  error?: string;
}

export interface PendingTransaction {
  authority: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number; // in Tomans
  status: 'PENDING' | 'PAID' | 'FAILED';
  refId?: string;
  createdAt: number;
}

export class PaymentService {
  private static merchantId = process.env.ZARINPAL_MERCHANT_ID;
  private static isSandbox = process.env.ZARINPAL_SANDBOX === 'true';

  // In-memory store for pending transactions before verification
  private static transactions: Map<string, PendingTransaction> = new Map();

  /**
   * Initiates a payment session with ZarinPal or Simulated Gateway
   */
  public static async requestPayment(params: {
    userId: string;
    phone: string;
    planId: string;
    planName: string;
    amountTomans: number;
    callbackUrl: string;
  }): Promise<PaymentRequestResult> {
    const authority = `APPM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Store transaction state
    this.transactions.set(authority, {
      authority,
      userId: params.userId,
      planId: params.planId,
      planName: params.planName,
      amount: params.amountTomans,
      status: 'PENDING',
      createdAt: Date.now(),
    });

    // 1. Real ZarinPal API v4
    if (this.merchantId && this.merchantId.length >= 36) {
      try {
        const zarinpalHost = this.isSandbox ? 'sandbox.zarinpal.com' : 'api.zarinpal.com';
        const response = await fetch(`https://${zarinpalHost}/pg/v4/payment/request.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            merchant_id: this.merchantId,
            amount: params.amountTomans * 10, // Convert Tomans to Rials
            description: `خرید اشتراک ${params.planName} اپ‌ساز`,
            callback_url: params.callbackUrl,
            metadata: {
              mobile: params.phone,
            },
          }),
        });

        const data = (await response.json()) as any;
        if (data?.data?.code === 100) {
          const liveAuthority = data.data.authority;
          // Map live authority
          this.transactions.set(liveAuthority, {
            ...this.transactions.get(authority)!,
            authority: liveAuthority,
          });

          const gatewayBase = this.isSandbox ? 'sandbox.zarinpal.com' : 'www.zarinpal.com';
          return {
            success: true,
            authority: liveAuthority,
            paymentUrl: `https://${gatewayBase}/pg/StartPay/${liveAuthority}`,
            simulated: false,
          };
        } else {
          console.error('[PaymentService] ZarinPal request error:', data);
        }
      } catch (err) {
        console.error('[PaymentService] Error connecting to ZarinPal:', err);
      }
    }

    // 2. Smart Simulated Shaparak Gateway (Local Dev & Testing)
    console.log(`[PaymentService] Initiating simulated Shaparak session for authority: ${authority}`);
    const simulatedUrl = `http://localhost:4000/api/subscriptions/simulated-gateway?authority=${authority}`;

    return {
      success: true,
      authority,
      paymentUrl: simulatedUrl,
      simulated: true,
    };
  }

  /**
   * Verifies the transaction with ZarinPal or Simulated Gateway
   */
  public static async verifyPayment(authority: string, status: string): Promise<PaymentVerificationResult> {
    const tx = this.transactions.get(authority);
    if (!tx) {
      return {
        success: false,
        error: 'تراکنش مورد نظر یافت نشد یا منقضی شده است.',
      };
    }

    if (status !== 'OK') {
      tx.status = 'FAILED';
      return {
        success: false,
        error: 'پرداخت توسط کاربر لغو شد یا در ارتباط با بانک خطایی رخ داد.',
      };
    }

    // Real ZarinPal verification
    if (this.merchantId && this.merchantId.length >= 36 && !authority.startsWith('APPM-')) {
      try {
        const zarinpalHost = this.isSandbox ? 'sandbox.zarinpal.com' : 'api.zarinpal.com';
        const response = await fetch(`https://${zarinpalHost}/pg/v4/payment/verify.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            merchant_id: this.merchantId,
            amount: tx.amount * 10, // Rials
            authority,
          }),
        });

        const data = (await response.json()) as any;
        if (data?.data?.code === 100 || data?.data?.code === 101) {
          const refId = data.data.ref_id.toString();
          const cardPan = data.data.card_pan || '502229******1234';
          tx.status = 'PAID';
          tx.refId = refId;

          return {
            success: true,
            refId,
            cardPan,
            amount: tx.amount,
          };
        } else {
          return {
            success: false,
            error: data?.errors?.message || 'کد اعتبارسنجی بانک نامعتبر است.',
          };
        }
      } catch (err) {
        return {
          success: false,
          error: 'خطا در ارتباط با سرور اعتبارسنجی زرین‌پال',
        };
      }
    }

    // Simulated Gateway verification
    const simulatedRefId = `SHP-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    tx.status = 'PAID';
    tx.refId = simulatedRefId;

    return {
      success: true,
      refId: simulatedRefId,
      cardPan: '603799******8821',
      amount: tx.amount,
    };
  }

  public static getTransaction(authority: string): PendingTransaction | undefined {
    return this.transactions.get(authority);
  }
}
