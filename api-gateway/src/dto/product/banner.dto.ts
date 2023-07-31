import { PartialType } from '@nestjs/mapped-types';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsIn,
  Min,
  IsEnum,
} from 'class-validator';

class BannerPriority {
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

enum PlatformEnum {
  WEBSITE = 'WEBSITE',
  APPLICATION = 'APPLICATION',
}
type PlatformEnumType = 'WEBSITE' | 'APPLICATION';

// fields to be present in a request body to create Banner
export class CreateBannerDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsEnum(PlatformEnum, { each: true })
  platform: PlatformEnumType[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDetails)
  websiteImage: ImageDetails;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDetails)
  applicationImage: ImageDetails;

  @IsBoolean()
  @IsNotEmpty()
  IsTimeSpecific: boolean;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  branchIds: string[];

  @IsOptional()
  @IsDateString()
  publishStartTime: Date;

  @IsOptional()
  @IsDateString()
  publishEndTime: Date;
}
// fields to be present in a request body to update banner
export class UpadateBannerDTO extends PartialType(CreateBannerDTO) {}

// function to convert string type query params to number type
function transformQueryParam(param: TransformFnParams): number {
  const numericRegex = /^[0-9]+$/;
  const value = param.value.toString();
  if (!numericRegex.test(value)) {
    return value;
  } else return parseInt(value);
}

// fields to be present in query for pagination
export class BannerPaginationQueryDTO {
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

  @IsOptional()
  @IsString()
  branchId: string;
}

export class UpdateMultipleBannersDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  bannerIds: string[];

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;
}

// fields to be present in a request body to delete multiple products
export class DeleteMultipleBannersDTO {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  bannerIds: string[];
}

// fields to be present in a request body to update multiple branner priority availablity
export class BannerPriorityListDTO {
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => BannerPriority)
  bannerPriority: BannerPriority[];
}
