import { CommentDocument } from '../schemas/comment.schema';
import {
  ICommentOutputModel,
  FullCommentOutputModel,
} from '../dto/comments-output-models.dto';
import { LikesService } from '../../likes/likes.service';

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
  likesService: LikesService,
  userId: string = null,
): Promise<FullCommentOutputModel> => {
  const likesInfo = await likesService.getLikesInfo(userId, comment.id);

  return { ...comment, likesInfo };
};
