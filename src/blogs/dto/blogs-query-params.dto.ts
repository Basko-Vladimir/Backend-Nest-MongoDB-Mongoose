import { SortDirection, BlogSortByField } from '../../common/enums';

export class BlogsQueryParamsDto {
  sortBy: BlogSortByField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchNameTerm: string;
}
