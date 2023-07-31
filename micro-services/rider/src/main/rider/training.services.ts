import { BadRequestException, Injectable } from '@nestjs/common';
import { traningStatusValue } from 'src/utils/constants/traningConstant';
import { AwsService } from '../../utils/aws.service';
import { TrainingRepository } from './training.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class TrainingService {
  constructor(
    private readonly trainingRepository: TrainingRepository,
    private readonly awsService: AwsService,
  ) {}

  // Bussiness functions

  // create Rider service function
  async create(id, body) {
    try {
      const { title, originalName, mimeType, type } = body;
      const fileResponse = await this.awsService.getUploadUrl(
        `training/${id}/${Date.now()}-${originalName}`,
        mimeType,
      );
      const findTitle = await this.trainingRepository.findByTitle(title);
      if (findTitle) {
        throw new BadRequestException('RIDER_E0013');
      }
      const trainingResponse = await this.trainingRepository.create({
        adminId: id,
        title,
        key: fileResponse.key,
        type,
      });
      return { body: { fileResponse, trainingResponse }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search Rider service function
  async find(query) {
    try {
      const { page = 0, limit = 10, status, sort, type } = query;
      const data = await this.trainingRepository.find({
        skip: page * limit,
        take: limit,
        status,
        sort,
        type,
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

  async publishTraining(traningIds) {
    try {
      for (let i = 0; i < traningIds.length; i++) {
        await this.validateId(traningIds[i]);
        await this.trainingRepository.update(traningIds[i], {
          status: traningStatusValue.PUBLISH,
        });
      }
      return { body: 'Traning Published!', isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by training id query and exception handling
  async unPublishTraining(traningIds) {
    try {
      for (let i = 0; i < traningIds.length; i++) {
        await this.validateId(traningIds[i]);
        await this.trainingRepository.update(traningIds[i], {
          status: traningStatusValue.UNPUBLISH,
        });
      }

      return { body: 'Traning Un-Published!', isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search Rider service function
  async findById(id) {
    try {
      await this.validateId(id);
      const data = await this.trainingRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by Rider id service function
  async update(id, body) {
    try {
      const { title, originalName, mimeType, type } = body;
      const training = await this.validateId(id);
      this.awsService.deleteFile(training.key);
      const fileResponse = await this.awsService.getUploadUrl(
        `training/${id}/${Date.now()}-${originalName}`,
        mimeType,
      );
      if (title) {
        const findTitle = await this.trainingRepository.findByTitle(title);
        if (findTitle) {
          throw new BadRequestException('RIDER_E0013');
        }
      }

      const data = await this.trainingRepository.update(id, {
        title,
        type,
        key: fileResponse.key,
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

  // update by Rider id service function
  async delete(id) {
    try {
      const data = await this.trainingRepository.delete(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  async findByTitle(title) {
    try {
      return await this.trainingRepository.findByTitle({
        where: {
          title,
        },
      });
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  //util functions

  // validates Rider id
  async validateId(id) {
    const checkId = await this.trainingRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('RIDER_E0015');
    }
    return checkId;
  }
}
