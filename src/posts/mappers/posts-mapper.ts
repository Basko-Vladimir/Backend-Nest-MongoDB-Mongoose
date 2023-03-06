import { IPostOutputModel } from '../api/dto/posts-output-models.dto';
import { PostDocument } from '../schemas/post.schema';

export const mapDbPostToPostOutputModel = (
  post: PostDocument,
): IPostOutputModel => {
  return {
    id: String(post._id),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: String(post.blogId),
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
  };
};
