import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';

@Module({
  imports: [AdminModule],
  controllers: [AuthController],
  providers: [AuthService, kafkaClientManager],
})
export class AuthModule {}
