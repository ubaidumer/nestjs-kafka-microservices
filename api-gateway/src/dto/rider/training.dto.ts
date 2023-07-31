import { Transform, TransformFnParams } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// fields to be present in a request body to update training files of a rider
export class traingStatusChanged {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  traningIds: string[];
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
export class traingPaginationDTO {
  @IsString()
  @IsIn(['TRAINING', 'TUTORIALS'])
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
}
