import { Controller } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';

@Controller()
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  // create route for rider Compliance
  @MessagePattern('topic-rider-compliance-createCompliance')
  async createCompliance(@Payload() data) {
    const { id, body } = data;
    const result = await this.complianceService.createCompliance(id, body);
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

  // random create route for rider Compliance
  @MessagePattern('topic-rider-compliance-randomCompliance')
  async randomCompliance(@Payload() data) {
    const { id, body } = data;
    const result = await this.complianceService.randomCompliance(id, body);
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

  // request route for rider Compliance by admin
  @MessagePattern('topic-rider-compliance-requestComplianceByAdmin')
  async requestComplianceByAdmin(@Payload() data) {
    const { body } = data;
    const result = await this.complianceService.requestComplianceByAdmin(body);
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

  // update one compliance using compliance id route
  @MessagePattern('topic-rider-compliance-updateCompliance')
  async updateCompliance(@Payload() data) {
    const result = await this.complianceService.updateCompliance(
      data.id,
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S5002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all riders compliance route
  @MessagePattern('topic-rider-compliance-findAllCompliance')
  async findAllCompliance(@Payload() data) {
    const result = await this.complianceService.findAllCompliance(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S5003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one compliance using compliance id route
  @MessagePattern('topic-rider-compliance-findOneCompliance')
  async findOneCompliance(@Payload() data) {
    const result = await this.complianceService.findOneCompliance(
      data.param.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S5004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
