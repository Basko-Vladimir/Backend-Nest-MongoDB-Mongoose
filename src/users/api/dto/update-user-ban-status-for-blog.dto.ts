import { IsMongoId, IsNotEmpty } from 'class-validator';
import { UpdateUserBanStatusDto } from './update-user-ban-status.dto';
import { IsExistEntity } from '../../../common/validators/is-exist-entity.validator';
import { IsNotEmptyContent } from '../../../common/validators/is-not-empty-content.validator';

export class UpdateUserBanStatusForBlogDto extends UpdateUserBanStatusDto {
  @IsExistEntity()
  @IsMongoId()
  @IsNotEmptyContent()
  @IsNotEmpty()
  readonly blogId: string;
}
