import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FcmTokenModule } from './main/fcmtoken/fcmtoken.module';
import { NotificationModule } from './main/notification/notification.module';

// config all module here to access all endpoints and config database here
@Module({
  imports: [
    FcmTokenModule,
    NotificationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGOURL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
