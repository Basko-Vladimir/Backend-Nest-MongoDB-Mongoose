import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { usersConstants } from '../../common/constants';
import { IsNotEmptyString } from '../../common/validators/is-not-empty-string.validator';

const {
  MIN_LOGIN_LENGTH,
  MAX_LOGIN_LENGTH,
  LOGIN_REG_EXP,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} = usersConstants;

export class CreateUserDto {
  @IsString()
  @Length(MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH)
  @IsNotEmptyString()
  @Matches(LOGIN_REG_EXP)
  readonly login: string;

  @IsString()
  @IsNotEmptyString()
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH)
  readonly password: string;

  @IsString()
  @IsNotEmptyString()
  @IsEmail()
  readonly email: string;
}
