import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entity/address.entity';
import { Repository } from 'typeorm';

// repository to Address table where we can make query requests to database
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

  // update by Address id query and exception handling
  async update(id, body) {
    try {
      return await this.addressRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(data) {
    const { skip, take, sort } = data;
    const response = await this.addressRepo.findAndCount({
      skip,
      take,
      order: { createdAt: sort.toUpperCase() },
    });
    return {
      data: response[0],
      page: skip,
      limit: take,
      count: response[1],
    };
  }

  // search by Address id query and exception handling
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
}
