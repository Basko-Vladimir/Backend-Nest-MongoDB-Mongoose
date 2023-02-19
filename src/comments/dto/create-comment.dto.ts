import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { commentsConstants, usersConstants } from '../../common/constants';
import { IsNotEmptyContent } from '../../common/validators/is-not-empty-content.validator';
import { IsExistEntity } from '../../common/validators/is-exist-entity.validator';

const { MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH } = commentsConstants;
const { MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH, LOGIN_REG_EXP } = usersConstants;

export class CreateCommentDto {
  @IsString()
  @IsNotEmptyContent()
  @Length(MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH)
  readonly content: string;

  @IsNotEmpty()
  @IsNotEmptyContent()
  @IsExistEntity()
  @IsMongoId()
  readonly postId: string;

  @IsNotEmpty()
  @IsNotEmptyContent()
  @IsMongoId()
  readonly userId: string;

  @IsString()
  @Length(MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH)
  @IsNotEmptyContent()
  @Matches(LOGIN_REG_EXP)
  readonly userLogin: string;
}
