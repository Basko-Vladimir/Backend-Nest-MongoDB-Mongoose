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
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { mapDbUserToUserOutputModel } from '../mappers/users-mappers';
import { UsersQueryParamsDto } from './dto/users-query-params.dto';
import {
  AllUsersOutputModel,
  IUserOutputModel,
} from './dto/users-output-models.dto';
import { checkParamIdPipe } from '../../common/pipes/check-param-id-pipe.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/create-user.useCase';
import { DeleteUserCommand } from '../application/use-cases/delete-user.useCase';
import { QueryUsersRepository } from '../infrastructure/query-users.repository';
import { UpdateUserBanStatusDto } from './dto/update-user-ban-status.dto';
import { UpdateUserBanStatusCommand } from '../application/use-cases/update-user-ban-status.useCase';

@Controller('sa/users')
export class UsersController {
  constructor(
    private queryUsersRepository: QueryUsersRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAllUsers(
    @Query() query: UsersQueryParamsDto,
  ): Promise<AllUsersOutputModel> {
    return this.queryUsersRepository.findAllUsers(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserOutputModel> {
    const savedUser = await this.commandBus.execute(
      new CreateUserCommand(createUserDto),
    );

    return mapDbUserToUserOutputModel(savedUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id', checkParamIdPipe) userId: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(userId));
  }

  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async updateUserBanStatus(
    @Param('id', checkParamIdPipe) userId: string,
    @Body() updateUserBanStatusDto: UpdateUserBanStatusDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateUserBanStatusCommand(userId, updateUserBanStatusDto),
    );
  }
}
