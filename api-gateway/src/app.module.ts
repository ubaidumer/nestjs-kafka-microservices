import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthStrategy } from './auth.strategy';
import { CustomerModule } from './main/customer/customer.module';
import { AdminModule } from './main/admin/admin.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { KafkaResponseInterceptor } from './utils/kafkaInterceptor';
import { ClientKafka } from '@nestjs/microservices';
import { OrderModule } from './main/order/order.module';
import { RiderModule } from './main/rider/rider.module';
import { ProductModule } from './main/product/product.module';
import { NotificationModule } from './main/notification/notification.module';

@Module({
  imports: [
    CustomerModule,
    AdminModule,
    RiderModule,
    OrderModule,
    ProductModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthStrategy,
    AuthGuard,
    ClientKafka,
    {
      provide: APP_INTERCEPTOR,
      useClass: KafkaResponseInterceptor,
    },
  ],
})
export class AppModule {}
