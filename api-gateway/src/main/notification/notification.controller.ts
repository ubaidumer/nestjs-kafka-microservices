import {
  Body,
  Controller,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Roles } from 'src/role.decorator';
import { AuthGuard } from 'src/auth.guard';
import { HttpExceptionFilter } from 'src/utils/exceptionFilter';
import { Kafka } from 'kafkajs';
import { configService } from 'src/config/config';
import { notificationTopicArray } from 'src/utils/constant/notificationConstants';
import { CreateFcmTokenDTO } from 'src/dto/notification/notification.dto';

// Routes for auth Api's
@Controller('notifications')
export class NotificationController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: configService.getKafkaClientConfig('NotificationClient'),
      consumer: {
        groupId: 'NOTIFICATION_CONSUMER', // Should be the same thing we give in consumer
        allowAutoTopicCreation: true,
      },
    },
  })
  client: ClientKafka;

  async kafkaAdminCreateTopic() {
    const kafka = new Kafka(
      configService.getKafkaClientConfig('NotificationClient'),
    );
    var admin = kafka.admin();

    // create new topic
    await admin.createTopics({
      waitForLeaders: true,
      topics: notificationTopicArray,
    });

    // list all topics
    // const topics = await admin.listTopics();
    // console.log(topics);
  }

  async onModuleInit() {
    await this.kafkaAdminCreateTopic();

    // Need to subscribe to topic
    // so that we can get the response from kafka microservice

    notificationTopicArray.forEach((element) => {
      this.client.subscribeToResponseOf(element.topic);
    });

    this.client.connect();
  }

  // notification routes...

  // create fcmtoken route
  @UseGuards(AuthGuard)
  @Post('/fcmToken')
  @Roles('Guest', 'Customer', 'Admin', 'SuperAdmin', 'Rider')
  @UseFilters(new HttpExceptionFilter())
  createFcmToken(@Req() req: Request, @Body() body: CreateFcmTokenDTO) {
    const id = (req.user as any).id;
    return this.client.send(
      'topic-notification-fcmtoken-createFcmToken',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // create notification route
  @UseGuards(AuthGuard)
  @Post('/notifications')
  @Roles('Guest', 'Customer', 'Admin', 'SuperAdmin', 'Rider')
  @UseFilters(new HttpExceptionFilter())
  createNotification(@Req() req: Request, @Body() body) {
    const id = (req.user as any).id;
    return this.client.send(
      'topic-notification-notifications-createNotification',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }
}
