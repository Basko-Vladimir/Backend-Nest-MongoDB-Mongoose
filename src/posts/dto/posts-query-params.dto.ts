import { CommonQueryParamsDto } from '../../common/common.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PostSortByField } from '../../common/enums';

export class PostsQueryParamsDto extends CommonQueryParamsDto {
  @IsEnum(PostSortByField)
  @IsOptional()
  readonly sortBy: PostSortByField = PostSortByField.createdAt;
}
