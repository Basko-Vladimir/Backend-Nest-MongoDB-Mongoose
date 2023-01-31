import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { Post, postSchema } from './schemas/post.schema';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blog, blogSchema } from '../blogs/schemas/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: postSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: blogSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, BlogsRepository],
})
export class PostsModule {}
