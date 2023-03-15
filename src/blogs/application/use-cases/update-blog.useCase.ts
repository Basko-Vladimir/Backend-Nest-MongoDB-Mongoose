import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateBlogDto } from '../../api/dto/update-blog.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { Blog, BlogModelType } from '../../schemas/blog.schema';

export class UpdateBlogCommand {
  constructor(public blogId: string, public updateBlogDto: UpdateBlogDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    @InjectModel(Blog.name) protected BlogModel: BlogModelType,
  ) {}

  async execute(command: UpdateBlogCommand): Promise<void> {
    const targetBlog = await this.blogsRepository.findBlogById(command.blogId);

    targetBlog.updateBlog(command.updateBlogDto);
    await this.blogsRepository.saveBlog(targetBlog);
  }
}
