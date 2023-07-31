import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { CampaignService } from './campaign.service';

// Routes for Campaign Api's

@Controller()
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  // Campaign is added by admin route
  @MessagePattern('topic-admin-campaign-createCampaign')
  async createCampaign(@Payload() data) {
    const { id } = data;
    const result = await this.campaignService.createCampaign({
      adminId: id,
      ...data.body,
    });
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S1001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all campaign route
  @MessagePattern('topic-admin-campaign-findAllCampaign')
  async findAllCampaign(@Payload() data) {
    const result = await this.campaignService.findAllCampaign(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S2002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one using campaign id route
  @MessagePattern('topic-admin-campaign-findOneCampaign')
  async findOneCampaign(@Payload() data) {
    const result = await this.campaignService.findOneCampaign(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S2003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one admin all campaign using admin id route
  @MessagePattern('topic-admin-campaign-findOneAdminAllCampaign')
  async findOneAdminAllCampaign(@Payload() data) {
    const result = await this.campaignService.findOneAdminAllCampaign(
      data.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S2002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one campaign using campaign id route with http patch method
  @MessagePattern('topic-admin-campaign-updateCampaign')
  async updateCampaign(@Payload() data) {
    const result = await this.campaignService.updateCampaign(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S2004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
