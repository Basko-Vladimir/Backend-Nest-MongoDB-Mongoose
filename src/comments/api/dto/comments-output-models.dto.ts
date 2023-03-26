import { LikesInfoOutputModel } from '../../../likes/dto/likes-output-models.dto';
import { AllEntitiesOutputModel } from '../../../common/types';

interface ICommentatorInfo {
  userId: string;
  userLogin: string;
}

interface IPostInfo {
  id: string;
  title: string;
  blogId: string;
  blogName: string;
}

export interface ICommentOutputModel {
  id: string;
  content: string;
  commentatorInfo: ICommentatorInfo;
  createdAt: string;
}

export interface IFullCommentOutputModel extends ICommentOutputModel {
  likesInfo: LikesInfoOutputModel;
}

export interface IBloggerCommentOutputModel extends ICommentOutputModel {
  postInfo: IPostInfo;
}

export type AllCommentsOutputModel =
  AllEntitiesOutputModel<ICommentOutputModel>;

export type AllBloggerCommentsOutputModel =
  AllEntitiesOutputModel<IBloggerCommentOutputModel>;
