import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { VoucherService } from './voucher.service';

// Routes for Voucher Api's
@Controller()
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  // create voucher route
  @MessagePattern('topic-product-voucher-createVoucher')
  async createVoucher(@Payload() data) {
    const result = await this.voucherService.create(data.id, data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S5001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all vouchers route
  @MessagePattern('topic-product-voucher-findAllVouchers')
  async findAllVoucher(@Payload() data) {
    const result = await this.voucherService.getAllVouchers(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S5002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one using voucher id route
  @MessagePattern('topic-product-voucher-findOneVoucher')
  async findOneVoucher(@Payload() data) {
    const result = await this.voucherService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S5003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one voucher using voucher id route
  @MessagePattern('topic-product-voucher-updateVoucher')
  async updateVoucher(@Payload() data) {
    const result = await this.voucherService.updateVoucherById(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S5004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete one voucher using voucher id route
  @MessagePattern('topic-product-voucher-deleteVoucher')
  async deleteVoucher(@Payload() data) {
    const result = await this.voucherService.deleteVoucherById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S5005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one customer all vouchers using customer id route
  @MessagePattern('topic-product-voucher-findAllVouchersByCustomerId')
  async findOneVoucherByCustomerId(@Payload() data) {
    const result = await this.voucherService.findVoucherByCustomerId(
      data.param.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S5006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // customer apply for vouchers route
  @MessagePattern('topic-product-voucher-applyForVoucherByCustomer')
  async applyForVoucher(@Payload() data) {
    const result = await this.voucherService.applyForVoucher(
      data.param.id,
      data.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S5007',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // customer request to use a voucher route
  @MessagePattern('topic-product-voucher-useVoucherByCustomer')
  async useVoucherByCustomer(@Payload() data) {
    const result = await this.voucherService.useVoucherByCustomer(
      data.param.id,
      data.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S5008',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
