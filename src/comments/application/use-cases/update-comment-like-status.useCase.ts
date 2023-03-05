import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeCommand } from '../../../likes/application/use-cases/update-like.useCase';
import { CreateLikeCommand } from '../../../likes/application/use-cases/create-like.useCase';
import { UserDocument } from '../../../users/schemas/user.schema';
import { LikeStatus } from '../../../common/enums';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class UpdateCommentLikeStatusCommand {
  constructor(
    public user: UserDocument,
    public commentId: string,
    public newStatus: LikeStatus,
  ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase
  implements ICommandHandler<UpdateCommentLikeStatusCommand>
{
  constructor(
    private commandBus: CommandBus,
    private likesRepository: LikesRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: UpdateCommentLikeStatusCommand): Promise<void> {
    const { newStatus, commentId, user } = command;
    const existingLike = await this.likesRepository.getLikeByFilter({
      userId: String(user._id),
      commentId,
    });

    if (existingLike) {
      return this.commandBus.execute(
        new UpdateLikeCommand(existingLike, newStatus),
      );
    } else {
      const targetComment = await this.commentsRepository.findCommentById(
        commentId,
      );
      await this.commandBus.execute(
        new CreateLikeCommand(
          user,
          String(targetComment.postId),
          newStatus,
          commentId,
        ),
      );
    }
  }
}
