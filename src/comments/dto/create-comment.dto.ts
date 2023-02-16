import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { commentsConstants, usersConstants } from '../../common/constants';
import { IsNotEmptyString } from '../../common/validators/is-not-empty-string.validator';
import { IsExistEntity } from '../../common/validators/is-exist-entity.validator';

const { MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH } = commentsConstants;
const { MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH, LOGIN_REG_EXP } = usersConstants;

export class CreateCommentDto {
  @IsString()
  @IsNotEmptyString()
  @Length(MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH)
  readonly content: string;

  @IsNotEmpty()
  @IsNotEmptyString()
  @IsExistEntity()
  @IsMongoId()
  readonly postId: string;

  @IsNotEmpty()
  @IsNotEmptyString()
  @IsMongoId()
  readonly userId: string;

  @IsString()
  @Length(MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH)
  @IsNotEmptyString()
  @Matches(LOGIN_REG_EXP)
  readonly userLogin: string;
}
