import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entity/campaign.entity';
import { Repository } from 'typeorm';

// repository to Campaign table where we can make query requests to database
@Injectable()
export class CampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepo: Repository<Campaign>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.campaignRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by Campaign id query and exception handling
  async update(id, body) {
    try {
      return await this.campaignRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(query) {
    const { skip, take } = query;
    const response = await this.campaignRepo.findAndCount({ skip, take });
    return {
      data: response[0],
      page: skip,
      limit: take,
      count: response[1],
    };
  }

  // search by Campaign id query and exception handling
  async findById(id) {
    try {
      return await this.campaignRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by admin id query and exception handling
  async findByAdminId(adminId, query) {
    try {
      const { skip, take } = query;
      return await this.campaignRepo.find({
        where: { adminId },
        skip,
        take,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
