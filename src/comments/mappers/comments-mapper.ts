import { CommentDocument } from '../schemas/comment.schema';
import {
  ICommentOutputModel,
  IFullCommentOutputModel,
} from '../api/dto/comments-output-models.dto';
import { QueryLikesRepository } from '../../likes/infrastructure/query-likes.repository';

export const mapDbCommentToCommentOutputModel = (
  comment: CommentDocument,
): ICommentOutputModel => {
  return {
    id: String(comment._id),
    content: comment.content,
    commentatorInfo: {
      userId: String(comment.userId),
      userLogin: comment.userLogin,
    },
    createdAt: comment.createdAt.toISOString(),
  };
};

export const getFullCommentOutputModel = async (
  comment: ICommentOutputModel,
  queryLikesRepository: QueryLikesRepository,
  userId: string = null,
): Promise<IFullCommentOutputModel> => {
  const likesInfo = await queryLikesRepository.getLikesInfo(userId, comment.id);

  return { ...comment, likesInfo };
};
