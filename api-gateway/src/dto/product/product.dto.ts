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
import { PartialType } from '@nestjs/mapped-types';
import { DealItems } from 'src/utils/constant/dealItems';
import { selectionEnum } from 'src/utils/constant/productConstant';
import { Transform, TransformFnParams, Type } from 'class-transformer';

class ImageDetails {
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;
}

export class Variations {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  addOnsIds: string;
}

export class Options {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  isRequired: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isMultiSelectable: boolean;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Variations)
  variations: Variations[];
}

// fields to be present in a request body to create Product
export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Options)
  options: Options[];

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ImageDetails)
  image: ImageDetails;

  @IsNumber()
  @IsNotEmpty()
  prepTime: number; // how much time this product take to prepare

  @IsArray()
  @IsNotEmpty()
  selectionEnum: selectionEnum[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DealItems)
  dealItems: DealItems[];

  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isDeal: boolean;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  addOnsIds: string;

  @IsString()
  @IsNotEmpty()
  SKU: string;

  @IsArray()
  @IsString({ each: true })
  menuIds: string[];

  @IsArray()
  @IsString({ each: true })
  facilities: string[];

  @IsArray()
  @IsString({ each: true })
  branchIds: string[];

  @IsArray()
  @IsString({ each: true })
  categoryId: string[];
}

export class UpdateProductDTO extends PartialType(ProductDTO) {}

// fields to be present in a request body to delete multiple products
export class DeleteMultipleProductsDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  productIds: string[];
}

// fields to be present in a request body to update multiple products availablity
export class UpdateMultipleProductsDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  productIds: string[];

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  categoryId: string;
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
export class ProductPaginationQueryDTO {
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
  price: string;

  @IsBoolean()
  @IsOptional()
  isDeal: boolean;

  @IsOptional()
  @IsString()
  selectionEnum: string;

  @IsOptional()
  @IsString()
  branchId: string;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;
}

// fields to be present in query for pagination
export class AllProductByCategoryDTo {
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
  categoryId: string;
}

// fields to be present in body for getting products by ids
export class ProductIdsDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  productIds: string[];
}

// fields to be present in body for getting products by ids
export class ProductsByAddressDTO {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  long: number;
}

// fields to be present in a request body to update multiple products availablity
export class UnPublishDTO {
  @IsNotEmpty()
  @IsDateString()
  autoPublishTime: Date;
}
