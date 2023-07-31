import { IsNotEmpty, IsString } from 'class-validator';

// fields to be present in a request body to update customer address
export class CreateFcmTokenDTO {
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
