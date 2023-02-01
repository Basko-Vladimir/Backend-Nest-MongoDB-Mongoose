import { SortDirection, BlogSortByField } from '../../common/enums';
import { IQueryParams } from '../../common/types';

export class BlogsQueryParamsDto implements IQueryParams {
  sortBy: BlogSortByField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchNameTerm: string;
}
