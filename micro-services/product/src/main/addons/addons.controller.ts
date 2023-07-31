import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { AddonsService } from './addons.services';

// Routes for addons Api's
@Controller()
export class AddOnsController {
  constructor(private readonly addonsService: AddonsService) {}

  // create addons route
  @MessagePattern('topic-product-addons-createAddons')
  async createAddons(@Payload() data) {
    const result = await this.addonsService.create(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S7001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all addons route
  @MessagePattern('topic-product-addons-findAllAddons')
  async findAllAddons(@Payload() data) {
    const result = await this.addonsService.findAllAddons(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S7002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one addons using menu id route
  @MessagePattern('topic-product-addons-findOneAddons')
  async findOneAddons(@Payload() data) {
    const result = await this.addonsService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S7003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one addons using menu id route
  @MessagePattern('topic-product-addons-updateAddons')
  async updateAddons(@Payload() data) {
    const result = await this.addonsService.updateAddonsById(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S7004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete one addons using menu id route
  @MessagePattern('topic-product-addons-deleteAddons')
  async deleteAddons(@Payload() data) {
    const result = await this.addonsService.deleteAddonsById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S7005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find only addons type one addons using menu id route
  @MessagePattern('topic-product-addons-findAllAddonsTypes')
  async findAllAddonsTypes() {
    const result = await this.addonsService.findAllAddonstypes();
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S7006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all addons by type one addons using menu id route
  @MessagePattern('topic-product-addons-findAllAddonsByTpyes')
  async findAllAddonsByTpyes() {
    const result = await this.addonsService.findAllAddonsObjecttypes();
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S7007',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
