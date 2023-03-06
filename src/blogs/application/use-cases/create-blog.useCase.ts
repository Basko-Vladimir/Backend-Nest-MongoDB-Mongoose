import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../schemas/blog.schema';
import { CreateBlogDto } from '../../api/dto/create-blog.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { UserDocument } from '../../../users/schemas/user.schema';

export class CreateBlogCommand {
  constructor(public createBlogDto: CreateBlogDto, public user: UserDocument) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    @InjectModel(Blog.name) protected BlogModel: BlogModelType,
  ) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const { createBlogDto, user } = command;
    const createdBlog = this.BlogModel.createBlogEntity(
      createBlogDto,
      this.BlogModel,
      user,
    );
    const savedBlog = await this.blogsRepository.saveBlog(createdBlog);

    return String(savedBlog._id);
  }
}
