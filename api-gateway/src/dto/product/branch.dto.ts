import { PartialType } from '@nestjs/mapped-types';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { DaysEnum } from 'src/utils/constant/productConstant';

class Timing {
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}

class branchTimingDetails {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ])
  day: DaysEnum;

  @IsArray()
  @ValidateNested()
  @Type(() => Timing)
  timing: Timing[];
}

class specialTimingDTO {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}

// fields to be present in a request body to create Branch
export class CreateBranchDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsNotEmpty()
  radius: number;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  facilities: string[];

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  long: number;
}

export class UpdateBranchDTO extends PartialType(CreateBranchDTO) {
  @IsString()
  @IsOptional()
  image: string;

  @Matches(/^\+[1-9]\d{1,14}$/)
  @IsPhoneNumber()
  @IsString()
  @IsOptional()
  phoneNo: string;

  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  location: number[];

  @IsOptional()
  deliveryArea: number[][];

  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'])
  @IsOptional()
  status: string;
}

// function to convert string type query params to number type
function transformQueryParam(param: TransformFnParams): number {
  const numericRegex = /^[0-9]+$/;
  const value = param.value.toString();
  if (!numericRegex.test(value)) {
    return value;
  } else return parseInt(value);
}

// fields to be present in query for pagination
export class BranchPaginationQueryDTO {
  @Transform(transformQueryParam)
  @IsNumber()
  @IsOptional()
  page: number;

  @Transform(transformQueryParam)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number;

  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sort: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  region: string;

  @IsString()
  @IsOptional()
  city: string;
}

// fields to be present in query for pagination
export class BranchShiftTimingDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => branchTimingDetails)
  branchTiming: branchTimingDetails[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => specialTimingDTO)
  specialTiming: specialTimingDTO[];
}
