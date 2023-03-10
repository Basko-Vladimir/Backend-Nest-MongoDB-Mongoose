import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  ICommentOutputModel,
  IFullCommentOutputModel,
} from '../../api/dto/comments-output-models.dto';
import { QueryLikesRepository } from '../../../likes/infrastructure/query-likes.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class GetFullCommentQuery {
  constructor(public comment: ICommentOutputModel, public userId: string) {}
}

@QueryHandler(GetFullCommentQuery)
export class GetFullCommentUseCase
  implements IQueryHandler<GetFullCommentQuery>
{
  constructor(
    private queryLikesRepository: QueryLikesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(query: GetFullCommentQuery): Promise<IFullCommentOutputModel> {
    const { comment, userId } = query;
    const notBannedUsers = await this.usersRepository.findManyUserByFilter({
      ['banInfo.isBanned']: false,
    });
    const notBannedUsersFilter = notBannedUsers.map((user) => {
      return { userId: String(user._id) };
    });

    const likesInfo = await this.queryLikesRepository.getLikesInfo(
      userId,
      comment.id,
      notBannedUsersFilter,
    );

    return { ...comment, likesInfo };
  }
}
