import { LikesInfoOutputModel } from '../../likes/dto/likes-output-models.dto';
import { AllEntitiesOutputModel } from '../../common/types';

interface CommentatorInfo {
  userId: string;
  userLogin: string;
}

export interface CommentOutputModel {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
}

export interface FullCommentOutputModel extends CommentOutputModel {
  likesInfo: LikesInfoOutputModel;
}

export type AllCommentsOutputModel = AllEntitiesOutputModel<CommentOutputModel>;
