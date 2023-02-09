import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import { blogsConstants, MIN_STRINGS_LENGTH } from '../../common/constants';

const { MAX_NAME_LENGTH, MAX_WEBSITE_URL_LENGTH, MAX_DESCRIPTION_LENGTH } =
  blogsConstants;

export class CreateBlogDto {
  @IsString()
  @Length(MIN_STRINGS_LENGTH, MAX_NAME_LENGTH)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(MAX_WEBSITE_URL_LENGTH)
  readonly websiteUrl: string;

  @IsString()
  @Length(MIN_STRINGS_LENGTH, MAX_DESCRIPTION_LENGTH)
  readonly description: string;
}
