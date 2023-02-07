import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { blogsConstants, MIN_STRINGS_LENGTH } from '../../common/constants';

const {
  MAX_NAME_LENGTH,
  MAX_WEBSITE_URL_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  WEBSITE_URL_REG_EXP,
} = blogsConstants;

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @Length(MIN_STRINGS_LENGTH, MAX_NAME_LENGTH)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  // @IsUrl() // We also can use it instead @Matches
  @Matches(WEBSITE_URL_REG_EXP)
  @MaxLength(MAX_WEBSITE_URL_LENGTH)
  readonly websiteUrl: string;

  @IsString()
  @IsNotEmpty()
  @Length(MIN_STRINGS_LENGTH, MAX_DESCRIPTION_LENGTH)
  readonly description: string;
}
