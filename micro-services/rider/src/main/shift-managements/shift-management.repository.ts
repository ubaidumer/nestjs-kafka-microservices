import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShiftManagement } from 'src/entity/shift-management.entity';
import { EntityManager, Repository } from 'typeorm';

// repository to rider Shifts table where we can make query requests to database
@Injectable()
export class ShiftManagementRepository {
  constructor(
    @InjectRepository(ShiftManagement)
    private shiftManagementRepo: Repository<ShiftManagement>,
    private dataSource: EntityManager,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.shiftManagementRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by rider Shifts id query and exception handling
  async update(id, body) {
    try {
      return await this.shiftManagementRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(data) {
    const { skip, take, sort, branchId } = data;
    let query = {};

    query = {
      ...query,
      ...(branchId && { branchId: branchId }),
    };
    let responce;
    if (data.role === 'Rider') {
      responce = await this.shiftManagementRepo.findAndCount({
        skip,
        take,
        order: { createdAt: sort.toUpperCase() },
        where: {
          ...query,
        },
        relations: {
          rider: true,
        },
      });
    } else {
      responce = await this.shiftManagementRepo.findAndCount({
        skip,
        take,
        order: { createdAt: sort.toUpperCase() },
        where: {
          ...query,
        },
        relations: {
          rider: true,
        },
      });
    }

    return {
      data: responce[0],
      page: skip,
      limit: take,
      count: responce[1],
    };
  }

  // async assigShiftToRider(id, riderIds) {
  //   try {
  //     return await this.shiftManagementRepo.update(id, {
  //       riderId: riderIds,
  //     });
  //   } catch (error) {
  //     throw new HttpException(error, 400);
  //   }
  // }

  // search by rider Shifts id query and exception handling
  async findById(id) {
    try {
      return await this.shiftManagementRepo.findOne({
        where: {
          id,
        },
        relations: {
          rider: true,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by rider id and shift type exception handling
  async findByShiftTypeAndRiderId(riderId, shiftType) {
    try {
      return await this.shiftManagementRepo.findOne({
        where: { shiftType },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by  shift id , rider id and exception handling
  async findByShiftIdAndRiderId(id, riderId) {
    try {
      return await this.shiftManagementRepo.findOne({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by rider Shifts id query and exception handling
  async delete(id) {
    try {
      return await this.shiftManagementRepo.delete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
