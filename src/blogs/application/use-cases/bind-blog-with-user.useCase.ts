import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogDocument } from '../../schemas/blog.schema';
import { UserDocument } from '../../../users/schemas/user.schema';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class BindBlogWithUserCommand {
  constructor(public blog: BlogDocument, public user: UserDocument) {}
}

@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserUseCase
  implements ICommandHandler<BindBlogWithUserCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: BindBlogWithUserCommand): Promise<void> {
    const { blog, user } = command;

    blog.bindBlogWithUser(user);
    await this.blogsRepository.saveBlog(blog);
  }
}
