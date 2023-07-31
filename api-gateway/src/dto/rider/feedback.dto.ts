import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// fields to be present in a request body to create rider feedback by customer
export class CreateFeedbackDTO {
  @IsNumber()
  @IsNotEmpty()
  stars: number;

  @IsString()
  @IsOptional()
  message: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  riderId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsOptional()
  @IsString()
  fcmToken: string;
}
