import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, userSchema } from './users/schemas/user.schema';
import { Blog, blogSchema } from './blogs/schemas/blog.schema';
import { Post, postSchema } from './posts/schemas/post.schema';
import { Like, likeSchema } from './likes/schemas/like.schema';
import { Comment, commentSchema } from './comments/schemas/comment.schema';
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
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsRepository } from './comments/comments.repository';
import { JwtService } from './auth/jwt.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { EmailManager } from './common/managers/email.manager';
import { EmailAdapter } from './common/adapters/email.adapter';
import { IsExistEntityValidator } from './common/validators/is-exist-entity.validator';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: blogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: postSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: likeSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: commentSchema }]),
  ],
  controllers: [
    AppController,
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
    AuthController,
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
    CommentsService,
    CommentsRepository,
    AuthService,
    JwtService,
    EmailManager,
    EmailAdapter,
    IsExistEntityValidator,
  ],
})
export class AppModule {}
