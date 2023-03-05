import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeDocument } from '../../schemas/like.schema';
import { LikeStatus } from '../../../common/enums';
import { LikesRepository } from '../../infrastructure/likes.repository';

export class UpdateLikeCommand {
  constructor(public like: LikeDocument, public status: LikeStatus) {}
}

@CommandHandler(UpdateLikeCommand)
export class UpdateLikeUseCase implements ICommandHandler<UpdateLikeCommand> {
  constructor(private likesRepository: LikesRepository) {}

  async execute(command: UpdateLikeCommand): Promise<void> {
    const { like, status } = command;
    const updatedLike = like.updateLikeStatus(status, like);
    await this.likesRepository.saveLike(updatedLike);
  }
}
