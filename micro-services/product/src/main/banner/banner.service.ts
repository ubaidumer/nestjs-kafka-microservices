import { BadRequestException, Injectable } from '@nestjs/common';
import { BannerRepository } from './banner.repository';
import { AwsService } from 'src/utils/aws.service';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

// Services to perform all bussiness and required operations
@Injectable()
export class BannerService {
  constructor(
    private readonly bannerRepo: BannerRepository,
    private readonly awsService: AwsService,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      var websiteImage, applicationImage;
      if (body.websiteImage) {
        const { originalName, mimeType } = body.websiteImage;
        const fileResponse = await this.awsService.getUploadUrl(
          `banners/website/${Date.now()}-${originalName}`,
          mimeType,
        );
        body.websiteImage = fileResponse.key;
        websiteImage = fileResponse.url;
      }
      if (body.applicationImage) {
        const { originalName, mimeType } = body.applicationImage;
        const fileResponse = await this.awsService.getUploadUrl(
          `banners/application/${Date.now()}-${originalName}`,
          mimeType,
        );
        body.applicationImage = fileResponse.key;
        applicationImage = fileResponse.url;
      }
      if (body.IsTimeSpecific) {
        if (!body.publishStartTime || !body.publishEndTime) {
          throw new BadRequestException('PRODUCT_E0017');
        }
        const startTime = moment.utc(body.publishStartTime);
        const EndTime = moment.utc(body.publishEndTime);
        if (moment(EndTime).isBefore(startTime)) {
          throw new BadRequestException('PRODUCT_E0016');
        }
      }
      await this.bannerRepo.updateBannerPriorityIncrement();
      const data = await this.bannerRepo.create(body);
      data.websiteImage = websiteImage;
      data.applicationImage = applicationImage;
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by Banner id query and exception handling
  async findById(id) {
    try {
      await this.validateId(id);
      const data = await this.bannerRepo.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all Banner and exception handling
  async findAllBanners(query) {
    try {
      const data = await this.bannerRepo.findAllBanners(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by Banner id query and exception handling
  async updateBannerById(id: string, body) {
    try {
      await this.validateId(id);
      var websiteImage, applicationImage;
      if (body.websiteImage) {
        const { originalName, mimeType } = body.websiteImage;
        const fileResponse = await this.awsService.getUploadUrl(
          `banners/website/${Date.now()}-${originalName}`,
          mimeType,
        );
        body.websiteImage = fileResponse.key;
        websiteImage = fileResponse.url;
      }
      if (body.applicationImage) {
        const { originalName, mimeType } = body.applicationImage;
        const fileResponse = await this.awsService.getUploadUrl(
          `banners/application/${Date.now()}-${originalName}`,
          mimeType,
        );
        body.applicationImage = fileResponse.key;
        applicationImage = fileResponse.url;
      }
      if (body.IsTimeSpecific) {
        if (!body.publishStartTime || !body.publishEndTime) {
          throw new BadRequestException('PRODUCT_E0017');
        }
        const startTime = moment.utc(body.publishStartTime);
        const EndTime = moment.utc(body.publishEndTime);
        if (moment(EndTime).isBefore(startTime)) {
          throw new BadRequestException('PRODUCT_E0016');
        }
      }
      const data = await this.bannerRepo.updateBannerById(id, { ...body });
      data.websiteImage = websiteImage;
      data.applicationImage = applicationImage;
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // publich and unpublich multiple by Banner ids query and exception handling
  async updateMultipleBannerByIds(BannerIds, isAvailable) {
    try {
      for (const id of BannerIds) {
        await this.validateId(id);
      }
      const data = await this.bannerRepo.updateMultipleBannerByIds(
        BannerIds,
        isAvailable,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update all changed Banners by new priority field values
  async updateBannerPriority(body) {
    try {
      for (const Banner of body) {
        await this.validateId(Banner._id);
      }
      let data = [];
      for (const Banner of body) {
        data.push(
          await this.bannerRepo.updateBannerPriority(
            Banner._id,
            Banner.priority,
          ),
        );
      }
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by Banner id query and exception handling
  async deleteBannerById(id: string) {
    try {
      await this.validateId(id);
      const data = await this.bannerRepo.deleteBannerById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by Banners ids query and exception handling
  async deleteMutipleBanners(ids: string[]) {
    try {
      for (const id of ids) {
        await this.validateId(id);
      }
      const data = await this.bannerRepo.deleteBannersByIds(ids);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates Banner id
  async validateId(id) {
    const checkId = await this.bannerRepo.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('PRODUCT_E0007');
    }
    return;
  }

  // cron jobs
  @Cron('*/60 * * * * *')
  async bannerPublishCronJob() {
    const result = await this.bannerRepo.getAllBanner();
    const newDate = moment.utc(new Date().toISOString());
    const currentTime = newDate.add(5, 'hours');
    let ids = [];
    for (let i = 0; i < result.length; i++) {
      const startTime = moment.utc(result[i].publishStartTime);
      const EndTime = moment.utc(result[i].publishEndTime);
      const checkTime =
        moment(currentTime).isSameOrAfter(startTime) &&
        moment(currentTime).isSameOrBefore(EndTime);
      if (checkTime) {
        ids.push(result[i]._id);
      }
    }
    await this.bannerRepo.BannerAutoPublishCronJob(ids);
  }

  @Cron('*/60 * * * * *')
  async bannerUnPublishCronJob() {
    const result = await this.bannerRepo.getAllBanner();
    const newDate = moment.utc(new Date().toISOString());
    const currentTime = newDate.add(5, 'hours');
    let ids = [];
    for (let i = 0; i < result.length; i++) {
      const EndTime = moment.utc(result[i].publishEndTime);
      const checkTime = moment(EndTime).isBefore(currentTime);
      if (checkTime) {
        ids.push(result[i]._id);
      }
    }
    await this.bannerRepo.BannerUnPublishCronJob(ids);
  }
}
