import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from 'src/entity/feedback.entity';
import { Repository } from 'typeorm';

// repository to rider feedback table where we can make query requests to database
@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepo: Repository<Feedback>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.feedbackRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(data) {
    const { skip, take, sort } = data;
    const response =  await this.feedbackRepo.findAndCount({
      skip,
      take,
      order: { createdAt: sort.toUpperCase() },
    });

    return {
      data: response[0],
      page: skip,
      limit: take,
      count: response[1],
    }
  }

  // search by rider feedback id query and exception handling
  async findById(id) {
    try {
      return await this.feedbackRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by order id query and exception handling
  async findByOrderId(id) {
    try {
      return await this.feedbackRepo.find({
        where: { orderId: id },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by rider id query and exception handling
  async findByRiderId(id, query) {
    try {
      const { skip, take, sort } = query;
      return await this.feedbackRepo.find({
        where: { riderId: id },
        skip,
        take,
        order: { createdAt: sort.toUpperCase() },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by customer id query and exception handling
  async findByCustomerId(id, query) {
    try {
      const { skip, take, sort } = query;
      return await this.feedbackRepo.find({
        where: { customerId: id },
        skip,
        take,
        order: { createdAt: sort.toUpperCase() },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
