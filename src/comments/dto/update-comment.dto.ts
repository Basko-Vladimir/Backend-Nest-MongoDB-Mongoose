import { IsString, Length } from 'class-validator';
import { commentsConstants } from '../../common/constants';

const { MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH } = commentsConstants;

export class UpdateCommentDto {
  @IsString()
  @Length(MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH)
  content: string;
}
