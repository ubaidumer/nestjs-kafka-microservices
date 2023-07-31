import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Options } from 'src/dto/product/product.dto';

// deal items fields
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Options)
  options: Options[];

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
