import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../common/enums';
import { UserDocument } from '../../../users/schemas/user.schema';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { CreateLikeCommand } from '../../../likes/application/use-cases/create-like.useCase';
import { UpdateLikeCommand } from '../../../likes/application/use-cases/update-like.useCase';

export class UpdatePostLikeStatusCommand {
  constructor(
    public user: UserDocument,
    public postId: string,
    public newStatus: LikeStatus,
  ) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase
  implements ICommandHandler<UpdatePostLikeStatusCommand>
{
  constructor(
    private commandBus: CommandBus,
    private likesRepository: LikesRepository,
  ) {}

  async execute(command: UpdatePostLikeStatusCommand): Promise<void> {
    const { postId, newStatus, user } = command;
    const existingLike = await this.likesRepository.getLikeByFilter({
      userId: String(user._id),
      postId,
      commentId: null,
    });

    if (existingLike) {
      return this.commandBus.execute(
        new UpdateLikeCommand(existingLike, newStatus),
      );
    } else {
      await this.commandBus.execute(
        new CreateLikeCommand(user, postId, newStatus),
      );
    }
  }
}
