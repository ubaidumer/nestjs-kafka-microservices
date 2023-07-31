import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { AddressService } from './address.service';

// Routes for Address Api's
@Controller()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  // find all riders Address route
  @MessagePattern('topic-rider-address-findAllAddress')
  async findAllAddress(@Payload() data) {
    const result = await this.addressService.findAllAddress(data);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S1002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one address using Address id route
  @MessagePattern('topic-rider-address-findOneAddress')
  async findOneAddress(@Payload() data) {
    const result = await this.addressService.findOneAddress(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S1003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one Address using Address id route
  @MessagePattern('topic-rider-address-updateAddress')
  async updateAddress(@Payload() data) {
    const result = await this.addressService.updateAddress(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S1004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
