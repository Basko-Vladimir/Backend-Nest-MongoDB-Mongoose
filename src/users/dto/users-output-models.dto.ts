import { AllEntitiesOutputModel } from '../../common/types';

export interface IUserOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export type AllUsersOutputModel = AllEntitiesOutputModel<IUserOutputModel>;
