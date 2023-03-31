import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  ICommentOutputModel,
  ICommentWithLikeInfoOutputModel,
} from '../../api/dto/comments-output-models.dto';
import { QueryLikesRepository } from '../../../likes/infrastructure/query-likes.repository';
import { UsersService } from '../../../users/application/users.service';

export class GetFullCommentQuery {
  constructor(public comment: ICommentOutputModel, public userId: string) {}
}

@QueryHandler(GetFullCommentQuery)
export class GetFullCommentUseCase
  implements IQueryHandler<GetFullCommentQuery>
{
  constructor(
    private queryLikesRepository: QueryLikesRepository,
    private usersService: UsersService,
  ) {}

  async execute(
    query: GetFullCommentQuery,
  ): Promise<ICommentWithLikeInfoOutputModel> {
    const { comment, userId } = query;
    const notBannedUsersFilter =
      await this.usersService.getNotBannedUsersFilter();
    const likesInfo = await this.queryLikesRepository.getLikesInfo(
      userId,
      comment.id,
      notBannedUsersFilter,
    );

    return { ...comment, likesInfo };
  }
}
