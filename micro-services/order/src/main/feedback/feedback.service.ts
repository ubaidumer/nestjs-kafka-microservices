import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { FeedbackRepository } from './feedback.repository';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly feedbackRepo: FeedbackRepository,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      const data = await this.feedbackRepo.create(body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by feedback id query and exception handling
  async findById(id) {
    try {
      await this.validateId(id);
      const data = await this.feedbackRepo.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all feedbacks and exception handling
  async getAllFeedBack(query) {
    try {
      const data = await this.feedbackRepo.getAllFeedBack(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // find  all feedback by customer id query and exception handling
  async findAllFeedbackByCustomerId(id: string, query) {
    try {
      const data = await this.feedbackRepo.findAllFeedbackByCustomerId(
        id,
        query,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // find  all feedback by order id query and exception handling
  async findAllFeedbackByOrderId(
    userId: string,
    role: string,
    orderId: string,
    query,
  ) {
    try {
      const data = await this.feedbackRepo.findAllFeedbackByOrderId(
        userId,
        role,
        orderId,
        query,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates address id
  async validateId(id) {
    const checkId = await this.feedbackRepo.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('PRODUCT_E0007');
    }
    return;
  }
}
