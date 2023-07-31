import {
  IsString,
  IsIn,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import {
  campaignCategory,
  campaignStatusCategory,
} from 'src/utils/constant/campaignConstants';

// fields to be present in a request body to create a new campaign
export class CreateCampaignDTO {
  @IsString()
  title: string;

  @IsString()
  @IsIn(campaignCategory)
  campaignType: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsIn(campaignStatusCategory)
  status: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  voucherUsagePercentage: number;

  @IsString({ each: true })
  @IsOptional()
  customerIds: string[];

  @IsString({ each: true })
  @IsOptional()
  voucherIds: string[];
}

// fields to be present in a request body to update a campaign
export class UpdateCampaignDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsIn(campaignCategory)
  @IsOptional()
  campaignType: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsIn(campaignStatusCategory)
  @IsOptional()
  status: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  voucherUsagePercentage: number;

  @IsString({ each: true })
  @IsOptional()
  customerIds: string[];

  @IsString({ each: true })
  @IsOptional()
  voucherIds: string[];
}
