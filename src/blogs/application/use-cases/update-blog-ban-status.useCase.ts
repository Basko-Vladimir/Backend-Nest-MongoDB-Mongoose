import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class UpdateBlogBanStatusCommand {
  constructor(public blogId: string, public isBanned: boolean) {}
}

@CommandHandler(UpdateBlogBanStatusCommand)
export class UpdateBlogBanStatusUseCase
  implements ICommandHandler<UpdateBlogBanStatusCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogBanStatusCommand): Promise<void> {
    const { isBanned, blogId } = command;

    const targetBlog = await this.blogsRepository.findBlogById(blogId);

    targetBlog.updateBlogBanStatus(isBanned);
    await this.blogsRepository.saveBlog(targetBlog);
  }
}
