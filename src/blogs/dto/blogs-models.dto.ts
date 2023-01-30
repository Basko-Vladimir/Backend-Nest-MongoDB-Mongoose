import { AllEntitiesOutputModel } from '../../common/types';

export interface IBlogOutputModel {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  createdAt: string;
}

export type AllBlogsOutputModel = AllEntitiesOutputModel<IBlogOutputModel>;
