import { AllEntitiesOutputModel } from '../../common/types';
import { PostOutputModel } from '../../posts/dto/posts-output-models.dto';

export interface IBlogOutputModel {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  createdAt: string;
}

export type AllBlogsOutputModel = AllEntitiesOutputModel<IBlogOutputModel>;
export type BlogAllPostsOutputModel = AllEntitiesOutputModel<PostOutputModel>;
