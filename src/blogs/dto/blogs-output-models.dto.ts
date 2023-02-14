import { AllEntitiesOutputModel } from '../../common/types';
import { IPostOutputModel } from '../../posts/dto/posts-output-models.dto';

export interface IBlogOutputModel {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  isMembership: boolean;
  createdAt: string;
}

export type AllBlogsOutputModel = AllEntitiesOutputModel<IBlogOutputModel>;
export type BlogAllFullPostsOutputModel =
  AllEntitiesOutputModel<IPostOutputModel>;
