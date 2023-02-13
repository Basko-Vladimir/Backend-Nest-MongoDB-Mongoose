import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { commentsConstants, usersConstants } from '../../common/constants';

const { MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH } = commentsConstants;
const { MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH, LOGIN_REG_EXP } = usersConstants;

export class CreateCommentDto {
  @IsString()
  @Length(MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH)
  content: string;

  @IsNotEmpty()
  @IsMongoId()
  postId: string;

  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsString()
  @Length(MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH)
  @Matches(LOGIN_REG_EXP)
  userLogin: string;
}
