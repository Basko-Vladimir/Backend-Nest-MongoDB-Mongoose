import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from './posts.repository';
import { Post, PostDocument, PostModelType } from './schemas/post.schema';
import { PostsQueryParamsDto } from './dto/posts-query-params.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AllPostsOutputModel } from './dto/posts-output-models.dto';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { validateOrRejectInputDto } from '../common/utils';
import { LikesService } from '../likes/likes.service';
import { UserDocument } from '../users/schemas/user.schema';
import { LikeStatus } from '../common/enums';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
    protected likesService: LikesService,
    @InjectModel(Post.name) protected PostModel: PostModelType,
  ) {}

  async findPosts(
    queryParams: PostsQueryParamsDto,
    blogId?: string,
  ): Promise<AllPostsOutputModel> {
    return this.postsRepository.findPosts(queryParams, blogId);
  }

  async findPostById(id: string): Promise<PostDocument> {
    return this.postsRepository.findPostById(id);
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
    // await validateOrRejectInputDto(createPostDto, CreatePostDto);

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

    if (!targetPost) throw new NotFoundException();

    // await validateOrRejectInputDto(updatePostDto, UpdatePostDto);

    const updatedPost = targetPost.updatePost(updatePostDto, targetPost);
    await this.postsRepository.savePost(updatedPost);
  }

  async updatePostLikeStatus(
    user: UserDocument,
    postId: string,
    newStatus: LikeStatus,
  ): Promise<void> {
    const existingLike = await this.likesService.getLikeByFilter({
      userId: String(user._id),
      postId,
      commentId: null,
    });

    if (existingLike) {
      return this.likesService.updateLike(existingLike, newStatus);
    } else {
      await this.likesService.createLike(user, postId, newStatus);
    }
  }
}
