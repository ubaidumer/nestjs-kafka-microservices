import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressRepository } from './address.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  // Bussiness functions

  // create address service function
  async createAddress(body) {
    try {
      const { addressType, customerId } = body;
      await this.validateAddressType(addressType, customerId);
      const data = await (
        await this.addressRepository.create(body)
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

  // search addresses service function
  async findAllAddress(query) {
    try {
      const { page = 0, limit = 10 } = query;
      const data = await this.addressRepository.find({
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

  // search address using address id service function
  async findOneAddress(id) {
    try {
      await this.validateId(id);
      const data = await this.addressRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search address using customer id service function
  async findOneCustomerAllAddress(id, query) {
    try {
      const { page = 0, limit = 10 } = query;
      const data = await this.addressRepository.findByCustomerId(id, {
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

  // update address using address id service function
  async updateAddress(addressId, customerId, body) {
    try {
      if (body.addressType) {
        await this.validateAddressType(body.addressType, customerId);
      }
      await this.validateIdAndCustomerId(addressId, customerId);
      const data = await this.addressRepository.update(addressId, body);
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

  // validates address id
  async validateId(id) {
    const checkId = await this.addressRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('CUSTOMER_E0007');
    }
    return;
  }

  // validates address id and customer id presence
  async validateIdAndCustomerId(id, customerId) {
    const checkId = await this.addressRepository.findByAddressIdAndCustomerId(
      id,
      customerId,
    );
    if (id !== null && !checkId) {
      throw new BadRequestException('CUSTOMER_E0014');
    }
    return;
  }

  // validates address type and customer id availability
  async validateAddressType(addressType, customerId) {
    const checkAddressType =
      await this.addressRepository.findByAddressTypeAndCustomerId(
        addressType,
        customerId,
      );
    if (checkAddressType) {
      throw new BadRequestException('CUSTOMER_E0013');
    }
    return;
  }
}
