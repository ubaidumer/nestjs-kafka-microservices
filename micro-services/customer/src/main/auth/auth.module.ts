import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { TwilioModule } from 'nestjs-twilio';
import { configService } from 'src/config/config';
import { AuthSagaController } from './auth.saga.controller';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [
    CustomerModule,
    TwilioModule.forRoot(configService.getTwillioConfig()),
  ],
  providers: [AuthService, kafkaClientManager],
  exports: [AuthService],
  controllers: [AuthController, AuthSagaController],
})
export class AuthModule {}
