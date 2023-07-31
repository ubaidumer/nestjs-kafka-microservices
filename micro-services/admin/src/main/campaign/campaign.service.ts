import { BadRequestException, Injectable } from '@nestjs/common';
import { CampaignRepository } from './campaign.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class CampaignService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  // Bussiness functions

  // create Campaign service function
  async createCampaign(body) {
    try {
      const data = await (
        await this.campaignRepository.create(body)
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

  // search Campaign service function
  async findAllCampaign(query) {
    try {
      const { page = 0, limit = 10 } = query;
      const data = await this.campaignRepository.find({
        skip: page * limit,
        take: limit,
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

  // search by Campaign id service function
  async findOneCampaign(id) {
    try {
      await this.validateId(id);
      const data = await this.campaignRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by Campaign id service function
  async updateCampaign(campaignId, body) {
    try {
      await this.validateId(campaignId);
      const data = await this.campaignRepository.update(campaignId, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search campaign using admin id service function
  async findOneAdminAllCampaign(id, query) {
    try {
      const { page = 0, limit = 10 } = query;
      const data = await this.campaignRepository.findByAdminId(id, {
        skip: page * limit,
        take: limit,
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

  //util functions

  // validates Campaign id
  async validateId(id) {
    const checkId = await this.campaignRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('ADMIN_E0005');
    }
    return;
  }
}
