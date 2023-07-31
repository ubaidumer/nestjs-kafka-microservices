import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

//coordinates fields
export class Coordinates {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  long: number;
}
