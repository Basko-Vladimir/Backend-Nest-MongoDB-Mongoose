import {
  FullPostOutputModel,
  PostOutputModel,
} from '../dto/posts-output-models.dto';
import { Post, PostDocument } from '../schemas/post.schema';
import { LikesService } from '../../likes/likes.service';

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

export const getFullPostOutputModel = async (
  post: PostDocument | PostOutputModel,
  likesService: LikesService,
  userId: string = null,
): Promise<FullPostOutputModel> => {
  let postOutputModel: PostOutputModel;

  if (post instanceof Post) {
    postOutputModel = mapDbPostToPostOutputModel(post);
  } else {
    postOutputModel = post;
  }

  const extendedLikesInfo = await likesService.getExtendedLikesInfo(
    userId,
    post.id,
  );

  return {
    ...postOutputModel,
    extendedLikesInfo: extendedLikesInfo,
  };
};
