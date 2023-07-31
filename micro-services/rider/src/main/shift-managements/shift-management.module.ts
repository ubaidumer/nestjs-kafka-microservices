import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftManagement } from 'src/entity/shift-management.entity';
import { RiderModule } from '../rider/rider.module';
import { ShiftManagementController } from './shift-management.controller';
import { ShiftManagementRepository } from './shift-management.repository';
import { ShiftManagementService } from './shift-management.service';

@Module({
  imports: [RiderModule, TypeOrmModule.forFeature([ShiftManagement])],
  controllers: [ShiftManagementController],
  providers: [ShiftManagementService, ShiftManagementRepository],
})
export class ShiftManagementModule {}
