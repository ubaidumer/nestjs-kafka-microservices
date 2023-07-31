import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentManagement } from 'src/entity/document-management.entity';
import { Repository } from 'typeorm';

// repository to Document table where we can make query requests to database
@Injectable()
export class DocumentRepository {
  constructor(
    @InjectRepository(DocumentManagement)
    private documentRepo: Repository<DocumentManagement>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.documentRepo.insert(body);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  // update by Document id query and exception handling
  async update(id, body) {
    try {
      return await this.documentRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(data) {
    const { skip, take, sort, riderId, status } = data;
    let query = {};
    query = {
      ...(riderId && { riderId }),
      ...(status && { status }),
    };
    const response = await this.documentRepo.findAndCount({
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

  // search by Document id query and exception handling
  async findById(id) {
    try {
      return await this.documentRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by Document id query and exception handling
  async findByRiderId(riderId) {
    try {
      return await this.documentRepo.find({
        where: {
          riderId,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by Document id query and exception handling
  async findByRiderIdAndType(riderId, type) {
    try {
      return await this.documentRepo.findOne({
        where: {
          riderId,
          type,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
