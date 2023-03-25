import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserBanStatusForBlogDto } from '../../api/dto/update-user-ban-status-for-blog.dto';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';

export class UpdateUserBanStatusForBlogCommand {
  constructor(
    public userId: string,
    public updateUserBanStatusForBlogDto: UpdateUserBanStatusForBlogDto,
  ) {}
}

@CommandHandler(UpdateUserBanStatusForBlogCommand)
export class UpdateUserBanStatusForBlogUseCase
  implements ICommandHandler<UpdateUserBanStatusForBlogCommand>
{
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: UpdateUserBanStatusForBlogCommand): Promise<void> {
    const {
      userId,
      updateUserBanStatusForBlogDto: { blogId, banReason, isBanned },
    } = command;

    const targetBlog = await this.blogRepository.findBlogById(blogId);

    targetBlog.updateUserBanStatus(userId, banReason, isBanned);
    await this.blogRepository.saveBlog(targetBlog);
  }
}
