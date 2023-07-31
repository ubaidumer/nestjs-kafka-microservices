import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { formatResponse } from 'src/utils/response';
import { FcmTokenService } from './fcmtoken.service';

// Routes for FCM token Api's
@Controller()
export class FcmTokenController {
  constructor(private readonly fcmTokenService: FcmTokenService) {}

  // create new fcmtoken route
  @MessagePattern('topic-notification-fcmtoken-createFcmToken')
  async createFcmToken(@Payload() data) {
    const result = await this.fcmTokenService.create({
      token: data.body.fcmToken,
      userId: data.id,
    });
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'NOTIFICATION_S0001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all fcmTokens route
  @MessagePattern('topic-notification-fcmtoken-findAllFcmToken')
  async findAllFcmToken(@Payload() data) {
    const result = await this.fcmTokenService.findAllFcmToken(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'NOTIFICATION_S0002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one fcmtoken using user id route
  @MessagePattern('topic-notification-fcmtoken-findOneFcmToken')
  async findOneFcmToken(@Payload() data) {
    const result = await this.fcmTokenService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'NOTIFICATION_S0003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one fcmtoken using user id route
  @MessagePattern('topic-notification-fcmtoken-updateFcmToken')
  async updateFcmToken(@Payload() data) {
    const result = await this.fcmTokenService.updateFcmToken(
      data.param.id,
      data.token,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'NOTIFICATION_S0004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
