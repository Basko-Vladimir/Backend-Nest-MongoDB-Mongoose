import { AllEntitiesOutputModel } from '../../common/types';

export interface PostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export type AllPostOutputModel = AllEntitiesOutputModel<PostOutputModel>;
