import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { User, userSchema } from './users/schemas/userSchema';
import { Blog, blogSchema } from './blogs/schemas/blog.schema';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Vladimir:BaVlaG_192115@cluster0.nqlqdla.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'Backend-Nest' },
    ),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: blogSchema }]),
    UsersModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
