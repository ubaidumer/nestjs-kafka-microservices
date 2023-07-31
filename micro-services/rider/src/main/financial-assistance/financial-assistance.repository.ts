import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialAssistance } from 'src/entity/financial-assistance.entity';
import { Repository } from 'typeorm';

// repository to rider financial assistance table where we can make query requests to database
@Injectable()
export class FinancialAssistanceRepository {
  constructor(
    @InjectRepository(FinancialAssistance)
    private financialAssistanceRepo: Repository<FinancialAssistance>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.financialAssistanceRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by rider financial assistancex id query and exception handling
  async update(id, body) {
    try {
      return await this.financialAssistanceRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(query) {
    const { skip, take, riderId, sort } = query;

    const response = await this.financialAssistanceRepo.findAndCount({
      where: {
        riderId,
      },
      order: { createdAt: sort.toUpperCase() },
      skip,
      take,
    });
    return {    
      data: response[0],
      page: skip,
      limit: take,
      count: response[1],
    };
  }

  // search by rider financial assistancex id query and exception handling
  async findById(id) {
    try {
      return await this.financialAssistanceRepo.findOne({
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
      return await this.financialAssistanceRepo.find({
        where: { riderId: id },
        order: { createdAt: sort.toUpperCase() },
        skip,
        take,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by rider financial assistancex id query and exception handling
  async delete(id) {
    try {
      return await this.financialAssistanceRepo.delete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
