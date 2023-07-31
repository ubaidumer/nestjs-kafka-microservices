import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { productOptions } from './productOptions';
import { Type } from 'class-transformer';

// Order Items related fields
export class orderItems {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  productQuantity: number;

  @IsNumber()
  @IsOptional()
  productBasePrice: number;

  @IsNumber()
  @IsNotEmpty()
  productPrepTime: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => productOptions)
  @ArrayMinSize(1)
  productOptions: productOptions[];

  @IsString()
  @IsOptional()
  specialInstruction: string;
}
