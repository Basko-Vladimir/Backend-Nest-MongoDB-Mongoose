import { DbSortDirection, SortDirection } from './enums';

export interface UpdateOrFilterModel<T = unknown> {
  [key: string]: T;
}

export type SortSetting = UpdateOrFilterModel<DbSortDirection>;

export interface AllEntitiesOutputModel<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export interface ICommonQueryParams {
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
}

export interface IErrorOutputModel {
  message: string;
  field: string;
}
