import { Module } from '@nestjs/common';
import { RiderModule } from '../rider/rider.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AwsService } from '../../utils/aws.service';
import { AddressModule } from '../address/address.module';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';
import { AuthSagaController } from './auth.sage.controller';

@Module({
  imports: [RiderModule, AddressModule],
  controllers: [AuthController, AuthSagaController],
  providers: [AuthService, AwsService, kafkaClientManager],
})
export class AuthModule {}
