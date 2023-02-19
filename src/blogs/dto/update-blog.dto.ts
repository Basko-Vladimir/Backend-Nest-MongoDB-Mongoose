import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import { blogsConstants, MIN_STRINGS_LENGTH } from '../../common/constants';
import { IsNotEmptyContent } from '../../common/validators/is-not-empty-content.validator';

const { MAX_NAME_LENGTH, MAX_WEBSITE_URL_LENGTH, MAX_DESCRIPTION_LENGTH } =
  blogsConstants;

export class UpdateBlogDto {
  @IsString()
  @IsNotEmptyContent()
  @Length(MIN_STRINGS_LENGTH, MAX_NAME_LENGTH)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsNotEmptyContent()
  @IsUrl()
  @MaxLength(MAX_WEBSITE_URL_LENGTH)
  readonly websiteUrl: string;

  @IsString()
  @IsNotEmptyContent()
  @Length(MIN_STRINGS_LENGTH, MAX_DESCRIPTION_LENGTH)
  readonly description: string;
}
