import { BadRequestException, Injectable } from '@nestjs/common';
import { VoucherRepository } from './voucher.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class VoucherService {
  constructor(private readonly voucherRepository: VoucherRepository) {}

  // create query and exception handling
  async create(id, body) {
    try {
      const data = await this.voucherRepository.create(id, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // apply for voucher query and exception handling
  async applyForVoucher(id, customerId) {
    try {
      const data = await this.voucherRepository.applyForVoucher(id, customerId);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // customer request to use a voucher query and exception handling
  async useVoucherByCustomer(id, customerId) {
    try {
      const data = await this.voucherRepository.useVoucherByCustomer(
        id,
        customerId,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by voucher id query and exception handling
  async findById(id) {
    try {
      await this.validateId(id);
      const data = await this.voucherRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search voucher by customer id query and exception handling
  async findVoucherByCustomerId(id, query) {
    try {
      const data = await this.voucherRepository.findVoucherByCustomerId(
        id,
        query,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }
  // get all vouchers and exception handling
  async getAllVouchers(query) {
    try {
      const data = await this.voucherRepository.getAllVouchers(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by voucher id query and exception handling
  async updateVoucherById(id: string, body) {
    try {
      await this.validateId(id);
      const data = await this.voucherRepository.updateVoucherById(id, {
        ...body,
      });
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by voucher id query and exception handling
  async deleteVoucherById(id: string) {
    try {
      await this.validateId(id);
      const data = await this.voucherRepository.deleteVoucherById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates voucher id
  async validateId(id) {
    const checkId = await this.voucherRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('PRODUCT_E0007');
    }
    return;
  }
}
