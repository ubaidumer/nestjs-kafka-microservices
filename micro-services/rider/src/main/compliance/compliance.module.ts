import { Module } from '@nestjs/common';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { complianceRepository } from './compliance.repository';
import { Compliance } from 'src/entity/compliance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsService } from 'src/utils/aws.service';
import { RiderModule } from '../rider/rider.module';

@Module({
  imports: [TypeOrmModule.forFeature([Compliance]), RiderModule],
  controllers: [ComplianceController],
  providers: [ComplianceService, complianceRepository, AwsService],
})
export class ComplianceModule {}
