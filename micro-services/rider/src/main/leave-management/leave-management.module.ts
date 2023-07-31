import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveManagement } from 'src/entity/leave-management.entity';
import { AuthModule } from '../auth/auth.module';
import { LeaveManagementController } from './leave-management.controller';
import { LeaveManagementRepository } from './leave-management.repository';
import { LeaveManagementService } from './leave-management.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([LeaveManagement])],
  controllers: [LeaveManagementController],
  providers: [LeaveManagementService, LeaveManagementRepository],
})
export class LeaveManagementModule {}
