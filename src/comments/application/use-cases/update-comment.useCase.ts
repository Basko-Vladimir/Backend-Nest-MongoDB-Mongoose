import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentDto } from '../../api/dto/update-comment.dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public updateCommentDto: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const { updateCommentDto, commentId } = command;
    const targetComment = await this.commentsRepository.findCommentById(
      commentId,
    );
    const updatedComment = await targetComment.updateComment(
      updateCommentDto.content,
      targetComment,
    );

    await this.commentsRepository.saveComment(updatedComment);
  }
}
