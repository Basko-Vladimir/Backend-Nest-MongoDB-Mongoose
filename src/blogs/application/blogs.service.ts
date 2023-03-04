import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../schemas/blog.schema';
import { BlogsQueryParamsDto } from '../dto/blogs-query-params.dto';
import { BlogsRepository } from '../blogs.repository';
import { AllBlogsOutputModel } from '../dto/blogs-output-models.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) protected BlogModel: BlogModelType,
    protected blogsRepository: BlogsRepository,
  ) {}

  async findAllBlogs(query: BlogsQueryParamsDto): Promise<AllBlogsOutputModel> {
    return this.blogsRepository.findAllBlogs(query);
  }

  async findBlogById(blogId: string): Promise<BlogDocument> {
    return this.blogsRepository.findBlogById(blogId);
  }
}
