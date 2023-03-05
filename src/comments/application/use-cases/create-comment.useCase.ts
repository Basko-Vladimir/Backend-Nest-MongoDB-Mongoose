import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../../schemas/comment.schema';
import { CreateCommentDto } from '../../api/dto/create-comment.dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';

export class CreateCommentCommand {
  constructor(public createCommentDto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    @InjectModel(Comment.name) protected CommentModel: CommentModelType,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const { createCommentDto } = command;
    const targetPost = await this.postsRepository.findPostById(
      createCommentDto.postId,
    );

    if (!targetPost) throw new NotFoundException();

    const createdComment = this.CommentModel.createCommentEntity(
      createCommentDto,
      this.CommentModel,
    );

    const savedComment = await this.commentsRepository.saveComment(
      createdComment,
    );

    return String(savedComment._id);
  }
}
