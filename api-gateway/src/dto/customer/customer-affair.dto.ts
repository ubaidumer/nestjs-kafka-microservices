import { IsIn, IsOptional, IsString } from 'class-validator';
import { customerAffairStatusCategory } from 'src/utils/constant/customer-affairConstant';

// fields to be present in a request body to create a customer affair
export class CreateCustomerAffairDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsIn(customerAffairStatusCategory)
  status: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  orderId: string;
}
