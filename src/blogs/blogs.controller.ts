import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsQueryParamsDto } from './dto/blogs-query-params.dto';
import { AllBlogsOutputModel, IBlogOutputModel } from './dto/blogs-models.dto';
import { mapDbBlogToBlogOutputModel } from './mappers/blogs-mappers';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}

  @Get()
  async findAllBlogs(
    @Query() query: BlogsQueryParamsDto,
  ): Promise<AllBlogsOutputModel> {
    return this.blogsService.findAllBlogs(query);
  }

  @Get(':id')
  async findBlogById(@Param('id') blogId: string): Promise<IBlogOutputModel> {
    const targetBlog = await this.blogsService.findBlogById(blogId);
    return mapDbBlogToBlogOutputModel(targetBlog);
  }

  @Post()
  async createBlog(@Body() body: CreateBlogDto): Promise<IBlogOutputModel> {
    const createdBlog = await this.blogsService.createBlog(body);

    return mapDbBlogToBlogOutputModel(createdBlog);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogId: string): Promise<void> {
    return this.blogsService.deleteBlog(blogId);
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() body: UpdateBlogDto,
  ): Promise<void> {
    return this.blogsService.updateBlog(blogId, body);
  }
}
