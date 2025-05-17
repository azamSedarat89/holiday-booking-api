import { Injectable } from '@nestjs/common';
import { PaymentResult } from './interface/payment.interface';

@Injectable()
export class PaymentService {
  /**
   * شبیه‌سازی پرداخت: 90% شانس موفقیت، 10% شانس خطا
   */
  async processPayment(_amount: number): Promise<PaymentResult> {
    const isSuccess = Math.random() < 0.9;
    await new Promise((r) => setTimeout(r, 500)); // شبیه‌سازی تاخیر شبکه

    if (isSuccess) {
      return {
        status: 'success',
        transactionId: 'tx_' + Math.random().toString(36).substring(2, 12),
      };
    } else {
      return {
        status: 'failed',
        errorMessage: 'Payment was declined by the bank',
      };
    }
  }
}
