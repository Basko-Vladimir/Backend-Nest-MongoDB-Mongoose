import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../schemas/blog.schema';
import { CreateBlogDto } from '../../api/dto/create-blog.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogUseCommand {
  constructor(public createBlogDto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogUseCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogUseCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    @InjectModel(Blog.name) protected BlogModel: BlogModelType,
  ) {}

  async execute(command: CreateBlogUseCommand): Promise<string> {
    const createdBlog = this.BlogModel.createBlogEntity(
      command.createBlogDto,
      this.BlogModel,
    );
    const savedBlog = await this.blogsRepository.saveBlog(createdBlog);

    return String(savedBlog._id);
  }
}
