import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { AddressService } from './address.service';

// Routes for Address Api's
@Controller()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Address is added by admin route
  @MessagePattern('topic-admin-address-createAddress')
  async createAddress(@Payload() data) {
    const result = await this.addressService.createAddress({
      ...data.body,
      adminId: data.id,
    });
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S1001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
  // find all admin Address route
  @MessagePattern('topic-admin-address-findAllAddress')
  async findAllAddress(@Payload() data) {
    const result = await this.addressService.findAllAddress(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S1002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one admin address using Address id route
  @MessagePattern('topic-admin-address-findOneAddress')
  async findOneAddress(@Payload() data) {
    const result = await this.addressService.findOneAddress(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S1003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one admin all Address using admin id route
  @MessagePattern('topic-admin-address-findOneAdminAllAddress')
  async findOneAdminAllAddress(@Payload() data) {
    const result = await this.addressService.findOneAdminAllAddress(
      data.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S1002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one Address using Address id route
  @MessagePattern('topic-admin-address-updateAddress')
  async updateAddress(@Payload() data) {
    const result = await this.addressService.updateAddress(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S1004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
