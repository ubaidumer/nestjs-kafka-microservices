import { PartialType } from '@nestjs/mapped-types';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class CategoryPriority {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsNumber()
  @IsNotEmpty()
  priority: number;
}

class ImageDetails {
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;
}

// fields to be present in a request body to create Category
export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ImageDetails)
  image: ImageDetails;

  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;

  @IsBoolean()
  @IsNotEmpty()
  IsTimeSpecific: boolean;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  productIds: string[];

  @IsOptional()
  @IsDateString()
  publishStartTime: Date;

  @IsOptional()
  @IsDateString()
  publishEndTime: Date;
}
// fields to be present in a request body to update Category
export class UpadateCategoryDTO extends PartialType(CreateCategoryDTO) {}

// // fields to be present in a request body to update Category
// export class UpadateCategoryDTO {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsString()
//   @IsNotEmpty()
//   image: string;

//   @IsBoolean()
//   @IsNotEmpty()
//   isAvailable: boolean;
// }
export class UpdateMultipleCategoriessDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categoryIds: string[];

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;
}

// fields to be present in a request body to delete multiple products
export class DeleteMultipleCategoriessDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categoriesIds: string[];
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
export class CategoryPaginationQueryDTO {
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

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;
}

// fields to be present in query for pagination
export class PaginationQueryDTOInCategory {
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

// fields to be present in a request body to update multiple products availablity
export class CategoryPriorityListDTO {
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CategoryPriority)
  categoryPriority: CategoryPriority[];
}
