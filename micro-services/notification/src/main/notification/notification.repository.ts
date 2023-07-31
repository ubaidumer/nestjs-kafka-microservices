import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from 'src/entity/notificaions.entity';

// Services to perform all bussiness and required operations
@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private notificationService: Model<NotificationDocument>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.notificationService.create({
        userId: body.id,
        ...body,
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search by user id query and exception handling
  async findById(id) {
    try {
      return await this.notificationService.findById(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // find all notification and exception handling
  async findByUserId(id, query) {
    try {
      const { page = 0, limit = 10 } = query;
      return await this.notificationService
        .find({ userId: id })
        .skip(page * limit)
        .limit(limit);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
