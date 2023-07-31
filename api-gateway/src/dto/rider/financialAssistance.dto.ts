import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { riderFinancialTypeCategory } from 'src/utils/constant/riderConstants';

class ImageDetails {
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;
}

// fields to be present in a request body to create rider financial Assistance
export class CreateFinancialAssistanceDTO {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDetails)
  image: ImageDetails;

  @IsString()
  @IsIn(riderFinancialTypeCategory)
  type: string;
}
