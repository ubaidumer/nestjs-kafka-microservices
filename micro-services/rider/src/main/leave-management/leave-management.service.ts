import { BadRequestException, Injectable } from '@nestjs/common';
import { LeaveManagementRepository } from './leave-management.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class LeaveManagementService {
  constructor(
    private readonly leaveManagementRepository: LeaveManagementRepository,
  ) {}

  // Bussiness functions

  // create rider Leaves service function
  async createLeave(body) {
    try {
      const { riderId, startTime } = body;
      const leaveDates = await this.leaveManagementRepository.findByStartDate(
        riderId,
        startTime,
      );
      if (leaveDates) {
        throw new BadRequestException('RIDER_E00010');
      }
      body.status = 'PENDING';
      const data = await (
        await this.leaveManagementRepository.create(body)
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

  // search all riders Leaves service function
  async findAllLeaves(query) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = query;
      const data = await this.leaveManagementRepository.find({
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

  // search by Rider Leave id route for rider Leave service function
  async findOneLeave(id) {
    try {
      await this.validateId(id);
      const data = await this.leaveManagementRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search rider Leaves by rider id service function
  async findOneRiderAllLeaves(id, query) {
    try {
      const { page = 0, limit = 10, sort = 'desc' } = query;
      const data = await this.leaveManagementRepository.findByRiderId(id, {
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

  // update by leave id service function
  async updateLeave(leaveId, body) {
    try {
      const { riderId, startTime, endTime } = body;
      if (!body.adminId) {
        await this.validateId(leaveId);
        const leave = await this.leaveManagementRepository.findById(leaveId);
        if (leave.status !== 'PENDING') {
          throw new BadRequestException('RIDER_E00016');
        }
        if (startTime || endTime) {
          const leaveDates =
            await this.leaveManagementRepository.findByStartAndEndDate(
              riderId,
              startTime,
              endTime,
            );
          if (leaveDates) {
            throw new BadRequestException('RIDER_E00010');
          }
        }
      } else if (body.adminId) {
        await this.validateIdAndRiderId(leaveId, body.riderId);
      }
      delete body.role;
      const data = await this.leaveManagementRepository.update(leaveId, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete rider Leaves service function
  async deleteLeave(id) {
    try {
      await this.validateId(id);
      const data = await this.leaveManagementRepository.delete(id);
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
    const checkId = await this.leaveManagementRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('RIDER_E0009');
    }
    return;
  }

  // validates rider id and admin id
  async validateByLeaveTypeAndRiderID(riderId, leaveType) {
    const checkLeaveType =
      await this.leaveManagementRepository.findByLeaveTypeAndRiderId(
        riderId,
        leaveType,
      );
    if (checkLeaveType) {
      throw new BadRequestException('RIDER_E0010');
    }
    return;
  }

  // validates leave id and rider id presence
  async validateIdAndRiderId(id, riderId) {
    const checkId =
      await this.leaveManagementRepository.findByLeaveIdAndRiderId(id, riderId);
    if (id !== null && !checkId) {
      throw new BadRequestException('RIDER_E0011');
    }
    return;
  }
}
