import { LikesInfoOutputModel } from '../../likes/dto/likes-output-models.dto';
import { AllEntitiesOutputModel } from '../../common/types';

interface CommentatorInfo {
  userId: string;
  userLogin: string;
}

export interface ICommentOutputModel {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
}

export interface FullCommentOutputModel extends ICommentOutputModel {
  likesInfo: LikesInfoOutputModel;
}

export type AllCommentsOutputModel =
  AllEntitiesOutputModel<ICommentOutputModel>;
