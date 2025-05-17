import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { PaymentDto } from './dto/payment.dto';
import { PaymentResult } from './interface/payment.interface';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Simulate a payment' })
  @ApiResponse({ status: 201, description: 'Payment processed' })
  @ApiBadRequestResponse({ description: 'Payment failed' })
  async pay(@Body() { amount }: PaymentDto): Promise<PaymentResult> {
    const result = await this.paymentService.processPayment(amount);
    if (result.status === 'failed') {
      throw new BadRequestException(result.errorMessage);
    }
    return result;
  }
}
