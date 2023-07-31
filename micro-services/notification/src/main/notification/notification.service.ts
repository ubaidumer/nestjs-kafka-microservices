import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  // create query and exception handling
  async create(body) {
    try {
      const data = await this.notificationRepo.create(body);
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
      const data = await this.notificationRepo.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all notifications and exception handling
  async findOneUserAllNotifications(id, query) {
    try {
      const data = await this.notificationRepo.findByUserId(id, query);
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
