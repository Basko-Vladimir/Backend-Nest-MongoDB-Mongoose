import {
  Controller,
  Param,
  Body,
  HttpCode,
  Delete,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { mapDbUserToUserOutputModel } from './mappers/users-mappers';
import { UserQueryParamsDto } from './dto/user-query-params.dto';
import { AllUsersOutputModel, IUserOutputModel } from './dto/users-models.dto';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  async findAllUsers(
    @Query() query: UserQueryParamsDto,
  ): Promise<AllUsersOutputModel> {
    return this.usersService.findAllUsers(query);
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserOutputModel> {
    const savedUser = await this.usersService.createUser(createUserDto);

    return mapDbUserToUserOutputModel(savedUser);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.usersService.deleteUser(userId);
  }
}
