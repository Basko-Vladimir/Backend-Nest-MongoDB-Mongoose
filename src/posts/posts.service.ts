import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from './posts.repository';
import { Post, PostDocument, PostModelType } from './schemas/post.schema';
import { PostsQueryParamsDto } from './dto/posts-query-params.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AllPostOutputModel } from './dto/posts-output-models.dto';
import { BlogsRepository } from '../blogs/blogs.repository';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
    @InjectModel(Post.name) protected PostModel: PostModelType,
  ) {}

  async findAllPosts(
    queryParams: PostsQueryParamsDto,
  ): Promise<AllPostOutputModel> {
    return this.postsRepository.findAllPosts(queryParams);
  }

  async findPostById(id: string): Promise<PostDocument> {
    return this.postsRepository.findPostById(id);
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
    const targetBlog = await this.blogsRepository.findBlogById(
      createPostDto.blogId,
    );

    if (!targetBlog) throw new NotFoundException();

    const createdPost = await this.PostModel.createPostEntity(
      createPostDto,
      targetBlog.name,
      this.PostModel,
    );
    return this.postsRepository.savePost(createdPost);
  }

  async deletePost(id: string): Promise<void> {
    return this.postsRepository.deletePost(id);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<void> {
    const targetPost = await this.findPostById(id);
    const updatedPost = targetPost.updatePost(updatePostDto, targetPost);
    await this.postsRepository.savePost(updatedPost);
  }
}
