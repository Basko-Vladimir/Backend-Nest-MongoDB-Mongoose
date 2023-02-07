import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';
import { MIN_STRINGS_LENGTH, postsConstants } from '../../common/constants';

const { MAX_TITLE_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH, MAX_CONTENT_LENGTH } =
  postsConstants;

export class CreatePostDto {
  @IsString()
  @Length(MIN_STRINGS_LENGTH, MAX_TITLE_LENGTH)
  title: string;

  @IsString()
  @Length(MIN_STRINGS_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH)
  shortDescription: string;

  @IsString()
  @Length(MIN_STRINGS_LENGTH, MAX_CONTENT_LENGTH)
  content: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  blogId: string;
}
