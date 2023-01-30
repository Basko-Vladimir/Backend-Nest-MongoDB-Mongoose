import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryParamsDto } from './dto/blogs-query-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from './schemas/blog.schema';
import { BlogSortByField, SortDirection } from '../common/enums';
import { countSkipValue, getFilterByDbId, setSortValue } from '../common/utils';
import { AllBlogsOutputModel } from './dto/blogs-models.dto';
import { mapDbBlogToBlogOutputModel } from './mappers/blogs-mappers';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) protected BlogModel: BlogModelType) {}

  async findAllBlogs(
    queryParams: BlogsQueryParamsDto,
  ): Promise<AllBlogsOutputModel> {
    const {
      sortBy = BlogSortByField.createdAt,
      sortDirection = SortDirection.desc,
      pageNumber = 1,
      pageSize = 10,
      searchNameTerm = '',
    } = queryParams;
    const skip = countSkipValue(pageNumber, pageSize);
    const sortSetting = setSortValue(sortBy, sortDirection);

    const totalCount = await this.BlogModel.countDocuments().where(
      'name',
      new RegExp(searchNameTerm, 'i'),
    );
    const blogs = await this.BlogModel.find({})
      .where('name', new RegExp(searchNameTerm, 'i'))
      .skip(skip)
      .limit(pageSize)
      .sort(sortSetting);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items: blogs.map(mapDbBlogToBlogOutputModel),
    };
  }

  async findBlogById(blogId): Promise<BlogDocument> {
    const targetBlog = await this.BlogModel.findById(blogId);

    if (!targetBlog) throw new NotFoundException();

    return targetBlog;
  }

  async saveBlog(blog: BlogDocument): Promise<BlogDocument> {
    return blog.save();
  }

  async deleteBlog(blogId: string): Promise<void> {
    const { deletedCount } = await this.BlogModel.deleteOne(
      getFilterByDbId(blogId),
    );

    if (!deletedCount) throw new NotFoundException();
  }
}
