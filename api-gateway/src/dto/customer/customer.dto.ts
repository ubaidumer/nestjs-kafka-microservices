import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  Matches,
  IsIn,
  IsNumber,
  Min,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
// fields to be present in a request body to update a customer
export class UpdateCustomerDTO {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  blockCod: boolean;

  @IsString()
  @IsOptional()
  image: string;

  @Matches(/^\+[1-9]\d{1,14}$/)
  @IsPhoneNumber()
  @IsString()
  @IsOptional()
  phoneNo: string;
}

export class UpdateCustomerStatusDTO {
  @IsString()
  @IsIn(['ACTIVE', 'BLOCKED'])
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  reason: string;

  @IsString()
  @IsOptional()
  reasonSubject: string;
}

// function to convert string type query params to number type
function transformQueryParam(param: TransformFnParams): number {
  const numericRegex = /^[0-9]+$/;
  const value = param.value.toString();
  if (!numericRegex.test(value)) {
    return value;
  } else return parseInt(value);
}

export class CustomerPaginationQueryDTO {
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
  @IsIn(['ACTIVE', 'BLOCKED'])
  @IsOptional()
  status: string;
}
