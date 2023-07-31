import { IsString } from 'class-validator';

// fields to be present in a request body to create a customer fav
export class CreateCustomerFavDTO {
  @IsString()
  productId: string;
}
