import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Compliance } from 'src/entity/compliance.entity';
import { Between, ILike, Repository } from 'typeorm';

// repository to rider compliance table where we can make query requests to database
@Injectable()
export class complianceRepository {
  constructor(
    @InjectRepository(Compliance)
    private complianceRepo: Repository<Compliance>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.complianceRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by rider Compliance id query and exception handling
  async update(id, body) {
    try {
      return await this.complianceRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(data) {
    const { skip, take, sort = 'desc', status, name, branchId, type } = data;
    let query = {};
    query = {
      ...(status && { status }),
      ...(type && { type }),
      ...((name || branchId) && {
        rider: [
          { firstName: ILike('%' + name + '%') },
          { lastName: ILike('%' + name + '%') },
          branchId && { branchId: branchId },
        ],
      }),
    };
    const response = await this.complianceRepo.findAndCount({
      where: query,
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

  // search by rider Compliance id query and exception handling
  async findById(id) {
    try {
      return await this.complianceRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by rider id and exception handling
  async findByRiderId(id) {
    try {
      return await this.complianceRepo.findOne({
        where: { riderId: id },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by rider id of today Compliance and exception handling
  async findByRiderIdAndTodayDate(id, type) {
    try {
      const date = new Date().getDate();
      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      return await this.complianceRepo.findOne({
        where: {
          riderId: id,
          type,
          createdAt: Between(
            new Date(year, month, date),
            new Date(year, month, date + 1),
          ),
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
