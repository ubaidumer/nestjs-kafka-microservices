import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { RiderService } from '../rider/rider.service';

// Services to perform all bussiness and required operations
@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepo: FeedbackRepository,
    private readonly riderService: RiderService,
  ) {}

  // Bussiness functions

  // create rider feedback service function
  async createFeedback(body) {
    try {
      const data = await (await this.feedbackRepo.create(body)).identifiers[0];
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }
  // search rider feedbacks service function
  async findAllFeedbacks(query) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = query;
      const data = await this.feedbackRepo.find({
        skip: page * limit,
        take: limit,
        sort,
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

  // search by order id route for rider feedback service function
  async findOneFeedbackByOrderId(id) {
    try {
      const data = await this.feedbackRepo.findByOrderId(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search rider feedbacks by rider id service function
  async findOneRiderAllFeedbacks(id, query) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = query;
      const data = await this.feedbackRepo.findByRiderId(id, {
        skip: page * limit,
        take: limit,
        sort,
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

  // search rider feedbacks by customer id service function
  async findOneCustomerAllFeedbacks(customerId, query) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = query;
      const data = await this.feedbackRepo.findByCustomerId(customerId, {
        skip: page * limit,
        take: limit,
        sort,
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
}
