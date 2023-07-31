import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveManagement } from 'src/entity/leave-management.entity';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';

// repository to rider Leaves table where we can make query requests to database
@Injectable()
export class LeaveManagementRepository {
  constructor(
    @InjectRepository(LeaveManagement)
    private leaveManagementRepo: Repository<LeaveManagement>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.leaveManagementRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by rider Leaves id query and exception handling
  async update(id, body) {
    try {
      return await this.leaveManagementRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(query) {
    const { skip, take, sort } = query;
    const response = await this.leaveManagementRepo.findAndCount({
      skip,
      take,
      order: { createdAt: sort.toUpperCase() },
    });
    return {
      data: response[0],
      page: skip,
      limit: take,
      count: response[1],
    };
  }

  // search by rider Leaves id query and exception handling
  async findById(id) {
    try {
      return await this.leaveManagementRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by rider id query and exception handling
  async findByRiderId(id, query) {
    try {
      const { skip, take, sort } = query;
      return await this.leaveManagementRepo.find({
        where: { riderId: id },
        order: { createdAt: sort.toUpperCase() },
        skip,
        take,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by rider id and leave type exception handling
  async findByLeaveTypeAndRiderId(riderId, leaveType) {
    try {
      return await this.leaveManagementRepo.findOne({
        where: { riderId, leaveType },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by  leave id , rider id and exception handling
  async findByLeaveIdAndRiderId(id, riderId) {
    try {
      return await this.leaveManagementRepo.findOne({
        where: { id, riderId },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findByStartDate(id, startTime) {
    try {
      const newStartTime = new Date(startTime);
      const startDate = newStartTime.getDate() + 1;
      const startMonth = newStartTime.getMonth();
      const startYear = newStartTime.getFullYear();
      const validateStartTime = await this.leaveManagementRepo.findOne({
        where: {
          riderId: id,
          startTime: LessThanOrEqual(
            new Date(startYear, startMonth, startDate),
          ),
          endTime: MoreThanOrEqual(new Date(startYear, startMonth, startDate)),
        },
      });
      const flag = validateStartTime ? true : false;
      return flag;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by  leave id , rider id and exception handling
  async findByStartAndEndDate(id, startTime, endTime) {
    try {
      const newStartTime = new Date(startTime);
      const startDate = newStartTime.getDate() + 1;
      const startMonth = newStartTime.getMonth();
      const startYear = newStartTime.getFullYear();
      let flag: Boolean = false;

      if (startTime) {
        const validateStartTime = await this.leaveManagementRepo.findOne({
          where: {
            riderId: id,
            status: Not('PENDING'),
            startTime: LessThanOrEqual(
              new Date(startYear, startMonth, startDate),
            ),
            endTime: MoreThanOrEqual(
              new Date(startYear, startMonth, startDate),
            ),
          },
        });
        if (validateStartTime) {
          flag = true;
        }
      }

      if (endTime) {
        const newEndTime = new Date(endTime);
        const endDate = newEndTime.getDate() + 1;
        const endMonth = newEndTime.getMonth();
        const endYear = newEndTime.getFullYear();
        const validateEndTime = await this.leaveManagementRepo.findOne({
          where: {
            riderId: id,
            status: Not('PENDING'),
            startTime: MoreThanOrEqual(new Date(endYear, endMonth, endDate)),
            endTime: LessThanOrEqual(new Date(endYear, endMonth, endDate)),
          },
        });
        if (validateEndTime) {
          flag = true;
        }
      }
      return flag;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by rider Leaves id query and exception handling
  async delete(id) {
    try {
      return await this.leaveManagementRepo.delete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
