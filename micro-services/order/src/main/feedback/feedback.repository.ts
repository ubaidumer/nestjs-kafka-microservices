import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from 'src/entity/feedback.entity';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.feedbackModel.create(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by feedback id query and exception handling
  async findById(id) {
    try {
      return await this.feedbackModel.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // get all feedback and exception handling
  async getAllFeedBack(data) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = data;

      const response = await Promise.all([
        this.feedbackModel
          .find()
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.feedbackModel.countDocuments(),
      ]);

      return {
        data: response[0],
        limit,
        page,
        count: response[1],
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // find all feedback by customer id query and exception handling
  async findAllFeedbackByCustomerId(id: string, data) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = data;

      const response = await Promise.all([
        this.feedbackModel
          .find({ customerId: id })
          .sort({ createdAt: sort })
          .skip(page * limit)
          .limit(limit),
        this.feedbackModel.countDocuments({ customerId: id }),
      ]);

      return {
        data: response[0],
        limit,
        page,
        count: response[1],
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // find all feedback by order id query and exception handling
  async findAllFeedbackByOrderId(
    userId: string,
    role: string,
    orderId: string,
    data,
  ) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = data;
      let response = [];
      if (role === 'Customer') {
        response = await Promise.all([
          this.feedbackModel
            .find({ customerId: userId, orderId: orderId })
            .sort({ createdAt: sort })
            .skip(page * limit)
            .limit(limit),
          this.feedbackModel.countDocuments({
            customerId: userId,
            orderId: orderId,
          }),
        ]);
      } else {
        response = await Promise.all([
          this.feedbackModel
            .find({ orderId: orderId })
            .sort({ createdAt: sort })
            .skip(page * limit)
            .limit(limit),
          this.feedbackModel.countDocuments({ orderId: orderId }),
        ]);
      }
      return {
        data: response[0],
        limit,
        page,
        count: response[1],
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
