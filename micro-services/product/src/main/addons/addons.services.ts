import { BadRequestException, Injectable } from '@nestjs/common';
import { AddonsRepository } from './addons.repository';
import { AwsService } from 'src/utils/aws.service';
// Services to perform all bussiness and required operations
@Injectable()
export class AddonsService {
  constructor(
    private readonly addonsRepository: AddonsRepository,
    private readonly awsService: AwsService,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      let imageArray = [];
      for (let i = 0; i < body.variations.length; i++) {
        const { originalName, mimeType } = body.variations[i].image;
        const fileResponse = await this.awsService.getUploadUrl(
          `products/addons/${Date.now()}-${originalName}`,
          mimeType,
        );
        body.variations[i].image = fileResponse.key;
        imageArray[i] = fileResponse.url;
      }
      const data = await this.addonsRepository.create(body);
      return { body: { data, image: imageArray }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by addons id query and exception handling
  async findById(id) {
    try {
      await this.validateId(id);
      const data = await this.addonsRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // find all addons and exception handling
  async findAllAddons(query) {
    try {
      const data = await this.addonsRepository.findAllAddons(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by addons id query and exception handling
  async updateAddonsById(id: string, body) {
    try {
      await this.validateId(id);
      let imageArray = [];
      if (body.variations) {
        for (let i = 0; i < body.variations.length; i++) {
          if (body.variations[i].image) {
            const { originalName, mimeType } = body.variations[i].image;
            const fileResponse = await this.awsService.getUploadUrl(
              `products/addons/${Date.now()}-${originalName}`,
              mimeType,
            );
            body.variations[i].image = fileResponse.key;
            imageArray[i] = fileResponse.url;
          }
        }
      }
      const data = await this.addonsRepository.updateAddonsById(id, {
        ...body,
      });
      return { body: { data, image: imageArray }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by addons id query and exception handling
  async deleteAddonsById(id: string) {
    try {
      await this.validateId(id);
      const data = await this.addonsRepository.deleteAddonsById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by addons id query and exception handling
  async findAllAddonstypes() {
    try {
      const data = await this.addonsRepository.findAllAddonstypes();
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by addons id query and exception handling
  async findAllAddonsObjecttypes() {
    try {
      const data = await this.addonsRepository.findAllAddonsObjecttypes();
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates addons id
  async validateId(id) {
    const checkId = await this.addonsRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('PRODUCT_E0007');
    }
    return;
  }
}
