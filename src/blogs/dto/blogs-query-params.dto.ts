import { IsEnum, IsOptional } from 'class-validator';
import { CommonQueryParamsDto } from '../../common/common.dto';
import { BlogSortByField } from '../../common/enums';

export class BlogsQueryParamsDto extends CommonQueryParamsDto {
  @IsEnum(BlogSortByField)
  @IsOptional()
  readonly sortBy: BlogSortByField = BlogSortByField.createdAt;

  @IsOptional()
  readonly searchNameTerm: string = '';
}
