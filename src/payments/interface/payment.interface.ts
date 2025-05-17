export interface PaymentResult {
  status: 'success' | 'failed';
  transactionId?: string;
  errorMessage?: string;
}
