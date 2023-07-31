import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// fields to be present in a request body to create admin address
export class CreateAddressDTO {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  landmark: string;

  @IsString()
  @IsOptional()
  specialInstructions: string;
}

// fields to be present in a request body to update admin address
export class UpdateAddressDTO {
  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  landmark: string;

  @IsString()
  @IsOptional()
  specialInstructions: string;
}
