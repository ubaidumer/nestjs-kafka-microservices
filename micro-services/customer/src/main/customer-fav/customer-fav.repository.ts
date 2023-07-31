import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerFav } from 'src/entity/customer-fav.entity';
import { Repository } from 'typeorm';

// repository to customer fav table where we can make query requests to database
@Injectable()
export class CustomerFavRepository {
  constructor(
    @InjectRepository(CustomerFav)
    private customerFavRepo: Repository<CustomerFav>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.customerFavRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by customer fav id query and exception handling
  async update(id, body) {
    try {
      return await this.customerFavRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(query) {
    const { skip, take } = query;
    const response = await this.customerFavRepo.findAndCount({ skip, take });
    return {
      data: response[0],
      page: skip,
      limit: take,
      count: response[1],
    };
  }

  // search by customer fav id query and exception handling
  async findById(id) {
    try {
      return await this.customerFavRepo.findOne({
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
      return await this.customerFavRepo.find({
        where: { customerId: id },
        skip,
        take,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by customer id and product id query and exception handling
  async findByCustomerIdAndProductId(customerId, productId) {
    try {
      return await this.customerFavRepo.findOne({
        where: { customerId, productId },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by customer fav id query and exception handling
  async delete(id) {
    try {
      return await this.customerFavRepo.delete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
