import { BadRequestException, Injectable } from '@nestjs/common';
import { RiderRepository } from '../rider/rider.repository';
import { ShiftManagementRepository } from './shift-management.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class ShiftManagementService {
  constructor(
    private readonly shiftManagementRepository: ShiftManagementRepository,
    private readonly riderRepository: RiderRepository,
  ) {}

  // Bussiness functions

  // create rider Shifts service function
  async createShift(id, body) {
    try {
      body.adminId = id;
      const data = await (
        await this.shiftManagementRepository.create(body)
      ).identifiers[0];
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search rider Shifts service function
  async findAllShifts(id, role, query) {
    try {
      const { page = 0, limit = 10, sort = 'desc', branchId } = query;
      const data = await this.shiftManagementRepository.find({
        skip: page * limit,
        take: limit,
        sort,
        id,
        role,
        branchId,
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

  //   // search by Rider Shift id route for rider Shift service function
  async findOneShift(id) {
    try {
      await this.validateId(id);
      const data = await this.shiftManagementRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search rider Shifts by rider id service function
  async assigShiftToRider(id, riderIds) {
    try {
      const data = await this.riderRepository.assigShiftToRider(id, riderIds);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by shift id service function
  async updateShift(shiftId, body) {
    try {
      // if (!body.adminId) {
      //   await this.validateId(shiftId);
      //   body.status = 'PENDING';
      // } else if (body.adminId) {
      //   await this.validateIdAndRiderId(shiftId, body.riderId);
      // }
      // delete body.role;
      //   await this.validateId(shiftId);
      const data = await this.shiftManagementRepository.update(shiftId, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete rider Shifts service function
  async deleteShift(id) {
    try {
      await this.validateId(id);
      const data = await this.shiftManagementRepository.delete(id);
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

  // validates rider Shift id
  async validateId(id) {
    const checkId = await this.shiftManagementRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('RIDER_E0009');
    }
    return;
  }

  // validates rider id and admin id
  async validateByShiftTypeAndRiderID(riderId, shiftType) {
    const checkShiftType =
      await this.shiftManagementRepository.findByShiftTypeAndRiderId(
        riderId,
        shiftType,
      );
    if (!checkShiftType) {
      throw new BadRequestException('RIDER_E0010');
    }
    return;
  }

  // validates shift id and rider id presence
  async validateIdAndRiderId(id, riderId) {
    const checkId =
      await this.shiftManagementRepository.findByShiftIdAndRiderId(id, riderId);
    if (id !== null && !checkId) {
      throw new BadRequestException('RIDER_E0011');
    }
    return;
  }
}
