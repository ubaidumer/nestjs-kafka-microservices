import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rider } from 'src/entity/rider.entity';
import { In, Repository, EntityManager } from 'typeorm';

// repository to Rider table where we can make query requests to database
@Injectable()
export class RiderRepository {
  constructor(
    @InjectRepository(Rider)
    private riderRepo: Repository<Rider>,
    private dataSource: EntityManager,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.riderRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findAllRiderGroupByBranch() {
    try {
      return await this.dataSource
        .getRepository(Rider)
        .createQueryBuilder('rider')
        .select('rider.branchId AS branchId')
        .addSelect('COUNT(rider.id)', 'count')
        .groupBy('rider.branchId')
        .getRawMany();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by Rider id query and exception handling
  async update(id, body) {
    try {
      return await this.riderRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(data) {
    const {
      skip,
      take,
      status,
      isVerified,
      sort = 'desc',
      isOnDelivery,
      branchId,
    } = data;
    const statuses = status?.split(',');
    const query = {
      ...(isOnDelivery != null ? { isOnDelivery } : {}),
      ...(isVerified != null ? { isVerified } : {}),
      ...(branchId != null ? { branchId } : {}),
      ...(status && {
        status: In(statuses),
      }),
    };

    const response = await this.riderRepo.findAndCount({
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

  async assigShiftToRider(id, riderIds) {
    try {
      return await this.riderRepo.update(
        { id: In(riderIds) },
        {
          shiftId: id,
        },
      );
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by Rider id query and exception handling
  async findById(id) {
    try {
      return await this.riderRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by email query and exception handling
  async findByEmail(email) {
    try {
      return await this.riderRepo.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by phoneNo query and exception handling
  async findByPhoneNo(phoneNo) {
    try {
      return await this.riderRepo.findOne({
        where: {
          phoneNo,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by cnic query and exception handling
  async findByCnic(cnic) {
    try {
      return await this.riderRepo.findOne({
        where: {
          cnic,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by bikeNo query and exception handling
  async findByBikeNo(bikeNo) {
    try {
      return await this.riderRepo.findOne({
        where: {
          bikeNo,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
