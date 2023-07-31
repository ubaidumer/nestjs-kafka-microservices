import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsIn,
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { adminCategory } from 'src/utils/constant/adminConstants';

// function to convert string type query params to number type
function transformQueryParam(param: TransformFnParams): number {
  const numericRegex = /^[0-9]+$/;
  const value = param.value.toString();
  if (!numericRegex.test(value)) {
    return value;
  } else return parseInt(value);
}

// fields to be present in a request body to onboard a google provide admin way
export class GoogleLoginDTO {
  @IsString()
  @IsEmail()
  email: string;
}

// fields to be present in a request body to create a new admin
export class CreatAdminDTO {
  @IsString()
  fullName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(adminCategory, { each: true })
  adminType: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  branchIds: string[];
}

export class UpdateAdminDTO {
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'])
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  fullName: string;
}

// fields to be present in a request body to onboard log in a admin using email password
export class LogInDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

// fields to be present in query for pagination
export class AdminPaginationQueryDTO {
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

  // @IsString()
  // @IsOptional()
  // city: string;

  // @IsString()
  // @IsOptional()
  // region: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status: string;
}
