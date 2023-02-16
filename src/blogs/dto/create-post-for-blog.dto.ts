import { IsString, Length } from 'class-validator';
import { MIN_STRINGS_LENGTH, postsConstants } from '../../common/constants';
import { IsNotEmptyString } from '../../common/validators/is-not-empty-string.validator';

const { MAX_TITLE_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH, MAX_CONTENT_LENGTH } =
  postsConstants;

export class CreatePostForBlogDto {
  @IsString()
  @IsNotEmptyString()
  @Length(MIN_STRINGS_LENGTH, MAX_TITLE_LENGTH)
  readonly title: string;

  @IsString()
  @IsNotEmptyString()
  @Length(MIN_STRINGS_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH)
  readonly shortDescription: string;

  @IsString()
  @IsNotEmptyString()
  @Length(MIN_STRINGS_LENGTH, MAX_CONTENT_LENGTH)
  readonly content: string;
}
