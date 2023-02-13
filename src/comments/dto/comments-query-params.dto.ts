import { CommentSortByField } from '../../common/enums';
import { CommonQueryParamsDto } from '../../common/common.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class CommentsQueryParamsDto extends CommonQueryParamsDto {
  @IsEnum(CommentSortByField)
  @IsOptional()
  readonly sortBy: CommentSortByField = CommentSortByField.createdAt;
}
