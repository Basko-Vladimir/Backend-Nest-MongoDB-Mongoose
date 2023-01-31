import { PostOutputModel } from '../dto/posts-output-models.dto';

//TODO add post type
export const mapDbPostToPostOutputModel = (post): PostOutputModel => {
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
