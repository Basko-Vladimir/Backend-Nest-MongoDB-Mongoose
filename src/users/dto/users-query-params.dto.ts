import { SortDirection, UserSortByField } from '../../common/enums';
import { IQueryParams } from '../../common/types';

export class UsersQueryParamsDto implements IQueryParams {
  sortBy: UserSortByField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
}
