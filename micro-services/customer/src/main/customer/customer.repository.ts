import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entity/customer.entity';
import { IsNull, Not, Repository } from 'typeorm';

// repository to customer table where we can make query requests to database
@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.customerRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update query and exception handling
  async update(id, body) {
    try {
      return await this.customerRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by phone no query and exception handling
  async findByPhoneNo(phoneNo) {
    try {
      return await this.customerRepo.findOne({
        where: {
          phoneNo,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by email query and exception handling
  async findByEmail(email) {
    try {
      return await this.customerRepo.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(query) {
    const { skip, take, sort, status, name } = query;

    let queryFilter = {};
    queryFilter = {
      ...queryFilter,
      ...(status && { status: status }),
      ...(name && { fullName: name }),
    };

    const response = await this.customerRepo.findAndCount({
      where: {
        fullName: Not(IsNull()),
        email: Not(IsNull()),
        phoneNo: Not(IsNull()),
        ...queryFilter,
      },
      relations: {
        address: true,
      },
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

  // search by customer id query and exception handling
  async findById(id) {
    try {
      return await this.customerRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // saga utils

  // saga query method of repository for nested object initialization
  async findCustomer(id) {
    try {
      return await this.customerRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // saga query method of repository for nested object initialization
  async addCustomerRevenue(id, revenue) {
    try {
      const customer = await this.findById(id);
      revenue = customer.revenue + revenue;
      await this.update(id, { revenue });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // saga query method of repository for nested object initialization
  async updateCustomeralternatePhoneNumber(id, alternatePhoneNo) {
    try {
      await this.update(id, { alternatePhoneNo });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
