import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import {
  NotificationSchema,
  Notification,
} from 'src/entity/notificaions.entity';
import { FcmTokenModule } from '../fcmtoken/fcmtoken.module';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [
    FcmTokenModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
