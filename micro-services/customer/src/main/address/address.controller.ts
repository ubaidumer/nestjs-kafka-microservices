import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { formatResponse } from 'src/utils/response';
import { AddressService } from './address.service';

// Routes for address Api's
@Controller()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // create route
  @MessagePattern('topic-customer-address-createAddress')
  async createAddress(@Payload() data) {
    const result = await this.addressService.createAddress(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S0001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all addresses route
  @MessagePattern('topic-customer-address-findAllAddress')
  async findAllAddress(@Payload() data) {
    const result = await this.addressService.findAllAddress(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S0002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one address using address id route
  @MessagePattern('topic-customer-address-findOneAddress')
  async findOneAddress(@Payload() data) {
    const result = await this.addressService.findOneAddress(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S0003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one customers all addresses using customer id route
  @MessagePattern('topic-customer-address-findOneCustomerAllAddress')
  async findOneCustomerAllAddress(@Payload() data) {
    const result = await this.addressService.findOneCustomerAllAddress(
      data.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S0002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one address using address id route
  @MessagePattern('topic-customer-address-updateAddress')
  async updateAddress(@Payload() data) {
    const result = await this.addressService.updateAddress(
      data.param.id,
      data.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S0004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
