import { Controller, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { LeaveManagementService } from './leave-management.service';

// Routes for rider Leaves Api's

@Controller()
export class LeaveManagementController {
  constructor(
    private readonly leaveManagementService: LeaveManagementService,
  ) {}

  // create route for rider Leaves
  @MessagePattern('topic-rider-leave-createLeaves')
  async createLeave(@Payload() data) {
    const result = await this.leaveManagementService.createLeave(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S2001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search route for all riders Leaves
  @MessagePattern('topic-rider-leave-findAllLeaves')
  async findAllLeaves(@Payload() data) {
    const result = await this.leaveManagementService.findAllLeaves(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S2002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by Leave id route for rider Leave
  @MessagePattern('topic-rider-leave-findOneLeave')
  async findOneLeave(@Payload() data) {
    const result = await this.leaveManagementService.findOneLeave(
      data.param.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S2003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by rider id route for rider Leaves
  @MessagePattern('topic-rider-leave-findOneRiderAllLeaves')
  async findOneRiderAllLeaves(@Payload() data) {
    const result = await this.leaveManagementService.findOneRiderAllLeaves(
      data.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S2002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete route for rider Leave
  @MessagePattern('topic-rider-leave-deleteLeaves')
  async deleteLeave(@Payload() data) {
    const result = await this.leaveManagementService.deleteLeave(data.param.id);
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

  // update by leave id for leave
  @MessagePattern('topic-rider-leave-updateLeave')
  async updateLeave(@Payload() data) {
    if (data.role === 'Admin' && !data.riderId) {
      return formatResponse(false, 400, 'RIDER_E0012');
    } else if (data.role === 'Admin' && data.riderId) {
      data.body.adminId = data.id;
    }
    const result = await this.leaveManagementService.updateLeave(
      data.param.id,
      data.body,
    );
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
}
