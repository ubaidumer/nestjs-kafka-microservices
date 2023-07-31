import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entity/admin.entity';
import { ArrayContains, ILike, Repository } from 'typeorm';

// repository to admin table where we can make query requests to database
@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.adminRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by admin id query and exception handling
  async update(id, body) {
    try {
      return await this.adminRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(data) {
    const { skip, take, sort, status, branchId, fullName } = data;

    const query = {
      ...(branchId && {
        branchIds: ArrayContains([branchId]),
      }),
      ...(status && {
        status,
      }),
      ...(fullName && {
        fullName: ILike('%' + fullName + '%'),
      }),
    };

    const response = await this.adminRepo.findAndCount({
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

  // search by admin id query and exception handling
  async findById(id) {
    try {
      const data = await this.adminRepo.findOne({
        where: {
          id,
        },
      });
      delete data.password;
      return data;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by email query and exception handling
  async findByEmail(email) {
    try {
      return await this.adminRepo.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // saga utils

  // update by admin id query and exception handling
  async addBranchToAdmin(branchId) {
    try {
      const admin = await this.adminRepo.find({
        where: {
          adminType: ArrayContains(['SuperAdmin']),
        },
      });
      if (admin.length === 0) {
        return;
      } else {
        const adminIds = [];
        for (let element of admin) {
          await this.update(element.id, {
            branchIds: [...element.branchIds, branchId],
          });
          adminIds.push(element.id);
        }
        return adminIds;
      }
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
