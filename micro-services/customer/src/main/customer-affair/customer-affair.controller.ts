import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';

import { CustomerAffairService } from './customer-affair.service';

// Routes for customer Affair Api's

@Controller()
export class CustomerAffairController {
  constructor(private readonly customerAffairService: CustomerAffairService) {}

  // create route for customer Affair
  @MessagePattern('topic-customer-affair-createAffair')
  async createCustomerAffair(@Payload() data) {
    const result = await this.customerAffairService.createCustomerAffair(
      data.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S3001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search route for all customer Affairs
  @MessagePattern('topic-customer-affair-findAllAffair')
  async findAllCustomerAffair(@Payload() data) {
    const result = await this.customerAffairService.findAllCustomerAffair(
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S3002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by customer Affair id route for one customer affair
  @MessagePattern('topic-customer-affair-findOneAffair')
  async findOneCustomerAffair(@Payload() data) {
    const result = await this.customerAffairService.findOneCustomerAffair(
      data.param.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S3003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by customer id route for one customer all Affairs
  @MessagePattern('topic-customer-affair-findOneCustomerAllAffair')
  async findOneCustomerAllCustomerAffair(@Payload() data) {
    const result =
      await this.customerAffairService.findOneCustomerAllCustomerAffair(
        data.id,
        data.query,
      );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S3002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete route for customer Affair
  @MessagePattern('topic-customer-affair-deleteAffair')
  async deleteCustomerAffair(@Payload() data) {
    const result = await this.customerAffairService.deleteCustomerAffair(
      data.param.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S3004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
