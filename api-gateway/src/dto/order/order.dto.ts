import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { orderStatus } from 'src/utils/constant/orderConstants';
import { orderItems } from 'src/utils/constant/orderItems';

// fields to be present in a request body to create address within order
class Address {
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
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  long: number;
}

// fields to be present in a request body to create order
export class OrderDTO {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  customerNotes: string;

  @IsString()
  @IsOptional()
  cancelationNotes: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => orderItems)
  orderItems: orderItems[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @IsPhoneNumber()
  @IsString()
  customerPhoneNo: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;

  @IsArray()
  @IsOptional()
  alternatePhoneNo: string[];

  @IsString()
  @IsOptional()
  adminId: string;

  @IsString()
  @IsOptional()
  riderId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsOptional()
  paymentId: string;

  @IsString()
  @IsOptional()
  feedbackId: string;
}

// function to convert string type query params to number type
function transformQueryParam(param: TransformFnParams): number {
  const numericRegex = /^[0-9]+$/;
  const value = param.value.toString();
  if (!numericRegex.test(value)) {
    return value;
  } else return parseInt(value);
}
// fields to be present in query for pagination
export class OrderPaginationQueryDTO {
  @Transform(transformQueryParam)
  @IsNumber()
  @IsOptional()
  page: number;

  @Transform(transformQueryParam)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number;

  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sort: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsString()
  @IsOptional()
  customerId: string;

  @IsString()
  @IsOptional()
  riderId: string;

  @IsString()
  @IsOptional()
  id: string;

  @IsOptional()
  customerPhoneNo: string;

  @IsString()
  @IsOptional()
  branchId: string;
}

// fields to be present in query for pagination
export class OrderActivePaginationQueryDTO {
  @Transform(transformQueryParam)
  @IsNumber()
  @IsOptional()
  page: number;

  @Transform(transformQueryParam)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number;

  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sort: string;

  @IsOptional()
  status: string;
}

// fields to be present in query for pagination
export class updateOrderBYAdminDTO {
  @IsString()
  @IsIn([
    'PLACED',
    'ACCEPTED',
    'WAITINGRIDER',
    'PREPARING',
    'READYFORPICKUP',
    'EXPIRED',
    'ASSIGNED',
    'CANCELED',
    'PICKEDUP',
    'DELIVERED',
    'REJECTED',
    'REJECTEDBYRIDER',
    'FAILED',
  ])
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  reason: string;

  @IsString()
  @IsOptional()
  reasonSubject: string;
}

export class rejectByRider {
  @IsString()
  @IsNotEmpty()
  riderRejectedReason: string;
}
