import {
  Controller,
  Param,
  Body,
  HttpCode,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { mapDbUserToUserOutputModel } from './mappers/users-mappers';
import { UsersQueryParamsDto } from './dto/users-query-params.dto';
import {
  AllUsersOutputModel,
  IUserOutputModel,
} from './dto/users-output-models.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAllUsers(
    @Query() query: UsersQueryParamsDto,
  ): Promise<AllUsersOutputModel> {
    return this.usersService.findAllUsers(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserOutputModel> {
    const savedUser = await this.usersService.createUser(createUserDto);

    return mapDbUserToUserOutputModel(savedUser);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id', ParseObjectIdPipe) userId: string,
  ): Promise<void> {
    await this.usersService.deleteUser(userId);
  }
}
