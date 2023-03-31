import { CommentDocument } from '../schemas/comment.schema';
import {
  IBloggerCommentOutputModel,
  ICommentOutputModel,
} from '../api/dto/comments-output-models.dto';
import { PostDocument } from '../../posts/schemas/post.schema';
import { LikesInfoOutputModel } from '../../likes/dto/likes-output-models.dto';

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

export const mapDbCommentToBloggerCommentOutputModel = (
  comment: ICommentOutputModel,
  post: PostDocument,
  likesInfo: LikesInfoOutputModel,
): IBloggerCommentOutputModel => ({
  id: String(comment.id),
  content: comment.content,
  commentatorInfo: {
    userId: String(comment.commentatorInfo.userId),
    userLogin: comment.commentatorInfo.userLogin,
  },
  createdAt: comment.createdAt,
  postInfo: {
    id: String(post._id),
    blogId: String(post.blogId),
    blogName: post.blogName,
    title: post.title,
  },
  likesInfo,
});
