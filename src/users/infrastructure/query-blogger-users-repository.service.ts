import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AllBannedUsersForSpecificBlogOutputModel } from '../api/dto/banned-users-for-specific-blog-output-model.dto';
import { BannedUsersForSpecificBlogQueryParamsDto } from '../api/dto/banned-users-for-specific-blog-query-params.dto';
import { mapDbUserToBannedUserForSpecificBlogOutputModel } from '../mappers/users-mappers';
import { User, UserModelType } from '../schemas/user.schema';
import { SortDirection, UserSortByField } from '../../common/enums';
import { countSkipValue, setSortValue } from '../../common/utils';
import { UpdateOrFilterModel } from '../../common/types';
import { Blog } from '../../blogs/schemas/blog.schema';

@Injectable()
export class QueryBloggerUsersRepositoryService {
  constructor(
    @InjectModel(User.name) protected UserModel: UserModelType,
    @InjectModel(Blog.name) protected BlogModel: UserModelType,
  ) {}

  async findAllBannedUsersForSpecificBlog(
    blogId: string,
    queryParams: BannedUsersForSpecificBlogQueryParamsDto,
  ): Promise<AllBannedUsersForSpecificBlogOutputModel> {
    const targetBlog = await this.BlogModel.findById(blogId);

    if (targetBlog) throw new NotFoundException();

    const {
      sortBy = UserSortByField.createdAt,
      sortDirection = SortDirection.desc,
      pageNumber = 1,
      pageSize = 10,
      searchLoginTerm = '',
    } = queryParams;

    const skip = countSkipValue(pageNumber, pageSize);
    const sortSetting = setSortValue(sortBy, sortDirection);
    const filter: { $and: UpdateOrFilterModel[] } = {
      $and: [{ bannedForBlogs: { $elemMatch: { blogId, isBanned: true } } }],
    };

    if (searchLoginTerm) {
      filter.$and.push({ login: new RegExp(searchLoginTerm, 'i') });
    }

    const usersTotalCount = await this.UserModel.countDocuments(filter);
    const users = await this.UserModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sortSetting);

    return {
      pagesCount: Math.ceil(usersTotalCount / pageSize),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: usersTotalCount,
      items: users.map((user) =>
        mapDbUserToBannedUserForSpecificBlogOutputModel(user, blogId),
      ),
    };
  }
}
