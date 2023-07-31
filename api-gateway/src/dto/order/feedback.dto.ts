import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// fields to be present in a request body to create order feedback by customer
export class FeedbackDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  stars: number;

  @IsArray()
  serviceSuggestions: string[];

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;
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
export class FeedbackPaginationQueryDTO {
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
