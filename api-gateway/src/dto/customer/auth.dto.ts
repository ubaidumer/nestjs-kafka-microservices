import {
  IsString,
  IsPhoneNumber,
  IsEmail,
  Matches,
  IsNumber,
  Max,
  IsIn,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import {
  channelCategory,
  taskCategory,
} from 'src/utils/constant/customerConstant';

// fields to be present in a request body to onboard a guest type customer
export class GuestOnboardingDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsDateString()
  dob: string;
}

// fields to be present in a request body to onboard a authorized user type customer
export class UserOnboardingDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsDateString()
  dob: string;
}

// fields to be present in a request body to onboard a authorized user type customer by admin actions
export class UserOnboardingByAdminDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  phoneNo: string;
}

// fields to be present in a request body to send otp number of a customer
export class SendOtpDTO {
  @Matches(/^\+[1-9]\d{1,14}$/)
  @IsPhoneNumber()
  @IsString()
  phoneNo: string;

  @IsString()
  @IsIn(channelCategory)
  channelType: string;
}

// fields to be present in a request body to verify otp of a customer
export class VerifyOtpDTO {
  @Matches(/^\+[1-9]\d{1,14}$/)
  @IsPhoneNumber()
  @IsString()
  phoneNo: string;

  @IsNumber()
  @Max(999999)
  otp: number;

  @IsString()
  @IsIn(taskCategory)
  taskType: string;
}
