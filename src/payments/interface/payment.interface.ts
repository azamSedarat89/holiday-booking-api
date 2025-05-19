import { PaymentStatus } from '../enum/payment-status.enum';

export interface PaymentResult {
  status: PaymentStatus;
  transaction_id?: string;
  errorMessage?: string;
}
