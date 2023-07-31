import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// fields to be present in a request body to create customer address
export class CreateAddressDTO {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  landmark: string;

  @IsString()
  @IsNotEmpty()
  addressType: string;

  @IsString()
  @IsOptional()
  specialInstructions: string;

  @IsNumber()
  @IsOptional()
  lat: number;

  @IsNumber()
  @IsOptional()
  long: number;
}

// fields to be present in a request body to update customer address
export class UpdateAddressDTO {
  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  landmark: string;

  @IsString()
  @IsOptional()
  addressType: string;

  @IsString()
  @IsOptional()
  specialInstructions: string;

  @IsNumber()
  @IsOptional()
  lat: number;

  @IsNumber()
  @IsOptional()
  long: number;
}
