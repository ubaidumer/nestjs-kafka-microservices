import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { FcmTokenRepository } from './fcmtoken.repository';
import { sendNotification } from 'src/utils/notification';

// Services to perform all bussiness and required operations
@Injectable()
export class FcmTokenService {
  constructor(private readonly fcmTokenRepo: FcmTokenRepository) {}

  // create query and exception handling
  async create(body) {
    try {
      const data = await this.fcmTokenRepo.create(body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by user id query and exception handling
  async findById(id) {
    try {
      const data = await this.fcmTokenRepo.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by user id query and exception handling
  async findByUserId(id) {
    try {
      const data = await this.fcmTokenRepo.findByUserId(id);
      console.log('FCM_TOKEN REQ', id, data);
      return { body: data, isSuccess: !!data?.token };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all fcmtoken and exception handling
  async findAllFcmToken(query) {
    try {
      const data = await this.fcmTokenRepo.findAllFcmToken(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by user id query and exception handling
  async updateFcmToken(id: string, token) {
    try {
      const data = await this.fcmTokenRepo.updateToken(id, token);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }
}
