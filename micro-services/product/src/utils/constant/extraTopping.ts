import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// extra topping fields for product
export class ExtraTopping {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
