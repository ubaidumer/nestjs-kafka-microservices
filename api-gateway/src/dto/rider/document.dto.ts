import { TransformFnParams, Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UploadDocumentDTO {
  @IsNotEmpty()
  @IsString()
  @IsIn([
    'CNICFRONT',
    'CNICBACK',
    'DRIVINGLICENSEFRONT',
    'DRIVINGLICENSEBACK',
    'VEHICLEREGISTRATIONFRONT',
    'VEHICLEREGISTRATIONBACK',
  ])
  type: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;
}

export class UpdateDocumentDTO {
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;
}

export class VerifyDocumentDTO {
  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REJECTED'])
  status: string;

  @IsOptional()
  @IsString()
  reason: string;
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
export class DocumentPaginationQueryDTO {
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
  riderId: string;

  @IsString()
  @IsIn(['APPROVED', 'PENDING', 'REJECTED'])
  @IsOptional()
  status: string;
}
