import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import { blogsConstants, MIN_STRINGS_LENGTH } from '../../common/constants';
import { IsNotEmptyString } from '../../common/validators/is-not-empty-string.validator';

const { MAX_NAME_LENGTH, MAX_WEBSITE_URL_LENGTH, MAX_DESCRIPTION_LENGTH } =
  blogsConstants;

export class CreateBlogDto {
  @IsString()
  @IsNotEmptyString()
  @Length(MIN_STRINGS_LENGTH, MAX_NAME_LENGTH)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsNotEmptyString()
  @IsUrl()
  @MaxLength(MAX_WEBSITE_URL_LENGTH)
  readonly websiteUrl: string;

  @IsString()
  @IsNotEmptyString()
  @Length(MIN_STRINGS_LENGTH, MAX_DESCRIPTION_LENGTH)
  readonly description: string;
}
