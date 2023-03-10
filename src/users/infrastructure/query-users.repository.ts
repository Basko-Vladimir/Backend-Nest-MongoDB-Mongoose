import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../schemas/user.schema';
import { countSkipValue, setBanFilter, setSortValue } from '../../common/utils';
import { UsersQueryParamsDto } from '../api/dto/users-query-params.dto';
import { mapDbUserToUserOutputModel } from '../mappers/users-mappers';
import {
  AllUsersOutputModel,
  IUserOutputModel,
} from '../api/dto/users-output-models.dto';
import { BanStatus, SortDirection, UserSortByField } from '../../common/enums';

@Injectable()
export class QueryUsersRepository {
  constructor(@InjectModel(User.name) protected UserModel: UserModelType) {}

  async findAllUsers(
    queryParams: UsersQueryParamsDto,
  ): Promise<AllUsersOutputModel> {
    const {
      sortBy = UserSortByField.createdAt,
      sortDirection = SortDirection.desc,
      pageNumber = 1,
      pageSize = 10,
      searchEmailTerm = '',
      searchLoginTerm = '',
      banStatus = BanStatus.ALL,
    } = queryParams;
    const skip = countSkipValue(pageNumber, pageSize);
    const sortSetting = setSortValue(sortBy, sortDirection);
    const filterItems: object[] = [setBanFilter(banStatus)];

    if (searchLoginTerm) {
      filterItems.push({ login: new RegExp(searchLoginTerm, 'i') });
    }
    if (searchEmailTerm) {
      filterItems.push({ email: new RegExp(searchEmailTerm, 'i') });
    }

    const filter = { $or: filterItems };
    const totalCount = await this.UserModel.find(filter).countDocuments();
    const users = await this.UserModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sortSetting);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items: users.map(mapDbUserToUserOutputModel),
    };
  }

  async findUserById(userId: string): Promise<IUserOutputModel> {
    const targetUser = await this.UserModel.findById(userId);

    if (!targetUser) throw new NotFoundException();

    return mapDbUserToUserOutputModel(targetUser);
  }
}
