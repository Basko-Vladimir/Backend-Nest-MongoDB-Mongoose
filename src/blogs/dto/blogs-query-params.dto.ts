import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonQueryParamsDto } from '../../common/common.dto';
import { BlogSortByField } from '../../common/enums';

export class BlogsQueryParamsDto extends CommonQueryParamsDto {
  @IsEnum(BlogSortByField)
  @IsOptional()
  readonly sortBy: BlogSortByField = BlogSortByField.createdAt;

  @IsString()
  @IsOptional()
  readonly searchNameTerm: string = '';
}
