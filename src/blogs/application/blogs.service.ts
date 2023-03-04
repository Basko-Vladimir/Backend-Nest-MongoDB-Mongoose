import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogDocument, BlogModelType } from '../schemas/blog.schema';
import { BlogsQueryParamsDto } from '../dto/blogs-query-params.dto';
import { BlogsRepository } from '../blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { AllBlogsOutputModel } from '../dto/blogs-output-models.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

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

  async updateBlog(
    blogId: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<void> {
    const targetBlog = await this.findBlogById(blogId);

    if (!targetBlog) throw new NotFoundException();

    // await validateOrRejectInputDto(updateBlogDto, UpdateBlogDto);

    const updatedBlog = targetBlog.updateBlog(updateBlogDto, targetBlog);
    await this.blogsRepository.saveBlog(updatedBlog);
  }
}
