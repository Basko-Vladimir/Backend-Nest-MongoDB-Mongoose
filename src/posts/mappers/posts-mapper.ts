import {
  FullPostOutputModel,
  PostOutputModel,
} from '../dto/posts-output-models.dto';
import { PostDocument } from '../schemas/post.schema';
import { ExtendedLikesInfoOutputModel } from '../../likes/dto/likes-output-models.dto';

export const mapDbPostToPostOutputModel = (
  post: PostDocument,
): PostOutputModel => {
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

export const getFullPostOutputModel = (
  post: PostOutputModel,
  extendedLikesInfo: ExtendedLikesInfoOutputModel,
): FullPostOutputModel => ({
  id: post.id,
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
  extendedLikesInfo: extendedLikesInfo,
});
