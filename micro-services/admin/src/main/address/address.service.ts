import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressRepository } from './address.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  // Bussiness functions

  // create Address service function
  async createAddress(body) {
    try {
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

  // search Address service function
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

  // search by Address id service function
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

  // update by Address id service function
  async updateAddress(AddressId, body) {
    try {
      await this.validateId(AddressId);
      const data = await this.addressRepository.update(AddressId, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search Address using admin id service function
  async findOneAdminAllAddress(id, query) {
    try {
      const { page = 0, limit = 10 } = query;
      const data = await this.addressRepository.findByAdminId(id, {
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

  //util functions

  // validates Address id
  async validateId(id) {
    const checkId = await this.addressRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('ADMIN_E0006');
    }
    return;
  }
}
