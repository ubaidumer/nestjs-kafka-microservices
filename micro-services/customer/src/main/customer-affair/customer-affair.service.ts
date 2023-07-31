import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerAffairRepository } from './customer-affair.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class CustomerAffairService {
  constructor(
    private readonly customerAffairRepository: CustomerAffairRepository,
  ) {}

  // Bussiness functions

  // create customer Affair service function
  async createCustomerAffair(customerId, body) {
    try {
      const { orderId } = body;
      if (orderId) {
        await this.validateCustomerIdAndOrderId(customerId, orderId);
      }
      const data = await (
        await this.customerAffairRepository.create({ customerId, ...body })
      ).identifiers[0];
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search customer Affair service function
  async findAllCustomerAffair(query) {
    try {
      const { page = 0, limit = 10 } = query;
      const data = await this.customerAffairRepository.find({
        skip: page * limit,
        take: limit,
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

  // search customer Affair by customer Affair id service function
  async findOneCustomerAffair(id) {
    try {
      await this.validateId(id);
      const data = await this.customerAffairRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search one customer all Affairs by customer id service function
  async findOneCustomerAllCustomerAffair(id, query) {
    try {
      const { page = 0, limit = 10 } = query;
      const data = await this.customerAffairRepository.findByCustomerId(id, {
        skip: page * limit,
        take: limit,
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

  // delete customer Affair service function
  async deleteCustomerAffair(id) {
    try {
      await this.validateId(id);
      const data = await this.customerAffairRepository.delete(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // util functions

  // validates customer Affair id
  async validateId(id) {
    const checkId = await this.customerAffairRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('CUSTOMER_E0008');
    }
    return;
  }

  // validates customer id and order id
  async validateCustomerIdAndOrderId(customerId, orderId) {
    const checkId =
      await this.customerAffairRepository.findByCustomerIdAndOrderId(
        customerId,
        orderId,
      );
    if (customerId !== null && orderId !== null && checkId) {
      throw new BadRequestException('CUSTOMER_E0004');
    }
    return;
  }
}
