import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { riderComplianceDocumentCategory } from 'src/utils/constant/riderConstants';
import { transformQueryParam } from '../customer/common.dto';
import { Transform } from 'class-transformer';

// fields to be present in a request body to upload compliance documents of a rider
export class UploadComplianceDocumentsRiderDTO {
  @IsString()
  @IsIn(riderComplianceDocumentCategory)
  documentType: string;

  @IsString()
  mimeType: string;

  @IsString()
  originalName: string;
}

export class RequestComplianceDocumentsRiderDTO {
  @IsString()
  riderId: string;
}

// fields to be present in a request body to update compliance
export class UpdateComplianceRiderDTO {
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating: number;
}

export class CompliancePaginationQueryDTO {
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
  @IsIn(['RATED', 'NOTRATED'])
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsIn(['RANDOM', 'MANDATORY'])
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  branchId: string;
}
