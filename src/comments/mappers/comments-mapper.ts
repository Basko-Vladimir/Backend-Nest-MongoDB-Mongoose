import { CommentDocument } from '../schemas/comment.schema';
import {
  IBloggerCommentOutputModel,
  ICommentOutputModel,
} from '../api/dto/comments-output-models.dto';
import { PostDocument } from '../../posts/schemas/post.schema';

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
  comment: CommentDocument,
  post: PostDocument,
): IBloggerCommentOutputModel => {
  return {
    id: String(comment._id),
    content: comment.content,
    commentatorInfo: {
      userId: String(comment.userId),
      userLogin: comment.userLogin,
    },
    createdAt: comment.createdAt.toISOString(),
    postInfo: {
      id: String(post._id),
      blogId: String(post.blogId),
      blogName: post.blogName,
      title: post.title,
    },
  };
};
