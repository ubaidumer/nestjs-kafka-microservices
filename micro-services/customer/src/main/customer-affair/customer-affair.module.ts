import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAffair } from 'src/entity/customer-affair.entity';
import { AuthModule } from '../auth/auth.module';
import { CustomerAffairController } from './customer-affair.controller';
import { CustomerAffairRepository } from './customer-affair.repository';
import { CustomerAffairService } from './customer-affair.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([CustomerAffair])],
  controllers: [CustomerAffairController],
  providers: [CustomerAffairService, CustomerAffairRepository],
})
export class CustomerAffairModule {}
