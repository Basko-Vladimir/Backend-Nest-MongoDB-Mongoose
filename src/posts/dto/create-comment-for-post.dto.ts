import { IsString, Length } from 'class-validator';
import { commentsConstants } from '../../common/constants';
import { IsNotEmptyString } from '../../common/validators/is-not-empty-string.validator';

const { MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH } = commentsConstants;

export class CreateCommentForPostDto {
  @IsString()
  @IsNotEmptyString()
  @Length(MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH)
  content: string;
}
