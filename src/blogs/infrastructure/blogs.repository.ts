import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../schemas/blog.schema';
import { getFilterByDbId } from '../../common/utils';
import { UpdateOrFilterModel } from '../../common/types';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) protected BlogModel: BlogModelType) {}

  async findBlogById(blogId): Promise<BlogDocument> {
    const targetBlog = await this.BlogModel.findById(blogId);

    if (!targetBlog) throw new NotFoundException();

    return targetBlog;
  }

  async findManyBlogsByFilter(
    filter: UpdateOrFilterModel,
  ): Promise<BlogDocument[]> {
    return this.BlogModel.find(filter);
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
