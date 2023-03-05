import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../../../users/schemas/user.schema';
import { LikeStatus } from '../../../common/enums';
import { LikesRepository } from '../../infrastructure/likes.repository';
import { Like, LikeModelType } from '../../schemas/like.schema';

export class CreateLikeCommand {
  constructor(
    public user: UserDocument,
    public postId: string,
    public status: LikeStatus = LikeStatus.NONE,
    public commentId?: string,
  ) {}
}

@CommandHandler(CreateLikeCommand)
export class CreateLikeUseCase implements ICommandHandler<CreateLikeCommand> {
  constructor(
    private likesRepository: LikesRepository,
    @InjectModel(Like.name) protected LikeModel: LikeModelType,
  ) {}

  async execute(command: CreateLikeCommand): Promise<void> {
    const { commentId, status, user, postId } = command;
    const createdLike = this.LikeModel.createLikeEntity(
      String(user._id),
      user.login,
      postId,
      status,
      this.LikeModel,
      commentId,
    );

    await this.likesRepository.saveLike(createdLike);
  }
}
