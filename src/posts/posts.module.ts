import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { Post, postSchema } from './schemas/post.schema';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blog, blogSchema } from '../blogs/schemas/blog.schema';
import { Like, likeSchema } from '../likes/schemas/like.schema';
import { LikesService } from '../likes/likes.service';
import { LikesRepository } from '../likes/likes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: postSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: blogSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: likeSchema }]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    LikesService,
    PostsRepository,
    BlogsRepository,
    LikesRepository,
  ],
})
export class PostsModule {}
