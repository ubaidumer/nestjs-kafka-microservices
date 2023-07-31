import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Configuration,
  ConfigurationSchema,
} from 'src/entity/configuration.entity';
import { Order, OrderSchema } from 'src/entity/order.entity';
import {
  OrderActivity,
  OrderActivitySchema,
} from 'src/entity/orderActivity.entity';
import { ConfigurationRepository } from './configuration.repository';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { OrderActivityRepository } from './orderActivity.repository';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: OrderActivity.name,
        schema: OrderActivitySchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Configuration.name,
        schema: ConfigurationSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    OrderActivityRepository,
    ConfigurationRepository,
    kafkaClientManager,
    ConfigurationRepository,
  ],
})
export class OrderModule {}
