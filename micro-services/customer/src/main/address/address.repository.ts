import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entity/address.entity';
import { Repository } from 'typeorm';

// repository to address table where we can make query requests to database
@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.addressRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by address id query and exception handling
  async update(id, body) {
    try {
      return await this.addressRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(query) {
    const { skip, take } = query;
    const response = await this.addressRepo.findAndCount({ skip, take });
    return {
      data: response[0],
      page: skip,
      limit: take,
      count: response[1],
    };
  }

  // search by address id query and exception handling
  async findById(id) {
    try {
      return await this.addressRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by customer id query and exception handling
  async findByCustomerId(customerId, query) {
    try {
      const { skip, take } = query;
      return await this.addressRepo.find({
        where: { customerId },
        skip,
        take,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by address type , customer id and exception handling
  async findByAddressTypeAndCustomerId(addressType, customerId) {
    try {
      return await this.addressRepo.findOne({
        where: { addressType, customerId },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by address id , customer id and exception handling
  async findByAddressIdAndCustomerId(id, customerId) {
    try {
      return await this.addressRepo.findOne({
        where: { id, customerId },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
