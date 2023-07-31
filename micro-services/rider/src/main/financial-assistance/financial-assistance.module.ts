import { Module } from '@nestjs/common';
import { FinancialAssistanceController } from './financial-assistance.controller';
import { FinancialAssistanceService } from './financial-assistance.service';
import { FinancialAssistanceRepository } from './financial-assistance.repository';
import { FinancialAssistance } from 'src/entity/financial-assistance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsService } from 'src/utils/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialAssistance])],
  controllers: [FinancialAssistanceController],
  providers: [
    FinancialAssistanceService,
    FinancialAssistanceRepository,
    AwsService,
  ],
})
export class FinancialAssistanceModule {}
