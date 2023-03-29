import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../../schemas/comment.schema';
import { CreateCommentDto } from '../../api/dto/create-comment.dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

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
    private usersRepository: UsersRepository,
    @InjectModel(Comment.name) protected CommentModel: CommentModelType,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const { createCommentDto } = command;
    const targetPost = await this.postsRepository.findPostById(
      createCommentDto.postId,
    );
    const targetUser = await this.usersRepository.findUserById(
      createCommentDto.userId,
    );
    if (!targetPost) throw new NotFoundException();

    const isBannedUserForCurrenBlog = Boolean(
      targetUser.bannedForBlogs.find(
        (item) => item.blogId === String(targetPost.blogId),
      ),
    );

    if (isBannedUserForCurrenBlog) throw new ForbiddenException();

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
