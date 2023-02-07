import { UserSortByField } from '../../common/enums';
import { CommonQueryParamsDto } from '../../common/common.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UsersQueryParamsDto extends CommonQueryParamsDto {
  @IsEnum(UserSortByField)
  @IsOptional()
  readonly sortBy: UserSortByField = UserSortByField.createdAt;

  @IsString()
  @IsOptional()
  readonly searchLoginTerm: string = '';

  @IsString()
  @IsOptional()
  readonly searchEmailTerm: string = '';
}
