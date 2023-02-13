import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmRegistrationDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
