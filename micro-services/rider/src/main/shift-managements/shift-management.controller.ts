import { Controller, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { ShiftManagementService } from './shift-management.service';

// Routes for rider shifts Api's

@Controller()
export class ShiftManagementController {
  constructor(
    private readonly shiftManagementService: ShiftManagementService,
  ) {}

  // create route for rider shifts
  @MessagePattern('topic-rider-shift-createShifts')
  async createShift(@Payload() data) {
    const result = await this.shiftManagementService.createShift(
      data.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S4001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search route for all riders shifts
  @MessagePattern('topic-rider-shift-findAllShifts')
  async findAllShifts(@Payload() data) {
    const result = await this.shiftManagementService.findAllShifts(
      data.id,
      data.role,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S4002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by shift id route for rider shift
  @MessagePattern('topic-rider-shift-assigShiftToRider')
  async assigShiftToRider(@Payload() data) {
    const result = await this.shiftManagementService.assigShiftToRider(
      data.param.id,
      data.body.riderIds,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S4003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by rider id route for rider shifts
  @MessagePattern('topic-rider-shift-findOneShift')
  async findOneShift(@Payload() data) {
    const result = await this.shiftManagementService.findOneShift(
      data.param.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S4004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete route for rider shift
  @MessagePattern('topic-rider-shift-deleteShift')
  async deleteShift(@Payload() data) {
    const result = await this.shiftManagementService.deleteShift(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S4005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update by shift id for shift
  @MessagePattern('topic-rider-shift-updateShift')
  async updateShift(@Payload() data) {
    // if (data.role === 'Admin' && !data.riderId) {
    //   return formatResponse(false, 400, 'RIDER_E0012');
    // } else if (data.role === 'Admin' && data.riderId) {
    //   data.body.adminId = data.id;
    // }
    const result = await this.shiftManagementService.updateShift(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S4006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
