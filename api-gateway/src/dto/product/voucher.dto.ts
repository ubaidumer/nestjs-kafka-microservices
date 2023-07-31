import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

// fields to be present in a request body to create Voucher
export class CreateVoucherDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  refferalCode: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsOptional()
  @IsBoolean()
  isAvailable: boolean;

  @IsOptional()
  @IsBoolean()
  isCustomerSpecific: boolean;

  @IsBoolean()
  @IsOptional()
  isPercentage: boolean;

  @IsNumber()
  @IsOptional()
  minOrderAmount: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNumber()
  @IsOptional()
  useLimit: number;

  @IsNumber()
  @IsOptional()
  discountLimit: number;

  @IsOptional()
  @IsObject()
  location: {
    type: string;
    coordinates: {
      lat: number;
      long: number;
    }[];
    radiusKm: number;
  };

  @Matches(/^\+[1-9]\d{1,14}$/)
  @IsPhoneNumber()
  @IsOptional()
  phoneNo: string[];

  @IsString()
  @IsOptional()
  eventType: string;

  @IsOptional()
  @IsArray()
  customerIds: string[];

  @IsArray()
  @IsNotEmpty()
  branchId: string[];

  @IsOptional()
  @IsArray()
  productIds: string[];
}

export class UpdateVoucherDTO extends PartialType(CreateVoucherDTO) {}

// function to convert string type query params to number type
function transformQueryParam(param: TransformFnParams): number {
  const numericRegex = /^[0-9]+$/;
  const value = param.value.toString();
  if (!numericRegex.test(value)) {
    return value;
  } else return parseInt(value);
}

// fields to be present in query for pagination
export class VoucherPaginationQueryDTO {
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

  @IsOptional()
  branchId: string;

  @IsOptional()
  @IsDateString()
  startDate: Date;
}
