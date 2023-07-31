import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { AwsService } from 'src/utils/aws.service';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

// Services to perform all bussiness and required operations
@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly awsService: AwsService,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      const { originalName, mimeType } = body.image;
      const dupCategory = await this.validateName(body.name);
      if (dupCategory) {
        throw new BadRequestException('PRODUCT_E1001');
      }
      const fileResponse = await this.awsService.getUploadUrl(
        `categories/${Date.now()}-${originalName}`,
        mimeType,
      );
      body.image = fileResponse.key;
      await this.categoryRepo.updateCategoryPriorityIncrement();
      if (body?.IsTimeSpecific) {
        body.isAvailable = false;
        const startTime = moment.utc(body.publishStartTime);
        const EndTime = moment.utc(body.publishEndTime);
        if (moment(EndTime).isBefore(startTime)) {
          throw new BadRequestException('PRODUCT_E0016');
        }
      }

      const data = await this.categoryRepo.create(body);
      data.image = fileResponse.url;
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by category id query and exception handling
  async findById(id, branchId) {
    try {
      await this.validateId(id);
      const data = await this.categoryRepo.findCategoryWithBranchId(
        id,
        branchId,
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

  // get all category and exception handling
  async getAllCategories(query) {
    try {
      const data = await this.categoryRepo.getAllCategories(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by category id query and exception handling
  async updateCategoryById(id: string, body) {
    try {
      await this.validateId(id);
      let imageURL;

      if (body.name) {
        const dupCategory = await this.validateName(body.name);
        if (dupCategory) {
          throw new BadRequestException('PRODUCT_E1001');
        }
      }
      if (body.image) {
        const { originalName, mimeType } = body.image;
        let category = await this.categoryRepo.findById(id);
        this.awsService.deleteFile(category.image);
        const fileResponse = await this.awsService.getUploadUrl(
          `categories/${Date.now()}-${originalName}`,
          mimeType,
        );
        body.image = fileResponse.key;
        imageURL = fileResponse.url;
      }
      const data = await this.categoryRepo.updateCategoryById(id, { ...body });
      data.image = imageURL;
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // publich and unpublich multiple by category ids query and exception handling
  async updateMultipleCategoryByIds(categoryIds, isAvailable) {
    try {
      for (const id of categoryIds) {
        await this.validateId(id);
      }
      const data = await this.categoryRepo.updateMultipleCategoryByIds(
        categoryIds,
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

  // update all changed categories by new priority field values
  async updateCategoryPriority(body) {
    try {
      for (const category of body) {
        await this.validateId(category._id);
      }
      let data = [];
      for (const category of body) {
        data.push(
          await this.categoryRepo.updateCategoryPriority(
            category._id,
            category.priority,
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

  // delete by category id query and exception handling
  async deleteCategoryById(id: string) {
    try {
      await this.validateId(id);
      const data = await this.categoryRepo.deleteCategoryById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by categories ids query and exception handling
  async deleteMutipleCategories(ids: string[]) {
    try {
      for (const id of ids) {
        await this.validateId(id);
      }
      const data = await this.categoryRepo.deleteCategoriesByIds(ids);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by categories ids query and exception handling
  async removeProductFromCategory(id: string, productId: string) {
    try {
      await this.validateId(id);
      const data = await this.categoryRepo.removeProductFromCategory(
        id,
        productId,
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

  // unpublish product for some time
  async categoryAutoPublishTime(id, data) {
    try {
      await this.validateId(id);
      const result = await this.categoryRepo.categoryAutoPublishTime(
        id,
        data.autoPublishTime,
      );
      return { body: result, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates category id
  async validateId(id) {
    const checkId = await this.categoryRepo.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('PRODUCT_E0007');
    }
    return;
  }
  // validates category name to make product unique
  async validateName(name) {
    const checkName = await this.categoryRepo.findByName(name);
    if (name && checkName) {
      return true;
    } else {
      return false;
    }
  }

  // cron jobs

  @Cron('*/60 * * * * *')
  async categoryAutoPublishCronJob() {
    const result = await this.categoryRepo.getAllUnPublishCategory();
    const newDate = moment.utc(new Date().toISOString()).subtract(60, 's');
    const currentTime = newDate.add(5, 'hours');
    let ids = [];
    for (let i = 0; i < result.length; i++) {
      const momentDate = moment.utc(result[i].autoPublishTime);
      const checkTime = moment(momentDate).isSameOrBefore(currentTime);
      if (checkTime) {
        ids.push(result[i]._id);
      }
    }
    await this.categoryRepo.categoryAutoPublishCronJob(ids);
  }

  @Cron('*/60 * * * * *')
  async categoryPublishCronJob() {
    const result = await this.categoryRepo.getAllCategory();
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
    await this.categoryRepo.categoryAutoPublishCronJob(ids);
  }

  @Cron('*/60 * * * * *')
  async categoryUnPublishCronJob() {
    const result = await this.categoryRepo.getAllCategory();
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
    await this.categoryRepo.categoryUnPublishCronJob(ids);
  }
}
