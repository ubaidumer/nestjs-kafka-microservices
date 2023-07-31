import { Controller, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { FAQSService } from './faqs.services';

// Routes for rider feedback Api's
@Controller()
export class FAQSController {
  constructor(private readonly faqsService: FAQSService) {}

  // create route for rider feedback
  @MessagePattern('topic-rider-faqs-createFAQS')
  async createFaqs(@Payload() data) {
    const { id, body } = data;
    body.adminId = id;
    const result = await this.faqsService.createFaqs(body);
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
  @MessagePattern('topic-rider-faqs-findAllFAQS')
  async findAllFAQS(@Payload() data) {
    const result = await this.faqsService.findAllFAQS(data.query);
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

  // search route for all riders feedbacks
  @MessagePattern('topic-rider-faqs-findFAQSById')
  async findFAQSById(@Payload() data) {
    const result = await this.faqsService.findFAQ(data.param.id);
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

  // update by leave id for leave
  @MessagePattern('topic-rider-faqs-updateFAQS')
  async updateLeave(@Payload() data) {
    const result = await this.faqsService.updateFAQS(data.param.id, data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S2005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete route for rider Leave
  @MessagePattern('topic-rider-faqs-deleteFAQS')
  async deleteLeave(@Payload() data) {
    const result = await this.faqsService.deleteFAQS(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S2004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
