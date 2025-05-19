import { PaymentStatus } from './enum/payment-status.enum';
import { PaymentService } from './payment.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(() => {
    service = new PaymentService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if amount is zero or negative', async () => {
    await expect(service.processPayment(0)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.processPayment(-100)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if amount is not a number', async () => {
    // @ts-expect-error testing invalid input
    await expect(service.processPayment('invalid')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return success result when payment is successful', async () => {
    // Mock Math.random to always return 0.5 (success)
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

    const result = await service.processPayment(100);

    expect(result.status).toBe(PaymentStatus.SUCCESS);
    expect(result.transaction_id).toMatch(/^tx_[a-z0-9]{10}$/);

    // Restore Math.random
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should throw InternalServerErrorException when payment is declined', async () => {
    // Mock Math.random to always return 0.95 (failure)
    jest.spyOn(global.Math, 'random').mockReturnValue(0.95);

    await expect(service.processPayment(100)).rejects.toThrow(
      InternalServerErrorException,
    );

    // Restore Math.random
    jest.spyOn(global.Math, 'random').mockRestore();
  });
});
