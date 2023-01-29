import { Types } from 'mongoose';
import { DbSortDirection, SortDirection } from './enums';
import { SortSetting } from './types';

export const getFilterByDbId = (id: string): { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(id),
});

export const countSkipValue = (
  pageNumber: number,
  pageSize: number,
): number => {
  return (pageNumber - 1) * pageSize;
};

export const setSortValue = (
  sortBy: string,
  sortDirection: SortDirection,
): SortSetting => {
  return {
    [sortBy]:
      sortDirection === SortDirection.asc
        ? DbSortDirection.ASC
        : DbSortDirection.DESC,
  };
};
