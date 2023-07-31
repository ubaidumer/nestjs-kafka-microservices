import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModule } from './main/feedback/feedback.module';
import { OrderModule } from './main/order/order.module';
import { PaymentModule } from './main/payment/payment.module';

//  config all module here to access all endpoints.... and config database here
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGOURL),
    OrderModule,
    FeedbackModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
