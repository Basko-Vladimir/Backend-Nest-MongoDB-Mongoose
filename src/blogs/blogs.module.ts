import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, blogSchema } from './schemas/blog.schema';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsController } from './blogs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: blogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
})
export class BlogsModule {}
