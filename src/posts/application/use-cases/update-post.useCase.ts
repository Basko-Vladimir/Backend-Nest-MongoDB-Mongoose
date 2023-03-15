import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../api/dto/update-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostCommand {
  constructor(public postId: string, public updatePostDto: UpdatePostDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const { updatePostDto, postId } = command;
    const targetPost = await this.postsRepository.findPostById(postId);

    targetPost.updatePost(updatePostDto);
    await this.postsRepository.savePost(targetPost);
  }
}
