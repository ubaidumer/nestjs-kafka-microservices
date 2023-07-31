import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { BannerService } from './banner.service';

// Routes for Banner Api's
@Controller()
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // create new Banner route
  @MessagePattern('topic-product-banner-createBanner')
  async createBanner(@Payload() data) {
    const result = await this.bannerService.create(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S6001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all Banners route
  @MessagePattern('topic-product-banner-findAllBanners')
  async findAllBanner(@Payload() data) {
    const result = await this.bannerService.findAllBanners(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S6002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one Banner using Banner id route
  @MessagePattern('topic-product-banner-findOneBanner')
  async findOneBanner(@Payload() data) {
    const result = await this.bannerService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S6003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one Banner using Banner id route
  @MessagePattern('topic-product-banner-updateBanner')
  async updateBanner(@Payload() data) {
    const result = await this.bannerService.updateBannerById(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S6004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update multiple Banners using Banner ids route
  @MessagePattern('topic-product-banner-updateMultipleBanners')
  async updateMultipleBanners(@Payload() data) {
    const { bannerIds, isAvailable } = data.body;
    const result = await this.bannerService.updateMultipleBannerByIds(
      bannerIds,
      isAvailable,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S6004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete one Banner using Banner id route
  @MessagePattern('topic-product-banner-deleteBanner')
  async deleteBanner(@Payload() data) {
    const result = await this.bannerService.deleteBannerById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S6005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete multiple Banners using Banners ids route
  @MessagePattern('topic-product-banner-deleteMultipleBanners')
  async deleteMutipleBanners(@Payload() data) {
    const { bannerIds } = data.body;
    const result = await this.bannerService.deleteMutipleBanners(bannerIds);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S6005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update all changed Banners by new priority field values
  @MessagePattern('topic-product-banner-updateBannerPriority')
  async updateBannerPriority(@Payload() data) {
    const result = await this.bannerService.updateBannerPriority(
      data.body.bannerPriority,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S6004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
