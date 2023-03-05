import {
  IFullPostOutputModel,
  IPostOutputModel,
} from '../api/dto/posts-output-models.dto';
import { PostDocument } from '../schemas/post.schema';
import { QueryLikesRepository } from '../../likes/infrastructure/query-likes.repository';

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

export const getFullPostOutputModel = async (
  post: IPostOutputModel,
  queryLikesRepository: QueryLikesRepository,
  userId: string = null,
): Promise<IFullPostOutputModel> => {
  const extendedLikesInfo = await queryLikesRepository.getExtendedLikesInfo(
    userId,
    post.id,
  );

  return { ...post, extendedLikesInfo };
};
