import { BlogDocument } from '../schemas/blog.schema';
import {
  IBlogForAdminOutputModel,
  IBlogOutputModel,
} from '../api/dto/blogs-output-models.dto';

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

export const mapDbBlogToBlogForAdminOutputModel = (
  blog: BlogDocument,
): IBlogForAdminOutputModel => {
  let blogOwnerInfo = null;

  if (blog.blogOwnerInfo) {
    blogOwnerInfo = {
      userId: String(blog.blogOwnerInfo.ownerId),
      userLogin: blog.blogOwnerInfo.ownerLogin,
    };
  }

  return {
    id: String(blog._id),
    name: blog.name,
    websiteUrl: blog.websiteUrl,
    description: blog.description,
    isMembership: blog.isMembership,
    createdAt: blog.createdAt.toISOString(),
    blogOwnerInfo,
  };
};
