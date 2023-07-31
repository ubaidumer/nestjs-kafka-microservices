import { BadRequestException, Injectable } from '@nestjs/common';
import { FAQSRepository } from './faqs.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class FAQSService {
  constructor(private readonly faqsRepo: FAQSRepository) {}

  // Bussiness functions

  // create FAQ'S service function
  async createFaqs(body) {
    try {
      const data = await (await this.faqsRepo.create(body)).identifiers[0];
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }
  // search FAQ's service function
  async findAllFAQS(query) {
    try {
      const {
        page = 0,
        limit = 10,
        sort = 'desc',
        status,
        type,
        question,
      } = query;
      const data = await this.faqsRepo.find({
        skip: page * limit,
        take: limit,
        sort,
        status,
        type,
        question,
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

  // search FAQ's by id service function
  async findFAQ(id) {
    try {
      const data = await this.faqsRepo.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by leave id service function
  async updateFAQS(id, body) {
    try {
      await this.validateId(id);
      const data = await this.faqsRepo.update(id, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete FAQ'S service function
  async deleteFAQS(id) {
    try {
      await this.validateId(id);
      const data = await this.faqsRepo.delete(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }
  // util functions

  // validates rider Leave id
  async validateId(id) {
    const checkId = await this.faqsRepo.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('RIDER_E0009');
    }
    return;
  }
}
