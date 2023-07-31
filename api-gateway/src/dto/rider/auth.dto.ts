import { BadRequestException } from '@nestjs/common';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  Max,
  IsOptional,
  IsIn,
  IsNotEmpty,
  IsBoolean,
  Min,
  ValidateNested,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import {
  riderStatusCategory,
  riderStatusCategoryType,
  traningType,
  traningTypeValue,
} from 'src/utils/constant/riderConstants';

// function to convert string type query params to number type
function transformQueryParam(param: TransformFnParams): number {
  const numericRegex = /^[0-9]+$/;
  const value = param.value.toString();
  if (!numericRegex.test(value)) {
    return value;
  } else return parseInt(value);
}

// function to convert string type query params to boolean type
function transformQueryParamIntoBoolean(param: TransformFnParams): boolean {
  const value = param.value.toString();
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else {
    throw new BadRequestException('isVerified must be Boolean');
  }
}

class Coordinates {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  long: number;
}

class ImageDetails {
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;
}

// fields to be present in a request body to create a new rider
export class CreatRiderDTO {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsString()
  phoneNo: string;

  @IsString()
  @IsNotEmpty()
  cnic: string;

  @IsString()
  @IsNotEmpty()
  bikeNo: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ImageDetails)
  image: ImageDetails;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsString()
  fcmToken: string;
}

export class VerifyOtpDTO {
  @IsString()
  cnic: string;

  @IsNumber()
  @Max(999999)
  otp: number;
}

// fields to be present in a request body to onboard log in a rider using email password
export class LogInDTO {
  @IsString()
  cnic: string;
}

// fields to be present in a request body to update a rider
export class UpdateRiderDTO {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber()
  @IsString()
  @IsOptional()
  phoneNo: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDetails)
  image: ImageDetails;

  @IsString()
  @IsOptional()
  cnic: string;

  @IsString()
  @IsOptional()
  bikeNo: string;

  @IsString()
  @IsOptional()
  fcmToken: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Coordinates)
  coordinates: Coordinates;

  @IsString()
  @IsOptional()
  @IsIn(['INACTIVE'])
  status: string;
}

// fields to be present in a request body to update a rider
export class UpdateRiderByAdminDTO {
  @IsString()
  @IsOptional()
  riderId: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @IsIn(riderStatusCategory)
  status: riderStatusCategoryType;

  @IsString()
  @IsOptional()
  reason: string;

  @IsString()
  @IsOptional()
  reasonSubject: string;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean;

  @IsPhoneNumber()
  @IsString()
  @IsOptional()
  phoneNo: string;

  @ValidateNested()
  @Type(() => ImageDetails)
  image: ImageDetails;

  @IsString()
  @IsOptional()
  cnic: string;

  @IsString()
  @IsOptional()
  bikeNo: string;

  @IsString()
  @IsOptional()
  fcmToken: string;

  @IsString()
  @IsOptional()
  branchId: string;
}

// fields to be present in a request body to upload training files of a rider
export class UploadTrainingRiderDTO {
  @IsString()
  title: string;

  @IsString()
  @IsIn(traningTypeValue)
  type: traningType;

  @IsString()
  mimeType: string;

  @IsString()
  originalName: string;
}

// fields to be present in a request body to update training files of a rider
export class UpdateTrainingRiderDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  mimeType: string;

  @IsString()
  @IsOptional()
  originalName: string;
}

export class FindRiderByStatusDTO {
  @IsOptional()
  status: riderStatusCategoryType;

  @IsOptional()
  @IsBoolean()
  @Transform(transformQueryParamIntoBoolean)
  isVerified: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(transformQueryParamIntoBoolean)
  isOnDelivery: boolean;

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
}

export class ValidateTrainingDTO {
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  answers: number[];
}
