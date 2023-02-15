import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { MIN_STRINGS_LENGTH, postsConstants } from '../../common/constants';
import { IsNotEmptyString } from '../../common/validators/is-not-empty-string.validator';

const { MAX_TITLE_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH, MAX_CONTENT_LENGTH } =
  postsConstants;

export class UpdatePostDto {
  @IsString()
  @Validate(IsNotEmptyString)
  @Length(MIN_STRINGS_LENGTH, MAX_TITLE_LENGTH)
  title: string;

  @IsString()
  @Validate(IsNotEmptyString)
  @Length(MIN_STRINGS_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH)
  shortDescription: string;

  @IsString()
  @Validate(IsNotEmptyString)
  @Length(MIN_STRINGS_LENGTH, MAX_CONTENT_LENGTH)
  content: string;

  @IsNotEmpty()
  @Validate(IsNotEmptyString)
  @IsMongoId()
  blogId: string;
}
