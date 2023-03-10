import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  IFullPostOutputModel,
  IPostOutputModel,
} from '../../api/dto/posts-output-models.dto';
import { QueryLikesRepository } from '../../../likes/infrastructure/query-likes.repository';
import { UsersService } from '../../../users/application/users.service';

export class GetFullPostQuery {
  constructor(public post: IPostOutputModel, public userId: string = null) {}
}

@QueryHandler(GetFullPostQuery)
export class GetFullPostUseCase implements IQueryHandler<GetFullPostQuery> {
  constructor(
    private queryLikesRepository: QueryLikesRepository,
    private usersService: UsersService,
  ) {}

  async execute(query: GetFullPostQuery): Promise<IFullPostOutputModel> {
    const { post, userId } = query;
    const notBannedUsersFilter =
      await this.usersService.getNotBannedUsersFilter();
    const extendedLikesInfo =
      await this.queryLikesRepository.getExtendedLikesInfo(
        userId,
        post.id,
        notBannedUsersFilter,
      );

    return { ...post, extendedLikesInfo };
  }
}
