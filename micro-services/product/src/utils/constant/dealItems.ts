import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// dealItems feild for product
export class DealItems {
  @IsString()
  @IsNotEmpty()
  heading: string;

  @IsBoolean()
  @IsNotEmpty()
  required: boolean;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  variation: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
