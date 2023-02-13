import { IsEmail, IsString } from 'class-validator';

export class ResendEmailRegistrationDto {
  @IsString()
  @IsEmail()
  readonly email: string;
}
