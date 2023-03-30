import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserBanStatusForBlogDto } from '../../api/dto/update-user-ban-status-for-blog.dto';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserDocument } from '../../schemas/user.schema';

export class UpdateUserBanStatusForBlogCommand {
  constructor(
    public userId: string,
    public updateUserBanStatusForBlogDto: UpdateUserBanStatusForBlogDto,
    public user: UserDocument,
  ) {}
}

@CommandHandler(UpdateUserBanStatusForBlogCommand)
export class UpdateUserBanStatusForBlogUseCase
  implements ICommandHandler<UpdateUserBanStatusForBlogCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: UpdateUserBanStatusForBlogCommand): Promise<void> {
    const {
      userId,
      updateUserBanStatusForBlogDto: { blogId, banReason, isBanned },
      user,
    } = command;

    const targetUser = await this.usersRepository.findUserById(userId);

    if (!targetUser) throw new NotFoundException();

    const targetBlog = await this.blogsRepository.findBlogById(blogId);

    if (targetBlog.blogOwnerInfo.ownerId !== String(user._id)) {
      throw new ForbiddenException();
    }

    targetUser.updateUserBanStatusForSpecificBlog(blogId, banReason, isBanned);
    await this.usersRepository.saveUser(targetUser);
  }
}
