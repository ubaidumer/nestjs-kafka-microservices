import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// fields to be present in a response body
export class ResponseDTO {
  code: number;
  isSuccess: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  body: Object;
  message: string;
  timestamp: Date;
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
export class PaginationQueryDTO {
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
  status: string;
}

// fields to be present in query for pagination
export class ConfigurationDTO {
  @IsBoolean()
  @IsOptional()
  orderManualAcceptance: boolean;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsNumber()
  @IsOptional()
  adminAcceptanceTimeLimit: number;

  @IsNumber()
  @IsOptional()
  riderAssigningTimeLimit: number;

  @IsNumber()
  @IsOptional()
  riderAcceptanceTimeLimit: number;

  @IsNumber()
  @IsOptional()
  riderPickupTimeLimit: number;

  @IsNumber()
  @IsOptional()
  OrderCancelTimeLimit: number;
}
