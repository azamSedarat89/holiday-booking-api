import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PaymentResult } from './interface/payment.interface';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    jest.useFakeTimers(); // کنترل تایمرها
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should return success when Math.random < 0.9', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const promise = service.processPayment(100);
    jest.advanceTimersByTime(500);
    const result: PaymentResult = await promise;

    expect(result.status).toBe('success');
    // الگوی انعطاف‌پذیرتر برای transactionId
    expect(result.transactionId).toMatch(/^tx_[a-z0-9]+$/);
    expect(
      (result as PaymentResult & { errorMessage?: string }).errorMessage,
    ).toBeUndefined();
  });

  it('should return failed when Math.random >= 0.9', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.95); // شانس شکست
    const promise = service.processPayment(100);
    jest.advanceTimersByTime(500);
    const result: PaymentResult = await promise;

    expect(result.status).toBe('failed');
    expect(result.errorMessage).toBe('Payment was declined by the bank');
    expect(
      (result as PaymentResult & { transactionId?: string }).transactionId,
    ).toBeUndefined();
  });
});
