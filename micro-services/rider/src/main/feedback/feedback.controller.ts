import { Controller, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { FeedbackService } from './feedback.service';

// Routes for rider feedback Api's
@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // create route for rider feedback
  @MessagePattern('topic-rider-feedback-createFeedback')
  async createFeedback(@Payload() data) {
    const { id, body } = data;
    body.customerId = id;
    const result = await this.feedbackService.createFeedback(body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S3001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search route for all riders feedbacks
  @MessagePattern('topic-rider-feedback-findAllFeedbacks')
  async findAllFeedbacks(@Payload() data) {
    const result = await this.feedbackService.findAllFeedbacks(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S3002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by order id route for rider feedback
  @MessagePattern('topic-rider-feedback-findOneFeedbackByOrderId')
  async findOneFeedbackByOrderId(@Payload() data) {
    const result = await this.feedbackService.findOneFeedbackByOrderId(
      data.param.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S3004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by rider id route for rider feedbacks
  @MessagePattern('topic-rider-feedback-findOneRiderAllFeedbacks')
  async findOneRiderAllFeedbacks(@Payload() data) {
    const result = await this.feedbackService.findOneRiderAllFeedbacks(
      data.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S3003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by customer id route for rider feedbacks
  @MessagePattern('topic-rider-feedback-findOneCustomerAllFeedbacks')
  async findOneCustomerAllFeedbacks(@Payload() data) {
    const result = await this.feedbackService.findOneCustomerAllFeedbacks(
      data.param.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S3005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
