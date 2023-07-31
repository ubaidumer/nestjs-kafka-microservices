import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// fields to be present in a request body to create FAQS by customer
export class CreateFAQSDTO {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

// fields to be present in a request body to update FAQS by customer
export class UpdateFAQSDTO {
  @IsString()
  @IsOptional()
  question: string;

  @IsString()
  @IsOptional()
  answer: string;

  @IsString()
  @IsIn(['PUBLISH', 'UNPUBLISH'])
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
export class FAQSPaginationDTO {
  @IsString()
  @IsIn(['CUSTOMER', 'RIDER'])
  @IsOptional()
  type: string;

  @IsString()
  @IsIn(['PUBLISH', 'UNPUBLISH'])
  @IsOptional()
  status: string;

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
  question: string;
}
