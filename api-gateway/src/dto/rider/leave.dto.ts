import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { leaveCategory, leaveStatus } from 'src/utils/constant/leaveConstants';

// fields to be present in a request body to create rider Leave
export class CreateLeaveDTO {
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsIn(leaveCategory)
  leaveType: string;

  @IsString()
  @IsOptional()
  riderId: string;
}

// fields to be present in a request body to update rider Leave
export class UpdateLeaveByRiderDTO {
  @IsDateString()
  @IsOptional()
  startTime: string;

  @IsDateString()
  @IsOptional()
  endTime: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  @IsIn(leaveCategory)
  leaveType: string;
}

// fields to be present in a request body to update rider leave by admin
export class UpdateLeaveByAdminDTO {
  @IsString()
  @IsNotEmpty()
  riderId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(leaveStatus)
  status: string;
}
