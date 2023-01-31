import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './users/schemas/userSchema';
import { Blog, blogSchema } from './blogs/schemas/blog.schema';
import { Post, postSchema } from './posts/schemas/post.schema';
import { Like, likeSchema } from './likes/schemas/like.schema';
import { BlogsController } from './blogs/blogs.controller';
import { PostsController } from './posts/posts.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { BlogsService } from './blogs/blogs.service';
import { PostsService } from './posts/posts.service';
import { LikesService } from './likes/likes.service';
import { UsersRepository } from './users/users.repository';
import { BlogsRepository } from './blogs/blogs.repository';
import { PostsRepository } from './posts/posts.repository';
import { LikesRepository } from './likes/likes.repository';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Vladimir:BaVlaG_192115@cluster0.nqlqdla.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'Backend-Nest' },
    ),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: blogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: postSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: likeSchema }]),
  ],
  controllers: [
    AppController,
    UsersController,
    BlogsController,
    PostsController,
  ],
  providers: [
    AppService,
    UsersService,
    UsersRepository,
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    LikesService,
    LikesRepository,
  ],
})
export class AppModule {}
