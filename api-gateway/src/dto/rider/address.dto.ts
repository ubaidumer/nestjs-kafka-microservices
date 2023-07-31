import { IsString } from 'class-validator';

// fields to be present in a request body to update address
export class UpdateAddressByRiderDTO {
  @IsString()
  address: string;

  @IsString()
  country: string;

  @IsString()
  province: string;

  @IsString()
  city: string;
}
