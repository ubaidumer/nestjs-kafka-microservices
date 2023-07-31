import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsEmpty,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

//fields to be present in a request body to create payment
export class PaymentDTO {
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  paymentGateway: string;

  @IsString()
  @IsNotEmpty()
  customerGatewayId: string;

  @IsBoolean()
  @IsEmpty()
  isPaid: boolean;

  @IsString()
  @IsEmpty()
  status: string;

  @IsString()
  @IsEmpty()
  customerId: string;
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
export class PaymentPaginationQueryDTO {
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
}
