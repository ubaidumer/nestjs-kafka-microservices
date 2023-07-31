import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Training } from 'src/entity/training.entity';
import {
  traningStatus,
  traningStatusValue,
} from 'src/utils/constants/traningConstant';
import { Repository } from 'typeorm';

// repository to Training table where we can make query requests to database
@Injectable()
export class TrainingRepository {
  constructor(
    @InjectRepository(Training)
    private trainingRepo: Repository<Training>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.trainingRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by training id query and exception handling
  async update(id, body) {
    try {
      const { title, key, type } = body;
      const query = {
        ...(title != null ? { title } : {}),
        ...(key != null ? { key } : {}),
        ...(type != null ? { type } : {}),
      };
      return await this.trainingRepo.update(id, { ...query });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by training id query and exception handling
  async delete(id) {
    try {
      return await this.trainingRepo.delete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by training id query and exception handling
  async publishTraing(id) {
    try {
      return await this.trainingRepo.update(id, {
        status: traningStatusValue[0],
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by training id query and exception handling
  async upPublishTraing(id) {
    try {
      return await this.trainingRepo.update(id, {
        status: traningStatusValue[1],
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(data) {
    try {
      const { skip, take, sort = 'desc', status, type } = data;

      let query = {};

      query = {
        ...(status && {
          status,
        }),
        ...(type && {
          type,
        }),
      };
      return await this.trainingRepo.findAndCount({
        skip,
        take,
        order: { createdAt: sort.toUpperCase() },
        where: {
          ...query,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by training id query and exception handling
  async findById(id) {
    try {
      return await this.trainingRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
  // search by title query and exception handling
  async findByTitle(title) {
    try {
      return await this.trainingRepo.findOne({
        where: {
          title,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
