import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsIn } from 'class-validator';

// fields to be present in a response body
export class ResponseDTO {
  code: number;
  isSuccess: Boolean;
  body: Object;
  message: String;
  timestamp: Date;
}

// function to convert string type query params to number type
export function transformQueryParam(param: TransformFnParams): number {
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
  branchId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  status: string;
}
