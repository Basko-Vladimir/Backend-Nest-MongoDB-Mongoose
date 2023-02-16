import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';
import { MIN_STRINGS_LENGTH, postsConstants } from '../../common/constants';
import { IsNotEmptyString } from '../../common/validators/is-not-empty-string.validator';
import { IsExistEntity } from '../../common/validators/is-exist-entity.validator';

const { MAX_TITLE_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH, MAX_CONTENT_LENGTH } =
  postsConstants;

export class CreatePostDto {
  @IsString()
  @IsNotEmptyString()
  @Length(MIN_STRINGS_LENGTH, MAX_TITLE_LENGTH)
  title: string;

  @IsString()
  @IsNotEmptyString()
  @Length(MIN_STRINGS_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH)
  shortDescription: string;

  @IsString()
  @IsNotEmptyString()
  @Length(MIN_STRINGS_LENGTH, MAX_CONTENT_LENGTH)
  content: string;

  @IsNotEmpty()
  @IsNotEmptyString()
  @IsMongoId()
  @IsExistEntity()
  blogId: string;
}
