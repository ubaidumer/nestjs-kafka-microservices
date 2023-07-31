import { Controller } from '@nestjs/common';
import { FinancialAssistanceService } from './financial-assistance.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';

@Controller()
export class FinancialAssistanceController {
  constructor(
    private readonly financialAssistanceService: FinancialAssistanceService,
  ) {}

  // create route for rider financial assistance
  @MessagePattern('topic-rider-financialAssistance-createFinancialAssistance')
  async createFinancialAssistance(@Payload() data) {
    const result =
      await this.financialAssistanceService.createFinancialAssistance({
        ...data.body,
        riderId: data.id,
      });
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S5001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search route for all riders financialAssistance
  @MessagePattern('topic-rider-financialAssistance-findAllFinancialAssistances')
  async findAllFinancialAssistances(@Payload() data) {
    const result =
      await this.financialAssistanceService.findAllFinancialAssistances(
        data.id,
        data.query,
      );
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
}
