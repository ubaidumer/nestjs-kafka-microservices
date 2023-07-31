import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { NotificationService } from './notification.service';
import {
  sendCustomNotification,
  sendNotification,
} from 'src/utils/notification';
import { FcmTokenService } from '../fcmtoken/fcmtoken.service';

// Routes for FCM token Api's
@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly fcmTokenService: FcmTokenService,
  ) {}

  // create new notification route
  @MessagePattern('topic-notification-notifications-createNotification')
  async createNotification(@Payload() data) {
    const result = await this.notificationService.create(data);
    const { notification, data: notificationData } = data;
    let token = data.body?.token;
    if (token) {
      await sendCustomNotification(data.body)
        .then((response) => {
          return formatResponse(
            result.isSuccess,
            result.code,
            'NOTIFICATION_S0005',
            result.body,
          );
        })
        .catch((error) =>
          formatResponse(result.isSuccess, result.code, result.message),
        );
    } else {
      // regular notification
      const response: any = await this.fcmTokenService.findByUserId(data.id);
      if (response.isSuccess) {
        token = response.body.token;
        await sendNotification(notification, notificationData, token);
        return formatResponse(
          result.isSuccess,
          result.code,
          'NOTIFICATION_S0005',
          result.body,
        );
      } else {
        return formatResponse(result.isSuccess, result.code, result.message);
      }
    }
  }

  // find one user all notifications by userId route
  @MessagePattern(
    'topic-notification-notifications-findOneUserAllNotifications',
  )
  async findOneUserAllNotifications(@Payload() data) {
    const result = await this.notificationService.findOneUserAllNotifications(
      data.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'NOTIFICATION_S0006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one notification using notifcation id route fasih bro told me that to get ny user id
  @MessagePattern('topic-notification-notification-findOneNotification')
  async findOneNotification(@Payload() data) {
    const result = await this.notificationService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'NOTIFICATION_S0007',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
