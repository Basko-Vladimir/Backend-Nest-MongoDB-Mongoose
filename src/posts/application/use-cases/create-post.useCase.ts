import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post, PostModelType } from '../../schemas/post.schema';
import { CreatePostDto } from '../../api/dto/create-post.dto';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(public createPostDto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const { blogId } = command.createPostDto;
    const targetBlog = await this.blogsRepository.findBlogById(blogId);

    if (!targetBlog) throw new NotFoundException();

    const createdPost = await this.PostModel.createPostEntity(
      command.createPostDto,
      targetBlog.name,
      this.PostModel,
    );
    const savedPost = await this.postsRepository.savePost(createdPost);
    return String(savedPost._id);
  }
}
