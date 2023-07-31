import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// addons fields for product
export class Addons {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
