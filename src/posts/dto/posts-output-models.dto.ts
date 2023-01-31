import { AllEntitiesOutputModel } from '../../common/types';
import { ExtendedLikesInfoOutputModel } from '../../likes/dto/likes-output-models.dto';

export interface PostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export interface FullPostOutputModel extends PostOutputModel {
  extendedLikesInfo: ExtendedLikesInfoOutputModel;
}

export type AllPostOutputModel = AllEntitiesOutputModel<PostOutputModel>;
