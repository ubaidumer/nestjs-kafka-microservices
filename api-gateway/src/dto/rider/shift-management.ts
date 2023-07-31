import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { leaveCategory, leaveStatus } from 'src/utils/constant/leaveConstants';

// fields to be present in a request body to create rider Leave
export class CreateShiftDTO {
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;
}

// fields to be present in a request body to create rider Leave
export class AssignShiftToRiderDTO {
  @IsArray()
  @IsNotEmpty()
  riderIds: string;
}

// fields to be present in a request body to create rider Leave
export class UpdateShiftToRiderDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime: string;
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
