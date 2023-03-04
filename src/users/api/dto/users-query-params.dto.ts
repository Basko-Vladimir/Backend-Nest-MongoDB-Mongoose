import { UserSortByField } from '../../../common/enums';
import { CommonQueryParamsDto } from '../../../common/common.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UsersQueryParamsDto extends CommonQueryParamsDto {
  @IsOptional()
  @IsEnum(UserSortByField)
  readonly sortBy: UserSortByField = UserSortByField.createdAt;

  @IsOptional()
  @IsString()
  readonly searchLoginTerm: string = '';

  @IsOptional()
  @IsString()
  readonly searchEmailTerm: string = '';
}
