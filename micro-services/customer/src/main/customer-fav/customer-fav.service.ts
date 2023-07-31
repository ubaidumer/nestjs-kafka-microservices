import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerFavRepository } from './customer-fav.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class CustomerFavService {
  constructor(private readonly customerFavRepository: CustomerFavRepository) {}

  // Bussiness functions

  // create customer fav service function
  async createCustomerFav(customerId, body) {
    try {
      const { productId } = body;
      if (productId) {
        await this.validateCustomerIdAndProductId(customerId, productId);
      }
      const data = await (
        await this.customerFavRepository.create({ customerId, ...body })
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

  // search customer fav service function
  async findAllCustomerFav(query) {
    try {
      const { page = 0, limit = 10 } = query;
      const data = await this.customerFavRepository.find({
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

  // search customer fav by customer fav id service function
  async findOneCustomerFav(id) {
    try {
      await this.validateId(id);
      const data = await this.customerFavRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search customer fav by customer id service function
  async findOneCustomerAllCustomerFav(id, query) {
    try {
      const { page = 0, limit = 10 } = query;
      const data = await this.customerFavRepository.findByCustomerId(id, {
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

  // delete customer fav service function
  async deleteCustomerFav(id) {
    try {
      await this.validateId(id);
      const data = await this.customerFavRepository.delete(id);
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

  // validates customer fav id
  async validateId(id) {
    const checkId = await this.customerFavRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('CUSTOMER_E0006');
    }
    return;
  }

  // validates customer id and product id
  async validateCustomerIdAndProductId(customerId, productId) {
    const checkId =
      await this.customerFavRepository.findByCustomerIdAndProductId(
        customerId,
        productId,
      );
    if (customerId !== null && productId !== null && checkId) {
      throw new BadRequestException('CUSTOMER_E0003');
    }
    return;
  }
}
