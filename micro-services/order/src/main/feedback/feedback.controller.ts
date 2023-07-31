import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { formatResponse } from 'src/utils/response';
import { FeedbackService } from './feedback.service';

// Routes for feedback Api's
@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // create route for order feedback
  @MessagePattern('topic-order-feedback-createFeedback')
  async createFeedback(@Payload() data) {
    const result = await this.feedbackService.create(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S0001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all feedbacks route for order
  @MessagePattern('topic-order-feedback-findAllFeedbacks')
  async findAllFeedback(@Payload() data) {
    const result = await this.feedbackService.getAllFeedBack(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S0002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one feedback using feedbacks id route
  @MessagePattern('topic-order-feedback-findOneFeedback')
  async findOneFeedback(@Payload() data) {
    const result = await this.feedbackService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ORDER_S0003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find feedback of order using order id route
  @MessagePattern('topic-order-feedback-findAllFeedbacksByOrderId')
  async findAllFeedbackByOrderId(@Payload() data) {
    const result = await this.feedbackService.findAllFeedbackByOrderId(
      data.id,
      data.role,
      data.param.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S0004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all feedbacks of one customers using customer id route
  @MessagePattern('topic-order-feedback-findAllFeedbacksByCustomerId')
  async findAllFeedbackByCustomerId(@Payload() data) {
    const result = await this.feedbackService.findAllFeedbackByCustomerId(
      data.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S0005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
