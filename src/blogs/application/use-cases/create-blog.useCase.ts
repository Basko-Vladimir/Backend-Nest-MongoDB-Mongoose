import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../../schemas/blog.schema';
import { CreateBlogDto } from '../../dto/create-blog.dto';
import { BlogsRepository } from '../../blogs.repository';

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

  execute(command: CreateBlogUseCommand): Promise<BlogDocument> {
    const createdBlog = this.BlogModel.createBlogEntity(
      command.createBlogDto,
      this.BlogModel,
    );

    return this.blogsRepository.saveBlog(createdBlog);
  }
}
