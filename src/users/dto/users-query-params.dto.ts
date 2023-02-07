import { SortDirection, UserSortByField } from '../../common/enums';
import { ICommonQueryParams } from '../../common/types';

export class UsersQueryParamsDto implements ICommonQueryParams {
  sortBy: UserSortByField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
}
