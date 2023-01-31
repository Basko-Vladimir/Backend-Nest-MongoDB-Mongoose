import { BlogSortByField, SortDirection } from '../../common/enums';
import { IQueryParams } from '../../common/types';

export class PostsQueryParamsDto implements IQueryParams {
  sortBy: BlogSortByField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
}
