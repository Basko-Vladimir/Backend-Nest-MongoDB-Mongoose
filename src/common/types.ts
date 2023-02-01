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

export interface IQueryParams {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
}
