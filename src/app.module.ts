import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { User, userSchema } from './users/schemas/userSchema';
import { Blog, blogSchema } from './blogs/schemas/blog.schema';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { Post, postSchema } from './posts/schemas/post.schema';
import { Like, likeSchema } from './likes/schemas/like.schema';
import { LikesModule } from './likes/likes.module';

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
    UsersModule,
    BlogsModule,
    PostsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
