import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerAffair } from 'src/entity/customer-affair.entity';
import { Repository } from 'typeorm';

// repository to customer Affair table where we can make query requests to database
@Injectable()
export class CustomerAffairRepository {
  constructor(
    @InjectRepository(CustomerAffair)
    private customerAffairRepo: Repository<CustomerAffair>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.customerAffairRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by customer Affair id query and exception handling
  async update(id, body) {
    try {
      return await this.customerAffairRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(query) {
    const { skip, take } = query;
    const response = await this.customerAffairRepo.findAndCount({ skip, take });
    return {
      data: response[0],
      page: skip,
      limit: take,
      count: response[1],
    };
  }

  // search by customer Affair id query and exception handling
  async findById(id) {
    try {
      return await this.customerAffairRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by customer id query and exception handling
  async findByCustomerId(id, query) {
    try {
      const { skip, take } = query;
      return await this.customerAffairRepo.find({
        where: { customerId: id },
        skip,
        take,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by customer id and order id query and exception handling
  async findByCustomerIdAndOrderId(customerId, orderId) {
    try {
      return await this.customerAffairRepo.findOne({
        where: { customerId, orderId },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by customer Affair id query and exception handling
  async delete(id) {
    try {
      return await this.customerAffairRepo.delete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
