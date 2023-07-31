import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { formatResponse } from 'src/utils/response';
import { PaymentService } from './payment.service';

// Routes for payment Api's
@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // create route for payment
  @MessagePattern('topic-order-payment-createPayment')
  async createPayment(@Payload() data) {
    const result = await this.paymentService.create(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S2001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all payments route
  @MessagePattern('topic-order-payment-findAllPayments')
  async findAllPayment(@Payload() data) {
    const result = await this.paymentService.getAllPayments(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S2002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one payment using payment id route
  @MessagePattern('topic-order-payment-findOnePayment')
  async findOnePayment(@Payload() data) {
    const result = await this.paymentService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S2003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one customers all payments using customer id route
  @MessagePattern('topic-order-payment-findAllPaymentsByCustomerId')
  async findOneCustomerAllPayment(@Payload() data) {
    const result = await this.paymentService.fetchAllPaymentsByCustomerId(
      data.param.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S2004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
