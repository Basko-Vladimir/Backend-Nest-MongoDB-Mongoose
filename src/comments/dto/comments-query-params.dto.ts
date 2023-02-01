import { BlogSortByField, SortDirection } from '../../common/enums';
import { IQueryParams } from '../../common/types';

export class CommentsQueryParamsDto implements IQueryParams {
  sortBy: BlogSortByField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
}
