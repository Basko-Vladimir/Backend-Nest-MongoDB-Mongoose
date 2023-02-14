import { BlogDocument } from '../schemas/blog.schema';
import { IBlogOutputModel } from '../dto/blogs-output-models.dto';

export const mapDbBlogToBlogOutputModel = (
  blog: BlogDocument,
): IBlogOutputModel => {
  return {
    id: String(blog._id),
    name: blog.name,
    websiteUrl: blog.websiteUrl,
    description: blog.description,
    isMembership: blog.isMembership,
    createdAt: blog.createdAt.toISOString(),
  };
};
