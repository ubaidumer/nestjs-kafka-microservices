import { Injectable } from '@nestjs/common';
import { FinancialAssistanceRepository } from './financial-assistance.repository';
import { AwsService } from 'src/utils/aws.service';

// Services to perform all bussiness and required operations
@Injectable()
export class FinancialAssistanceService {
  constructor(
    private readonly financialAssistanceRepository: FinancialAssistanceRepository,
    private readonly awsSerivce: AwsService,
  ) {}

  // Bussiness functions

  // create rider financial Assistance service function
  async createFinancialAssistance(body) {
    try {
      let image;
      if (body.image) {
        const fileResponse = await this.awsSerivce.getUploadUrl(
          `financialAssistance//${body.riderId}/${Date.now()}-${
            body.image.originalName
          }`,
          body.image.mimeType,
        );
        body.image = fileResponse.key;
        image = fileResponse.url;
      }
      const data = await (
        await this.financialAssistanceRepository.create(body)
      ).identifiers[0];
      return { body: { ...data, image }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search all riders financial assistance service function
  async findAllFinancialAssistances(riderId, query) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = query;
      const data = await this.financialAssistanceRepository.find({
        riderId,
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
