import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaymentResult } from './interface/payment.interface';
import { PaymentStatus } from './enum/payment-status.enum';

@Injectable()
export class PaymentService {
  /**
   * Processes a payment asynchronously.
   * Simulates a payment gateway with 90% success chance and 10% failure chance.
   *
   * @param amount The amount to be paid; must be a positive number.
   * @returns A promise resolving to PaymentResult on success.
   * @throws BadRequestException if amount is invalid.
   * @throws InternalServerErrorException if payment is declined.
   */
  async processPayment(amount: number): Promise<PaymentResult> {
    // Validate input amount
    if (typeof amount !== 'number' || amount <= 0) {
      throw new BadRequestException('Amount must be a positive number.');
    }

    // Simulate network delay (e.g., contacting payment gateway)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate payment success with 90% probability
    const isSuccess = Math.random() < 0.9;

    if (isSuccess) {
      // Generate transaction id with guaranteed length of 10 characters after 'tx_'
      const randomStr = Math.random().toString(36).substring(2);
      const transaction_id =
        'tx_' + (randomStr + '0000000000').substring(0, 10);

      return {
        status: PaymentStatus.SUCCESS,
        transaction_id,
      };
    } else {
      // Payment declined - throw exception for caller to handle
      throw new InternalServerErrorException(
        'Payment was declined by the bank.',
      );
    }
  }
}
